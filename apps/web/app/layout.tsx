import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { Navigation } from '@/components/Navigation';

// Using Inter as fallback since we don't have Cabinet Grotesk/Satoshi fonts yet
const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
});

export const metadata: Metadata = {
  title: 'Nate | Founder & Builder',
  description: 'Building products that matter. Exploring ideas and shipping MVPs.',
  keywords: ['founder', 'entrepreneur', 'product', 'startup', 'developer'],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={inter.variable}>
      <body className="font-sans">
        <Navigation />
        <main>{children}</main>
      </body>
    </html>
  );
}
