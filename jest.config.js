/** @type {import('jest').Config} */
module.exports = {
  verbose: false,
    testEnvironment: 'jsdom',

  // CSS/SCSS module mocking
  moduleNameMapper: {
    "\\.(css|less|scss|sass)$": "identity-obj-proxy"
  },

  // Run setup file after environment is ready
  setupFilesAfterEnv: ["<rootDir>/jest.setup.js"],

  // Enable modern JSX/TSX transform with Next.js presets
  transform: {
  "^.+\\.(js|jsx|ts|tsx)$": [
    "babel-jest",
    {
      presets: [
        ["@babel/preset-env", { targets: { node: "current" } }],
        ["@babel/preset-react", { runtime: "automatic" }],
        "@babel/preset-typescript"
      ]
    }
  ]
},

  // Coverage settings
  collectCoverage: true,
  coverageReporters: ["json", "html"],
  collectCoverageFrom: ["src/**/!(*.test.js)"],
  coverageThreshold: {
    global: {
      lines: 90
    }
  },
  coveragePathIgnorePatterns: [
    "node_modules",
    "^.+\\.(test.(js|jsx))$"
  ],

  setupFiles: ['jest-localstorage-mock'],

};
