import {
  type RunProgress,
  type RunSegment,
  type StageKey,
  getStageStates,
  resolveRunRedirect,
} from '@/lib/run-stage';
import type { RunStatus } from '@/lib/schemas/run';
import { describe, expect, it } from 'vitest';

const STATUSES: RunStatus[] = ['define', 'validating', 'complete'];
const SEGMENTS: RunSegment[] = ['define', 'validate', 'roadmap', 'sources'];
const KEYS: StageKey[] = ['define', 'validate', 'roadmap'];

const APPROVED: RunProgress = { briefApproved: true, briefTouched: true };

describe('run-stage — honest stage state from status + route + local progress (D19)', () => {
  it('define status on /define: Define active, the rest locked', () => {
    expect(getStageStates('define', 'define', null)).toEqual({
      define: 'active',
      validate: 'locked',
      roadmap: 'locked',
    });
  });

  it('validating status on /validate: Define done, Validate active, Roadmap locked', () => {
    expect(getStageStates('validating', 'validate', null)).toEqual({
      define: 'done',
      validate: 'active',
      roadmap: 'locked',
    });
  });

  it('complete status on /roadmap: Define and Validate done, Roadmap active', () => {
    expect(getStageStates('complete', 'roadmap', null)).toEqual({
      define: 'done',
      validate: 'done',
      roadmap: 'active',
    });
  });

  it('/sources is not a stage — everything done, nothing active', () => {
    const states = getStageStates('complete', 'sources', null);
    expect(states).toEqual({ define: 'done', validate: 'done', roadmap: 'done' });
    expect(Object.values(states)).not.toContain('active');
  });

  it('the cold-link floor: local progress only ever unlocks', () => {
    /* A recipient with an empty localStorage gets the status-only floor.
       Standing on an unreachable segment does not unlock it. */
    expect(getStageStates('define', 'validate', null).validate).toBe('locked');
    expect(getStageStates('define', 'validate', APPROVED).validate).toBe('active');
  });

  it('monotonicity: no non-locked key ever becomes locked when progress arrives', () => {
    for (const status of STATUSES) {
      for (const segment of SEGMENTS) {
        const floor = getStageStates(status, segment, null);
        for (const progress of [APPROVED, { briefApproved: false, briefTouched: true }]) {
          const widened = getStageStates(status, segment, progress);
          for (const key of KEYS) {
            if (floor[key] !== 'locked') {
              expect(widened[key], `${status}/${segment}/${key}`).not.toBe('locked');
            }
          }
        }
      }
    }
  });

  it('redirect: define status goes to /define, everything else goes to /validate', () => {
    expect(resolveRunRedirect('define')).toBe('/define');
    expect(resolveRunRedirect('validating')).toBe('/validate');
    expect(resolveRunRedirect('complete')).toBe('/validate');
  });
});
