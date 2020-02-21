const path = require('path');
const merge = require('webpack-merge');
const common = require('./webpack.common.config');

const setting = {
    target: 'electron-preload',
    entry: './src/preload/preload.ts',
    output: {
        path: path.resolve(__dirname, '..', 'src', 'preload_build'),
        filename: 'preload.bundle.js',
    },
    externals: [],
    module: {
        rules: [],
    },
};

module.exports = merge(common, setting);
