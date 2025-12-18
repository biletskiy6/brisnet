/**
 * Header Component
 * Top navigation with credit balance and cart
 */

'use client';

import { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  IconButton,
  Badge,
  Chip,
  Sheet,
} from '@mui/joy';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import { CreditBalance } from '@/types';

interface HeaderProps {
  cartItemCount: number;
  onCartClick: () => void;
}

export default function Header({ cartItemCount, onCartClick }: HeaderProps) {
  const [credits, setCredits] = useState<CreditBalance | null>(null);

  useEffect(() => {
    fetchCreditBalance();
  }, []);

  const fetchCreditBalance = async () => {
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';
      const response = await fetch(`${apiUrl}/credits/balance`, {
        headers: {
          'X-User-Id': 'mock-user-123',
        },
      });
      const data = await response.json();
      setCredits(data);
    } catch (error) {
      console.error('Error fetching credit balance:', error);
    }
  };

  return (
    <Sheet
      sx={{
        position: 'sticky',
        top: 0,
        zIndex: 1000,
        borderBottom: '1px solid',
        borderColor: 'divider',
        py: 2,
      }}
    >
      <Box
        sx={{
          maxWidth: 'xl',
          mx: 'auto',
          px: 3,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        {/* Logo */}
        <Box>
          <Typography level="h3" component="h1" sx={{ fontWeight: 'bold' }}>
            🏇 Neo-Brisnet
          </Typography>
          <Typography level="body-sm" sx={{ color: 'text.tertiary' }}>
            Handicapping Store
          </Typography>
        </Box>

        {/* Right side: Credits & Cart */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          {/* Credit Balance */}
          {credits && (
            <Box>
              <Chip
                size="lg"
                variant="soft"
                color="success"
                sx={{ fontWeight: 'bold' }}
              >
                🎫 {credits.balance.toLocaleString()} credits
              </Chip>
              {credits.expiringCredits.length > 0 && (
                <Typography level="body-xs" sx={{ mt: 0.5, textAlign: 'center' }}>
                  ⚠️ {credits.expiringCredits[0].amount} expiring soon
                </Typography>
              )}
            </Box>
          )}

          {/* Cart Button */}
          <IconButton
            variant="outlined"
            color="neutral"
            size="lg"
            onClick={onCartClick}
          >
            <Badge badgeContent={cartItemCount} color="primary">
              <ShoppingCartIcon />
            </Badge>
          </IconButton>
        </Box>
      </Box>
    </Sheet>
  );
}
