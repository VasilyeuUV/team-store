import js from '@eslint/js';
import globals from 'globals';
import tseslint from 'typescript-eslint';
import jsdoc from 'eslint-plugin-jsdoc';
import eslintConfigPrettier from 'eslint-config-prettier';

export default tseslint.config(
  { ignores: ['dist', 'node_modules'] },
  { languageOptions: { globals: globals.browser } },
  js.configs.recommended,
  ...tseslint.configs.recommended,
  {
    plugins: { jsdoc },
    rules: {
      'jsdoc/require-jsdoc': [
        'warn',
        {
          publicOnly: true,
          require: {
            FunctionDeclaration: true,
            ClassDeclaration: true,
            MethodDefinition: false,
          },
          contexts: [
            'TSInterfaceDeclaration',
            'TSTypeAliasDeclaration',
            'TSEnumDeclaration',
            'ExportNamedDeclaration > VariableDeclaration',
          ],
        },
      ],
      'jsdoc/require-description': 'warn',
    },
  },
  {
    rules: {
      '@typescript-eslint/consistent-type-imports': 'warn',
      'prefer-const': 'warn',
      eqeqeq: ['warn', 'always'],
      '@typescript-eslint/no-unused-vars': [
        'warn',
        {
          argsIgnorePattern: '^_',
          varsIgnorePattern: '^_',
          caughtErrorsIgnorePattern: '^_',
        },
      ],
    },
  },
  {
    files: ['src/**/*.ts'],
    ignores: ['src/**/*.d.ts'],
    rules: {
      'jsdoc/require-file-overview': [
        'warn',
        {
          tags: {
            file: {
              initialCommentsOnly: true,
              mustExist: true,
              preventDuplicates: true,
            },
          },
        },
      ],
    },
  },
  eslintConfigPrettier,
);
