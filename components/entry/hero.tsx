import { AmbientNote } from '@/components/ui/ambient-note';
import { DisplayHeadline } from '@/components/ui/display-headline';
import { MediaSlot } from '@/components/ui/media-slot';
import { Orb } from './orb';

/**
 * The `/` hero. Badge, headline, lead, and the two entry actions — The Box
 * itself now lives below the three-things section rather than inside here, so
 * the page reads claim → proof → input.
 */
export function Hero() {
  return (
    <section className="relative flex flex-col items-center gap-6 pt-32 pb-48 text-center">
      {/* <Add background animation: slow-drifting radial mesh gradient, deep green
          into near-black, with one light-blue bloom orbiting behind the headline
          on a ~34s loop. Implemented in CSS as `.hero-bloom` + `.orb`.> */}
      <div className="hero-bloom" aria-hidden="true" />

      <span className="hero-badge hero-reveal-1">No signup. One link. Five minutes.</span>

      <DisplayHeadline
        className="hero-reveal-1"
        muted={
          <>
            An idea in.
            <br />
            Clarity
          </>
        }
        bright="out."
      />

      <p className="lead hero-reveal-2 max-w-conversation">
        Describe what you're thinking about — a sentence, a paragraph, or just a direction. Even "I
        don't know yet."
      </p>

      <div className="hero-reveal-3 flex items-center gap-4 pt-2">
        <a href="#the-box" className="btn btn-primary">
          Start with an idea
        </a>
        <a href="#what-you-get" className="btn btn-secondary">
          See what you get
        </a>
      </div>

      {/* The one product loop on the page. Everything below is code-drawn. */}
      <div className="hero-reveal-4 w-full pt-24">
        <MediaSlot
          ratio="16/9"
          kind="video"
          label="Hero / product loop"
          brief="Screen recording of a live Validate run: findings landing one at a time into the stream, VERIFIED badges resolving from grey to light blue, citation chips lighting up as the report prose fills in. Dark UI on the deep-green ground, no chrome, no cursor, no audio. 12s loop, cut so the first and last frames match."
          source="Record at 2560x1440, export MP4 + WebM, poster frame at t=0. Drop into public/media/hero-loop.*"
        />
        <div className="pt-4">
          <AmbientNote>
            Behind the loop: light-blue bloom, 34s orbit, drifting mesh gradient
          </AmbientNote>
        </div>
      </div>

      <Orb />
    </section>
  );
}
