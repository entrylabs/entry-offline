{Tool} = require './base'


getPixel = (ctx, {x, y}) ->
  pixel = ctx.getImageData(x, y, 1, 1).data
  if pixel[3] then "rgb(#{pixel[0]}, #{pixel[1]}, #{pixel[2]})" else null


module.exports = class Fill extends Tool

  name: 'Fill'
  iconName: 'fill'
  optionsStyle: 'color-palette'

  constructor: (lc) ->
    @cursor = 'url("' + lc.opts.imageURLPrefix + '/paint_line.cur"), default'
    super(lc)

  threshold: 20

  end: (x, y, lc) ->
    didFinish = undefined
    fillColor = undefined
    fillPoint = undefined
    rect = undefined
    startPoint = undefined
    rect = lc.getDefaultImageRect()
    startPoint =
      x: Math.floor(x)
      y: Math.floor(y)
    if !@getIsPointInRect(startPoint.x, startPoint.y, rect)
      return null
    fillPoint =
      x: startPoint.x - (rect.x)
      y: startPoint.y - (rect.y)
    fillColor = lc.colors.secondary
    didFinish = false
    lc.setCursor("progress")
    @getFillImage lc.getImage(rect: rect), fillPoint, fillColor, @threshold, (image, isDone) =>
      shape = undefined
      if didFinish
        lc.setCursor(@cursor)
        return
      shape = LC.createShape('Image',
        x: rect.x + rect.width / 2
        y: rect.y + rect.height / 2
        image: image
        erase: fillColor is 'transparent' ? true : false
      )
      if isDone
        lc.setShapesInProgress []
        lc.saveShape shape
        lc.setCursor(@cursor)
        didFinish = true
      else
        lc.setShapesInProgress [ shape ]
        lc.repaintLayer 'main'

  getIsPointInRect: (x, y, rect) ->
    if x < rect.x
      return false
    if y < rect.y
      return false
    if x >= rect.x + rect.width
      return false
    if y >= rect.y + rect.height
      return false
    true

  getIndex: (x, y, width) ->
    (y * width + x) * 4

  getColorArray: (imageData, i) ->
    [
      imageData[i]
      imageData[i + 1]
      imageData[i + 2]
      imageData[i + 3]
    ]

  getAreColorsEqual: (a, b, threshold) ->
    d = undefined
    i = undefined
    j = undefined
    len = undefined
    ref = undefined
    d = 0
    ref = [
      0
      1
      2
      3
    ]
    j = 0
    len = ref.length
    while j < len
      i = ref[j]
      d += Math.abs(a[i] - (b[i]))
      j++
    d <= threshold

  getFillImage: (canvas, point, fillColor, threshold, callback) ->
    ctx = undefined
    imageData = undefined
    lastCheckpoint = undefined
    ewCanvas = undefined
    ewCtx = undefined
    outputData = undefined
    outputPoints = undefined
    pixelStack = undefined
    rect = undefined
    run = undefined
    startColor = undefined
    rect =
      x: 0
      y: 0
      width: canvas.width
      height: canvas.height
    ctx = canvas.getContext('2d')
    imageData = ctx.getImageData(0, 0, canvas.width, canvas.height).data
    outputData = new ArrayBuffer(imageData.length)
    outputPoints = []
    pixelStack = [[
      point.x
      point.y
    ]]
    startColor = @getColorArray(imageData, @getIndex(point.x, point.y, rect.width))
    ewCanvas = document.createElement('canvas')
    ewCanvas.width = canvas.width
    ewCanvas.height = canvas.height
    ewCanvas.backgroundColor = 'transparent'
    ewCtx = ewCanvas.getContext('2d')
    ewCtx.fillStyle = fillColor
    lastCheckpoint = Date.now()

    run = =>
      color = undefined
      i = undefined
      image = undefined
      isDone = undefined
      p = undefined
      x = undefined
      y = undefined
      while pixelStack.length and Date.now() - lastCheckpoint < 90
        p = pixelStack.pop()
        x = p[0]
        y = p[1]
        i = @getIndex(x, y, rect.width)
        if !@getIsPointInRect(x, y, rect)
          continue
        if outputData[i]
          continue
        color = @getColorArray(imageData, i)
        if !@getAreColorsEqual(color, startColor, threshold)
          continue
        outputData[i] = true
        ewCtx.fillRect x, y, 1, 1
        outputPoints.push p
        pixelStack.push [
          x
          y + 1
        ]
        pixelStack.push [
          x + 1
          y
        ]
        pixelStack.push [
          x - 1
          y
        ]
        pixelStack.push [
          x
          y - 1
        ]
      isDone = pixelStack.length == 0
      image = new Image
      image.src = ewCanvas.toDataURL()
      if !isDone
        setTimeout run, 0
      lastCheckpoint = Date.now()
      if image.width
        callback image, isDone
      else
        LC.util.addImageOnload image, ->
          callback image, isDone

    run()
