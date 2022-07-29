const pSeries = require('p-series');
const chalk = require('chalk');
const highlight = require('cli-highlight').highlight;
const { readFileSync } = require('fs');
const { diff } = require('concordance');

const defaultReportProgress = (success) => {
  const progress = success
    ? chalk.green('.')
    : chalk.red('.');
  process.stdout.write(progress);
};

class NoAnError extends Error {
  constructor (message) {
    super(`The error(${message}) is not an Error object`);
    this.name = this.constructor.name;
  }
}

const getLineNumber = (filename, stack, defaultValue) => {
  const foundLine = stack.split('\n').find((line) => {
    return line.includes(filename);
  });
  if (foundLine) {
    const res = foundLine.toString().split(':');

    return res[1];
  }

  return defaultValue;
};

const readFuctionSource = (file, startLine, endLine, fnLength) => {
  const lines = readFileSync(file).toString();
  let currentLine = startLine;
  const onlyTestLines = lines
    .split('\n')
    .slice(startLine - 1, endLine)
    // Removes last empty line if pressent.
    .join('\n').trimRight().split('\n')
    .map((v) => `${currentLine++} ${v}`).join('\n');
  return highlight(
    onlyTestLines,
    {
      language: 'javascript',
      ignoreIllegals: true,
    },
  );
};

const has = (error, key) => Object.keys(error).includes(key);
const isDiffable = (error) => has(error || {}, 'actual') && has(error, 'expected');
const errorDIFF = (error) => {
  if (!isDiffable(error)) {
    return undefined;
  }
  const DIFF = diff(error.actual, error.expected);
  return DIFF
    .split('\n')
    .map((line) => {
      if (line.startsWith('-')) {
        return chalk.red(line);
      }

      if (line.startsWith('+')) {
        return chalk.yellow(line);
      }
      return chalk.green(line);
    })
    .join('\n');
};

const hookFactory = (suite, context, reportProgress, bail, fn, state) => {
  return async () => {
    try {
      if (state.shouldStop) {
        return;
      }
      await fn(context);
    } catch (error) {
      if (bail) {
        state.shouldStop = true;
      }
      reportProgress(false);
      const result = {};
      result.ok = false;
      result.error = error;
      result.errorError = new Error('Failed');
      suite.tests.forEach((test) => {
        test.result = result;
        test.stack = fn.stack;
      });
    }
  };
};
const runner = () => {
  const suites = [];
  const suite = (title) => {
    const SUITE = {
      title,
      tests: [],
      setups: [],
      teardowns: [],
      befores: [],
      afters: [],
    };
    suites.push(SUITE);
    const test = (title, fn) => {
      fn.title = title;
      fn.stack = (new Error('stack')).stack.split('\n').slice(2, 3)[0];
      SUITE.tests.push(fn);
    };
    test.setup = (fn) => {
      fn.stack = (new Error('stack')).stack.split('\n').slice(2, 3)[0];
      SUITE.setups.push(fn);
    };
    test.teardown = (fn) => {
      fn.stack = (new Error('stack')).stack.split('\n').slice(2, 3)[0];
      SUITE.teardowns.push(fn);
    };
    test.before = (fn) => {
      fn.stack = (new Error('stack')).stack.split('\n').slice(2, 3)[0];
      SUITE.befores.push(fn);
    };
    test.after = (fn) => {
      fn.stack = (new Error('stack')).stack.split('\n').slice(2, 3)[0];
      SUITE.afters.push(fn);
    };
    return test;
  };
  const executeTests = async (bail = false, reportProgress) => {
    const state = {
      shouldStop: false
    };
    const tasks = suites.map((s) => {
      const suitContext = {};
      return [
        s.setups.map((fn) => {
          return hookFactory(s, suitContext, reportProgress, bail, fn, state);
        }),
        s.tests.map((test) => {
          let testContext;
          return [
            s.befores.map((fn) => {
              return async () => {
                if (!testContext) {
                  testContext = {
                    ...suitContext
                  };
                }
                await hookFactory(s, testContext, reportProgress, bail, fn, state)();
              };
            }),
            [
              async () => {
                if (test.result || state.shouldStop) {
                  return;
                }
                try {
                  await test(testContext || {});
                  test.result = { ok: true };
                  reportProgress(true);
                } catch (error) {
                  state.shouldStop = true;
                  reportProgress(false);
                  test.result = {
                    ok: false,
                    error: error,
                    errorError: new Error('Test Failed'),
                  };
                }
              }
            ],
            s.afters.map((fn) => {
              return async () => {
                if (!testContext) {
                  testContext = {
                    ...suitContext
                  };
                }
                await hookFactory(s, testContext, reportProgress, bail, fn, state)();
              };
            }),
          ].flat();
        }).flat(),
        s.teardowns.map((fn) => {
          return hookFactory(s, suitContext, reportProgress, bail, fn, state);
        }),
      ];
    }).flat();
    await pSeries(tasks.flat());
    return suites;
  };
  const run = async (bail = false, reportProgress = defaultReportProgress) => {
    await executeTests(bail, reportProgress);
    const report = {
      passed: 0,
      failed: []
    };
    suites.forEach((s) => {
      if (s.tests) {
        s.tests
          .filter((test) => test.result !== undefined)
          .forEach((test) => {
            const {
              result: { ok, error: ERROR }
            } = test;
            if (ok) {
              report.passed += 1;
            } else {
              const x = chalk.red('X');
              const fnText = test.toString();
              const fnLength = fnText.split('\n').length;
              const path = test.stack.includes('(')
                ? test.stack.split('(')[1].split(')')[0]
                : test.stack.split('at')[1].trim();
              const stack = (
                (ERROR && ERROR.stack)
                || new NoAnError(ERROR).stack
              );
              const [filename, lineNumber] = path.split(':');
              const endLineNumber = getLineNumber(filename, stack, Number.parseInt(lineNumber, fnLength) + 10);
              report.failed.push({
                title: `${x} ${s.title} -> ${test.title}`,
                path,
                code: readFuctionSource(
                  filename, lineNumber, endLineNumber + 1, fnLength
                ) + '\n',
                diff: errorDIFF(ERROR),
                stack
              });
            }
          });
      }
    });
    return report;
  };
  return {
    suite,
    run,
  };
};

module.exports = {
  runner,
};
