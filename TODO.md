# TODO

## Fix the stacktrace bugs

When an error is found in setup, before, after or teardonw, then the staktarace
is wrong and the wrong test file is show. Showing another test file.


## Fix the reqursive folder loader

the followint error  is encounterd when trying to load neasted tests using the
dirs configurtion.

__error ReferenceError: exports is not defined in ES module scope This file is
being treated as an ES module because it has a '.js' file extension and
'/Users/username/code/project/package.json' contains "type": "module". To treat
it as a CommonJS script, rename it to use the '.cjs' file extension.__

For instance when running the following code in the root of a project that has
one of its test files in src/tests/some/test/folder/test.test.ts

```
import { run, dirnameFrom } from 'sanna';

console.log(dirnameFrom(import.meta))

run({
  dirs: [dirnameFrom(import.meta)],
});
```

## Use the published eslint and prettyre modules

- eslint-config-viking
- prettier-config-viking

## Fix the examples folder

## Fix the docs folder

## Fix or replace all the tests

## Check if the diff output is reversed

```js
const test = suite('deepStrictEqual');
test('Create game', async () => {
  assert.deepStrictEqual(
    [{
      name: 'GAME_CREATED',
    }],
    [{
    }]
  )
});
```

This should print out an error

  Difference:

      [
        {
    -     name: 'GAME_CREATED', # IN READ
        },
      ]




## The code printing cuts of at around 170 lines
## Publish module
## Add ftest to focus on a single test
## Add xtest to disable a single test
## Add fsuit to focus on a single suit
## Add xsuit to disable on a single suit

## make a better assertPartial as a separate module and then allow
   Currently it prints out all of the actual object but it should only include
   what is found and what is missing. All the other stuff from a partial is just
   confusing.
