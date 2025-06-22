module.exports = {
  root: true,
  env: {
    node: true
  },
  extends: [
    'plugin:vue/essential',
    '@vue/standard'
  ],
  parserOptions: {
    parser: '@babel/eslint-parser'
  },
  rules: {
    'no-console': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
    'no-debugger': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
    'space-before-function-paren': ['error', {
      'anonymous': 'never',
      'named': 'never',
      'asyncArrow': 'always'
    }],
    'comma-dangle': ['error', 'never'],
    'quotes': 'off',
    'semi': 'off',
    'no-trailing-spaces': 'off',
    'new-cap': 'off',
    'padded-blocks': 'off',
    'no-multi-spaces': 'off',
    "vue/no-parsing-error": "off"
  }
}
