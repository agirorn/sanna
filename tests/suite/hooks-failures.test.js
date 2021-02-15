const { suite } = require('../..');
const { runner } = require('../../lib/runner');
const assert = require('assert');
const { get: getCurrentLine } = require('current-line');

const noop = () => {};

const getNextLineNo = () => `${getCurrentLine(1).line + 1}`;

let test = suite('suit setup hooks failuer');
test('the setup hook failse', async () => {
  const { suite: suteUnderTest, run } = runner();
  const t = suteUnderTest('test');
  const expectedLine = getNextLineNo();
  t.setup(() => { throw new Error('setup hook error'); });
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
  t.teardown(() => { throw new Error('teardown hook error'); });
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
  t.before(() => { throw new Error('before hook error'); });
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
  t.after(() => { throw new Error('after hook error'); });
  t('test', () => {});
  const report = await run(false, noop);
  assert.equal(report.failed[0].diff, undefined);
  const [filename, line, column] = report.failed[0].path.split(':');
  assert.equal(filename, __filename);
  assert.equal(line, expectedLine);
  assert.equal(column, '5');
});
