# WholeLottaVinyl Record Grading Helper

Free one-page tool that turns a short vinyl + cover checklist into suggested **WholeLottaVinyl grades** (M, NM, EX, VG+, VG, G+ only), a `Graded: EX/VG` listing line, and plain-wording descriptions ready to paste.

Static site only — no backend, no paywall, no Stripe.

## Live

- **URL:** https://frozenvisions.github.io/wlv-grading-helper/
- **Repo:** https://github.com/FrozenVisions/wlv-grading-helper
- Hosted on **GitHub Pages** (public, free static hosting from `main` branch root)

## Grades (WholeLottaVinyl)

- **M** — vinyl unplayed; cover sealed and unopened
- **NM** — vinyl unplayed; cover opened, no damage
- **EX** — played, zero scratches; cover small wear, no rips/tears
- **VG+** — handful of hairlines, none feelable; cover small wear + light rips, spine fully readable
- **VG** — numerous hairlines / noticeable scratches, none feelable; cover heavier wear, spine partly visible
- **G+** — feelable scratches / skips-pops-jumps; cover lots of damage, spine not visible

Anything worse than G+ is shown as G+ with a not-suitable-to-list note. Vinyl and cover are graded separately; worst criterion wins; when unsure, grade down.

## Local run

```bash
cd /workspace/wlv-grading-helper
npm start   # http://127.0.0.1:4173
```

## Unpublish

- Disable Pages: GitHub → **FrozenVisions/wlv-grading-helper** → **Settings → Pages** → Source **None**, or  
- Delete the repository (Settings → Danger Zone).

## Screenshots (local)

- `screenshots/empty-1280.png` / `empty-390.png`
- `screenshots/filled-1280.png` / `filled-390.png`
