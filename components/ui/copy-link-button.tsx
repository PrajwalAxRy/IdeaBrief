import { headers } from 'next/headers';
import { CopyButton } from './copy-button';

/**
 * `CopyButton` specialised for the run URL — always present in `RunShell`.
 * An async Server Component (no 'use client' needed): resolves the absolute
 * `/r/[slug]` URL from the request's own `host` header and hands it to
 * `CopyButton` as a plain string, since a closure can't cross the
 * server/client boundary.
 */
export async function CopyLinkButton({
  slug,
  className = '',
}: { slug: string; className?: string }) {
  const headersList = await headers();
  const host = headersList.get('host') ?? 'localhost:3000';
  const protocol = host.startsWith('localhost') || host.startsWith('127.0.0.1') ? 'http' : 'https';
  const url = `${protocol}://${host}/r/${slug}`;

  return <CopyButton text={url} label="Copy link" variant="button" className={className} />;
}
