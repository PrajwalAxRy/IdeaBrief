import * as PopoverPrimitive from '@radix-ui/react-popover';
import type { ReactNode } from 'react';

interface PopoverProps {
  /** Omit for uncontrolled (Radix manages its own open state). Citation chips pass these to own the 300ms hover delay themselves. */
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  trigger: ReactNode;
  children: ReactNode;
  side?: 'top' | 'bottom' | 'left' | 'right';
  /** Composed onto `.ob-popover` — `CitationChip` passes `.ob-cite-pop`, which
   *  narrows the measure and drops to the surface step. Additive only; the
   *  base recipe is never replaced. */
  className?: string;
}

/**
 * A 1-2 second peek — citation chips only. The 300ms hover-open delay is the
 * caller's responsibility (e.g. CitationChip), since Radix Popover itself is
 * click-triggered; this wrapper just renders the controlled/uncontrolled
 * primitive and needs no hooks of its own.
 */
export function Popover({
  open,
  onOpenChange,
  trigger,
  children,
  side = 'top',
  className = '',
}: PopoverProps) {
  return (
    <PopoverPrimitive.Root open={open} onOpenChange={onOpenChange}>
      <PopoverPrimitive.Trigger asChild>{trigger}</PopoverPrimitive.Trigger>
      <PopoverPrimitive.Portal>
        <PopoverPrimitive.Content
          className={['ob-popover', className].filter(Boolean).join(' ')}
          side={side}
          sideOffset={8}
        >
          {children}
        </PopoverPrimitive.Content>
      </PopoverPrimitive.Portal>
    </PopoverPrimitive.Root>
  );
}
