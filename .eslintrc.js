// Docs https://eslint.org/docs/user-guide/configuring
module.exports = {
  parser: '@typescript-eslint/parser', // Specifies the ESLint parser
  parserOptions: {
      ecmaVersion: 2020, // Allows for the parsing of modern ECMAScript features
      sourceType: 'module', // Allows for the use of imports
      ecmaFeatures: {
          jsx: true, // Allows for the parsing of JSX
      },
      project: './tsconfig.json',
  },
  ignorePatterns: ['/node_modules/**', 'webpack.config.js'],
  settings: {
      react: {
          version: 'detect', // Tells eslint-plugin-react to automatically detect the version of React to use
      },
      'import/extensions': ['.js', '.jsx', '.ts', '.tsx'],
      'import/resolver': {
          node: {
              extensions: ['.js', '.jsx', '.ts', '.tsx'],
          },
          typescript: {},
      },
  },
  plugins: ['jam3', '@typescript-eslint'],
  extends: [
      'airbnb',
      'airbnb-typescript',
      // Uses the recommended rules from @eslint-plugin-react
      'plugin:react/recommended',
      'plugin:react-hooks/recommended',
      // https://github.com/nodesecurity/eslint-plugin-security
      'plugin:security/recommended',
      // https://github.com/SonarSource/eslint-plugin-sonarjs
      'plugin:sonarjs/recommended',
      // Uses eslint-config-prettier to disable ESLint rules from @typescript-eslint/eslint-plugin that would conflict with prettier
      // Enables eslint-plugin-prettier and eslint-config-prettier. This will display prettier errors as ESLint errors. Make sure this is always the last configuration in the extends array.
      'prettier',
      'plugin:prettier/recommended',
  ],
  rules: {
      // Place to specify ESLint rules. Can be used to overwrite rules specified from the extended configs
      // e.g. '@typescript-eslint/explicit-function-return-type': 'off',
      'react/react-in-jsx-scope': 'off',
      '@typescript-eslint/ban-ts-comment': 'off',
      '@typescript-eslint/naming-convention': [
          'error',
          {
              selector: 'variable',
              types: ['boolean'],
              format: ['PascalCase'],
              prefix: ['is', 'should', 'has', 'can', 'did', 'will'],
          },
      ],
      'import/order': [
          'error',
          {
              'newlines-between': 'always',
              groups: [
                  'builtin',
                  'external',
                  'internal',
                  ['parent', 'sibling', 'index'],
                  'type',
                  'object',
                  'unknown',
              ],
              pathGroups: [
                  {
                      pattern: 'react',
                      group: 'builtin',
                      position: 'before',
                      patternOptions: {
                          matchBase: true,
                      },
                  },
                  {
                      pattern: '**/*.+(css|sass|less|scss|pcss|style)',
                      group: 'unknown',
                      patternOptions: {
                          matchBase: true,
                      },
                      position: 'after',
                  },
                  {
                      pattern: '{.,..}/**/*.+(css|sass|less|scss|pcss|style)',
                      group: 'unknown',
                      patternOptions: {
                          matchBase: true,
                      },
                      position: 'after',
                  },
              ],
              pathGroupsExcludedImportTypes: ['react'],
              distinctGroup: true,
              warnOnUnassignedImports: true,
              alphabetize: {
                  order: 'asc',
                  orderImportKind: 'asc',
                  caseInsensitive: true,
              },
          },
      ],
      '@typescript-eslint/no-var-requires': 0,
      'jam3/no-sanitizer-with-danger': [
          1,
          {
              wrapperName: ['sanitize'],
          },
      ],
      'no-param-reassign': [
          'error',
          { props: true, ignorePropertyModificationsFor: ['self'] },
      ],
      'react/jsx-props-no-spreading': 'off',
      'react/require-default-props': 'off',
      'react/function-component-definition': 'off',
      'jsx-a11y/anchor-is-valid': 'off',
      semi: ['error', 'never'],
      'import/no-extraneous-dependencies': ['error', { devDependencies: true }],
      'import/extensions': [
          'error',
          'ignorePackages',
          {
              js: 'never',
              jsx: 'never',
              ts: 'never',
              tsx: 'never',
          },
      ],
      'object-curly-spacing': ['error', 'always'],
      'no-underscore-dangle': 'off',
      'no-restricted-syntax': [
          'error',
          'ForInStatement',
          'LabeledStatement',
          'WithStatement',
      ],
      'no-console': ['warn', { allow: ['debug', 'warn', 'error'] }],
      'security/detect-object-injection': 'off',
      'comma-dangle': [
          'warn',
          {
              arrays: 'always-multiline',
              objects: 'always-multiline',
              imports: 'always-multiline',
              exports: 'always-multiline',
              functions: 'never',
          },
      ],
      '@typescript-eslint/consistent-type-imports': 'error',
  },
}
