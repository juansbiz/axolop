/**
 * Jest Configuration for Axolop CRM
 *
 * Supports both frontend (jsdom) and backend (node) tests
 */

export default {
  // Use projects for different test environments
  projects: [
    // Frontend tests (React components, etc.)
    {
      displayName: 'frontend',
      testEnvironment: 'jsdom',
      testMatch: [
        '<rootDir>/frontend/**/__tests__/**/*.test.js',
        '<rootDir>/frontend/**/*.spec.js',
      ],
      moduleNameMapper: {
        '^@/(.*)$': '<rootDir>/frontend/$1',
      },
      transform: {},
      setupFilesAfterEnv: ['<rootDir>/tests/setup.js'],
    },
    // Backend tests (Node.js API, etc.)
    {
      displayName: 'backend',
      testEnvironment: 'node',
      testMatch: [
        '<rootDir>/src/backend/**/__tests__/**/*.test.js',
        '<rootDir>/src/backend/**/*.spec.js',
      ],
      moduleNameMapper: {
        '^@/(.*)$': '<rootDir>/src/$1',
        '^@backend/(.*)$': '<rootDir>/src/backend/$1',
      },
      transform: {},
      setupFilesAfterEnv: ['<rootDir>/tests/setup.js'],
    },
  ],

  // Coverage configuration
  collectCoverageFrom: [
    'src/backend/**/*.js',
    'frontend/**/*.{js,jsx}',
    '!src/backend/**/__tests__/**',
    '!frontend/**/__tests__/**',
    '!**/node_modules/**',
    '!**/dist/**',
    '!**/build/**',
  ],

  coverageThreshold: {
    global: {
      branches: 50,
      functions: 50,
      lines: 50,
      statements: 50,
    },
  },

  // Ignore patterns
  testPathIgnorePatterns: [
    '/node_modules/',
    '/dist/',
    '/build/',
    '/tests/e2e/',
  ],

  // Verbose output
  verbose: true,

  // Clear mocks between tests
  clearMocks: true,

  // Restore mocks after each test
  restoreMocks: true,

  // Timeout
  testTimeout: 10000,
};
