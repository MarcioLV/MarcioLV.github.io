const path = require("path");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");

module.exports = {
  entry: "/src/frontend/index.js",
  output: {
    path: path.resolve(__dirname, "dist"),
    filename: "[name].[contenthash].js",
  },
  resolve: {
    extensions: [".js"],
  },
  mode: "development",
  module: {
    rules: [
      {
        test: /\.m?js$/,
        exclude: /node_modules/,
        use: [
          {
            loader: "babel-loader",
          },
        ],
      },
      {
        test: /\.html$/,
        exclude: /node_module/,
        use: [
          {
            loader: "html-loader",
          },
        ],
      },
      {
        test: /\.css$/i,
        exclude: /node_module/,
        use: [MiniCssExtractPlugin.loader, "css-loader"],
      },
    ],
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: "./public/index.html",
      filename: "./index.html",
    }),
    new MiniCssExtractPlugin({
      filename: "assets/[name].[contenthash].css",
    }),
  ],
  devServer: {
    contentBase: path.join(__dirname, "dist"),
    compress: true,
    port: 8080,
  },
};
