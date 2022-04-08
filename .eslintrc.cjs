module.exports = {
  root: true,
  env: {
    jest: true,
    commonjs: true,
  },
  parser: '@typescript-eslint/parser',
  plugins: [
    '@typescript-eslint',
  ],
  extends: [
    '@flandredaisuki',
    'plugin:@typescript-eslint/recommended',
  ],
  overrides: [
    {
      files: ['*.json', '*.json5'],
      parser: 'jsonc-eslint-parser',
      rules: {
        'semi': ['error', 'never'],
        'quotes': ['error', 'double'],
        'quote-props': ['error', 'always'],
        'comma-dangle': ['error', 'never'],
      },
    },
  ],
};
