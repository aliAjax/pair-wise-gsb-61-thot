import { createJiti } from 'jiti';
import path from 'node:path';

const root = path.resolve(import.meta.dirname, '..');

const jiti = createJiti(import.meta.url, {
  alias: { '~': root, '~~': root }
});

await jiti.import(path.join(root, 'scripts', 'verify-flow.ts'));
