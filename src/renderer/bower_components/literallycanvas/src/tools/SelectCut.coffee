{Tool} = require './base'
{createShape} = require '../core/shapes'
util = require '../core/util'

module.exports = class SelectCut extends Tool

  name: 'SelectCut'
  iconName: 'select-cut'
  cursor: 'crosshair'

  begin:(x, y, lc) ->
    @dragStart = {
        x: x,
        y: y
    }
    @currentShape = createShape('Rectangle', {
        x: x,
        y: y,
        strokeWidth: 0,
        dash: [2, 2]
    });

  continue:(x, y, lc) ->
    if (!@dragStart)
      return
    @currentShape.width = x - @currentShape.x
    @currentShape.height = y - @currentShape.y
    lc.setShapesInProgress([@currentShape])
    lc.repaintLayer('main')

  end:(x, y, lc) ->
    image = new Image()
    lc.setShapesInProgress([])
    lc.repaintLayer('main')
    @currentShape.x = Math.ceil(@currentShape.x);
    @currentShape.y = Math.ceil(@currentShape.y);
    @currentShape.width = Math.ceil(@currentShape.width);
    @currentShape.height = Math.ceil(@currentShape.height);
    x = @currentShape.x
    if (@currentShape.width < 0)
      x += @currentShape.width
    y = @currentShape.y
    if (@currentShape.height < 0)
      y += @currentShape.height
    width = Math.abs(@currentShape.width)
    height = Math.abs(@currentShape.height)
    if (width && height)
      tempCanvas = document.createElement("canvas")
      tCtx = tempCanvas.getContext("2d")
      tempCanvas.width = width
      tempCanvas.height = height
      tCtx.drawImage(lc.getImage(), -x, -y)
      image.src = tempCanvas.toDataURL()
      newErase = createShape('ErasedRectangle', {x, y, width, height})
      newShape = createShape('Image', {
        x: x + width / 2, y: y + height / 2, image, width, height
      })
      newErase.isPass = true
      newShape.isPass = true
      lc.saveShape(newErase)
      lc.saveShape(newShape)
      lc.setTool(lc.tools.SelectShape)
      lc.tool.setShape(lc, newShape)
    @currentShape = null
    @dragStart = null
