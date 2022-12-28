import { suite } from '../..';
import { red } from 'chalk';
import { runner } from '../../lib/runner';
import assert from 'assert';
import { assertPartial } from '../assertions';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);

// eslint-disable-next-line @typescript-eslint/no-empty-function
const noop = () => {};
const isANumber = (v) => !Number.isNaN(Number.parseInt(v, 10));

const test = suite('bada bing');
test('a sucessfull test', async () => {
  const { suite: suteUnderTest, run } = runner();
  const t = suteUnderTest('test');
  t('test', () => {
    assert.ok(true);
  });

  assert.deepStrictEqual(await run(false, noop), {
    passed: 1,
    failed: [],
  });
});

test('a failing test', async () => {
  const { suite: suteUnderTest, run } = runner();
  const t = suteUnderTest('test');
  t('test', () => {
    assert(false);
  });
  const report = await run(false, noop);
  assertPartial(report, {
    passed: 0,
    failed: [
      {
        title: `${red('X')} test -> test`,
      },
    ],
  });
  assert.ok(report.failed[0].diff);
  const [filename, line, column] = report.failed[0].path.split(':');
  assert.equal(filename, __filename);
  assert.ok(isANumber(line));
  assert.ok(isANumber(column));
});
