import { suite } from '../..';
import { runner } from '../../lib/runner';
import assert from 'assert';
import { get as getCurrentLine } from 'current-line';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);

// eslint-disable-next-line @typescript-eslint/no-empty-function
const noop = () => {};

const getNextLineNo = () => `${getCurrentLine(1).line + 1}`;

let test = suite('suit setup hooks failuer');
test('the setup hook failse', async () => {
  const { suite: suteUnderTest, run } = runner();
  const t = suteUnderTest('test');
  const expectedLine = getNextLineNo();
  t.setup(() => {
    throw new Error('setup hook error');
  });
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  t('test', () => {});
  const report = await run(false, noop);
  assert.equal(report.failed[0].diff, undefined);
  const [filename, line, column] = report.failed[0].path.split(':');
  assert.equal(filename, __filename);
  assert.equal(line, expectedLine);
  assert.equal(column, '5');
});

test = suite('suit teardown hooks failuer');
test('the setup hook failse', async () => {
  const { suite: suteUnderTest, run } = runner();
  const t = suteUnderTest('test');
  const expectedLine = getNextLineNo();
  t.teardown(() => {
    throw new Error('teardown hook error');
  });
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  t('test', () => {});
  const report = await run(false, noop);
  assert.equal(report.failed[0].diff, undefined);
  const [filename, line, column] = report.failed[0].path.split(':');
  assert.equal(filename, __filename);
  assert.equal(line, expectedLine);
  assert.equal(column, '5');
});

test = suite('suit before hooks failuer');
test('the setup hook failse', async () => {
  const { suite: suteUnderTest, run } = runner();
  const t = suteUnderTest('test');
  const expectedLine = getNextLineNo();
  t.before(() => {
    throw new Error('before hook error');
  });
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  t('test', () => {});
  const report = await run(false, noop);
  assert.equal(report.failed[0].diff, undefined);
  const [filename, line, column] = report.failed[0].path.split(':');
  assert.equal(filename, __filename);
  assert.equal(line, expectedLine);
  assert.equal(column, '5');
});

test = suite('suit after hooks failuer');
test('the setup hook failse', async () => {
  const { suite: suteUnderTest, run } = runner();
  const t = suteUnderTest('test');
  const expectedLine = getNextLineNo();
  t.after(() => {
    throw new Error('after hook error');
  });
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  t('test', () => {});
  const report = await run(false, noop);
  assert.equal(report.failed[0].diff, undefined);
  const [filename, line, column] = report.failed[0].path.split(':');
  assert.equal(filename, __filename);
  assert.equal(line, expectedLine);
  assert.equal(column, '5');
});
