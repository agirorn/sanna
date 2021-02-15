const { suite } = require('..');
const { red } = require('chalk');
const { runner } = require('../lib/runner');
const assert = require('assert');
const {
  assertDefined,
  assertPartial,
} = require('./assertions');

const noop = () => {};

const test = suite('bada bing');
test('a sucessfull test', async () => {
  const { suite: suteUnderTest, run } = runner();
  const t = suteUnderTest('test');
  t('test', () => {
    assert.ok(true);
  });

  assert.deepStrictEqual(
    await run(true, noop),
    {
      passed: 1,
      failed: [],
    }
  );
});

test('a failing test', async () => {
  const { suite: suteUnderTest, run } = runner();
  const t = suteUnderTest('test');
  t('test', () => {
    assert(false);
  });
  t('test that should not run', () => {
    assert(true);
  });
  const report = await run(true, noop);
  assertPartial(
    report,
    {
      passed: 0,
      failed: [{
        title: `${red('X')} test -> test`,
      }],
    }
  );

  assertDefined(report.failed[0].stack);
});

test('a failing setup', async () => {
  const { suite: suteUnderTest, run } = runner();
  const t = suteUnderTest('test');
  t.setup(() => {
    assert(false);
  });
  t('test that should not run', () => {
    assert(true);
  });

  const s = suteUnderTest('test');
  s.setup(() => {
    assert(false);
  });
  s('test that should not run', () => {
    assert(true);
  });
  const report = await run(true, noop);
  assertPartial(
    report,
    {
      passed: 0,
      failed: [{
        title: `${red('X')} test -> test that should not run`,
      }],
    }
  );

  assert.equal(report.failed.length, 1);
  assertDefined(report.failed[0].stack);
});

test('when bail is off failing setup', async () => {
  const { suite: suteUnderTest, run } = runner();
  const t = suteUnderTest('test');
  t.setup(() => {
    assert(false);
  });
  t('test that should not run', () => {
    assert(true);
  });

  const s = suteUnderTest('test');
  s.setup(() => {
    assert(false);
  });
  s('test that should not run', () => {
    assert(true);
  });
  const report = await run(false, noop);
  assertPartial(
    report,
    {
      passed: 0,
    }
  );

  assert.equal(report.failed.length, 2);
});

test('a failing before', async () => {
  const { suite: suteUnderTest, run } = runner();
  const t = suteUnderTest('test');
  t.before(() => {
    assert(false);
  });
  t('test that should not run', () => {
    assert(true);
  });
  const report = await run(true, noop);
  assertPartial(
    report,
    {
      passed: 0,
      failed: [{
        title: `${red('X')} test -> test that should not run`,
      }],
    }
  );
  assertDefined(report.failed[0].stack);
});
