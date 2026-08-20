import { getStageStates, resolveRunRedirect } from '@/lib/run-stage';
import { describe, expect, it } from 'vitest';

describe('run-stage — StageRail state derived purely from RunStatus', () => {
  it('define status: Define active, the rest locked', () => {
    expect(getStageStates('define')).toEqual({
      define: 'active',
      validate: 'locked',
      roadmap: 'locked',
    });
  });

  it('validating status: Define done, Validate active, Roadmap locked', () => {
    expect(getStageStates('validating')).toEqual({
      define: 'done',
      validate: 'active',
      roadmap: 'locked',
    });
  });

  it('complete status: everything done — no distinct "roadmap done" state exists', () => {
    expect(getStageStates('complete')).toEqual({
      define: 'done',
      validate: 'done',
      roadmap: 'done',
    });
  });

  it('redirect: define status goes to /define, everything else goes to /validate', () => {
    expect(resolveRunRedirect('define')).toBe('/define');
    expect(resolveRunRedirect('validating')).toBe('/validate');
    expect(resolveRunRedirect('complete')).toBe('/validate');
  });
});
