/**
 * MUI Joy UI Theme Configuration
 * Based on Neo-Brisnet design system
 */

import { extendTheme } from '@mui/joy/styles';

const theme = extendTheme({
  colorSchemes: {
    dark: {
      palette: {
        primary: {
          50: '#e3f2fd',
          100: '#bbdefb',
          200: '#90caf9',
          300: '#64b5f6',
          400: '#42a5f5',
          500: '#005a87', // Deep navy blue (brand color)
          600: '#004a6e',
          700: '#003a56',
          800: '#002a3e',
          900: '#001a26',
        },
        warning: {
          500: '#ff6b35', // Vibrant orange (featured items)
        },
        success: {
          500: '#00c853', // Credits, positive actions
        },
        background: {
          body: '#0a0a1a', // Dark background
          surface: '#242939', // Card background
        },
      },
    },
    light: {
      palette: {
        primary: {
          500: '#005a87',
        },
        warning: {
          500: '#ff6b35',
        },
        success: {
          500: '#00c853',
        },
      },
    },
  },
  fontFamily: {
    body: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
    display: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
  },
  components: {
    JoyCard: {
      styleOverrides: {
        root: {
          transition: 'all 0.2s ease-in-out',
          '&:hover': {
            transform: 'translateY(-4px)',
            boxShadow: 'lg',
          },
        },
      },
    },
  },
});

export default theme;
