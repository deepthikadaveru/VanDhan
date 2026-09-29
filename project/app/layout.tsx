import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { Toaster } from '@/components/ui/sonner';
import { AppProviders } from '@/components/providers';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'VanDhan ScholarConnect — Ministry of Tribal Affairs Scholarship Services',
  description:
    'One verified profile, one scholarship timeline, one trusted journey for every tribal student. A unified platform for all MoTA scholarship schemes.',
  manifest: '/manifest.json',
  applicationName: 'VanDhan ScholarConnect',
  authors: [{ name: 'Ministry of Tribal Affairs, Government of India' }],
  keywords: ['scholarship', 'tribal', 'MoTA', 'ST students', 'India', 'SIH 2026'],
};

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  themeColor: '#176B45',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <AppProviders>{children}</AppProviders>
        <Toaster position="top-center" richColors />
      </body>
    </html>
  );
}
