import { suite, test } from '..';
import assert from 'assert';

test('1', () => {
  throw new Error('bras')
  assert(false)
});
