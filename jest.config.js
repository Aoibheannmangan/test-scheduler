/** @type {import('jest').Config} */
module.exports = {
  verbose: true,
  transform: {
    "^.+\\.jsx?$": "babel-jest"
  },
  moduleNameMapper: {
    "\\.(css|less|scss|sass)$": "<rootDir>/styleMock.js"
  }
};
