var path = require("path");
var config = {
  module: {
    rules: [
      {
        test: /\.jsx?$/,
        use: {
          loader: "babel-loader"
        }
      }
    ]
  }
};

module.exports = config;
