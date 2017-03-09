const React = require('../reactGUI/React-shim');

var MagnifyPanel = React.createClass({
    getInitialState: function() {
        var lc = this.props.lc;
        return {value: Math.round(lc.scale * 100) + "%"}
    },
    setZoom: function(amount) {
        var lc = this.props.lc;
        amount = Math.max(amount, lc.config.zoomMin);
        amount = Math.min(amount, lc.config.zoomMax);
        lc.setZoom(amount);
    },
    zoomIn: function() {
        var lc = this.props.lc;
        this.setZoom(lc.scale + 0.1);
    },
    zoomOut: function() {
        var lc = this.props.lc;
        this.setZoom(lc.scale - 0.1);
    },
    handleChange: function(event) {
        event.target.value
        this.setState({value: event.target.value});
    },
    handleBlur: function(event) {
        var lc = this.props.lc;
        var value = parseInt(event.target.value);
        if (isNaN(value)) value = 100;
        this.setZoom(value / 100);
    },
    handleEnter: function(event) {
        if (event.key === 'Enter') {
            var value = parseInt(this.state.value);
            if (isNaN(value)) value = 100;
            this.setZoom(value / 100)
        }
    },
    zoomEvent: function(event) {
        var value = event.newScale
        this.setState({value: Math.round(value * 100) + "%"});
    },
    componentDidMount: function() {
        var lc = this.props.lc;
        this.unsubscribe = lc.on("zoom", this.zoomEvent);
    },
    componentWillUnmount: function() {
        this.unsubscribe();
    },
    render: function() {
        return <div className="entryPaintMagnifier" >
            <div onClick={this.zoomOut} id="zoomOut">-</div>
            <input value={this.state.value} onKeyPress={this.handleEnter} onChange={this.handleChange} onBlur={this.handleBlur}/>
            <div onClick={this.zoomIn} id="zoomIn">+</div>
        </div>;
    }
});

module.exports = MagnifyPanel;
