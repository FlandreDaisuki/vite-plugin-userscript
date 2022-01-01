module.exports = {
  root: true,
  env: {
    node: true,
    commonjs: true,
    es6: true,
  },
  parser: '@typescript-eslint/parser',
  plugins: [
    '@typescript-eslint',
  ],
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
  ],
  rules: {
    'array-bracket-newline': ['error', 'consistent'],
    'arrow-parens': 'error',
    'arrow-spacing': 'error',
    'block-spacing': 'error',
    'brace-style': ['error', '1tbs', { allowSingleLine: true }],
    'comma-dangle': ['error', 'always-multiline'],
    'comma-spacing': 'error',
    indent: ['error', 2],
    'key-spacing': 'error',
    'keyword-spacing': 'error',
    'max-len': 'off',
    'no-console': 'off',
    'no-multi-spaces': 'error',
    'no-multiple-empty-lines': ['error', { max: 2, maxEOF: 0 }],
    'object-curly-spacing': ['error', 'always'],
    quotes: ['error', 'single'],
    'quote-props': ['error', 'as-needed'],
    semi: ['error', 'always'],
    'space-before-function-paren': ['error', 'never'],
    'space-infix-ops': 'error',
    'template-curly-spacing': 'error',
  },
  overrides: [{
    files: [
      '**/__tests__/*.{j,t}s?(x)',
      '/**/*.spec.{j,t}s?(x)',
    ],
    env: {
      jest: true,
    },
  }],
};
