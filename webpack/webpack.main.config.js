const path = require('path');
const merge = require('webpack-merge');
const common = require('./webpack.common.config');

const setting = {
    target: 'electron-main',
    entry: './src/main.ts',
    output: {
        path: path.resolve(__dirname, '..', 'src', 'main_build'),
        filename: '[name].bundle.js',
    },
    externals: [
        function(_, request, callback) {
            if (!/^\..*/.test(request)) {
                return callback(null, `commonjs ${request}`);
            }
            callback();
        },
    ],
    module: {
        rules: [],
    },
};

const NODE_ENV = process.env.NODE_ENV;

if (NODE_ENV === 'production') {
    setting.mode = 'production';
} else if (NODE_ENV === 'development') {
    setting.mode = 'development';
    setting.devtool = 'source-map';
}

module.exports = merge(common, setting);
