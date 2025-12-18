/**
 * Credits Service
 * Business logic for credit ledger and balance management
 */

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export type TransactionType = 'purchase' | 'spend' | 'refund' | 'bonus' | 'expiration';

export class CreditsService {
  /**
   * Get user's current credit balance
   */
  async getBalance(userId: string): Promise<number> {
    const latestTransaction = await prisma.creditTransaction.findFirst({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    });

    return latestTransaction?.balanceAfter || 0;
  }

  /**
   * Get credits that are expiring soon
   */
  async getExpiringCredits(userId: string, daysAhead: number = 30) {
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() + daysAhead);

    const transactions = await prisma.creditTransaction.findMany({
      where: {
        userId,
        expiresAt: {
          lte: cutoffDate,
          gte: new Date(),
        },
        amount: {
          gt: 0, // Only credit transactions
        },
      },
      orderBy: { expiresAt: 'asc' },
    });

    return transactions.map((t) => ({
      amount: t.amount,
      expiresAt: t.expiresAt!,
    }));
  }

  /**
   * Add credits to user's balance
   */
  async addCredits(
    userId: string,
    amount: number,
    type: TransactionType,
    referenceId?: string,
    expiresAt?: Date
  ) {
    const currentBalance = await this.getBalance(userId);
    const newBalance = currentBalance + amount;

    return prisma.creditTransaction.create({
      data: {
        userId,
        amount,
        balanceAfter: newBalance,
        transactionType: type,
        referenceId,
        expiresAt,
      },
    });
  }

  /**
   * Deduct credits from user's balance
   */
  async deductCredits(
    userId: string,
    amount: number,
    type: TransactionType,
    referenceId?: string
  ) {
    const currentBalance = await this.getBalance(userId);

    if (currentBalance < amount) {
      throw new Error(`Insufficient credits. Balance: ${currentBalance}, Required: ${amount}`);
    }

    const newBalance = currentBalance - amount;

    return prisma.creditTransaction.create({
      data: {
        userId,
        amount: -amount, // Negative for debit
        balanceAfter: newBalance,
        transactionType: type,
        referenceId,
      },
    });
  }

  /**
   * Get user's credit transaction history
   */
  async getTransactionHistory(userId: string, limit: number = 50) {
    return prisma.creditTransaction.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      take: limit,
    });
  }

  /**
   * Process credit expiration (called by cron job)
   */
  async processExpirations() {
    const now = new Date();

    // Find all expired credit transactions
    const expiredTransactions = await prisma.creditTransaction.findMany({
      where: {
        expiresAt: {
          lte: now,
        },
        amount: {
          gt: 0, // Only credit transactions
        },
      },
    });

    const results = [];

    for (const transaction of expiredTransactions) {
      // Create expiration transaction
      const currentBalance = await this.getBalance(transaction.userId);
      const newBalance = currentBalance - transaction.amount;

      const expiration = await prisma.creditTransaction.create({
        data: {
          userId: transaction.userId,
          amount: -transaction.amount,
          balanceAfter: newBalance,
          transactionType: 'expiration',
          referenceId: transaction.id,
        },
      });

      results.push(expiration);
    }

    return results;
  }

  /**
   * Purchase credits with cash
   */
  async purchaseCredits(
    userId: string,
    amount: number,
    paymentTransactionId: string,
    expiresInDays?: number
  ) {
    let expiresAt: Date | undefined;

    if (expiresInDays) {
      expiresAt = new Date();
      expiresAt.setDate(expiresAt.getDate() + expiresInDays);
    }

    return this.addCredits(
      userId,
      amount,
      'purchase',
      paymentTransactionId,
      expiresAt
    );
  }
}

export const creditsService = new CreditsService();
