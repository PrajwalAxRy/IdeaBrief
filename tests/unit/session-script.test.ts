import {
  CHAT_SCRIPT,
  SESSION,
  SESSION_LEAD_IN_MS,
  SESSION_POINTER_MS,
  SESSION_SCRIPT,
  SESSION_TYPING_MS,
  type SessionStep,
  sessionPointerTotalMs,
  sessionStepMs,
  sessionTotalMs,
} from '@/lib/content/landing';
import { describe, expect, it } from 'vitest';

/** Wall-clock offset at which each step finishes, lead-in included. */
function timeline(): { at: number; step: SessionStep }[] {
  let at = SESSION_LEAD_IN_MS;
  return SESSION_SCRIPT.map((step) => {
    at += sessionStepMs(step);
    return { at, step };
  });
}

const kinds = SESSION_SCRIPT.map((step) => step.kind);

describe('idea session script — timing', () => {
  it('clears the 10s floor and lands in the 12–16s band', () => {
    /* 10s was the floor asked for. It runs to ~14s because at 10s the three
       options arrive faster than they can be read, and each needs its own beat. */
    expect(sessionTotalMs).toBeGreaterThanOrEqual(10_000);
    expect(sessionTotalMs).toBeGreaterThan(12_000);
    expect(sessionTotalMs).toBeLessThan(16_000);
  });

  it('derives typing duration from the text, at CofounderChat’s tuned speeds', () => {
    expect(SESSION_TYPING_MS).toEqual({ user: 24, ai: 15 });
    for (const step of SESSION_SCRIPT) {
      if (step.kind !== 'turn') continue;
      expect(sessionStepMs(step)).toBe(
        step.text.length * SESSION_TYPING_MS[step.role] + step.holdMs,
      );
    }
  });

  it('opens with a rest, so the card is mid-conversation before anything types', () => {
    expect(SESSION_LEAD_IN_MS).toBeGreaterThan(0);
    expect(timeline()[0]?.at).toBeGreaterThan(SESSION_LEAD_IN_MS);
  });

  it('gives every option its own beat', () => {
    const bullets = SESSION_SCRIPT.find((step) => step.kind === 'bullets');
    if (bullets?.kind !== 'bullets') throw new Error('no bullets step');
    expect(bullets.stepMs).toBeGreaterThanOrEqual(700);
    expect(bullets.items.length).toBe(3);
  });

  it('holds the finish long enough to be read before the pointer comes for it', () => {
    const finish = SESSION_SCRIPT.at(-1);
    expect(finish?.kind).toBe('finish');
    expect(finish?.holdMs).toBeGreaterThanOrEqual(1_000);
  });

  it('ends on the pointer beat, and counts it in the total', () => {
    /* The card plays once and rests — there is no loop, so the closing gesture
       is the last thing that happens and `sessionTotalMs` has to include it or
       the number stops meaning "one full pass". */
    expect(sessionPointerTotalMs).toBe(
      SESSION_POINTER_MS.travel + SESSION_POINTER_MS.press + SESSION_POINTER_MS.linger,
    );
    const script =
      SESSION_LEAD_IN_MS + SESSION_SCRIPT.reduce((t, step) => t + sessionStepMs(step), 0);
    expect(sessionTotalMs).toBe(script + sessionPointerTotalMs);
  });

  it('gives the pointer a travel long enough to read as a hand, not a jump', () => {
    /* The whole closing gesture is a documented exception to the motion binary,
       allowlisted by name in styles/obsidian.css alongside `.ob-caret`. At
       `--ob-base` (320ms) a 130px glide reads as a glitch. */
    expect(SESSION_POINTER_MS.travel).toBeGreaterThan(500);
    expect(SESSION_POINTER_MS.travel).toBeLessThan(1_600);
  });

  it('holds the press open long enough for the whole ripple to finish', () => {
    /* `press` is the window `data-pressed` stays on the button, not an animation
       duration. It has to outlast everything that attribute triggers, and the
       longest of those is the second ring: 180ms of stagger plus 620ms of
       travel. Below 800 the ripple is cut off mid-spread; far above it the
       button sits pressed doing nothing. */
    expect(SESSION_POINTER_MS.press).toBeGreaterThanOrEqual(800);
    expect(SESSION_POINTER_MS.press).toBeLessThanOrEqual(1_200);
  });
});

describe('idea session script — order and shape', () => {
  it('runs options, then the lens, then the finish', () => {
    const bullets = kinds.indexOf('bullets');
    const lens = kinds.indexOf('lens');
    const finish = kinds.indexOf('finish');
    expect(bullets).toBeGreaterThanOrEqual(0);
    expect(bullets).toBeLessThan(lens);
    expect(lens).toBeLessThan(finish);
  });

  it('carries exactly one lens and one finish, and the finish is last', () => {
    expect(kinds.filter((k) => k === 'lens')).toHaveLength(1);
    expect(kinds.filter((k) => k === 'finish')).toHaveLength(1);
    expect(kinds.at(-1)).toBe('finish');
  });

  it('opens on the user asking, and lets the user call it done', () => {
    const turns = SESSION_SCRIPT.filter((step) => step.kind === 'turn');
    expect(turns.at(0)?.kind === 'turn' && turns.at(0)?.role).toBe('user');
    expect(turns.at(-1)?.kind === 'turn' && turns.at(-1)?.role).toBe('user');
  });

  it('has no empty text anywhere', () => {
    expect(SESSION.lensLabel.trim()).not.toBe('');
    expect(SESSION.replayLabel.trim()).not.toBe('');
    for (const turn of SESSION.preroll) expect(turn.text.trim()).not.toBe('');
    for (const step of SESSION_SCRIPT) {
      if (step.kind === 'turn' || step.kind === 'lens') expect(step.text.trim()).not.toBe('');
      if (step.kind === 'bullets') {
        for (const option of step.items) {
          expect(option.lead.trim()).not.toBe('');
          expect(option.rest.trim()).not.toBe('');
        }
      }
      if (step.kind === 'finish') {
        expect(step.heading.trim()).not.toBe('');
        expect(step.body.trim()).not.toBe('');
      }
    }
  });

  it('opens on the tail of section 03’s exchange, so the two surfaces are one story', () => {
    /* Pillar 01 and the CofounderChat section are one continuous narrative —
       the same fitness idea, the same lapsed lifters. The pre-roll is
       CHAT_SCRIPT verbatim (the second line elided at the front), which is what
       keeps them from reading as two unrelated demos. */
    const [first, second] = SESSION.preroll;
    expect(CHAT_SCRIPT.some((turn) => turn.text === first?.text)).toBe(true);
    expect(first?.role).toBe('user');
    const elided = second?.text.replace(/^…/, '') ?? '';
    expect(CHAT_SCRIPT.some((turn) => turn.text.includes(elided))).toBe(true);
    expect(second?.role).toBe('ai');
  });

  it('carries both finish labels', () => {
    const finish = SESSION_SCRIPT.find((step) => step.kind === 'finish');
    if (finish?.kind !== 'finish') throw new Error('no finish step');
    expect(finish.primary).toBe('Start the research');
    expect(finish.secondary).toBe('Keep talking');
  });
});

describe('idea session script — what the product promises', () => {
  /* executive_summary.md is binding: no verdict, no score, no gates, and nothing
     invented to fill a field. These are the three places an edit would break it. */

  it('names the empirical question as research, not a guess', () => {
    const said = SESSION_SCRIPT.some(
      (step) => step.kind === 'turn' && step.text.includes('a question for the research'),
    );
    expect(said).toBe(true);
  });

  it('states the lens as a consequence and a choice, never a rating', () => {
    const lens = SESSION_SCRIPT.find((step) => step.kind === 'lens');
    if (lens?.kind !== 'lens') throw new Error('no lens step');
    /* An earlier draft read "low scalability and investment potential" — a
       verdict on the idea, which the product promises never to give. */
    expect(lens.text).not.toMatch(/\b(low|high|poor|strong|weak|score|potential)\b/i);
    expect(lens.text).toMatch(/worth knowing which you want/i);
  });

  it('finishes as a nudge rather than a gate', () => {
    const finish = SESSION_SCRIPT.find((step) => step.kind === 'finish');
    if (finish?.kind !== 'finish') throw new Error('no finish step');
    expect(finish.heading).toMatch(/still open/i);
    /* The user can proceed anyway — that is the whole difference. */
    expect(finish.primary).toMatch(/start/i);
  });

  it('never shows a counter or an "I don’t know" button', () => {
    const everything = [
      ...SESSION.preroll.map((turn) => turn.text),
      SESSION.bar.title,
      SESSION.bar.status,
      SESSION.lensLabel,
      ...SESSION_SCRIPT.flatMap((step) => {
        if (step.kind === 'turn' || step.kind === 'lens') return [step.text];
        if (step.kind === 'bullets') return step.items.flatMap((o) => [o.lead, o.rest]);
        return [step.heading, step.body, step.primary, step.secondary];
      }),
    ].join(' ');

    expect(everything).not.toMatch(/\d+\s+of\s+\d+/);
    expect(everything).not.toMatch(/answered/i);
    expect(everything).not.toMatch(/I don.t know/i);
  });
});
