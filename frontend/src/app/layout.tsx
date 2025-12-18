import type { Metadata } from 'next';
import { CssVarsProvider } from '@mui/joy/styles';
import CssBaseline from '@mui/joy/CssBaseline';
import theme from '@/theme';

export const metadata: Metadata = {
  title: 'Neo-Brisnet | Handicapping Store',
  description: 'Modern e-commerce platform for handicapping products with dual pricing (cash + credits)',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <CssVarsProvider theme={theme}>
          <CssBaseline />
          {children}
        </CssVarsProvider>
      </body>
    </html>
  );
}
