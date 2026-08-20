import { DefineConversation } from '@/components/define/define-conversation';
import { PageContainer } from '@/components/layout/page-container';
import { getBrief, getConversation, getRun } from '@/lib/db/queries';

export default async function DefinePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const [run, brief, conversation] = await Promise.all([
    getRun(slug),
    getBrief(slug),
    getConversation(slug),
  ]);

  return (
    <PageContainer variant="app" className="py-12">
      <DefineConversation slug={slug} run={run} brief={brief} conversation={conversation} />
    </PageContainer>
  );
}
