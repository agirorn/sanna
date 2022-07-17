# TODO

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
