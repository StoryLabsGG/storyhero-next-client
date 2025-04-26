import './globals.css';

import type { Metadata } from 'next';
import { Poppins } from 'next/font/google';

const poppins = Poppins({
  variable: '--font-poppins',
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
});

export const metadata: Metadata = {
  title: 'StoryHero - AI Viral Clips',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${poppins.variable} dark antialiased`}>{children}</body>
    </html>
  );
}
