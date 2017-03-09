const MoveAttributes = require('../reactGUI/MoveAttributes');
const { defineOptionsStyle } = require('./optionsStyles');


defineOptionsStyle('move-attributes', React.createClass({
  displayName: 'MoveAttributes',

  render: function() {
    var lc = this.props.lc;

    return <div>
        <MoveAttributes imageURLPrefix={this.props.imageURLPrefix}
            x="0" y="0" rotate="0" lc={lc}/>
    </div>;
  }
}));

module.exports = {}
