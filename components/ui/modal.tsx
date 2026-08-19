import * as Dialog from '@radix-ui/react-dialog';
import type { ReactNode } from 'react';

interface ModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description?: string;
  children: ReactNode;
}

/**
 * Centred, 440px. Used exactly twice in the product: discarding a
 * conversation and re-running research. Never for primary content. Same
 * hook-free wrapper pattern as Drawer — no 'use client' needed here.
 */
export function Modal({ open, onOpenChange, title, description, children }: ModalProps) {
  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className="modal-overlay" />
        <Dialog.Content className="modal-content">
          <Dialog.Title
            style={{
              color: 'var(--text-primary)',
              fontSize: 'var(--text-h3)',
              fontWeight: 700,
              marginBottom: 'var(--sp-3)',
            }}
          >
            {title}
          </Dialog.Title>
          {description ? (
            <Dialog.Description style={{ color: 'var(--text-body)', marginBottom: 'var(--sp-6)' }}>
              {description}
            </Dialog.Description>
          ) : (
            <Dialog.Description className="sr-only">{title}</Dialog.Description>
          )}
          {children}
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
