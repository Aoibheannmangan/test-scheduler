/** @type {import('jest').Config} */
module.exports = {
  verbose: false,
  testEnvironment: "jsdom",

  moduleNameMapper: {
    "\\.(css|less|scss|sass)$": "identity-obj-proxy",
  },

  setupFilesAfterEnv: ["<rootDir>/jest.setup.js"],
  setupFiles: ["jest-localstorage-mock"],

  transform: {
    "^.+\\.(js|jsx|ts|tsx)$": "babel-jest",
  },

  testRegex: "(/__tests__/.*|(\\.|/)(test|spec))\\.jsx?$",

  transformIgnorePatterns: [
    "node_modules/(?!(axios)/)" 
  ],

  collectCoverage: true,
  coverageReporters: ["json", "html"],
  collectCoverageFrom: ["src/**/!(*.test.js)"],
  coverageThreshold: {
    global: { lines: 90 },
  },
  coveragePathIgnorePatterns: [
    "node_modules",
    "^.+\\.(test.(js|jsx))$",
  ],
};
