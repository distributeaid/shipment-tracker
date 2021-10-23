module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  modulePathIgnorePatterns: ['dist/'],
  setupFiles: ['<rootDir>/src/sequelize.ts'],
}
