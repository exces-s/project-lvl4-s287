module.exports = {
  mode: process.env.NODE_ENV || 'development',
  entry: ['./src/assets/index.js'],
  output: {
    publicPath: 'dist/',
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: 'babel-loader',
      },
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader', 'postcss-loader'],
      },
    ],
  },
  plugins: [],
};
