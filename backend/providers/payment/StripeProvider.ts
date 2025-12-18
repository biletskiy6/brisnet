/**
 * Stripe Payment Provider (MOCK Implementation)
 *
 * In production, this would integrate with Stripe API:
 * - Payment Intents API
 * - Subscriptions API
 * - Tokenization
 */

import type {
  IPaymentProvider,
  PaymentIntent,
  PaymentResult,
  CardToken,
  CardInput,
  ChargeResult,
  SubscriptionResult,
} from './IPaymentProvider.js';

export class StripeProvider implements IPaymentProvider {
  readonly name = 'stripe';

  private secretKey: string;
  private publishableKey: string;

  constructor() {
    this.secretKey = process.env.STRIPE_SECRET_KEY || 'sk_test_mock_key';
    this.publishableKey = process.env.STRIPE_PUBLISHABLE_KEY || 'pk_test_mock_key';
  }

  async createPaymentIntent(
    amount: number,
    currency: string,
    metadata?: Record<string, any>
  ): Promise<PaymentIntent> {
    // MOCK: In production, call Stripe Payment Intents API
    console.log(`[Stripe Mock] Creating payment intent for ${currency} ${amount}`);

    return {
      id: `pi_${Math.random().toString(36).substr(2, 24)}`,
      amount,
      currency,
      status: 'pending',
      clientSecret: `pi_${Math.random().toString(36).substr(2, 24)}_secret_${Math.random().toString(36).substr(2, 24)}`,
    };
  }

  async processPayment(paymentIntentId: string): Promise<PaymentResult> {
    // MOCK: Confirm payment intent
    console.log(`[Stripe Mock] Processing payment ${paymentIntentId}`);

    // Simulate 97% success rate
    const success = Math.random() > 0.03;

    if (success) {
      return {
        success: true,
        transactionId: `ch_${Math.random().toString(36).substr(2, 24)}`,
        amount: 9.99, // Mock amount
        message: 'Payment processed successfully via Stripe',
      };
    } else {
      return {
        success: false,
        transactionId: '',
        amount: 0,
        error: 'Your card was declined',
      };
    }
  }

  async createToken(cardDetails: CardInput): Promise<CardToken> {
    // MOCK: Stripe tokenization (card tokens)
    console.log(`[Stripe Mock] Tokenizing card ending in ${cardDetails.number.slice(-4)}`);

    return {
      token: `tok_${Math.random().toString(36).substr(2, 24)}`,
      last4: cardDetails.number.slice(-4),
      brand: this.detectCardBrand(cardDetails.number),
      expiryMonth: cardDetails.expiryMonth,
      expiryYear: cardDetails.expiryYear,
    };
  }

  async chargeToken(token: string, amount: number, currency: string): Promise<ChargeResult> {
    // MOCK: Charge using Stripe token
    console.log(`[Stripe Mock] Charging token ${token} for ${currency} ${amount}`);

    // Simulate 99% success rate
    const success = Math.random() > 0.01;

    if (success) {
      return {
        success: true,
        transactionId: `ch_${Math.random().toString(36).substr(2, 24)}`,
        amount,
        chargedAt: new Date(),
      };
    } else {
      return {
        success: false,
        transactionId: '',
        amount: 0,
        chargedAt: new Date(),
        error: 'Card declined',
      };
    }
  }

  async createSubscription(
    customerId: string,
    planId: string,
    paymentToken: string
  ): Promise<SubscriptionResult> {
    // MOCK: Create Stripe subscription
    console.log(`[Stripe Mock] Creating subscription for customer ${customerId}`);

    const now = new Date();
    const nextMonth = new Date(now);
    nextMonth.setMonth(nextMonth.getMonth() + 1);

    return {
      id: `sub_${Math.random().toString(36).substr(2, 24)}`,
      customerId,
      status: 'active',
      currentPeriodEnd: nextMonth,
    };
  }

  async cancelSubscription(subscriptionId: string): Promise<void> {
    // MOCK: Cancel Stripe subscription
    console.log(`[Stripe Mock] Canceling subscription ${subscriptionId}`);
    // In production: Call Stripe API subscriptions.cancel()
  }

  async processSubscriptionRenewal(
    subscriptionId: string,
    token: string,
    amount: number
  ): Promise<ChargeResult> {
    // MOCK: Stripe handles renewals automatically
    console.log(`[Stripe Mock] Processing renewal for subscription ${subscriptionId}`);

    // Stripe auto-charges, but we simulate it here
    return this.chargeToken(token, amount, 'USD');
  }

  // Helper methods
  private detectCardBrand(cardNumber: string): string {
    const firstDigit = cardNumber[0];
    const firstTwo = cardNumber.substring(0, 2);

    if (firstDigit === '4') return 'visa';
    if (['51', '52', '53', '54', '55'].includes(firstTwo)) return 'mastercard';
    if (['34', '37'].includes(firstTwo)) return 'amex';
    if (firstTwo === '60') return 'discover';

    return 'unknown';
  }
}
