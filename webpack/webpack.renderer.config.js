const path = require('path');
const webpack = require('webpack');
const merge = require('webpack-merge');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const common = require('./webpack.common.config');

const setting = {
    target: 'electron-renderer',
    entry: {
        init: './src/renderer/initEntry.ts',
        render: './src/renderer/renderEntry.tsx',
    },
    externals: {
        '@entrylabs/tool': 'EntryTool',
        '@entrylabs/tool/component': 'EntryTool.Component',
        'entry-paint': 'EntryPaint',
    },
    output: {
        path: path.resolve(__dirname, '..', 'src', 'renderer_build'),
        filename: '[name].bundle.js',
        hotUpdateChunkFilename: 'hot/hot-update.js',
        hotUpdateMainFilename: 'hot/hot-update.json',
    },
    module: {
        rules: [
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

const NODE_ENV = process.env.NODE_ENV;

if (NODE_ENV === 'production') {
    setting.mode = 'production';
} else if (NODE_ENV === 'development') {
    setting.mode = 'development';
    setting.devtool = 'eval-inline-source-map';
}

module.exports = merge(common, setting);
