'use client';

import * as Collapsible from '@radix-ui/react-collapsible';
import { ChevronDown } from 'lucide-react';
import { useState } from 'react';
import type { ReactNode } from 'react';

interface AccordionProps {
  title: ReactNode;
  children: ReactNode;
  defaultOpen?: boolean;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  className?: string;
}

/**
 * Expand/collapse with a rotating chevron. Uses Radix Collapsible for
 * correct ARIA/keyboard behaviour, but animates via our own
 * `grid-template-rows: 0fr -> 1fr` wrapper rather than Radix's default
 * height animation — max-height reads as jumpy with variable content.
 * Never auto-collapses siblings; each instance owns its own state, which is
 * why it's one of the thirteen components allowed 'use client'.
 */
export function Accordion({
  title,
  children,
  defaultOpen = false,
  open,
  onOpenChange,
  className = '',
}: AccordionProps) {
  const [internalOpen, setInternalOpen] = useState(defaultOpen);
  const isControlled = open !== undefined;
  const isOpen = isControlled ? open : internalOpen;

  function handleOpenChange(next: boolean) {
    if (!isControlled) setInternalOpen(next);
    onOpenChange?.(next);
  }

  return (
    <Collapsible.Root
      open={isOpen}
      onOpenChange={handleOpenChange}
      className={['accordion-item', className].filter(Boolean).join(' ')}
    >
      <Collapsible.Trigger className="accordion-trigger">
        {title}
        <ChevronDown size={18} className="accordion-chevron" />
      </Collapsible.Trigger>
      <div className="accordion-content-wrapper" data-state={isOpen ? 'open' : 'closed'}>
        <div className="accordion-content-inner" inert={!isOpen}>
          <Collapsible.Content forceMount className="pb-4">
            {children}
          </Collapsible.Content>
        </div>
      </div>
    </Collapsible.Root>
  );
}
