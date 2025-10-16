module.exports = {
  testEnvironment: 'node',
  testMatch: ['**/test/**/*.test.js'],
  collectCoverageFrom: [
    'index.js',
    '!node_modules/**'
  ],
  coverageReporters: ['text', 'lcov'],
  verbose: true
};