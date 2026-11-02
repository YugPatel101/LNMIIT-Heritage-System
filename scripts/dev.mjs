// Accept the preview supervisor's Vite-style flags while running Next.js.
import { spawn } from 'node:child_process';
import { createRequire } from 'node:module';
const require = createRequire(import.meta.url);
const args = process.argv
  .slice(2)
  .filter((x) => x !== '--strictPort')
  .map((x) => (x === '--host' ? '--hostname' : x));
const child = spawn(
  process.execPath,
  [require.resolve('next/dist/bin/next'), 'dev', ...args],
  { stdio: 'inherit' },
);
child.on('exit', (code) => process.exit(code ?? 0));
for (const signal of ['SIGINT', 'SIGTERM'])
  process.on(signal, () => child.kill(signal));
