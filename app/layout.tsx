import type { Metadata } from 'next';
import { Geist, Geist_Mono, IBM_Plex_Mono, Inter_Tight } from 'next/font/google';
import '@/styles/globals.css';

/* Obsidian (landing page): Geist stands in for Aeonik — weight 400 at every
   size, authority from scale and negative tracking rather than weight. Geist
   Mono carries the metadata layer only. These variables are read exclusively
   from the [data-theme='obsidian'] token block; nothing outside the landing
   route resolves them. */
const geist = Geist({
  subsets: ['latin'],
  variable: '--font-geist',
  display: 'swap',
});

const geistMono = Geist_Mono({
  subsets: ['latin'],
  variable: '--font-geist-mono',
  display: 'swap',
});

/* Deep Canopy: Inter Tight carries display, text, and UI; IBM Plex Mono is
   metadata only. No third face. The CSS variable names here are the contract
   with `--font-display` / `--font-text` / `--font-mono` in styles/tokens.css. */

/* Variable font — covers the 300..800 range the system's weight scale uses. */
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
  title: 'Groundwork — from a hunch to something you can defend',
  description:
    'Describe a half-formed idea. Get a written brief, a research report where every claim is matched to text on a real page, and a list of what to do next. No score. No verdict. No login.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en"
      className={`${interTight.variable} ${plexMono.variable} ${geist.variable} ${geistMono.variable}`}
    >
      <body>{children}</body>
    </html>
  );
}
