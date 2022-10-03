const { defineConfig } = require("@vue/cli-service");
module.exports = defineConfig({
  transpileDependencies: ["vuetify"],
  publicPath: "/checkout/",
  configureWebpack: {
    resolve: {
      // fallback: {
      //   path: require.resolve("path-browserify"),
      //   assert: require.resolve("assert/"),
      //   url: require.resolve("url/"),
      //   os: require.resolve("os-browserify/browser"),
      //   stream: require.resolve("stream-browserify"),
      // },
    },
  },
});
