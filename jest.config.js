module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  setupFiles: ['./jest.local.settings.js'],
  testTimeout: 60000,
};
