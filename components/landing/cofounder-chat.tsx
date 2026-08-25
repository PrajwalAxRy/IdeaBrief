'use client';

import { createRun } from '@/app/actions/create-run';
import { CHAT_SECTION, PREVIEW_RUNS, PREVIEW_SECTION } from '@/lib/content/landing';
import { ArrowUpRight } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useRef, useState } from 'react';
import { ScrollReveal } from './scroll-reveal';

const SHORTCUT_HINT_AT = 16;

/**
 * The entry point: a headline, the composer that actually starts a run, and a
 * row of three finished runs to open instead.
 *
 * **This section used to be roughly three times this tall.** It carried a
 * scripted six-turn transcript that typed itself character by character when it
 * scrolled into view, inside a 520px fragment card with a header bar and a
 * replay control, with the composer in its foot. Gone with it: `useInView`, the
 * `prefers-reduced-motion` branch, the per-turn `setTimeout` chain, the
 * `TypingBubble` leaf that owned the per-character state, the `runId` replay
 * counter, and `CHAT_SCRIPT` as a consumer.
 *
 * The demo was arguing for something pillar 01 already shows happening on
 * screen a few hundred pixels below — `IdeaSession` is the same conversation,
 * the same fitness idea, still running. Two scripted transcripts on one page is
 * the page making its case twice, and this was the more expensive of the two.
 *
 * `CHAT_SCRIPT` stays exported from `lib/content/landing.ts`: it is the front
 * half of one continuous narrative with `IdeaSession`'s script, and the comment
 * there binds them together.
 *
 * The composer is real — it calls `createRun` and navigates to /r/[slug]/define.
 */
export function CofounderChat() {
  return (
    /* `page.tsx` wraps this in `ob-band-mount`, which draws the slate side of
       the boundary (§12B). It has to sit OUTSIDE `ob-warm`, so it cannot live
       here: inside the remap its hairline would resolve to warm stone and
       vanish into the paper, which is the defect it exists to fix.

       `ob-warm ob-band`: the page alternates, and this section is the light one.
       `ob-warm` remaps the `--ob-*` colour tokens to warm paper (tokens.css) so
       every recipe below inverts without a single override; `ob-band` carries
       the surface and the hairline at each edge. No `<hr>` sits either side of
       this section in `page.tsx` for that reason — the band owns its dividers.

       **No section-rhythm class at all.** This carried `ob-section` (160px),
       then `ob-section-tight` (120px); `.ob-band` now sets its own 96px, the
       documented floor, and stacking a rhythm class on top would only fight it.
       See §12A for why 96 is where this stops. */
    <section id="start" className="ob-warm ob-band" aria-labelledby="chat-headline">
      <div className="ob-container">
        {/* No `SectionHead`, so no `01 START HERE` overline and no numeral. The
            page no longer counts its sections — `Pillars` dropped `02` in the
            same change — and a lone `01` above the only numbered section reads
            as the start of a list that never continues.

            **`ob-h1`, not the `ob-h2` this carried for one revision.** Measured
            against the rest of the page, every other section headline — the hero
            and `how-it-works` — renders at 66.24px, and this was the single
            headline a step below them. A section whose heading is smaller than
            every other section's reads as a subsection of the thing above it.

            Left-aligned, also for consistency: nothing else on the page centres
            a headline. The 760px column stays centred in the container, so the
            headline, the composer and the card grid share one left edge. */}
        <ScrollReveal className="mx-auto max-w-[760px]">
          <h2 id="chat-headline" className="ob-h1 max-w-[20ch]">
            {CHAT_SECTION.headline}
          </h2>
        </ScrollReveal>

        {/* Narrower than the container: a composer at full 1200px stops reading
            as something you type one sentence into. */}
        <ScrollReveal delay={120} className="mx-auto mt-8 max-w-[760px]">
          <Composer />
        </ScrollReveal>

        <PreviewRuns />
      </div>
    </section>
  );
}

/**
 * Four finished runs, under the composer.
 *
 * **Card shape follows `design_inspiration/cardReference`**, minus its glyph:
 * the reference stacks a 40px mark, a gap, a title and a clamped description,
 * and the mark is gone here at the user's direction — the stack now opens on the
 * mono sector line. Three things were translated rather than copied across:
 *
 * - **The reference's `variant="soft"` fill becomes a surface step plus a
 *   hairline.** Obsidian has no shadows and elevation reads as a lightness step,
 *   so the "soft card" idiom is `--ob-surface` on the band's `--ob-canvas`.
 * - **`font-semibold` on the title becomes weight 400 at `--ob-h3`.** Weight is
 *   not how this system makes a title; size and tracking are.
 * - **The mono sector line is an addition.** The reference has no metadata
 *   layer; this system does, and with the glyph gone it is also what tells the
 *   four cards apart at a glance.
 *
 * A plain `next/link` per card, not a card with a nested link: the whole tile is
 * the target, so the anchor *is* the tile. That keeps one tab stop per card and
 * one focus ring around the thing being activated, instead of a focusable box
 * containing a separately focusable link.
 */
function PreviewRuns() {
  return (
    /* **The block is capped at the composer's 760px, not the container's 1200px,
       and that cap is what makes 2×2 work.** Left at full width the two columns
       are ~590px each — cards that wide holding two short lines read as empty,
       and the reference's proportions disappear. At 760px each card is ~370px,
       which is within 30px of the reference's own ~341px columns. It also lines
       the row up with the composer directly above it, so the section reads as
       one centred column rather than as a narrow control sitting on a wide
       grid. */
    <div className="mx-auto mt-12 max-w-[760px]">
      {/* The label alone. Its explanatory line under it is gone — the four
          cards say what they are, and a sentence telling the reader that four
          cards are four cards was restating the row rather than adding to it. */}
      <ScrollReveal>
        <div className="ob-eyebrow ob-meta">
          <span>{PREVIEW_SECTION.label}</span>
        </div>
      </ScrollReveal>

      {/* 2×2. Four-up in one row is what the system warns against for cards, and
          this is the shape that avoids it without stretching anything. */}
      <div className="mt-6 grid grid-cols-2 gap-5">
        {PREVIEW_RUNS.map((run, i) => (
          <ScrollReveal key={run.slug} delay={i * 90} className="h-full">
            <Link href={`/preview/${run.slug}`} className="ob-preview-card h-full">
              <span className="ob-meta ob-preview-sector">{run.sector}</span>
              <span className="ob-preview-title">{run.title}</span>
              <span className="ob-preview-finding">{run.finding}</span>

              {/* Bottom-anchored, so the arrow sits on one line across all four
                  cards however their titles wrap. */}
              <span className="ob-preview-foot">
                <ArrowUpRight size={14} className="ob-arrow" aria-hidden="true" />
              </span>
            </Link>
          </ScrollReveal>
        ))}
      </div>
    </div>
  );
}

/** The live entry point. Same path the run pages already expect. */
function Composer() {
  const router = useRouter();
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [value, setValue] = useState('');
  const [submitting, setSubmitting] = useState(false);

  function submit() {
    const trimmed = value.trim();
    if (!trimmed || submitting) return;
    setSubmitting(true);
    const slug = createRun(trimmed);
    router.push(`/r/${slug}/define`);
  }

  function onKeyDown(event: React.KeyboardEvent<HTMLTextAreaElement>) {
    if ((event.metaKey || event.ctrlKey) && event.key === 'Enter') {
      event.preventDefault();
      submit();
    }
  }

  return (
    <div className="ob-composer p-5">
      <label className="sr-only" htmlFor="idea">
        Describe your idea
      </label>
      <textarea
        id="idea"
        ref={textareaRef}
        rows={3}
        value={value}
        disabled={submitting}
        placeholder={CHAT_SECTION.composerPlaceholder}
        onChange={(event) => setValue(event.target.value)}
        onKeyDown={onKeyDown}
      />
      <div className="mt-4 flex items-center justify-between gap-4">
        {/* **Empty until you type.** This slot used to carry `Not a demo — this
            box starts your run` at rest, handing over to the shortcut once you
            were a few words in; the standing copy is gone at the user's
            direction and the hint now arrives into an empty slot.

            That does not reflow, and the `<span>` is not what prevents it —
            measured, it collapses to 0 height when empty. The row is a
            `justify-between` flex whose height is set by the 50px button and
            whose right edge the button holds regardless, so the hint appearing
            on the left moves nothing. Keep the button in this row and it stays
            true; move it and re-measure. */}
        <span className="ob-meta">
          {value.trim().length >= SHORTCUT_HINT_AT ? CHAT_SECTION.hint : ''}
        </span>
        <button
          type="button"
          className="ob-btn ob-btn-primary"
          onClick={submit}
          disabled={!value.trim() || submitting}
        >
          {submitting ? CHAT_SECTION.submittingLabel : CHAT_SECTION.submitLabel}
          <ArrowUpRight size={16} className="ob-arrow" aria-hidden="true" />
        </button>
      </div>
    </div>
  );
}
