import { suite } from '../../..';
import assert from 'assert';

const s = suite('setup should fail');
s.teardown(() => {
  throw new Error('bad code');
});

s('Assert true is true', async () => {
  assert(true);
});
