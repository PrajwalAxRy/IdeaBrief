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
    <section id="start" className="ob-warm ob-band ob-paper" aria-labelledby="chat-headline">
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
        {/* **Two-up asymmetric, replacing a 760px column centred in a 1200px
            container.** The old shape left ~220px of empty paper down both
            sides of the whole band and read as a narrow control dropped onto a
            wide sheet. The thing you do goes left at whatever width is left
            over; the thing you can look at instead goes right at a fixed 420px.
            See obsidian.css §12C. */}
        <div className="ob-start-grid">
          <div>
            <ScrollReveal>
              <h2 id="chat-headline" className="ob-h1 max-w-[15ch]">
                Think out loud with your{' '}
                <span style={{ color: 'var(--ob-accent)' }}>Cofounder.</span>
              </h2>
            </ScrollReveal>

            <ScrollReveal delay={120} className="ob-start-lede">
              <Composer />
            </ScrollReveal>
          </div>

          <PreviewRuns />
        </div>
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
    /* **A stack in the right column, replacing a 2×2 under the composer.**
       At 760px the 2×2 gave each card ~370px and two short lines of copy, which
       is a tile with a hole in it; as rows at 420px the same copy fills the
       card and the four sectors line up in one scannable column. The grid also
       stops competing with the composer for the reader's first fixation —
       side by side, the elevation ranking (§12C) settles it. */
    <div>
      {/* The label alone. Its explanatory line under it is gone — the four
          cards say what they are, and a sentence telling the reader that four
          cards are four cards was restating the row rather than adding to it. */}
      <ScrollReveal>
        <div className="ob-eyebrow ob-meta">
          <span>{PREVIEW_SECTION.label}</span>
        </div>
      </ScrollReveal>

      <div className="ob-preview-stack mt-5">
        {PREVIEW_RUNS.map((run, i) => (
          <ScrollReveal key={run.slug} delay={i * 90}>
            <Link href={`/preview/${run.slug}`} className="ob-preview-card">
              {/* The text column. `min-w-0` is load-bearing: without it a grid
                  item refuses to shrink below its content's intrinsic width and
                  the line clamp never engages. */}
              <span className="min-w-0">
                <span className="ob-meta ob-preview-sector block">{run.sector}</span>
                <span className="ob-preview-title block">{run.title}</span>
                <span className="ob-preview-finding">{run.finding}</span>
              </span>

              <span className="ob-preview-go">
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
    <div className="ob-composer p-6">
      <label className="sr-only" htmlFor="idea">
        Describe your idea
      </label>
      <textarea
        id="idea"
        ref={textareaRef}
        rows={4}
        value={value}
        disabled={submitting}
        placeholder={CHAT_SECTION.composerPlaceholder}
        onChange={(event) => setValue(event.target.value)}
        onKeyDown={onKeyDown}
      />
      <div className="mt-4 flex items-center justify-between gap-4">
        {/* **Present at rest, as a drawn keycap.** This slot has been through
            two states: standing copy (`Not a demo — this box starts your run`),
            then nothing at all until `SHORTCUT_HINT_AT` characters had been
            typed. The second is why the shortcut is here now — it appeared for
            exactly the readers who had already committed to typing a sentence,
            which is the point at which they no longer need it.

            The threshold survives as `data-armed`: same information, expressed
            as the chip going from `--ob-dim` to `--ob-muted` rather than as an
            element entering the layout. Nothing reflows either way, and this
            version cannot — the chip's box is there from first paint. */}
        <span
          className="ob-meta ob-composer-hint"
          data-armed={value.trim().length >= SHORTCUT_HINT_AT}
        >
          {CHAT_SECTION.hint}
        </span>
        <button
          type="button"
          className="ob-btn ob-btn-primary"
          onClick={submit}
          disabled={submitting}
        >
          {submitting ? CHAT_SECTION.submittingLabel : CHAT_SECTION.submitLabel}
          <ArrowUpRight size={16} className="ob-arrow" aria-hidden="true" />
        </button>
      </div>
    </div>
  );
}
