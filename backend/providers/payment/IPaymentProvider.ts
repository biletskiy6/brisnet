/**
 * Payment Provider Interface
 * Abstraction layer for payment gateways (Elavon, Stripe, etc.)
 */

export interface PaymentIntent {
  id: string;
  amount: number;
  currency: string;
  status: 'pending' | 'succeeded' | 'failed';
  clientSecret?: string;
}

export interface PaymentResult {
  success: boolean;
  transactionId: string;
  amount: number;
  message?: string;
  error?: string;
}

export interface CardToken {
  token: string;
  last4: string;
  brand: string;
  expiryMonth: number;
  expiryYear: number;
}

export interface CardInput {
  number: string;
  expiryMonth: number;
  expiryYear: number;
  cvc: string;
  name: string;
  address?: {
    line1: string;
    city: string;
    state: string;
    postalCode: string;
    country: string;
  };
}

export interface ChargeResult {
  success: boolean;
  transactionId: string;
  amount: number;
  chargedAt: Date;
  error?: string;
}

export interface SubscriptionResult {
  id: string;
  customerId: string;
  status: 'active' | 'past_due' | 'canceled';
  currentPeriodEnd: Date;
}

export interface IPaymentProvider {
  /**
   * Provider name
   */
  readonly name: string;

  /**
   * Create a payment intent for a one-time purchase
   */
  createPaymentIntent(amount: number, currency: string, metadata?: Record<string, any>): Promise<PaymentIntent>;

  /**
   * Process/confirm a payment
   */
  processPayment(paymentIntentId: string): Promise<PaymentResult>;

  /**
   * Tokenize a credit card for future use
   */
  createToken(cardDetails: CardInput): Promise<CardToken>;

  /**
   * Charge a previously tokenized card
   */
  chargeToken(token: string, amount: number, currency: string): Promise<ChargeResult>;

  /**
   * Create a recurring subscription
   */
  createSubscription(
    customerId: string,
    planId: string,
    paymentToken: string
  ): Promise<SubscriptionResult>;

  /**
   * Cancel a subscription
   */
  cancelSubscription(subscriptionId: string): Promise<void>;

  /**
   * Process subscription renewal (called by cron)
   */
  processSubscriptionRenewal(subscriptionId: string, token: string, amount: number): Promise<ChargeResult>;
}
