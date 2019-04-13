const path = require('path');
const webpack = require('webpack');

const setting = {
    mode: 'none',
    target: 'electron-main',
    entry: './src/main.js',
    resolve: {
        extensions: ['.js', '.json'],
    },
    node: {
        __dirname: false,
        __filename: false,
    },
    output: {
        path: path.resolve(__dirname, 'src', 'main_build'),
        filename: '[name].bundle.js',
        hotUpdateChunkFilename: 'hot/hot-update.js',
        hotUpdateMainFilename: 'hot/hot-update.json',
    },
    module: {
        rules: [
            {
                test: /\.(js|jsx|mjs)$/,
                exclude: [
                    /node_modules/,
                ],
                use: [{ loader: 'babel-loader' }],
            },
            {
                test: /\.(ico|png|jpg|jpeg|gif|svg|woff|woff2|ttf|eot|cur)(\?v=[0-9]\.[0-9]\.[0-9])?$/,
                loader: 'url-loader',
                options: {
                    name: '[hash].[ext]',
                    limit: 10000,
                },
            },
        ],
    },
    plugins: [
        new webpack.HotModuleReplacementPlugin(),
    ],
};

const NODE_ENV = process.env.NODE_ENV;

if (NODE_ENV === 'production') {
    setting.mode = 'production';
} else if (NODE_ENV === 'development') {
    setting.mode = 'development';
    // setting.output.devtoolModuleFilenameTemplate = 'webpack://[namespace]/[resource-path]?[loaders]';
    setting.devtool = 'source-map';
}

module.exports = setting;
