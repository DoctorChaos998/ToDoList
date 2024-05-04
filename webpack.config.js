const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");

module.exports = (env) => {
    return {
        mode: env.mode,
        entry: [path.resolve(__dirname, 'src', 'index.scss'), path.resolve(__dirname, 'src', 'index.js')],
        output: {
            path: path.resolve(__dirname, 'build'),
            filename: '[name].[contenthash].js',
            clean: true
        },
        module: {
            rules: [
                {
                    test: /\.s[ac]ss$/i,
                    use: [
                        MiniCssExtractPlugin.loader,
                        "css-loader",
                        "sass-loader",
                    ],
                },
                {
                    test: /\.(png|svg|jpg|jpeg|gif)$/i,
                    type: 'asset/resource',
                },
                {
                    test: /\.html$/i,
                    loader: "html-loader",
                },
            ],
        },
        plugins: [
            new HtmlWebpackPlugin({template: path.resolve(__dirname, 'src', 'public', 'index.html')}),
            new MiniCssExtractPlugin()
        ],
        devServer: {
            port: 5000,
            open: true
        }
    }
}