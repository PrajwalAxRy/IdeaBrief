import { Row, Section } from '../section';

/**
 * Every value reads live from styles/tokens.css. This is the Obsidian token
 * set — the Deep Canopy groups are gone, along with the `--sp-*` scale (spacing
 * is Tailwind's job now, per standing rule 3) and the amber-era radii.
 */
const COLOR_GROUPS: { title: string; vars: string[] }[] = [
  { title: 'Surfaces', vars: ['--ob-canvas', '--ob-void', '--ob-surface', '--ob-raised'] },
  { title: 'Hairlines', vars: ['--ob-hairline', '--ob-hairline-strong', '--ob-hairline-accent'] },
  { title: 'Text', vars: ['--ob-text', '--ob-muted', '--ob-dim'] },
  {
    title: 'Accent — action, verification, live state, and nothing else',
    vars: ['--ob-accent', '--ob-accent-bright', '--ob-accent-wash', '--ob-accent-ring'],
  },
  { title: 'Discard — never red; a non-event, not an error', vars: ['--ob-discard'] },
  { title: 'Figures', vars: ['--ob-grid', '--ob-hatch'] },
];

const TYPE_SCALE = [
  '--ob-display',
  '--ob-h1',
  '--ob-h2',
  '--ob-h3',
  '--ob-lead',
  '--ob-body',
  '--ob-sm',
  '--ob-meta',
];

const LAYOUT = [
  '--ob-container-app',
  '--ob-container-report',
  '--ob-container',
  '--ob-report-prose',
  '--ob-report-aside',
  '--ob-header-h',
  '--ob-header-h-condensed',
  '--ob-anchor-inset',
  '--ob-section-gap-app',
];

/** Buttons only. Chips 4px, cards 10px, large panels 16px (rule 8). */
const RADII = ['--ob-r-tag', '--ob-r-card', '--ob-r-lg', '--ob-r-pill'];

function Swatch({ varName }: { varName: string }) {
  return (
    <div className="flex flex-col gap-2">
      <div
        className="h-16 w-32"
        style={{
          background: `var(${varName})`,
          border: '1px solid var(--ob-hairline)',
          borderRadius: 'var(--ob-r-tag)',
        }}
      />
      <code className="ob-meta">{varName}</code>
    </div>
  );
}

export function FoundationsSection() {
  return (
    <Section
      id="foundations"
      title="Foundations"
      note="Every value below reads live from styles/tokens.css — the only file in the codebase permitted to contain a colour value. Weight is 400 at every size, including display; authority comes from scale and negative tracking, never from weight."
    >
      {COLOR_GROUPS.map((group) => (
        <Row key={group.title} title={group.title}>
          {group.vars.map((v) => (
            <Swatch key={v} varName={v} />
          ))}
        </Row>
      ))}

      <Row title="Type scale — weight 400 throughout">
        <div className="flex w-full flex-col gap-4">
          {TYPE_SCALE.map((v) => (
            <div key={v} className="flex items-baseline gap-6">
              <code className="ob-meta w-40 shrink-0">{v}</code>
              <span
                style={{
                  fontSize: `var(${v})`,
                  color: 'var(--ob-text)',
                  fontWeight: 'var(--ob-weight)',
                  letterSpacing: 'var(--ob-tracking-snug)',
                }}
              >
                Groundwork
              </span>
            </div>
          ))}
        </div>
      </Row>

      <Row title="Layout">
        <div className="flex w-full flex-col gap-2">
          {LAYOUT.map((v) => (
            <div key={v} className="flex items-center gap-6">
              <code className="ob-meta w-56 shrink-0">{v}</code>
              {/* A live-sized rule rather than the printed number: CSS cannot
                  render a custom property's value as text, and typing the
                  numbers here would create a second source of truth for them.
                  Measure the exact value in the browser. */}
              <span
                className="h-px"
                style={{ width: `min(var(${v}), 100%)`, background: 'var(--ob-hairline-strong)' }}
              />
            </div>
          ))}
        </div>
      </Row>

      <Row title="Radius — a pill is for buttons alone">
        {RADII.map((v) => (
          <div key={v} className="flex flex-col gap-2">
            <div
              className="h-16 w-16"
              style={{
                borderRadius: `var(${v})`,
                border: '1px solid var(--ob-hairline)',
                background: 'var(--ob-surface)',
              }}
            />
            <code className="ob-meta">{v}</code>
          </div>
        ))}
      </Row>
    </Section>
  );
}
