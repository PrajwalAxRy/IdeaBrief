'use client';

import { useEffect, useState } from 'react';

const STORAGE_KEY = 'sv.runs';
const MAX_RUNS = 10;

export type RecentRunStage = 'define' | 'validating' | 'report' | 'roadmap';

export interface RecentRun {
  slug: string;
  oneLiner: string;
  stage: RecentRunStage;
  updatedAt: string;
}

function isRecentRun(value: unknown): value is RecentRun {
  if (typeof value !== 'object' || value === null) return false;
  const record = value as Record<string, unknown>;
  return (
    typeof record.slug === 'string' &&
    typeof record.oneLiner === 'string' &&
    typeof record.stage === 'string' &&
    typeof record.updatedAt === 'string'
  );
}

function readRecentRuns(): RecentRun[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed: unknown = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed.filter(isRecentRun) : [];
  } catch {
    return [];
  }
}

/**
 * Recovers a lost link (03 §3.2) — capped at 10, most-recent-first. Read via
 * this hook (client-only, since SSR has no `window`); write via
 * `upsertRecentRun`, called from wherever a run's stage changes (run
 * creation, brief approval, report/roadmap completion).
 */
export function useRecentRuns(): { runs: RecentRun[] } {
  const [runs, setRuns] = useState<RecentRun[]>([]);

  useEffect(() => {
    setRuns(readRecentRuns());
  }, []);

  return { runs };
}

export function upsertRecentRun(entry: RecentRun): void {
  if (typeof window === 'undefined') return;
  const existing = readRecentRuns().filter((run) => run.slug !== entry.slug);
  const next = [entry, ...existing].slice(0, MAX_RUNS);
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  } catch {
    // Storage full or disabled — silently no-op per the empty-state rule
    // (03 §3.2: it doesn't survive a cleared browser, and the UI says so).
  }
}
