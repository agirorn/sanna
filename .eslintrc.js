module.exports = {
  extends: ['standard'],
  rules: {
    'no-console': 'error',
    'comma-dangle': ['error', {
      arrays: 'only-multiline',
      objects: 'only-multiline',
      imports: 'only-multiline',
      exports: 'only-multiline',
      functions: 'only-multiline'
    }],
    'operator-linebreak': ['error', 'before'],
    'semi': ['error', 'always'],
  }
}
