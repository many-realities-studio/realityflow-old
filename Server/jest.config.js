module.exports = {
  preset: 'ts-jest',
  roots: [
    "./src"
  ],
  testEnvironment: 'node',
  globals: {
    "ts-jest": {
      "diagnostics": true,
      tsConfig: "<rootDir>/tsconfig.json"
    }
  }
};
