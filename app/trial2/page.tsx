import { ChatRail } from '@/components/trial2/chat-rail';
import { DefineShell } from '@/components/trial2/define-shell';
import { StagePreview } from '@/components/trial2/stage-preview';

/**
 * The Define working surface: previous ideas on the left, the conversation in
 * the middle, and a summary of everything settled so far on the right. The
 * Define → Validate → Roadmap rail sits directly under the header and is the
 * screen's primary navigation.
 *
 * A server component. `DefineShell` is the only client boundary, and the rail
 * and the two stage previews are passed *through* it as already-rendered props
 * — a client boundary marks where that file's own code runs, not where server
 * rendering stops. All three stay out of the client bundle.
 */
export default function Trial2Page() {
  return (
    <DefineShell
      rail={<ChatRail />}
      validatePreview={<StagePreview stage="validate" />}
      roadmapPreview={<StagePreview stage="roadmap" />}
    />
  );
}
