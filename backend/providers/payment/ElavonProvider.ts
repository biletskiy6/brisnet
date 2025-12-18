/**
 * Elavon Fusebox Payment Provider (MOCK Implementation)
 *
 * In production, this would integrate with:
 * - Elavon Fusebox API: https://developer.elavon.com/products/fusebox
 * - Hosted payment page for PCI compliance
 * - Tokenization for recurring billing
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

export class ElavonProvider implements IPaymentProvider {
  readonly name = 'elavon';

  private merchantId: string;
  private apiKey: string;
  private gatewayUrl: string;

  constructor() {
    this.merchantId = process.env.ELAVON_MERCHANT_ID || 'mock_merchant_id';
    this.apiKey = process.env.ELAVON_API_KEY || 'mock_api_key';
    this.gatewayUrl = process.env.ELAVON_GATEWAY_URL || 'https://api.fusebox.elavon.com';
  }

  async createPaymentIntent(
    amount: number,
    currency: string,
    metadata?: Record<string, any>
  ): Promise<PaymentIntent> {
    // MOCK: In production, call Elavon Fusebox API
    console.log(`[Elavon Mock] Creating payment intent for ${currency} ${amount}`);

    return {
      id: `elavon_pi_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      amount,
      currency,
      status: 'pending',
      clientSecret: `elavon_secret_${Math.random().toString(36).substr(2, 16)}`,
    };
  }

  async processPayment(paymentIntentId: string): Promise<PaymentResult> {
    // MOCK: Simulate payment processing
    console.log(`[Elavon Mock] Processing payment ${paymentIntentId}`);

    // Simulate 95% success rate
    const success = Math.random() > 0.05;

    if (success) {
      return {
        success: true,
        transactionId: `elavon_txn_${Date.now()}`,
        amount: 9.99, // Mock amount
        message: 'Payment processed successfully via Elavon',
      };
    } else {
      return {
        success: false,
        transactionId: '',
        amount: 0,
        error: 'Card declined by Elavon',
      };
    }
  }

  async createToken(cardDetails: CardInput): Promise<CardToken> {
    // MOCK: Elavon Fusebox tokenization
    console.log(`[Elavon Mock] Tokenizing card ending in ${cardDetails.number.slice(-4)}`);

    return {
      token: `elavon_tok_${Math.random().toString(36).substr(2, 20)}`,
      last4: cardDetails.number.slice(-4),
      brand: this.detectCardBrand(cardDetails.number),
      expiryMonth: cardDetails.expiryMonth,
      expiryYear: cardDetails.expiryYear,
    };
  }

  async chargeToken(token: string, amount: number, currency: string): Promise<ChargeResult> {
    // MOCK: Charge a tokenized card
    console.log(`[Elavon Mock] Charging token ${token} for ${currency} ${amount}`);

    // Simulate 98% success rate for stored cards
    const success = Math.random() > 0.02;

    if (success) {
      return {
        success: true,
        transactionId: `elavon_charge_${Date.now()}`,
        amount,
        chargedAt: new Date(),
      };
    } else {
      return {
        success: false,
        transactionId: '',
        amount: 0,
        chargedAt: new Date(),
        error: 'Insufficient funds or expired card',
      };
    }
  }

  async createSubscription(
    customerId: string,
    planId: string,
    paymentToken: string
  ): Promise<SubscriptionResult> {
    // MOCK: Create recurring subscription
    console.log(`[Elavon Mock] Creating subscription for customer ${customerId}`);

    const now = new Date();
    const nextMonth = new Date(now);
    nextMonth.setMonth(nextMonth.getMonth() + 1);

    return {
      id: `elavon_sub_${Date.now()}`,
      customerId,
      status: 'active',
      currentPeriodEnd: nextMonth,
    };
  }

  async cancelSubscription(subscriptionId: string): Promise<void> {
    // MOCK: Cancel subscription
    console.log(`[Elavon Mock] Canceling subscription ${subscriptionId}`);
    // In production: Call Elavon API to stop recurring billing
  }

  async processSubscriptionRenewal(
    subscriptionId: string,
    token: string,
    amount: number
  ): Promise<ChargeResult> {
    // MOCK: Process monthly subscription renewal
    console.log(`[Elavon Mock] Processing renewal for subscription ${subscriptionId}`);

    return this.chargeToken(token, amount, 'USD');
  }

  // Helper methods
  private detectCardBrand(cardNumber: string): string {
    const firstDigit = cardNumber[0];
    const firstTwo = cardNumber.substring(0, 2);

    if (firstDigit === '4') return 'Visa';
    if (['51', '52', '53', '54', '55'].includes(firstTwo)) return 'Mastercard';
    if (['34', '37'].includes(firstTwo)) return 'American Express';
    if (firstTwo === '60') return 'Discover';

    return 'Unknown';
  }
}
