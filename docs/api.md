# Sanna API

## suite

Returns an single test suite withe the

```js
const { suite } = require('sanna');
const assert = require('assert');

c = suite('Component')
c.test('it is true', () => {
  assert.ok(true, true)
});
```

## suite.test(description, test)

Registers a singe test in the suit.

- __description:__ The text description of the test
- __test:__ The actual test function. It is called with the test context.

```js
const { suite } = require('sanna');
const assert = require('assert');

c = suite('Component')
c.test('it is true', (context) => {
  assert.equal(true, true)
});
```

## suite.setup(hook)

Registers a hook that is executed before all test in the suit

- __hook:__ A function that is called with the test context.

```js
const { suite } = require('sanna');
const assert = require('assert');

c = suite('Component')
c.setup((context) => {
  context.value = true;
});
c.test('it is true', (context) => {
  assert.equal(context.value, true)
});
```

## suite.teardown(hook)

Registers a hook that is executed before all test in the suit

- __hook:__ A function that is called with the test context.
  Can be used to close databases connections for instance.

```js
const { suite } = require('sanna');
const assert = require('assert');

c = suite('Component')
c.test('it is true', (context) => {
  context.value = undefined
});
c.teardown((context) => {
  assert.equal(context.value, true)
});
```

## suite.before(hook)

Registers a hook that is executed before each test in the suit

- __hook:__ A function that is called with the test context.

```js
const { suite } = require('sanna');
const assert = require('assert');

c = suite('Component')
c.before((context) => {
  context.value = true;
});
c.test('it is true', (context) => {
  assert.equal(context.value, true)
});
```

## suite.after(hook)

Registers a hook that is executed after each test in the suit

- __hook:__ A function that is called with the test context.

```js
const { sanna } = require('sanna');
const assert = require('assert');

c = sanna('Component')
c.test('it is true', (context) => {
  context.value = undefined
});
c.after((context) => {
  assert.equal(context.value, true)
});
```
