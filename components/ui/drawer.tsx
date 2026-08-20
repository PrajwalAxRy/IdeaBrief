import * as Dialog from '@radix-ui/react-dialog';
import { X } from 'lucide-react';
import type { ReactNode } from 'react';
import { IconButton } from './icon-button';

interface DrawerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  children: ReactNode;
  footer?: ReactNode;
  /**
   * Passthrough to Radix's `Dialog.Content` — override when the default
   * restore-to-`document.activeElement`-at-mount-time doesn't target the
   * right element (found in P6: with no `Dialog.Trigger` in the tree at all,
   * a fully externally-controlled `open` prop, Radix's own default restore
   * unreliably lands on `<body>` instead of the triggering element — verified
   * live via the Playwright MCP, not just from docs). `EvidenceDrawer` uses
   * this to restore focus to whatever was focused when `open()` was called.
   */
  onCloseAutoFocus?: (event: Event) => void;
}

/**
 * Right-side, 480px, focus-trapped, Esc to close, focus restored on close —
 * all handled by Radix Dialog. This wrapper holds no state of its own (the
 * open/close state lives in the one global Evidence context), so the file
 * needs no 'use client' — Radix's own package already declares it.
 */
export function Drawer({
  open,
  onOpenChange,
  title,
  children,
  footer,
  onCloseAutoFocus,
}: DrawerProps) {
  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className="drawer-overlay" />
        <Dialog.Content className="drawer-content" onCloseAutoFocus={onCloseAutoFocus}>
          <div
            className="flex items-center justify-between px-6 py-4"
            style={{ borderBottom: '1px solid var(--border-subtle)' }}
          >
            <Dialog.Title style={{ color: 'var(--text-primary)', fontWeight: 600 }}>
              {title}
            </Dialog.Title>
            <Dialog.Description className="sr-only">{title}</Dialog.Description>
            <Dialog.Close asChild>
              <IconButton label="Close">
                <X size={18} />
              </IconButton>
            </Dialog.Close>
          </div>
          <div className="flex-1 overflow-y-auto px-6 py-4">{children}</div>
          {footer && (
            <div className="px-6 py-4" style={{ borderTop: '1px solid var(--border-subtle)' }}>
              {footer}
            </div>
          )}
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
