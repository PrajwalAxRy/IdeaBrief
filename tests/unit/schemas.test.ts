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

  it('roadmap — 6 open questions, 5 steps, dependencies resolve', () => {
    const roadmap = RoadmapSchema.parse(roadmapFixture);
    expect(roadmap.open_questions).toHaveLength(6);
    expect(roadmap.steps).toHaveLength(5);
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

  it('rejects a roadmap step whose dependency does not exist', () => {
    const malformed = structuredClone(roadmapFixture);
    malformed.steps[0].dependencies = ['Q99'];
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

  it('rejects a tripwire step carrying a week span', () => {
    const malformed = structuredClone(roadmapFixture);
    malformed.steps[4].start_week = 12;
    expect(() => RoadmapSchema.parse(malformed)).toThrow();
  });

  it('rejects a build step missing start_week', () => {
    const malformed = structuredClone(roadmapFixture);
    malformed.steps[0].start_week = null;
    expect(() => RoadmapSchema.parse(malformed)).toThrow();
  });

  it('accepts a build step with a null duration', () => {
    const ok = structuredClone(roadmapFixture);
    ok.steps[2].duration_weeks = null;
    expect(() => RoadmapSchema.parse(ok)).not.toThrow();
  });

  it('rejects duplicate step ids', () => {
    const malformed = structuredClone(roadmapFixture);
    malformed.steps[1].id = malformed.steps[0].id;
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
