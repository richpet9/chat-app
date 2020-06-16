const HtmlWebpackPlugin = require("html-webpack-plugin");

module.exports = {
    entry: {
        entry: "./frontend/index.js",
    },
    output: {
        path: __dirname + "/.tmp/public",
        filename: "bundle.js",
    },
    module: {
        rules: [
            {
                test: /\.js$/,
                exclude: /node_modules/,
                use: { loader: "babel-loader" },
            },
            {
                test: /\.s[ac]ss$/i,
                use: ["style-loader", "css-loader", "sass-loader"],
            },
        ],
    },
    devServer: {
        port: 1337,
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: "./frontend/index.html",
        }),
    ],
};
