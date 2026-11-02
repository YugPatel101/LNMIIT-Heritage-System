# Project status

Current stage: **prototype**. Reviewed 2 November 2026.

## Completed modules

- Homepage with campus hero and vertical heritage timeline
- Heritage page with sourced milestones
- Department directory with search and filters, linking to official department pages
- Gallery with 27 official photographs, filters and a keyboard-operable viewer
- 3D campus explorer with 28 places, categories, search, camera presets and an SVG fallback
- Student life: 28 clubs and committees, 8 societies and student bodies, and the Gymkhana structure
- Major events section and five event detail pages
- Admissions explorer linking to official application pages
- Sources and credits page, custom 404 page and responsive layouts

## Partially completed

| Item | Current state |
| --- | --- |
| Department detail pages | Eight pages exist at `/departments/<slug>/`, but the directory links to official LNMIIT pages instead, so they are reachable only by URL |
| Club descriptions | 8 of 28 have no verified description: Capriccio, Fundoo, Rendition, Vignette, AAVEG, Insignia, Cipher and Zenith. Their cards say so |
| Event history | Vivacity and Plinth list only the editions that could be verified. The TEDxLNMIIT 2025 date was not found |
| Timeline prototypes | `/prototype-vertical/` and `/prototype-horizontal/` remain as a design comparison |
| Automated testing | Validation scripts only. No unit, component or end-to-end tests |

## Requires confirmation

| Item | What is needed |
| --- | --- |
| Fourth major event | The brief named "Dashboard", but no LNMIIT source mentions it. It is shown as Desportivos, the likely meaning |
| Homepage motto | The wording comes from Wikipedia and was not found on LNMIIT's own pages. Confirm it with the institute |
| E-Summit venue | E-Cell's website and its posts disagree. The page shows both |
| E-Summit figures | Reported by E-Cell itself and not tied to one edition. Labelled as such on the page |
| Open-air theatre stage | Its position is inferred from imagery and should be checked on site |

## Requires external permission before public launch

- Permission to use photographs from LNMIIT, E-Cell, Desportivos, TEDxLNMIIT and the Imagination club. They remain the property of their owners.
- Review of the Esri imagery terms for the intended use. OpenStreetMap and Overture attributions must stay visible.
- `public/media/campus-reference.webp` is an AI-generated illustration, so it must stay labelled as such.

## Known bugs and issues

| Issue | Location | Impact |
| --- | --- | --- |
| Lint error: `setState` called synchronously in an effect | `src/components/NavBar.js:45` | `pnpm run lint` exits with an error. No visible effect found |
| Lint error: `setState` called synchronously in an effect | `src/components/ParallaxTimeline.js:46` | Same as above |
| 14 lint warnings | Across components | Mostly advice about `<img>`. Images are intentionally unoptimised for static export |
| Admissions link missing from the header at about 701–1000 px | `NavBar.js`, `globals.css` | Still reachable from the footer and page links |
| Vivacity photograph includes a sponsor banner | `public/media/official/vivacity.webp` | Cosmetic. It is the only official photograph available |
| Plinth photograph is only 900 px wide | `public/media/official/plinth.webp` | Slightly soft at large sizes |

## Current limitations

- Content is a reviewed snapshot and does not update itself.
- The 3D model is not a measured survey or a navigation aid. The Centre for AI is an active construction site and will change.
- Satellite imagery needs internet access and stops at z19, about 0.27 m per pixel.
- Regenerating the map data needs cached downloads that are not in this repository.
- `original-media/lnmiit_view.mp4` (37 MB) adds to the clone size. The site does not use it at runtime.

## Future development priorities

1. Fix the two lint errors so that `pnpm run lint` passes.
2. Resolve the items under "Requires confirmation".
3. Clear image and imagery permissions.
4. Add automated tests for search, filters and navigation.
5. Decide whether department pages or official links should be the primary path.
6. Later phases from [SRS.md](SRS.md): 360° tour, audio-guided tours, AI assistant and content administration. None of these exist yet.
