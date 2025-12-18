/**
 * CartDrawer Component
 * Slide-out cart with payment method toggle per item
 */

'use client';

import { useState } from 'react';
import {
  Drawer,
  Box,
  Typography,
  IconButton,
  Button,
  Radio,
  RadioGroup,
  Divider,
  Sheet,
  Alert,
} from '@mui/joy';
import CloseIcon from '@mui/icons-material/Close';
import DeleteIcon from '@mui/icons-material/Delete';
import { CartItem } from '@/types';

interface CartDrawerProps {
  open: boolean;
  onClose: () => void;
  cart: CartItem[];
  onRemoveItem: (productId: string) => void;
  onUpdatePaymentMethod: (productId: string, paymentMethod: 'cash' | 'credits') => void;
  onClearCart: () => void;
}

export default function CartDrawer({
  open,
  onClose,
  cart,
  onRemoveItem,
  onUpdatePaymentMethod,
  onClearCart,
}: CartDrawerProps) {
  const [checkoutLoading, setCheckoutLoading] = useState(false);
  const [checkoutSuccess, setCheckoutSuccess] = useState(false);

  // Calculate totals
  const cashTotal = cart
    .filter((item) => item.paymentMethod === 'cash')
    .reduce((sum, item) => sum + Number(item.product.cashPrice), 0);

  const creditsTotal = cart
    .filter((item) => item.paymentMethod === 'credits')
    .reduce((sum, item) => sum + item.product.creditPrice, 0);

  const handleCheckout = async () => {
    setCheckoutLoading(true);

    try {
      // Mock checkout - in production, call API
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

      // Determine checkout endpoint
      let endpoint = '/checkout/mixed';
      if (cashTotal === 0 && creditsTotal > 0) {
        endpoint = '/checkout/credits';
      } else if (cashTotal > 0 && creditsTotal === 0) {
        endpoint = '/checkout/cash';
      }

      const response = await fetch(`${apiUrl}${endpoint}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-User-Id': 'mock-user-123',
        },
        body: JSON.stringify({
          cardDetails: cashTotal > 0 ? {
            number: '4111111111111111',
            expiryMonth: 12,
            expiryYear: 2026,
            cvc: '123',
            name: 'Test User',
          } : undefined,
        }),
      });

      if (response.ok) {
        setCheckoutSuccess(true);
        setTimeout(() => {
          onClearCart();
          setCheckoutSuccess(false);
          onClose();
        }, 2000);
      }
    } catch (error) {
      console.error('Checkout error:', error);
    } finally {
      setCheckoutLoading(false);
    }
  };

  return (
    <Drawer
      anchor="right"
      open={open}
      onClose={onClose}
      sx={{
        '& .MuiDrawer-content': {
          width: { xs: '100%', sm: 450 },
        },
      }}
    >
      <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
        {/* Header */}
        <Sheet
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            p: 2,
            borderBottom: '1px solid',
            borderColor: 'divider',
          }}
        >
          <Typography level="h4" sx={{ fontWeight: 'bold' }}>
            Shopping Cart
          </Typography>
          <IconButton variant="plain" onClick={onClose}>
            <CloseIcon />
          </IconButton>
        </Sheet>

        {/* Cart Items */}
        <Box sx={{ flex: 1, overflow: 'auto', p: 2 }}>
          {cart.length === 0 ? (
            <Box sx={{ textAlign: 'center', py: 8 }}>
              <Typography level="body-lg" sx={{ color: 'text.tertiary' }}>
                Your cart is empty
              </Typography>
            </Box>
          ) : (
            <>
              {cart.map((item) => (
                <Sheet
                  key={item.product.id}
                  variant="outlined"
                  sx={{ p: 2, mb: 2, borderRadius: 'sm' }}
                >
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                    <Typography level="title-sm" sx={{ fontWeight: 'bold', flex: 1 }}>
                      {item.product.name}
                    </Typography>
                    <IconButton
                      size="sm"
                      variant="plain"
                      color="danger"
                      onClick={() => onRemoveItem(item.product.id)}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </Box>

                  {/* Payment Method Toggle */}
                  <RadioGroup
                    value={item.paymentMethod}
                    onChange={(e) =>
                      onUpdatePaymentMethod(
                        item.product.id,
                        e.target.value as 'cash' | 'credits'
                      )
                    }
                  >
                    <Radio
                      value="cash"
                      label={`Pay $${item.product.cashPrice.toFixed(2)}`}
                      size="sm"
                    />
                    <Radio
                      value="credits"
                      label={`Use ${item.product.creditPrice} credits`}
                      size="sm"
                    />
                  </RadioGroup>
                </Sheet>
              ))}

              {cart.length > 1 && (
                <Button
                  variant="outlined"
                  color="danger"
                  size="sm"
                  fullWidth
                  onClick={onClearCart}
                >
                  Clear Cart
                </Button>
              )}
            </>
          )}
        </Box>

        {/* Footer with Totals */}
        {cart.length > 0 && (
          <Sheet
            sx={{
              p: 2,
              borderTop: '1px solid',
              borderColor: 'divider',
            }}
          >
            {checkoutSuccess && (
              <Alert color="success" sx={{ mb: 2 }}>
                ✅ Purchase successful!
              </Alert>
            )}

            <Box sx={{ mb: 2 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                <Typography level="body-sm">Cash Total:</Typography>
                <Typography level="title-md" sx={{ fontWeight: 'bold' }}>
                  ${cashTotal.toFixed(2)}
                </Typography>
              </Box>
              <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Typography level="body-sm">Credits Total:</Typography>
                <Typography level="title-md" sx={{ fontWeight: 'bold', color: 'success.500' }}>
                  {creditsTotal} credits
                </Typography>
              </Box>
            </Box>

            <Divider sx={{ my: 2 }} />

            <Button
              fullWidth
              size="lg"
              variant="solid"
              color="primary"
              loading={checkoutLoading}
              onClick={handleCheckout}
            >
              Checkout
            </Button>
          </Sheet>
        )}
      </Box>
    </Drawer>
  );
}
