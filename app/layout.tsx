import type { Metadata } from 'next';
import { GeistSans } from 'geist/font/sans';
import { GeistMono } from 'geist/font/mono';
import './globals.css';

export const metadata: Metadata = {
  title: 'Competitive Intelligence Dashboard',
  description: 'AI-powered competitive analysis platform for discovering and analyzing your competitors',
  openGraph: {
    title: 'Competitive Intelligence Dashboard',
    description: 'AI-powered competitive analysis platform for discovering and analyzing your competitors',
    type: 'website',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${GeistSans.variable} ${GeistMono.variable}`}>
      <body className="font-sans antialiased">
        {children}
      </body>
    </html>
  );
}
