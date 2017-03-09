const React = require('../reactGUI/React-shim');

var FontAttributes = React.createClass({
  getInitialState: function() {
      var font = this.props.lc.getFont();
      var fontArray = font.split(" ")
      return {
          style: fontArray.shift(),
          size: fontArray.shift().replace("px", ""),
          font: fontArray.join(" ")
      }
  },
  onChangeSize: function(e) {
    this.setState({
      size: e.target.value
    }, function() {
        this.applyFont();
    }.bind(this))
  },
  onChangeFont: function(e) {
    this.setState({
      font: e.target.value
    }, function() {
        this.applyFont();
    }.bind(this))
  },
  onChangeStyle: function(e) {
    this.setState({
      style: e.target.value
    }, function() {
        this.applyFont();
    }.bind(this))
  },
  applyFont: function() {
    var font = this.state.style + " " + this.state.size + "px " + this.state.font;
    this.props.lc.setFont(font);
  },
  render: function() {
    let fontThickness = []
    for (var i = 1; i <= 65; i++)
        fontThickness.push(i)

    return <div id="painterAttrFont" className="entryPlaygroundPainterAttrFont">
        <div className="entryPlaygroundPainterAttrTop">
            <div className="entryPlaygroundPaintAttrTop_"></div>
            <select value={this.state.font} id="entryPainterAttrFontName" className="entryPlaygroundPainterAttrFontName" size="1" onChange={this.onChangeFont}>
                <option value="KoPub Batang">{Lang.Fonts.batang}</option>
                <option value="Nanum Myeongjo">{Lang.Fonts.myeongjo}</option>
                <option value="Nanum Gothic">{Lang.Fonts.gothic}</option>
                <option value="Nanum Pen Script">{Lang.Fonts.pen_script}</option>
                <option value="Jeju Hallasan">{Lang.Fonts.jeju_hallasan}</option>
                <option value="Nanum Gothic Coding">{Lang.Fonts.gothic_coding}</option>
            </select>
        </div>
        <div className="painterAttrFontSizeArea">
            <div className="painterAttrFontSizeTop"></div>
            <select value={this.state.size}  id="entryPainterAttrFontSize" className="entryPlaygroundPainterAttrFontSize" size="1" onChange={this.onChangeSize}>
                { fontThickness.map(size => {
                    return <option key={size} value={size}>{size}</option>
                })}
            </select>
        </div>
        <div className="entryPlaygroundPainterAttrFontStyleArea">
            <div className="entryPlaygroundPainterAttrFontTop"></div>
            <select value={this.state.style} id="entryPainterAttrFontStyle" className="entryPlaygroundPainterAttrFontStyle" size="1" onChange={this.onChangeStyle}>
                <option value="normal">{Lang.Workspace.regular}</option>
                <option value="bold">{Lang.Workspace.bold}</option>
                <option value="italic">{Lang.Workspace.italic}</option>
            </select>
        </div>
    </div>
  }
});

module.exports = FontAttributes;
