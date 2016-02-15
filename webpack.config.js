module.exports = {
  entry: __dirname + "/src/index.js",
  output: {
    path: __dirname + '/dest',
    filename: 'bundle.js'
  },
  target: "electron",
  module: {
    loaders: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        loader: "babel",
      }
    ]
  }
};
