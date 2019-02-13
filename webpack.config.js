'use strict';

const path = require('path');
const webpack = require('webpack');
const ExtractTextPlugin = require('extract-text-webpack-plugin');

const mainProcess = {
    mode: 'none',
    target: 'electron-main',
    entry: './src/main.js',
    devtool: 'source-map',
    resolve: {
        extensions: ['.js', '.json'],
    },
    node: {
        __dirname: false,
        __filename: false,
    },
    output: {
        devtoolLineToLine: true,
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
                test: /\.less$/,
                use: ExtractTextPlugin.extract({
                    fallback: 'style-loader',
                    use: [
                        { loader: 'css-loader', options: { importLoaders: 1 } },
                        { loader: 'less-loader', options: { sourceMap: true } },
                    ],
                }),
            },
            {
                test: /\.scss$/,
                use: ExtractTextPlugin.extract({
                    fallback: 'style-loader',
                    use: [
                        { loader: 'css-loader', options: { importLoaders: 1, url: false } },
                        { loader: 'sass-loader', options: { sourceMap: true } },
                    ],
                }),
            },
            {
                test: /\.css$/,
                use: ExtractTextPlugin.extract({
                    fallback: 'style-loader',
                    use: 'css-loader',
                }),
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
        new ExtractTextPlugin('main.bundle.css'),
        new webpack.HotModuleReplacementPlugin(),
    ],
};

const rendererProcess = {
    mode: 'none',
    target: 'electron-renderer',
    entry: {
        init: './src/renderer/initEntry.js',
        render: './src/renderer/renderEntry.js',
    },
    devtool: 'source-map',
    resolve: {
        extensions: ['.js', '.jsx'],
    },
    output: {
        devtoolLineToLine: true,
        path: path.resolve(__dirname, 'src', 'renderer_build'),
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
                    /bower_components/,
                    /modal[\\/]app\.js/,
                    /entry-tool/,
                ],
                use: [{ loader: 'babel-loader' }],
            },
            {
                test: /\.less$/,
                use: ExtractTextPlugin.extract({
                    fallback: 'style-loader',
                    use: [
                        { loader: 'css-loader', options: { importLoaders: 1 } },
                        { loader: 'less-loader', options: { sourceMap: true } },
                    ],
                }),
            },
            {
                test: /\.scss$/,
                use: ExtractTextPlugin.extract({
                    fallback: 'style-loader',
                    use: [
                        { loader: 'css-loader', options: { importLoaders: 1, url: false } },
                        { loader: 'sass-loader', options: { sourceMap: true } },
                    ],
                }),
            },
            {
                test: /\.css$/,
                use: ExtractTextPlugin.extract({
                    fallback: 'style-loader',
                    use: 'css-loader',
                }),
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
        new ExtractTextPlugin('bundle.css'),
        new webpack.HotModuleReplacementPlugin(),
    ],
};

module.exports = [mainProcess, rendererProcess];
