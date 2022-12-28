import readdirp from 'readdirp';
import { printErrorAndExit } from './output.js';

export const LOAD_DIR = async (dir: string, fileFilter: string) => {
  const files = readdirp(dir, {
    fileFilter,
    directoryFilter: ['!.git', '!*modules'],
  });

  for await (const file of files) {
    await import(file.fullPath);
  }
};

export const loadDir = (dir: string, fileFilter: string) => {
  LOAD_DIR(dir, fileFilter).catch((error) => {
    printErrorAndExit(error);
  });
};
