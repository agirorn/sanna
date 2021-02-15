const { suite, setup, teardown } = require('..');
const assert = require('assert');

const connectToDatabase = () => {};
const disconnectFromDatabase = () => {};
const insertIntoDatbase = () => {};
const emptyDatabase = () => {};
const userCount = async (db) => (
  await db
    .queriy('SELECT count(id) from users LIMIT 1')
)[0];

let test;
test = suite('Single aggregate');
test.setup(connectToDatabase);
test.teardown(disconnectFromDatabase);
test('Assert true is true', async () => {
  assert(true);
});

test = suite('Single aggregate');
test('Assert true is true', async () => {
  assert(true);
});

setup(connectToDatabase); // setup for all tests
teardown(disconnectFromDatabase); // teardown for all tests

test = suite('Single aggregate');
test.setup(connectToDatabase); // Setup the suit
test.before(insertIntoDatbase); // before each test
test.after(emptyDatabase); // after each test
test.teardown(disconnectFromDatabase); // Tear down the suit
test('Assert true is true', async (context) => {
  assert(await userCount(context.db), 10);
});
