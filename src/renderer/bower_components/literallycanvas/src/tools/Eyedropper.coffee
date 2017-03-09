{Tool} = require './base'
util = require '../core/util'


getPixel = (ctx, {x, y}) ->
  pixel = ctx.getImageData(x, y, 1, 1).data
  if pixel[3] then "rgb(#{pixel[0]}, #{pixel[1]}, #{pixel[2]})" else null


module.exports = class Eyedropper extends Tool

  name: 'Eyedropper'
  iconName: 'none'

  constructor: (lc) ->
    @cursor = 'url("' + lc.opts.imageURLPrefix + '/spoid.cur"), default'
    super(lc)
    @strokeOrFill = 'stroke'

  readColor: (x, y, lc) ->
    if (x < 0 || y < 0 || x > lc.width || y > lc.height)
      return
    canvas = lc.getImage()
    scale = util.getBackingScale(lc.ctx)
    newColor = getPixel(
      canvas.getContext('2d'),
      {x: x, y: y})
    color = newColor or lc.getColor('background')
    lc.setColor(@selected, color)

  begin: (x, y, lc) -> @readColor(x, y, lc)
  continue: (x, y, lc) -> @readColor(x, y, lc)
  end: (x, y, lc) ->
    lc.setTool(@previousTool);

  setPrevious: (tool, selected) ->
    @optionsStyle = tool.optionsStyle
    @previousTool = tool
    @selected = selected

