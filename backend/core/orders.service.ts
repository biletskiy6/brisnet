/**
 * Orders Service
 * Business logic for order creation and management
 */

import { PrismaClient, Prisma } from '@prisma/client';

const prisma = new PrismaClient();

export class OrdersService {
  /**
   * Create a new order from cart
   */
  async createOrder(
    userId: string,
    items: Array<{
      productId: string;
      product: any;
      paymentMethod: 'cash' | 'credits';
    }>,
    cashTotal: number,
    creditsTotal: number
  ) {
    return prisma.order.create({
      data: {
        userId,
        status: 'pending',
        cashTotal,
        creditsTotal,
        orderItems: {
          create: items.map((item) => ({
            productId: item.productId,
            productSnapshot: item.product as Prisma.JsonObject,
            paymentMethod: item.paymentMethod,
            price: item.paymentMethod === 'cash' ? item.product.cashPrice : null,
            creditPrice: item.paymentMethod === 'credits' ? item.product.creditPrice : null,
          })),
        },
      },
      include: {
        orderItems: true,
      },
    });
  }

  /**
   * Get order by ID
   */
  async getOrder(orderId: string) {
    return prisma.order.findUnique({
      where: { id: orderId },
      include: {
        orderItems: true,
        user: {
          select: {
            id: true,
            email: true,
            name: true,
          },
        },
      },
    });
  }

  /**
   * Get user's orders
   */
  async getUserOrders(userId: string, limit: number = 50) {
    return prisma.order.findMany({
      where: { userId },
      include: {
        orderItems: true,
      },
      orderBy: { createdAt: 'desc' },
      take: limit,
    });
  }

  /**
   * Update order status
   */
  async updateOrderStatus(
    orderId: string,
    status: 'pending' | 'completed' | 'failed' | 'refunded',
    paymentTransactionId?: string
  ) {
    const data: Prisma.OrderUpdateInput = {
      status,
    };

    if (status === 'completed') {
      data.completedAt = new Date();
    }

    if (paymentTransactionId) {
      data.elavonTransactionId = paymentTransactionId;
    }

    return prisma.order.update({
      where: { id: orderId },
      data,
    });
  }

  /**
   * Grant access to purchased products
   */
  async grantProductAccess(userId: string, orderId: string) {
    const order = await this.getOrder(orderId);

    if (!order) {
      throw new Error('Order not found');
    }

    const accessGrants = order.orderItems.map((item) =>
      prisma.productAccess.create({
        data: {
          userId,
          productId: item.productId,
          accessType: 'purchase',
          grantedAt: new Date(),
          expiresAt: null, // Permanent access for purchased products
        },
      })
    );

    return Promise.all(accessGrants);
  }

  /**
   * Check if user has access to a product
   */
  async hasAccess(userId: string, productId: string): Promise<boolean> {
    const access = await prisma.productAccess.findUnique({
      where: {
        userId_productId: {
          userId,
          productId,
        },
      },
    });

    if (!access) return false;

    // Check if access has expired
    if (access.expiresAt && access.expiresAt < new Date()) {
      return false;
    }

    return true;
  }

  /**
   * Get user's accessible products
   */
  async getUserAccessibleProducts(userId: string) {
    const now = new Date();

    return prisma.productAccess.findMany({
      where: {
        userId,
        OR: [
          { expiresAt: null },
          { expiresAt: { gt: now } },
        ],
      },
      include: {
        product: true,
      },
    });
  }

  /**
   * Increment download count
   */
  async incrementDownloadCount(userId: string, productId: string) {
    return prisma.productAccess.update({
      where: {
        userId_productId: {
          userId,
          productId,
        },
      },
      data: {
        downloadCount: {
          increment: 1,
        },
      },
    });
  }
}

export const ordersService = new OrdersService();
