module.exports = {
  root: true,
  parser: '@typescript-eslint/parser',
  plugins: ['@typescript-eslint', '@shopify/assemblyscript'],
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/eslint-recommended',
    'plugin:@typescript-eslint/recommended',
    'prettier/@typescript-eslint'
  ],
  parserOptions: {
    ecmaVersion: 2020,
    sourceType: 'module',
    ecmaFeatures: {}
  },
  rules: {},
  overrides: [
    {
      // AssemblyScript
      files: ['src/**/*.ts'],
      rules: {
        'prefer-const': 'off',
        'no-var': 'off',
        'no-fallthrough': 'off',
        'no-constant-condition': ['error', { checkLoops: false }],
        'no-inner-declarations': 'off',
        eqeqeq: 'off',
        'no-underscore-dangle': ['off'],
        '@typescript-eslint/no-this-alias': 'off',
        '@typescript-eslint/no-unused-vars': [
          'warn',
          {
            vars: 'local',
            varsIgnorePattern: '^[A-Z](?:From|To)?$', // ignore type params
            args: 'none',
            ignoreRestSiblings: false
          }
        ],
        '@typescript-eslint/no-namespace': 'off',
        '@typescript-eslint/no-array-constructor': 'off',
        '@typescript-eslint/ban-ts-comment': 'off',
        '@typescript-eslint/no-non-null-assertion': 'off',
        '@typescript-eslint/no-unsafe-assignment': 'off',
        '@typescript-eslint/no-unsafe-call': 'off',
        '@typescript-eslint/no-unsafe-member-access': 'off',
        '@typescript-eslint/no-unsafe-return': 'off',
        '@typescript-eslint/no-unnecessary-type-assertion': 'off',
        '@typescript-eslint/restrict-plus-operands': 'off'
      }
    }
  ]
};
