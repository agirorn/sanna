import { test } from '../index.js';
import assert from 'assert';

test('one', () => {
  assert(true);
});

const delay = async (ms: number) =>
  new Promise<void>((resolve) => {
    setTimeout(resolve, ms);
  });

test('two', async () => {
  await delay(10);
  assert(true);
});

for (let i = 0; i < 10; i++) {
  test(`test number ${i}`, () => {
    assert(true);
  });
}
