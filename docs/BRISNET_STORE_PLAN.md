# Brisnet Store Mockup - Implementation Plan

*Created: December 16, 2025*
*Purpose: UX exploration for Neo-Brisnet Handicapping Store*

---

## Overview

This mockup demonstrates the core UX patterns for the modernized Brisnet.com handicapping store, integrated into DerbyDash as a prototype. The goal is to validate the **Products + Tags** architecture and **dual pricing (Cash + Credits)** model before full implementation.

## Architecture Reference

Based on `/Users/erikbethke/Desktop/TwinSpires/brisnet/11-architecture-notes.md`:

- **Products with Tags**: Flexible categorization (track, date, product type, creator)
- **Dual Pricing**: Cash price + Credit price for every product
- **Three User Types**: Customer, Creator/Affiliate, Admin
- **Credits System**: Earned from TwinSpires promos, spent on products

---

## New Components

### Data Layer

| File | Purpose |
|------|---------|
| `app/data/brisnetProducts.ts` | Mock products, creators, user credits |
| `app/types/brisnet.ts` | TypeScript interfaces |

### UI Components

| Component | Location | Purpose |
|-----------|----------|---------|
| `ProductCard.tsx` | `app/components/brisnet/` | Single product display |
| `ProductFilters.tsx` | `app/components/brisnet/` | Tag-based filtering |
| `HandicappingStore.tsx` | `app/components/brisnet/` | Main store view |
| `CartDrawer.tsx` | `app/components/brisnet/` | Shopping cart sidebar |
| `CreditBalance.tsx` | `app/components/brisnet/` | Header credit display |

### Views Added

| ViewType | Description |
|----------|-------------|
| `handicapping-store` | Main product browsing grid |
| `my-downloads` | Purchase history (Phase 2) |

---

## Mock Data Structure

```typescript
interface BrisnetProduct {
  id: string;
  name: string;
  description: string;
  contentType: 'pdf' | 'csv' | 'video' | 'picks';
  cashPrice: number;
  creditPrice: number;
  tags: {
    track?: string;
    date?: string;
    raceType?: string;
    productType: string;
    creator?: string;
  };
  thumbnail?: string;
  popularity: number;
  isFeatured?: boolean;
}
```

---

## UI Specifications

### Product Card
- **Size**: ~280px wide, responsive grid
- **Elements**:
  - Content type icon (PDF, Video, etc.)
  - Product name (truncate if long)
  - Creator badge (if applicable)
  - Track + Date tag
  - Dual pricing: "$4.99 or 500 🎫"
  - "Add to Cart" button
  - Featured badge (orange, top-right)

### Filter Sidebar
- **Track Filter**: Checkboxes, multi-select
- **Product Type Filter**: Checkboxes
- **Creator Filter**: Checkboxes
- **Clear All** button

### Cart Drawer
- Slides in from right
- Shows each item with toggle: Pay Cash / Use Credits
- Running totals for cash and credits
- User's credit balance
- "Checkout" button (mocked)

### Credit Balance (Header)
- Small chip/badge near user menu
- Shows: "🎫 1,250"
- Click expands to show expiring credits

---

## Implementation Phases

### Phase 1 (This PR) ✅
- [x] Mock data file
- [x] Type definitions
- [x] ProductCard component
- [x] HandicappingStore with filters
- [x] CartDrawer
- [x] Credit balance in header
- [x] Updated Handicapping dropdown

### Phase 2 (Future)
- [ ] Product detail modal/page
- [ ] My Downloads view
- [ ] Promo code input
- [ ] Search functionality

### Phase 3 (Future)
- [ ] Creator dashboard view
- [ ] Build Your Plan subscription builder
- [ ] Real Stripe integration

---

## Files Modified

| File | Changes |
|------|---------|
| `app/components/layout/Header.tsx` | Add credit balance, update dropdown |
| `app/page.tsx` | Add cart state, new view rendering |
| `app/types/brisnet.ts` | New file - type definitions |
| `app/data/brisnetProducts.ts` | New file - mock data |
| `app/components/brisnet/*` | New directory - all store components |

---

## Design Tokens (DerbyDash Theme)

```typescript
// Colors to use
primary: '#005a87'      // Deep navy blue
secondary: '#ff6b35'    // Vibrant orange (featured items)
background: '#0a0a1a'   // Dark background
cardBg: '#242939'       // Card background
success: '#00c853'      // Credits, positive actions

// Consistent with existing patterns
- Use MUI Joy UI components
- Theme-aware sx props
- Responsive grid with Stack/Grid
```

---

## Testing Checklist

- [ ] Products display correctly
- [ ] Filters work (track, type, creator)
- [ ] Add to cart works
- [ ] Cart drawer opens/closes
- [ ] Credit balance shows in header
- [ ] Dual pricing toggles in cart
- [ ] Mobile responsive
- [ ] Both themes work (DerbyDash dark, TwinSpires light)

---

*This mockup supports the December 2025 planning sessions for Neo-Brisnet modernization.*
