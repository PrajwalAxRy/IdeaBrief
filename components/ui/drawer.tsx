'use client';

import * as Dialog from '@radix-ui/react-dialog';
import { X } from 'lucide-react';
import { AnimatePresence, motion } from 'motion/react';
import type { ReactNode } from 'react';
import { IconButton } from './icon-button';

/** Matches `--ease-out` (`cubic-bezier(0.16, 1, 0.3, 1)`) — tokens.css can't be read at the JS layer. */
const EASE_OUT = [0.16, 1, 0.3, 1] as const;

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
 * Right-side, 520px, focus-trapped, Esc to close — all handled by Radix
 * Dialog. Enter/exit now driven by the `motion` package (P11 scope: "the
 * motion package used only for Drawer and Modal enter/exit") rather than the
 * CSS `[data-state]` keyframes P6 shipped with — `forceMount` on the Portal
 * and `asChild` on Overlay/Content hand the actual mount timing to
 * `AnimatePresence` instead of Radix's own show/hide, per the documented
 * Radix+Motion integration pattern. `AnimatePresence` needs real client
 * lifecycle (not just a client-marked import), so this file now carries
 * `'use client'` — a logged addition beyond the 13-name allowlist, but one
 * this exact phase's scope calls for.
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
      <AnimatePresence>
        {open && (
          <Dialog.Portal forceMount>
            <Dialog.Overlay asChild forceMount>
              <motion.div
                className="ob-overlay"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.18, ease: EASE_OUT }}
              />
            </Dialog.Overlay>
            <Dialog.Content asChild forceMount onCloseAutoFocus={onCloseAutoFocus}>
              <motion.div
                className="ob-drawer"
                initial={{ x: '100%' }}
                animate={{ x: 0 }}
                exit={{ x: '100%' }}
                transition={{ duration: 0.32, ease: EASE_OUT }}
              >
                <div className="ob-drawer-head">
                  <Dialog.Title className="ob-h3">{title}</Dialog.Title>
                  <Dialog.Description className="sr-only">{title}</Dialog.Description>
                  <Dialog.Close asChild>
                    <IconButton label="Close">
                      <X size={18} />
                    </IconButton>
                  </Dialog.Close>
                </div>
                <div className="ob-drawer-body">{children}</div>
                {footer && <div className="ob-drawer-foot">{footer}</div>}
              </motion.div>
            </Dialog.Content>
          </Dialog.Portal>
        )}
      </AnimatePresence>
    </Dialog.Root>
  );
}
