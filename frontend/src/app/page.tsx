'use client';

import { useState, useEffect } from 'react';
import { Box, Container } from '@mui/joy';
import Header from '@/components/Header';
import ProductGrid from '@/components/ProductGrid';
import ProductFilters from '@/components/ProductFilters';
import CartDrawer from '@/components/CartDrawer';
import { Product, CartItem } from '@/types';

export default function Home() {
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [cartOpen, setCartOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    tracks: [] as string[],
    productTypes: [] as string[],
    creators: [] as string[],
  });

  // Fetch products on mount
  useEffect(() => {
    fetchProducts();
  }, []);

  // Apply filters when they change
  useEffect(() => {
    applyFilters();
  }, [products, filters]);

  const fetchProducts = async () => {
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';
      const response = await fetch(`${apiUrl}/products`);
      const data = await response.json();
      setProducts(data.products);
      setFilteredProducts(data.products);
    } catch (error) {
      console.error('Error fetching products:', error);
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = () => {
    let filtered = [...products];

    if (filters.tracks.length > 0) {
      filtered = filtered.filter((p) =>
        filters.tracks.includes(p.tags.track || '')
      );
    }

    if (filters.productTypes.length > 0) {
      filtered = filtered.filter((p) =>
        filters.productTypes.includes(p.tags.productType)
      );
    }

    if (filters.creators.length > 0) {
      filtered = filtered.filter((p) =>
        filters.creators.includes(p.tags.creator || '')
      );
    }

    setFilteredProducts(filtered);
  };

  const addToCart = (product: Product, paymentMethod: 'cash' | 'credits' = 'cash') => {
    const existing = cart.find((item) => item.product.id === product.id);

    if (existing) {
      // Update payment method
      setCart(
        cart.map((item) =>
          item.product.id === product.id ? { ...item, paymentMethod } : item
        )
      );
    } else {
      // Add new item
      setCart([...cart, { product, paymentMethod }]);
    }

    setCartOpen(true);
  };

  const removeFromCart = (productId: string) => {
    setCart(cart.filter((item) => item.product.id !== productId));
  };

  const updatePaymentMethod = (productId: string, paymentMethod: 'cash' | 'credits') => {
    setCart(
      cart.map((item) =>
        item.product.id === productId ? { ...item, paymentMethod } : item
      )
    );
  };

  const clearCart = () => {
    setCart([]);
  };

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'background.body' }}>
      <Header
        cartItemCount={cart.length}
        onCartClick={() => setCartOpen(true)}
      />

      <Container maxWidth="xl" sx={{ py: 4 }}>
        <Box sx={{ display: 'flex', gap: 3 }}>
          {/* Filters Sidebar */}
          <Box sx={{ width: 250, flexShrink: 0 }}>
            <ProductFilters
              filters={filters}
              onFiltersChange={setFilters}
              products={products}
            />
          </Box>

          {/* Product Grid */}
          <Box sx={{ flex: 1 }}>
            <ProductGrid
              products={filteredProducts}
              loading={loading}
              onAddToCart={addToCart}
            />
          </Box>
        </Box>
      </Container>

      {/* Cart Drawer */}
      <CartDrawer
        open={cartOpen}
        onClose={() => setCartOpen(false)}
        cart={cart}
        onRemoveItem={removeFromCart}
        onUpdatePaymentMethod={updatePaymentMethod}
        onClearCart={clearCart}
      />
    </Box>
  );
}
