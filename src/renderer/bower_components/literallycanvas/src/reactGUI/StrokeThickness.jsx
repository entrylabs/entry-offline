const React = require('../reactGUI/React-shim');

var StrokeThickness = React.createClass({
  getState: function(props) {
      var props = props || this.props;
    //   console.log('getState');
      return {
        toolName: props.tool.name,
        strokeWidth: props.tool.strokeWidth,
      };
  },

  getInitialState: function() { return this.getState(); },

  componentWillReceiveProps: function(nextProps) {
    //   console.log('componentWillReceiveProps nextProps:', nextProps);
    if (this.state.toolName !== nextProps.tool.name) {
      this.setState(this.getState(nextProps));
    }
  },

  onChange: function(e) {
    // console.log('e.target.value=', e.target.value);
    var strokeWidth = +e.target.value;
    this.setState({strokeWidth: strokeWidth});
    this.props.lc.trigger('setStrokeWidth', strokeWidth);
  },

  render: function() {
    const lc = this.props.lc;
    // console.log('lc:', lc);
    // console.log('tool.name:', lc.tool.name);
    // console.log('strokeWidth:', this.state.strokeWidth);
    let thickness = []
    for (var i = 1; i <= 70; i++)
        thickness.push(i)

    return <div className="entryPlaygroundentryPlaygroundPainterAttrThickArea">
      {/*<span> {this.state.strokeWidth} </span>*/}
      <legend className="painterAttrThickName">{Lang.Workspace.thickness}</legend>
      <fieldset id="entryPainterAttrThick" className="entryPlaygroundPainterAttrThick">
        <div className="paintAttrThickTop"></div>
        <select id="entryPainterAttrThick" className="entryPlaygroundPainterAttrThickInput" size="1" value={this.state.strokeWidth} onChange={this.onChange}>
            {thickness.map((num) => {
                return <option key={num} value={num} >{num}</option>
            })}
        </select>
        <div id="entryPainterShapeLineColor" className="painterAttrShapeLineColor entryRemove">
            <div id="entryPainterShapeInnerBackground" className=" painterAttrShapeInnerBackground"></div>
        </div>
      </fieldset>
    </div>;
  }
});

module.exports = StrokeThickness;
