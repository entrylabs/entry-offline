const FontAttributes = require('../reactGUI/FontAttributes');
const SelectedColorPanel = require('../reactGUI/SelectedColorPanel');
const { defineOptionsStyle } = require('./optionsStyles');

defineOptionsStyle('font-attributes-color-palette', React.createClass({
  displayName: 'FontAttributesColorPalette',

  render: function() {
    var lc = this.props.lc;

    return <div className="strokePalette">
        <FontAttributes lc={lc} tool={this.props.tool}/>
        <SelectedColorPanel tool={this.props.tool} imageURLPrefix={this.props.imageURLPrefix}
            strokeColor="#000000" fillColor="transparent" lc={lc}/>
    </div>;
  }
}));

module.exports = {}
