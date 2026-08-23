import { briefFixture } from '@/lib/fixtures/brief';
import {
  closingLinesFixture,
  conversationFixture,
  dontKnowAcksFixture,
} from '@/lib/fixtures/conversation';
import { evidenceFixture } from '@/lib/fixtures/evidence';
import { reportFixture } from '@/lib/fixtures/report';
import { roadmapFixture } from '@/lib/fixtures/roadmap';
import { runFixture } from '@/lib/fixtures/run';
import { runEventsFixture, runEventsTotalMs } from '@/lib/fixtures/run-events';
import { BriefSchema } from '@/lib/schemas/brief';
import { ConversationSchema } from '@/lib/schemas/conversation';
import { EvidenceSchema } from '@/lib/schemas/evidence';
import { ReportSchema } from '@/lib/schemas/report';
import { RoadmapSchema } from '@/lib/schemas/roadmap';
import { RunEventSchema, RunSchema } from '@/lib/schemas/run';
import { describe, expect, it } from 'vitest';

describe('every fixture parses through its schema', () => {
  it('brief', () => {
    expect(() => BriefSchema.parse(briefFixture)).not.toThrow();
  });

  it('evidence — 47 verified findings across 5 dimensions', () => {
    const evidence = EvidenceSchema.parse(evidenceFixture);
    expect(evidence).toHaveLength(47);
    expect(evidence.every((finding) => finding.verified)).toBe(true);
    expect(new Set(evidence.map((finding) => finding.source_url)).size).toBe(31);
  });

  it('report — every dimension present, uncited prose would fail', () => {
    const report = ReportSchema.parse(reportFixture);
    expect(Object.keys(report.dimensions)).toHaveLength(5);
    const confidences = new Set(Object.values(report.dimensions).map((d) => d.confidence));
    expect(confidences).toEqual(new Set(['solid', 'mixed', 'thin']));
  });

  it('roadmap — 6 open questions, 5 phases, 5 setup items, references resolve', () => {
    const roadmap = RoadmapSchema.parse(roadmapFixture);
    expect(roadmap.open_questions).toHaveLength(6);
    expect(roadmap.phases).toHaveLength(5);
    expect(roadmap.setup).toHaveLength(5);
    expect(roadmap.milestones).toHaveLength(5);
    expect(roadmap.tripwires).toHaveLength(4);
  });

  it('conversation — turns plus the closing lines the script ends on', () => {
    const conversation = ConversationSchema.parse({
      turns: conversationFixture,
      closing: closingLinesFixture,
      dontKnowAcks: dontKnowAcksFixture,
    });
    expect(conversation.turns).toHaveLength(11);
    expect(conversation.closing.length).toBeGreaterThan(1);
    /* Four of the eleven turns carry chips — the questions with a genuinely
       enumerable answer space. One of eleven read as a glitch. */
    expect(conversation.turns.filter((turn) => turn.chips !== undefined)).toHaveLength(4);
    /* The last turn stops asking a question: it has a real end state. */
    expect(conversation.turns[10].text.endsWith('?')).toBe(false);
    /* D12: the five core fields are reached by turn 5, which is what puts
       Approve on screen there rather than at turn 7. */
    expect(conversation.turns.slice(0, 5).flatMap((turn) => turn.fills)).toEqual([
      'product',
      'customer',
      'problem',
      'how_they_solve_it_today',
      'first_version_scope',
    ]);
  });

  it('run', () => {
    expect(() => RunSchema.parse(runFixture)).not.toThrow();
  });

  it('run-events — counts and total delay match the target volumes', () => {
    for (const event of runEventsFixture) {
      expect(() => RunEventSchema.parse(event)).not.toThrow();
    }
    const byType = (type: string) => runEventsFixture.filter((e) => e.type === type).length;
    expect(byType('query.start')).toBe(19);
    expect(byType('query.done')).toBe(19);
    expect(byType('finding.verified')).toBe(47);
    expect(byType('finding.discarded')).toBe(18);
    expect(byType('phase')).toBe(4);
    expect(byType('complete')).toBe(1);
    /* Re-timed to ~45s by D8. The exact checkpoints live in
       run-events-timing.test.ts; this file only cares that the volumes and the
       schema still hold. */
    expect(runEventsTotalMs).toBe(45_080);
  });
});

describe('schemas reject malformed payloads', () => {
  it('rejects a finding with a non-EV_NN id', () => {
    const malformed = {
      id: 'not-an-id',
      dimension: 'PROBLEM',
      text: 'x',
      excerpt: 'x',
      source_url: 'https://example.com',
      source_date: '2026-01-01',
      stance: 'supports',
      verified: true,
    };
    expect(() => EvidenceSchema.parse([malformed])).toThrow();
  });

  it('rejects a finding with an invalid dimension', () => {
    const malformed = {
      id: 'EV_01',
      dimension: 'NOT_A_DIMENSION',
      text: 'x',
      excerpt: 'x',
      source_url: 'https://example.com',
      source_date: '2026-01-01',
      stance: 'supports',
      verified: true,
    };
    expect(() => EvidenceSchema.parse([malformed])).toThrow();
  });

  it('rejects report summary prose with no citation', () => {
    const malformed = structuredClone(reportFixture);
    malformed.summary = { text: 'This sentence cites nothing at all.', citations: [] };
    expect(() => ReportSchema.parse(malformed)).toThrow();
  });

  it('rejects report summary citations that do not match the text', () => {
    const malformed = structuredClone(reportFixture);
    malformed.summary = { text: 'Cites [2] only.', citations: [2, 99] };
    expect(() => ReportSchema.parse(malformed)).toThrow();
  });

  it('rejects a tripwire naming an open question that does not exist', () => {
    const malformed = structuredClone(roadmapFixture);
    malformed.tripwires[0].questions = ['Q99'];
    expect(() => RoadmapSchema.parse(malformed)).toThrow();
  });

  it('rejects a brief missing a required field', () => {
    const { one_liner, ...rest } = briefFixture;
    expect(() => BriefSchema.parse(rest)).toThrow();
  });

  /* ------------------------------------------------------------- A1 --- */

  it('every fact carries a value, unit, label and kind', () => {
    const facts = evidenceFixture.flatMap((finding) => finding.facts ?? []);
    expect(facts).toHaveLength(28);
    for (const fact of facts) {
      expect(Number.isFinite(fact.value)).toBe(true);
      expect(fact.unit.length).toBeGreaterThan(0);
      expect(fact.label.length).toBeGreaterThan(0);
      expect(['money', 'rate', 'count', 'duration']).toContain(fact.kind);
    }
    expect(evidenceFixture.filter((f) => f.facts !== undefined)).toHaveLength(20);
  });

  it('rejects a percentage fact above 100', () => {
    const malformed = structuredClone(evidenceFixture);
    malformed[1].facts = [{ value: 140, unit: '%', label: 'Impossible', kind: 'rate' }];
    expect(() => EvidenceSchema.parse(malformed)).toThrow();
  });

  it('rejects a capability claim with no citation', () => {
    const malformed = structuredClone(reportFixture);
    malformed.competitors[0].capabilities[0].citations = [];
    expect(() => ReportSchema.parse(malformed)).toThrow();
  });

  it('accepts an unknown capability cell with no citation', () => {
    const ok = structuredClone(reportFixture);
    ok.competitors[0].capabilities[0] = { key: 'reminders', level: 'unknown', citations: [] };
    expect(() => ReportSchema.parse(ok)).not.toThrow();
  });

  /* The rule the journey model rests on. A wait is a pair or it is nothing:
     half a range is a number nobody can act on, and a `wait_low` with no
     `wait_high` is exactly how "about two weeks" creeps back in. */
  it('rejects half a wait range', () => {
    const malformed = structuredClone(roadmapFixture);
    const queue = malformed.setup.find((item) => item.wait_low !== null);
    if (!queue) throw new Error('fixture has no queue');
    queue.wait_high = null;
    expect(() => RoadmapSchema.parse(malformed)).toThrow();
  });

  it('rejects a wait that ends before it starts', () => {
    const malformed = structuredClone(roadmapFixture);
    const queue = malformed.setup.find((item) => item.wait_low !== null);
    if (!queue) throw new Error('fixture has no queue');
    queue.wait_low = 6;
    queue.wait_high = 2;
    expect(() => RoadmapSchema.parse(malformed)).toThrow();
  });

  it('accepts an open-ended phase, which dissolves rather than inventing an end', () => {
    const ok = structuredClone(roadmapFixture);
    expect(ok.phases.some((phase) => phase.end === null)).toBe(true);
    expect(() => RoadmapSchema.parse(ok)).not.toThrow();
  });

  it('rejects a phase that ends before it starts', () => {
    const malformed = structuredClone(roadmapFixture);
    malformed.phases[0].end = 0;
    expect(() => RoadmapSchema.parse(malformed)).toThrow();
  });

  /* Six rows is where a Gantt stops being readable, which is the whole reason
     A17 exists. The cap is a schema rule so it cannot be argued back up. */
  it('rejects a seventh phase', () => {
    const malformed = structuredClone(roadmapFixture);
    const extra = structuredClone(malformed.phases[4]);
    malformed.phases.push({ ...extra, id: 'P6', ambushes: [] });
    malformed.phases.push({ ...extra, id: 'P7', ambushes: [] });
    expect(() => RoadmapSchema.parse(malformed)).toThrow();
  });

  /* Tint is how a bar tells the reader which section it belongs to. Two rows
     sharing one defeats the only job it has. */
  it('rejects two phases sharing a tint', () => {
    const malformed = structuredClone(roadmapFixture);
    malformed.phases[1].tint = malformed.phases[0].tint;
    expect(() => RoadmapSchema.parse(malformed)).toThrow();
  });

  it('rejects phases authored out of start order', () => {
    const malformed = structuredClone(roadmapFixture);
    const [first, second] = malformed.phases;
    malformed.phases[0] = second;
    malformed.phases[1] = first;
    expect(() => RoadmapSchema.parse(malformed)).toThrow();
  });

  /* Only a run-sourced ambush may cite. An `idea` or `universal` ambush with a
     citation is claiming research the run never did. */
  it('rejects a non-run ambush carrying a citation', () => {
    const malformed = structuredClone(roadmapFixture);
    const owner = malformed.phases.find((p) => p.ambushes.some((a) => a.source !== 'run'));
    if (!owner) throw new Error('fixture has no non-run ambush');
    const ambush = owner.ambushes.find((a) => a.source !== 'run');
    if (!ambush) throw new Error('unreachable');
    ambush.citation_id = 46;
    expect(() => RoadmapSchema.parse(malformed)).toThrow();
  });

  it('rejects a run-sourced ambush with no citation', () => {
    const malformed = structuredClone(roadmapFixture);
    const owner = malformed.setup.find((s) => s.ambushes.some((a) => a.source === 'run'));
    if (!owner) throw new Error('fixture has no run ambush');
    const ambush = owner.ambushes.find((a) => a.source === 'run');
    if (!ambush) throw new Error('unreachable');
    ambush.citation_id = undefined;
    expect(() => RoadmapSchema.parse(malformed)).toThrow();
  });

  it('rejects a cost item using a band the legend never defines', () => {
    const malformed = structuredClone(roadmapFixture);
    malformed.money.legend = malformed.money.legend.filter((entry) => entry.band !== '$$$');
    expect(() => RoadmapSchema.parse(malformed)).toThrow();
  });

  it('rejects milestones authored out of journey order', () => {
    const malformed = structuredClone(roadmapFixture);
    const [first, second] = malformed.milestones;
    malformed.milestones[0] = second;
    malformed.milestones[1] = first;
    expect(() => RoadmapSchema.parse(malformed)).toThrow();
  });

  it('rejects duplicate phase ids', () => {
    const malformed = structuredClone(roadmapFixture);
    malformed.phases[1].id = malformed.phases[0].id;
    expect(() => RoadmapSchema.parse(malformed)).toThrow();
  });

  it('rejects an ambush id reused across a phase and a setup item', () => {
    const malformed = structuredClone(roadmapFixture);
    malformed.setup[1].ambushes[0].id = malformed.phases[1].ambushes[0].id;
    expect(() => RoadmapSchema.parse(malformed)).toThrow();
  });

  it('rejects a surprise whose detail has no citation', () => {
    const malformed = structuredClone(reportFixture);
    malformed.surprises[0].detail = { text: 'A claim with no source at all.', citations: [] };
    expect(() => ReportSchema.parse(malformed)).toThrow();
  });

  it('rejects an open question with an unknown brief_field', () => {
    const malformed = structuredClone(roadmapFixture);
    // @ts-expect-error — deliberately outside BriefFieldKey
    malformed.open_questions[0].brief_field = 'not_a_brief_field';
    expect(() => RoadmapSchema.parse(malformed)).toThrow();
  });

  it('rejects a dimension section whose dimension does not match its key', () => {
    const malformed = structuredClone(reportFixture);
    malformed.dimensions.PROBLEM.dimension = 'MONEY';
    expect(() => ReportSchema.parse(malformed)).toThrow();
  });
});
