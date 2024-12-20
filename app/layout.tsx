import './globals.css';
import { Inter } from 'next/font/google';
import { ClerkProvider } from '@clerk/nextjs';
import { SidebarProvider } from '@/components/ui/sidebar';
import { Toaster } from "@/components/ui/toaster"
import { Analytics } from '@vercel/analytics/next';
import { SpeedInsights } from '@vercel/speed-insights/next';
import Provider from './provider';
import Navbar from "@/components/navbar-client";
import MobileSidebar from '@/components/mobile-sidebar';

export const metadata = {
  icons: {
    icon: '/favicon.ico'
  },
  title: {
    default: 'CoinCard',
    template: '%s'
  },
  description: 'Improve your learning capabilities with CoinCard'
};

const inter = Inter({ subsets: ['latin'] });

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <ClerkProvider>
      <html lang="en">
        <SidebarProvider>
          <body className={inter.className}>
            <Provider>
              <Navbar />
              <main>{children}</main>
              <Toaster />
              <MobileSidebar />
              <Analytics />
              <SpeedInsights />
            </Provider>
          </body>
        </SidebarProvider>
      </html>
    </ClerkProvider>
  );
}