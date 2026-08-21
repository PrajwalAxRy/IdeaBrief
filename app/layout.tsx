import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import '@/styles/globals.css';

/* Geist stands in for Aeonik — weight 400 at every size is the signature, and
   authority comes from scale and negative tracking rather than weight. Geist
   Mono carries the metadata layer only. No third face.

   **`data-theme` is gone.** A15 deleted Deep Canopy, so Obsidian is not a theme
   any more — it is the system, and every recipe is global. The attribute's
   removal is why `styles/globals.css`'s `@layer base` had to be folded onto
   `--ob-*` in the same commit: two higher-specificity `[data-theme='obsidian']`
   rules were the only thing keeping the app off Inter Tight and forest green,
   and dropping the attribute would have stopped both matching with no error.

   `Inter_Tight` and `IBM_Plex_Mono` went with it — two Google Font requests on
   every route in the app, for a system nothing renders. */
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

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000';

/**
 * R18 — **sharing a run is the product's entire distribution model, and every
 * shared link previewed as bare text.** There was no `metadataBase`, no
 * `openGraph` block and no image.
 *
 * `metadataBase` is what lets every other file in the tree write
 * `images: ['/og/validate.png']` as a root-relative path and get an absolute
 * URL in the rendered tag; without it Next warns and emits a relative `og:image`
 * that no crawler resolves.
 *
 * The images are code-drawn and committed as static PNGs — an `og:image`
 * pointing at a 404 is worse than no tag at all.
 */
export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  applicationName: 'Groundwork',
  title: {
    default: 'Groundwork — from a hunch to something you can defend',
    template: '%s — Groundwork',
  },
  description:
    'Describe a half-formed idea. Get a written brief, a research report where every claim is matched to text on a real page, and a list of what to do next. No score. No verdict. No login.',
  openGraph: {
    type: 'website',
    siteName: 'Groundwork',
    url: '/',
    title: 'Groundwork — from a hunch to something you can defend',
    description:
      'An evidence-backed picture of an early idea. Every claim matched to text on a real page.',
    images: [
      {
        url: '/og/default.png',
        width: 1200,
        height: 630,
        alt: 'Groundwork — an evidence-backed picture of an early idea.',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${geist.variable} ${geistMono.variable}`}>
      <body>{children}</body>
    </html>
  );
}
