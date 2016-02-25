'use strict';

var isNwjs = require('is-nwjs');

module.exports = function (url, event) {
  if (isNwjs) {
    var gui = require('nw.gui');
    if (url && url.preventDefault) {
      event = url;
      event.preventDefault();
      gui.Shell.openExternal(event.target.href);
    } else {
      event.preventDefault();
      gui.Shell.openExternal(url);
    }
  } else {
    if (url && !url.preventDefault) {
      event.preventDefault();
      window.location.href = url;
    }
  }
};
