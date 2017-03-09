const React = require('../reactGUI/React-shim');
const MagnifyPanel = require('../reactGUI/MagnifyPanel');
const { defineOptionsStyle } = require('./optionsStyles');

defineOptionsStyle('magnify', React.createClass({
  displayName: 'magnify',
  render: function() {
      var lc = this.props.lc;
      return <MagnifyPanel lc={lc}/>;
  }
}));

module.exports = {}
