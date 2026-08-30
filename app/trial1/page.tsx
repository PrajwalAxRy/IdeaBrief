import { TopBar } from '@/components/trial1/top-bar';
import { Workspace } from '@/components/trial1/workspace';

/**
 * /trial1 — the Define workspace.
 *
 * Three panes under one bar: previous chats on the left, the conversation in
 * the middle, and a standing summary on the right. The Define · Validate ·
 * Roadmap switcher sits centred in the top bar, above all three, because it
 * governs all three.
 *
 * A server component. `TopBar` and its switcher are static, and `Workspace`
 * arrives as an already-server-rendered subtree — the `'use client'` on it
 * marks where its own code runs, not where server rendering stops.
 */
export default function Trial1Page() {
  return (
    <div className="rl-app">
      <TopBar />
      <Workspace />
    </div>
  );
}
