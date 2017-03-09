Pencil = require './Pencil'
{createShape} = require '../core/shapes'


module.exports = class Eraser extends Pencil

  name: 'Eraser'
  iconName: 'eraser'
  optionsStyle: 'stroke-thickness'

  makePoint: (x, y, lc) ->
    createShape('Point', {x, y, size: @strokeWidth, color: '#000'})
  makeShape: -> createShape('ErasedLinePath')

  createCursor: () ->
    createShape('Ellipse', {
        x: 0, y: 0, strokeWidth: 1, strokeColor: "#000", fillColor: 'transparent'})

  updateCursor: (x, y, lc) ->
    @cursorShape.setUpperLeft({
      x: x - @strokeWidth / 2,
      y: y - @strokeWidth / 2
    })
    @cursorShape.width = @strokeWidth + 1;
    @cursorShape.height = @strokeWidth + 1;

  convertToPoint: (x, y, lc) ->
    if (!@currentShape)
      return
    @currentShape = null
