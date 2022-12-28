import { IReport } from './types.js';
import chalk from 'chalk';
import { argsParser } from './args-parser.js';
import { runner } from './suite-runner.js';
import { printLine, printErrorLine } from './output.js';

const { red, green } = chalk;

const argv = argsParser(process.argv.slice(2));

const options = {
  bail: argv.bail || false,
};
const status = {
  testCount: 0,
};

const { suite, run } = runner();

const reportIt = (report: IReport) => {
  report.failed.forEach((failure) => {
    printLine();
    printLine(failure.title);
    printLine();
    printLine(`Code: ${failure.path}`, 2);
    printLine();
    printLine(`ERROR CODE: ${failure.code}`, 4);
    if (failure.stack) {
      printLine(failure.stack, 2);
      printLine();
    }
    if (failure.diff) {
      printLine('Difference:', 2);
      printLine();
      printLine(failure.diff, 4);
      printLine();
    }
  });

  const passed = report.passed;
  const failed = report.failed.length;
  const total = passed + failed;
  status.testCount = total;
  const noTestsFound = total === 0;
  printLine();
  if (noTestsFound) {
    printErrorLine(red('No tests found'));
    // eslint-disable-next-line no-process-exit
    process.exit(1);
  } else {
    printLine(green(`${passed} tests passed`));
    if (failed) {
      printLine(red(`${failed} tests failed`));
    }
    printLine();
  }
  // eslint-disable-next-line no-process-exit
  process.exit(failed || noTestsFound ? 1 : 0);
};

const testRunner = async () => {
  const executeTests = run;
  const report = await executeTests(options.bail);
  reportIt(report);
};

process.on('beforeExit', (exitCode) => {
  if (exitCode === 0) {
    testRunner().catch((error) => {
      printErrorLine(error);
      // eslint-disable-next-line no-process-exit
      process.exit(1);
    });
  }
});

export { status, suite };
export const test = suite('Test');
