'use strict';

var path = require('path');
var webpack = require('webpack');
var ExtractTextPlugin = require('extract-text-webpack-plugin');

module.exports = {
    mode: 'none',
    entry: './src/renderer/entry.js',
    output: {
        path: path.resolve(__dirname, 'src', 'renderer_build'),
        publicPath: 'http://localhost:8080/build/',
        chunkFilename: '[name].bundle.js',
        filename: 'bundle.js',
    },
    module: {
        rules: [
            {
                test: /\.(js|jsx|mjs)$/,
                exclude: [/node_modules/, /bower_components/],
                use: [{ loader: 'babel-loader' }],
            },
            { test: /\.less/, loader: 'style-loader!css-loader!less-loader' },
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
