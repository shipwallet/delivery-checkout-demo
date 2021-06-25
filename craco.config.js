const CracoLessPlugin = require("craco-less");

module.exports = {
  plugins: [
    {
      plugin: CracoLessPlugin,
      options: {
        lessLoaderOptions: {
          lessOptions: {
            modifyVars: {
              "@primary-color": "#000",
              "@font-family": "Inter",
              "@font-size-base": "13px",
            },
            javascriptEnabled: true,
          },
        },
      },
    },
  ],
};
