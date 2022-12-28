import { loadDir } from './runner.js';

export const run = ({ dirs }: { dirs: string[] }) => {
  for (const dir of dirs) {
    loadDir(dir, '*.test.js');
  }
};
