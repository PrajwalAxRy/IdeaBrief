import { Row, Section } from '../section';

const COLOR_GROUPS: { title: string; vars: string[] }[] = [
  { title: 'Surfaces', vars: ['--bg-base', '--bg-surface', '--bg-card', '--bg-footer'] },
  { title: 'Borders', vars: ['--border-subtle', '--border-medium', '--border-accent'] },
  { title: 'Text', vars: ['--text-primary', '--text-body', '--text-muted', '--text-tertiary'] },
  { title: 'Accent', vars: ['--accent', '--accent-bright', '--accent-glow', '--accent-subtle'] },
  { title: 'Semantic', vars: ['--success'] },
];

const TYPE_SCALE = [
  '--text-display',
  '--text-h1',
  '--text-h2',
  '--text-h3',
  '--text-body-size',
  '--text-sm',
  '--text-label',
];

const SPACING = [
  '--sp-1',
  '--sp-2',
  '--sp-3',
  '--sp-4',
  '--sp-6',
  '--sp-8',
  '--sp-12',
  '--sp-16',
  '--sp-24',
  '--sp-32',
];

const RADII = ['--r-md', '--r-lg', '--r-xl', '--r-pill'];

function Swatch({ varName }: { varName: string }) {
  return (
    <div className="flex flex-col gap-2">
      <div
        className="h-16 w-32 rounded-md border"
        style={{ background: `var(${varName})`, borderColor: 'var(--border-medium)' }}
      />
      <code className="meta-line">{varName}</code>
    </div>
  );
}

export function FoundationsSection() {
  return (
    <Section
      id="foundations"
      title="Foundations"
      note="Every value below reads live from styles/tokens.css — edit that file and refresh to see changes here."
    >
      {COLOR_GROUPS.map((group) => (
        <Row key={group.title} title={group.title}>
          {group.vars.map((v) => (
            <Swatch key={v} varName={v} />
          ))}
        </Row>
      ))}

      <Row title="Type scale">
        <div className="flex w-full flex-col gap-4">
          {TYPE_SCALE.map((v) => (
            <div key={v} className="flex items-baseline gap-6">
              <code className="meta-line w-40 shrink-0">{v}</code>
              <span
                style={{ fontSize: `var(${v})`, color: 'var(--text-primary)', fontWeight: 700 }}
              >
                IdeaBrief
              </span>
            </div>
          ))}
        </div>
      </Row>

      <Row title="Spacing">
        <div className="flex w-full flex-col gap-2">
          {SPACING.map((v) => (
            <div key={v} className="flex items-center gap-4">
              <code className="meta-line w-16 shrink-0">{v}</code>
              <div className="h-3" style={{ width: `var(${v})`, background: 'var(--accent)' }} />
            </div>
          ))}
        </div>
      </Row>

      <Row title="Radius">
        {RADII.map((v) => (
          <div key={v} className="flex flex-col gap-2">
            <div
              className="h-16 w-16 border"
              style={{
                borderRadius: `var(${v})`,
                borderColor: 'var(--border-medium)',
                background: 'var(--bg-card)',
              }}
            />
            <code className="meta-line">{v}</code>
          </div>
        ))}
      </Row>
    </Section>
  );
}
