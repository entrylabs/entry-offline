{ToolWithStroke} = require './base'
{createShape} = require '../core/shapes'

module.exports = class Pencil extends ToolWithStroke

  name: 'Pencil'
  iconName: 'pencil'
  cursor: 'none'
  usesSimpleAPI: false

  eventTimeThreshold: 10

  didBecomeActive: (lc) ->
    unsubscribeFuncs = []
    @unsubscribe = =>
      for func in unsubscribeFuncs
        func()

    @cursorShape = @createCursor()
    @cursorShape.width = 10;
    @cursorShape.height = 10;

    unsubscribeFuncs.push lc.on 'lc-pointermove', ({x, y}) =>
      @updateCursor(x, y, lc)
      lc.drawShapeInProgress(@cursorShape)

    unsubscribeFuncs.push lc.on 'lc-pointerdown', ({x, y}) =>
      @color = lc.getColor('primary')
      @currentShape = @makeShape()
      @currentShape.addPoint(@makePoint(x, y, lc))
      @lastEventTime = Date.now()
      lc.drawShapeInProgress(@cursorShape)

    unsubscribeFuncs.push lc.on 'lc-pointerdrag', ({x, y}) =>
      timeDiff = Date.now() - @lastEventTime
      if timeDiff > @eventTimeThreshold
        @lastEventTime += timeDiff
        @currentShape.addPoint(@makePoint(x, y, lc))
        @updateCursor(x, y, lc)
        lc.setShapesInProgress([@currentShape, @cursorShape])
        lc.repaintLayer('main', false)

    unsubscribeFuncs.push lc.on 'lc-pointerup', ({x, y}) =>
      if (@currentShape.points.length is 1)
        @convertToPoint(x, y, lc)
      if @currentShape
        lc.saveShape(@currentShape)
      @currentShape = undefined
      @updateCursor(x, y, lc)
      lc.drawShapeInProgress(@cursorShape)

    unsubscribeFuncs.push lc.on 'setStrokeWidth', (strokeWidth) =>
      @strokeWidth = strokeWidth
      lc.trigger('toolDidUpdateOptions')

  willBecomeInactive: (lc) ->
    @unsubscribe()
    lc.setShapesInProgress([])
    lc.repaintLayer('main', false)

  makePoint: (x, y, lc) ->
    createShape('Point', {x, y, size: @strokeWidth, @color})
  makeShape: -> createShape('LinePath')

  convertToPoint: (x, y, lc) ->
    if (!@currentShape)
      return
    @currentShape = createShape('Ellipse', {
      x: x - @strokeWidth / 2, y: y - @strokeWidth / 2, 0,
      width: @strokeWidth, height: @strokeWidth,
      strokeColor: 'transparent',
      fillColor: lc.getColor('primary')})

  createCursor: () ->
    createShape('Ellipse', {
        x: 0, y: 0, strokeWidth: 0, strokeColor: 'transparent', fillColor: "#000"})

  updateCursor: (x, y, lc) ->
    @cursorShape.setUpperLeft({
      x: x - @strokeWidth / 2,
      y: y - @strokeWidth / 2
    })
    @cursorShape.width = @strokeWidth + 1;
    @cursorShape.height = @strokeWidth + 1;
    @cursorShape.fillColor = lc.getColor('primary')
