import { run, dirnameFrom } from '../index.js';

run({
  dirs: [dirnameFrom(import.meta)],
});
