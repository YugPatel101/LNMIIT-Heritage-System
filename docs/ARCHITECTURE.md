# Architecture

LNMIIT Heritage is a statically exported Next.js site. There is no server-side application, database or authentication.

## Build and runtime

```text
BUILD                                             RUNTIME (browser)

src/data/*.js, *.mjs  ─┐                          HTML and CSS render immediately
src/app/**/page.js    ─┼─▶ next build ─▶ out/ ─▶  React hydrates client components
src/components/*      ─┤                          3D map starts WebGL
public/media/*        ─┘                                   │
                                                           ▼
                                              Esri World Imagery tiles (HTTPS GET)
```

`next.config.mjs` sets `output: 'export'`, `trailingSlash: true` and unoptimised images, so every route becomes `out/<route>/index.html`. Dynamic routes list their pages with `generateStaticParams` and set `dynamicParams = false`.

## Major components

| Area | Files | Role |
| --- | --- | --- |
| Shell | `src/app/layout.js`, `NavBar.js`, `UI.js` | Header, footer, breadcrumbs and page intros |
| Homepage | `HomeExperience.js`, `CampusHero.js`, `VerticalTimeline.js` | Hero, timeline and section links |
| Timeline comparison | `ParallaxTimeline.js`, `TimelineComparison.js`, `/prototype-vertical/`, `/prototype-horizontal/` | Earlier design comparison, kept as separate routes |
| Directories | `DepartmentExplorer.js`, `ClubExplorer.js`, `GalleryExplorer.js`, `AdmissionsExplorer.js` | Client-side search, filters, tabs and the photo viewer |
| Event pages | `src/app/student-life/events/[slug]/page.js` | One template filled from `majorEvents` |
| 3D map | `CampusMap.js`, `CampusScene.js`, `campus-imagery.js`, `CampusFallback.js` | Interface, WebGL scene, imagery and the SVG fallback |

## Data flow

All content is imported at build time from `src/data/`. Search and filter state lives in React component state and is not saved. The only browser-side network dependency is the satellite imagery.

| File | Contains |
| --- | --- |
| `content.js` | Departments, milestones, photographs, admissions and source URLs |
| `student-life.js` | Councils, clubs, societies, Gymkhana structure and major events |
| `campus-model.mjs`, `campus-reference.mjs` | The 28 places, with numbers, names and reference-guide pins |
| `campus-geometry.mjs`, `campus-triangulation.mjs` | Shared geometry helpers |
| `campus-real.mjs` | Generated footprints, roads, trees and elevation. Do not edit by hand |

## 3D campus explorer

One unit is one metre, north is -z, and the view opens looking south, matching the campus drone film.

- **Buildings:** 81 roof parts traced by hand from z19 satellite imagery in `scripts/campus-data/traced.py`. Each roof shows its own satellite pixels, and bases are offset to correct the imagery's lean.
- **Walls:** procedural artwork in `campus-imagery.js`, matched to the campus film and official photographs. They are representative, not photographs of each wall.
- **Ground:** four nested layers of Esri World Imagery streamed at runtime and draped over elevation data. The imagery is not bundled. If it cannot load, buildings still show on a plain ground with a notice.
- **Heights:** estimated from floor counts, OpenStreetMap, the film and shadow lengths. They are not measurements.
- **Trees:** placed where imagery shows canopy. Individual shapes are illustrative.
- **Sharpness:** Esri has no tiles above z19 for the campus, so 0.27 m per pixel is the limit of the source. `applySharpSampling` preserves it with anisotropic filtering, a negative mip bias and Catmull-Rom reconstruction when magnified. The camera stops 30 m from its target and stays above the treetops.
- **Performance:** renders only when the view changes, bakes shadows once, batches geometry by material and lowers resolution during motion on slow GPUs. Phones and low-memory devices get half-resolution imagery and fewer trees.
- **Fallback:** browsers without WebGL get an interactive SVG view drawn from the same footprints.

### Regenerating the map data

This is not needed to run the project, because `campus-real.mjs` is committed.

```bash
python3 scripts/build-campus-data.py <cache-dir>
```

It needs `numpy` and `pillow`, internet access for elevation tiles, and three cached downloads in `<cache-dir>`, which are not in this repository: `osm.xml`, `overture.json` and `sat19.jpg`. The script's docstring describes them.

## Scripts

| Script | Purpose |
| --- | --- |
| `scripts/dev.mjs` | Starts `next dev` and forwards port flags |
| `scripts/serve.mjs` | Serves `out/` with no dependencies |
| `scripts/check-export.py` | Validates exported pages, links, images and titles |
| `scripts/check-campus.mjs` | Validates landmarks, routes and geometry |
| `scripts/check-campus-scene.mjs` | Runs the real scene setup against a stub renderer |
| `scripts/build-campus-data.py` | Generates `campus-real.mjs` |

## Deployment

Any static host can serve `out/`, using directory `index.html` routing and `404.html` for missing pages. No hosting is configured in this repository.
