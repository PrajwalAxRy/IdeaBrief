import type { Metadata } from 'next';
import { IBM_Plex_Mono, Inter_Tight } from 'next/font/google';
import '@/styles/globals.css';

const interTight = Inter_Tight({
  subsets: ['latin'],
  variable: '--font-inter-tight',
  display: 'swap',
});

const plexMono = IBM_Plex_Mono({
  subsets: ['latin'],
  weight: ['400', '500'],
  variable: '--font-plex-mono',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'Startup Validator',
  description:
    'Type an idea. Get a verified brief, a research report, and a build roadmap — no login, no score, no verdict.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${interTight.variable} ${plexMono.variable}`}>
      <body>{children}</body>
    </html>
  );
}
