# Setup and troubleshooting

The [README](../README.md#installation-and-setup) has the standard steps. This page covers the alternatives and common problems.

## Installing the right versions

| Tool | Version | Why |
| --- | --- | --- |
| Node.js | 22.13 or newer | Required by pnpm 11.25.0. Next.js itself needs 20.9 or newer |
| pnpm | 11.25.0 | Pinned in `package.json` under `packageManager` |
| Python | 3.x | Only for `pnpm run check` |

With nvm, run `nvm install` and then `nvm use` in the project folder, which reads `.nvmrc`.

To use pnpm without installing it globally, prefix each command:

```bash
npx pnpm@11.25.0 install --frozen-lockfile
npx pnpm@11.25.0 run dev
```

## Using npm instead

The project is maintained with pnpm, and `pnpm-lock.yaml` is the source of exact versions. If you cannot use pnpm:

```bash
npm install
npm run dev
```

npm ignores the pnpm lockfile, so it may resolve newer versions within the ranges in `package.json`. Remove any `package-lock.json` it creates before committing.

## Environment, database and services

- **Environment:** no `.env` file is needed. `.env.example` documents the optional `PORT`.
- **Database:** none.
- **API keys:** none. Esri tiles are requested without a key.

## What has been tested

A fresh clone was tested on macOS on 2 November 2026:

| Setup | Result |
| --- | --- |
| Node 26.12 with pnpm | Install, build, export check, campus checks, production server, dev server and a browser pass |
| Node 22.23 with pnpm | Install, build and export check |
| Node 26.12 with npm | Install and build |
| Node 20.20 with pnpm | pnpm does not start, as expected |

Windows and Linux have not been tested.

## Windows

The commands are the same, with two differences:

- `pnpm run check` calls `python3`. If that name is not available, run `python scripts/check-export.py` instead.
- Set the port for `pnpm start` with PowerShell syntax: `$env:PORT=4000; pnpm start`.

## Troubleshooting

| Problem | Cause and fix |
| --- | --- |
| `pnpm` stops immediately with a Node.js error | Node is older than 22.13. Upgrade it, or run `nvm use` |
| Port 3000 is already in use | Run `pnpm run dev --port 3001`, or `PORT=3001 pnpm start` |
| `pnpm start` shows "Not found. Run npm run build first." | `out/` does not exist yet. Run `pnpm run build` first |
| `next start` fails | It is not compatible with static export. Use `pnpm start` |
| `pnpm run check` reports a missing route | It reads `out/`, so run `pnpm run build` first |
| `pnpm run lint` exits with 2 errors | These are known and existing. See [PROJECT_STATUS.md](PROJECT_STATUS.md). They do not affect the build |
| The 3D map shows a plain ground and a notice | Satellite tiles could not load. Check the connection, or whether a network blocks `server.arcgisonline.com`. The buildings still work |
| The map shows an SVG view instead of 3D | WebGL is unavailable. Enable hardware acceleration or try another browser |
| The map is slow | It adapts on slow GPUs. Closing other 3D or video tabs also helps |
| Pages show stale content after an edit | Stop the server, delete `.next`, and start it again |
