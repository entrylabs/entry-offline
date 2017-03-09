{Tool} = require './base'
{createShape} = require '../core/shapes'


getIsPointInBox = (point, box) ->
  if point.x < box.x then return false
  if point.y < box.y then return false
  if point.x > box.x + box.width then return false
  if point.y > box.y + box.height then return false
  return true


module.exports = class Text extends Tool

  name: 'Text'
  iconName: 'text'
  cursor: 'text'

  constructor: ->
    @text = ''
    @currentShape = null
    @currentShapeState = null
    @initialShapeBoundingRect = null
    @dragAction = null
    @didDrag = false

  didBecomeActive: (lc) ->
    unsubscribeFuncs = []
    @unsubscribe = =>
      for func in unsubscribeFuncs
        func()

    switchAway = =>
      @_ensureNotEditing(lc)
      @_clearCurrentShape(lc)
      lc.repaintLayer('main')

    updateInputEl = => @_updateInputEl(lc)

    unsubscribeFuncs.push lc.on 'drawingChange', switchAway
    unsubscribeFuncs.push lc.on 'zoom', updateInputEl
    unsubscribeFuncs.push lc.on 'imageSizeChange', updateInputEl
    unsubscribeFuncs.push lc.on 'snapshotLoad', =>
      @_clearCurrentShape(lc)
      lc.repaintLayer('main')

    unsubscribeFuncs.push lc.on 'primaryColorChange', (newColor) =>
      return unless @currentShape
      @currentShape.color = newColor
      @_updateInputEl(lc)
      lc.repaintLayer('main')

    unsubscribeFuncs.push lc.on 'secondaryColorChange', (newColor) =>
      return unless @currentShape
      @currentShape.bgColor = newColor
      @_updateInputEl(lc)
      lc.repaintLayer('main')

    unsubscribeFuncs.push lc.on 'fontChange', (font) =>
      return unless @currentShape
      @currentShape.setFont(font)
      @_setShapesInProgress(lc)
      @_updateInputEl(lc)
      lc.repaintLayer('main')

    unsubscribeFuncs.push lc.on 'lc-pointermove', ({ x, y }) =>
      if (!@currentShape)
        return
      point = {x, y}
      br = @currentShape.getBoundingRect(lc.ctx)
      selectionShape = @_getSelectionShape(lc.ctx)
      if getIsPointInBox(point, br)
        lc.setCursor("move")
      else if getIsPointInBox(point, selectionShape.getBottomRightHandleRect())
        lc.setCursor('nwse-resize')
      else if getIsPointInBox(point, selectionShape.getTopLeftHandleRect())
        lc.setCursor('nwse-resize')
      else if getIsPointInBox(point, selectionShape.getBottomLeftHandleRect())
        lc.setCursor('nesw-resize')
      else if getIsPointInBox(point, selectionShape.getTopRightHandleRect())
        lc.setCursor('nesw-resize')
      else
        lc.setCursor(@cursor)

    unsubscribeFuncs.push lc.on 'dispose', () =>
      @commit(lc)
      return

  willBecomeInactive: (lc) ->
    if @currentShape
      @_ensureNotEditing(lc)
      @commit(lc)
    @unsubscribe()

  setText: (text) ->
    @text = text

  _ensureNotEditing: (lc) ->
    if @currentShapeState == 'editing'
      @_exitEditingState(lc)

  _clearCurrentShape: (lc) ->
    @currentShape = null
    @initialShapeBoundingRect = null
    @currentShapeState = null
    lc.setShapesInProgress([])

  commit: (lc) ->
    lc.saveShape(@currentShape) if @currentShape.text
    @_clearCurrentShape(lc)
    lc.repaintLayer('main')

  _getSelectionShape: (ctx, backgroundColor=null) ->
    createShape('SelectTool', {shape: @currentShape, ctx, backgroundColor, margin: 4})

  _setShapesInProgress: (lc) ->
    switch @currentShapeState
      when 'selected'
        lc.setShapesInProgress([@_getSelectionShape(lc.ctx), @currentShape])
      when 'editing'
        lc.setShapesInProgress([@_getSelectionShape(lc.ctx, '#fff')])
      else
        lc.setShapesInProgress([@currentShape])

  begin:(x, y, lc) ->
    if (x < 0 || y < 0 || x > lc.width || y > lc.height)
      return
    @dragAction = 'none'
    @didDrag = false

    if (@currentShapeState == 'selected' or @currentShapeState == 'editing')
      br = @currentShape.getBoundingRect(lc.ctx)
      selectionShape = @_getSelectionShape(lc.ctx)
      selectionBox = selectionShape.getBoundingRect()
      point = {x, y}
      if getIsPointInBox(point, br)
        @dragAction = 'move'
      if getIsPointInBox(point, selectionShape.getBottomRightHandleRect())
        @dragAction = 'resizeBottomRight'
      if getIsPointInBox(point, selectionShape.getTopLeftHandleRect())
        @dragAction = 'resizeTopLeft'
      if getIsPointInBox(point, selectionShape.getBottomLeftHandleRect())
        @dragAction = 'resizeBottomLeft'
      if getIsPointInBox(point, selectionShape.getTopRightHandleRect())
        @dragAction = 'resizeTopRight'

      if @dragAction == 'none' and @currentShapeState == 'editing'
        @dragAction = 'stop-editing'
        @_exitEditingState(lc)
    else
      @color = lc.getColor('primary')
      @bgColor = lc.getColor('secondary')
      @currentShape = createShape('Text', {x, y, @text, @color, @bgColor, font: lc.getFont(), v: 1})
      @dragAction = 'place'
      @currentShapeState = 'selected'

    if @dragAction == 'none'
      @commit(lc)
      return

    @initialShapeBoundingRect = @currentShape.getBoundingRect(lc.ctx)
    @dragOffset = {
      x: x - @initialShapeBoundingRect.x,
      y: y - @initialShapeBoundingRect.y
    }

    @_setShapesInProgress(lc)
    lc.repaintLayer('main')

  continue:(x, y, lc) ->
    if @dragAction == 'none'
      return

    br = @initialShapeBoundingRect
    brRight = br.x + br.width
    brBottom = br.y + br.height
    switch @dragAction
      when 'place'
        @currentShape.x = x
        @currentShape.y = y
        @didDrag = true
      when 'move'
        @currentShape.x = x - @dragOffset.x
        @currentShape.y = y - @dragOffset.y
        @didDrag = true
      when 'resizeBottomRight'
        @currentShape.setSize(
          x - (@dragOffset.x - @initialShapeBoundingRect.width) - br.x,
          y - (@dragOffset.y - @initialShapeBoundingRect.height) - br.y)
      when 'resizeTopLeft'
        @currentShape.setSize(
          brRight - x + @dragOffset.x,
          brBottom - y + @dragOffset.y)
        @currentShape.setPosition(x - @dragOffset.x, y - @dragOffset.y)
      when 'resizeBottomLeft'
        @currentShape.setSize(
          brRight - x + @dragOffset.x,
          y - (@dragOffset.y - @initialShapeBoundingRect.height) - br.y)
        @currentShape.setPosition(x - @dragOffset.x, @currentShape. y)
      when 'resizeTopRight'
        @currentShape.setSize(
          x - (@dragOffset.x - @initialShapeBoundingRect.width) - br.x,
          brBottom - y + @dragOffset.y)
        @currentShape.setPosition(@currentShape.x, y - @dragOffset.y)

    @_setShapesInProgress(lc)
    lc.repaintLayer('main')

    @_updateInputEl(lc)

  end:(x, y, lc) ->
    return unless @currentShape  # we may have committed at start time

    # use auto height once user lets go of selection corner
    @currentShape.setSize(@currentShape.forcedWidth, 0)

    if @currentShapeState == 'selected'
      if @dragAction == 'place' or (@dragAction == 'move' and not @didDrag)
        @_enterEditingState(lc)

    @_setShapesInProgress(lc)
    lc.repaintLayer('main')
    @_updateInputEl(lc)

  _enterEditingState: (lc) ->
    @currentShapeState = 'editing'

    throw "State error" if @inputEl

    @inputEl = document.createElement('textarea')
    @inputEl.className = 'text-tool-input'
    @inputEl.style.position = 'absolute'
    @inputEl.style.transformOrigin = '0px 0px'
    @inputEl.style.border = 'none'
    @inputEl.style.outline = 'none'
    @inputEl.style.margin = '0'
    @inputEl.style.padding = '4px'
    @inputEl.style.zIndex = '1000'
    @inputEl.style.overflow = 'hidden'
    @inputEl.style.resize = 'none'
    @inputEl.style.color = '#000'

    @inputEl.value = @currentShape.text

    @inputEl.addEventListener 'mousedown', (e) -> e.stopPropagation()
    @inputEl.addEventListener 'touchstart', (e) -> e.stopPropagation()

    onChange = (e) =>
      @currentShape.setText(e.target.value)
      @currentShape.enforceMaxBoundingRect(lc)
      @_setShapesInProgress(lc)
      lc.repaintLayer('main')
      @_updateInputEl(lc)
      e.stopPropagation()

    @inputEl.addEventListener 'keydown', => @_updateInputEl(lc, true)
    @inputEl.addEventListener 'keyup', onChange
    @inputEl.addEventListener 'change', onChange

    @_updateInputEl(lc)

    lc.containerEl.appendChild(@inputEl)
    @inputEl.focus()

    @_setShapesInProgress(lc)

  _exitEditingState: (lc) ->
    @currentShapeState = 'selected'
    lc.containerEl.removeChild(@inputEl)
    @inputEl = null

    @_setShapesInProgress(lc)
    lc.repaintLayer('main')

  _updateInputEl: (lc, withMargin=false) ->
    return unless @inputEl
    br = @currentShape.getBoundingRect(lc.ctx, true)
    @inputEl.style.font = @currentShape.font
    @inputEl.style.backgroundColor = @currentShape.bgColor
    @inputEl.style.left =
      "#{lc.position.x / lc.backingScale + br.x * lc.scale - 4}px"
    @inputEl.style.top =
      "#{lc.position.y / lc.backingScale + br.y * lc.scale - 4}px"

    if withMargin and not @currentShape.forcedWidth
      @inputEl.style.width =
        "#{br.width + 5 + @currentShape.renderer.emDashWidth}px"
    else
      @inputEl.style.width = "#{br.width + 7}px"

    if withMargin
      @inputEl.style.height =
        "#{br.height + 8 + @currentShape.renderer.metrics.leading}px"
    else
      @inputEl.style.height = "#{br.height + 8}px"

    transformString = "scale(#{lc.scale})"
    @inputEl.style.transform = transformString
    @inputEl.style.webkitTransform= transformString
    @inputEl.style.MozTransform= transformString
    @inputEl.style.msTransform= transformString
    @inputEl.style.OTransform= transformString

  optionsStyle: 'font-attributes-color-palette'
