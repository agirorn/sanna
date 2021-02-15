const chalk = require('chalk');
const argv = require('./args-parser')(process.argv.slice(2));
const { runner } = require('./runner');
const options = {
  bail: argv.bail || argv.b || false
};
const status = {
  testCount: 0
};

// eslint-disable-next-line no-console
const print = (text = '', indent = 0) => console.log(leftPadd(text, indent));

// eslint-disable-next-line no-console
const printError = (text = '') => console.error(text);

process.on('unhandledRejection', (rejection) => {
  // eslint-disable-next-line no-console
  console.log('Unhandled promise rejection warning:');
  // eslint-disable-next-line no-console
  console.log(rejection);
});

const SPACE = ' ';
const leftPadd = (text, count = 2, fill = SPACE) => {
  const filling = (new Array(count).fill(fill)).join('');
  return text.split('\n').map((l) => `${filling}${l}`).join('\n');
};

const { suite, run } = runner();
const reportIt = (report) => {
  report.failed.forEach((failure) => {
    print();
    print(failure.title);
    print();
    print(`Code: ${failure.path}`, 2);
    print();
    print(failure.code, 4);
    if (failure.stack) {
      print(failure.stack, 2);
      print();
    }
    if (failure.diff) {
      print('Difference:', 2);
      print();
      print(failure.diff, 4);
      print();
    }
  });

  const passed = report.passed;
  const failed = report.failed.length;
  const total = passed + failed;
  status.testCount = total;
  const noTestsFound = total === 0;
  print();
  if (noTestsFound) {
    printError(chalk.red('No tests found'));
    process.exit(1);
  } else {
    print(chalk.green(`${passed} tests passed`));
    if (failed) {
      print(chalk.red(`${failed} tests failed`));
    }
    print();
  }
  process.exit((failed || noTestsFound) ? 1 : 0);
};

const testRunner = async () => {
  const executeTests = run;
  const report = await executeTests(options.bail);
  reportIt(report);
};

process.on('beforeExit', (exitCode) => {
  if (exitCode === 0) {
    testRunner()
      .catch((error) => {
        // eslint-disable-next-line no-console
        console.log(error);
        process.exit(1);
      });
  }
});

module.exports = {
  suite,
  test: suite('Test'),
  status
};
