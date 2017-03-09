Pencil = require './Pencil'
{createShape} = require '../core/shapes'


module.exports = class Line extends Pencil

  name: 'Line'
  iconName: 'line'
  cursor: 'none'
  usesSimpleAPI: false

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
      @currentShape = createShape('Line', {
        x1: x, y1: y, x2: x, y2: y, @strokeWidth,
        dash: switch
          when @isDashed then [@strokeWidth * 2, @strokeWidth * 4]
          else null
        endCapShapes: if @hasEndArrow then [null, 'arrow'] else null
        color: lc.getColor('primary')})

    unsubscribeFuncs.push lc.on 'lc-pointerdrag', ({x, y}) =>
      @currentShape.x2 = x
      @currentShape.y2 = y
      lc.setShapesInProgress([@currentShape, @cursorShape])
      lc.repaintLayer('main', false)

    unsubscribeFuncs.push lc.on 'lc-pointerup', ({x, y}) =>
      if ((@currentShape.x1 is @currentShape.x2) and (@currentShape.y1 is @currentShape.y2))
        @convertToPoint(x, y, lc)
      lc.saveShape(@currentShape)
      @currentShape = undefined
      @updateCursor(x, y, lc)
      lc.setShapesInProgress([@cursorShape])
      lc.drawShapeInProgress(@cursorShape)

    unsubscribeFuncs.push lc.on 'setStrokeWidth', (strokeWidth) =>
      @strokeWidth = strokeWidth
      lc.trigger('toolDidUpdateOptions')
