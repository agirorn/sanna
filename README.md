[![npm version][npm-badge]][npm-link]
[![Build Status][travis-badge]][travis-link]

# sanna

> Sanna is an opinionated testing framework for node.js focused developer
> productivity and easy of use

It works with any assertion library that throws and [AssertionError] from built
in the [assert] module or an error the actual or expected values set.

The API [Documention](./docs/api.md)

## Installation

```shell
  npm install sanna
```

## Usage

In a tests file **tests/first.test.js**

```shell
const { suite, test } = require('sanna');
const assert = require('assert')

const s = suite('True values')
s('Test if true realy is true', () => {
  assert(true)
});

const assertIsTrue = (actual) => {
  if (actual !== true) {
    throw new assert.AssertionError({
      message: 'Asserted value is not true',
      actual,
      expected: true,
    });
  }
};

s('Home maied assertion testing if a value is true', () => {
  assert(true)
});
```

## Running

Running tests can be done in 2 ways.

1. By running the sanna executable installed by the module it by default looks
   for `*.test.js` files in the tests folder.

```shell
sanna tests/first.test.js
```

2. run the tests files directly with node.js mostly useful for running an single
   test file at a time

```shell
node tests/first.test.js
```

## On test success

Print out progress dots and success stats.

$ sanna tests/test.js
....

  4 tests passed


## On test failure

Prints out a nifty error report include
- The test file and line number of the test or hook that failed
- The error and it's stack-trace
- A diff or the AssertionError actual and expected values
- Failed/Pass stats

```shell
$ sanna tests/first.test.js

Suite Name
  x test text

  Code: /Users/username/project/tests/first.test.js:19:1

    19 test('Check if true is false', () => {
    20   assert.equal(true, false)
    21 });

  Error: AssertionError [ERR_ASSERTION]: true == false
    at /Users/username/code/project/tests/test.js:20:10
    at /Users/username/code/project/.../index.js:52:15
    at /Users/username/code/project/.../index.js:17:23
    at next (/Users/username/code/project/.../index.js:17:9)

  Difference:
    - true
    + false

  3 tests passed
  1 tests failed
```

## The name sanna

> sýna fram á e-ð, sýna að e-ð sé satt, styðja óhrekjandi rökum

It is the Icelandic name of proving or is true or correct without a doubt.

[assert]: https://nodejs.org/api/assert.html
[AssertionError]: https://nodejs.org/api/assert.html#assert_new_assert_assertionerror_options

[npm-badge]: https://badge.fury.io/js/sanna.svg
[npm-link]: https://badge.fury.io/js/sanna
[travis-badge]: https://travis-ci.org/agirorn/sanna.svg?branch=master
[travis-link]: https://travis-ci.org/agirorn/sanna
