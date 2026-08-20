import { initialRunStreamState, runStreamReducer } from '@/lib/run-stream-reducer';
import type { Finding } from '@/lib/schemas/evidence';
import type { RunEvent } from '@/lib/schemas/run';
import { describe, expect, it } from 'vitest';

const QUERIES = ['dental recall pricing', 'dental waitlist forum'];

function finding(overrides: Partial<Finding> = {}): Finding {
  return {
    id: 'EV_01',
    dimension: 'MONEY',
    text: 'Weave charges $300-600/mo per location.',
    excerpt: 'Plans start at $299 per month per location…',
    source_url: 'https://example.com/pricing',
    source_date: '2026-02-14',
    stance: 'supports',
    verified: true,
    ...overrides,
  };
}

describe('run-stream-reducer — pure event -> state transitions', () => {
  it('starts in the Connecting state with all queries queued', () => {
    const state = initialRunStreamState(QUERIES);
    expect(state.phase).toBe('starting');
    expect(state.complete).toBe(false);
    expect(state.queries).toEqual([
      { index: 0, query: QUERIES[0], state: 'queued' },
      { index: 1, query: QUERIES[1], state: 'queued' },
    ]);
  });

  it('advances a phase event', () => {
    const state = runStreamReducer(initialRunStreamState(QUERIES), {
      type: 'phase',
      delayMs: 0,
      phase: 'searching',
      elapsed_ms: 0,
    });
    expect(state.phase).toBe('searching');
  });

  it('ticks a query from queued -> running -> done by index, leaving others untouched', () => {
    let state = initialRunStreamState(QUERIES);
    state = runStreamReducer(state, {
      type: 'query.start',
      delayMs: 0,
      query: QUERIES[0],
      index: 0,
    });
    expect(state.queries[0].state).toBe('running');
    expect(state.queries[1].state).toBe('queued');

    state = runStreamReducer(state, {
      type: 'query.done',
      delayMs: 0,
      query: QUERIES[0],
      index: 0,
    });
    expect(state.queries[0].state).toBe('done');
    expect(state.queries[1].state).toBe('queued');
  });

  it('prepends a verified finding, marks it newest, and increments its dimension count', () => {
    let state = initialRunStreamState(QUERIES);
    const first = finding({ id: 'EV_01', dimension: 'MONEY' });
    const second = finding({ id: 'EV_02', dimension: 'PROBLEM' });

    state = runStreamReducer(state, { type: 'finding.verified', delayMs: 0, finding: first });
    expect(state.findings).toEqual([first]);
    expect(state.newestFindingId).toBe('EV_01');
    expect(state.counts.MONEY).toBe(1);

    state = runStreamReducer(state, { type: 'finding.verified', delayMs: 0, finding: second });
    expect(state.findings).toEqual([second, first]);
    expect(state.newestFindingId).toBe('EV_02');
    expect(state.counts.PROBLEM).toBe(1);
    expect(state.counts.MONEY).toBe(1);
  });

  it('sets the discard counter to the event count, not an accumulator', () => {
    let state = initialRunStreamState(QUERIES);
    state = runStreamReducer(state, { type: 'finding.discarded', delayMs: 0, count: 3 });
    expect(state.discardedCount).toBe(3);
    state = runStreamReducer(state, { type: 'finding.discarded', delayMs: 0, count: 7 });
    expect(state.discardedCount).toBe(7);
  });

  it('flags complete on the terminal event', () => {
    const state = runStreamReducer(initialRunStreamState(QUERIES), {
      type: 'complete',
      delayMs: 0,
    });
    expect(state.complete).toBe(true);
  });

  it('replays a realistic sequence into a consistent final state', () => {
    const events: RunEvent[] = [
      { type: 'phase', delayMs: 0, phase: 'searching', elapsed_ms: 0 },
      { type: 'query.start', delayMs: 0, query: QUERIES[0], index: 0 },
      { type: 'query.done', delayMs: 0, query: QUERIES[0], index: 0 },
      { type: 'phase', delayMs: 0, phase: 'verifying', elapsed_ms: 0 },
      { type: 'finding.verified', delayMs: 0, finding: finding({ id: 'EV_01' }) },
      { type: 'finding.discarded', delayMs: 0, count: 1 },
      { type: 'phase', delayMs: 0, phase: 'writing', elapsed_ms: 0 },
      { type: 'complete', delayMs: 0 },
    ];
    const final = events.reduce(runStreamReducer, initialRunStreamState(QUERIES));
    expect(final.phase).toBe('writing');
    expect(final.complete).toBe(true);
    expect(final.findings).toHaveLength(1);
    expect(final.discardedCount).toBe(1);
    expect(final.queries[0].state).toBe('done');
  });
});
