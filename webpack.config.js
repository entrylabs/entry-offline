const mainProcess = require('./webpack/webpack.main.config');
const rendererProcess = require('./webpack/webpack.renderer.config');

module.exports = [mainProcess, rendererProcess];
