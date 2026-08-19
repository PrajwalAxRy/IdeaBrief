import { type Brief, BriefSchema } from '../schemas/brief';

/**
 * `who_decides`, `what_makes_this_different`, and `how_customers_find_it`
 * are the 3 fields marked `unknown`, exercising the unknown -> open-question
 * path. `one_liner` holds placeholder text here — in the running app it's
 * always overwritten by the user's own typed idea (see the prototype
 * contract), but a fixture consumed directly (e.g. in tests) still needs a
 * valid value.
 */
export const briefFixture: Brief = {
  one_liner: {
    status: 'filled',
    value: 'SMS rebooking for dental clinics',
  },
  product: {
    status: 'filled',
    value:
      'A two-way SMS service that watches for cancelled or no-show dental appointment slots and automatically offers them to waitlisted patients until one confirms.',
  },
  customer: {
    status: 'filled',
    value:
      'Front-desk staff and office managers at independent or small-group dental practices (2-8 chairs) who currently manage a waitlist by phone.',
  },
  who_decides: {
    status: 'unknown',
    value: '',
  },
  problem: {
    status: 'filled',
    value:
      "Same-week cancellations and no-shows leave chairs empty because front-desk staff don't have time to call down a paper or memory-based waitlist by hand.",
  },
  how_they_solve_it_today: {
    status: 'filled',
    value: [
      'Front-desk staff call waitlist patients one by one from memory or a sticky note',
      'Mailed paper reminder cards a week ahead of the appointment',
      'Some practices simply accept the empty slot and move on',
    ],
  },
  what_makes_this_different: {
    status: 'unknown',
    value: '',
  },
  first_version_scope: {
    status: 'filled',
    value:
      'Detect a cancellation manually entered by front-desk staff, text the next waitlisted patients in priority order, and auto-book the first to reply YES — no PMS integration required for v1.',
  },
  how_it_makes_money: {
    status: 'filled',
    value: 'A flat monthly SaaS fee per practice location, with no per-message charges.',
  },
  how_customers_find_it: {
    status: 'unknown',
    value: '',
  },
  assumptions: {
    status: 'filled',
    value: [
      "Practices already keep some form of a waitlist, even if it's informal",
      'Patients will opt in to receiving a scheduling text from their dentist',
      'A cancellation can be entered and acted on within minutes, even without a live PMS integration',
    ],
  },
  open_questions: {
    status: 'filled',
    value: [
      'Who actually approves a new recurring software cost at a small practice?',
      'How is this different from the reminder tools practices already use?',
      'Which channel brings in the first 10 practices?',
    ],
  },
};

BriefSchema.parse(briefFixture);
