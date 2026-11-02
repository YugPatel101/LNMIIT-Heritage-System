# Contributing

Thanks for helping with LNMIIT Heritage. Setup steps are in the [README](README.md#installation-and-setup).

## Workflow

1. Create a branch from `main`, such as `feature/club-search` or `fix/map-labels`.
2. Make a focused change.
3. Run the checks below.
4. Open a pull request that says what changed and how you tested it.

## Before you open a pull request

```bash
pnpm run check:campus
pnpm run build
pnpm run check
pnpm run lint
```

`pnpm run lint` currently reports 2 known errors, listed in [docs/PROJECT_STATUS.md](docs/PROJECT_STATUS.md). Please don't add new ones.

Format changed files with Prettier:

```bash
npx prettier@3.6.2 --single-quote --write <files>
```

## Code conventions

- Match the surrounding code, and keep statements on separate lines.
- Put content in `src/data/`, not in components.
- Do not edit `src/data/campus-real.mjs` by hand. It is generated.
- This project uses a recent Next.js version. Read the relevant guide in `node_modules/next/dist/docs/` before changing routing or configuration.

## Content rules

This site describes a real institution, so accuracy matters most.

- Every fact needs a source, recorded in [SOURCES.md](SOURCES.md).
- If something cannot be verified, say so on the page instead of guessing.
- Do not add stock images, invented statistics or testimonials.
- Do not add student phone numbers or other personal details.

## Security

- Never commit `.env` files, API keys, passwords or tokens.
- The project needs no secrets today. If that changes, add the name of the variable to `.env.example` with a placeholder value.

## Commit messages

Use a short, imperative summary with a type prefix:

```text
feat: add council filter to clubs
fix: correct BH3 label on the map
docs: update setup steps
```

## Maintainer notes: GitHub repository settings

**Suggested description**

> Student prototype: an interactive heritage portal and 3D campus explorer for LNMIIT Jaipur, built with Next.js and Three.js.

**Suggested topics**

`nextjs` `react` `threejs` `webgl` `tailwindcss` `javascript` `3d-map` `campus-map` `static-site` `student-project`

**Visibility:** this repository is public. The photograph permissions in [docs/PROJECT_STATUS.md](docs/PROJECT_STATUS.md) still need to be cleared.
