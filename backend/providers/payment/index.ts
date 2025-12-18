/**
 * Payment Provider Factory
 * Dynamically loads the correct payment provider based on environment
 */

import type { IPaymentProvider } from './IPaymentProvider.js';
import { ElavonProvider } from './ElavonProvider.js';
import { StripeProvider } from './StripeProvider.js';

export * from './IPaymentProvider.js';
export * from './ElavonProvider.js';
export * from './StripeProvider.js';

/**
 * Get the active payment provider based on environment configuration
 */
export function getPaymentProvider(): IPaymentProvider {
  const provider = process.env.PAYMENT_PROVIDER || 'elavon';

  switch (provider.toLowerCase()) {
    case 'elavon':
      console.log('🔌 Using Elavon payment provider');
      return new ElavonProvider();

    case 'stripe':
      console.log('🔌 Using Stripe payment provider');
      return new StripeProvider();

    default:
      console.warn(`⚠️  Unknown payment provider: ${provider}, defaulting to Elavon`);
      return new ElavonProvider();
  }
}
