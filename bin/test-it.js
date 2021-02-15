#!/usr/bin/env node
const { resolve } = require('path');
const { fstatSync, openSync } = require('fs');
const { red } = require('chalk');
const readdirp = require('readdirp');
const argsParser = require('../lib/args-parser');

// eslint-disable-next-line no-console
const print = (msg = '') => console.log(msg);
// eslint-disable-next-line no-console
const printError = (msg = '') => console.error(msg);

const LOAD_DIR = async (dir, fileFilter) => {
  const ff = readdirp(dir, {
    fileFilter,
    directoryFilter: ['!.git', '!*modules']
  });

  for await (const entry of ff) {
    require(entry.fullPath);
  }
};

const loadFile = require;
const loadDir = (dir, fileFilter) => {
  LOAD_DIR(dir, fileFilter).catch(
    (error) => {
      // eslint-disable-next-line no-console
      console.log('error', error);
      process.exit(1);
    }
  );
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
  print(' -p --pattern <pat> The file pattern used when searching diectories for tests');
  print('                    Defaults to *.test.js');
  print(' -b --bail          Bail or on first failing tests (Fail fast)');
  print(' -h --help          Prints the help screen');
  process.exit(1);
}

const files = args.paths.map((file) => resolve(process.cwd(), file));
files.forEach((file) => {
  if (fstatSync(openSync(file)).isDirectory()) {
    loadDir(file, args.testFilePattern);
  } else {
    loadFile(file);
  }
});

process.on('exit', (exitCode) => {
  if (exitCode === 0) {
    const { status: { testCount } } = require('../');
    if (testCount === 0) {
      printError(red('No tests found'));
      process.exit(1);
    }
  }
});
