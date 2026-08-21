'use client';

import { IconButton } from '@/components/ui/icon-button';
import { useEvidence } from '@/components/validate/evidence/evidence-context';
import { EvidenceExplorer } from '@/components/validate/explorer/evidence-explorer';
import { APP_CHROME } from '@/lib/content/app';
import { EMPTY_FACETS } from '@/lib/explorer-facets';
import * as Dialog from '@radix-ui/react-dialog';
import { X } from 'lucide-react';

/**
 * The full-height dialog `EvidenceButton` opens (D16, C16).
 *
 * **Why an overlay and not a route push**, recorded here so it isn't
 * relitigated: D16 says evidence is *a layer available everywhere, not a fifth
 * destination*, and a push makes it exactly the fifth destination while
 * throwing away the reader's scroll position mid-report. Interaction depth
 * stays at one, and Esc returns you to the same pixel.
 *
 * `/r/[slug]/sources` remains a real, linkable, shareable route — the URL is
 * the whole access model, and an evidence view you cannot paste to someone
 * would contradict the product's only distribution mechanic. Both entry points
 * render the same composition; the route wraps it in `RunShell`, this wraps it
 * in the dialog.
 *
 * **A13 swapped the body and left the chrome alone**, exactly as C16 planned
 * it: A4 built this dialog around `SourcesList` so the chrome was real and
 * working from session 3, and the body is now the same `EvidenceExplorer` the
 * route renders. `SourcesList` is deleted in the same commit — leaving it
 * behind would have kept R14's third dimension vocabulary alive.
 *
 * **`syncUrl={false}`.** A dialog is a layer over whatever route you were
 * reading; writing `?dim=MONEY` onto `/validate`'s URL from inside it would
 * corrupt the one thing this product distributes.
 *
 * **The header hides `EvidenceButton` on `/sources`**, so this overlay and the
 * route explorer are never mounted at once — two of them would both publish a
 * drawer scope and the unfiltered one would win.
 */
export function EvidenceOverlay({ slug, citedIds }: { slug: string; citedIds: string[] }) {
  const { evidence, discarded, layer, closeExplorer, triggerRef } = useEvidence();
  const open = layer.kind === 'explorer';

  return (
    <Dialog.Root
      open={open}
      onOpenChange={(next) => {
        if (!next) closeExplorer();
      }}
    >
      <Dialog.Portal>
        {/* With no `Dialog.Trigger` in the tree, Radix's own restore lands on
            <body> and drops a keyboard reader at the top of the document.
            `openExplorer` records the trigger; this puts focus back on it. */}
        <Dialog.Content
          className="ob-evidence-overlay"
          id="evidence-explorer"
          onCloseAutoFocus={(event) => {
            event.preventDefault();
            triggerRef.current?.focus();
          }}
        >
          <div className="ob-evidence-overlay-head">
            <Dialog.Title className="ob-h3">{APP_CHROME.explorerTitle}</Dialog.Title>
            <Dialog.Description className="sr-only">
              Every excerpt this run checked.
            </Dialog.Description>
            <Dialog.Close asChild>
              <IconButton label="Close">
                <X size={18} />
              </IconButton>
            </Dialog.Close>
          </div>
          <div className="ob-evidence-overlay-body">
            <EvidenceExplorer
              slug={slug}
              evidence={evidence}
              discarded={discarded}
              citedIds={citedIds}
              initialFacets={EMPTY_FACETS}
              syncUrl={false}
            />
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
