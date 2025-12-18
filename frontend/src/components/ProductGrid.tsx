/**
 * ProductGrid Component
 * Displays products in a responsive grid
 */

'use client';

import { Box, Typography, CircularProgress } from '@mui/joy';
import ProductCard from './ProductCard';
import { Product } from '@/types';

interface ProductGridProps {
  products: Product[];
  loading: boolean;
  onAddToCart: (product: Product, paymentMethod: 'cash' | 'credits') => void;
}

export default function ProductGrid({ products, loading, onAddToCart }: ProductGridProps) {
  if (loading) {
    return (
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          minHeight: 400,
        }}
      >
        <CircularProgress size="lg" />
      </Box>
    );
  }

  if (products.length === 0) {
    return (
      <Box
        sx={{
          textAlign: 'center',
          py: 8,
        }}
      >
        <Typography level="h4" sx={{ mb: 1 }}>
          No products found
        </Typography>
        <Typography level="body-md" sx={{ color: 'text.tertiary' }}>
          Try adjusting your filters
        </Typography>
      </Box>
    );
  }

  return (
    <>
      {/* Header */}
      <Box sx={{ mb: 3 }}>
        <Typography level="h4" sx={{ mb: 0.5 }}>
          Handicapping Products
        </Typography>
        <Typography level="body-sm" sx={{ color: 'text.tertiary' }}>
          {products.length} products available
        </Typography>
      </Box>

      {/* Grid */}
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: {
            xs: '1fr',
            sm: 'repeat(2, 1fr)',
            md: 'repeat(3, 1fr)',
            lg: 'repeat(4, 1fr)',
          },
          gap: 3,
        }}
      >
        {products.map((product) => (
          <ProductCard
            key={product.id}
            product={product}
            onAddToCart={onAddToCart}
          />
        ))}
      </Box>
    </>
  );
}
