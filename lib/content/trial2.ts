/**
 * Copy for the /trial2 Define surface.
 *
 * Everything here is a hardcoded fixture — no model, no backend. The scripted
 * reply is replayed character-by-character behind the same shape a streaming
 * response would have, so the swap later is mechanical.
 */

export type TurnRole = 'user' | 'agent';

export interface Turn {
  id: string;
  role: TurnRole;
  /** Paragraphs. `**bold**` is the only markup, resolved by a typed renderer —
   *  model text is never handed to a markdown parser. */
  paragraphs: string[];
}

export interface ChatRow {
  id: string;
  title: string;
  stage: 'Define' | 'Validate' | 'Roadmap';
  when: string;
  live?: boolean;
}

export interface ChatGroup {
  label: string;
  rows: ChatRow[];
}

export type SummaryKind = 'confirmed' | 'open' | 'ruled';

export interface SummaryPoint {
  id: string;
  kind: SummaryKind;
  text: string;
}

export const IDEA = {
  title: 'Filling last-minute cancellations at physiotherapy clinics',
  oneLine:
    'A waitlist that texts the right patient the moment a slot opens, and books them without anyone at the front desk picking up the phone.',
  chips: ['Healthcare ops', 'SMB', 'B2B SaaS'],
} as const;

export const CHAT_GROUPS: ChatGroup[] = [
  {
    label: 'Today',
    rows: [
      {
        id: 'c-live',
        title: 'Filling last-minute cancellations at physiotherapy clinics',
        stage: 'Define',
        when: '2m ago',
        live: true,
      },
      {
        id: 'c-2',
        title: 'Shared inbox for veterinary referrals',
        stage: 'Define',
        when: '4h ago',
      },
    ],
  },
  {
    label: 'This week',
    rows: [
      {
        id: 'c-3',
        title: 'Invoice chasing for freelance translators',
        stage: 'Validate',
        when: 'Mon',
      },
      {
        id: 'c-4',
        title: 'Rota swaps for hospitality shift workers',
        stage: 'Roadmap',
        when: 'Mon',
      },
      {
        id: 'c-5',
        title: 'Parts lookup for independent bike shops',
        stage: 'Validate',
        when: 'Sun',
      },
    ],
  },
  {
    label: 'Earlier',
    rows: [
      {
        id: 'c-6',
        title: 'Compliance evidence collection for small MSPs',
        stage: 'Roadmap',
        when: '14 Aug',
      },
      {
        id: 'c-7',
        title: 'Menu costing for single-site restaurants',
        stage: 'Define',
        when: '9 Aug',
      },
    ],
  },
];

export const TRANSCRIPT: Turn[] = [
  {
    id: 't-1',
    role: 'user',
    paragraphs: [
      'My physio cancels on me all the time and the slot just goes empty. I think there is something in filling those gaps automatically but I have not thought it through.',
    ],
  },
  {
    id: 't-2',
    role: 'agent',
    paragraphs: [
      'That is a real gap, and it is worth being precise about whose problem it is before we go further. An empty slot costs the **clinic** revenue and costs the **patient** nothing — so the clinic is the one who would pay, and the patient is the one who has to act fast.',
      'Two things I want to pin down. How does the clinic find out a slot has opened today, and who at the clinic currently does the chasing?',
    ],
  },
  {
    id: 't-3',
    role: 'user',
    paragraphs: [
      'Reception. They get the cancellation by phone, then ring down a paper waitlist until someone says yes. My clinic has two receptionists and four therapists.',
    ],
  },
  {
    id: 't-4',
    role: 'agent',
    paragraphs: [
      'Good — that gives us a shape. The work already exists and is being done manually, which is a much stronger starting point than a behaviour nobody has yet.',
      'So the unit is a **clinic with 3–8 therapists**: big enough that cancellations happen daily, small enough that there is no practice manager with software already. Below three therapists the volume probably does not justify a subscription.',
      'One thing I want to flag rather than assume: you said reception rings **down a list**, in order. If the list is ordered by fairness or by clinical priority, an automated first-to-reply race may be something a clinic actively does not want.',
    ],
  },
  {
    id: 't-5',
    role: 'user',
    paragraphs: [
      'Interesting, I had assumed first come first served was fine. I think it is mostly whoever is nearby and free.',
    ],
  },
  {
    id: 't-6',
    role: 'agent',
    paragraphs: [
      'Then that is an open question rather than a settled one, and it goes on the list for Validate — we will look for what clinics actually say about waitlist ordering rather than deciding it here.',
      'Where I would push next: the thing you are selling is not the text message. It is the **filled slot**. That matters because it points at charging per filled slot rather than per seat, and it means the product has to prove it recovered revenue that would otherwise have been lost.',
    ],
  },
];

/**
 * The scripted reply. Whatever the user types, this is what comes back — the
 * fixture stands behind the interface a real streamed turn would satisfy.
 */
export const SCRIPTED_REPLY: string[] = [
  'Worth separating two versions of that. One is a **notification** tool that tells reception who to ring, which is easier to sell and easier to ignore. The other **books the slot outright**, which is the thing that actually removes the work.',
  'The second is the product, but it needs the clinic to trust a stranger with the diary — so the first release probably has to ask for confirmation before it commits a booking, and earn the right to stop asking.',
];

/** The summary line the scripted reply adds. */
export const SCRIPTED_SUMMARY_POINT: SummaryPoint = {
  id: 's-new',
  kind: 'confirmed',
  text: 'The product books the slot, it does not just notify reception — with a confirmation step in v1.',
};

export const SUMMARY_POINTS: SummaryPoint[] = [
  {
    id: 's-1',
    kind: 'confirmed',
    text: 'The buyer is the clinic, not the patient. The clinic loses the revenue; the patient loses nothing.',
  },
  {
    id: 's-2',
    kind: 'confirmed',
    text: 'Target unit is a clinic with 3–8 therapists — daily cancellations, no practice-management software.',
  },
  {
    id: 's-3',
    kind: 'confirmed',
    text: 'The work is already done manually by reception, so the behaviour exists and does not have to be created.',
  },
  {
    id: 's-4',
    kind: 'confirmed',
    text: 'What is being sold is a filled slot, which points at per-fill pricing rather than per-seat.',
  },
  {
    id: 's-5',
    kind: 'open',
    text: 'Do clinics order their waitlist by fairness or clinical priority? A first-to-reply race may be unacceptable.',
  },
  {
    id: 's-6',
    kind: 'open',
    text: 'Does a recovered slot get measured against anything today, or is the loss currently invisible?',
  },
  {
    id: 's-7',
    kind: 'ruled',
    text: 'A patient-side app that lets people hunt for open slots across clinics.',
  },
];

export interface StagePreview {
  eyebrow: string;
  title: string;
  lead: string;
  lockNote: string;
  lockAction: string;
}

export const PREVIEWS: Record<'validate' | 'roadmap', StagePreview> = {
  validate: {
    eyebrow: 'Stage 02 · Not started',
    title: 'Validate',
    lead: 'Every claim in the brief goes out to the open web and comes back matched to text on a real page — or comes back unmatched, which is also an answer.',
    lockNote: 'Validate opens once the brief is approved. Two open questions still to resolve.',
    lockAction: 'Review the brief',
  },
  roadmap: {
    eyebrow: 'Stage 03 · Not started',
    title: 'Roadmap',
    lead: 'Five phases against a milestone axis, the setup you have to do before phase one, what each phase costs, and the tripwires that mean stop.',
    lockNote:
      'Roadmap opens once research completes. Nothing to schedule until the evidence is in.',
    lockAction: 'Review the brief',
  },
};

/** Drawn-fragment data for the Validate preview — findings and their support. */
export const VALIDATE_FRAGMENT = [
  { id: 'EV_04', title: 'Clinic no-show rates cluster at 12–18%', support: 82 },
  { id: 'EV_07', title: 'Reception time per recovered slot', support: 64 },
  { id: 'EV_11', title: 'Existing waitlist tools sit inside PM software', support: 71 },
  { id: 'EV_15', title: 'Willingness to automate the diary', support: 33 },
] as const;

/** Drawn-fragment data for the Roadmap preview — phases on a milestone axis. */
export const ROADMAP_FRAGMENT = [
  { id: 'P1', title: 'Talk to ten clinics', start: 0, width: 22 },
  { id: 'P2', title: 'Paper prototype the flow', start: 18, width: 20 },
  { id: 'P3', title: 'One clinic, one therapist', start: 36, width: 26 },
  { id: 'P4', title: 'Charge for a filled slot', start: 60, width: 22 },
  { id: 'P5', title: 'Second clinic, no hand-holding', start: 78, width: 22 },
] as const;
