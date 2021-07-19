import HtmlWebpackPlugin from 'html-webpack-plugin';

export default {
  plugins: [
    new HtmlWebpackPlugin({
      title: 'RSS Reader',
      template: 'index.html',
    }),
  ],
  module: {
    rules: [
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader'],
      },
    ],
  },
};
