import { DefineConversation } from '@/components/define/define-conversation';
import { AppBackdrop } from '@/components/layout/app-backdrop';
import { getBrief, getConversation, getRun } from '@/lib/db/queries';
import { BRIEF_FIELD_KEYS } from '@/lib/schemas/brief';

/**
 * A working surface, not a document (D9). No `PageContainer`: the split is
 * full-bleed and exactly fills the viewport under the header, so
 * `DefineConversation` is `<main>`'s only element child besides the backdrop —
 * which is what §7's `main:has(> .ob-define)` selector matches.
 */
export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const brief = await getBrief(slug);
  const answered = BRIEF_FIELD_KEYS.filter((key) => brief[key].status === 'filled').length;
  const description = `The idea brief for this run. ${answered} of ${BRIEF_FIELD_KEYS.length} fields answered.`;
  return {
    title: `Define — ${brief.one_liner.value}`,
    description,
    openGraph: {
      title: `Define — ${brief.one_liner.value}`,
      description,
      images: ['/og/define.png'],
    },
  };
}

export default async function DefinePage({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ broken?: string; sendfail?: string }>;
}) {
  const { slug } = await params;

  const { broken, sendfail } = await searchParams;

  /* Prototype-only QA affordance. Define deliberately has **no segment error
     boundary**: nothing has been produced on this page yet, so there is no
     completed work that losing the chrome would strand. `?broken=1` therefore
     reaches the root boundary, which is the honest treatment here. */
  if (broken === '1') {
    throw new Error('Prototype-only QA trigger for the root error boundary (?broken=1).');
  }

  const [run, brief, conversation] = await Promise.all([
    getRun(slug),
    getBrief(slug),
    getConversation(slug),
  ]);

  return (
    <>
      <AppBackdrop variant="define" />
      <DefineConversation
        slug={slug}
        run={run}
        brief={brief}
        conversation={conversation}
        sendFail={sendfail === '1'}
      />
    </>
  );
}
