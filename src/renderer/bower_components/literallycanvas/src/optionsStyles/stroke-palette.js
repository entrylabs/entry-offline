const React = require('../reactGUI/React-shim');
const SelectedColorPanel = require('../reactGUI/SelectedColorPanel');
const StrokeThickness = require('../reactGUI/StrokeThickness');
const { defineOptionsStyle } = require('./optionsStyles');

defineOptionsStyle('stroke-palette', React.createClass({
  displayName: 'StrokePalettePicker',

  render: function() {
    var lc = this.props.lc;

    return <div className="strokePalette">
        <StrokeThickness lc={lc} tool={this.props.tool}/>
        <SelectedColorPanel tool={this.props.tool} imageURLPrefix={this.props.imageURLPrefix}
            disableTransparent={true} strokeColor="#000000" lc={lc} isFill={false}/>
    </div>;
  }
}));

module.exports = {}
