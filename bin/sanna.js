#!/usr/bin/env node
/* eslint-disable node/no-unpublished-import */
import { resolve } from 'path';
import { fstatSync, openSync } from 'fs';
import * as chalk from 'chalk';
import readdirp from 'readdirp';
import { argsParser } from '../dist/args-parser.js';
import { fileURLToPath } from 'url';
import { printErrorAndExit } from '../dist/index.js';

const __filename = fileURLToPath(import.meta.url);

const { red } = chalk;

// eslint-disable-next-line no-console
const print = (msg = '') => console.log(msg);

const LOAD_DIR = async (dir, fileFilter) => {
  const ff = readdirp(dir, {
    fileFilter,
    directoryFilter: ['!.git', '!*modules'],
  });

  for await (const entry of ff) {
    // eslint-disable-next-line node/no-unsupported-features/es-syntax
    await import(entry.fullPath);
  }
};

const loadDir = (dir, fileFilter) => {
  LOAD_DIR(dir, fileFilter).catch((error) => {
    // eslint-disable-next-line no-console
    console.log('error', error);
    // eslint-disable-next-line no-process-exit
    process.exit(1);
  });
};

const { argv } = process;
const args = argsParser(argv.slice(2));
if (args.help) {
  const sections = __filename.split('/');
  const file = sections[sections.length - 1];
  print(`Usage ${file} [options...]... [files or directories]...`);
  print();
  print('Run tests defined in tests files');
  print();
  print('Options:');
  print(
    ' -p --pattern <pat> The file pattern used when searching diectories for tests'
  );
  print('                    Defaults to *.test.js');
  print(' -b --bail          Bail or on first failing tests (Fail fast)');
  print(' -h --help          Prints the help screen');
  // eslint-disable-next-line no-process-exit
  process.exit(1);
}

const files = args.paths.map((file) => resolve(process.cwd(), file));
files.forEach((file) => {
  if (fstatSync(openSync(file)).isDirectory()) {
    loadDir(file, args.testFilePattern);
  } else {
    // eslint-disable-next-line no-console
    console.log('loading:', file);
    // eslint-disable-next-line node/no-unsupported-features/es-syntax
    import(file).catch((error) => {
      // eslint-disable-next-line no-console
      console.log(error);
      // eslint-disable-next-line no-process-exit
      process.exit(100);
    });
  }
});

process.on('exit', (exitCode) => {
  if (exitCode === 0) {
    // eslint-disable-next-line node/no-unsupported-features/es-syntax, node/no-unpublished-import
    import('../dist/index.js').then(({ status: { testCount } }) => {
      if (testCount === 0) {
        printErrorAndExit(red('No tests found'));
      }
    });
  }
});
