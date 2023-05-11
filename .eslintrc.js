module.exports = {
  root: true,
  plugins: ['@typescript-eslint', 'import', 'prettier', '@tanstack/query'],
  rules: {
    'no-undef': 'error',
    'no-var': 'error',
    'no-unused-vars': 'error',
    '@typescript-eslint/no-use-before-define': 'off',
    'import/no-extraneous-dependencies': 'off',
    '@typescript-eslint/no-shadow': 'off',
    '@tanstack/query/exhaustive-deps': 'error',
    '@tanstack/query/prefer-query-object-syntax': 'error',
  },
  extends: [
    'airbnb-typescript/base',
    'plugin:prettier/recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:import/typescript',
    'plugin:@tanstack/eslint-plugin-query/recommended',
  ],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    project: './tsconfig.json',
  },
  globals: {
    __DEV__: true,
  },
  env: {
    node: true,
  },
};
