import { type Run, RunSchema } from '../schemas/run';

/**
 * Not called out as its own file in P2's fixture list, but `getRun()` needs
 * something to return. This run represents a finished pass — report and
 * roadmap are fully populated — so `status` is `complete`.
 */
export const runFixture: Run = {
  slug: 'sms-rebooking-4f2a',
  status: 'complete',
  idea_text: 'SMS rebooking for dental clinics',
  created_at: '2026-08-14T09:12:00.000Z',
  updated_at: '2026-08-14T09:27:15.000Z',
};

RunSchema.parse(runFixture);
