'use strict';

const mainProcess = require('./webpack.main.config');
const rendererProcess = require('./webpack.renderer.config');

module.exports = [mainProcess, rendererProcess];
