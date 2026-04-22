import js from '@eslint/js';
import react from 'eslint-plugin-react';
import reactHooks from 'eslint-plugin-react-hooks';
import globals from 'globals';

export default [
  {
    ignores: [
      'frontend/components/dashboard/DashboardWidgetWrapper.jsx',
    ],
  },
  js.configs.recommended,
  {
    files: ['frontend/**/*.{js,jsx}'],
    plugins: {
      react,
      'react-hooks': reactHooks,
    },
    languageOptions: {
      ecmaVersion: 2022,
      sourceType: 'module',
      parserOptions: {
        ecmaFeatures: {
          jsx: true,
        },
      },
      globals: {
        ...globals.browser,
        ...globals.node,
        ...globals.es2021,
        firstName: 'readonly',
        describe: 'readonly',
        test: 'readonly',
        expect: 'readonly',
        beforeEach: 'readonly',
        jest: 'readonly',
        it: 'readonly',
        afterEach: 'readonly',
        console: 'readonly',
        window: 'readonly',
        document: 'readonly',
        setTimeout: 'readonly',
        setInterval: 'readonly',
        clearTimeout: 'readonly',
        clearInterval: 'readonly',
        Promise: 'readonly',
        fetch: 'readonly',
        FormData: 'readonly',
        URLSearchParams: 'readonly',
        localStorage: 'readonly',
        sessionStorage: 'readonly',
        navigator: 'readonly',
        location: 'readonly',
        React: 'readonly',
        JSX: 'readonly',
      },
    },
    rules: {
      'react/react-in-jsx-scope': 'off',
      'react/prop-types': 'off',
      'react-hooks/rules-of-hooks': 'off',
      'react-hooks/exhaustive-deps': 'off',
      'no-unused-vars': 'off',
      'no-console': 'off',
      'react/jsx-no-undef': 'off',
      'react/jsx-pascal-case': 'off',
      'react/display-name': 'off',
      'no-case-declarations': 'off',
      'no-useless-escape': 'off',
      'no-empty': 'off',
      'no-prototype-builtins': 'off',
      'no-unsafe-finally': 'off',
      'no-dupe-keys': 'off',
      'no-constant-condition': 'off',
      'no-constant-binary-expression': 'off',
      'no-shadow-restricted-names': 'off',
      'no-undef': 'off',
      'no-dupe-class-members': 'off',
      'no-unexpected-token': 'off',
    },
    settings: {
      react: {
        version: 'detect',
      },
    },
  },
];
