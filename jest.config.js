module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  setupFilesAfterEnv: ['jest-extended'],
  modulePathIgnorePatterns: ['dist/'],
  setupFiles: ['<rootDir>/src/sequelize.ts'],
  testRegex: ['src/.+\\.test\\.ts'],
}
