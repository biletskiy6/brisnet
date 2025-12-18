/**
 * ProductCard Component
 * Displays a single product with dual pricing
 */

'use client';

import {
  Card,
  CardContent,
  CardCover,
  Typography,
  Box,
  Button,
  Chip,
} from '@mui/joy';
import { Product } from '@/types';

interface ProductCardProps {
  product: Product;
  onAddToCart: (product: Product, paymentMethod: 'cash' | 'credits') => void;
}

export default function ProductCard({ product, onAddToCart }: ProductCardProps) {
  return (
    <Card
      variant="outlined"
      sx={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        position: 'relative',
      }}
    >
      {/* Featured Badge */}
      {product.isFeatured && (
        <Chip
          size="sm"
          color="warning"
          sx={{
            position: 'absolute',
            top: 8,
            right: 8,
            zIndex: 1,
            fontWeight: 'bold',
          }}
        >
          ⭐ Featured
        </Chip>
      )}

      {/* Thumbnail */}
      <Box
        sx={{
          position: 'relative',
          height: 180,
          bgcolor: 'background.level1',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Typography level="h1" sx={{ opacity: 0.1 }}>
          {product.contentType.toUpperCase()}
        </Typography>

        {/* Content Type Badge */}
        <Chip
          size="sm"
          variant="soft"
          sx={{
            position: 'absolute',
            bottom: 8,
            left: 8,
          }}
        >
          {product.contentType}
        </Chip>
      </Box>

      <CardContent sx={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 1 }}>
        {/* Product Name */}
        <Typography level="title-md" sx={{ fontWeight: 'bold' }}>
          {product.name}
        </Typography>

        {/* Tags */}
        <Box sx={{ display: 'flex', gap: 0.5, flexWrap: 'wrap' }}>
          {product.tags.track && (
            <Chip size="sm" variant="outlined">
              {product.tags.track}
            </Chip>
          )}
          {product.tags.creator && (
            <Chip size="sm" variant="outlined" color="primary">
              {product.tags.creator}
            </Chip>
          )}
        </Box>

        {/* Description */}
        <Typography level="body-sm" sx={{ color: 'text.secondary', flex: 1 }}>
          {product.description.substring(0, 100)}
          {product.description.length > 100 && '...'}
        </Typography>

        {/* Dual Pricing */}
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            py: 1,
            borderTop: '1px solid',
            borderColor: 'divider',
          }}
        >
          <Box>
            <Typography level="title-lg" sx={{ fontWeight: 'bold', color: 'primary.500' }}>
              ${product.cashPrice.toFixed(2)}
            </Typography>
            <Typography level="body-xs" sx={{ color: 'text.tertiary' }}>
              or {product.creditPrice} credits
            </Typography>
          </Box>
        </Box>

        {/* Add to Cart Button */}
        <Button
          fullWidth
          variant="solid"
          color="primary"
          onClick={() => onAddToCart(product, 'cash')}
        >
          Add to Cart
        </Button>
      </CardContent>
    </Card>
  );
}
