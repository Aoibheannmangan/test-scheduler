const { createProxyMiddleware } = require("http-proxy-middleware");

module.exports = function (app) {
  app.use(
    "/api",
    createProxyMiddleware({
      target: "https://infantscheduler.onrender.com",
      changeOrigin: true,
    })
  );
};
