import { dirname } from 'path';
import { fileURLToPath } from 'url';

export const dirnameFrom = (meta: ImportMeta) =>
  dirname(fileURLToPath(meta.url));
