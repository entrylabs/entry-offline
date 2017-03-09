# maybe add checks to these in the future to make sure you never double-undo or
# double-redo
class ClearAction

  constructor: (@lc, @oldShapes, @newShapes) ->

  do: ->
    @lc.shapes = @newShapes.slice(0)
    @lc.repaintLayer('main')

  undo: ->
    @lc.shapes = @oldShapes.slice(0)
    @lc.repaintLayer('main')

class RemoveAction

  constructor: (@lc, @oldShapes, @newShapes) ->

  do: ->
    @lc.shapes = @newShapes.slice(0)
    @lc.repaintLayer('main')

  undo: ->
    @lc.shapes = @oldShapes.slice(0)
    @lc.repaintLayer('main')


class AddShapeAction

  constructor: (@lc, @shape, @previousShapeId=null) ->

  do: ->
    # common case: just add it to the end
    if (not @lc.shapes.length or
        @lc.shapes[@lc.shapes.length-1].id == @previousShapeId or
        @previousShapeId == null)
      @lc.shapes.push(@shape)
    # uncommon case: insert it somewhere
    else
      newShapes = []
      found = false
      for shape in @lc.shapes
        newShapes.push(shape)
        if shape.id == @previousShapeId
          newShapes.push(@shape)
          found = true
      unless found
        # given ID doesn't exist, just shove it on top
        newShapes.push(@shape)
      @lc.shapes = newShapes
    @lc.repaintLayer('main')

  undo: ->
    # common case: it's the most recent shape
    if @lc.shapes[@lc.shapes.length-1].id == @shape.id
      @lc.shapes.pop()
    # uncommon case: it's in the array somewhere
    else
      newShapes = []
      for shape in @lc.shapes
        newShapes.push(shape) if shape.id != @shape.id
      @lc.shapes = newShapes
    @lc.repaintLayer('main')

class EditShapeAction

  constructor: (@lc, @shape, @opts, @prevOpts=null) ->

  do: ->
    newOpts = {}
    for key of @opts
      newOpts[key] = @shape[key]
      @shape[key] = @opts[key]
    if (@prevOpts)
      @opts = @prevOpts
    else
      @opts = newOpts
    @lc.repaintLayer('main')

  undo: ->
    newOpts = {}
    for key of @opts
      newOpts[key] = @shape[key]
      @shape[key] = @opts[key]
    @opts = newOpts
    @lc.repaintLayer('main')

module.exports = {ClearAction, RemoveAction, AddShapeAction, EditShapeAction}
