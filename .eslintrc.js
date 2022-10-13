module.exports = {
  root: true,
  env: {
    browser: true,
    es2021: true,
    node: true,
    'vue/setup-compiler-macros': true
  },
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:import/errors',
    'plugin:import/recommended',
    'plugin:import/typescript',
    'plugin:import/warnings',
    'plugin:tailwindcss/recommended',
    'plugin:vue/vue3-recommended',
    'prettier'
  ],
  rules: {
    'import/default': 2,
    'import/export': 2,
    'import/first': 'error',
    'import/named': 2,
    'import/namespace': 2,
    'import/newline-after-import': 'error',
    'import/no-duplicates': 'error',
    'import/no-unresolved': [2, { commonjs: true, amd: true }],
    'no-unused-vars': 'off',
    'no-undef': 'off',
    'simple-import-sort/exports': 'error',
    'simple-import-sort/imports': 'error'
  },
  overrides: [
    {
      files: ['src/**/*.vue'],
      rules: {
        'vue/multi-word-component-names': 'off'
      }
    },
    {
      files: ['*.ts', '*.mts', '*.cts', '*.tsx', '*.vue'],
      rules: {
        '@typescript-eslint/explicit-function-return-type': 'error'
      }
    }
  ],
  parser: 'vue-eslint-parser',
  parserOptions: {
    ecmaVersion: 'latest',
    parser: '@typescript-eslint/parser',
    sourceType: 'module'
  },
  plugins: ['vue', 'tailwindcss', 'prettier', 'simple-import-sort', 'import'],
  root: true,
  settings: {
    'import/parsers': {
      '@typescript-eslint/parser': ['.ts', '.tsx']
    },
    'import/resolver': {
      typescript: {},
      node: true
    }
  }
}
