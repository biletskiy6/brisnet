# Neo-Brisnet Setup Guide

Complete setup instructions for the Neo-Brisnet e-commerce platform.

## Prerequisites

- Node.js 20+
- MySQL 8
- AWS Account (for deployment)
- Git

## Quick Start

### 1. Clone and Install

```bash
git clone <repo-url>
cd brisnet
npm install
```

### 2. Configure Environment

**Backend** (`backend/.env`):
```bash
cp backend/.env.example backend/.env
```

Edit `backend/.env`:
```env
DATABASE_URL="mysql://user:password@localhost:3306/neo_brisnet"
PAYMENT_PROVIDER=elavon
CMS_PROVIDER=custom
```

**Frontend** (`frontend/.env.local`):
```bash
cp frontend/.env.example frontend/.env.local
```

Edit `frontend/.env.local`:
```env
NEXT_PUBLIC_API_URL=http://localhost:3001
NEXT_PUBLIC_PAYMENT_PROVIDER=elavon
NEXT_PUBLIC_CMS_PROVIDER=custom
```

### 3. Set Up Database

```bash
# Create MySQL database
mysql -u root -p
CREATE DATABASE neo_brisnet;
EXIT;

# Run migrations
cd backend
npx prisma migrate dev --name init

# Seed with mock data
npx prisma db seed
```

### 4. Start Development Servers

**Option A: All services at once**
```bash
npm run dev
```

**Option B: Individual services**
```bash
# Terminal 1: Backend (SST)
npm run dev:backend

# Terminal 2: Frontend
npm run dev:frontend

# Terminal 3: Admin Dashboard
npm run dev:admin
```

### 5. Access the Applications

- **Frontend**: http://localhost:3000
- **API**: http://localhost:3001
- **Admin**: http://localhost:3002
- **Prisma Studio**: `npm run db:studio`

## Testing the PoC

### Test User Credentials

```
Email: test@neobrisnet.com
User ID: (generated on seed)
Initial Credits: 1,375
```

### Test the Dual Pricing Flow

1. Browse products at http://localhost:3000
2. Filter by Track, Product Type, or Creator
3. Add products to cart
4. Toggle payment method per item (cash vs credits)
5. Proceed to checkout
6. Complete purchase
7. View purchase history

### Switch Payment Providers

Edit `backend/.env`:
```env
# Use Stripe instead of Elavon
PAYMENT_PROVIDER=stripe
```

Restart backend - all checkout calls now use Stripe mock!

### Switch CMS Providers

Edit `backend/.env`:
```env
# Use Strapi instead of Custom
CMS_PROVIDER=strapi
STRAPI_URL=http://localhost:1337
```

## Database Management

```bash
# Open Prisma Studio (GUI)
npm run db:studio

# Create a migration
cd backend
npx prisma migrate dev --name your_migration_name

# Reset database (WARNING: Deletes all data)
npx prisma migrate reset
```

## Deployment

### AWS Deployment with SST

```bash
# Deploy to staging
npm run deploy

# Deploy to production
npm run deploy -- --stage production
```

This will deploy:
- Lambda functions for API
- RDS MySQL database
- API Gateway
- CloudFront CDN (for frontend)

## Provider Configuration

### Payment Providers

**Elavon (Default):**
```env
PAYMENT_PROVIDER=elavon
ELAVON_MERCHANT_ID=your_merchant_id
ELAVON_API_KEY=your_api_key
ELAVON_GATEWAY_URL=https://api.fusebox.elavon.com
```

**Stripe:**
```env
PAYMENT_PROVIDER=stripe
STRIPE_SECRET_KEY=sk_live_...
STRIPE_PUBLISHABLE_KEY=pk_live_...
```

### CMS Providers

**Custom (Default - In-Memory):**
```env
CMS_PROVIDER=custom
```

**Strapi:**
```env
CMS_PROVIDER=strapi
STRAPI_URL=http://localhost:1337
STRAPI_API_TOKEN=your_token_here
```

## Troubleshooting

### Database Connection Issues

```bash
# Check MySQL is running
mysql -u root -p -e "SELECT 1"

# Verify DATABASE_URL is correct
cd backend
npx prisma db push
```

### Frontend Can't Reach API

- Verify `NEXT_PUBLIC_API_URL` in `frontend/.env.local`
- Check backend is running on port 3001
- Verify CORS headers in Lambda functions

### SST Deployment Fails

- Ensure AWS credentials are configured: `aws configure`
- Check AWS region matches `infra/sst.config.ts`
- Verify IAM permissions for Lambda, RDS, API Gateway

## Architecture Overview

```
┌─────────────────────────────────────────────────┐
│  Frontend (Next.js)                             │
│  http://localhost:3000                          │
└────────────────┬────────────────────────────────┘
                 │
                 ▼
┌─────────────────────────────────────────────────┐
│  Backend API (AWS Lambda via SST)               │
│  http://localhost:3001                          │
│                                                  │
│  ┌─────────────────┐   ┌──────────────────┐    │
│  │  Payment        │   │  CMS Provider    │    │
│  │  Provider       │   │  (Strapi/Custom) │    │
│  │  (Elavon/Stripe)│   └──────────────────┘    │
│  └─────────────────┘                            │
└────────────────┬────────────────────────────────┘
                 │
                 ▼
        ┌──────────────────┐
        │  MySQL 8         │
        │  (Prisma ORM)    │
        └──────────────────┘
```

## Next Steps

1. ✅ Complete PoC with dual pricing
2. Implement purchase history UI
3. Add subscription management
4. Integrate real payment gateways
5. Add user authentication (JWT)
6. Build admin dashboard
7. Set up CI/CD pipeline
8. Production deployment

## Support

For questions or issues:
- Check `/docs` folder for architecture details
- Review Prisma schema: `backend/prisma/schema.prisma`
- API documentation (coming soon)
