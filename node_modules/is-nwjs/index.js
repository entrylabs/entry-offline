'use strict';
var isNodejs = require('./is-nodejs');

var isNwjs = false;
if (isNodejs) {
  try {
    isNwjs = (typeof require('nw.gui') !== 'undefined');
  } catch(e) {
    isNwjs = false;
  }
}
module.exports = isNwjs;
