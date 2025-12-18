# Provider Abstraction Architecture

This document explains how Neo-Brisnet uses provider abstractions to remain flexible and vendor-agnostic.

## Overview

Neo-Brisnet uses the **Strategy Pattern** to abstract external dependencies:

1. **Payment Providers** - Switch between Elavon, Stripe, or others
2. **CMS Providers** - Switch between Strapi, custom, or headless CMS

## Payment Provider Abstraction

### Interface

All payment providers implement `IPaymentProvider`:

```typescript
interface IPaymentProvider {
  readonly name: string;
  createPaymentIntent(amount, currency, metadata?): Promise<PaymentIntent>;
  processPayment(paymentIntentId): Promise<PaymentResult>;
  createToken(cardDetails): Promise<CardToken>;
  chargeToken(token, amount, currency): Promise<ChargeResult>;
  createSubscription(...): Promise<SubscriptionResult>;
  cancelSubscription(subscriptionId): Promise<void>;
  processSubscriptionRenewal(...): Promise<ChargeResult>;
}
```

### Implementations

**Elavon Provider** (`backend/providers/payment/ElavonProvider.ts`):
- Integrates with Fusebox API
- Tokenization for PCI compliance
- Recurring billing support

**Stripe Provider** (`backend/providers/payment/StripeProvider.ts`):
- Payment Intents API
- Subscription management
- Automatic retry logic

### Usage

```typescript
import { getPaymentProvider } from './providers/payment';

// Automatically uses PAYMENT_PROVIDER from .env
const provider = getPaymentProvider();

// Create payment
const intent = await provider.createPaymentIntent(9.99, 'USD');

// Process it
const result = await provider.processPayment(intent.id);
```

### Switching Providers

Just change the environment variable:

```bash
# .env
PAYMENT_PROVIDER=elavon  # or 'stripe'
```

No code changes required! The factory function handles provider selection.

## CMS Provider Abstraction

### Interface

All CMS providers implement `ICMSProvider`:

```typescript
interface ICMSProvider {
  readonly name: string;
  getBanners(): Promise<MarketingBanner[]>;
  getArticles(params): Promise<NewsArticle[]>;
  getArticle(slug): Promise<NewsArticle | null>;
  getMenuItems(location): Promise<MenuItem[]>;
  getContent(contentType, slug): Promise<any>;
}
```

### Implementations

**Strapi Provider** (`backend/providers/cms/StrapiProvider.ts`):
- REST API integration
- GraphQL support
- Media library

**Custom Provider** (`backend/providers/cms/CustomProvider.ts`):
- In-memory data store
- File-based content
- Simple admin API

### Usage

```typescript
import { getCMSProvider } from './providers/cms';

const cms = getCMSProvider();

// Fetch marketing banners
const banners = await cms.getBanners();

// Get news articles
const articles = await cms.getArticles({ limit: 10 });
```

### Switching Providers

```bash
# .env
CMS_PROVIDER=strapi  # or 'custom'
STRAPI_URL=http://localhost:1337
STRAPI_API_TOKEN=your_token
```

## Benefits of Provider Abstraction

### 1. Vendor Independence
- Not locked into a single vendor
- Easy to switch if pricing/terms change
- Negotiate better rates with multiple options

### 2. Testing & Development
- Use mock providers for development
- Test payment flows without real charges
- Faster iteration cycles

### 3. Redundancy & Failover
- Primary provider down? Switch to backup
- Load balance between providers
- Geographic routing (EU vs US)

### 4. Feature Parity
- Compare features across providers
- Adopt new provider features incrementally
- Gradual migration strategies

### 5. Cost Optimization
- Route transactions based on fees
- Use cheapest provider per region
- Volume-based provider selection

## Real-World Example

### Scenario: Elavon Outage

If Elavon experiences downtime:

1. **Change environment variable:**
   ```bash
   PAYMENT_PROVIDER=stripe
   ```

2. **Restart service**
   ```bash
   npm run deploy
   ```

3. **All payments now use Stripe** - no code changes!

### Scenario: Migrate from Custom CMS to Strapi

1. **Set up Strapi instance**
2. **Populate content via Strapi admin**
3. **Update environment:**
   ```bash
   CMS_PROVIDER=strapi
   STRAPI_URL=https://cms.neobrisnet.com
   ```

4. **Deploy** - content now served from Strapi!

## Adding New Providers

### Add a New Payment Provider (e.g., PayPal)

1. **Create provider class:**

```typescript
// backend/providers/payment/PayPalProvider.ts
export class PayPalProvider implements IPaymentProvider {
  readonly name = 'paypal';

  async createPaymentIntent(amount, currency) {
    // PayPal implementation
  }

  // ... implement other methods
}
```

2. **Register in factory:**

```typescript
// backend/providers/payment/index.ts
import { PayPalProvider } from './PayPalProvider';

export function getPaymentProvider() {
  const provider = process.env.PAYMENT_PROVIDER || 'elavon';

  switch (provider) {
    case 'elavon': return new ElavonProvider();
    case 'stripe': return new StripeProvider();
    case 'paypal': return new PayPalProvider(); // NEW!
    default: return new ElavonProvider();
  }
}
```

3. **Use it:**
   ```bash
   PAYMENT_PROVIDER=paypal
   ```

## Best Practices

### 1. Keep Interfaces Stable
- Don't add provider-specific methods to interface
- Use optional metadata parameters for provider features
- Versioning if breaking changes needed

### 2. Graceful Degradation
- Handle provider-specific errors
- Fallback to default behavior
- Log provider-specific issues

### 3. Configuration Management
- Store provider configs in environment variables
- Never commit secrets to Git
- Use AWS Secrets Manager in production

### 4. Monitoring & Logging
- Track which provider handled each transaction
- Monitor success rates per provider
- Alert on provider failover

### 5. Testing
- Unit tests for each provider
- Integration tests with provider sandboxes
- Mock providers for CI/CD

## Future Enhancements

- **Multi-provider routing** - use different providers simultaneously
- **Smart routing** - route based on transaction type, amount, region
- **Provider health checks** - automatic failover based on uptime
- **Cost optimization** - choose cheapest provider per transaction

## Conclusion

Provider abstractions are a core architectural decision for Neo-Brisnet, ensuring flexibility, redundancy, and vendor independence. This pattern will scale as the platform grows and new providers emerge.
