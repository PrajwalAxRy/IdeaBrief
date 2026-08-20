# Phased commit plan

Goal: turn the working tree (everything since commit `09f5f2e`, the P0–P2
scaffold) into one commit per build phase, matching the phase history
documented in `only_frontend_build_plan.md`.

## Status: complete

All phases have been committed and pushed to `origin/main`, one commit per
phase, in order:

| Phase | Commit | Message |
|---|---|---|
| P0–P2 | `09f5f2e` | Build P0-P2 of the frontend prototype: scaffold, UI primitives, schemas/fixtures |
| P3 | `ba1408b` | Build P3 of the frontend prototype: Run Shell, routing, layout |
| P4–P11 | `3bfc114` | Build P11 of the frontend prototype: Motion, a11y floor, DoD sweep |
| Deep Canopy visual overhaul | `62f7e25` | Deep Canopy visual overhaul |
| Obsidian landing-page rebuild | `66daa22` | Obsidian landing-page rebuild |

P4–P10 were folded into the single P11 commit rather than split further —
by the time reconstruction reached them, the working tree no longer
preserved clean per-phase boundaries for those files, and `3bfc114`'s body
covers each phase's own build-log bullets individually so the history stays
attributable phase-by-phase even though the commit boundary doesn't.

`git status` is clean and the local `main` matches `origin/main` — there is
no pending work for this plan to sequence. When new phases or overhauls are
built, append a row here and a corresponding phased section below before
committing, rather than batching multiple phases into one commit again.

## Reference: reconstruction notes

- `git_commit_plan.md` reused each phase's own `### PN` bullet list from
  `only_frontend_build_plan.md` as the commit body (trimmed), so the commit
  history and the build log tell the same story from two directions.
- CRLF-only diffs (from `core.autocrlf=true`) were not treated as real
  changes — `git add` alone renormalizes them with zero content diff; they
  were staged incidentally as part of whichever phase's batch `git add`
  touched that file, not attributed to a phase they don't belong to.
- The Obsidian and Deep Canopy overhauls are not numbered phases in
  `only_frontend_build_plan.md`; commit order followed build order (Deep
  Canopy first, since Obsidian scopes itself to the landing page only and
  layers on top of it, not the other way around).
