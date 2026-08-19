import { briefFixture } from '@/lib/fixtures/brief';
import { conversationFixture } from '@/lib/fixtures/conversation';
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

  it('conversation', () => {
    expect(() => ConversationSchema.parse(conversationFixture)).not.toThrow();
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
    expect(runEventsTotalMs).toBe(75_000);
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
});
