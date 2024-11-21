import './globals.css';
import { Inter } from 'next/font/google';
import { Navbar } from '@/components/navbar';
import { ThemeProvider } from '@/components/theme-provider';
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from '@vercel/speed-insights/next';
import { ClerkProvider } from '@clerk/nextjs';
import { getUserInfo } from './actions/user';
import { auth } from '@clerk/nextjs/server';

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
  title: {
    default: 'CoinCard',
    template: '%s'
  }
};

export default async function RootLayout({ children }) {
  const { userId } = await auth();
  let { user, success } = await getUserInfo(userId);
  if(!success) {
    user = null;
  }

  return (
  <ClerkProvider>
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem={false}
          disableTransitionOnChange
        >
          <Navbar dbUser={user} />
          <main>{children}</main>
          <Analytics />
          <SpeedInsights />
        </ThemeProvider>
      </body>
    </html>
  </ClerkProvider>
  );
}