{Tool} = require './base'
{createShape} = require '../core/shapes'
util = require '../core/util'


module.exports = class Magnifier extends Tool
  optionsStyle: 'magnify'

  name: 'Magnifier'
  iconName: 'magnifier'

  constructor: (lc) ->
    @cursor = 'url("' + lc.opts.imageURLPrefix + '/zoom-in.cur"), default'
    super(lc)

  didBecomeActive: (lc) ->
    eventUnsubscribeFuncs = []
    @_eventUnsubscribe = =>
      for func in eventUnsubscribeFuncs
        func()

    onKeyDown = (e) =>
      if (e.shiftKey && (e.keyCode is 16 || e.which is 16))
        @isShift = true
        lc.setCursor('url("' + lc.opts.imageURLPrefix + '/zoom-out.cur"), default')

    onKeyUp = (e) =>
      if e.keyCode is 16 || e.which is 16
        @isShift = false
        lc.setCursor(this.cursor)

    eventUnsubscribeFuncs.push lc.on 'keyDown', onKeyDown
    eventUnsubscribeFuncs.push lc.on 'keyUp', onKeyUp

  willBecomeInactive: (lc) ->
    @_eventUnsubscribe()

  end: (x, y, lc) ->
    scale = util.getBackingScale(lc.ctx)
    oldPosition = lc.position
    if (lc.scale <= 0.5 || lc.scale >= 3)
      return
    panX = (x - lc.canvas.width / 2 / scale) * lc.scale * 0.1
    panY = (y - lc.canvas.height / 2 / scale) * lc.scale * 0.1
    if @isShift
      lc.setZoom(lc.scale - 0.1)
      lc.pan(-panX, -panY)
    else
      lc.setZoom(lc.scale + 0.1)
      lc.pan(panX, panY)
