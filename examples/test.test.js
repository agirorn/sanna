const { suite, test } = require('..');
const assert = require('assert');

const delay = (ms = 200) => new Promise((resolve) => setTimeout(resolve, ms));
const s = suite('bada bing');
s('Assert true is true', async () => {
  assert(true);
});

// test('1', () => {
//   throw new Error('bras')
//   assert(true)
// });

test('Assert true is true', async () => {
  await delay(250);
  assert(true);
});

test('Check if true is false', async () => {
  await delay(200);
  assert.equal(true, false);
});

test('Assert true is true', () => {
  assert(true);
});

const fn = (ms = 200) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      // eslint-disable-next-line prefer-promise-reject-errors
      reject('sdfsdf');
    }, ms);
  });
};

s('async bad guy', async () => {
  await delay(200);
  assert(true);
  return fn();
});

s('async bad guy', async () => {
  await delay(200);
  assert(true);
  throw new Error('babú');
});

s('async bad guy', async () => {
  await delay(200);
  assert(true);
  // eslint-disable-next-line no-throw-literal
  throw 'babú';
});

s('async bad guy', async () => {
  await delay(200);
  assert(true);
  // eslint-disable-next-line prefer-promise-reject-errors
  return Promise.reject('babú');
});

s('async bad guy', async () => {
  await delay(200);
  assert(true);
  // eslint-disable-next-line prefer-promise-reject-errors
  return Promise.reject();
});
