const mainProcess = require('./webpack/webpack.main.config');
const rendererProcess = require('./webpack/webpack.renderer.config');
const preload = require('./webpack/webpack.preload.config');

module.exports = [mainProcess, rendererProcess, preload];
