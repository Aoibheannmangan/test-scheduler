/** @type {import('jest').Config} */
module.exports = {
  verbose: true,
  moduleNameMapper: {
    "\\.(css|less|scss|sass)$": "<rootDir>/styleMock.js"
  },
  setupFilesAfterEnv: ["<rootDir>/jest.setup.js"],
  // Enable modern JSX transform
  transform: { "^.+\\.(js|jsx|ts|tsx)$": [ "babel-jest", { presets: [ [ "next/babel", { "preset-react": { runtime: "automatic",  }, }, ], ], }, ], },
};
