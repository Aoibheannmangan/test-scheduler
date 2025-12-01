// guarentees all imports can be ran in jest

const babelJest = require("babel-jest");

module.exports = babelJest.createTransformer({
  presets: [
    ["@babel/preset-env", { targets: { node: "current" } }],
    ["@babel/preset-react", { runtime: "automatic" }],
    "@babel/preset-typescript"
  ]
});
