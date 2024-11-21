import './globals.css';
import { Inter } from 'next/font/google';
import { ThemeProvider } from '@/components/theme-provider';
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from '@vercel/speed-insights/next';
import { ClerkProvider } from '@clerk/nextjs';
import { SidebarProvider } from '@/components/ui/sidebar';
import Navbar from "@/components/navbar-client";
import MobileSidebar from '@/components/mobile-sidebar';

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
  title: {
    default: 'CoinCard',
    template: '%s'
  }
}; 

export default async function RootLayout({ children }) {
  return (
  <ClerkProvider>
    <html lang="en">
      <SidebarProvider>
        <body className={inter.className}>
          <ThemeProvider attribute="class" defaultTheme="dark" enableSystem={false} disableTransitionOnChange>
            <Navbar />
            <main>{children}</main>
            <MobileSidebar />
            <Analytics />
            <SpeedInsights />
          </ThemeProvider>
        </body>
      </SidebarProvider>
    </html>
  </ClerkProvider>
  );
}