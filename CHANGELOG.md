# Changelog

Notable changes to this prototype, newest first. Work between August and November 2026 was done outside Git, so these entries are summaries.

## 2 November 2026

### Added

- Major Events at LNMIIT section, with E-Summit as the flagship, and event pages for E-Summit, Vivacity, Plinth, Desportivos and TEDxLNMIIT.
- Student life page: clubs and communities, Students' Gymkhana, societies and chapters.
- "Explore 3D Campus" link in the header.
- Repository documentation: README, `docs/`, `CONTRIBUTING.md`, `.env.example` and screenshots.
- `legacy/first-home-page/`, keeping files from the repository's first version that the site no longer uses.
- `check:campus` script, `.nvmrc`, and the `packageManager` and `engines` fields in `package.json`.

### Changed

- Student life page order: clubs and communities now come before major events.
- 3D map: sharper imagery, corrected place names and positions, and an open-air theatre stage.
- Gallery: photographs renamed to match what they show.

### Fixed

- `.gitignore` no longer excludes `.env.example`.
- `pnpm start` now serves `.webp` files with the correct content type.
- Setup instructions now state the Node.js version that pnpm 11.25.0 requires.

### Removed

- `babel-plugin-react-compiler`, which was installed but not enabled. Compiled output is byte-identical without it.
- A footpath on the 3D map with no match in the imagery, and an earlier wrong trace near the temple.

## 23 October 2026

### Changed

- Campus places confirmed against the project owner's annotated satellite screenshots.

## 20 October 2026

### Added

- First reviewed version: homepage, departments, heritage, gallery, admissions explorer and sources page, with content checked against official LNMIIT pages.

## August 2026

### Added

- First version in this repository: a Create Next App starter and a home page.
