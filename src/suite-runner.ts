import pSeries from 'p-series';
import chalk from 'chalk';
import { highlight } from 'cli-highlight';
import { readFileSync } from 'fs';
import { diff } from 'concordance';
import { AssertionError } from 'assert';
import { IReport } from './types.js';

const DEFAULT_TIMEOUT_MS = 1000;

const { red, green, yellow } = chalk;
const isError = (error: unknown | Error): error is Error =>
  error instanceof Error;

const defaultReportProgress = (success: boolean) => {
  const progress = success ? green('.') : red('.');
  process.stdout.write(progress);
};

class NotAnError extends Error {
  constructor(message: unknown) {
    super(`The error(${message}) is not an Error object`);
    this.name = this.constructor.name;
  }
}
const asNumber = (v: string) => Number.parseInt(v, 10);
const getLineNumber = (
  filename: string,
  stack: string,
  defaultValue: number
) => {
  const foundLine = stack.split('\n').find((line) => {
    return line.includes(filename);
  });
  if (foundLine) {
    const res = foundLine.toString().split(':');

    return asNumber(res[1]);
  }

  return asNumber(`${defaultValue}`);
};

const readFuctionSource = (
  file: string,
  startLine: number,
  endLine: number,
  fnLength: number,
  errorLine: number
) => {
  const padLength = endLine.toString().length;
  const lines = readFileSync(file).toString();
  let currentLine = startLine;
  const onlyTestLines = lines
    .split('\n')
    .slice(startLine - 1, endLine)
    // Removes last empty line if pressent.
    .join('\n')
    .trimRight()
    .split('\n')
    .map((v: string) => {
      let lineNo = (currentLine++).toString();
      const marker = lineNo === errorLine.toString() ? '*' : ' ';
      lineNo = lineNo.padStart(padLength);
      return `${marker} ${lineNo} ${v}`;
    })
    .join('\n');
  return highlight(onlyTestLines, {
    language: 'javascript',
    ignoreIllegals: true,
  });
};

const has = (error: object, key: string) => Object.keys(error).includes(key);
const isDiffable = (error: Error | AssertionError): error is AssertionError =>
  has(error || {}, 'actual') && has(error, 'expected');
const errorDIFF = (error: Error | AssertionError) => {
  if (!isDiffable(error)) {
    return undefined;
  }
  const DIFF = diff(error.actual, error.expected);
  return DIFF.split('\n')
    .map((line: string) => {
      if (line.startsWith('-')) {
        return red(line);
      }

      if (line.startsWith('+')) {
        return yellow(line);
      }
      return green(line);
    })
    .join('\n');
};

interface ITestSuite {
  tests: ITestFunctionInternal[];
}

interface IReportProgress {
  (value: boolean): void;
}

interface IFunctionWithStack {
  (context: unknown): void;
  stack: string;
}

interface ITestState {
  shouldStop: boolean;
}

interface ITestResult {
  ok: boolean;
  error: unknown | Error;
  errorError: Error;
}

const hookFactory = (
  suite: ITestSuite,
  context: unknown,
  reportProgress: IReportProgress,
  bail: boolean,
  fn: IFunctionWithStack,
  state: ITestState
) => {
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
      const result: ITestResult = {
        ok: false,
        error: error,
        errorError: new Error('Failed'),
      };
      suite.tests.forEach((test: ITestFunctionInternal) => {
        test.result = result;
        test.stack = fn.stack;
      });
    }
  };
};
interface ISuite {
  title: string;
  tests: ITestFunctionInternal[];
  setups: ILiveCycleFuction[];
  teardowns: ILiveCycleFuction[];
  befores: ILiveCycleFuction[];
  afters: ILiveCycleFuction[];
}

export interface ITestFunction {
  (): Promise<void> | void;
}

interface ITestFunctionInternal {
  (): Promise<void> | void;
  title: string;
  stack: string;
  result: ITestResult;
  timeout: number;
}

export interface ILiveCycleCallback {
  (): Promise<void> | void;
}

export interface ILiveCycleFuction {
  (): Promise<void> | void;
  stack: string;
  timeout: number;
}

// All the errors here have a stack
const stackCaller = (error: Error) =>
  (error.stack as string).split('\n').slice(2, 3)[0];

// eslint-disable-next-line @typescript-eslint/no-empty-interface
interface IReportProgress {}

// eslint-disable-next-line @typescript-eslint/no-empty-interface
interface ITestContext {}

const guardAgentstTimeout = async (ms: number) =>
  new Promise((reslive, reject) => {
    setTimeout(() => {
      reject(new Error(`Test timedout after ${ms}`));
    }, ms);
  });

export const runner = () => {
  const suites: ISuite[] = [];

  const suite = (title: string) => {
    const SUITE: ISuite = {
      title,
      tests: [],
      setups: [],
      teardowns: [],
      befores: [],
      afters: [],
    };
    suites.push(SUITE);
    const test = (
      title: string,
      fn: ITestFunction,
      timeout = DEFAULT_TIMEOUT_MS
    ) => {
      const testFn: ITestFunctionInternal = fn as ITestFunctionInternal;
      testFn.title = title;
      testFn.stack = stackCaller(new Error('stack'));
      testFn.timeout = timeout;
      SUITE.tests.push(testFn);
    };
    test.setup = (fn: ILiveCycleCallback, timeout = DEFAULT_TIMEOUT_MS) => {
      const FN = fn as ILiveCycleFuction;
      FN.stack = stackCaller(new Error('stack'));
      FN.timeout = timeout;
      SUITE.setups.push(FN);
    };
    test.teardown = (fn: ILiveCycleCallback, timeout = DEFAULT_TIMEOUT_MS) => {
      const FN = fn as ILiveCycleFuction;
      FN.stack = stackCaller(new Error('stack'));
      FN.timeout = timeout;
      SUITE.teardowns.push(FN);
    };
    test.before = (fn: ILiveCycleCallback, timeout = DEFAULT_TIMEOUT_MS) => {
      const FN = fn as ILiveCycleFuction;
      FN.stack = stackCaller(new Error('stack'));
      FN.timeout = timeout;
      SUITE.befores.push(FN);
    };
    test.after = (fn: ILiveCycleCallback, timeout = DEFAULT_TIMEOUT_MS) => {
      const FN = fn as ILiveCycleFuction;
      FN.stack = stackCaller(new Error('stack'));
      FN.timeout = timeout;
      SUITE.afters.push(FN);
    };
    return test;
  };

  const executeTests = async (
    bail = false,
    reportProgress: IReportProgress
  ) => {
    const state = {
      shouldStop: false,
    };
    const tasks = suites
      .map((s) => {
        const suitContext = {};
        return [
          s.setups.map((fn) => {
            return hookFactory(s, suitContext, reportProgress, bail, fn, state);
          }),
          s.tests
            .map((test) => {
              let testContext: ITestContext;
              return [
                s.befores.map((fn) => {
                  return async () => {
                    if (!testContext) {
                      testContext = {
                        ...suitContext,
                      };
                    }
                    await hookFactory(
                      s,
                      testContext,
                      reportProgress,
                      bail,
                      fn,
                      state
                    )();
                  };
                }),
                [
                  async () => {
                    if (test.result || state.shouldStop) {
                      return;
                    }
                    try {
                      await Promise.race([
                        test(),
                        guardAgentstTimeout(test.timeout),
                      ]);
                      test.result = {
                        ok: true,
                        error: null,
                        errorError: new Error('NO ERROR'),
                      };
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
                  },
                ],
                s.afters.map((fn) => {
                  return async () => {
                    if (!testContext) {
                      testContext = {
                        ...suitContext,
                      };
                    }
                    await hookFactory(
                      s,
                      testContext,
                      reportProgress,
                      bail,
                      fn,
                      state
                    )();
                  };
                }),
              ].flat();
            })
            .flat(),
          s.teardowns.map((fn) => {
            return hookFactory(s, suitContext, reportProgress, bail, fn, state);
          }),
        ];
      })
      .flat();
    await pSeries(tasks.flat());
    return suites;
  };
  const run = async (
    bail = false,
    reportProgress = defaultReportProgress
  ): Promise<IReport> => {
    await executeTests(bail, reportProgress);
    const report: IReport = {
      passed: 0,
      failed: [],
    };
    suites.forEach((s) => {
      if (s.tests) {
        s.tests
          .filter((test) => test.result !== undefined)
          .forEach((test) => {
            const {
              result: { ok, error: ERROR },
            } = test;
            if (ok) {
              report.passed += 1;
            } else {
              const x = red('X');
              const fnText = test.toString();
              const fnLength = fnText.split('\n').length;

              let path = test.stack.includes('(')
                ? test.stack.split('(')[1].split(')')[0]
                : // : test.stack.split('at')[1].trim();
                  test.stack
                    .split('\n')[0]
                    .split('at')
                    .slice(1)
                    .join('at')
                    .trim();

              if (path.startsWith('file:///')) {
                path = path.slice(7);
              }
              const stack = isError(ERROR)
                ? (ERROR.stack as string)
                : (new NotAnError(ERROR).stack as string);
              const [filename, lineNumber] = path.split(':');
              const errorLineNumber = getLineNumber(
                filename,
                stack,
                Number.parseInt(lineNumber, fnLength) + 10
              );

              const code: string =
                path === '!!!PATH-ERROR!!!'
                  ? `Path error test.stack = "${test.stack}"`
                  : readFuctionSource(
                      filename,
                      Number.parseInt(lineNumber, 10),
                      errorLineNumber + 5,
                      fnLength,
                      errorLineNumber
                    ) + '\n';
              report.failed.push({
                title: `${x} ${s.title} -> ${test.title}`,
                path,
                code,
                diff: errorDIFF(ERROR as Error),
                stack,
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
