const { suite } = require('../..');
const { runner } = require('../../lib/runner');
const assert = require('assert');

const noop = () => {};

let test;

test = suite('suit setup hooks');
test('the setup hook', async () => {
  const { suite: suteUnderTest, run } = runner();
  const t = suteUnderTest('test');
  const hook = { ran: false };
  t.setup(() => { hook.ran = true; });
  t('test', () => {});
  await run(false, noop);
  assert.ok(hook.ran);
});

test = suite('suit teardown hooks');
test('the teardown hook', async () => {
  const { suite: suteUnderTest, run } = runner();
  const t = suteUnderTest('test');
  const hook = { ran: false };
  t.teardown(() => { hook.ran = true; });
  t('test', () => {});
  await run(false, noop);
  assert.ok(hook.ran);
});

test = suite('suit before hooks');
test('the before hook', async () => {
  const { suite: suteUnderTest, run } = runner();
  const t = suteUnderTest('test');
  const hook = { ran: false };
  t.before(() => { hook.ran = true; });
  t('test', () => {});
  await run(false, noop);
  assert.ok(hook.ran);
});

test('running 2 tests', async () => {
  const { suite: suteUnderTest, run } = runner();
  const t = suteUnderTest('test');
  const hook = { ran: 0 };
  t.before(() => { hook.ran += 1; });
  t('test', () => {});
  t('test', () => {});
  await run(false, noop);
  assert.equal(hook.ran, 2);
});

test = suite('suit after hooks');
test('the after hook', async () => {
  const { suite: suteUnderTest, run } = runner();
  const t = suteUnderTest('test');
  const hook = {};
  t.after(() => { hook.ran = true; });
  t('test', () => {});
  await run(false, noop);
  assert.ok(hook.ran);
});

test('the after hook', async () => {
  const { suite: suteUnderTest, run } = runner();
  const t = suteUnderTest('test');
  const hook = { ran: 0 };
  t.after(() => { hook.ran += 1; });
  t('test', () => {});
  t('test', () => {});
  await run(false, noop);
  assert.equal(hook.ran, 2);
});

test = suite('suit hooks context');
test('what is availabel through the chook context', async () => {
  const { suite: suteUnderTest, run } = runner();
  const t = suteUnderTest('test');
  const state = {};
  t.setup(() => { state.setupValue = 'setupValue'; });
  t.before(() => { state.beforeValue = 'beforeValue'; });
  t.after(() => { state.assertValue = 'assertValue'; });
  t.teardown(() => { state.teardownValue = 'teardownValue'; });
  t('test', () => { assert.ok(true); });
  await run(false, noop);
  assert.deepStrictEqual(
    state,
    {
      setupValue: 'setupValue',
      beforeValue: 'beforeValue',
      assertValue: 'assertValue',
      teardownValue: 'teardownValue',
    }
  );
});

test = suite('suit hooks context');
test('what is availabel through the chook context', async () => {
  const { suite: suteUnderTest, run } = runner();
  const t = suteUnderTest('test');
  let afterContect;
  let testContext;
  let teardownContext;
  t.setup((context) => { context.setupValue = 'setupValue'; });
  t.before((context) => { context.beforeValue = 'beforeValue'; });
  t.after((context) => { afterContect = { ...context }; });
  t.teardown((context) => { teardownContext = { ...context }; });
  t('test', (context) => { testContext = { ...context }; });
  await run(false, noop);
  assert.deepStrictEqual(
    testContext,
    {
      beforeValue: 'beforeValue',
      setupValue: 'setupValue',
    }
  );
  assert.deepStrictEqual(
    afterContect,
    {
      beforeValue: 'beforeValue',
      setupValue: 'setupValue',
    }
  );
  assert.deepStrictEqual(
    teardownContext,
    { setupValue: 'setupValue' }
  );
});
