React = require './React-shim'
createSetStateOnEventMixin = require './createSetStateOnEventMixin'
{optionsStyles} = require '../optionsStyles/optionsStyles'

ColorWell = React.createFactory require './ColorWell'
ColorPickers = React.createFactory React.createClass
  displayName: 'ColorPickers'
  render: ->
    {lc} = @props
    {div} = React.DOM
    (div {className: 'lc-color-pickers'},
      (ColorWell {lc, colorName: 'primary'})
      (ColorWell {lc, colorName: 'secondary'}),
    #   (ColorWell {lc, colorName: 'background'})
    )

Options = React.createClass
  displayName: 'Options'
  getState: -> {
    style: @props.lc.tool?.optionsStyle
    tool: @props.lc.tool
  }
  getInitialState: -> @getState()
  mixins: [createSetStateOnEventMixin('toolChange')]

  renderBody: ->
    # style can be null; cast it as a string
    style = "" + @state.style
    optionsStyles[style] && optionsStyles[style]({
      lc: @props.lc, tool: @state.tool, imageURLPrefix: @props.imageURLPrefix})

  render: ->
    {div} = React.DOM
    (div {className: 'lc-options horz-toolbar'},
      this.renderBody()
    #   ColorPickers({lc: @props.lc})
    )

module.exports = Options
