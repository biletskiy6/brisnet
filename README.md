# Neo-Brisnet E-Commerce Platform

Modern e-commerce PoC for handicapping products with dual pricing (cash + credits).

## Architecture

**Monorepo Structure:**
- `backend/` - SST + AWS Lambda + MySQL 8 + Prisma
- `frontend/` - Next.js 16 (App Router) + MUI Joy UI
- `admin-dashboard/` - Admin interface (Next.js)
- `infra/` - SST infrastructure configuration
- `docs/` - Architecture documentation

## Key Features

- **Dual Pricing Model** - Every product purchasable with cash OR credits
- **Provider Abstractions** - Easily switch payment gateways (Elavon/Stripe) and CMS (Strapi/Custom)
- **Credit Ledger** - Full transaction history with expiration tracking
- **Shopping Cart** - Choose payment method per line item
- **Purchase History** - Complete order and download management

## Quick Start

```bash
# Install dependencies
npm install

# Set up environment variables
cp backend/.env.example backend/.env
cp frontend/.env.example frontend/.env

# Run database migrations
npm run db:migrate

# Start development servers
npm run dev

# Frontend: http://localhost:3000
# Backend API: http://localhost:3001
```

## Development

```bash
# Frontend only
npm run dev:frontend

# Backend only
npm run dev:backend

# Admin dashboard
npm run dev:admin

# Prisma Studio (database GUI)
npm run db:studio
```

## Deployment

```bash
# Deploy to AWS
npm run deploy
```

## Provider Configuration

### Payment Gateway

Switch via environment variable:

```bash
# Use Elavon (default)
PAYMENT_PROVIDER=elavon

# Use Stripe
PAYMENT_PROVIDER=stripe
```

### CMS Provider

```bash
# Use Strapi CMS
CMS_PROVIDER=strapi
STRAPI_URL=http://localhost:1337

# Use Custom (mock data)
CMS_PROVIDER=custom
```

## Documentation

See `/docs` for complete architecture specifications:
- `neo-brisnet-architecture.md` - Full system architecture
- `BRISNET_STORE_PLAN.md` - Implementation plan

## Tech Stack

- **Backend:** SST, AWS Lambda, Prisma, MySQL 8
- **Frontend:** Next.js 16, React, MUI Joy UI
- **Infrastructure:** AWS (Lambda, RDS, S3)
- **Payments:** Elavon Fusebox / Stripe (abstracted)
- **CMS:** Strapi / Custom (abstracted)

## License

Proprietary - TwinSpires/Brisnet
