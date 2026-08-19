/**
 * Throwaway aesthetic proof for P0. Deleted at the end of P11.
 * Uses raw CSS classes from styles/components.css directly — the Tier-1
 * primitives (Button, Card, SectionLabel, MetaLine) don't exist until P1.
 */
export default function ProofPage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-8 px-8">
      <span className="section-label">[Proof of aesthetic]</span>

      <div className="card w-full max-w-md p-8">
        <h2
          style={{
            color: 'var(--text-primary)',
            fontSize: 'var(--text-h3)',
            fontWeight: 700,
            marginBottom: 'var(--sp-3)',
          }}
        >
          Reading the web about your idea.
        </h2>
        <p style={{ color: 'var(--text-body)', marginBottom: 'var(--sp-6)' }}>
          This card proves the borderless elevation, the inset top highlight, and the hover lift.
          The button below proves the multi-layer amber glow that never fades to invisible.
        </p>
        <button type="button" className="btn btn-primary">
          Start the run
        </button>
      </div>

      <p className="meta-line">
        {'RUN 7f3a91c4 // 19 QUERIES // 31 PAGES FETCHED // 47 VERIFIED // 18 DISCARDED'}
      </p>
    </main>
  );
}
