# Neo-Brisnet Architecture Guide

> Master reference document for the Neo-Brisnet modernization project.
> Last updated: December 17, 2025

---

## Table of Contents

1. [Overview](#overview)
2. [Project Team & Stakeholders](#project-team--stakeholders)
3. [Timeline & Milestones](#timeline--milestones)
4. [Business Context](#business-context)
5. [Current Brisnet Menu Structure](#current-brisnet-menu-structure)
6. [Product Architecture](#product-architecture)
7. [Dual Pricing Model](#dual-pricing-model)
8. [Payment Processing](#payment-processing)
9. [Content Management (Strapi CMS)](#content-management-strapi-cms)
10. [Multi-Platform Rendering](#multi-platform-rendering)
11. [Technical Implementation](#technical-implementation)
12. [Data Models](#data-models)
13. [API Design](#api-design)

---

## Overview

Neo-Brisnet is a modernization initiative to rebuild the Brisnet.com handicapping store with:

- **Modern UX** - Discovery-focused interface replacing legacy dropdowns
- **Unified Product Catalog** - Products + Tags architecture for flexible filtering
- **Dual Pricing** - Every product purchasable with Cash or Credits
- **Creator Economy** - Attribution and royalties for handicappers
- **Headless Architecture** - Strapi CMS + any frontend (web, mobile, native)
- **Existing Payment Rails** - Leveraging TwinSpires' Elavon relationship

---

## Project Team & Stakeholders

### Core Development Team

| Name | Role | Responsibilities |
|------|------|------------------|
| **Victor** | FE & BE Architecture Lead | Frontend & backend architecture, initial repo setup |
| **Angelo** | Lead Engineer | Lead engineering, Beehive coordination, works with Kyle |
| **Rexen** | Database Lead | MySQL8 implementation, catalog data architecture |
| **Bahns** | Developer | New team member (to be onboarded) |
| **Kyle** | Project Manager / Producer | Resource tracking (Dec forward), project management |

### Key Stakeholders

| Name | Role | Interest |
|------|------|----------|
| **Bill Nall** | VP of Product | Executive sponsor, product direction |
| **Ashley** | Product Manager / Sales Ops Lead | Brisnet product ownership, sales operations |
| **Corby** | Equine Sports Handicapper Legend | Domain expertise, content quality |
| **Marketing Team** | Marketing | Go-to-market, customer acquisition |
| **Product Ops Team** | Operations | Day-to-day operations, support |

### Organizational Context

| Entity | Role |
|--------|------|
| TwinSpires | Parent company, Elavon relationship, wagering platform |
| Brisnet | Handicapping data, past performances, expert content |
| Beehive | Admin system - consumes Brisnet3 APIs for CRUD operations |
| Creators | Bruno De Julio, Andy Harrington, E-Ponies, etc. |
| End Users | Handicappers purchasing data, picks, analysis |

---

## Timeline & Milestones

### Key Dates

```
┌─────────────────────────────────────────────────────────────────────────────┐
│  2025 BRISNET3 ROADMAP                                                      │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  DEC 2024          JAN 8, 2025        END OF FEB         END OF APRIL      │
│  ─────────         ───────────        ───────────        ───────────       │
│  Project           PoC Complete       Basically          Kentucky Derby    │
│  Kickoff           "Buy a PDF"        Working            152 Ready         │
│                                       Brisnet3           All Features      │
│                                                                             │
│  ▼                 ▼                  ▼                  ▼                 │
│  ├─────────────────┼──────────────────┼──────────────────┤                 │
│  Dec               Jan                Feb                Mar       Apr     │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

### Milestone Details

| Date | Milestone | Deliverables |
|------|-----------|--------------|
| **Jan 8, 2025** | PoC Complete | Website in repo, user can browse digital products, add to cart, purchase a PDF, see it in purchase history |
| **End of Feb 2025** | Basically Working Brisnet3 | Core e-commerce functionality, payment processing, product catalog, user accounts |
| **End of April 2025** | Kentucky Derby 152 Ready | All planned features complete, production-ready, scaled for Derby traffic |

### PoC Scope (Jan 8)

The Proof of Concept demonstrates the core purchase flow:

```
User browses products → Adds to cart → Purchases → Views in history
         ↓                    ↓            ↓              ↓
    Product Grid         Cart Drawer   Elavon Pay    Order History
```

**Minimum Viable Features:**
- [ ] Product catalog display (from MySQL8)
- [ ] Add to cart functionality
- [ ] Checkout with Elavon payment
- [ ] Purchase confirmation
- [ ] Order history view
- [ ] PDF download access

---

## Business Context

### Current State Financials

| Metric | Value |
|--------|-------|
| **Brisnet Revenue** | $2,000,000 (top-line) |
| **Brisnet Costs** | $500,000 |
| **StaxBill Cost** | $90,000/year (to be eliminated) |
| **Net Margin** | ~$1,500,000 → ~$1,590,000 (post-StaxBill removal) |

### Cost Reduction Strategy

```
┌─────────────────────────────────────────────────────────────┐
│  COST OPTIMIZATION                                          │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  REMOVE: StaxBill subscription billing         -$90,000    │
│          └── Replace with Elavon Fusebox                   │
│                                                             │
│  LEVERAGE: Existing Elavon relationship                    │
│            └── TwinSpires gambling ops = favorable rates   │
│            └── Already approved for horse racing           │
│            └── 90% exclusivity deal in place               │
│                                                             │
│  RESULT: Best possible CC transaction pricing              │
│          No new merchant account needed                    │
│          Reduced vendor complexity                         │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

### Product Vision

#### What We Sell (Ultimate Scope)

| Product Type | Format | Example |
|--------------|--------|---------|
| **PDFs** | Downloadable | Past performances, tip sheets |
| **HTML** | Web-based | Interactive analysis, live data |
| **API Access** | Subscription | Data feeds for developers/apps |
| **CSVs** | Downloadable | Data files (DRF, XRD format) |
| **Coupons** | Promotional | Discount codes, bundles |
| **Digital Products** | Various | Any digital deliverable |
| **Drop-shippable** | Physical | Merchandise, print products |

#### Mobile-First & Responsive Design

Key tasks to address:

1. **Mobile-First Past Performances**
   - What does a PP look like on mobile?
   - Touch-friendly navigation through races
   - Pinch-to-zoom for detailed stats
   - Quick-glance vs. deep-dive modes

2. **Responsive Design (Beyond PDFs)**
   - HTML-based PPs that reflow for screen size
   - Card-based layouts for product browsing
   - Touch-optimized cart and checkout
   - Progressive enhancement for desktop

3. **PDF Considerations**
   - PDFs are inherently fixed-layout
   - Offer both PDF (print) and HTML (mobile) versions?
   - PDF viewer with mobile-optimized controls

---

## Technical Decisions

### Database Strategy

| Decision | Choice | Rationale |
|----------|--------|-----------|
| **Primary DB** | MySQL 8 | Team expertise, TwinSpires standard |
| **Abstraction** | Repository pattern | Enable future DB portability |
| **Goal** | DB-agnostic catalog | Turn into reusable mini-product |

#### Abstraction Architecture

```typescript
// Abstract repository interface
interface ProductRepository {
  findAll(filters: ProductFilters): Promise<Product[]>;
  findById(id: string): Promise<Product | null>;
  create(product: CreateProductDTO): Promise<Product>;
  update(id: string, product: UpdateProductDTO): Promise<Product>;
  delete(id: string): Promise<void>;
}

// MySQL8 implementation
class MySQLProductRepository implements ProductRepository {
  // MySQL-specific implementation
}

// Future: Could swap to PostgreSQL, MongoDB, etc.
class PostgreSQLProductRepository implements ProductRepository {
  // PostgreSQL implementation
}
```

This abstraction allows Brisnet3 to become a **reusable product catalog platform** for other TwinSpires properties or external licensing.

### Payment Abstraction

| Decision | Choice | Rationale |
|----------|--------|-----------|
| **Default Provider** | Elavon/Fusebox | Existing relationship, best rates |
| **Abstraction** | Payment gateway interface | Support Stripe, others long-term |
| **Goal** | Provider-agnostic payments | Flexibility, redundancy |

#### Payment Gateway Interface

```typescript
interface PaymentGateway {
  createPaymentIntent(amount: number, currency: string): Promise<PaymentIntent>;
  processPayment(paymentIntentId: string): Promise<PaymentResult>;
  createToken(cardDetails: CardInput): Promise<Token>;
  chargeToken(token: string, amount: number): Promise<ChargeResult>;
  createSubscription(customerId: string, planId: string): Promise<Subscription>;
  cancelSubscription(subscriptionId: string): Promise<void>;
}

// Elavon implementation (default)
class ElavonGateway implements PaymentGateway {
  // Fusebox API integration
}

// Future: Stripe implementation
class StripeGateway implements PaymentGateway {
  // Stripe API integration
}
```

### System Integration

```
┌─────────────────────────────────────────────────────────────────────┐
│                         BRISNET3 ECOSYSTEM                          │
├─────────────────────────────────────────────────────────────────────┤
│                                                                     │
│  ┌─────────────┐     ┌─────────────────┐     ┌─────────────────┐   │
│  │             │     │                 │     │                 │   │
│  │  BEEHIVE    │────▶│   BRISNET3      │◀────│  CUSTOMER       │   │
│  │  (Admin)    │ API │   APIs          │ API │  FRONTENDS      │   │
│  │             │     │                 │     │  (Web/Mobile)   │   │
│  └─────────────┘     └────────┬────────┘     └─────────────────┘   │
│                               │                                     │
│       Admin CRUD              │              Customer Experience    │
│       Operations              │                                     │
│                               ▼                                     │
│                      ┌─────────────────┐                           │
│                      │                 │                           │
│                      │    MySQL 8      │                           │
│                      │  (Abstracted)   │                           │
│                      │                 │                           │
│                      └─────────────────┘                           │
│                                                                     │
└─────────────────────────────────────────────────────────────────────┘
```

**Beehive** is the admin system that:
- Consumes Brisnet3 APIs for all CRUD operations
- Manages product catalog
- Handles creator management
- Processes refunds and customer service
- Generates reports

---

## Current Brisnet Menu Structure

> Documented from Brisnet.com screenshots (December 2024)

### Main Navigation

```
News | Entries | PPs | Picks | Data Files | Results | Tracks | Pedigrees | APR | Plans | More
```

### PPs (Past Performances)

| Category | Products |
|----------|----------|
| **Brisnet PPs** | Ultimate PPs, Prime Power PPs, PPs with TrackMaster, Classic PPs, Power Combo PPs, Basic PPs, Workout Report PPs, Best Value PPs |
| **Free PPs** | Free Brisnet PP, Free Post |
| **Other PPs** | Optix Plot PPs, TrackMaster PP, Equibase PPs |
| **International** | Australian PPs, United Kingdom PPs, Europe PPs |
| **Harness** | Harness PPs (various products) |

### Picks

| Category | Products |
|----------|----------|
| **Expert Analysis** | Bruno's Power Plays, Andy's Easy Exacta, TrackMaster Selections, Super Screener, Pace Projector Report |
| **Workout Reports** | Pro Clocker Report, Backstretch Reports |
| **Tip Sheets** | Golden Sheet, Brisnet Analysis Tip Sheet, Hot Shots |
| **Harness Picks** | Harness Selections, Harness Expert Analysis |

### Data Files

| Category | Products |
|----------|----------|
| **Single Track** | DRF files, Brisnet files, XRD files |
| **All Tracks** | All-Tracks Package (daily subscription) |
| **Historical** | Historical data files, chart data |

### Entries

- Today's Entries
- Entries by Track
- Entries by Date
- Entries Calendar
- Workouts
- Changes

### More Menu

| Section | Items |
|---------|-------|
| **Pedigree** | Free Pedigree, Pedigree Query, Auction Query |
| **Video** | Replays, Morning Works |
| **Tools** | Handicapping Calculator, Speed Figure Analyzer |
| **Account** | My Account, Order History, Subscription Management |

---

## Product Architecture

### Products + Tags Model

Every item in the store is a **Product** with associated **Tags** for filtering:

```
┌─────────────────────────────────────────────────────────────┐
│  PRODUCT                                                    │
├─────────────────────────────────────────────────────────────┤
│  id: "ult-pp-sar-2024-12-17"                               │
│  name: "Ultimate PPs - Saratoga"                           │
│  description: "Complete past performances with..."          │
│  contentType: "pdf"                                         │
│                                                             │
│  ┌─── PRICING ───┐                                         │
│  │ cashPrice: 5.99                                         │
│  │ creditPrice: 50                                         │
│  └───────────────┘                                         │
│                                                             │
│  ┌─── TAGS ──────────────────────────────────────┐         │
│  │ track: "SAR"                                   │         │
│  │ date: "2024-12-17"                            │         │
│  │ raceType: "Thoroughbred"                      │         │
│  │ productType: "Past Performance"               │         │
│  │ creator: "Brisnet"                            │         │
│  └───────────────────────────────────────────────┘         │
│                                                             │
│  thumbnail: "/images/sar-pps.jpg"                          │
│  popularity: 87                                             │
│  isFeatured: true                                           │
└─────────────────────────────────────────────────────────────┘
```

### Content Types

```typescript
type ContentType =
  | 'pdf'           // Downloadable PDF (PPs, tip sheets)
  | 'csv'           // Data files (DRF, XRD format)
  | 'video'         // Race replays, workout videos
  | 'picks'         // Expert selections
  | 'analysis'      // Written analysis/commentary
  | 'subscription'  // Recurring access (plans)
  | 'web';          // Web-based interactive content
```

### Product Types

```typescript
type ProductType =
  | 'Past Performance'
  | 'Picks'
  | 'E-Ponies'
  | 'Pedigree'
  | 'Speed Figures'
  | 'Analysis'
  | 'Video'
  | 'Expert Analysis'
  | 'Workout Reports'
  | 'Tip Sheets'
  | 'Harness'
  | 'Unlimited PPs'
  | 'Selections'
  | 'Data Files'
  | 'Charts'
  | 'Meet Plans'
  | 'Super Screener'
  | 'Pace Analysis'
  | 'Optix Plot'
  | 'Harness PPs'
  | 'Harness Analysis'
  | 'International PPs';
```

### Race Types

```typescript
type RaceType = 'Thoroughbred' | 'Harness' | 'Greyhound';
```

### Tag-Based Filtering

Users can filter products by any combination of tags:

```
Track: [Saratoga] [Churchill Downs] [All Tracks]
Type:  [PPs] [Picks] [Data Files]
Creator: [Bruno De Julio] [Andy Harrington] [E-Ponies]
```

This replaces the rigid category hierarchy with flexible, faceted search.

---

## Dual Pricing Model

Every product displays **both** Cash and Credit prices:

```
┌────────────────────────────────────┐
│  Ultimate PPs - Saratoga           │
│                                    │
│  $5.99  or  50 credits             │
│  ────────────────────────          │
│  [Add to Cart]                     │
└────────────────────────────────────┘
```

### Credit System

| Concept | Description |
|---------|-------------|
| **Purchase Credits** | Buy credit packs ($50 = 500 credits, with bonus) |
| **Earn Credits** | Wagering rewards, promotions, referrals |
| **Spend Credits** | Apply to any product instead of cash |
| **Expiration** | Credits may expire (show "125 credits expiring in 7 days") |

### Cart Behavior

Users choose payment method **per item** in cart:

```
┌─────────────────────────────────────────────────────┐
│  Shopping Cart                                      │
├─────────────────────────────────────────────────────┤
│  Ultimate PPs - Saratoga                            │
│  ○ Pay $5.99   ● Use 50 credits                    │
│                                                     │
│  Bruno's Power Plays - Churchill                    │
│  ● Pay $3.99   ○ Use 35 credits                    │
├─────────────────────────────────────────────────────┤
│  Cash Total:     $3.99                              │
│  Credits Total:  50 credits                         │
│                                                     │
│  Your Balance:   1,250 credits                      │
│  [Checkout]                                         │
└─────────────────────────────────────────────────────┘
```

### Credit Balance Widget

Header displays credit balance with expiration warning:

```
┌──────────────────────────────┐
│  🎫 1,250 credits            │
│  ⚠️ 125 expiring in 7 days   │
│  [Buy More]                  │
└──────────────────────────────┘
```

---

## Payment Processing

### Elavon Partnership

TwinSpires has a **90% exclusivity agreement** with Elavon, the 4th largest US payment processor (subsidiary of US Bancorp).

| Fact | Detail |
|------|--------|
| **Processor** | Elavon |
| **Exclusivity** | 90% of transactions |
| **Gateway** | Fusebox |
| **Annual Volume** | ~$577 billion (Elavon total) |
| **Coverage** | 30+ countries, 100+ currencies |

### Why This Matters

- ✅ **No new merchant account needed** - Relationship established
- ✅ **Horse racing approved** - Already processing TwinSpires wagering
- ✅ **Information products are fine** - Selling data/PDFs ≠ gambling
- ✅ **Infrastructure exists** - Integration patterns established

### Fusebox Gateway Capabilities

#### Tokenization (Card-on-File)

Brisnet **never stores credit card data**. Elavon handles it:

```
User enters card → Fusebox hosted form → Elavon stores card
                                              ↓
                                        Returns TOKEN
                                              ↓
                        Brisnet stores: user_id + token + plan_id
```

> "The hosted environment ensures that cardholder data is stored behind our firewall, and incorporates the latest data security technologies that exceed most PCI and PA-DSS requirements."

#### Subscription/Recurring Billing

```
Monthly billing cycle triggers
         ↓
Neo-Brisnet calls Fusebox API with stored token
         ↓
Elavon charges card
         ↓
Returns success/failure
         ↓
Neo-Brisnet updates subscription status
```

### Elavon Pricing (2025)

| Transaction Type | Rate |
|------------------|------|
| Swiped/Dipped | 2.30% + $0.10 |
| E-commerce | 2.60% + $0.10 |
| Key entered | 3.20% + $0.10 |
| Debit | 0.85% + $0.25 |

**Note:** Rate increases ~annually. February 2025: +0.81% + $0.25 on Visa/MC/Discover.

### PCI Compliance

With Fusebox tokenization, Neo-Brisnet remains **out of PCI scope** for card storage:

| We Store | We Don't Store |
|----------|----------------|
| Elavon tokens | Card numbers |
| Subscription metadata | CVV |
| Purchase history | Expiration dates |
| User preferences | Billing addresses (optional) |

### Alternative Processors (10% Non-Exclusive)

For edge cases or backup:

| Processor | Use Case |
|-----------|----------|
| **PayPal/Braintree** | International customers, PayPal/Venmo users |
| **Authorize.net** | Backup gateway, robust fraud detection |
| **Square** | Simple integration for small experiments |

---

## Content Management (Strapi CMS)

### Why Strapi?

Strapi is an open-source **headless CMS** that manages content via API:

| Benefit | Application |
|---------|-------------|
| **Custom Content Types** | Model Products, Creators, Tracks, Plans |
| **REST + GraphQL APIs** | Frontend fetches via API |
| **Admin UI** | Content team manages without developers |
| **Role-Based Permissions** | Creators manage own products |
| **Media Library** | Thumbnails, PDFs, samples |
| **Draft/Publish** | Stage products before going live |
| **Version History** | Track pricing/description changes |

### Content Types Schema

```
┌─────────────────────────────────────────────────────────────┐
│  STRAPI CONTENT TYPES                                       │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  Product                        Creator                     │
│  ─────────                      ─────────                   │
│  • name (string)                • name (string)             │
│  • description (richtext)       • bio (richtext)            │
│  • cashPrice (decimal)          • avatar (media)            │
│  • creditPrice (integer)        • products (relation)       │
│  • contentType (enum)           • royaltyRate (decimal)     │
│  • productType (enum)           • payoutInfo (json)         │
│  • thumbnail (media)                                        │
│  • downloadFile (media)         Track                       │
│  • creator (relation)           ─────────                   │
│  • tracks (relation)            • code (string)             │
│  • isFeatured (boolean)         • name (string)             │
│  • popularity (integer)         • location (string)         │
│  • tags (component)             • raceType (enum)           │
│                                 • timezone (string)         │
│  Plan (Subscriptions)                                       │
│  ─────────                      ProductCategory             │
│  • name (string)                ─────────                   │
│  • description (richtext)       • name (string)             │
│  • monthlyPrice (decimal)       • slug (string)             │
│  • annualPrice (decimal)        • icon (string)             │
│  • features (component[])       • description (text)        │
│  • creditAllocation (integer)   • products (relation)       │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

### Strapi + Neo-Brisnet Architecture

```
┌──────────────────┐     ┌──────────────────┐     ┌──────────────────┐
│                  │     │                  │     │                  │
│  Strapi CMS      │────▶│  Neo-Brisnet     │────▶│  DerbyDash       │
│  (Content Mgmt)  │ API │  Backend         │ API │  Frontend        │
│                  │     │  (Next.js)       │     │  (React)         │
└──────────────────┘     └────────┬─────────┘     └──────────────────┘
        │                         │
        │                         ▼
        │                ┌──────────────────┐
        │                │  Elavon/Fusebox  │
        │                │  (Payments)      │
        │                └──────────────────┘
        ▼
┌──────────────────┐
│  PostgreSQL      │
│  (Strapi DB)     │
└──────────────────┘
```

### Separation of Concerns

| Strapi Manages | Neo-Brisnet Builds |
|----------------|-------------------|
| Product catalog CRUD | Shopping cart logic |
| Creator profiles | Credit ledger/balance |
| Track metadata | Subscription billing |
| Media/file storage | Purchase history |
| Content versioning | Download/access control |
| Admin UI | User authentication |
| API for products | Creator royalty calculations |

### Creator Portal

Creators can manage their own products with restricted permissions:

```
┌─────────────────────────────────────────────────────┐
│  Creator Role in Strapi                             │
├─────────────────────────────────────────────────────┤
│  ✅ Can CREATE products (draft)                     │
│  ✅ Can EDIT their own products only                │
│  ✅ Can UPLOAD files to their products              │
│  ❌ CANNOT publish (requires admin approval)        │
│  ❌ CANNOT see other creators' drafts               │
│  ✅ CAN view their sales/royalty dashboard          │
└─────────────────────────────────────────────────────┘
```

### Strapi Pricing

| Tier | Cost | Best For |
|------|------|----------|
| **Community (Self-hosted)** | Free | Full control, own infrastructure |
| **Cloud Pro** | $99/mo | Managed hosting, 2 seats |
| **Cloud Team** | $499/mo | 5 seats, more resources |
| **Enterprise** | Custom | SSO, audit logs, SLAs |

**Recommendation:** Start with self-hosted Community Edition, migrate to Enterprise if SSO integration with TwinSpires accounts is needed.

---

## Multi-Platform Rendering

### Headless = Total Rendering Freedom

Strapi is **API-only**—no templates, no themes, no rendering engine. You build any frontend:

```
                              ┌─────────────────────┐
                              │                     │
                         ┌───▶│  DerbyDash Web      │
                         │    │  (Next.js/React)    │
                         │    │                     │
┌──────────────┐         │    └─────────────────────┘
│              │         │
│  Strapi      │         │    ┌─────────────────────┐
│  CMS         │─────────┼───▶│  Brisnet Mobile     │
│              │  REST/  │    │  (React Native)     │
│  Products    │  GraphQL│    └─────────────────────┘
│  Creators    │         │
│  Tracks      │         │    ┌─────────────────────┐
│  Plans       │         │    │                     │
│              │         └───▶│  TwinSpires App     │
└──────────────┘              │  (Native/WebView)   │
                              └─────────────────────┘
```

### Same Data, Different Renderers

**API Response:**
```json
{
  "id": 1,
  "name": "Ultimate PPs - Saratoga",
  "description": "Complete past performances...",
  "cashPrice": 5.99,
  "creditPrice": 50,
  "thumbnail": { "url": "/uploads/sar_pps.jpg" }
}
```

**React Web (MUI Joy):**
```tsx
<Card>
  <CardMedia image={product.thumbnail.url} />
  <Typography level="title-lg">{product.name}</Typography>
  <Typography>${product.cashPrice}</Typography>
</Card>
```

**React Native (Mobile):**
```tsx
<View style={styles.card}>
  <Image source={{ uri: product.thumbnail.url }} />
  <Text style={styles.title}>{product.name}</Text>
  <Text>${product.cashPrice}</Text>
</View>
```

**Swift (iOS Native):**
```swift
struct ProductCard: View {
    let product: Product
    var body: some View {
        VStack {
            AsyncImage(url: URL(string: product.thumbnail.url))
            Text(product.name).font(.headline)
            Text("$\(product.cashPrice)")
        }
    }
}
```

### Rich Text Handling

Strapi v5 uses a **Blocks** editor outputting structured JSON:

```json
{
  "type": "paragraph",
  "children": [
    { "type": "text", "text": "Expert analysis from " },
    { "type": "text", "text": "Bruno De Julio", "bold": true }
  ]
}
```

Each platform decides how to render "bold":
- Web: `<strong>` or `font-weight: 700`
- Mobile: `fontWeight: 'bold'`
- Native: `NSAttributedString` with bold trait

### GraphQL for Efficient Mobile Fetching

Mobile apps fetch only needed fields:

```graphql
# Mobile: Lightweight list view
query MobileProducts {
  products(filters: { isFeatured: { eq: true } }) {
    id
    name
    cashPrice
    thumbnail { url }
  }
}

# Web: Full detail view
query WebProductDetail($id: ID!) {
  product(id: $id) {
    id
    name
    description
    cashPrice
    creditPrice
    creator { name avatar { url } bio }
    tracks { code name }
    relatedProducts { id name }
  }
}
```

Less data over cellular = faster mobile experience.

---

## Technical Implementation

### System Architecture

```
┌─────────────────────────────────────────────────────────────────────┐
│                           CLIENTS                                   │
├─────────────────────────────────────────────────────────────────────┤
│  DerbyDash Web    │  Mobile App    │  TwinSpires    │  Kiosks      │
│  (Next.js)        │  (React Native)│  Integration   │  (Displays)  │
└────────┬──────────┴───────┬────────┴───────┬────────┴──────┬───────┘
         │                  │                │               │
         └──────────────────┴────────────────┴───────────────┘
                                    │
                                    ▼
┌─────────────────────────────────────────────────────────────────────┐
│                        API GATEWAY                                  │
│                     (Authentication, Rate Limiting)                 │
└─────────────────────────────────────────────────────────────────────┘
                                    │
              ┌─────────────────────┼─────────────────────┐
              ▼                     ▼                     ▼
┌─────────────────────┐  ┌─────────────────────┐  ┌─────────────────────┐
│  Neo-Brisnet API    │  │  Strapi CMS         │  │  TwinSpires Auth    │
│  ─────────────────  │  │  ─────────────────  │  │  ─────────────────  │
│  • Cart/Checkout    │  │  • Products         │  │  • SSO              │
│  • Credit Ledger    │  │  • Creators         │  │  • User Profiles    │
│  • Subscriptions    │  │  • Tracks           │  │  • Wagering Link    │
│  • Purchase History │  │  • Plans            │  │                     │
│  • Access Control   │  │  • Media            │  │                     │
└──────────┬──────────┘  └──────────┬──────────┘  └─────────────────────┘
           │                        │
           ▼                        ▼
┌─────────────────────┐  ┌─────────────────────┐
│  Elavon/Fusebox     │  │  PostgreSQL         │
│  ─────────────────  │  │  ─────────────────  │
│  • Card Tokenization│  │  • Strapi Content   │
│  • Payments         │  │  • Transaction Log  │
│  • Recurring Billing│  │  • Credit Ledger    │
└─────────────────────┘  └─────────────────────┘
```

### Technology Stack

| Layer | Technology |
|-------|------------|
| **Web Frontend** | Next.js 14+, React, MUI Joy UI |
| **Mobile Frontend** | React Native |
| **CMS** | Strapi v5 (self-hosted) |
| **API** | Next.js API Routes or standalone Node.js |
| **Database** | PostgreSQL |
| **Payments** | Elavon Fusebox |
| **File Storage** | S3-compatible (AWS S3, Cloudflare R2) |
| **CDN** | Cloudflare or AWS CloudFront |
| **Hosting** | Vercel (web), AWS/GCP (Strapi, API) |

### Key Flows

#### Purchase Flow (Cash)

```
1. User adds product to cart
2. User proceeds to checkout
3. Frontend calls Neo-Brisnet API → create pending order
4. Redirect to Fusebox hosted payment page
5. User enters card details (Elavon handles)
6. Elavon processes payment
7. Webhook notifies Neo-Brisnet of success
8. Neo-Brisnet marks order complete
9. User gains access to download
```

#### Purchase Flow (Credits)

```
1. User adds product to cart
2. User selects "Pay with Credits"
3. Frontend calls Neo-Brisnet API → create order
4. API checks credit balance ≥ creditPrice
5. API deducts credits from ledger
6. API marks order complete
7. User gains access to download
```

#### Subscription Flow

```
1. User selects plan (e.g., "Unlimited PPs - $29.99/mo")
2. Redirect to Fusebox hosted payment page
3. User enters card details
4. Elavon stores card, returns TOKEN
5. Neo-Brisnet stores: user_id + token + plan_id + next_billing_date
6. User gains subscription access

Monthly:
7. Cron job finds subscriptions due today
8. Call Fusebox API with stored token
9. Elavon charges card
10. On success: extend subscription, allocate monthly credits
11. On failure: retry logic, eventual suspension
```

---

## Data Models

### TypeScript Interfaces

```typescript
// Core Product
interface BrisnetProduct {
  id: string;
  name: string;
  description: string;
  contentType: ContentType;
  cashPrice: number;
  creditPrice: number;
  tags: ProductTags;
  thumbnail?: string;
  popularity: number;
  isFeatured?: boolean;
  createdAt?: string;
  downloadCount?: number;
}

interface ProductTags {
  track?: string;
  date?: string;
  raceType?: RaceType;
  productType: ProductType;
  creator?: string;
}

// Creator
interface Creator {
  id: string;
  name: string;
  avatar?: string;
  bio?: string;
  productCount: number;
  totalSales: number;
  royaltyRate: number;
}

// User Credits
interface UserCredits {
  balance: number;
  expiringCredits: ExpiringCredits[];
}

interface ExpiringCredits {
  amount: number;
  expiresAt: string;
}

// Cart
interface CartItem {
  product: BrisnetProduct;
  paymentMethod: 'cash' | 'credits';
}

interface Cart {
  items: CartItem[];
  cashTotal: number;
  creditsTotal: number;
}

// Subscription
interface Subscription {
  id: string;
  userId: string;
  planId: string;
  status: 'active' | 'past_due' | 'canceled' | 'paused';
  currentPeriodStart: string;
  currentPeriodEnd: string;
  elavonToken: string;
  cancelAtPeriodEnd: boolean;
}

// Track
interface TrackInfo {
  code: string;
  name: string;
  location: string;
  raceType: RaceType;
  timezone: string;
}

// Filters
interface ProductFilters {
  tracks: string[];
  productTypes: ProductType[];
  creators: string[];
  searchQuery: string;
  priceRange?: { min: number; max: number };
  dateRange?: { start: string; end: string };
}
```

### Database Schema (PostgreSQL)

```sql
-- Credit Ledger
CREATE TABLE credit_transactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id),
  amount INTEGER NOT NULL,  -- positive = credit, negative = debit
  balance_after INTEGER NOT NULL,
  transaction_type VARCHAR(50) NOT NULL,  -- 'purchase', 'spend', 'refund', 'bonus', 'expiration'
  reference_id UUID,  -- order_id, subscription_id, etc.
  expires_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Orders
CREATE TABLE orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id),
  status VARCHAR(20) NOT NULL,  -- 'pending', 'completed', 'failed', 'refunded'
  cash_total DECIMAL(10,2) DEFAULT 0,
  credits_total INTEGER DEFAULT 0,
  elavon_transaction_id VARCHAR(100),
  created_at TIMESTAMP DEFAULT NOW(),
  completed_at TIMESTAMP
);

CREATE TABLE order_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id UUID NOT NULL REFERENCES orders(id),
  product_id VARCHAR(100) NOT NULL,  -- Strapi product ID
  product_snapshot JSONB NOT NULL,  -- denormalized product data at time of purchase
  payment_method VARCHAR(10) NOT NULL,  -- 'cash' or 'credits'
  price DECIMAL(10,2),
  credit_price INTEGER
);

-- Subscriptions
CREATE TABLE subscriptions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id),
  plan_id VARCHAR(100) NOT NULL,  -- Strapi plan ID
  status VARCHAR(20) NOT NULL,
  elavon_token VARCHAR(100) NOT NULL,
  current_period_start TIMESTAMP NOT NULL,
  current_period_end TIMESTAMP NOT NULL,
  cancel_at_period_end BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Product Access (entitlements)
CREATE TABLE product_access (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id),
  product_id VARCHAR(100) NOT NULL,
  access_type VARCHAR(20) NOT NULL,  -- 'purchase', 'subscription'
  granted_at TIMESTAMP DEFAULT NOW(),
  expires_at TIMESTAMP,  -- NULL for permanent access
  download_count INTEGER DEFAULT 0
);
```

---

## API Design

### Strapi API Endpoints

```
# Products
GET  /api/products                    # List all products
GET  /api/products/:id                # Get single product
GET  /api/products?filters[tracks][code][$eq]=SAR
GET  /api/products?filters[isFeatured][$eq]=true&sort=popularity:desc

# Creators
GET  /api/creators                    # List all creators
GET  /api/creators/:id?populate=products

# Tracks
GET  /api/tracks                      # List all tracks
GET  /api/tracks?filters[raceType][$eq]=Thoroughbred

# Plans
GET  /api/plans?populate=features     # Subscription plans
```

### Neo-Brisnet API Endpoints

```
# Cart
GET    /api/cart                      # Get current cart
POST   /api/cart/items                # Add item to cart
DELETE /api/cart/items/:id            # Remove item
PATCH  /api/cart/items/:id            # Update payment method

# Checkout
POST   /api/checkout/cash             # Initiate cash checkout → Elavon
POST   /api/checkout/credits          # Complete credits checkout
POST   /api/checkout/webhook          # Elavon webhook callback

# Credits
GET    /api/credits/balance           # Get user's credit balance
POST   /api/credits/purchase          # Buy credit pack
GET    /api/credits/transactions      # Transaction history

# Subscriptions
GET    /api/subscriptions             # User's subscriptions
POST   /api/subscriptions             # Create new subscription
DELETE /api/subscriptions/:id         # Cancel subscription
POST   /api/subscriptions/:id/resume  # Resume paused subscription

# Access/Downloads
GET    /api/access                    # User's purchased products
GET    /api/downloads/:productId      # Get download URL (signed, expiring)

# Orders
GET    /api/orders                    # Order history
GET    /api/orders/:id                # Order details
```

### Example API Responses

**GET /api/credits/balance**
```json
{
  "balance": 1250,
  "expiringCredits": [
    { "amount": 125, "expiresAt": "2024-12-24T00:00:00Z" },
    { "amount": 200, "expiresAt": "2025-01-15T00:00:00Z" }
  ]
}
```

**POST /api/checkout/credits**
```json
// Request
{
  "cartId": "cart_abc123"
}

// Response
{
  "orderId": "order_xyz789",
  "status": "completed",
  "creditsSpent": 150,
  "newBalance": 1100,
  "accessGranted": [
    { "productId": "ult-pp-sar", "downloadUrl": "/api/downloads/ult-pp-sar" }
  ]
}
```

---

## Appendix: Reference Links

### Elavon/Fusebox
- [Elavon Fusebox Overview](https://www.elavon.com/solutions/payment-gateways/fusebox.html)
- [Fusebox Developer Portal](https://developer.elavon.com/products/fusebox/v1/overview)
- [Elavon Pricing](https://merchantcostconsulting.com/lower-credit-card-processing-fees/elavon-review/)

### Strapi
- [Strapi Documentation](https://docs.strapi.io/)
- [Strapi v5 REST API](https://docs.strapi.io/cms/api/rest)
- [Strapi eCommerce Solutions](https://strapi.io/solutions/ecommerce-cms)
- [Strapi Pricing](https://strapi.io/pricing-self-hosted)

### Related DerbyDash Files
- `app/types/brisnet.ts` - TypeScript type definitions
- `app/data/brisnetProducts.ts` - Mock product data
- `app/data/brisnetPicks.ts` - Mock picks data
- `app/data/brisnetPPs.ts` - Mock PP data
- `app/components/brisnet/` - Store UI components

---

*Document maintained by the Neo-Brisnet architecture team.*
