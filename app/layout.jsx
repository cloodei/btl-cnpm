import './globals.css';
import { Inter } from 'next/font/google';
import { ThemeProvider } from '@/components/theme-provider';
import { ClerkProvider } from '@clerk/nextjs';
import { SidebarProvider } from '@/components/ui/sidebar';
import { Toaster } from "@/components/ui/toaster"
import { QuizProvider } from '@/contexts/QuizContext';
import { QueryProvider } from './provider';
import Navbar from "@/components/navbar-client";
import MobileSidebar from '@/components/mobile-sidebar';

const inter = Inter({ subsets: ['latin'] });

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

export default function RootLayout({ children }) {
  return (
  <ClerkProvider>
    <html lang="en">
      <SidebarProvider>
        <body className={inter.className}>
          <QueryProvider>
            <ThemeProvider attribute="class" defaultTheme="dark" enableSystem={false} disableTransitionOnChange>
              <QuizProvider>
                <Navbar />
                <main>{children}</main>
                <Toaster />
                <MobileSidebar />
              </QuizProvider>
            </ThemeProvider>
          </QueryProvider>
        </body>
      </SidebarProvider>
    </html>
  </ClerkProvider>
  );
}