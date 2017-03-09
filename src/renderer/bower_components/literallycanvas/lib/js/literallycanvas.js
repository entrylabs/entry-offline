(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g.LC = f()}})(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
/**
 * Copyright 2013-2015, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 *
 * @providesModule shallowEqual
 * @typechecks
 * 
 */

'use strict';

var hasOwnProperty = Object.prototype.hasOwnProperty;

/**
 * Performs equality by iterating through keys on an object and returning false
 * when any key has values which are not strictly equal between the arguments.
 * Returns true when the values of all keys are strictly equal.
 */
function shallowEqual(objA, objB) {
  if (objA === objB) {
    return true;
  }

  if (typeof objA !== 'object' || objA === null || typeof objB !== 'object' || objB === null) {
    return false;
  }

  var keysA = Object.keys(objA);
  var keysB = Object.keys(objB);

  if (keysA.length !== keysB.length) {
    return false;
  }

  // Test for A's keys different from B.
  var bHasOwnProperty = hasOwnProperty.bind(objB);
  for (var i = 0; i < keysA.length; i++) {
    if (!bHasOwnProperty(keysA[i]) || objA[keysA[i]] !== objB[keysA[i]]) {
      return false;
    }
  }

  return true;
}

module.exports = shallowEqual;
},{}],2:[function(require,module,exports){
module.exports = require('react/lib/ReactComponentWithPureRenderMixin');
},{"react/lib/ReactComponentWithPureRenderMixin":3}],3:[function(require,module,exports){
/**
 * Copyright 2013-2015, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 *
 * @providesModule ReactComponentWithPureRenderMixin
 */

'use strict';

var shallowCompare = require('./shallowCompare');

/**
 * If your React component's render function is "pure", e.g. it will render the
 * same result given the same props and state, provide this Mixin for a
 * considerable performance boost.
 *
 * Most React components have pure render functions.
 *
 * Example:
 *
 *   var ReactComponentWithPureRenderMixin =
 *     require('ReactComponentWithPureRenderMixin');
 *   React.createClass({
 *     mixins: [ReactComponentWithPureRenderMixin],
 *
 *     render: function() {
 *       return <div className={this.props.className}>foo</div>;
 *     }
 *   });
 *
 * Note: This only checks shallow equality for props and state. If these contain
 * complex data structures this mixin may have false-negatives for deeper
 * differences. Only mixin to components which have simple props and state, or
 * use `forceUpdate()` when you know deep data structures have changed.
 */
var ReactComponentWithPureRenderMixin = {
  shouldComponentUpdate: function (nextProps, nextState) {
    return shallowCompare(this, nextProps, nextState);
  }
};

module.exports = ReactComponentWithPureRenderMixin;
},{"./shallowCompare":4}],4:[function(require,module,exports){
/**
 * Copyright 2013-2015, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 *
* @providesModule shallowCompare
*/

'use strict';

var shallowEqual = require('fbjs/lib/shallowEqual');

/**
 * Does a shallow comparison for props and state.
 * See ReactComponentWithPureRenderMixin
 */
function shallowCompare(instance, nextProps, nextState) {
  return !shallowEqual(instance.props, nextProps) || !shallowEqual(instance.state, nextState);
}

module.exports = shallowCompare;
},{"fbjs/lib/shallowEqual":1}],5:[function(require,module,exports){
var INFINITE, JSONToShape, LiterallyCanvas, Pencil, actions, bindEvents, createShape, math, ref, renderShapeToContext, renderShapeToSVG, renderSnapshotToImage, renderSnapshotToSVG, shapeToJSON, util,
  bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
  slice = [].slice,
  indexOf = [].indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; };

actions = require('./actions');

bindEvents = require('./bindEvents');

math = require('./math');

ref = require('./shapes'), createShape = ref.createShape, shapeToJSON = ref.shapeToJSON, JSONToShape = ref.JSONToShape;

renderShapeToContext = require('./canvasRenderer').renderShapeToContext;

renderShapeToSVG = require('./svgRenderer').renderShapeToSVG;

renderSnapshotToImage = require('./renderSnapshotToImage');

renderSnapshotToSVG = require('./renderSnapshotToSVG');

Pencil = require('../tools/Pencil');

util = require('./util');

INFINITE = 'infinite';

module.exports = LiterallyCanvas = (function() {
  function LiterallyCanvas(arg1, arg2) {
    this.setImageSize = bind(this.setImageSize, this);
    var containerEl, opts;
    opts = null;
    containerEl = null;
    if (arg1 instanceof HTMLElement) {
      containerEl = arg1;
      opts = arg2;
    } else {
      opts = arg1;
    }
    this.opts = opts || {};
    this.tools = {};
    this.config = {
      zoomMin: opts.zoomMin || 0.2,
      zoomMax: opts.zoomMax || 4.0,
      zoomStep: opts.zoomStep || 0.2
    };
    this.colors = {
      primary: opts.primaryColor || '#000',
      secondary: opts.secondaryColor || '#fff',
      background: opts.backgroundColor || 'transparent'
    };
    this.font = 'normal 20px "KoPub Batang"';
    this.watermarkImage = opts.watermarkImage;
    this.watermarkScale = opts.watermarkScale || 1;
    this.backgroundCanvas = document.createElement('canvas');
    this.backgroundCtx = this.backgroundCanvas.getContext('2d');
    this.canvas = document.createElement('canvas');
    this.canvas.style['background-color'] = 'transparent';
    this.buffer = document.createElement('canvas');
    this.buffer.style['background-color'] = 'transparent';
    this.ctx = this.canvas.getContext('2d');
    this.ctx.imageSmoothingEnabled = false;
    this.bufferCtx = this.buffer.getContext('2d');
    this.bufferCtx.imageSmoothingEnabled = false;
    this.backingScale = util.getBackingScale(this.ctx);
    this.backgroundShapes = opts.backgroundShapes || [];
    this._shapesInProgress = [];
    this.shapes = [];
    this.undoStack = [];
    this.redoStack = [];
    this.isDragging = false;
    this.position = {
      x: 0,
      y: 0
    };
    this.scale = 1.0;
    this.setTool(new this.opts.tools[0](this));
    this.width = opts.imageSize.width || INFINITE;
    this.height = opts.imageSize.height || INFINITE;
    this.setZoom(this.scale);
    if (opts.snapshot) {
      this.loadSnapshot(opts.snapshot);
    }
    this.isBound = false;
    if (containerEl) {
      this.bindToElement(containerEl);
    }
    this.on('toolChange', (function(_this) {
      return function(data) {
        return _this.setCursor(data.tool.cursor);
      };
    })(this));
    this.respondToSizeChange = function() {};
  }

  LiterallyCanvas.prototype.bindToElement = function(containerEl) {
    var ref1, repaintAll;
    if (this.containerEl) {
      console.warn("Trying to bind Literally Canvas to a DOM element more than once is unsupported.");
      return;
    }
    this.containerEl = containerEl;
    this._unsubscribeEvents = bindEvents(this, this.containerEl, this.opts.keyboardShortcuts);
    this.containerEl.style['background-color'] = this.colors.background;
    this.containerEl.appendChild(this.backgroundCanvas);
    this.containerEl.appendChild(this.canvas);
    this.isBound = true;
    repaintAll = (function(_this) {
      return function() {
        _this.keepPanInImageBounds();
        return _this.repaintAllLayers();
      };
    })(this);
    this.respondToSizeChange = util.matchElementSize(this.containerEl, [this.backgroundCanvas, this.canvas], this.backingScale, repaintAll);
    if (this.watermarkImage) {
      this.watermarkImage.onload = (function(_this) {
        return function() {
          return _this.repaintLayer('background');
        };
      })(this);
    }
    if ((ref1 = this.tool) != null) {
      ref1.didBecomeActive(this);
    }
    return repaintAll();
  };

  LiterallyCanvas.prototype._teardown = function() {
    var ref1;
    if ((ref1 = this.tool) != null) {
      ref1.willBecomeInactive(this);
    }
    if (typeof this._unsubscribeEvents === "function") {
      this._unsubscribeEvents();
    }
    this.tool = null;
    this.containerEl = null;
    return this.isBound = false;
  };

  LiterallyCanvas.prototype.trigger = function(name, data) {
    this.canvas.dispatchEvent(new CustomEvent(name, {
      detail: data
    }));
    return null;
  };

  LiterallyCanvas.prototype.on = function(name, fn) {
    var wrapper;
    wrapper = function(e) {
      return fn(e.detail);
    };
    this.canvas.addEventListener(name, wrapper);
    return (function(_this) {
      return function() {
        return _this.canvas.removeEventListener(name, wrapper);
      };
    })(this);
  };

  LiterallyCanvas.prototype.getRenderScale = function() {
    return this.scale * this.backingScale;
  };

  LiterallyCanvas.prototype.clientCoordsToDrawingCoords = function(x, y) {
    return {
      x: (x * this.backingScale - this.position.x) / this.getRenderScale(),
      y: (y * this.backingScale - this.position.y) / this.getRenderScale()
    };
  };

  LiterallyCanvas.prototype.drawingCoordsToClientCoords = function(x, y) {
    return {
      x: x * this.getRenderScale() + this.position.x,
      y: y * this.getRenderScale() + this.position.y
    };
  };

  LiterallyCanvas.prototype.setImageSize = function(width, height) {
    this.width = width || INFINITE;
    this.height = height || INFINITE;
    this.keepPanInImageBounds();
    this.repaintAllLayers();
    return this.trigger('imageSizeChange', {
      width: this.width,
      height: this.height
    });
  };

  LiterallyCanvas.prototype.registerTool = function(tool) {
    return this.tools[tool.name] = tool;
  };

  LiterallyCanvas.prototype.setTool = function(tool) {
    var ref1;
    if (this.isBound) {
      if ((ref1 = this.tool) != null) {
        ref1.willBecomeInactive(this);
      }
    }
    this.tool = tool;
    this.trigger('toolChange', {
      tool: tool
    });
    if (this.isBound) {
      return this.tool.didBecomeActive(this);
    }
  };

  LiterallyCanvas.prototype.setCursor = function(cursor) {
    if (cursor) {
      return this.canvas.style.cursor = cursor;
    } else {
      return this.canvas.style.cursor = 'default';
    }
  };

  LiterallyCanvas.prototype.setShapesInProgress = function(newVal) {
    return this._shapesInProgress = newVal;
  };

  LiterallyCanvas.prototype.pointerDown = function(x, y) {
    var p;
    p = this.clientCoordsToDrawingCoords(x, y);
    if (this.tool.usesSimpleAPI) {
      this.tool.begin(p.x, p.y, this);
      this.isDragging = true;
      return this.trigger("drawStart", {
        tool: this.tool
      });
    } else {
      this.isDragging = true;
      return this.trigger("lc-pointerdown", {
        tool: this.tool,
        x: p.x,
        y: p.y,
        rawX: x,
        rawY: y
      });
    }
  };

  LiterallyCanvas.prototype.pointerMove = function(x, y) {
    return util.requestAnimationFrame((function(_this) {
      return function() {
        var p, ref1;
        p = _this.clientCoordsToDrawingCoords(x, y);
        if ((ref1 = _this.tool) != null ? ref1.usesSimpleAPI : void 0) {
          if (_this.isDragging) {
            _this.tool["continue"](p.x, p.y, _this);
            _this.trigger("drawContinue", {
              tool: _this.tool
            });
          }
          return _this.trigger("lc-pointermove", {
            tool: _this.tool,
            x: p.x,
            y: p.y,
            rawX: x,
            rawY: y
          });
        } else {
          if (_this.isDragging) {
            return _this.trigger("lc-pointerdrag", {
              tool: _this.tool,
              x: p.x,
              y: p.y,
              rawX: x,
              rawY: y
            });
          } else {
            return _this.trigger("lc-pointermove", {
              tool: _this.tool,
              x: p.x,
              y: p.y,
              rawX: x,
              rawY: y
            });
          }
        }
      };
    })(this));
  };

  LiterallyCanvas.prototype.pointerUp = function(x, y) {
    var p;
    p = this.clientCoordsToDrawingCoords(x, y);
    if (this.tool.usesSimpleAPI) {
      if (this.isDragging) {
        this.tool.end(p.x, p.y, this);
        this.isDragging = false;
        return this.trigger("drawEnd", {
          tool: this.tool
        });
      }
    } else {
      this.isDragging = false;
      return this.trigger("lc-pointerup", {
        tool: this.tool,
        x: p.x,
        y: p.y,
        rawX: x,
        rawY: y
      });
    }
  };

  LiterallyCanvas.prototype.setColor = function(name, color) {
    this.colors[name] = color;
    if (!this.isBound) {
      return;
    }
    switch (name) {
      case 'background':
        this.containerEl.style.backgroundColor = this.colors.background;
        this.repaintLayer('background');
        break;
      case 'primary':
        this.repaintLayer('main');
        break;
      case 'secondary':
        this.repaintLayer('main');
    }
    this.trigger(name + "ColorChange", this.colors[name]);
    if (name === 'background') {
      return this.trigger("drawingChange");
    }
  };

  LiterallyCanvas.prototype.getColor = function(name) {
    return this.colors[name];
  };

  LiterallyCanvas.prototype.setFont = function(font) {
    this.font = font;
    this.trigger("fontChange", this.font);
    return console.log(font);
  };

  LiterallyCanvas.prototype.getFont = function() {
    return this.font;
  };

  LiterallyCanvas.prototype.saveShape = function(shape, triggerShapeSaveEvent, previousShapeId) {
    if (triggerShapeSaveEvent == null) {
      triggerShapeSaveEvent = true;
    }
    if (previousShapeId == null) {
      previousShapeId = null;
    }
    if (!previousShapeId) {
      previousShapeId = this.shapes.length ? this.shapes[this.shapes.length - 1].id : null;
    }
    this.execute(new actions.AddShapeAction(this, shape, previousShapeId));
    if (triggerShapeSaveEvent) {
      this.trigger('shapeSave', {
        shape: shape,
        previousShapeId: previousShapeId
      });
    }
    return this.trigger('drawingChange');
  };

  LiterallyCanvas.prototype.editShape = function(shape, opts, prevOpts, triggerShapeEditEvent) {
    if (triggerShapeEditEvent == null) {
      triggerShapeEditEvent = true;
    }
    this.execute(new actions.EditShapeAction(this, shape, opts, prevOpts));
    if (triggerShapeEditEvent) {
      this.trigger('shapeEdit', {
        shape: shape,
        opts: opts
      });
    }
    return this.trigger('drawingChange');
  };

  LiterallyCanvas.prototype.pan = function(x, y) {
    return this.setPan(this.position.x - x, this.position.y - y);
  };

  LiterallyCanvas.prototype.keepPanInImageBounds = function() {
    var ref1, renderScale, x, y;
    renderScale = this.getRenderScale();
    ref1 = this.position, x = ref1.x, y = ref1.y;
    if (this.width !== INFINITE) {
      if (this.canvas.width > this.width * renderScale) {
        x = (this.canvas.width - this.width * renderScale) / 2;
      } else {
        x = Math.max(Math.min(0, x), this.canvas.width - this.width * renderScale);
      }
    }
    if (this.height !== INFINITE) {
      if (this.canvas.height > this.height * renderScale) {
        y = (this.canvas.height - this.height * renderScale) / 2;
      } else {
        y = Math.max(Math.min(0, y), this.canvas.height - this.height * renderScale);
      }
    }
    return this.position = {
      x: x,
      y: y
    };
  };

  LiterallyCanvas.prototype.setPan = function(x, y) {
    this.position = {
      x: x,
      y: y
    };
    this.keepPanInImageBounds();
    this.repaintAllLayers();
    return this.trigger('pan', {
      x: this.position.x,
      y: this.position.y
    });
  };

  LiterallyCanvas.prototype.zoom = function(factor) {
    var newScale;
    newScale = this.scale + factor;
    newScale = Math.max(newScale, this.config.zoomMin);
    newScale = Math.min(newScale, this.config.zoomMax);
    newScale = Math.round(newScale * 100) / 100;
    return this.setZoom(newScale);
  };

  LiterallyCanvas.prototype.setZoom = function(scale) {
    var oldScale;
    oldScale = this.scale;
    scale = Math.max(this.config.zoomMin, scale);
    scale = Math.min(this.config.zoomMax, scale);
    this.scale = scale;
    this.position.x = math.scalePositionScalar(this.position.x, this.canvas.width, oldScale, this.scale);
    this.position.y = math.scalePositionScalar(this.position.y, this.canvas.height, oldScale, this.scale);
    this.keepPanInImageBounds();
    this.repaintAllLayers();
    return this.trigger('zoom', {
      oldScale: oldScale,
      newScale: this.scale
    });
  };

  LiterallyCanvas.prototype.setWatermarkImage = function(newImage) {
    this.watermarkImage = newImage;
    util.addImageOnload(newImage, (function(_this) {
      return function() {
        return _this.repaintLayer('background');
      };
    })(this));
    if (newImage.width) {
      return this.repaintLayer('background');
    }
  };

  LiterallyCanvas.prototype.repaintAllLayers = function() {
    var i, key, len, ref1;
    ref1 = ['background', 'main'];
    for (i = 0, len = ref1.length; i < len; i++) {
      key = ref1[i];
      this.repaintLayer(key);
    }
    return null;
  };

  LiterallyCanvas.prototype.repaintLayer = function(repaintLayerKey, dirty) {
    var retryCallback;
    if (dirty == null) {
      dirty = repaintLayerKey === 'main';
    }
    if (!this.isBound) {
      return;
    }
    switch (repaintLayerKey) {
      case 'background':
        this.backgroundCtx.clearRect(0, 0, this.backgroundCanvas.width, this.backgroundCanvas.height);
        retryCallback = (function(_this) {
          return function() {
            return _this.repaintLayer('background');
          };
        })(this);
        if (this.watermarkImage) {
          this._renderWatermark(this.backgroundCtx, true, retryCallback);
        }
        this.draw(this.backgroundShapes, this.backgroundCtx, retryCallback);
        break;
      case 'main':
        retryCallback = (function(_this) {
          return function() {
            return _this.repaintLayer('main', true);
          };
        })(this);
        if (dirty) {
          this.buffer.width = this.canvas.width;
          this.buffer.height = this.canvas.height;
          this.bufferCtx.clearRect(0, 0, this.buffer.width, this.buffer.height);
          this.draw(this.shapes, this.bufferCtx, retryCallback);
        }
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        if (this.canvas.width > 0 && this.canvas.height > 0) {
          this.ctx.fillStyle = '#e8e8e8';
          this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
          this.clipped(((function(_this) {
            return function() {
              _this.ctx.clearRect(0, 0, _this.canvas.width, _this.canvas.height);
              return _this.ctx.drawImage(_this.buffer, 0, 0);
            };
          })(this)), this.ctx);
          this.clipped(((function(_this) {
            return function() {
              return _this.transformed((function() {
                var i, len, ref1, results, shape;
                ref1 = _this._shapesInProgress;
                results = [];
                for (i = 0, len = ref1.length; i < len; i++) {
                  shape = ref1[i];
                  results.push(renderShapeToContext(_this.ctx, shape, {
                    bufferCtx: _this.bufferCtx,
                    shouldOnlyDrawLatest: true
                  }));
                }
                return results;
              }), _this.ctx, _this.bufferCtx);
            };
          })(this)), this.ctx, this.bufferCtx);
        }
    }
    return this.trigger('repaint', {
      layerKey: repaintLayerKey
    });
  };

  LiterallyCanvas.prototype._renderWatermark = function(ctx, worryAboutRetina, retryCallback) {
    if (worryAboutRetina == null) {
      worryAboutRetina = true;
    }
    if (!this.watermarkImage.width) {
      this.watermarkImage.onload = retryCallback;
      return;
    }
    ctx.save();
    ctx.translate(ctx.canvas.width / 2, ctx.canvas.height / 2);
    ctx.scale(this.watermarkScale, this.watermarkScale);
    if (worryAboutRetina) {
      ctx.scale(this.backingScale, this.backingScale);
    }
    ctx.drawImage(this.watermarkImage, -this.watermarkImage.width / 2, -this.watermarkImage.height / 2);
    return ctx.restore();
  };

  LiterallyCanvas.prototype.drawShapeInProgress = function(shape) {
    this.repaintLayer('main', false);
    return this.clipped(((function(_this) {
      return function() {
        return _this.transformed((function() {
          return renderShapeToContext(_this.ctx, shape, {
            bufferCtx: _this.bufferCtx,
            shouldOnlyDrawLatest: true
          });
        }), _this.ctx, _this.bufferCtx);
      };
    })(this)), this.ctx, this.bufferCtx);
  };

  LiterallyCanvas.prototype.draw = function(shapes, ctx, retryCallback) {
    var drawShapes;
    if (!shapes.length) {
      return;
    }
    drawShapes = (function(_this) {
      return function() {
        var i, len, results, shape;
        results = [];
        for (i = 0, len = shapes.length; i < len; i++) {
          shape = shapes[i];
          results.push(renderShapeToContext(ctx, shape, {
            retryCallback: retryCallback
          }));
        }
        return results;
      };
    })(this);
    return this.clipped(((function(_this) {
      return function() {
        return _this.transformed(drawShapes, ctx);
      };
    })(this)), ctx);
  };

  LiterallyCanvas.prototype.clipped = function() {
    var contexts, ctx, fn, height, i, j, len, len1, results, width, x, y;
    fn = arguments[0], contexts = 2 <= arguments.length ? slice.call(arguments, 1) : [];
    x = this.width === INFINITE ? 0 : this.position.x;
    y = this.height === INFINITE ? 0 : this.position.y;
    width = (function() {
      switch (this.width) {
        case INFINITE:
          return this.canvas.width;
        default:
          return this.width * this.getRenderScale();
      }
    }).call(this);
    height = (function() {
      switch (this.height) {
        case INFINITE:
          return this.canvas.height;
        default:
          return this.height * this.getRenderScale();
      }
    }).call(this);
    for (i = 0, len = contexts.length; i < len; i++) {
      ctx = contexts[i];
      ctx.save();
      ctx.beginPath();
      ctx.rect(x, y, width, height);
      ctx.clip();
    }
    fn();
    results = [];
    for (j = 0, len1 = contexts.length; j < len1; j++) {
      ctx = contexts[j];
      results.push(ctx.restore());
    }
    return results;
  };

  LiterallyCanvas.prototype.transformed = function() {
    var contexts, ctx, fn, i, j, len, len1, results, scale;
    fn = arguments[0], contexts = 2 <= arguments.length ? slice.call(arguments, 1) : [];
    for (i = 0, len = contexts.length; i < len; i++) {
      ctx = contexts[i];
      ctx.save();
      ctx.translate(Math.floor(this.position.x), Math.floor(this.position.y));
      scale = this.getRenderScale();
      ctx.scale(scale, scale);
    }
    fn();
    results = [];
    for (j = 0, len1 = contexts.length; j < len1; j++) {
      ctx = contexts[j];
      results.push(ctx.restore());
    }
    return results;
  };

  LiterallyCanvas.prototype.clear = function(triggerClearEvent) {
    var newShapes, oldShapes;
    if (triggerClearEvent == null) {
      triggerClearEvent = true;
    }
    oldShapes = this.shapes.slice(0);
    newShapes = [];
    this.setShapesInProgress([]);
    this.execute(new actions.ClearAction(this, oldShapes, newShapes));
    this.repaintLayer('main');
    if (triggerClearEvent) {
      this.trigger('clear', null);
    }
    return this.trigger('drawingChange', {});
  };

  LiterallyCanvas.prototype.execute = function(action) {
    this.undoStack.push(action);
    action["do"]();
    this.trigger('do', {
      action: action
    });
    return this.redoStack = [];
  };

  LiterallyCanvas.prototype.undo = function() {
    var action;
    if (!this.undoStack.length) {
      return;
    }
    action = this.undoStack.pop();
    action.undo();
    this.redoStack.push(action);
    this.trigger('undo', {
      action: action
    });
    return this.trigger('drawingChange', {});
  };

  LiterallyCanvas.prototype.redo = function() {
    var action;
    if (!this.redoStack.length) {
      return;
    }
    action = this.redoStack.pop();
    this.undoStack.push(action);
    action["do"]();
    this.trigger('redo', {
      action: action
    });
    return this.trigger('drawingChange', {});
  };

  LiterallyCanvas.prototype.canUndo = function() {
    return !!this.undoStack.length;
  };

  LiterallyCanvas.prototype.canRedo = function() {
    return !!this.redoStack.length;
  };

  LiterallyCanvas.prototype.getPixel = function(x, y) {
    var p, pixel;
    p = this.drawingCoordsToClientCoords(x, y);
    pixel = this.ctx.getImageData(p.x, p.y, 1, 1).data;
    if (pixel[3]) {
      return "rgb(" + pixel[0] + ", " + pixel[1] + ", " + pixel[2] + ")";
    } else {
      return null;
    }
  };

  LiterallyCanvas.prototype.getContentBounds = function() {
    return util.getBoundingRect((this.shapes.concat(this.backgroundShapes)).map(function(s) {
      return s.getBoundingRect();
    }), this.width === INFINITE ? 0 : this.width, this.height === INFINITE ? 0 : this.height);
  };

  LiterallyCanvas.prototype.getDefaultImageRect = function(explicitSize, margin) {
    var s;
    if (explicitSize == null) {
      explicitSize = {
        width: 0,
        height: 0
      };
    }
    if (margin == null) {
      margin = {
        top: 0,
        right: 0,
        bottom: 0,
        left: 0
      };
    }
    return util.getDefaultImageRect((function() {
      var i, len, ref1, results;
      ref1 = this.shapes.concat(this.backgroundShapes);
      results = [];
      for (i = 0, len = ref1.length; i < len; i++) {
        s = ref1[i];
        results.push(s.getBoundingRect(this.ctx));
      }
      return results;
    }).call(this), explicitSize, margin);
  };

  LiterallyCanvas.prototype.getImage = function(opts) {
    if (opts == null) {
      opts = {};
    }
    if (opts.includeWatermark == null) {
      opts.includeWatermark = true;
    }
    if (opts.scaleDownRetina == null) {
      opts.scaleDownRetina = true;
    }
    if (opts.scale == null) {
      opts.scale = 1;
    }
    if (!opts.scaleDownRetina) {
      opts.scale *= this.backingScale;
    }
    if (opts.includeWatermark) {
      opts.watermarkImage = this.watermarkImage;
      opts.watermarkScale = this.watermarkScale;
      if (!opts.scaleDownRetina) {
        opts.watermarkScale *= this.backingScale;
      }
    }
    return renderSnapshotToImage(this.getSnapshot(), opts);
  };

  LiterallyCanvas.prototype.canvasForExport = function() {
    this.repaintAllLayers();
    return util.combineCanvases(this.backgroundCanvas, this.canvas);
  };

  LiterallyCanvas.prototype.canvasWithBackground = function(backgroundImageOrCanvas) {
    return util.combineCanvases(backgroundImageOrCanvas, this.canvasForExport());
  };

  LiterallyCanvas.prototype.getSnapshot = function(keys) {
    var i, k, len, ref1, shape, snapshot;
    if (keys == null) {
      keys = null;
    }
    if (keys == null) {
      keys = ['shapes', 'imageSize', 'colors', 'position', 'scale', 'backgroundShapes'];
    }
    snapshot = {};
    ref1 = ['colors', 'position', 'scale'];
    for (i = 0, len = ref1.length; i < len; i++) {
      k = ref1[i];
      if (indexOf.call(keys, k) >= 0) {
        snapshot[k] = this[k];
      }
    }
    if (indexOf.call(keys, 'shapes') >= 0) {
      snapshot.shapes = (function() {
        var j, len1, ref2, results;
        ref2 = this.shapes;
        results = [];
        for (j = 0, len1 = ref2.length; j < len1; j++) {
          shape = ref2[j];
          results.push(shapeToJSON(shape));
        }
        return results;
      }).call(this);
    }
    if (indexOf.call(keys, 'backgroundShapes') >= 0) {
      snapshot.backgroundShapes = (function() {
        var j, len1, ref2, results;
        ref2 = this.backgroundShapes;
        results = [];
        for (j = 0, len1 = ref2.length; j < len1; j++) {
          shape = ref2[j];
          results.push(shapeToJSON(shape));
        }
        return results;
      }).call(this);
    }
    if (indexOf.call(keys, 'imageSize') >= 0) {
      snapshot.imageSize = {
        width: this.width,
        height: this.height
      };
    }
    return snapshot;
  };

  LiterallyCanvas.prototype.getSnapshotJSON = function() {
    console.warn("lc.getSnapshotJSON() is deprecated. use JSON.stringify(lc.getSnapshot()) instead.");
    return JSON.stringify(this.getSnapshot());
  };

  LiterallyCanvas.prototype.getSVGString = function(opts) {
    if (opts == null) {
      opts = {};
    }
    return renderSnapshotToSVG(this.getSnapshot(), opts);
  };

  LiterallyCanvas.prototype.loadSnapshot = function(snapshot) {
    var i, j, k, len, len1, ref1, ref2, s, shape, shapeRepr;
    if (!snapshot) {
      return;
    }
    if (snapshot.colors) {
      ref1 = ['primary', 'secondary', 'background'];
      for (i = 0, len = ref1.length; i < len; i++) {
        k = ref1[i];
        this.setColor(k, snapshot.colors[k]);
      }
    }
    if (snapshot.shapes) {
      this.shapes = [];
      ref2 = snapshot.shapes;
      for (j = 0, len1 = ref2.length; j < len1; j++) {
        shapeRepr = ref2[j];
        shape = JSONToShape(shapeRepr);
        if (shape) {
          this.execute(new actions.AddShapeAction(this, shape));
        }
      }
    }
    if (snapshot.backgroundShapes) {
      this.backgroundShapes = (function() {
        var l, len2, ref3, results;
        ref3 = snapshot.backgroundShapes;
        results = [];
        for (l = 0, len2 = ref3.length; l < len2; l++) {
          s = ref3[l];
          results.push(JSONToShape(s));
        }
        return results;
      })();
    }
    if (snapshot.imageSize) {
      this.width = snapshot.imageSize.width;
      this.height = snapshot.imageSize.height;
    }
    if (snapshot.position) {
      this.position = snapshot.position;
    }
    if (snapshot.scale) {
      this.scale = snapshot.scale;
    }
    this.repaintAllLayers();
    this.trigger('snapshotLoad');
    return this.trigger('drawingChange', {});
  };

  LiterallyCanvas.prototype.loadSnapshotJSON = function(str) {
    console.warn("lc.loadSnapshotJSON() is deprecated. use lc.loadSnapshot(JSON.parse(snapshot)) instead.");
    return this.loadSnapshot(JSON.parse(str));
  };

  LiterallyCanvas.prototype.addShape = function(shapeRepr) {
    var shape;
    shape = JSONToShape(shapeRepr);
    if (shape) {
      this.execute(new actions.AddShapeAction(this, shape));
    }
    this.repaintLayer('main');
    return shape;
  };

  LiterallyCanvas.prototype.removeShape = function(targetShape, triggerClearEvent) {
    var i, len, newShapes, oldShapes, ref1, shape;
    if (triggerClearEvent == null) {
      triggerClearEvent = true;
    }
    oldShapes = this.shapes.slice(0);
    if (this.shapes[this.shapes.length - 1].id === targetShape.id) {
      this.shapes.pop();
    } else {
      newShapes = [];
      ref1 = this.shapes;
      for (i = 0, len = ref1.length; i < len; i++) {
        shape = ref1[i];
        if (shape.id !== targetShape.id) {
          newShapes.push(shape);
        }
      }
      this.shapes = newShapes;
    }
    this.execute(new actions.RemoveAction(this, oldShapes, this.shapes.slice(0)));
    this.repaintLayer('main');
    if (triggerClearEvent) {
      return this.trigger('remove', {
        shapes: this.shapes
      });
    }
  };

  return LiterallyCanvas;

})();


},{"../tools/Pencil":61,"./actions":7,"./bindEvents":8,"./canvasRenderer":9,"./math":14,"./renderSnapshotToImage":15,"./renderSnapshotToSVG":16,"./shapes":17,"./svgRenderer":18,"./util":19}],6:[function(require,module,exports){
var TextRenderer, getLinesToRender, getNextLine, parseFontString;

require('./fontmetrics.js');

parseFontString = function(font) {
  var fontFamily, fontItems, fontSize, fontStyle;
  fontItems = font.split(' ');
  fontStyle = fontItems.shift();
  fontSize = parseInt(fontItems.shift());
  fontFamily = fontItems.join(' ');
  return {
    fontSize: fontSize,
    fontFamily: fontFamily,
    fontStyle: fontStyle
  };
};

getNextLine = function(ctx, text, forcedWidth) {
  var doesSubstringFit, endIndex, isEndOfString, isNonWord, isWhitespace, lastGoodIndex, lastOkayIndex, nextWordStartIndex, textToHere, wasInWord;
  if (!text.length) {
    return ['', ''];
  }
  endIndex = 0;
  lastGoodIndex = 0;
  lastOkayIndex = 0;
  wasInWord = false;
  while (true) {
    endIndex += 1;
    isEndOfString = endIndex >= text.length;
    isWhitespace = (!isEndOfString) && text[endIndex].match(/\s/);
    isNonWord = isWhitespace || isEndOfString;
    textToHere = text.substring(0, endIndex);
    doesSubstringFit = forcedWidth ? ctx.measureTextWidth(textToHere).width <= forcedWidth : true;
    if (doesSubstringFit) {
      lastOkayIndex = endIndex;
    }
    if (isNonWord && wasInWord) {
      wasInWord = false;
      if (doesSubstringFit) {
        lastGoodIndex = endIndex;
      }
    }
    wasInWord = !isWhitespace;
    if (isEndOfString || !doesSubstringFit) {
      if (doesSubstringFit) {
        return [text, ''];
      } else if (lastGoodIndex > 0) {
        nextWordStartIndex = lastGoodIndex + 1;
        while (nextWordStartIndex < text.length && text[nextWordStartIndex].match('/\s/')) {
          nextWordStartIndex += 1;
        }
        return [text.substring(0, lastGoodIndex), text.substring(nextWordStartIndex)];
      } else {
        return [text.substring(0, lastOkayIndex), text.substring(lastOkayIndex)];
      }
    }
  }
};

getLinesToRender = function(ctx, text, forcedWidth) {
  var j, len, lines, nextLine, ref, ref1, remainingText, textLine, textSplitOnLines;
  textSplitOnLines = text.split(/\r\n|\r|\n/g);
  lines = [];
  for (j = 0, len = textSplitOnLines.length; j < len; j++) {
    textLine = textSplitOnLines[j];
    ref = getNextLine(ctx, textLine, forcedWidth), nextLine = ref[0], remainingText = ref[1];
    if (nextLine) {
      while (nextLine) {
        lines.push(nextLine);
        ref1 = getNextLine(ctx, remainingText, forcedWidth), nextLine = ref1[0], remainingText = ref1[1];
      }
    } else {
      lines.push(textLine);
    }
  }
  return lines;
};

TextRenderer = (function() {
  function TextRenderer(ctx, text1, font1, forcedWidth1, forcedHeight) {
    var fontFamily, fontSize, fontStyle, ref;
    this.text = text1;
    this.font = font1;
    this.forcedWidth = forcedWidth1;
    this.forcedHeight = forcedHeight;
    ref = parseFontString(this.font), fontFamily = ref.fontFamily, fontSize = ref.fontSize, fontStyle = ref.fontStyle;
    ctx.font = this.font;
    ctx.textBaseline = 'baseline';
    this.emDashWidth = ctx.measureTextWidth('—', fontSize, fontFamily).width;
    this.caratWidth = ctx.measureTextWidth('|', fontSize, fontFamily).width;
    this.lines = getLinesToRender(ctx, this.text, this.forcedWidth);
    this.metricses = this.lines.map((function(_this) {
      return function(line) {
        return ctx.measureText2(line || 'X', fontSize, _this.font);
      };
    })(this));
    this.metrics = {
      ascent: Math.max.apply(Math, this.metricses.map(function(arg) {
        var ascent;
        ascent = arg.ascent;
        return ascent;
      })),
      descent: Math.max.apply(Math, this.metricses.map(function(arg) {
        var descent;
        descent = arg.descent;
        return descent;
      })),
      fontsize: Math.max.apply(Math, this.metricses.map(function(arg) {
        var fontsize;
        fontsize = arg.fontsize;
        return fontsize;
      })),
      leading: Math.max.apply(Math, this.metricses.map(function(arg) {
        var leading;
        leading = arg.leading;
        return leading;
      })),
      width: Math.max.apply(Math, this.metricses.map(function(arg) {
        var width;
        width = arg.width;
        return width;
      })),
      height: Math.max.apply(Math, this.metricses.map(function(arg) {
        var height;
        height = arg.height;
        return height;
      })),
      bounds: {
        minx: Math.min.apply(Math, this.metricses.map(function(arg) {
          var bounds;
          bounds = arg.bounds;
          return bounds.minx;
        })),
        miny: Math.min.apply(Math, this.metricses.map(function(arg) {
          var bounds;
          bounds = arg.bounds;
          return bounds.miny;
        })),
        maxx: Math.max.apply(Math, this.metricses.map(function(arg) {
          var bounds;
          bounds = arg.bounds;
          return bounds.maxx;
        })),
        maxy: Math.max.apply(Math, this.metricses.map(function(arg) {
          var bounds;
          bounds = arg.bounds;
          return bounds.maxy;
        }))
      }
    };
    this.boundingBoxWidth = Math.ceil(this.metrics.width);
  }

  TextRenderer.prototype.draw = function(ctx, x, y, color, bgColor) {
    var i, j, len, line, ref, results;
    ctx.textBaseline = 'top';
    ctx.font = this.font;
    i = 0;
    ctx.fillStyle = bgColor;
    ctx.fillRect(x, y, this.metrics.width, this.metrics.leading * this.lines.length);
    ctx.fillStyle = color;
    ref = this.lines;
    results = [];
    for (j = 0, len = ref.length; j < len; j++) {
      line = ref[j];
      ctx.fillText(line, x, y + i * this.metrics.leading);
      results.push(i += 1);
    }
    return results;
  };

  TextRenderer.prototype.getWidth = function(isEditing) {
    if (isEditing == null) {
      isEditing = false;
    }
    if (this.forcedWidth) {
      return this.forcedWidth;
    } else {
      if (isEditing) {
        return this.metrics.bounds.maxx + this.caratWidth;
      } else {
        return this.metrics.bounds.maxx;
      }
    }
  };

  TextRenderer.prototype.getHeight = function() {
    return this.forcedHeight || (this.metrics.leading * this.lines.length);
  };

  return TextRenderer;

})();

module.exports = TextRenderer;


},{"./fontmetrics.js":11}],7:[function(require,module,exports){
var AddShapeAction, ClearAction, EditShapeAction, RemoveAction;

ClearAction = (function() {
  function ClearAction(lc, oldShapes, newShapes1) {
    this.lc = lc;
    this.oldShapes = oldShapes;
    this.newShapes = newShapes1;
  }

  ClearAction.prototype["do"] = function() {
    this.lc.shapes = this.newShapes.slice(0);
    return this.lc.repaintLayer('main');
  };

  ClearAction.prototype.undo = function() {
    this.lc.shapes = this.oldShapes.slice(0);
    return this.lc.repaintLayer('main');
  };

  return ClearAction;

})();

RemoveAction = (function() {
  function RemoveAction(lc, oldShapes, newShapes1) {
    this.lc = lc;
    this.oldShapes = oldShapes;
    this.newShapes = newShapes1;
  }

  RemoveAction.prototype["do"] = function() {
    this.lc.shapes = this.newShapes.slice(0);
    return this.lc.repaintLayer('main');
  };

  RemoveAction.prototype.undo = function() {
    this.lc.shapes = this.oldShapes.slice(0);
    return this.lc.repaintLayer('main');
  };

  return RemoveAction;

})();

AddShapeAction = (function() {
  function AddShapeAction(lc, shape1, previousShapeId) {
    this.lc = lc;
    this.shape = shape1;
    this.previousShapeId = previousShapeId != null ? previousShapeId : null;
  }

  AddShapeAction.prototype["do"] = function() {
    var found, i, len, newShapes, ref, shape;
    if (!this.lc.shapes.length || this.lc.shapes[this.lc.shapes.length - 1].id === this.previousShapeId || this.previousShapeId === null) {
      this.lc.shapes.push(this.shape);
    } else {
      newShapes = [];
      found = false;
      ref = this.lc.shapes;
      for (i = 0, len = ref.length; i < len; i++) {
        shape = ref[i];
        newShapes.push(shape);
        if (shape.id === this.previousShapeId) {
          newShapes.push(this.shape);
          found = true;
        }
      }
      if (!found) {
        newShapes.push(this.shape);
      }
      this.lc.shapes = newShapes;
    }
    return this.lc.repaintLayer('main');
  };

  AddShapeAction.prototype.undo = function() {
    var i, len, newShapes, ref, shape;
    if (this.lc.shapes[this.lc.shapes.length - 1].id === this.shape.id) {
      this.lc.shapes.pop();
    } else {
      newShapes = [];
      ref = this.lc.shapes;
      for (i = 0, len = ref.length; i < len; i++) {
        shape = ref[i];
        if (shape.id !== this.shape.id) {
          newShapes.push(shape);
        }
      }
      this.lc.shapes = newShapes;
    }
    return this.lc.repaintLayer('main');
  };

  return AddShapeAction;

})();

EditShapeAction = (function() {
  function EditShapeAction(lc, shape1, opts, prevOpts) {
    this.lc = lc;
    this.shape = shape1;
    this.opts = opts;
    this.prevOpts = prevOpts != null ? prevOpts : null;
  }

  EditShapeAction.prototype["do"] = function() {
    var key, newOpts;
    newOpts = {};
    for (key in this.opts) {
      newOpts[key] = this.shape[key];
      this.shape[key] = this.opts[key];
    }
    if (this.prevOpts) {
      this.opts = this.prevOpts;
    } else {
      this.opts = newOpts;
    }
    return this.lc.repaintLayer('main');
  };

  EditShapeAction.prototype.undo = function() {
    var key, newOpts;
    newOpts = {};
    for (key in this.opts) {
      newOpts[key] = this.shape[key];
      this.shape[key] = this.opts[key];
    }
    this.opts = newOpts;
    return this.lc.repaintLayer('main');
  };

  return EditShapeAction;

})();

module.exports = {
  ClearAction: ClearAction,
  RemoveAction: RemoveAction,
  AddShapeAction: AddShapeAction,
  EditShapeAction: EditShapeAction
};


},{}],8:[function(require,module,exports){
var bindEvents, buttonIsDown, coordsForTouchEvent, position;

coordsForTouchEvent = function(el, e) {
  var p, tx, ty;
  tx = e.changedTouches[0].clientX;
  ty = e.changedTouches[0].clientY;
  p = el.getBoundingClientRect();
  return [tx - p.left, ty - p.top];
};

position = function(el, e) {
  var p;
  p = el.getBoundingClientRect();
  return {
    left: e.clientX - p.left,
    top: e.clientY - p.top
  };
};

buttonIsDown = function(e) {
  if (e.buttons != null) {
    return e.buttons === 1;
  } else {
    return e.which > 0;
  }
};

module.exports = bindEvents = function(lc, canvas, panWithKeyboard) {
  var listener, mouseMoveListener, mouseUpListener, touchEndListener, touchMoveListener, unsubs;
  if (panWithKeyboard == null) {
    panWithKeyboard = false;
  }
  unsubs = [];
  mouseMoveListener = (function(_this) {
    return function(e) {
      var p;
      e.preventDefault();
      p = position(canvas, e);
      return lc.pointerMove(p.left, p.top);
    };
  })(this);
  mouseUpListener = (function(_this) {
    return function(e) {
      var p;
      e.preventDefault();
      canvas.onselectstart = function() {
        return true;
      };
      p = position(canvas, e);
      lc.pointerUp(p.left, p.top);
      document.removeEventListener('mousemove', mouseMoveListener);
      document.removeEventListener('mouseup', mouseUpListener);
      return canvas.addEventListener('mousemove', mouseMoveListener);
    };
  })(this);
  canvas.addEventListener('mousedown', (function(_this) {
    return function(e) {
      var down, p;
      if (e.target.tagName.toLowerCase() !== 'canvas') {
        return;
      }
      down = true;
      e.preventDefault();
      canvas.onselectstart = function() {
        return false;
      };
      p = position(canvas, e);
      lc.pointerDown(p.left, p.top);
      canvas.removeEventListener('mousemove', mouseMoveListener);
      document.addEventListener('mousemove', mouseMoveListener);
      return document.addEventListener('mouseup', mouseUpListener);
    };
  })(this));
  touchMoveListener = function(e) {
    e.preventDefault();
    return lc.pointerMove.apply(lc, coordsForTouchEvent(canvas, e));
  };
  touchEndListener = function(e) {
    e.preventDefault();
    lc.pointerUp.apply(lc, coordsForTouchEvent(canvas, e));
    document.removeEventListener('touchmove', touchMoveListener);
    document.removeEventListener('touchend', touchEndListener);
    return document.removeEventListener('touchcancel', touchEndListener);
  };
  canvas.addEventListener('touchstart', function(e) {
    if (e.target.tagName.toLowerCase() !== 'canvas') {
      return;
    }
    e.preventDefault();
    if (e.touches.length === 1) {
      lc.pointerDown.apply(lc, coordsForTouchEvent(canvas, e));
      document.addEventListener('touchmove', touchMoveListener);
      document.addEventListener('touchend', touchEndListener);
      return document.addEventListener('touchcancel', touchEndListener);
    } else {
      return lc.pointerMove.apply(lc, coordsForTouchEvent(canvas, e));
    }
  });
  if (panWithKeyboard) {
    console.warn("Keyboard panning is deprecated.");
    listener = function(e) {
      switch (e.keyCode) {
        case 37:
          lc.pan(-10, 0);
          break;
        case 38:
          lc.pan(0, -10);
          break;
        case 39:
          lc.pan(10, 0);
          break;
        case 40:
          lc.pan(0, 10);
      }
      return lc.repaintAllLayers();
    };
    document.addEventListener('keydown', listener);
    unsubs.push(function() {
      return document.removeEventListener(listener);
    });
  }
  canvas.addEventListener('mousemove', mouseMoveListener);
  return function() {
    var f, i, len, results;
    results = [];
    for (i = 0, len = unsubs.length; i < len; i++) {
      f = unsubs[i];
      results.push(f());
    }
    return results;
  };
};


},{}],9:[function(require,module,exports){
var _drawRawLinePath, defineCanvasRenderer, drawErasedEllipse, drawErasedEllipseLatest, drawErasedLinePath, drawErasedLinePathLatest, drawErasedRect, drawErasedRectLatest, drawImage, drawImageLatest, drawLinePath, drawLinePathLatest, lineEndCapShapes, noop, renderShapeToCanvas, renderShapeToContext, renderers;

lineEndCapShapes = require('./lineEndCapShapes');

renderers = {};

defineCanvasRenderer = function(shapeName, drawFunc, drawLatestFunc) {
  return renderers[shapeName] = {
    drawFunc: drawFunc,
    drawLatestFunc: drawLatestFunc
  };
};

noop = function() {};

renderShapeToContext = function(ctx, shape, opts) {
  var bufferCtx;
  if (opts == null) {
    opts = {};
  }
  if (opts.shouldIgnoreUnsupportedShapes == null) {
    opts.shouldIgnoreUnsupportedShapes = false;
  }
  if (opts.retryCallback == null) {
    opts.retryCallback = noop;
  }
  if (opts.shouldOnlyDrawLatest == null) {
    opts.shouldOnlyDrawLatest = false;
  }
  if (opts.bufferCtx == null) {
    opts.bufferCtx = null;
  }
  bufferCtx = opts.bufferCtx;
  if (renderers[shape.className]) {
    if (opts.shouldOnlyDrawLatest && renderers[shape.className].drawLatestFunc) {
      return renderers[shape.className].drawLatestFunc(ctx, bufferCtx, shape, opts.retryCallback);
    } else {
      return renderers[shape.className].drawFunc(ctx, shape, opts.retryCallback);
    }
  } else if (opts.shouldIgnoreUnsupportedShapes) {
    return console.warn("Can't render shape of type " + shape.className + " to canvas");
  } else {
    throw "Can't render shape of type " + shape.className + " to canvas";
  }
};

renderShapeToCanvas = function(canvas, shape, opts) {
  return renderShapeToContext(canvas.getContext('2d'), shape, opts);
};

defineCanvasRenderer('Rectangle', function(ctx, shape) {
  var x, y;
  x = shape.x;
  y = shape.y;
  if (shape.strokeWidth % 2 !== 0) {
    x += 0.5;
    y += 0.5;
  }
  if (shape.fillPattern) {
    ctx.fillStyle = ctx.createPattern(shape.fillPattern, "repeat");
  } else {
    ctx.fillStyle = shape.fillColor;
  }
  ctx.fillRect(x, y, shape.width, shape.height);
  ctx.lineWidth = shape.strokeWidth;
  ctx.strokeStyle = shape.strokeColor;
  if (shape.dash) {
    ctx.setLineDash(shape.dash);
  }
  return ctx.strokeRect(x, y, shape.width, shape.height);
});

defineCanvasRenderer('Ellipse', function(ctx, shape) {
  var centerX, centerY, halfHeight, halfWidth;
  ctx.save();
  halfWidth = Math.floor(shape.width / 2);
  halfHeight = Math.floor(shape.height / 2);
  centerX = shape.x + halfWidth;
  centerY = shape.y + halfHeight;
  ctx.translate(centerX, centerY);
  ctx.scale(1, Math.abs(shape.height / shape.width));
  ctx.beginPath();
  ctx.arc(0, 0, Math.abs(halfWidth), 0, Math.PI * 2);
  ctx.closePath();
  ctx.restore();
  ctx.fillStyle = shape.fillColor;
  ctx.fill();
  ctx.lineWidth = shape.strokeWidth;
  ctx.strokeStyle = shape.strokeColor;
  return ctx.stroke();
});

drawErasedEllipse = function(ctx, shape) {
  var centerX, centerY, halfWidth;
  ctx.save();
  ctx.globalCompositeOperation = "destination-out";
  halfWidth = Math.floor(shape.width / 2);
  centerX = shape.x + halfWidth;
  centerY = shape.y + halfWidth;
  ctx.translate(centerX, centerY);
  ctx.beginPath();
  ctx.arc(0, 0, Math.abs(halfWidth), 0, Math.PI * 2);
  ctx.fillStyle = shape.fillColor;
  ctx.fill();
  return ctx.restore();
};

drawErasedEllipseLatest = function(ctx, bufferCtx, shape) {
  ctx.save();
  ctx.globalCompositeOperation = "destination-out";
  bufferCtx.save();
  bufferCtx.globalCompositeOperation = "destination-out";
  ctx.restore();
  return bufferCtx.restore();
};

defineCanvasRenderer('ErasedEllipse', drawErasedEllipse, drawErasedEllipseLatest);

defineCanvasRenderer('SelectionBox', (function() {
  var _drawHandle;
  _drawHandle = function(ctx, arg, handleSize, shape) {
    var x, y;
    x = arg.x, y = arg.y;
    if (handleSize === 0) {
      return;
    }
    x -= shape.shape.x;
    y -= shape.shape.y;
    if (shape.isMask) {
      ctx.fillStyle = '#000002';
    } else {
      ctx.strokeStyle = '#000';
      ctx.strokeRect(x, y, handleSize, handleSize);
      ctx.fillStyle = '#fff';
    }
    return ctx.fillRect(x, y, handleSize, handleSize);
  };
  return function(ctx, shape) {
    var handleSize;
    ctx.translate(shape.shape.x, shape.shape.y);
    if (shape.shape.rotate) {
      ctx.rotate(shape.shape.rotate * Math.PI / 180);
    }
    handleSize = shape.handleSize;
    _drawHandle(ctx, shape.getTopLeftHandleRect(), handleSize, shape);
    _drawHandle(ctx, shape.getTopRightHandleRect(), handleSize, shape);
    _drawHandle(ctx, shape.getBottomLeftHandleRect(), handleSize, shape);
    _drawHandle(ctx, shape.getBottomRightHandleRect(), handleSize, shape);
    if (shape.isMask) {
      ctx.fillStyle = '#000003';
    } else {
      ctx.strokeStyle = '#000';
      ctx.strokeRect(-5, -shape.shape.height / 2 - 30, handleSize, handleSize);
      ctx.fillStyle = '#fff';
    }
    ctx.fillRect(-5, -shape.shape.height / 2 - 30, handleSize, handleSize);
    if (shape.backgroundColor) {
      ctx.fillStyle = shape.backgroundColor;
      ctx.fillRect(-shape.shape.width / 2 - shape.margin, -shape.shape.height / 2 - shape.margin, shape._br.width + shape.margin * 2, shape._br.height + shape.margin * 2);
    }
    ctx.lineWidth = 1;
    ctx.strokeStyle = '#000';
    ctx.setLineDash([2, 4]);
    ctx.strokeRect(-shape.shape.width / 2 - shape.margin, -shape.shape.height / 2 - shape.margin, shape._br.width + shape.margin * 2, shape._br.height + shape.margin * 2);
    ctx.strokeRect(0, -shape.shape.height / 2, 0, -20);
    return ctx.setLineDash([]);
  };
})());

defineCanvasRenderer('SelectTool', (function() {
  var _drawHandle;
  _drawHandle = function(ctx, arg, handleSize) {
    var x, y;
    x = arg.x, y = arg.y;
    if (handleSize === 0) {
      return;
    }
    ctx.fillStyle = '#fff';
    ctx.fillRect(x, y, handleSize, handleSize);
    ctx.strokeStyle = '#000';
    return ctx.strokeRect(x, y, handleSize, handleSize);
  };
  return function(ctx, shape) {
    _drawHandle(ctx, shape.getTopLeftHandleRect(), shape.handleSize);
    _drawHandle(ctx, shape.getTopRightHandleRect(), shape.handleSize);
    _drawHandle(ctx, shape.getBottomLeftHandleRect(), shape.handleSize);
    _drawHandle(ctx, shape.getBottomRightHandleRect(), shape.handleSize);
    if (shape.backgroundColor) {
      ctx.fillStyle = shape.backgroundColor;
      ctx.fillRect(shape._br.x - shape.margin, shape._br.y - shape.margin, shape._br.width + shape.margin * 2, shape._br.height + shape.margin * 2);
    }
    ctx.lineWidth = 1;
    ctx.strokeStyle = '#000';
    ctx.setLineDash([2, 4]);
    ctx.strokeRect(shape._br.x - shape.margin, shape._br.y - shape.margin, shape._br.width + shape.margin * 2, shape._br.height + shape.margin * 2);
    return ctx.setLineDash([]);
  };
})());

drawImage = function(ctx, shape, retryCallback) {
  var height, scaleX, scaleY, width, x, y;
  if (shape.image.width) {
    ctx.save();
    if (!shape.isLoaded) {
      shape.width = shape.image.width;
      shape.height = shape.image.height;
      shape.isLoaded = true;
    }
    x = shape.x;
    y = shape.y;
    width = shape.width * shape.scale;
    height = shape.height * shape.scale;
    scaleX = 1;
    scaleY = 1;
    if (shape.flipX) {
      scaleX = -1;
    }
    if (shape.flipY) {
      scaleY = -1;
    }
    ctx.translate(Math.round(x - (width / 2)), Math.round(y - (height / 2)));
    ctx.rotate(shape.rotate * Math.PI / 180);
    ctx.scale(scaleX, scaleY);
    ctx.drawImage(shape.image, 0, 0, width, height);
    return ctx.restore();
  } else if (retryCallback) {
    return shape.image.onload = retryCallback;
  }
};

drawImageLatest = function(ctx, bufferCtx, shape) {
  ctx.save();
  ctx.globalCompositeOperation = "destination-out";
  bufferCtx.save();
  bufferCtx.globalCompositeOperation = "destination-out";
  ctx.restore();
  return bufferCtx.restore();
};

defineCanvasRenderer('Image', drawImage, drawImageLatest);

defineCanvasRenderer('Line', function(ctx, shape) {
  var arrowWidth, x1, x2, y1, y2;
  if (shape.x1 === shape.x2 && shape.y1 === shape.y2) {
    return;
  }
  x1 = shape.x1;
  x2 = shape.x2;
  y1 = shape.y1;
  y2 = shape.y2;
  if (shape.strokeWidth % 2 !== 0) {
    x1 += 0.5;
    x2 += 0.5;
    y1 += 0.5;
    y2 += 0.5;
  }
  ctx.save();
  ctx.lineWidth = shape.strokeWidth;
  ctx.strokeStyle = shape.color;
  ctx.lineCap = shape.capStyle;
  if (shape.dash) {
    ctx.setLineDash(shape.dash);
  }
  ctx.beginPath();
  ctx.moveTo(x1, y1);
  ctx.lineTo(x2, y2);
  ctx.stroke();
  if (shape.dash) {
    ctx.setLineDash([]);
  }
  ctx.restore();
  arrowWidth = Math.max(shape.strokeWidth * 2.2, 5);
  if (shape.endCapShapes[0]) {
    lineEndCapShapes[shape.endCapShapes[0]].drawToCanvas(ctx, x1, y1, Math.atan2(y1 - y2, x1 - x2), arrowWidth, shape.color);
  }
  if (shape.endCapShapes[1]) {
    return lineEndCapShapes[shape.endCapShapes[1]].drawToCanvas(ctx, x2, y2, Math.atan2(y2 - y1, x2 - x1), arrowWidth, shape.color);
  }
});

_drawRawLinePath = function(ctx, points, close, lineCap) {
  var i, len, point, ref;
  if (close == null) {
    close = false;
  }
  if (lineCap == null) {
    lineCap = 'round';
  }
  if (!points.length) {
    return;
  }
  ctx.lineCap = lineCap;
  ctx.lineJoin = "round";
  ctx.strokeStyle = points[0].color;
  ctx.lineWidth = points[0].size;
  ctx.beginPath();
  if (points[0].size % 2 === 0) {
    ctx.moveTo(points[0].x, points[0].y);
  } else {
    ctx.moveTo(points[0].x + 0.5, points[0].y + 0.5);
  }
  ref = points.slice(1);
  for (i = 0, len = ref.length; i < len; i++) {
    point = ref[i];
    if (points[0].size % 2 === 0) {
      ctx.lineTo(point.x, point.y);
    } else {
      ctx.lineTo(point.x + 0.5, point.y + 0.5);
    }
  }
  if (close) {
    return ctx.closePath();
  }
};

drawLinePath = function(ctx, shape) {
  _drawRawLinePath(ctx, shape.smoothedPoints);
  return ctx.stroke();
};

drawLinePathLatest = function(ctx, bufferCtx, shape) {
  var drawEnd, drawStart, segmentStart;
  if (shape.tail) {
    segmentStart = shape.smoothedPoints.length - shape.segmentSize * shape.tailSize;
    drawStart = segmentStart < shape.segmentSize * 2 ? 0 : segmentStart;
    drawEnd = segmentStart + shape.segmentSize + 1;
    _drawRawLinePath(bufferCtx, shape.smoothedPoints.slice(drawStart, drawEnd));
    return bufferCtx.stroke();
  } else {
    _drawRawLinePath(bufferCtx, shape.smoothedPoints);
    return bufferCtx.stroke();
  }
};

defineCanvasRenderer('LinePath', drawLinePath, drawLinePathLatest);

drawErasedLinePath = function(ctx, shape) {
  ctx.save();
  ctx.globalCompositeOperation = "destination-out";
  drawLinePath(ctx, shape);
  return ctx.restore();
};

drawErasedLinePathLatest = function(ctx, bufferCtx, shape) {
  ctx.save();
  ctx.globalCompositeOperation = "destination-out";
  bufferCtx.save();
  bufferCtx.globalCompositeOperation = "destination-out";
  drawLinePathLatest(ctx, bufferCtx, shape);
  ctx.restore();
  return bufferCtx.restore();
};

defineCanvasRenderer('ErasedLinePath', drawErasedLinePath, drawErasedLinePathLatest);

drawErasedRect = function(ctx, shape) {
  ctx.save();
  ctx.globalCompositeOperation = "destination-out";
  ctx.fillRect(shape.x, shape.y, shape.width, shape.height);
  return ctx.restore();
};

drawErasedRectLatest = function(ctx, bufferCtx, shape) {
  ctx.save();
  ctx.globalCompositeOperation = "destination-out";
  bufferCtx.save();
  bufferCtx.globalCompositeOperation = "destination-out";
  ctx.restore();
  return bufferCtx.restore();
};

defineCanvasRenderer('ErasedRectangle', drawErasedRect, drawErasedRectLatest);

defineCanvasRenderer('Text', function(ctx, shape) {
  if (!shape.renderer) {
    shape._makeRenderer(ctx);
  }
  return shape.renderer.draw(ctx, shape.x, shape.y, shape.color, shape.bgColor);
});

defineCanvasRenderer('Polygon', function(ctx, shape) {
  ctx.fillStyle = shape.fillColor;
  _drawRawLinePath(ctx, shape.points, shape.isClosed, 'butt');
  ctx.fill();
  return ctx.stroke();
});

module.exports = {
  defineCanvasRenderer: defineCanvasRenderer,
  renderShapeToCanvas: renderShapeToCanvas,
  renderShapeToContext: renderShapeToContext
};


},{"./lineEndCapShapes":12}],10:[function(require,module,exports){
'use strict';

module.exports = {
  imageURLPrefix: 'lib/img',
  primaryColor: '#000000',
  secondaryColor: '#FFFFFF',
  backgroundColor: 'transparent',
  strokeWidths: [1, 2, 5, 10, 20, 30],
  defaultStrokeWidth: 5,
  toolbarPosition: 'top',
  keyboardShortcuts: false,
  imageSize: { width: 'infinite', height: 'infinite' },
  backgroundShapes: [],
  watermarkImage: null,
  watermarkScale: 1,
  zoomMin: 0.2,
  zoomMax: 4.0,
  zoomStep: 0.2,
  snapshot: null,
  onInit: function onInit() {},
  tools: [
  //require('../tools/Pan'),
  require('../tools/SelectShape'), require('../tools/SelectCut'), require('../tools/Pencil'), require('../tools/Line'), require('../tools/Rectangle'), require('../tools/Ellipse'), require('../tools/Text'), require('../tools/Fill'), require('../tools/Eraser'),
  //require('../tools/Coordinate'),
  require('../tools/Magnifier'), require('../tools/Eyedropper')]
};

},{"../tools/Ellipse":54,"../tools/Eraser":55,"../tools/Eyedropper":56,"../tools/Fill":57,"../tools/Line":58,"../tools/Magnifier":59,"../tools/Pencil":61,"../tools/Rectangle":63,"../tools/SelectCut":64,"../tools/SelectShape":65,"../tools/Text":66}],11:[function(require,module,exports){
"use strict";

/**
  This library rewrites the Canvas2D "measureText" function
  so that it returns a more complete metrics object.
  This library is licensed under the MIT (Expat) license,
  the text for which is included below.

** -----------------------------------------------------------------------------

  CHANGELOG:

    2012-01-21 - Whitespace handling added by Joe Turner
                 (https://github.com/oampo)

    2015-06-08 - Various hacks added by Steve Johnson

** -----------------------------------------------------------------------------

  Copyright (C) 2011 by Mike "Pomax" Kamermans

  Permission is hereby granted, free of charge, to any person obtaining a copy
  of this software and associated documentation files (the "Software"), to deal
  in the Software without restriction, including without limitation the rights
  to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
  copies of the Software, and to permit persons to whom the Software is
  furnished to do so, subject to the following conditions:

  The above copyright notice and this permission notice shall be included in
  all copies or substantial portions of the Software.

  THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
  IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
  FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
  AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
  LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
  OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
  THE SOFTWARE.
**/
(function () {
  var NAME = "FontMetrics Library";
  var VERSION = "1-2012.0121.1300";

  // if there is no getComputedStyle, this library won't work.
  if (!document.defaultView.getComputedStyle) {
    throw "ERROR: 'document.defaultView.getComputedStyle' not found. This library only works in browsers that can report computed CSS values.";
  }

  // store the old text metrics function on the Canvas2D prototype
  CanvasRenderingContext2D.prototype.measureTextWidth = CanvasRenderingContext2D.prototype.measureText;

  /**
   *  shortcut function for getting computed CSS values
   */
  var getCSSValue = function getCSSValue(element, property) {
    return document.defaultView.getComputedStyle(element, null).getPropertyValue(property);
  };

  // debug function
  var show = function show(canvas, ctx, xstart, w, h, metrics) {
    document.body.appendChild(canvas);
    ctx.strokeStyle = 'rgba(0, 0, 0, 0.5)';

    ctx.beginPath();
    ctx.moveTo(xstart, 0);
    ctx.lineTo(xstart, h);
    ctx.closePath();
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(xstart + metrics.bounds.maxx, 0);
    ctx.lineTo(xstart + metrics.bounds.maxx, h);
    ctx.closePath();
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(0, h / 2 - metrics.ascent);
    ctx.lineTo(w, h / 2 - metrics.ascent);
    ctx.closePath();
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(0, h / 2 + metrics.descent);
    ctx.lineTo(w, h / 2 + metrics.descent);
    ctx.closePath();
    ctx.stroke();
  };

  /**
   * The new text metrics function
   */
  CanvasRenderingContext2D.prototype.measureText2 = function (textstring, fontSize, fontString) {
    var metrics = this.measureTextWidth(textstring),
        isSpace = !/\S/.test(textstring);
    metrics.fontsize = fontSize;

    // for text lead values, we meaure a multiline text container.
    var leadDiv = document.createElement("div");
    leadDiv.style.position = "absolute";
    leadDiv.style.opacity = 0;
    leadDiv.style.font = fontString;
    leadDiv.innerHTML = textstring + "<br/>" + textstring;
    document.body.appendChild(leadDiv);

    // make some initial guess at the text leading (using the standard TeX ratio)
    metrics.leading = 1.2 * fontSize;

    // then we try to get the real value from the browser
    var leadDivHeight = getCSSValue(leadDiv, "height");
    leadDivHeight = leadDivHeight.replace("px", "");
    if (leadDivHeight >= fontSize * 2) {
      metrics.leading = leadDivHeight / 2 | 0;
    }
    document.body.removeChild(leadDiv);

    // if we're not dealing with white space, we can compute metrics
    if (!isSpace) {
      // Have characters, so measure the text
      var canvas = document.createElement("canvas");
      var padding = 100;
      canvas.width = metrics.width + padding;
      canvas.height = 3 * fontSize;
      canvas.style.opacity = 1;
      canvas.style.font = fontString;
      var ctx = canvas.getContext("2d");
      ctx.font = fontString;

      var w = canvas.width,
          h = canvas.height,
          baseline = h / 2;

      // Set all canvas pixeldata values to 255, with all the content
      // data being 0. This lets us scan for data[i] != 255.
      ctx.fillStyle = "white";
      ctx.fillRect(-1, -1, w + 2, h + 2);
      ctx.fillStyle = "black";
      ctx.fillText(textstring, padding / 2, baseline);
      var pixelData = ctx.getImageData(0, 0, w, h).data;

      // canvas pixel data is w*4 by h*4, because R, G, B and A are separate,
      // consecutive values in the array, rather than stored as 32 bit ints.
      var i = 0,
          w4 = w * 4,
          len = pixelData.length;

      // Finding the ascent uses a normal, forward scanline
      while (++i < len && pixelData[i] === 255) {}
      var ascent = i / w4 | 0;

      // Finding the descent uses a reverse scanline
      i = len - 1;
      while (--i > 0 && pixelData[i] === 255) {}
      var descent = i / w4 | 0;

      // find the min-x coordinate
      var j = 0;
      for (i = 0; i < len && j < len && pixelData[i] === 255; j++) {
        i += w4;
        if (i >= len) {
          i = i - len + 4;
        }
      }
      var minx = i % w4 / 4 | 0;

      // find the max-x coordinate
      var step = 1;
      for (i = len - 3; i >= 0 && pixelData[i] === 255;) {
        i -= w4;
        if (i < 0) {
          i = len - 3 - step++ * 4;
        }
      }
      var maxx = i % w4 / 4 + 1 | 0;

      // set font metrics
      metrics.ascent = baseline - ascent;
      metrics.descent = descent - baseline;
      metrics.bounds = { minx: minx - padding / 2,
        maxx: maxx - padding / 2,
        miny: 0,
        maxy: descent - ascent };
      metrics.height = 1 + (descent - ascent);
    }

    // if we ARE dealing with whitespace, most values will just be zero.
    else {
        // Only whitespace, so we can't measure the text
        metrics.ascent = 0;
        metrics.descent = 0;
        metrics.bounds = { minx: 0,
          maxx: metrics.width, // Best guess
          miny: 0,
          maxy: 0 };
        metrics.height = 0;
      }
    return metrics;
  };
})();

},{}],12:[function(require,module,exports){
module.exports = {
  arrow: (function() {
    var getPoints;
    getPoints = function(x, y, angle, width, length) {
      return [
        {
          x: x + Math.cos(angle + Math.PI / 2) * width / 2,
          y: y + Math.sin(angle + Math.PI / 2) * width / 2
        }, {
          x: x + Math.cos(angle) * length,
          y: y + Math.sin(angle) * length
        }, {
          x: x + Math.cos(angle - Math.PI / 2) * width / 2,
          y: y + Math.sin(angle - Math.PI / 2) * width / 2
        }
      ];
    };
    return {
      drawToCanvas: function(ctx, x, y, angle, width, color, length) {
        var points;
        if (length == null) {
          length = 0;
        }
        length = length || width;
        ctx.fillStyle = color;
        ctx.lineWidth = 0;
        ctx.strokeStyle = 'transparent';
        ctx.beginPath();
        points = getPoints(x, y, angle, width, length);
        ctx.moveTo(points[0].x, points[0].y);
        ctx.lineTo(points[1].x, points[1].y);
        ctx.lineTo(points[2].x, points[2].y);
        return ctx.fill();
      },
      svg: function(x, y, angle, width, color, length) {
        var points;
        if (length == null) {
          length = 0;
        }
        length = length || width;
        points = getPoints(x, y, angle, width, length);
        return "<polygon fill='" + color + "' stroke='none' points='" + (points.map(function(p) {
          return p.x + "," + p.y;
        })) + "' />";
      }
    };
  })()
};


},{}],13:[function(require,module,exports){
var _, localize, strings;

strings = {};

localize = function(localStrings) {
  return strings = localStrings;
};

_ = function(string) {
  var translation;
  translation = strings[string];
  return translation || string;
};

module.exports = {
  localize: localize,
  _: _
};


},{}],14:[function(require,module,exports){
var Point, _slope, math, normals, unit, util;

Point = require('./shapes').Point;

util = require('./util');

math = {};

math.toPoly = function(line) {
  var i, index, len, n, point, polyLeft, polyRight;
  polyLeft = [];
  polyRight = [];
  index = 0;
  for (i = 0, len = line.length; i < len; i++) {
    point = line[i];
    n = normals(point, _slope(line, index));
    polyLeft = polyLeft.concat([n[0]]);
    polyRight = [n[1]].concat(polyRight);
    index += 1;
  }
  return polyLeft.concat(polyRight);
};

_slope = function(line, index) {
  var point;
  if (line.length < 3) {
    point = {
      x: 0,
      y: 0
    };
  }
  if (index === 0) {
    point = _slope(line, index + 1);
  } else if (index === line.length - 1) {
    point = _slope(line, index - 1);
  } else {
    point = math.diff(line[index - 1], line[index + 1]);
  }
  return point;
};

math.diff = function(a, b) {
  return {
    x: b.x - a.x,
    y: b.y - a.y
  };
};

unit = function(vector) {
  var length;
  length = math.len(vector);
  return {
    x: vector.x / length,
    y: vector.y / length
  };
};

normals = function(p, slope) {
  slope = unit(slope);
  slope.x = slope.x * p.size / 2;
  slope.y = slope.y * p.size / 2;
  return [
    {
      x: p.x - slope.y,
      y: p.y + slope.x,
      color: p.color
    }, {
      x: p.x + slope.y,
      y: p.y - slope.x,
      color: p.color
    }
  ];
};

math.len = function(vector) {
  return Math.sqrt(Math.pow(vector.x, 2) + Math.pow(vector.y, 2));
};

math.scalePositionScalar = function(val, viewportSize, oldScale, newScale) {
  var newSize, oldSize;
  oldSize = viewportSize * oldScale;
  newSize = viewportSize * newScale;
  return val + (oldSize - newSize) / 2;
};

module.exports = math;


},{"./shapes":17,"./util":19}],15:[function(require,module,exports){
var INFINITE, JSONToShape, renderWatermark, util;

util = require('./util');

JSONToShape = require('./shapes').JSONToShape;

INFINITE = 'infinite';

renderWatermark = function(ctx, image, scale) {
  if (!image.width) {
    return;
  }
  ctx.save();
  ctx.translate(ctx.canvas.width / 2, ctx.canvas.height / 2);
  ctx.scale(scale, scale);
  ctx.drawImage(image, -image.width / 2, -image.height / 2);
  return ctx.restore();
};

module.exports = function(snapshot, opts) {
  var allShapes, backgroundShapes, colors, imageSize, s, shapes, watermarkCanvas, watermarkCtx;
  if (opts == null) {
    opts = {};
  }
  if (opts.scale == null) {
    opts.scale = 1;
  }
  shapes = (function() {
    var i, len, ref, results;
    ref = snapshot.shapes;
    results = [];
    for (i = 0, len = ref.length; i < len; i++) {
      s = ref[i];
      results.push(JSONToShape(s));
    }
    return results;
  })();
  backgroundShapes = [];
  if (opts.includeBackground && snapshot.backgroundShapes) {
    backgroundShapes = (function() {
      var i, len, ref, results;
      ref = snapshot.backgroundShapes;
      results = [];
      for (i = 0, len = ref.length; i < len; i++) {
        s = ref[i];
        results.push(JSONToShape(s));
      }
      return results;
    })();
  }
  if (opts.margin == null) {
    opts.margin = {
      top: 0,
      right: 0,
      bottom: 0,
      left: 0
    };
  }
  imageSize = snapshot.imageSize || {
    width: INFINITE,
    height: INFINITE
  };
  colors = snapshot.colors || {
    background: 'transparent'
  };
  allShapes = shapes.concat(backgroundShapes);
  watermarkCanvas = document.createElement('canvas');
  watermarkCtx = watermarkCanvas.getContext('2d');
  if (opts.rect) {
    opts.rect.x -= opts.margin.left;
    opts.rect.y -= opts.margin.top;
    opts.rect.width += opts.margin.left + opts.margin.right;
    opts.rect.height += opts.margin.top + opts.margin.bottom;
  } else {
    opts.rect = util.getDefaultImageRect((function() {
      var i, len, results;
      results = [];
      for (i = 0, len = allShapes.length; i < len; i++) {
        s = allShapes[i];
        results.push(s.getBoundingRect(watermarkCtx));
      }
      return results;
    })(), imageSize, opts.margin);
  }
  watermarkCanvas.width = opts.rect.width * opts.scale;
  watermarkCanvas.height = opts.rect.height * opts.scale;
  watermarkCtx.fillStyle = colors.background;
  watermarkCtx.fillRect(0, 0, watermarkCanvas.width, watermarkCanvas.height);
  if (!(opts.rect.width && opts.rect.height)) {
    return null;
  }
  if (opts.watermarkImage) {
    renderWatermark(watermarkCtx, opts.watermarkImage, opts.watermarkScale);
  }
  return util.combineCanvases(watermarkCanvas, util.renderShapes(backgroundShapes, opts.rect, opts.scale), util.renderShapes(shapes, opts.rect, opts.scale));
};


},{"./shapes":17,"./util":19}],16:[function(require,module,exports){
var INFINITE, JSONToShape, util;

util = require('./util');

JSONToShape = require('./shapes').JSONToShape;

INFINITE = 'infinite';

module.exports = function(snapshot, opts) {
  var allShapes, backgroundShapes, colors, ctx, dummyCanvas, imageSize, s, shapes;
  if (opts == null) {
    opts = {};
  }
  shapes = (function() {
    var i, len, ref, results;
    ref = snapshot.shapes;
    results = [];
    for (i = 0, len = ref.length; i < len; i++) {
      s = ref[i];
      results.push(JSONToShape(s));
    }
    return results;
  })();
  backgroundShapes = [];
  if (snapshot.backgroundShapes) {
    backgroundShapes = (function() {
      var i, len, ref, results;
      ref = snapshot.backgroundShapes;
      results = [];
      for (i = 0, len = ref.length; i < len; i++) {
        s = ref[i];
        results.push(JSONToShape(s));
      }
      return results;
    })();
  }
  if (opts.margin == null) {
    opts.margin = {
      top: 0,
      right: 0,
      bottom: 0,
      left: 0
    };
  }
  imageSize = snapshot.imageSize || {
    width: INFINITE,
    height: INFINITE
  };
  colors = snapshot.colors || {
    background: 'transparent'
  };
  allShapes = shapes.concat(backgroundShapes);
  dummyCanvas = document.createElement('canvas');
  ctx = dummyCanvas.getContext('2d');
  if (opts.rect) {
    opts.rect.x -= opts.margin.left;
    opts.rect.y -= opts.margin.top;
    opts.rect.width += opts.margin.left + opts.margin.right;
    opts.rect.height += opts.margin.top + opts.margin.bottom;
  } else {
    opts.rect = util.getDefaultImageRect((function() {
      var i, len, results;
      results = [];
      for (i = 0, len = allShapes.length; i < len; i++) {
        s = allShapes[i];
        results.push(s.getBoundingRect(ctx));
      }
      return results;
    })(), imageSize, opts.margin);
  }
  return LC.renderShapesToSVG(backgroundShapes.concat(shapes), opts.rect, colors.background);
};


},{"./shapes":17,"./util":19}],17:[function(require,module,exports){
var JSONToShape, LinePath, TextRenderer, _createLinePathFromData, _doAllPointsShareStyle, _dual, _mid, _refine, bspline, createShape, defineCanvasRenderer, defineSVGRenderer, defineShape, lineEndCapShapes, linePathFuncs, rectangleFuncs, ref, ref1, renderShapeToContext, renderShapeToSVG, shapeToJSON, shapes, util;

util = require('./util');

TextRenderer = require('./TextRenderer');

lineEndCapShapes = require('./lineEndCapShapes');

ref = require('./canvasRenderer'), defineCanvasRenderer = ref.defineCanvasRenderer, renderShapeToContext = ref.renderShapeToContext;

ref1 = require('./svgRenderer'), defineSVGRenderer = ref1.defineSVGRenderer, renderShapeToSVG = ref1.renderShapeToSVG;

shapes = {};

defineShape = function(name, props) {
  var Shape, drawFunc, drawLatestFunc, k, legacyDrawFunc, legacyDrawLatestFunc, legacySVGFunc, svgFunc;
  Shape = function(a, b, c, d, e, f, g, h, i, j, k, l, m, n, o, p) {
    props.constructor.call(this, a, b, c, d, e, f, g, h, i, j, k, l, m, n, o, p);
    return this;
  };
  Shape.prototype.className = name;
  Shape.fromJSON = props.fromJSON;
  if (props.draw) {
    legacyDrawFunc = props.draw;
    legacyDrawLatestFunc = props.draw || function(ctx, bufferCtx, retryCallback) {
      return this.draw(ctx, bufferCtx, retryCallback);
    };
    drawFunc = function(ctx, shape, retryCallback) {
      return legacyDrawFunc.call(shape, ctx, retryCallback);
    };
    drawLatestFunc = function(ctx, bufferCtx, shape, retryCallback) {
      return legacyDrawLatestFunc.call(shape, ctx, bufferCtx, retryCallback);
    };
    delete props.draw;
    if (props.drawLatest) {
      delete props.drawLatest;
    }
    defineCanvasRenderer(name, drawFunc, drawLatestFunc);
  }
  if (props.toSVG) {
    legacySVGFunc = props.toSVG;
    svgFunc = function(shape) {
      return legacySVGFunc.call(shape);
    };
    delete props.toSVG;
    defineSVGRenderer(name, svgFunc);
  }
  Shape.prototype.draw = function(ctx, retryCallback) {
    return renderShapeToContext(ctx, this, {
      retryCallback: retryCallback
    });
  };
  Shape.prototype.drawLatest = function(ctx, bufferCtx, retryCallback) {
    return renderShapeToContext(ctx, this, {
      retryCallback: retryCallback,
      bufferCtx: bufferCtx,
      shouldOnlyDrawLatest: true
    });
  };
  Shape.prototype.toSVG = function() {
    return renderShapeToSVG(this);
  };
  for (k in props) {
    if (k !== 'fromJSON') {
      Shape.prototype[k] = props[k];
    }
  }
  shapes[name] = Shape;
  return Shape;
};

createShape = function(name, a, b, c, d, e, f, g, h, i, j, k, l, m, n, o, p) {
  var s;
  s = new shapes[name](a, b, c, d, e, f, g, h, i, j, k, l, m, n, o, p);
  s.id = util.getGUID();
  return s;
};

JSONToShape = function(arg) {
  var className, data, id, shape;
  className = arg.className, data = arg.data, id = arg.id;
  if (className in shapes) {
    shape = shapes[className].fromJSON(data);
    if (shape) {
      if (id) {
        shape.id = id;
      }
      return shape;
    } else {
      console.log('Unreadable shape:', className, data);
      return null;
    }
  } else {
    console.log("Unknown shape:", className, data);
    return null;
  }
};

shapeToJSON = function(shape) {
  return {
    className: shape.className,
    data: shape.toJSON(),
    id: shape.id
  };
};

bspline = function(points, order) {
  if (!order) {
    return points;
  }
  return bspline(_dual(_dual(_refine(points))), order - 1);
};

_refine = function(points) {
  var index, len, point, q, refined;
  points = [points[0]].concat(points).concat(util.last(points));
  refined = [];
  index = 0;
  for (q = 0, len = points.length; q < len; q++) {
    point = points[q];
    refined[index * 2] = point;
    if (points[index + 1]) {
      refined[index * 2 + 1] = _mid(point, points[index + 1]);
    }
    index += 1;
  }
  return refined;
};

_dual = function(points) {
  var dualed, index, len, point, q;
  dualed = [];
  index = 0;
  for (q = 0, len = points.length; q < len; q++) {
    point = points[q];
    if (points[index + 1]) {
      dualed[index] = _mid(point, points[index + 1]);
    }
    index += 1;
  }
  return dualed;
};

_mid = function(a, b) {
  return createShape('Point', {
    x: a.x + ((b.x - a.x) / 2),
    y: a.y + ((b.y - a.y) / 2),
    size: a.size + ((b.size - a.size) / 2),
    color: a.color
  });
};

defineShape('Image', {
  constructor: function(args) {
    if (args == null) {
      args = {};
    }
    this.x = args.x || 0;
    this.y = args.y || 0;
    this.scale = args.scale || 1;
    this.image = args.image || null;
    this.width = args.width || this.image.width;
    this.height = args.height || this.image.height;
    this.flipX = args.flipX || false;
    this.flipY = args.flipY || false;
    this.isLoaded = !(this.image.width === 0);
    return this.rotate = args.rotate || 0;
  },
  getBoundingRect: function() {
    var height, width;
    width = this.width * this.scale;
    height = this.height * this.scale;
    return {
      x: this.x - width / 2,
      y: this.y - height / 2,
      width: width,
      height: height
    };
  },
  toJSON: function() {
    return {
      x: this.x,
      y: this.y,
      imageSrc: this.image.src,
      imageObject: this.image,
      scale: this.scale,
      flipX: this.flipX,
      flipY: this.flipY,
      width: this.width,
      height: this.height,
      rotate: this.rotate
    };
  },
  fromJSON: function(data) {
    var img, ref2;
    img = null;
    if ((ref2 = data.imageObject) != null ? ref2.width : void 0) {
      img = data.imageObject;
    } else {
      img = new Image();
      img.src = data.imageSrc;
    }
    return createShape('Image', {
      x: data.x,
      y: data.y,
      image: img,
      scale: data.scale,
      flipX: data.flipX,
      flipY: data.flipY,
      width: data.width,
      height: data.height,
      rotate: data.rotate
    });
  },
  move: function(moveInfo) {
    if (moveInfo == null) {
      moveInfo = {};
    }
    this.x = this.x - moveInfo.xDiff;
    return this.y = this.y - moveInfo.yDiff;
  },
  setUpperLeft: function(upperLeft) {
    if (upperLeft == null) {
      upperLeft = {};
    }
    this.x = upperLeft.x;
    return this.y = upperLeft.y;
  },
  setSize: function(forcedWidth, forcedHeight) {
    this.width = Math.max(forcedWidth, 0);
    return this.height = Math.max(forcedHeight, 0);
  },
  setPosition: function(x, y) {
    this.x = x;
    return this.y = y;
  }
});

rectangleFuncs = {
  constructor: function(args) {
    if (args == null) {
      args = {};
    }
    this.x = args.x || 0;
    this.y = args.y || 0;
    this.width = args.width || 0;
    this.height = args.height || 0;
    this.strokeWidth = args.strokeWidth || 0;
    this.strokeColor = args.strokeColor || 'black';
    this.fillColor = args.fillColor || 'transparent';
    this.fillPattern = args.fillPattern || null;
    return this.dash = args.dash || null;
  },
  getBoundingRect: function() {
    return {
      x: this.x - this.strokeWidth / 2,
      y: this.y - this.strokeWidth / 2,
      width: this.width + this.strokeWidth,
      height: this.height + this.strokeWidth
    };
  },
  toJSON: function() {
    return {
      x: this.x,
      y: this.y,
      width: this.width,
      height: this.height,
      strokeWidth: this.strokeWidth,
      strokeColor: this.strokeColor,
      fillColor: this.fillColor,
      fillPattern: this.fillPattern,
      dash: this.dash
    };
  },
  fromJSON: function(data) {
    return createShape('Rectangle', data);
  },
  move: function(moveInfo) {
    if (moveInfo == null) {
      moveInfo = {};
    }
    this.x = this.x - moveInfo.xDiff;
    return this.y = this.y - moveInfo.yDiff;
  },
  setUpperLeft: function(upperLeft) {
    if (upperLeft == null) {
      upperLeft = {};
    }
    this.x = upperLeft.x;
    return this.y = upperLeft.y;
  }
};

defineShape('Rectangle', rectangleFuncs);

defineShape('Ellipse', {
  constructor: function(args) {
    if (args == null) {
      args = {};
    }
    this.x = args.x || 0;
    this.y = args.y || 0;
    this.width = args.width || 0;
    this.height = args.height || 0;
    this.strokeWidth = args.strokeWidth || 0;
    this.strokeColor = args.strokeColor || 'black';
    return this.fillColor = args.fillColor || 'transparent';
  },
  getBoundingRect: function() {
    return {
      x: this.x - this.strokeWidth / 2,
      y: this.y - this.strokeWidth / 2,
      width: this.width + this.strokeWidth,
      height: this.height + this.strokeWidth
    };
  },
  toJSON: function() {
    return {
      x: this.x,
      y: this.y,
      width: this.width,
      height: this.height,
      strokeWidth: this.strokeWidth,
      strokeColor: this.strokeColor,
      fillColor: this.fillColor
    };
  },
  fromJSON: function(data) {
    return createShape('Ellipse', data);
  },
  move: function(moveInfo) {
    if (moveInfo == null) {
      moveInfo = {};
    }
    this.x = this.x - moveInfo.xDiff;
    return this.y = this.y - moveInfo.yDiff;
  },
  setUpperLeft: function(upperLeft) {
    if (upperLeft == null) {
      upperLeft = {};
    }
    this.x = upperLeft.x;
    return this.y = upperLeft.y;
  }
});

defineShape('ErasedEllipse', {
  constructor: function(args) {
    if (args == null) {
      args = {};
    }
    this.x = args.x || 0;
    this.y = args.y || 0;
    this.width = args.width || 0;
    this.height = args.height || 0;
    this.strokeWidth = args.strokeWidth || 0;
    this.strokeColor = args.strokeColor || 'black';
    return this.fillColor = args.fillColor || 'transparent';
  },
  getBoundingRect: function() {
    return {
      x: this.x - this.strokeWidth / 2,
      y: this.y - this.strokeWidth / 2,
      width: this.width + this.strokeWidth,
      height: this.height + this.strokeWidth
    };
  },
  toJSON: function() {
    return {
      x: this.x,
      y: this.y,
      width: this.width,
      height: this.height,
      strokeWidth: this.strokeWidth,
      strokeColor: this.strokeColor,
      fillColor: this.fillColor
    };
  },
  fromJSON: function(data) {
    return createShape('Ellipse', data);
  },
  move: function(moveInfo) {
    if (moveInfo == null) {
      moveInfo = {};
    }
    this.x = this.x - moveInfo.xDiff;
    return this.y = this.y - moveInfo.yDiff;
  },
  setUpperLeft: function(upperLeft) {
    if (upperLeft == null) {
      upperLeft = {};
    }
    this.x = upperLeft.x;
    return this.y = upperLeft.y;
  }
});

defineShape('Line', {
  constructor: function(args) {
    if (args == null) {
      args = {};
    }
    this.x1 = args.x1 || 0;
    this.y1 = args.y1 || 0;
    this.x2 = args.x2 || 0;
    this.y2 = args.y2 || 0;
    this.strokeWidth = args.strokeWidth || 0;
    this.color = args.color || 'black';
    this.capStyle = args.capStyle || 'round';
    this.endCapShapes = args.endCapShapes || [null, null];
    return this.dash = args.dash || null;
  },
  getBoundingRect: function() {
    return {
      x: Math.min(this.x1, this.x2) - this.strokeWidth / 2,
      y: Math.min(this.y1, this.y2) - this.strokeWidth / 2,
      width: Math.abs(this.x2 - this.x1) + this.strokeWidth / 2,
      height: Math.abs(this.y2 - this.y1) + this.strokeWidth / 2
    };
  },
  toJSON: function() {
    return {
      x1: this.x1,
      y1: this.y1,
      x2: this.x2,
      y2: this.y2,
      strokeWidth: this.strokeWidth,
      color: this.color,
      capStyle: this.capStyle,
      dash: this.dash,
      endCapShapes: this.endCapShapes
    };
  },
  fromJSON: function(data) {
    return createShape('Line', data);
  },
  move: function(moveInfo) {
    if (moveInfo == null) {
      moveInfo = {};
    }
    this.x1 = this.x1 - moveInfo.xDiff;
    this.y1 = this.y1 - moveInfo.yDiff;
    this.x2 = this.x2 - moveInfo.xDiff;
    return this.y2 = this.y2 - moveInfo.yDiff;
  },
  setUpperLeft: function(upperLeft) {
    var br, xDiff, yDiff;
    if (upperLeft == null) {
      upperLeft = {};
    }
    br = this.getBoundingRect();
    xDiff = br.x - upperLeft.x;
    yDiff = br.y - upperLeft.y;
    return this.move({
      xDiff: xDiff,
      yDiff: yDiff
    });
  }
});

_doAllPointsShareStyle = function(points) {
  var color, len, point, q, size;
  if (!points.length) {
    return false;
  }
  size = points[0].size;
  color = points[0].color;
  for (q = 0, len = points.length; q < len; q++) {
    point = points[q];
    if (!(point.size === size && point.color === color)) {
      console.log(size, color, point.size, point.color);
    }
    if (!(point.size === size && point.color === color)) {
      return false;
    }
  }
  return true;
};

_createLinePathFromData = function(shapeName, data) {
  var pointData, points, smoothedPoints, x, y;
  points = null;
  if (data.points) {
    points = (function() {
      var len, q, ref2, results;
      ref2 = data.points;
      results = [];
      for (q = 0, len = ref2.length; q < len; q++) {
        pointData = ref2[q];
        results.push(JSONToShape(pointData));
      }
      return results;
    })();
  } else if (data.pointCoordinatePairs) {
    points = (function() {
      var len, q, ref2, ref3, results;
      ref2 = data.pointCoordinatePairs;
      results = [];
      for (q = 0, len = ref2.length; q < len; q++) {
        ref3 = ref2[q], x = ref3[0], y = ref3[1];
        results.push(JSONToShape({
          className: 'Point',
          data: {
            x: x,
            y: y,
            size: data.pointSize,
            color: data.pointColor,
            smooth: data.smooth
          }
        }));
      }
      return results;
    })();
  }
  smoothedPoints = null;
  if (data.smoothedPointCoordinatePairs) {
    smoothedPoints = (function() {
      var len, q, ref2, ref3, results;
      ref2 = data.smoothedPointCoordinatePairs;
      results = [];
      for (q = 0, len = ref2.length; q < len; q++) {
        ref3 = ref2[q], x = ref3[0], y = ref3[1];
        results.push(JSONToShape({
          className: 'Point',
          data: {
            x: x,
            y: y,
            size: data.pointSize,
            color: data.pointColor,
            smooth: data.smooth
          }
        }));
      }
      return results;
    })();
  }
  if (!points[0]) {
    return null;
  }
  return createShape(shapeName, {
    points: points,
    smoothedPoints: smoothedPoints,
    order: data.order,
    tailSize: data.tailSize,
    smooth: data.smooth
  });
};

linePathFuncs = {
  constructor: function(args) {
    var len, point, points, q, results;
    if (args == null) {
      args = {};
    }
    points = args.points || [];
    this.order = args.order || 3;
    this.tailSize = args.tailSize || 3;
    this.smooth = 'smooth' in args ? args.smooth : true;
    this.segmentSize = Math.pow(2, this.order);
    this.sampleSize = this.tailSize + 1;
    if (args.smoothedPoints) {
      this.points = args.points;
      return this.smoothedPoints = args.smoothedPoints;
    } else {
      this.points = [];
      results = [];
      for (q = 0, len = points.length; q < len; q++) {
        point = points[q];
        results.push(this.addPoint(point));
      }
      return results;
    }
  },
  getBoundingRect: function() {
    return util.getBoundingRect(this.points.map(function(p) {
      return {
        x: p.x - p.size / 2,
        y: p.y - p.size / 2,
        width: p.size,
        height: p.size
      };
    }));
  },
  toJSON: function() {
    var p, point;
    if (_doAllPointsShareStyle(this.points)) {
      return {
        order: this.order,
        tailSize: this.tailSize,
        smooth: this.smooth,
        pointCoordinatePairs: (function() {
          var len, q, ref2, results;
          ref2 = this.points;
          results = [];
          for (q = 0, len = ref2.length; q < len; q++) {
            point = ref2[q];
            results.push([point.x, point.y]);
          }
          return results;
        }).call(this),
        smoothedPointCoordinatePairs: (function() {
          var len, q, ref2, results;
          ref2 = this.smoothedPoints;
          results = [];
          for (q = 0, len = ref2.length; q < len; q++) {
            point = ref2[q];
            results.push([point.x, point.y]);
          }
          return results;
        }).call(this),
        pointSize: this.points[0].size,
        pointColor: this.points[0].color
      };
    } else {
      return {
        order: this.order,
        tailSize: this.tailSize,
        smooth: this.smooth,
        points: (function() {
          var len, q, ref2, results;
          ref2 = this.points;
          results = [];
          for (q = 0, len = ref2.length; q < len; q++) {
            p = ref2[q];
            results.push(shapeToJSON(p));
          }
          return results;
        }).call(this)
      };
    }
  },
  fromJSON: function(data) {
    return _createLinePathFromData('LinePath', data);
  },
  addPoint: function(point) {
    this.points.push(point);
    if (!this.smooth) {
      this.smoothedPoints = this.points;
      return;
    }
    if (!this.smoothedPoints || this.points.length < this.sampleSize) {
      return this.smoothedPoints = bspline(this.points, this.order);
    } else {
      this.tail = util.last(bspline(util.last(this.points, this.sampleSize), this.order), this.segmentSize * this.tailSize);
      return this.smoothedPoints = this.smoothedPoints.slice(0, this.smoothedPoints.length - this.segmentSize * (this.tailSize - 1)).concat(this.tail);
    }
  },
  move: function(moveInfo) {
    var len, pt, pts, q;
    if (moveInfo == null) {
      moveInfo = {};
    }
    if (!this.smooth) {
      pts = this.points;
    } else {
      pts = this.smoothedPoints;
    }
    for (q = 0, len = pts.length; q < len; q++) {
      pt = pts[q];
      pt.move(moveInfo);
    }
    return this.points = this.smoothedPoints;
  },
  setUpperLeft: function(upperLeft) {
    var br, xDiff, yDiff;
    if (upperLeft == null) {
      upperLeft = {};
    }
    br = this.getBoundingRect();
    xDiff = br.x - upperLeft.x;
    yDiff = br.y - upperLeft.y;
    return this.move({
      xDiff: xDiff,
      yDiff: yDiff
    });
  }
};

LinePath = defineShape('LinePath', linePathFuncs);

defineShape('ErasedLinePath', {
  constructor: linePathFuncs.constructor,
  toJSON: linePathFuncs.toJSON,
  addPoint: linePathFuncs.addPoint,
  getBoundingRect: linePathFuncs.getBoundingRect,
  fromJSON: function(data) {
    return _createLinePathFromData('ErasedLinePath', data);
  },
  setUpperLeft: function() {}
});

defineShape('ErasedRectangle', {
  constructor: rectangleFuncs.constructor,
  toJSON: rectangleFuncs.toJSON,
  addPoint: rectangleFuncs.addPoint,
  getBoundingRect: rectangleFuncs.getBoundingRect,
  fromJSON: function(data) {
    return createShape('ErasedRectangle', data);
  },
  setUpperLeft: function() {}
});

defineShape('Point', {
  constructor: function(args) {
    if (args == null) {
      args = {};
    }
    this.x = args.x || 0;
    this.y = args.y || 0;
    this.size = args.size || 0;
    return this.color = args.color || '';
  },
  getBoundingRect: function() {
    return {
      x: this.x - this.size / 2,
      y: this.y - this.size / 2,
      width: this.size,
      height: this.size
    };
  },
  toJSON: function() {
    return {
      x: this.x,
      y: this.y,
      size: this.size,
      color: this.color
    };
  },
  fromJSON: function(data) {
    return createShape('Point', data);
  },
  move: function(moveInfo) {
    if (moveInfo == null) {
      moveInfo = {};
    }
    this.x = this.x - moveInfo.xDiff;
    return this.y = this.y - moveInfo.yDiff;
  },
  setUpperLeft: function(upperLeft) {
    if (upperLeft == null) {
      upperLeft = {};
    }
    this.x = upperLeft.x;
    return this.y = upperLeft.y;
  }
});

defineShape('Polygon', {
  constructor: function(args) {
    var len, point, q, ref2, results;
    if (args == null) {
      args = {};
    }
    this.points = args.points;
    this.fillColor = args.fillColor || 'white';
    this.strokeColor = args.strokeColor || 'black';
    this.strokeWidth = args.strokeWidth;
    this.dash = args.dash || null;
    if (args.isClosed == null) {
      args.isClosed = true;
    }
    this.isClosed = args.isClosed;
    ref2 = this.points;
    results = [];
    for (q = 0, len = ref2.length; q < len; q++) {
      point = ref2[q];
      point.color = this.strokeColor;
      results.push(point.size = this.strokeWidth);
    }
    return results;
  },
  addPoint: function(x, y) {
    return this.points.push(LC.createShape('Point', {
      x: x,
      y: y
    }));
  },
  getBoundingRect: function() {
    return util.getBoundingRect(this.points.map(function(p) {
      return p.getBoundingRect();
    }));
  },
  toJSON: function() {
    return {
      strokeWidth: this.strokeWidth,
      fillColor: this.fillColor,
      strokeColor: this.strokeColor,
      dash: this.dash,
      isClosed: this.isClosed,
      pointCoordinatePairs: this.points.map(function(p) {
        return [p.x, p.y];
      })
    };
  },
  fromJSON: function(data) {
    data.points = data.pointCoordinatePairs.map(function(arg) {
      var x, y;
      x = arg[0], y = arg[1];
      return createShape('Point', {
        x: x,
        y: y,
        size: data.strokeWidth,
        color: data.strokeColor
      });
    });
    return createShape('Polygon', data);
  },
  move: function(moveInfo) {
    var len, pt, q, ref2, results;
    if (moveInfo == null) {
      moveInfo = {};
    }
    ref2 = this.points;
    results = [];
    for (q = 0, len = ref2.length; q < len; q++) {
      pt = ref2[q];
      results.push(pt.move(moveInfo));
    }
    return results;
  },
  setUpperLeft: function(upperLeft) {
    var br, xDiff, yDiff;
    if (upperLeft == null) {
      upperLeft = {};
    }
    br = this.getBoundingRect();
    xDiff = br.x - upperLeft.x;
    yDiff = br.y - upperLeft.y;
    return this.move({
      xDiff: xDiff,
      yDiff: yDiff
    });
  }
});

defineShape('Text', {
  constructor: function(args) {
    if (args == null) {
      args = {};
    }
    this.x = args.x || 0;
    this.y = args.y || 0;
    this.v = args.v || 0;
    this.text = args.text || '';
    this.color = args.color || 'black';
    this.bgColor = args.bgColor || 'transparent';
    this.font = args.font || '18px sans-serif';
    this.forcedWidth = args.forcedWidth || null;
    this.forcedHeight = args.forcedHeight || null;
    return this.rotate = args.rotate || 0;
  },
  _makeRenderer: function(ctx) {
    ctx.lineHeight = 1.2;
    this.renderer = new TextRenderer(ctx, this.text, this.font, this.forcedWidth, this.forcedHeight);
    if (this.v < 1) {
      console.log('repairing baseline');
      this.v = 1;
      this.x -= this.renderer.metrics.bounds.minx;
      return this.y -= this.renderer.metrics.leading - this.renderer.metrics.descent;
    }
  },
  setText: function(text) {
    this.text = text;
    return this.renderer = null;
  },
  setFont: function(font) {
    this.font = font;
    return this.renderer = null;
  },
  setPosition: function(x, y) {
    this.x = x;
    return this.y = y;
  },
  setSize: function(forcedWidth, forcedHeight) {
    this.forcedWidth = Math.max(forcedWidth, 0);
    this.forcedHeight = Math.max(forcedHeight, 0);
    return this.renderer = null;
  },
  enforceMaxBoundingRect: function(lc) {
    var br, dx, lcBoundingRect;
    br = this.getBoundingRect(lc.ctx);
    lcBoundingRect = {
      x: -lc.position.x / lc.scale,
      y: -lc.position.y / lc.scale,
      width: lc.canvas.width / lc.scale,
      height: lc.canvas.height / lc.scale
    };
    if (br.x + br.width > lcBoundingRect.x + lcBoundingRect.width) {
      dx = br.x - lcBoundingRect.x;
      this.forcedWidth = lcBoundingRect.width - dx - 10;
      return this.renderer = null;
    }
  },
  getBoundingRect: function(ctx, isEditing) {
    if (isEditing == null) {
      isEditing = false;
    }
    if (!this.renderer) {
      if (ctx) {
        this._makeRenderer(ctx);
      } else {
        throw "Must pass ctx if text hasn't been rendered yet";
      }
    }
    return {
      x: Math.floor(this.x),
      y: Math.floor(this.y),
      width: Math.ceil(this.renderer.getWidth(true)),
      height: Math.ceil(this.renderer.getHeight())
    };
  },
  toJSON: function() {
    return {
      x: this.x,
      y: this.y,
      text: this.text,
      color: this.color,
      bgColor: this.bgColor,
      font: this.font,
      forcedWidth: this.forcedWidth,
      forcedHeight: this.forcedHeight,
      v: this.v
    };
  },
  fromJSON: function(data) {
    return createShape('Text', data);
  },
  move: function(moveInfo) {
    if (moveInfo == null) {
      moveInfo = {};
    }
    this.x = this.x - moveInfo.xDiff;
    return this.y = this.y - moveInfo.yDiff;
  },
  setUpperLeft: function(upperLeft) {
    if (upperLeft == null) {
      upperLeft = {};
    }
    this.x = upperLeft.x;
    return this.y = upperLeft.y;
  }
});

defineShape('SelectionBox', {
  constructor: function(args) {
    if (args == null) {
      args = {};
    }
    this.shape = args.shape;
    if (args.handleSize != null) {
      this.handleSize = args.handleSize;
    } else {
      this.handleSize = 10;
    }
    this.margin = args.margin || 0;
    this.backgroundColor = args.backgroundColor || null;
    this._br = this.shape.getBoundingRect(args.ctx);
    this.rotate = this.shape.rotate || 0;
    return this.isMask = args.isMask || false;
  },
  toJSON: function() {
    return {
      shape: shapeToJSON(this.shape),
      backgroundColor: this.backgroundColor
    };
  },
  fromJSON: function(arg) {
    var backgroundColor, handleSize, margin, shape;
    shape = arg.shape, handleSize = arg.handleSize, margin = arg.margin, backgroundColor = arg.backgroundColor;
    return createShape('SelectionBox', {
      shape: JSONToShape(shape),
      backgroundColor: backgroundColor
    });
  },
  getTopLeftHandleRect: function() {
    return {
      x: this.shape.x - this.handleSize - this.margin - this.shape.width / 2,
      y: this.shape.y - this.handleSize - this.margin - this.shape.height / 2,
      width: this.handleSize,
      height: this.handleSize
    };
  },
  getBottomLeftHandleRect: function() {
    return {
      x: this.shape.x - this.handleSize - this.margin - this.shape.width / 2,
      y: this.shape.y + this.margin + this.shape.height / 2,
      width: this.handleSize,
      height: this.handleSize
    };
  },
  getTopRightHandleRect: function() {
    return {
      x: this.shape.x + this.margin + this.shape.width / 2,
      y: this.shape.y - this.handleSize - this.margin - this.shape.height / 2,
      width: this.handleSize,
      height: this.handleSize
    };
  },
  getBottomRightHandleRect: function() {
    return {
      x: this.shape.x + this.margin + this.shape.width / 2,
      y: this.shape.y + this.margin + this.shape.height / 2,
      width: this.handleSize,
      height: this.handleSize
    };
  },
  getBoundingRect: function() {
    return {
      x: this.shape.x - this.margin,
      y: this.shape.y - this.margin,
      width: this.shape.width + this.margin * 2,
      height: this.shape.height + this.margin * 2
    };
  }
});

defineShape('SelectTool', {
  constructor: function(args) {
    if (args == null) {
      args = {};
    }
    this.shape = args.shape;
    if (args.handleSize != null) {
      this.handleSize = args.handleSize;
    } else {
      this.handleSize = 10;
    }
    this.margin = args.margin || 0;
    this.backgroundColor = args.backgroundColor || null;
    return this._br = this.shape.getBoundingRect(args.ctx);
  },
  toJSON: function() {
    return {
      shape: shapeToJSON(this.shape),
      backgroundColor: this.backgroundColor
    };
  },
  fromJSON: function(arg) {
    var backgroundColor, handleSize, margin, shape;
    shape = arg.shape, handleSize = arg.handleSize, margin = arg.margin, backgroundColor = arg.backgroundColor;
    return createShape('SelectTool', {
      shape: JSONToShape(shape),
      backgroundColor: backgroundColor
    });
  },
  getTopLeftHandleRect: function() {
    return {
      x: this._br.x - this.handleSize - this.margin,
      y: this._br.y - this.handleSize - this.margin,
      width: this.handleSize,
      height: this.handleSize
    };
  },
  getBottomLeftHandleRect: function() {
    return {
      x: this._br.x - this.handleSize - this.margin,
      y: this._br.y + this._br.height + this.margin,
      width: this.handleSize,
      height: this.handleSize
    };
  },
  getTopRightHandleRect: function() {
    return {
      x: this._br.x + this._br.width + this.margin,
      y: this._br.y - this.handleSize - this.margin,
      width: this.handleSize,
      height: this.handleSize
    };
  },
  getBottomRightHandleRect: function() {
    return {
      x: this._br.x + this._br.width + this.margin,
      y: this._br.y + this._br.height + this.margin,
      width: this.handleSize,
      height: this.handleSize
    };
  },
  getBoundingRect: function() {
    return {
      x: this._br.x - this.margin,
      y: this._br.y - this.margin,
      width: this._br.width + this.margin * 2,
      height: this._br.height + this.margin * 2
    };
  }
});

module.exports = {
  defineShape: defineShape,
  createShape: createShape,
  JSONToShape: JSONToShape,
  shapeToJSON: shapeToJSON
};


},{"./TextRenderer":6,"./canvasRenderer":9,"./lineEndCapShapes":12,"./svgRenderer":18,"./util":19}],18:[function(require,module,exports){
var defineSVGRenderer, lineEndCapShapes, renderShapeToSVG, renderers;

lineEndCapShapes = require('./lineEndCapShapes');

renderers = {};

defineSVGRenderer = function(shapeName, shapeToSVGFunc) {
  return renderers[shapeName] = shapeToSVGFunc;
};

renderShapeToSVG = function(shape, opts) {
  if (opts == null) {
    opts = {};
  }
  if (opts.shouldIgnoreUnsupportedShapes == null) {
    opts.shouldIgnoreUnsupportedShapes = false;
  }
  if (renderers[shape.className]) {
    return renderers[shape.className](shape);
  } else if (opts.shouldIgnoreUnsupportedShapes) {
    console.warn("Can't render shape of type " + shape.className + " to SVG");
    return "";
  } else {
    throw "Can't render shape of type " + shape.className + " to SVG";
  }
};

defineSVGRenderer('Rectangle', function(shape) {
  var height, width, x, x1, x2, y, y1, y2;
  x1 = shape.x;
  y1 = shape.y;
  x2 = shape.x + shape.width;
  y2 = shape.y + shape.height;
  x = Math.min(x1, x2);
  y = Math.min(y1, y2);
  width = Math.max(x1, x2) - x;
  height = Math.max(y1, y2) - y;
  if (shape.strokeWidth % 2 !== 0) {
    x += 0.5;
    y += 0.5;
  }
  return "<rect x='" + x + "' y='" + y + "' width='" + width + "' height='" + height + "' stroke='" + shape.strokeColor + "' fill='" + shape.fillColor + "' stroke-width='" + shape.strokeWidth + "' />";
});

defineSVGRenderer('SelectionBox', function(shape) {
  return "";
});

defineSVGRenderer('Ellipse', function(shape) {
  var centerX, centerY, halfHeight, halfWidth;
  halfWidth = Math.floor(shape.width / 2);
  halfHeight = Math.floor(shape.height / 2);
  centerX = shape.x + halfWidth;
  centerY = shape.y + halfHeight;
  return "<ellipse cx='" + centerX + "' cy='" + centerY + "' rx='" + (Math.abs(halfWidth)) + "' ry='" + (Math.abs(halfHeight)) + "' stroke='" + shape.strokeColor + "' fill='" + shape.fillColor + "' stroke-width='" + shape.strokeWidth + "' />";
});

defineSVGRenderer('Image', function(shape) {
  return "<image x='" + shape.x + "' y='" + shape.y + "' width='" + (shape.image.naturalWidth * shape.scale) + "' height='" + (shape.image.naturalHeight * shape.scale) + "' xlink:href='" + shape.image.src + "' />";
});

defineSVGRenderer('Line', function(shape) {
  var arrowWidth, capString, dashString, x1, x2, y1, y2;
  dashString = shape.dash ? "stroke-dasharray='" + (shape.dash.join(', ')) + "'" : '';
  capString = '';
  arrowWidth = Math.max(shape.strokeWidth * 2.2, 5);
  x1 = shape.x1;
  x2 = shape.x2;
  y1 = shape.y1;
  y2 = shape.y2;
  if (shape.strokeWidth % 2 !== 0) {
    x1 += 0.5;
    x2 += 0.5;
    y1 += 0.5;
    y2 += 0.5;
  }
  if (shape.endCapShapes[0]) {
    capString += lineEndCapShapes[shape.endCapShapes[0]].svg(x1, y1, Math.atan2(y1 - y2, x1 - x2), arrowWidth, shape.color);
  }
  if (shape.endCapShapes[1]) {
    capString += lineEndCapShapes[shape.endCapShapes[1]].svg(x2, y2, Math.atan2(y2 - y1, x2 - x1), arrowWidth, shape.color);
  }
  return "<g> <line x1='" + x1 + "' y1='" + y1 + "' x2='" + x2 + "' y2='" + y2 + "' " + dashString + " stroke-linecap='" + shape.capStyle + "' stroke='" + shape.color + " 'stroke-width='" + shape.strokeWidth + "' /> " + capString + " </g>";
});

defineSVGRenderer('LinePath', function(shape) {
  return "<polyline fill='none' points='" + (shape.smoothedPoints.map(function(p) {
    var offset;
    offset = p.strokeWidth % 2 === 0 ? 0.0 : 0.5;
    return (p.x + offset) + "," + (p.y + offset);
  }).join(' ')) + "' stroke='" + shape.points[0].color + "' stroke-linecap='round' stroke-width='" + shape.points[0].size + "' />";
});

defineSVGRenderer('ErasedLinePath', function(shape) {
  return "";
});

defineSVGRenderer('Polygon', function(shape) {
  if (shape.isClosed) {
    return "<polygon fill='" + shape.fillColor + "' points='" + (shape.points.map(function(p) {
      var offset;
      offset = p.strokeWidth % 2 === 0 ? 0.0 : 0.5;
      return (p.x + offset) + "," + (p.y + offset);
    }).join(' ')) + "' stroke='" + shape.strokeColor + "' stroke-width='" + shape.strokeWidth + "' />";
  } else {
    return "<polyline fill='" + shape.fillColor + "' points='" + (shape.points.map(function(p) {
      var offset;
      offset = p.strokeWidth % 2 === 0 ? 0.0 : 0.5;
      return (p.x + offset) + "," + (p.y + offset);
    }).join(' ')) + "' stroke='none' /> <polyline fill='none' points='" + (shape.points.map(function(p) {
      var offset;
      offset = p.strokeWidth % 2 === 0 ? 0.0 : 0.5;
      return (p.x + offset) + "," + (p.y + offset);
    }).join(' ')) + "' stroke='" + shape.strokeColor + "' stroke-width='" + shape.strokeWidth + "' />";
  }
});

defineSVGRenderer('Text', function(shape) {
  var heightString, textSplitOnLines, widthString;
  widthString = shape.forcedWidth ? "width='" + shape.forcedWidth + "px'" : "";
  heightString = shape.forcedHeight ? "height='" + shape.forcedHeight + "px'" : "";
  textSplitOnLines = shape.text.split(/\r\n|\r|\n/g);
  if (shape.renderer) {
    textSplitOnLines = shape.renderer.lines;
  }
  return "<text x='" + shape.x + "' y='" + shape.y + "' " + widthString + " " + heightString + " fill='" + shape.color + "' style='font: " + shape.font + ";'> " + (textSplitOnLines.map((function(_this) {
    return function(line, i) {
      var dy;
      dy = i === 0 ? 0 : '1.2em';
      return "<tspan x='" + shape.x + "' dy='" + dy + "' alignment-baseline='text-before-edge'> " + line + " </tspan>";
    };
  })(this)).join('')) + " </text>";
});

module.exports = {
  defineSVGRenderer: defineSVGRenderer,
  renderShapeToSVG: renderShapeToSVG
};


},{"./lineEndCapShapes":12}],19:[function(require,module,exports){
var renderShapeToContext, renderShapeToSVG, slice, util,
  slice1 = [].slice;

slice = Array.prototype.slice;

renderShapeToContext = require('./canvasRenderer').renderShapeToContext;

renderShapeToSVG = require('./svgRenderer').renderShapeToSVG;

util = {
  addImageOnload: function(img, fn) {
    var oldOnload;
    oldOnload = img.onload;
    img.onload = function() {
      if (typeof oldOnload === "function") {
        oldOnload();
      }
      return fn();
    };
    return img;
  },
  last: function(array, n) {
    if (n == null) {
      n = null;
    }
    if (n) {
      return slice.call(array, Math.max(array.length - n, 0));
    } else {
      return array[array.length - 1];
    }
  },
  classSet: function(classNameToIsPresent) {
    var classNames, key;
    classNames = [];
    for (key in classNameToIsPresent) {
      if (classNameToIsPresent[key]) {
        classNames.push(key);
      }
    }
    return classNames.join(' ');
  },
  matchElementSize: function(elementToMatch, elementsToResize, scale, callback) {
    var resize;
    if (callback == null) {
      callback = function() {};
    }
    resize = (function(_this) {
      return function() {
        var el, i, len;
        for (i = 0, len = elementsToResize.length; i < len; i++) {
          el = elementsToResize[i];
          el.style.width = elementToMatch.offsetWidth + "px";
          el.style.height = elementToMatch.offsetHeight + "px";
          if (el.width != null) {
            el.setAttribute('width', el.offsetWidth * scale);
            el.setAttribute('height', el.offsetHeight * scale);
          }
        }
        return callback();
      };
    })(this);
    elementToMatch.addEventListener('resize', resize);
    window.addEventListener('resize', resize);
    window.addEventListener('orientationchange', resize);
    resize();
    return resize;
  },
  combineCanvases: function() {
    var c, canvas, canvases, ctx, i, j, len, len1;
    canvases = 1 <= arguments.length ? slice1.call(arguments, 0) : [];
    c = document.createElement('canvas');
    c.width = canvases[0].width;
    c.height = canvases[0].height;
    for (i = 0, len = canvases.length; i < len; i++) {
      canvas = canvases[i];
      c.width = Math.max(canvas.width, c.width);
      c.height = Math.max(canvas.height, c.height);
    }
    ctx = c.getContext('2d');
    for (j = 0, len1 = canvases.length; j < len1; j++) {
      canvas = canvases[j];
      ctx.drawImage(canvas, 0, 0);
    }
    return c;
  },
  renderShapes: function(shapes, bounds, scale, canvas) {
    var ctx, i, len, shape;
    if (scale == null) {
      scale = 1;
    }
    if (canvas == null) {
      canvas = null;
    }
    canvas = canvas || document.createElement('canvas');
    canvas.width = bounds.width * scale;
    canvas.height = bounds.height * scale;
    ctx = canvas.getContext('2d');
    ctx.translate(-bounds.x * scale, -bounds.y * scale);
    ctx.scale(scale, scale);
    for (i = 0, len = shapes.length; i < len; i++) {
      shape = shapes[i];
      renderShapeToContext(ctx, shape);
    }
    return canvas;
  },
  renderShapesToSVG: function(shapes, arg, backgroundColor) {
    var height, width, x, y;
    x = arg.x, y = arg.y, width = arg.width, height = arg.height;
    return ("<svg xmlns='http://www.w3.org/2000/svg' width='" + width + "' height='" + height + "' viewBox='0 0 " + width + " " + height + "'> <rect width='" + width + "' height='" + height + "' x='0' y='0' fill='" + backgroundColor + "' /> <g transform='translate(" + (-x) + ", " + (-y) + ")'> " + (shapes.map(renderShapeToSVG).join('')) + " </g> </svg>").replace(/(\r\n|\n|\r)/gm, "");
  },
  getBoundingRect: function(rects, width, height) {
    var i, len, maxX, maxY, minX, minY, rect;
    if (!rects.length) {
      return {
        x: 0,
        y: 0,
        width: 0 || width,
        height: 0 || height
      };
    }
    minX = rects[0].x;
    minY = rects[0].y;
    maxX = rects[0].x + rects[0].width;
    maxY = rects[0].y + rects[0].height;
    for (i = 0, len = rects.length; i < len; i++) {
      rect = rects[i];
      minX = Math.floor(Math.min(rect.x, minX));
      minY = Math.floor(Math.min(rect.y, minY));
      maxX = Math.ceil(Math.max(maxX, rect.x + rect.width));
      maxY = Math.ceil(Math.max(maxY, rect.y + rect.height));
    }
    minX = width ? 0 : minX;
    minY = height ? 0 : minY;
    maxX = width || maxX;
    maxY = height || maxY;
    return {
      x: minX,
      y: minY,
      width: maxX - minX,
      height: maxY - minY
    };
  },
  getDefaultImageRect: function(shapeBoundingRects, explicitSize, margin) {
    var height, rect, width;
    if (explicitSize == null) {
      explicitSize = {
        width: 0,
        height: 0
      };
    }
    if (margin == null) {
      margin = {
        top: 0,
        right: 0,
        bottom: 0,
        left: 0
      };
    }
    width = explicitSize.width, height = explicitSize.height;
    rect = util.getBoundingRect(shapeBoundingRects, width === 'infinite' ? 0 : width, height === 'infinite' ? 0 : height);
    rect.x -= margin.left;
    rect.y -= margin.top;
    rect.width += margin.left + margin.right;
    rect.height += margin.top + margin.bottom;
    return rect;
  },
  getBackingScale: function(context) {
    if (window.devicePixelRatio == null) {
      return 1;
    }
    if (!(window.devicePixelRatio > 1)) {
      return 1;
    }
    return window.devicePixelRatio;
  },
  requestAnimationFrame: (window.requestAnimationFrame || window.setTimeout).bind(window),
  getGUID: (function() {
    var s4;
    s4 = function() {
      return Math.floor((1 + Math.random()) * 0x10000).toString(16).substring(1);
    };
    return function() {
      return s4() + s4() + '-' + s4() + '-' + s4() + '-' + s4() + '-' + s4() + s4() + s4();
    };
  })(),
  requestAnimationFrame: function(f) {
    if (window.requestAnimationFrame) {
      return window.requestAnimationFrame(f);
    }
    if (window.webkitRequestAnimationFrame) {
      return window.webkitRequestAnimationFrame(f);
    }
    if (window.mozRequestAnimationFrame) {
      return window.mozRequestAnimationFrame(f);
    }
    return setTimeout(f, 0);
  },
  cancelAnimationFrame: function(f) {
    if (window.cancelAnimationFrame) {
      return window.cancelAnimationFrame(f);
    }
    if (window.webkitCancelRequestAnimationFrame) {
      return window.webkitCancelRequestAnimationFrame(f);
    }
    if (window.webkitCancelAnimationFrame) {
      return window.webkitCancelAnimationFrame(f);
    }
    if (window.mozCancelAnimationFrame) {
      return window.mozCancelAnimationFrame(f);
    }
    return clearTimeout(f);
  }
};

module.exports = util;


},{"./canvasRenderer":9,"./svgRenderer":18}],20:[function(require,module,exports){
'use strict';

(function () {
  function CustomEvent(event, params) {
    params = params || { bubbles: false, cancelable: false, detail: undefined };
    var evt = document.createEvent('CustomEvent');
    evt.initCustomEvent(event, params.bubbles, params.cancelable, params.detail);
    return evt;
  };

  CustomEvent.prototype = window.CustomEvent.prototype;

  window.CustomEvent = CustomEvent;
})();

},{}],21:[function(require,module,exports){
"use strict";

var hasWarned = false;
if (!CanvasRenderingContext2D.prototype.setLineDash) {
  CanvasRenderingContext2D.prototype.setLineDash = function () {
    // no-op
    if (!hasWarned) {
      console.warn("context2D.setLineDash is a no-op in this browser.");
      hasWarned = true;
    }
  };
}
module.exports = null;

},{}],22:[function(require,module,exports){
var LiterallyCanvasModel, LiterallyCanvasReactComponent, baseTools, canvasRenderer, conversion, defaultImageURLPrefix, defaultOptions, defaultTools, defineOptionsStyle, init, initReactDOM, initWithoutGUI, localize, registerJQueryPlugin, renderSnapshotToImage, renderSnapshotToSVG, setDefaultImageURLPrefix, shapes, svgRenderer, tools, util;

require('./ie_customevent');

require('./ie_setLineDash');

LiterallyCanvasModel = require('./core/LiterallyCanvas');

defaultOptions = require('./core/defaultOptions');

canvasRenderer = require('./core/canvasRenderer');

svgRenderer = require('./core/svgRenderer');

shapes = require('./core/shapes');

util = require('./core/util');

renderSnapshotToImage = require('./core/renderSnapshotToImage');

renderSnapshotToSVG = require('./core/renderSnapshotToSVG');

localize = require('./core/localization').localize;

LiterallyCanvasReactComponent = require('./reactGUI/LiterallyCanvas');

initReactDOM = require('./reactGUI/initDOM');

require('./optionsStyles/font');

require('./optionsStyles/stroke-width');

require('./optionsStyles/line-options-and-stroke-width');

require('./optionsStyles/polygon-and-stroke-width');

require('./optionsStyles/stroke-and-fill');

require('./optionsStyles/magnify');

require('./optionsStyles/null');

defineOptionsStyle = require('./optionsStyles/optionsStyles').defineOptionsStyle;

conversion = {
  snapshotToShapes: function(snapshot) {
    var i, len, ref, results, shape;
    ref = snapshot.shapes;
    results = [];
    for (i = 0, len = ref.length; i < len; i++) {
      shape = ref[i];
      results.push(shapes.JSONToShape(shape));
    }
    return results;
  },
  snapshotJSONToShapes: function(json) {
    return conversion.snapshotToShapes(JSON.parse(json));
  }
};

baseTools = require('./tools/base');

tools = {
  Pencil: require('./tools/Pencil'),
  Eraser: require('./tools/Eraser'),
  Line: require('./tools/Line'),
  Rectangle: require('./tools/Rectangle'),
  Ellipse: require('./tools/Ellipse'),
  Text: require('./tools/Text'),
  Polygon: require('./tools/Polygon'),
  Pan: require('./tools/Pan'),
  Eyedropper: require('./tools/Eyedropper'),
  SelectShape: require('./tools/SelectShape'),
  SelectCut: require('./tools/SelectCut'),
  Magnifier: require('./tools/Magnifier'),
  Tool: baseTools.Tool,
  ToolWithStroke: baseTools.ToolWithStroke
};

defaultTools = defaultOptions.tools;

defaultImageURLPrefix = defaultOptions.imageURLPrefix;

setDefaultImageURLPrefix = function(newDefault) {
  defaultImageURLPrefix = newDefault;
  return defaultOptions.imageURLPrefix = newDefault;
};

init = function(el, opts) {
  var child, i, len, opt, ref;
  if (opts == null) {
    opts = {};
  }
  for (opt in defaultOptions) {
    if (!(opt in opts)) {
      opts[opt] = defaultOptions[opt];
    }
  }
  ref = el.children;
  for (i = 0, len = ref.length; i < len; i++) {
    child = ref[i];
    el.removeChild(child);
  }
  return require('./reactGUI/initDOM')(el, opts);
};

initWithoutGUI = function(el, opts) {
  var drawingViewElement, lc, originalClassName;
  originalClassName = el.className;
  if ([' ', ' '].join(el.className).indexOf(' literally ') === -1) {
    el.className = el.className + ' literally';
  }
  if (el.className.includes('toolbar-hidden') === false) {
    el.className = el.className + ' toolbar-hidden';
  }
  drawingViewElement = document.createElement('div');
  drawingViewElement.className = 'lc-drawing';
  el.appendChild(drawingViewElement);
  lc = new LiterallyCanvasModel(drawingViewElement, opts);
  lc.teardown = function() {
    var child, i, len, ref;
    lc._teardown();
    ref = el.children;
    for (i = 0, len = ref.length; i < len; i++) {
      child = ref[i];
      el.removeChild(child);
    }
    return el.className = originalClassName;
  };
  if ('onInit' in opts) {
    opts.onInit(lc);
  }
  return lc;
};

registerJQueryPlugin = function(_$) {
  return _$.fn.literallycanvas = function(opts) {
    if (opts == null) {
      opts = {};
    }
    this.each((function(_this) {
      return function(ix, el) {
        return el.literallycanvas = init(el, opts);
      };
    })(this));
    return this;
  };
};

if (typeof window !== 'undefined') {
  window.LC = {
    init: init
  };
  if (window.$) {
    registerJQueryPlugin(window.$);
  }
}

module.exports = {
  init: init,
  registerJQueryPlugin: registerJQueryPlugin,
  util: util,
  tools: tools,
  setDefaultImageURLPrefix: setDefaultImageURLPrefix,
  defaultTools: defaultTools,
  defineOptionsStyle: defineOptionsStyle,
  LiterallyCanvasReactComponent: LiterallyCanvasReactComponent,
  defineShape: shapes.defineShape,
  createShape: shapes.createShape,
  JSONToShape: shapes.JSONToShape,
  shapeToJSON: shapes.shapeToJSON,
  defineCanvasRenderer: canvasRenderer.defineCanvasRenderer,
  renderShapeToContext: canvasRenderer.renderShapeToContext,
  renderShapeToCanvas: canvasRenderer.renderShapeToCanvas,
  renderShapesToCanvas: util.renderShapes,
  defineSVGRenderer: svgRenderer.defineSVGRenderer,
  renderShapeToSVG: svgRenderer.renderShapeToSVG,
  renderShapesToSVG: util.renderShapesToSVG,
  snapshotToShapes: conversion.snapshotToShapes,
  snapshotJSONToShapes: conversion.snapshotJSONToShapes,
  renderSnapshotToImage: renderSnapshotToImage,
  renderSnapshotToSVG: renderSnapshotToSVG,
  localize: localize
};


},{"./core/LiterallyCanvas":5,"./core/canvasRenderer":9,"./core/defaultOptions":10,"./core/localization":13,"./core/renderSnapshotToImage":15,"./core/renderSnapshotToSVG":16,"./core/shapes":17,"./core/svgRenderer":18,"./core/util":19,"./ie_customevent":20,"./ie_setLineDash":21,"./optionsStyles/font":25,"./optionsStyles/line-options-and-stroke-width":26,"./optionsStyles/magnify":27,"./optionsStyles/null":29,"./optionsStyles/optionsStyles":30,"./optionsStyles/polygon-and-stroke-width":31,"./optionsStyles/stroke-and-fill":32,"./optionsStyles/stroke-width":35,"./reactGUI/LiterallyCanvas":39,"./reactGUI/initDOM":53,"./tools/Ellipse":54,"./tools/Eraser":55,"./tools/Eyedropper":56,"./tools/Line":58,"./tools/Magnifier":59,"./tools/Pan":60,"./tools/Pencil":61,"./tools/Polygon":62,"./tools/Rectangle":63,"./tools/SelectCut":64,"./tools/SelectShape":65,"./tools/Text":66,"./tools/base":67}],23:[function(require,module,exports){
'use strict';

var React = require('../reactGUI/React-shim');
var SelectedColorPanel = require('../reactGUI/SelectedColorPanel');
var StrokeThickness = require('../reactGUI/StrokeThickness');

var _require = require('./optionsStyles'),
    defineOptionsStyle = _require.defineOptionsStyle;

defineOptionsStyle('color-palette', React.createClass({
  displayName: 'ColorPalette',

  render: function render() {
    var lc = this.props.lc;

    return React.createElement(
      'div',
      { className: 'strokePalette' },
      React.createElement(SelectedColorPanel, { tool: this.props.tool, imageURLPrefix: this.props.imageURLPrefix,
        fillColor: '#000000', lc: lc, isStroke: false, disableTransparent: true })
    );
  }
}));

module.exports = {};

},{"../reactGUI/React-shim":44,"../reactGUI/SelectedColorPanel":46,"../reactGUI/StrokeThickness":47,"./optionsStyles":30}],24:[function(require,module,exports){
'use strict';

var FontAttributes = require('../reactGUI/FontAttributes');
var SelectedColorPanel = require('../reactGUI/SelectedColorPanel');

var _require = require('./optionsStyles'),
    defineOptionsStyle = _require.defineOptionsStyle;

defineOptionsStyle('font-attributes-color-palette', React.createClass({
  displayName: 'FontAttributesColorPalette',

  render: function render() {
    var lc = this.props.lc;

    return React.createElement(
      'div',
      { className: 'strokePalette' },
      React.createElement(FontAttributes, { lc: lc, tool: this.props.tool }),
      React.createElement(SelectedColorPanel, { tool: this.props.tool, imageURLPrefix: this.props.imageURLPrefix,
        strokeColor: '#000000', fillColor: 'transparent', lc: lc })
    );
  }
}));

module.exports = {};

},{"../reactGUI/FontAttributes":38,"../reactGUI/SelectedColorPanel":46,"./optionsStyles":30}],25:[function(require,module,exports){
var ALL_FONTS, FONT_NAME_TO_VALUE, MONOSPACE_FONTS, OTHER_FONTS, React, SANS_SERIF_FONTS, SERIF_FONTS, _, defineOptionsStyle, i, j, l, len, len1, len2, len3, m, name, ref, ref1, ref2, ref3, value;

React = require('../reactGUI/React-shim');

defineOptionsStyle = require('./optionsStyles').defineOptionsStyle;

_ = require('../core/localization')._;

SANS_SERIF_FONTS = [['Arial', 'Arial,"Helvetica Neue",Helvetica,sans-serif'], ['Arial Black', '"Arial Black","Arial Bold",Gadget,sans-serif'], ['Arial Narrow', '"Arial Narrow",Arial,sans-serif'], ['Gill Sans', '"Gill Sans","Gill Sans MT",Calibri,sans-serif'], ['Helvetica', '"Helvetica Neue",Helvetica,Arial,sans-serif'], ['Impact', 'Impact,Haettenschweiler,"Franklin Gothic Bold",Charcoal,"Helvetica Inserat","Bitstream Vera Sans Bold","Arial Black",sans-serif'], ['Tahoma', 'Tahoma,Verdana,Segoe,sans-serif'], ['Trebuchet MS', '"Trebuchet MS","Lucida Grande","Lucida Sans Unicode","Lucida Sans",Tahoma,sans-serif'], ['Verdana', 'Verdana,Geneva,sans-serif']].map(function(arg) {
  var name, value;
  name = arg[0], value = arg[1];
  return {
    name: _(name),
    value: value
  };
});

SERIF_FONTS = [['Baskerville', 'Baskerville,"Baskerville Old Face","Hoefler Text",Garamond,"Times New Roman",serif'], ['Garamond', 'Garamond,Baskerville,"Baskerville Old Face","Hoefler Text","Times New Roman",serif'], ['Georgia', 'Georgia,Times,"Times New Roman",serif'], ['Hoefler Text', '"Hoefler Text","Baskerville Old Face",Garamond,"Times New Roman",serif'], ['Lucida Bright', '"Lucida Bright",Georgia,serif'], ['Palatino', 'Palatino,"Palatino Linotype","Palatino LT STD","Book Antiqua",Georgia,serif'], ['Times New Roman', 'TimesNewRoman,"Times New Roman",Times,Baskerville,Georgia,serif']].map(function(arg) {
  var name, value;
  name = arg[0], value = arg[1];
  return {
    name: _(name),
    value: value
  };
});

MONOSPACE_FONTS = [['Consolas/Monaco', 'Consolas,monaco,"Lucida Console",monospace'], ['Courier New', '"Courier New",Courier,"Lucida Sans Typewriter","Lucida Typewriter",monospace'], ['Lucida Sans Typewriter', '"Lucida Sans Typewriter","Lucida Console",monaco,"Bitstream Vera Sans Mono",monospace']].map(function(arg) {
  var name, value;
  name = arg[0], value = arg[1];
  return {
    name: _(name),
    value: value
  };
});

OTHER_FONTS = [['Copperplate', 'Copperplate,"Copperplate Gothic Light",fantasy'], ['Papyrus', 'Papyrus,fantasy'], ['Script', '"Brush Script MT",cursive']].map(function(arg) {
  var name, value;
  name = arg[0], value = arg[1];
  return {
    name: _(name),
    value: value
  };
});

ALL_FONTS = [[_('Sans Serif'), SANS_SERIF_FONTS], [_('Serif'), SERIF_FONTS], [_('Monospace'), MONOSPACE_FONTS], [_('Other'), OTHER_FONTS]];

FONT_NAME_TO_VALUE = {};

for (i = 0, len = SANS_SERIF_FONTS.length; i < len; i++) {
  ref = SANS_SERIF_FONTS[i], name = ref.name, value = ref.value;
  FONT_NAME_TO_VALUE[name] = value;
}

for (j = 0, len1 = SERIF_FONTS.length; j < len1; j++) {
  ref1 = SERIF_FONTS[j], name = ref1.name, value = ref1.value;
  FONT_NAME_TO_VALUE[name] = value;
}

for (l = 0, len2 = MONOSPACE_FONTS.length; l < len2; l++) {
  ref2 = MONOSPACE_FONTS[l], name = ref2.name, value = ref2.value;
  FONT_NAME_TO_VALUE[name] = value;
}

for (m = 0, len3 = OTHER_FONTS.length; m < len3; m++) {
  ref3 = OTHER_FONTS[m], name = ref3.name, value = ref3.value;
  FONT_NAME_TO_VALUE[name] = value;
}

defineOptionsStyle('font', React.createClass({
  displayName: 'FontOptions',
  getInitialState: function() {
    return {
      isItalic: false,
      isBold: false,
      fontName: 'Helvetica',
      fontSizeIndex: 4
    };
  },
  getFontSizes: function() {
    return [9, 10, 12, 14, 18, 24, 36, 48, 64, 72, 96, 144, 288];
  },
  updateTool: function(newState) {
    var fontSize, items, k;
    if (newState == null) {
      newState = {};
    }
    for (k in this.state) {
      if (!(k in newState)) {
        newState[k] = this.state[k];
      }
    }
    fontSize = this.getFontSizes()[newState.fontSizeIndex];
    items = [];
    if (newState.isItalic) {
      items.push('italic');
    }
    if (newState.isBold) {
      items.push('bold');
    }
    items.push(fontSize + "px");
    items.push(FONT_NAME_TO_VALUE[newState.fontName]);
    this.props.lc.tool.font = items.join(' ');
    return this.props.lc.trigger('setFont', items.join(' '));
  },
  handleFontSize: function(event) {
    var newState;
    newState = {
      fontSizeIndex: event.target.value
    };
    this.setState(newState);
    return this.updateTool(newState);
  },
  handleFontFamily: function(event) {
    var newState;
    newState = {
      fontName: event.target.selectedOptions[0].innerHTML
    };
    this.setState(newState);
    return this.updateTool(newState);
  },
  handleItalic: function(event) {
    var newState;
    newState = {
      isItalic: !this.state.isItalic
    };
    this.setState(newState);
    return this.updateTool(newState);
  },
  handleBold: function(event) {
    var newState;
    newState = {
      isBold: !this.state.isBold
    };
    this.setState(newState);
    return this.updateTool(newState);
  },
  componentDidMount: function() {
    return this.updateTool();
  },
  render: function() {
    var br, div, input, label, lc, optgroup, option, ref4, select, span;
    lc = this.props.lc;
    ref4 = React.DOM, div = ref4.div, input = ref4.input, select = ref4.select, option = ref4.option, br = ref4.br, label = ref4.label, span = ref4.span, optgroup = ref4.optgroup;
    return div({
      className: 'lc-font-settings'
    }, select({
      value: this.state.fontSizeIndex,
      onChange: this.handleFontSize
    }, this.getFontSizes().map((function(_this) {
      return function(size, ix) {
        return option({
          value: ix,
          key: ix
        }, size + "px");
      };
    })(this))), select({
      value: this.state.fontName,
      onChange: this.handleFontFamily
    }, ALL_FONTS.map((function(_this) {
      return function(arg) {
        var fonts, label;
        label = arg[0], fonts = arg[1];
        return optgroup({
          key: label,
          label: label
        }, fonts.map(function(family, ix) {
          return option({
            value: family.name,
            key: ix
          }, family.name);
        }));
      };
    })(this))), span({}, label({
      htmlFor: 'italic'
    }, _("italic")), input({
      type: 'checkbox',
      id: 'italic',
      checked: this.state.isItalic,
      onChange: this.handleItalic
    })), span({}, label({
      htmlFor: 'bold'
    }, _("bold")), input({
      type: 'checkbox',
      id: 'bold',
      checked: this.state.isBold,
      onChange: this.handleBold
    })));
  }
}));

module.exports = {};


},{"../core/localization":13,"../reactGUI/React-shim":44,"./optionsStyles":30}],26:[function(require,module,exports){
var React, StrokeWidthPicker, classSet, createSetStateOnEventMixin, defineOptionsStyle;

React = require('../reactGUI/React-shim');

defineOptionsStyle = require('./optionsStyles').defineOptionsStyle;

StrokeWidthPicker = React.createFactory(require('../reactGUI/StrokeWidthPicker'));

createSetStateOnEventMixin = require('../reactGUI/createSetStateOnEventMixin');

classSet = require('../core/util').classSet;

defineOptionsStyle('line-options-and-stroke-width', React.createClass({
  displayName: 'LineOptionsAndStrokeWidth',
  getState: function() {
    return {
      strokeWidth: this.props.tool.strokeWidth,
      isDashed: this.props.tool.isDashed,
      hasEndArrow: this.props.tool.hasEndArrow
    };
  },
  getInitialState: function() {
    return this.getState();
  },
  mixins: [createSetStateOnEventMixin('toolChange')],
  render: function() {
    var arrowButtonClass, dashButtonClass, div, img, li, ref, style, toggleIsDashed, togglehasEndArrow, ul;
    ref = React.DOM, div = ref.div, ul = ref.ul, li = ref.li, img = ref.img;
    toggleIsDashed = (function(_this) {
      return function() {
        _this.props.tool.isDashed = !_this.props.tool.isDashed;
        return _this.setState(_this.getState());
      };
    })(this);
    togglehasEndArrow = (function(_this) {
      return function() {
        _this.props.tool.hasEndArrow = !_this.props.tool.hasEndArrow;
        return _this.setState(_this.getState());
      };
    })(this);
    dashButtonClass = classSet({
      'square-toolbar-button': true,
      'selected': this.state.isDashed
    });
    arrowButtonClass = classSet({
      'square-toolbar-button': true,
      'selected': this.state.hasEndArrow
    });
    style = {
      float: 'left',
      margin: 1
    };
    return div({}, div({
      className: dashButtonClass,
      onClick: toggleIsDashed,
      style: style
    }, img({
      src: this.props.imageURLPrefix + "/dashed-line.png"
    })), div({
      className: arrowButtonClass,
      onClick: togglehasEndArrow,
      style: style
    }, img({
      src: this.props.imageURLPrefix + "/line-with-arrow.png"
    })), StrokeWidthPicker({
      tool: this.props.tool,
      lc: this.props.lc
    }));
  }
}));

module.exports = {};


},{"../core/util":19,"../reactGUI/React-shim":44,"../reactGUI/StrokeWidthPicker":48,"../reactGUI/createSetStateOnEventMixin":51,"./optionsStyles":30}],27:[function(require,module,exports){
'use strict';

var React = require('../reactGUI/React-shim');
var MagnifyPanel = require('../reactGUI/MagnifyPanel');

var _require = require('./optionsStyles'),
    defineOptionsStyle = _require.defineOptionsStyle;

defineOptionsStyle('magnify', React.createClass({
  displayName: 'magnify',
  render: function render() {
    var lc = this.props.lc;
    return React.createElement(MagnifyPanel, { lc: lc });
  }
}));

module.exports = {};

},{"../reactGUI/MagnifyPanel":40,"../reactGUI/React-shim":44,"./optionsStyles":30}],28:[function(require,module,exports){
'use strict';

var MoveAttributes = require('../reactGUI/MoveAttributes');

var _require = require('./optionsStyles'),
    defineOptionsStyle = _require.defineOptionsStyle;

defineOptionsStyle('move-attributes', React.createClass({
  displayName: 'MoveAttributes',

  render: function render() {
    var lc = this.props.lc;

    return React.createElement(
      'div',
      null,
      React.createElement(MoveAttributes, { imageURLPrefix: this.props.imageURLPrefix,
        x: '0', y: '0', rotate: '0', lc: lc })
    );
  }
}));

module.exports = {};

},{"../reactGUI/MoveAttributes":41,"./optionsStyles":30}],29:[function(require,module,exports){
var React, defineOptionsStyle;

React = require('../reactGUI/React-shim');

defineOptionsStyle = require('./optionsStyles').defineOptionsStyle;

defineOptionsStyle('null', React.createClass({
  displayName: 'NoOptions',
  render: function() {
    return React.DOM.div();
  }
}));

module.exports = {};


},{"../reactGUI/React-shim":44,"./optionsStyles":30}],30:[function(require,module,exports){
var React, defineOptionsStyle, optionsStyles;

React = require('../reactGUI/React-shim');

optionsStyles = {};

defineOptionsStyle = function(name, style) {
  return optionsStyles[name] = React.createFactory(style);
};

module.exports = {
  optionsStyles: optionsStyles,
  defineOptionsStyle: defineOptionsStyle
};


},{"../reactGUI/React-shim":44}],31:[function(require,module,exports){
var React, StrokeWidthPicker, createSetStateOnEventMixin, defineOptionsStyle;

React = require('../reactGUI/React-shim');

defineOptionsStyle = require('./optionsStyles').defineOptionsStyle;

StrokeWidthPicker = React.createFactory(require('../reactGUI/StrokeWidthPicker'));

createSetStateOnEventMixin = require('../reactGUI/createSetStateOnEventMixin');

defineOptionsStyle('polygon-and-stroke-width', React.createClass({
  displayName: 'PolygonAndStrokeWidth',
  getState: function() {
    return {
      strokeWidth: this.props.tool.strokeWidth,
      inProgress: false
    };
  },
  getInitialState: function() {
    return this.getState();
  },
  mixins: [createSetStateOnEventMixin('toolChange')],
  componentDidMount: function() {
    var hidePolygonTools, showPolygonTools, unsubscribeFuncs;
    unsubscribeFuncs = [];
    this.unsubscribe = (function(_this) {
      return function() {
        var func, i, len, results;
        results = [];
        for (i = 0, len = unsubscribeFuncs.length; i < len; i++) {
          func = unsubscribeFuncs[i];
          results.push(func());
        }
        return results;
      };
    })(this);
    showPolygonTools = (function(_this) {
      return function() {
        if (!_this.state.inProgress) {
          return _this.setState({
            inProgress: true
          });
        }
      };
    })(this);
    hidePolygonTools = (function(_this) {
      return function() {
        return _this.setState({
          inProgress: false
        });
      };
    })(this);
    unsubscribeFuncs.push(this.props.lc.on('lc-polygon-started', showPolygonTools));
    return unsubscribeFuncs.push(this.props.lc.on('lc-polygon-stopped', hidePolygonTools));
  },
  componentWillUnmount: function() {
    return this.unsubscribe();
  },
  render: function() {
    var div, img, lc, polygonCancel, polygonFinishClosed, polygonFinishOpen, polygonToolStyle, ref;
    lc = this.props.lc;
    ref = React.DOM, div = ref.div, img = ref.img;
    polygonFinishOpen = (function(_this) {
      return function() {
        return lc.trigger('lc-polygon-finishopen');
      };
    })(this);
    polygonFinishClosed = (function(_this) {
      return function() {
        return lc.trigger('lc-polygon-finishclosed');
      };
    })(this);
    polygonCancel = (function(_this) {
      return function() {
        return lc.trigger('lc-polygon-cancel');
      };
    })(this);
    polygonToolStyle = {};
    if (!this.state.inProgress) {
      polygonToolStyle = {
        display: 'none'
      };
    }
    return div({}, div({
      className: 'polygon-toolbar horz-toolbar',
      style: polygonToolStyle
    }, div({
      className: 'square-toolbar-button',
      onClick: polygonFinishOpen
    }, img({
      src: this.props.imageURLPrefix + "/polygon-open.png"
    })), div({
      className: 'square-toolbar-button',
      onClick: polygonFinishClosed
    }, img({
      src: this.props.imageURLPrefix + "/polygon-closed.png"
    })), div({
      className: 'square-toolbar-button',
      onClick: polygonCancel
    }, img({
      src: this.props.imageURLPrefix + "/polygon-cancel.png"
    }))), div({}, StrokeWidthPicker({
      tool: this.props.tool,
      lc: this.props.lc
    })));
  }
}));

module.exports = {};


},{"../reactGUI/React-shim":44,"../reactGUI/StrokeWidthPicker":48,"../reactGUI/createSetStateOnEventMixin":51,"./optionsStyles":30}],32:[function(require,module,exports){
'use strict';

var React = require('../reactGUI/React-shim');
var SelectedColorPanel = require('../reactGUI/SelectedColorPanel');
var StrokeThickness = require('../reactGUI/StrokeThickness');

var _require = require('./optionsStyles'),
    defineOptionsStyle = _require.defineOptionsStyle;

defineOptionsStyle('stroke-and-fill', React.createClass({
  displayName: 'StrokeAndFill',

  render: function render() {
    var lc = this.props.lc;

    return React.createElement(
      'div',
      { className: 'strokePalette' },
      React.createElement(StrokeThickness, { lc: lc, tool: this.props.tool }),
      React.createElement(SelectedColorPanel, { tool: this.props.tool, imageURLPrefix: this.props.imageURLPrefix,
        strokeColor: '#000000', fillColor: '#000000', lc: lc })
    );
  }
}));

module.exports = {};

},{"../reactGUI/React-shim":44,"../reactGUI/SelectedColorPanel":46,"../reactGUI/StrokeThickness":47,"./optionsStyles":30}],33:[function(require,module,exports){
'use strict';

var React = require('../reactGUI/React-shim');
var SelectedColorPanel = require('../reactGUI/SelectedColorPanel');
var StrokeThickness = require('../reactGUI/StrokeThickness');

var _require = require('./optionsStyles'),
    defineOptionsStyle = _require.defineOptionsStyle;

defineOptionsStyle('stroke-palette', React.createClass({
  displayName: 'StrokePalettePicker',

  render: function render() {
    var lc = this.props.lc;

    return React.createElement(
      'div',
      { className: 'strokePalette' },
      React.createElement(StrokeThickness, { lc: lc, tool: this.props.tool }),
      React.createElement(SelectedColorPanel, { tool: this.props.tool, imageURLPrefix: this.props.imageURLPrefix,
        disableTransparent: true, strokeColor: '#000000', lc: lc, isFill: false })
    );
  }
}));

module.exports = {};

},{"../reactGUI/React-shim":44,"../reactGUI/SelectedColorPanel":46,"../reactGUI/StrokeThickness":47,"./optionsStyles":30}],34:[function(require,module,exports){
'use strict';

var StrokeThickness = require('../reactGUI/StrokeThickness');

var _require = require('./optionsStyles'),
    defineOptionsStyle = _require.defineOptionsStyle;

defineOptionsStyle('stroke-thickness', StrokeThickness);

module.exports = {};

},{"../reactGUI/StrokeThickness":47,"./optionsStyles":30}],35:[function(require,module,exports){
var StrokeWidthPicker, defineOptionsStyle;

defineOptionsStyle = require('./optionsStyles').defineOptionsStyle;

StrokeWidthPicker = require('../reactGUI/StrokeWidthPicker');

defineOptionsStyle('stroke-width', StrokeWidthPicker);

module.exports = {};


},{"../reactGUI/StrokeWidthPicker":48,"./optionsStyles":30}],36:[function(require,module,exports){
var ClearButton, React, _, classSet, createSetStateOnEventMixin;

React = require('./React-shim');

createSetStateOnEventMixin = require('./createSetStateOnEventMixin');

_ = require('../core/localization')._;

classSet = require('../core/util').classSet;

ClearButton = React.createClass({
  displayName: 'ClearButton',
  getState: function() {
    return {
      isEnabled: this.props.lc.canUndo()
    };
  },
  getInitialState: function() {
    return this.getState();
  },
  mixins: [createSetStateOnEventMixin('drawingChange')],
  render: function() {
    var className, div, lc, onClick;
    div = React.DOM.div;
    lc = this.props.lc;
    className = classSet({
      'lc-clear': true,
      'toolbar-button': true,
      'fat-button': true,
      'disabled': !this.state.isEnabled
    });
    onClick = lc.canUndo() ? ((function(_this) {
      return function() {
        return lc.clear();
      };
    })(this)) : function() {};
    return div({
      className: className,
      onClick: onClick
    }, _('Clear'));
  }
});

module.exports = ClearButton;


},{"../core/localization":13,"../core/util":19,"./React-shim":44,"./createSetStateOnEventMixin":51}],37:[function(require,module,exports){
var ColorGrid, ColorWell, PureRenderMixin, React, _, cancelAnimationFrame, classSet, getHSLAString, getHSLString, parseHSLAString, ref, requestAnimationFrame;

React = require('./React-shim');

PureRenderMixin = require('react-addons-pure-render-mixin');

ref = require('../core/util'), classSet = ref.classSet, requestAnimationFrame = ref.requestAnimationFrame, cancelAnimationFrame = ref.cancelAnimationFrame;

_ = require('../core/localization')._;

parseHSLAString = function(s) {
  var components, firstParen, insideParens, lastParen;
  if (s === 'transparent') {
    return {
      hue: 0,
      sat: 0,
      light: 0,
      alpha: 0
    };
  }
  if ((s != null ? s.substring(0, 4) : void 0) !== 'hsla') {
    return null;
  }
  firstParen = s.indexOf('(');
  lastParen = s.indexOf(')');
  insideParens = s.substring(firstParen + 1, lastParen - firstParen + 4);
  components = (function() {
    var j, len, ref1, results;
    ref1 = insideParens.split(',');
    results = [];
    for (j = 0, len = ref1.length; j < len; j++) {
      s = ref1[j];
      results.push(s.trim());
    }
    return results;
  })();
  return {
    hue: parseInt(components[0], 10),
    sat: parseInt(components[1].substring(0, components[1].length - 1), 10),
    light: parseInt(components[2].substring(0, components[2].length - 1), 10),
    alpha: parseFloat(components[3])
  };
};

getHSLAString = function(arg) {
  var alpha, hue, light, sat;
  hue = arg.hue, sat = arg.sat, light = arg.light, alpha = arg.alpha;
  return "hsla(" + hue + ", " + sat + "%, " + light + "%, " + alpha + ")";
};

getHSLString = function(arg) {
  var hue, light, sat;
  hue = arg.hue, sat = arg.sat, light = arg.light;
  return "hsl(" + hue + ", " + sat + "%, " + light + "%)";
};

ColorGrid = React.createFactory(React.createClass({
  displayName: 'ColorGrid',
  mixins: [PureRenderMixin],
  render: function() {
    var div;
    div = React.DOM.div;
    return div({}, this.props.rows.map((function(_this) {
      return function(row, ix) {
        return div({
          className: 'color-row',
          key: ix,
          style: {
            width: 20 * row.length
          }
        }, row.map(function(cellColor, ix2) {
          var alpha, className, colorString, colorStringNoAlpha, hue, light, sat, update;
          hue = cellColor.hue, sat = cellColor.sat, light = cellColor.light, alpha = cellColor.alpha;
          colorString = getHSLAString(cellColor);
          colorStringNoAlpha = "hsl(" + hue + ", " + sat + "%, " + light + "%)";
          className = classSet({
            'color-cell': true,
            'selected': _this.props.selectedColor === colorString
          });
          update = function(e) {
            _this.props.onChange(cellColor, colorString);
            e.stopPropagation();
            return e.preventDefault();
          };
          return div({
            className: className,
            onTouchStart: update,
            onTouchMove: update,
            onClick: update,
            style: {
              backgroundColor: colorStringNoAlpha
            },
            key: ix2
          });
        }));
      };
    })(this)));
  }
}));

ColorWell = React.createClass({
  displayName: 'ColorWell',
  mixins: [PureRenderMixin],
  getInitialState: function() {
    var colorString, hsla;
    colorString = this.props.lc.colors[this.props.colorName];
    hsla = parseHSLAString(colorString);
    if (hsla == null) {
      hsla = {};
    }
    if (hsla.alpha == null) {
      hsla.alpha = 1;
    }
    if (hsla.sat == null) {
      hsla.sat = 100;
    }
    if (hsla.hue == null) {
      hsla.hue = 0;
    }
    if (hsla.light == null) {
      hsla.light = 50;
    }
    return {
      colorString: colorString,
      alpha: hsla.alpha,
      sat: hsla.sat === 0 ? 100 : hsla.sat,
      isPickerVisible: false,
      hsla: hsla
    };
  },
  componentDidMount: function() {
    return this.unsubscribe = this.props.lc.on(this.props.colorName + "ColorChange", (function(_this) {
      return function() {
        var colorString;
        colorString = _this.props.lc.colors[_this.props.colorName];
        _this.setState({
          colorString: colorString
        });
        return _this.setHSLAFromColorString(colorString);
      };
    })(this));
  },
  componentWillUnmount: function() {
    return this.unsubscribe();
  },
  setHSLAFromColorString: function(c) {
    var hsla;
    hsla = parseHSLAString(c);
    if (hsla) {
      return this.setState({
        hsla: hsla,
        alpha: hsla.alpha,
        sat: hsla.sat
      });
    } else {
      return this.setState({
        hsla: null,
        alpha: 1,
        sat: 100
      });
    }
  },
  closePicker: function() {
    return this.setState({
      isPickerVisible: false
    });
  },
  togglePicker: function() {
    var isPickerVisible, shouldResetSat;
    isPickerVisible = !this.state.isPickerVisible;
    shouldResetSat = isPickerVisible && this.state.sat === 0;
    this.setHSLAFromColorString(this.state.colorString);
    return this.setState({
      isPickerVisible: isPickerVisible,
      sat: shouldResetSat ? 100 : this.state.sat
    });
  },
  setColor: function(c) {
    this.setState({
      colorString: c
    });
    this.setHSLAFromColorString(c);
    return this.props.lc.setColor(this.props.colorName, c);
  },
  setAlpha: function(alpha) {
    var hsla;
    this.setState({
      alpha: alpha
    });
    if (this.state.hsla) {
      hsla = this.state.hsla;
      hsla.alpha = alpha;
      this.setState({
        hsla: hsla
      });
      return this.setColor(getHSLAString(hsla));
    }
  },
  setSat: function(sat) {
    var hsla;
    this.setState({
      sat: sat
    });
    if (isNaN(sat)) {
      throw "SAT";
    }
    if (this.state.hsla) {
      hsla = this.state.hsla;
      hsla.sat = sat;
      this.setState({
        hsla: hsla
      });
      return this.setColor(getHSLAString(hsla));
    }
  },
  render: function() {
    var br, div, label, ref1;
    ref1 = React.DOM, div = ref1.div, label = ref1.label, br = ref1.br;
    return div({
      className: classSet({
        'color-well': true,
        'open': this.state.isPickerVisible
      }),
      onMouseLeave: this.closePicker,
      style: {
        float: 'left',
        textAlign: 'center'
      }
    }, label({}, this.props.label), br({}), div({
      className: classSet({
        'color-well-color-container': true,
        'selected': this.state.isPickerVisible
      }),
      style: {
        backgroundColor: 'white'
      },
      onClick: this.togglePicker
    }, div({
      className: 'color-well-checker color-well-checker-top-left'
    }), div({
      className: 'color-well-checker color-well-checker-bottom-right',
      style: {
        left: '50%',
        top: '50%'
      }
    }), div({
      className: 'color-well-color',
      style: {
        backgroundColor: this.state.colorString
      }
    }, " ")), this.renderPicker());
  },
  renderPicker: function() {
    var div, hue, i, input, j, label, len, onSelectColor, ref1, ref2, renderColor, renderLabel, rows;
    ref1 = React.DOM, div = ref1.div, label = ref1.label, input = ref1.input;
    if (!this.state.isPickerVisible) {
      return null;
    }
    renderLabel = (function(_this) {
      return function(text) {
        return div({
          className: 'color-row label',
          key: text,
          style: {
            lineHeight: '20px',
            height: 16
          }
        }, text);
      };
    })(this);
    renderColor = (function(_this) {
      return function() {
        var checkerboardURL;
        checkerboardURL = _this.props.lc.opts.imageURLPrefix + "/checkerboard-8x8.png";
        return div({
          className: 'color-row',
          key: "color",
          style: {
            position: 'relative',
            backgroundImage: "url(" + checkerboardURL + ")",
            backgroundRepeat: 'repeat',
            height: 24
          }
        }, div({
          style: {
            position: 'absolute',
            top: 0,
            right: 0,
            bottom: 0,
            left: 0,
            backgroundColor: _this.state.colorString
          }
        }));
      };
    })(this);
    rows = [];
    rows.push((function() {
      var j, results;
      results = [];
      for (i = j = 0; j <= 100; i = j += 10) {
        results.push({
          hue: 0,
          sat: 0,
          light: i,
          alpha: this.state.alpha
        });
      }
      return results;
    }).call(this));
    ref2 = [0, 30, 60, 90, 120, 150, 180, 210, 240, 270, 300, 330];
    for (j = 0, len = ref2.length; j < len; j++) {
      hue = ref2[j];
      rows.push((function() {
        var k, results;
        results = [];
        for (i = k = 10; k <= 90; i = k += 8) {
          results.push({
            hue: hue,
            sat: this.state.sat,
            light: i,
            alpha: this.state.alpha
          });
        }
        return results;
      }).call(this));
    }
    onSelectColor = (function(_this) {
      return function(hsla, s) {
        return _this.setColor(s);
      };
    })(this);
    return div({
      className: 'color-picker-popup'
    }, renderColor(), renderLabel(_("alpha")), input({
      type: 'range',
      min: 0,
      max: 1,
      step: 0.01,
      value: this.state.alpha,
      onChange: (function(_this) {
        return function(e) {
          return _this.setAlpha(parseFloat(e.target.value));
        };
      })(this)
    }), renderLabel(_("saturation")), input({
      type: 'range',
      min: 0,
      max: 100,
      value: this.state.sat,
      max: 100,
      onChange: (function(_this) {
        return function(e) {
          return _this.setSat(parseInt(e.target.value, 10));
        };
      })(this)
    }), ColorGrid({
      rows: rows,
      selectedColor: this.state.colorString,
      onChange: onSelectColor
    }));
  }
});

module.exports = ColorWell;


},{"../core/localization":13,"../core/util":19,"./React-shim":44,"react-addons-pure-render-mixin":2}],38:[function(require,module,exports){
"use strict";

var React = require('../reactGUI/React-shim');

var FontAttributes = React.createClass({
    displayName: "FontAttributes",

    getInitialState: function getInitialState() {
        var font = this.props.lc.getFont();
        var fontArray = font.split(" ");
        return {
            style: fontArray.shift(),
            size: fontArray.shift().replace("px", ""),
            font: fontArray.join(" ")
        };
    },
    onChangeSize: function onChangeSize(e) {
        this.setState({
            size: e.target.value
        }, function () {
            this.applyFont();
        }.bind(this));
    },
    onChangeFont: function onChangeFont(e) {
        this.setState({
            font: e.target.value
        }, function () {
            this.applyFont();
        }.bind(this));
    },
    onChangeStyle: function onChangeStyle(e) {
        this.setState({
            style: e.target.value
        }, function () {
            this.applyFont();
        }.bind(this));
    },
    applyFont: function applyFont() {
        var font = this.state.style + " " + this.state.size + "px " + this.state.font;
        this.props.lc.setFont(font);
    },
    render: function render() {
        var fontThickness = [];
        for (var i = 1; i <= 65; i++) {
            fontThickness.push(i);
        }return React.createElement(
            "div",
            { id: "painterAttrFont", className: "entryPlaygroundPainterAttrFont" },
            React.createElement(
                "div",
                { className: "entryPlaygroundPainterAttrTop" },
                React.createElement("div", { className: "entryPlaygroundPaintAttrTop_" }),
                React.createElement(
                    "select",
                    { value: this.state.font, id: "entryPainterAttrFontName", className: "entryPlaygroundPainterAttrFontName", size: "1", onChange: this.onChangeFont },
                    React.createElement(
                        "option",
                        { value: "KoPub Batang" },
                        Lang.Fonts.batang
                    ),
                    React.createElement(
                        "option",
                        { value: "Nanum Myeongjo" },
                        Lang.Fonts.myeongjo
                    ),
                    React.createElement(
                        "option",
                        { value: "Nanum Gothic" },
                        Lang.Fonts.gothic
                    ),
                    React.createElement(
                        "option",
                        { value: "Nanum Pen Script" },
                        Lang.Fonts.pen_script
                    ),
                    React.createElement(
                        "option",
                        { value: "Jeju Hallasan" },
                        Lang.Fonts.jeju_hallasan
                    ),
                    React.createElement(
                        "option",
                        { value: "Nanum Gothic Coding" },
                        Lang.Fonts.gothic_coding
                    )
                )
            ),
            React.createElement(
                "div",
                { className: "painterAttrFontSizeArea" },
                React.createElement("div", { className: "painterAttrFontSizeTop" }),
                React.createElement(
                    "select",
                    { value: this.state.size, id: "entryPainterAttrFontSize", className: "entryPlaygroundPainterAttrFontSize", size: "1", onChange: this.onChangeSize },
                    fontThickness.map(function (size) {
                        return React.createElement(
                            "option",
                            { key: size, value: size },
                            size
                        );
                    })
                )
            ),
            React.createElement(
                "div",
                { className: "entryPlaygroundPainterAttrFontStyleArea" },
                React.createElement("div", { className: "entryPlaygroundPainterAttrFontTop" }),
                React.createElement(
                    "select",
                    { value: this.state.style, id: "entryPainterAttrFontStyle", className: "entryPlaygroundPainterAttrFontStyle", size: "1", onChange: this.onChangeStyle },
                    React.createElement(
                        "option",
                        { value: "normal" },
                        Lang.Workspace.regular
                    ),
                    React.createElement(
                        "option",
                        { value: "bold" },
                        Lang.Workspace.bold
                    ),
                    React.createElement(
                        "option",
                        { value: "italic" },
                        Lang.Workspace.italic
                    )
                )
            )
        );
    }
});

module.exports = FontAttributes;

},{"../reactGUI/React-shim":44}],39:[function(require,module,exports){
'use strict';

var React = require('../reactGUI/React-shim');

var _require = require('../reactGUI/ReactDOM-shim'),
    findDOMNode = _require.findDOMNode;

var _require2 = require('../core/util'),
    classSet = _require2.classSet;

var Picker = require('./Picker');
var Options = require('./Options');
var createToolButton = require('./createToolButton');
var LiterallyCanvasModel = require('../core/LiterallyCanvas');
var defaultOptions = require('../core/defaultOptions');

require('../optionsStyles/font');
require('../optionsStyles/stroke-width');
require('../optionsStyles/color-palette');
require('../optionsStyles/stroke-palette');
require('../optionsStyles/stroke-thickness');
require('../optionsStyles/move-attributes');
require('../optionsStyles/font-attributes-color-palette');
require('../optionsStyles/line-options-and-stroke-width');
require('../optionsStyles/polygon-and-stroke-width');
require('../optionsStyles/null');

var CanvasContainer = React.createClass({
  displayName: 'CanvasContainer',
  shouldComponentUpdate: function shouldComponentUpdate() {
    // Avoid React trying to control this DOM
    return false;
  },
  render: function render() {
    return React.createElement('div', { key: 'literallycanvas', className: 'lc-drawing with-gui' });
  }
});

var CanvasTopMenu = React.createClass({
  displayName: 'CanvasTopMenu',
  render: function render() {
    return React.createElement('div', { id: 'canvas-top-menu', className: 'canvas-top-menu' });
  }
});

var LiterallyCanvas = React.createClass({
  displayName: 'LiterallyCanvas',

  getDefaultProps: function getDefaultProps() {
    return defaultOptions;
  },
  bindToModel: function bindToModel() {
    var canvasContainerEl = findDOMNode(this.canvas);
    var opts = this.props;
    this.lc.bindToElement(canvasContainerEl);

    if (typeof this.lc.opts.onInit === 'function') {
      this.lc.opts.onInit(this.lc);
    }
  },
  componentWillMount: function componentWillMount() {
    var _this = this;

    if (this.lc) return;

    if (this.props.lc) {
      this.lc = this.props.lc;
    } else {
      this.lc = new LiterallyCanvasModel(this.props);
    }

    this.toolButtonComponents = this.lc.opts.tools.map(function (ToolClass) {
      var tool = new ToolClass(_this.lc);
      _this.lc.registerTool(tool);
      return createToolButton(tool);
    });
  },
  componentDidMount: function componentDidMount() {
    if (!this.lc.isBound) {
      this.bindToModel();
    }
  },
  componentWillUnmount: function componentWillUnmount() {
    if (this.lc) {
      this.lc._teardown();
    }
  },
  render: function render() {
    var _this2 = this;

    var lc = this.lc,
        toolButtonComponents = this.toolButtonComponents,
        props = this.props;
    var _lc$opts = this.lc.opts,
        imageURLPrefix = _lc$opts.imageURLPrefix,
        toolbarPosition = _lc$opts.toolbarPosition;


    var pickerProps = { lc: lc, toolButtonComponents: toolButtonComponents, imageURLPrefix: imageURLPrefix };
    var topOrBottomClassName = classSet({
      'toolbar-at-top': toolbarPosition === 'top',
      'toolbar-at-bottom': toolbarPosition === 'bottom',
      'toolbar-hidden': toolbarPosition === 'hidden'
    });
    return React.createElement(
      'div',
      { className: 'literally ' + topOrBottomClassName },
      React.createElement(CanvasTopMenu, null),
      React.createElement(CanvasContainer, { ref: function ref(item) {
          return _this2.canvas = item;
        } }),
      React.createElement(Picker, pickerProps),
      React.createElement(Options, { lc: lc, imageURLPrefix: imageURLPrefix })
    );
  }
});

module.exports = LiterallyCanvas;

},{"../core/LiterallyCanvas":5,"../core/defaultOptions":10,"../core/util":19,"../optionsStyles/color-palette":23,"../optionsStyles/font":25,"../optionsStyles/font-attributes-color-palette":24,"../optionsStyles/line-options-and-stroke-width":26,"../optionsStyles/move-attributes":28,"../optionsStyles/null":29,"../optionsStyles/polygon-and-stroke-width":31,"../optionsStyles/stroke-palette":33,"../optionsStyles/stroke-thickness":34,"../optionsStyles/stroke-width":35,"../reactGUI/React-shim":44,"../reactGUI/ReactDOM-shim":45,"./Options":42,"./Picker":43,"./createToolButton":52}],40:[function(require,module,exports){
'use strict';

var React = require('../reactGUI/React-shim');

var MagnifyPanel = React.createClass({
    displayName: 'MagnifyPanel',

    getInitialState: function getInitialState() {
        var lc = this.props.lc;
        return { value: Math.round(lc.scale * 100) + "%" };
    },
    setZoom: function setZoom(amount) {
        var lc = this.props.lc;
        amount = Math.max(amount, lc.config.zoomMin);
        amount = Math.min(amount, lc.config.zoomMax);
        lc.setZoom(amount);
    },
    zoomIn: function zoomIn() {
        var lc = this.props.lc;
        this.setZoom(lc.scale + 0.1);
    },
    zoomOut: function zoomOut() {
        var lc = this.props.lc;
        this.setZoom(lc.scale - 0.1);
    },
    handleChange: function handleChange(event) {
        event.target.value;
        this.setState({ value: event.target.value });
    },
    handleBlur: function handleBlur(event) {
        var lc = this.props.lc;
        var value = parseInt(event.target.value);
        if (isNaN(value)) value = 100;
        this.setZoom(value / 100);
    },
    handleEnter: function handleEnter(event) {
        if (event.key === 'Enter') {
            var value = parseInt(this.state.value);
            if (isNaN(value)) value = 100;
            this.setZoom(value / 100);
        }
    },
    zoomEvent: function zoomEvent(event) {
        var value = event.newScale;
        this.setState({ value: Math.round(value * 100) + "%" });
    },
    componentDidMount: function componentDidMount() {
        var lc = this.props.lc;
        this.unsubscribe = lc.on("zoom", this.zoomEvent);
    },
    componentWillUnmount: function componentWillUnmount() {
        this.unsubscribe();
    },
    render: function render() {
        return React.createElement(
            'div',
            { className: 'entryPaintMagnifier' },
            React.createElement(
                'div',
                { onClick: this.zoomOut, id: 'zoomOut' },
                '-'
            ),
            React.createElement('input', { value: this.state.value, onKeyPress: this.handleEnter, onChange: this.handleChange, onBlur: this.handleBlur }),
            React.createElement(
                'div',
                { onClick: this.zoomIn, id: 'zoomIn' },
                '+'
            )
        );
    }
});

module.exports = MagnifyPanel;

},{"../reactGUI/React-shim":44}],41:[function(require,module,exports){
"use strict";

var React = require('../reactGUI/React-shim');

var MoveAttributes = React.createClass({
  displayName: "MoveAttributes",

  getInitialState: function getInitialState() {
    return {
      rotate: this.props.rotate
    };
  },
  componentDidMount: function componentDidMount() {
    var lc = this.props.lc;
    this.unsubscribe = lc.on("shapeSelected", this.setShape);
    this.unsubscribePaint = lc.on("handleShape", this.updateShape);
  },
  setShape: function setShape(shape) {
    this.setState({
      shape: shape
    });
    if (shape) {
      this.setState({
        width: shape.width,
        height: shape.height,
        rotate: shape.rotate
      });
      this.width = shape.width;
      this.height = shape.height;
      this.rotate = shape.rotate;
    }
  },
  updateShape: function updateShape() {
    if (this.state.shape) {
      var shape = this.state.shape;
      this.setState({
        width: shape.width,
        height: shape.height,
        rotate: shape.rotate
      });
      this.width = shape.width;
      this.height = shape.height;
      this.rotate = shape.rotate;
    }
  },
  componentWillUnmount: function componentWillUnmount() {
    this.unsubscribe();
    this.unsubscribePaint();
  },
  onChangeX: function onChangeX(e) {
    var width = parseInt(e.target.value);
    if (!width) width = 0;
    this.setState({ width: width });
    this.state.shape.width = width;
    this.props.lc.trigger('drawingChange');
  },
  onChangeY: function onChangeY(e) {
    var height = parseInt(e.target.value);
    if (!height) height = 0;
    this.setState({ height: height });
    this.state.shape.height = height;
    this.props.lc.trigger('drawingChange');
  },
  applyX: function applyX() {
    this.props.lc.editShape(this.state.shape, { width: this.state.width }, { width: this.width });
    this.width = this.state.width;
  },
  applyY: function applyY() {
    this.props.lc.editShape(this.state.shape, { height: this.state.height }, { height: this.height });
    this.height = this.state.height;
  },
  onChangeRotate: function onChangeRotate(e) {
    var rotate = parseInt(e.target.value);
    if (!rotate) rotate = 0;
    this.setState({ rotate: rotate });
    this.state.shape.rotate = rotate;
    this.props.lc.trigger('drawingChange');
  },
  applyRotate: function applyRotate(e) {
    this.props.lc.editShape(this.state.shape, { rotate: this.state.rotate }, { rotate: this.rotate });
    this.rotate = this.state.rotate;
  },
  flipX: function flipX() {
    this.props.lc.editShape(this.state.shape, { flipX: !this.state.shape.flipX });
  },
  flipY: function flipY() {
    this.props.lc.editShape(this.state.shape, { flipY: !this.state.shape.flipY });
  },
  render: function render() {
    var _state = this.state,
        width = _state.width,
        height = _state.height,
        rotate = _state.rotate,
        shape = _state.shape;


    return React.createElement(
      "div",
      { className: "entryMoveAttributes" },
      this.state.shape ? React.createElement(
        "fieldset",
        { id: "painterAttrResize", className: "entryPlaygroundPainterAttrResize" },
        React.createElement(
          "legend",
          null,
          Lang.Workspace.picture_size
        ),
        React.createElement(
          "div",
          { id: "painterAttrWrapper", className: "painterAttrWrapper" },
          React.createElement(
            "div",
            { className: "entryPlaygroundPainterAttrResizeX" },
            React.createElement(
              "div",
              { className: "entryPlaygroundPainterAttrResizeXTop" },
              "X"
            ),
            React.createElement("input", { id: "entryPainterAttrWidth", className: "entryPlaygroundPainterNumberInput",
              value: Math.round(width * 10) / 10, onChange: this.onChangeX, onBlur: this.applyX })
          ),
          React.createElement(
            "div",
            { className: "entryPlaygroundPainterSizeText" },
            "x"
          ),
          React.createElement(
            "div",
            { className: "entryPlaygroundAttrReiszeY" },
            React.createElement(
              "div",
              { className: "entryPlaygroundPainterAttrResizeYTop" },
              "Y"
            ),
            React.createElement("input", { id: "entryPainterAttrHeight", className: "entryPlaygroundPainterNumberInput",
              value: Math.round(height * 10) / 10, onChange: this.onChangeY, onBlur: this.applyY })
          )
        )
      ) : null,
      this.state.shape ? React.createElement(
        "div",
        { id: "painterAttrRotateArea", className: "painterAttrRotateArea" },
        React.createElement(
          "div",
          { className: "painterAttrRotateName" },
          Lang.Workspace.picture_rotation
        ),
        React.createElement(
          "fieldset",
          { id: "entryPainterAttrRotate", className: "entryPlaygroundPainterAttrRotate" },
          React.createElement(
            "div",
            { className: "painterAttrRotateTop" },
            "\u03BF"
          ),
          React.createElement("input", { id: "entryPainterAttrDegree", className: "entryPlaygroundPainterNumberInput",
            value: Math.round(rotate * 10) / 10, onChange: this.onChangeRotate, onBlur: this.applyRotate })
        )
      ) : null,
      this.state.shape ? React.createElement(
        "div",
        { id: "entryPictureFlip", className: "entryPlaygroundPainterFlip  " },
        React.createElement("div", { id: "entryPictureFlipX", onClick: this.flipX, title: "\uC88C\uC6B0\uB4A4\uC9D1\uAE30", className: "entryPlaygroundPainterFlipX" }),
        React.createElement("div", { id: "entryPictureFlipY", onClick: this.flipY, title: "\uC0C1\uD558\uB4A4\uC9D1\uAE30", className: "entryPlaygroundPainterFlipY" })
      ) : null
    );
  }
});

module.exports = MoveAttributes;

},{"../reactGUI/React-shim":44}],42:[function(require,module,exports){
var ColorPickers, ColorWell, Options, React, createSetStateOnEventMixin, optionsStyles;

React = require('./React-shim');

createSetStateOnEventMixin = require('./createSetStateOnEventMixin');

optionsStyles = require('../optionsStyles/optionsStyles').optionsStyles;

ColorWell = React.createFactory(require('./ColorWell'));

ColorPickers = React.createFactory(React.createClass({
  displayName: 'ColorPickers',
  render: function() {
    var div, lc;
    lc = this.props.lc;
    div = React.DOM.div;
    return div({
      className: 'lc-color-pickers'
    }, ColorWell({
      lc: lc,
      colorName: 'primary'
    }), ColorWell({
      lc: lc,
      colorName: 'secondary'
    }));
  }
}));

Options = React.createClass({
  displayName: 'Options',
  getState: function() {
    var ref;
    return {
      style: (ref = this.props.lc.tool) != null ? ref.optionsStyle : void 0,
      tool: this.props.lc.tool
    };
  },
  getInitialState: function() {
    return this.getState();
  },
  mixins: [createSetStateOnEventMixin('toolChange')],
  renderBody: function() {
    var style;
    style = "" + this.state.style;
    return optionsStyles[style] && optionsStyles[style]({
      lc: this.props.lc,
      tool: this.state.tool,
      imageURLPrefix: this.props.imageURLPrefix
    });
  },
  render: function() {
    var div;
    div = React.DOM.div;
    return div({
      className: 'lc-options horz-toolbar'
    }, this.renderBody());
  }
});

module.exports = Options;


},{"../optionsStyles/optionsStyles":30,"./ColorWell":37,"./React-shim":44,"./createSetStateOnEventMixin":51}],43:[function(require,module,exports){
var ClearButton, Picker, React, UndoRedoButtons, ZoomButtons;

React = require('./React-shim');

ClearButton = React.createFactory(require('./ClearButton'));

UndoRedoButtons = React.createFactory(require('./UndoRedoButtons'));

ZoomButtons = React.createFactory(require('./ZoomButtons'));

Picker = React.createClass({
  displayName: 'Picker',
  getInitialState: function() {
    return {
      selectedTool: "Pan"
    };
  },
  componentWillMount: function() {
    return this.unobserve = this.props.lc.on("toolChange", this.applyTool);
  },
  componentWillUnmount: this.unobserve ? this.unobserve() : void 0,
  applyTool: function(attr) {
    var tool;
    tool = attr.tool;
    return this.setState({
      selectedTool: tool.name
    });
  },
  renderBody: function() {
    var div, imageURLPrefix, lc, ref, toolButtonComponents;
    div = React.DOM.div;
    ref = this.props, toolButtonComponents = ref.toolButtonComponents, lc = ref.lc, imageURLPrefix = ref.imageURLPrefix;
    return div({
      className: 'lc-picker-contents'
    }, toolButtonComponents.map((function(_this) {
      return function(component, ix) {
        return component({
          lc: lc,
          imageURLPrefix: imageURLPrefix,
          key: ix,
          selected: _this.state.selectedTool,
          onSelect: function(tool) {
            return lc.setTool(tool);
          }
        });
      };
    })(this)), toolButtonComponents.length % 2 !== 0 ? div({
      className: 'toolbar-button thin-button disabled'
    }) : void 0, div({
      style: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0
      }
    }));
  },
  render: function() {
    var div;
    div = React.DOM.div;
    return div({
      className: 'lc-picker'
    }, this.renderBody());
  }
});

module.exports = Picker;


},{"./ClearButton":36,"./React-shim":44,"./UndoRedoButtons":49,"./ZoomButtons":50}],44:[function(require,module,exports){
var React;

try {
  React = require('react');
} catch (error) {
  React = window.React;
}

if (React == null) {
  throw "Can't find React";
}

module.exports = React;


},{"react":"react"}],45:[function(require,module,exports){
var ReactDOM;

try {
  ReactDOM = require('react-dom');
} catch (error) {
  ReactDOM = window.ReactDOM;
}

if (ReactDOM == null) {
  try {
    ReactDOM = require('react');
  } catch (error) {
    ReactDOM = window.React;
  }
}

if (ReactDOM == null) {
  throw "Can't find ReactDOM";
}

module.exports = ReactDOM;


},{"react":"react","react-dom":"react-dom"}],46:[function(require,module,exports){
'use strict';

var React = require('../reactGUI/React-shim');
var createSetStateOnEventMixin = require('./createSetStateOnEventMixin');

var Entry = Entry || {
    getColourCodes: function getColourCodes() {
        return ['transparent', '#660000', '#663300', '#996633', '#003300', '#003333', '#003399', '#000066', '#330066', '#660066', '#FFFFFF', '#990000', '#993300', '#CC9900', '#006600', '#336666', '#0033FF', '#000099', '#660099', '#990066', '#000000', '#CC0000', '#CC3300', '#FFCC00', '#009900', '#006666', '#0066FF', '#0000CC', '#663399', '#CC0099', '#333333', '#FF0000', '#FF3300', '#FFFF00', '#00CC00', '#009999', '#0099FF', '#0000FF', '#9900CC', '#FF0099', '#666666', '#CC3333', '#FF6600', '#FFFF33', '#00FF00', '#00CCCC', '#00CCFF', '#3366FF', '#9933FF', '#FF00FF', '#999999', '#FF6666', '#FF6633', '#FFFF66', '#66FF66', '#66CCCC', '#00FFFF', '#3399FF', '#9966FF', '#FF66FF', '#BBBBBB', '#FF9999', '#FF9966', '#FFFF99', '#99FF99', '#66FFCC', '#99FFFF', '#66CCff', '#9999FF', '#FF99FF', '#CCCCCC', '#FFCCCC', '#FFCC99', '#FFFFCC', '#CCFFCC', '#99FFCC', '#CCFFFF', '#99CCFF', '#CCCCFF', '#FFCCFF'];
    }
};

var Palette = React.createClass({
    displayName: 'Palette',

    getDefaultProps: function getDefaultProps() {},

    getInitialState: function getInitialState() {
        var _this = this;

        var colourCodes = Entry.getColourCodes();
        if (this.props.disableTransparent) {
            for (var i = 0; i < 7; i++) {
                colourCodes[i * 10] = colourCodes[i * 10 + 10];
            }colourCodes[70] = "#DDDDDD";
        }
        return {
            colourCodes: colourCodes,
            paletteStyles: colourCodes.map(function (color) {
                if (color === 'transparent') {
                    return { backgroundImage: 'url(' + _this.props.imageURLPrefix + '/transparent.png)' };
                } else if (color === 'disabled') {
                    return { backgroundImage: 'url(' + _this.props.imageURLPrefix + '/transparent.png)' };
                } else {
                    return { backgroundColor: color };
                }
            })
        };
    },

    onClickWithColor: function onClickWithColor(colorCode) {
        if (colorCode === "disabled") return;
        this.props.colorPicked(colorCode);
    },

    render: function render() {
        var _this2 = this;

        var colourCodes = this.state.colourCodes;
        return React.createElement(
            'div',
            { className: 'entryPlaygroundPainterAttrColorContainer' },
            this.state.paletteStyles.map(function (style, idx) {
                var colorCode = colourCodes[idx];
                var colorBindOnClick = _this2.onClickWithColor.bind(_this2, colorCode);
                return React.createElement('div', { key: idx, className: 'entryPlaygroundPainterAttrColorElement', onClick: colorBindOnClick, style: style });
            })
        );
    }
});

var ColorSpoid = React.createClass({
    displayName: 'ColorSpoid',

    getInitialState: function getInitialState() {
        return this.getState();
    },
    mixins: [createSetStateOnEventMixin('toolChange')],
    getState: function getState() {
        return {
            toggled: this.props.lc.tool.name === 'Eyedropper'
        };
    },
    toggleSpoid: function toggleSpoid(e) {
        if (this.state.toggled) return;
        var lc = this.props.lc;
        lc.tools.Eyedropper.setPrevious(lc.tool, this.props.selected);
        lc.setTool(lc.tools.Eyedropper);
    },

    render: function render() {
        // console.log('Palette render! toggled:', this.state.toggled);
        return React.createElement('div', { className: "entryColorSpoid " + (this.state.toggled ? "toggled" : ""), onClick: this.toggleSpoid });
    }
});

var SelectedColorPanel = React.createClass({
    displayName: 'SelectedColorPanel',

    componentDidMount: function componentDidMount() {
        var _this3 = this;

        var lc = this.props.lc;
        this.unsubscribePrimary = lc.on("primaryColorChange", function (strokeColor) {
            _this3.setState({ strokeColor: strokeColor });
        });
        this.unsubscribeSecondary = lc.on("secondaryColorChange", function (fillColor) {
            _this3.setState({ fillColor: fillColor });
        });
    },
    componentWillUnmount: function componentWillUnmount() {
        this.unsubscribePrimary();
        this.unsubscribeSecondary();
    },

    getInitialState: function getInitialState() {
        var fillColor = this.props.lc.getColor("secondary");
        var strokeColor = this.props.lc.getColor("primary");
        var isStroke = this.props.isStroke === undefined ? true : this.props.isStroke;
        return {
            isFill: this.props.isFill === undefined ? true : this.props.isFill,
            isStroke: isStroke,
            selected: isStroke ? "primary" : "secondary",
            fillColor: fillColor,
            strokeColor: strokeColor
        };
    },

    onClickFillPanel: function onClickFillPanel() {
        this.setState({ selected: "secondary" });
    },

    onClickStrokePanel: function onClickStrokePanel() {
        this.setState({ selected: "primary" });
    },

    colorPicked: function colorPicked(colorCode) {
        if (this.state.selected === "primary") this.setState({ strokeColor: colorCode });else this.setState({ fillColor: colorCode });
        this.props.lc.setColor(this.state.selected, colorCode);
    },

    onColorCodeChange: function onColorCodeChange(e) {
        var colorCode = e.target.value;
        if (this.state.selected === "primary") this.setState({ strokeColor: colorCode });else this.setState({ fillColor: colorCode });
        this.props.lc.setColor(this.state.selected, colorCode);
    },

    render: function render() {
        // console.log('Palette render! isOn:', this.state.isOn);
        var _state = this.state,
            isFill = _state.isFill,
            isStroke = _state.isStroke;

        var fillStyle = {
            backgroundColor: this.state.fillColor,
            zIndex: this.state.selected === "secondary" ? 100 : 0
        };
        var strokeStyle = {
            backgroundColor: this.state.strokeColor
        };

        return React.createElement(
            'div',
            { className: 'entrySelectedColorPanel' },
            isFill ? React.createElement('div', { className: "entrySelectedColorPanelFill " + (this.state.fillColor === "transparent" ? "transparent" : "") + (this.state.isStroke ? "" : " dominant"),
                style: fillStyle, onClick: this.onClickFillPanel }) : null,
            isStroke ? React.createElement(
                'div',
                { className: "entrySelectedColorPanelStroke " + (this.state.strokeColor === "transparent" ? "transparent" : ""),
                    style: strokeStyle, onClick: this.onClickStrokePanel },
                React.createElement('div', { className: 'entrySelectedColorPanelStrokeInner' })
            ) : null,
            React.createElement('input', { value: this.state.selected === "primary" ? this.state.strokeColor : this.state.fillColor, onChange: this.onColorCodeChange }),
            React.createElement(Palette, { colorPicked: this.colorPicked, imageURLPrefix: this.props.imageURLPrefix, disableTransparent: this.props.disableTransparent }),
            React.createElement(ColorSpoid, { imageURLPrefix: this.props.imageURLPrefix, lc: this.props.lc, selected: this.state.selected })
        );
    }
});

module.exports = SelectedColorPanel;

},{"../reactGUI/React-shim":44,"./createSetStateOnEventMixin":51}],47:[function(require,module,exports){
'use strict';

var React = require('../reactGUI/React-shim');

var StrokeThickness = React.createClass({
  displayName: 'StrokeThickness',

  getState: function getState(props) {
    var props = props || this.props;
    //   console.log('getState');
    return {
      toolName: props.tool.name,
      strokeWidth: props.tool.strokeWidth
    };
  },

  getInitialState: function getInitialState() {
    return this.getState();
  },

  componentWillReceiveProps: function componentWillReceiveProps(nextProps) {
    //   console.log('componentWillReceiveProps nextProps:', nextProps);
    if (this.state.toolName !== nextProps.tool.name) {
      this.setState(this.getState(nextProps));
    }
  },

  onChange: function onChange(e) {
    // console.log('e.target.value=', e.target.value);
    var strokeWidth = +e.target.value;
    this.setState({ strokeWidth: strokeWidth });
    this.props.lc.trigger('setStrokeWidth', strokeWidth);
  },

  render: function render() {
    var lc = this.props.lc;
    // console.log('lc:', lc);
    // console.log('tool.name:', lc.tool.name);
    // console.log('strokeWidth:', this.state.strokeWidth);
    var thickness = [];
    for (var i = 1; i <= 70; i++) {
      thickness.push(i);
    }return React.createElement(
      'div',
      { className: 'entryPlaygroundentryPlaygroundPainterAttrThickArea' },
      React.createElement(
        'legend',
        { className: 'painterAttrThickName' },
        Lang.Workspace.thickness
      ),
      React.createElement(
        'fieldset',
        { id: 'entryPainterAttrThick', className: 'entryPlaygroundPainterAttrThick' },
        React.createElement('div', { className: 'paintAttrThickTop' }),
        React.createElement(
          'select',
          { id: 'entryPainterAttrThick', className: 'entryPlaygroundPainterAttrThickInput', size: '1', value: this.state.strokeWidth, onChange: this.onChange },
          thickness.map(function (num) {
            return React.createElement(
              'option',
              { key: num, value: num },
              num
            );
          })
        ),
        React.createElement(
          'div',
          { id: 'entryPainterShapeLineColor', className: 'painterAttrShapeLineColor entryRemove' },
          React.createElement('div', { id: 'entryPainterShapeInnerBackground', className: ' painterAttrShapeInnerBackground' })
        )
      )
    );
  }
});

module.exports = StrokeThickness;

},{"../reactGUI/React-shim":44}],48:[function(require,module,exports){
var React, classSet, createSetStateOnEventMixin;

React = require('./React-shim');

createSetStateOnEventMixin = require('../reactGUI/createSetStateOnEventMixin');

classSet = require('../core/util').classSet;

module.exports = React.createClass({
  displayName: 'StrokeWidthPicker',
  getState: function(tool) {
    if (tool == null) {
      tool = this.props.tool;
    }
    return {
      strokeWidth: tool.strokeWidth
    };
  },
  getInitialState: function() {
    return this.getState();
  },
  mixins: [createSetStateOnEventMixin('toolDidUpdateOptions')],
  componentWillReceiveProps: function(props) {
    return this.setState(this.getState(props.tool));
  },
  render: function() {
    var circle, div, li, ref, strokeWidths, svg, ul;
    ref = React.DOM, ul = ref.ul, li = ref.li, svg = ref.svg, circle = ref.circle, div = ref.div;
    strokeWidths = this.props.lc.opts.strokeWidths;
    return div({}, strokeWidths.map((function(_this) {
      return function(strokeWidth, ix) {
        var buttonClassName, buttonSize;
        buttonClassName = classSet({
          'square-toolbar-button': true,
          'selected': strokeWidth === _this.state.strokeWidth
        });
        buttonSize = 28;
        return div({
          key: strokeWidth
        }, div({
          className: buttonClassName,
          onClick: function() {
            return _this.props.lc.trigger('setStrokeWidth', strokeWidth);
          }
        }, svg({
          width: buttonSize - 2,
          height: buttonSize - 2,
          viewPort: "0 0 " + strokeWidth + " " + strokeWidth,
          version: "1.1",
          xmlns: "http://www.w3.org/2000/svg"
        }, circle({
          cx: Math.ceil(buttonSize / 2 - 1),
          cy: Math.ceil(buttonSize / 2 - 1),
          r: strokeWidth / 2
        }))));
      };
    })(this)));
  }
});


},{"../core/util":19,"../reactGUI/createSetStateOnEventMixin":51,"./React-shim":44}],49:[function(require,module,exports){
var React, RedoButton, UndoButton, UndoRedoButtons, classSet, createSetStateOnEventMixin, createUndoRedoButtonComponent;

React = require('./React-shim');

createSetStateOnEventMixin = require('./createSetStateOnEventMixin');

classSet = require('../core/util').classSet;

createUndoRedoButtonComponent = function(undoOrRedo) {
  return React.createClass({
    displayName: undoOrRedo === 'undo' ? 'UndoButton' : 'RedoButton',
    getState: function() {
      return {
        isEnabled: (function() {
          switch (false) {
            case undoOrRedo !== 'undo':
              return this.props.lc.canUndo();
            case undoOrRedo !== 'redo':
              return this.props.lc.canRedo();
          }
        }).call(this)
      };
    },
    getInitialState: function() {
      return this.getState();
    },
    mixins: [createSetStateOnEventMixin('drawingChange')],
    render: function() {
      var className, div, imageURLPrefix, img, lc, onClick, ref, ref1, src, style, title;
      ref = React.DOM, div = ref.div, img = ref.img;
      ref1 = this.props, lc = ref1.lc, imageURLPrefix = ref1.imageURLPrefix;
      title = undoOrRedo === 'undo' ? 'Undo' : 'Redo';
      className = ("lc-" + undoOrRedo + " ") + classSet({
        'toolbar-button': true,
        'thin-button': true,
        'disabled': !this.state.isEnabled
      });
      onClick = (function() {
        switch (false) {
          case !!this.state.isEnabled:
            return function() {};
          case undoOrRedo !== 'undo':
            return function() {
              return lc.undo();
            };
          case undoOrRedo !== 'redo':
            return function() {
              return lc.redo();
            };
        }
      }).call(this);
      src = imageURLPrefix + "/" + undoOrRedo + ".png";
      style = {
        backgroundImage: "url(" + src + ")"
      };
      return div({
        className: className,
        onClick: onClick,
        title: title,
        style: style
      });
    }
  });
};

UndoButton = React.createFactory(createUndoRedoButtonComponent('undo'));

RedoButton = React.createFactory(createUndoRedoButtonComponent('redo'));

UndoRedoButtons = React.createClass({
  displayName: 'UndoRedoButtons',
  render: function() {
    var div;
    div = React.DOM.div;
    return div({
      className: 'lc-undo-redo'
    }, UndoButton(this.props), RedoButton(this.props));
  }
});

module.exports = UndoRedoButtons;


},{"../core/util":19,"./React-shim":44,"./createSetStateOnEventMixin":51}],50:[function(require,module,exports){
var React, ZoomButtons, ZoomInButton, ZoomOutButton, classSet, createSetStateOnEventMixin, createZoomButtonComponent;

React = require('./React-shim');

createSetStateOnEventMixin = require('./createSetStateOnEventMixin');

classSet = require('../core/util').classSet;

createZoomButtonComponent = function(inOrOut) {
  return React.createClass({
    displayName: inOrOut === 'in' ? 'ZoomInButton' : 'ZoomOutButton',
    getState: function() {
      return {
        isEnabled: (function() {
          switch (false) {
            case inOrOut !== 'in':
              return this.props.lc.scale < this.props.lc.config.zoomMax;
            case inOrOut !== 'out':
              return this.props.lc.scale > this.props.lc.config.zoomMin;
          }
        }).call(this)
      };
    },
    getInitialState: function() {
      return this.getState();
    },
    mixins: [createSetStateOnEventMixin('zoom')],
    render: function() {
      var className, div, imageURLPrefix, img, lc, onClick, ref, ref1, src, style, title;
      ref = React.DOM, div = ref.div, img = ref.img;
      ref1 = this.props, lc = ref1.lc, imageURLPrefix = ref1.imageURLPrefix;
      title = inOrOut === 'in' ? 'Zoom in' : 'Zoom out';
      className = ("lc-zoom-" + inOrOut + " ") + classSet({
        'toolbar-button': true,
        'thin-button': true,
        'disabled': !this.state.isEnabled
      });
      onClick = (function() {
        switch (false) {
          case !!this.state.isEnabled:
            return function() {};
          case inOrOut !== 'in':
            return function() {
              return lc.zoom(lc.config.zoomStep);
            };
          case inOrOut !== 'out':
            return function() {
              return lc.zoom(-lc.config.zoomStep);
            };
        }
      }).call(this);
      src = imageURLPrefix + "/zoom-" + inOrOut + ".png";
      style = {
        backgroundImage: "url(" + src + ")"
      };
      return div({
        className: className,
        onClick: onClick,
        title: title,
        style: style
      });
    }
  });
};

ZoomOutButton = React.createFactory(createZoomButtonComponent('out'));

ZoomInButton = React.createFactory(createZoomButtonComponent('in'));

ZoomButtons = React.createClass({
  displayName: 'ZoomButtons',
  render: function() {
    var div;
    div = React.DOM.div;
    return div({
      className: 'lc-zoom'
    }, ZoomOutButton(this.props), ZoomInButton(this.props));
  }
});

module.exports = ZoomButtons;


},{"../core/util":19,"./React-shim":44,"./createSetStateOnEventMixin":51}],51:[function(require,module,exports){
var React, createSetStateOnEventMixin;

React = require('./React-shim');

module.exports = createSetStateOnEventMixin = function(eventName) {
  return {
    componentDidMount: function() {
      return this.unsubscribe = this.props.lc.on(eventName, (function(_this) {
        return function() {
          return _this.setState(_this.getState());
        };
      })(this));
    },
    componentWillUnmount: function() {
      return this.unsubscribe();
    }
  };
};


},{"./React-shim":44}],52:[function(require,module,exports){
var React, _, classSet, createToolButton;

React = require('./React-shim');

classSet = require('../core/util').classSet;

_ = require('../core/localization')._;

createToolButton = function(tool) {
  var displayName, imageName;
  displayName = tool.name;
  imageName = tool.iconName;
  return React.createFactory(React.createClass({
    displayName: displayName,
    getDefaultProps: function() {
      return {
        selected: null,
        lc: null
      };
    },
    componentWillMount: function() {
      if (this.props.selected === displayName) {
        return this.props.lc.setTool(tool);
      }
    },
    render: function() {
      var className, div, imageURLPrefix, img, onSelect, ref, ref1, selected, src, style;
      ref = React.DOM, div = ref.div, img = ref.img;
      ref1 = this.props, imageURLPrefix = ref1.imageURLPrefix, selected = ref1.selected, onSelect = ref1.onSelect;
      className = classSet({
        'lc-pick-tool': true,
        'toolbar-button': true,
        'thin-button': true,
        'selected': selected === displayName
      });
      if (imageName === "none") {
        style = {
          'display': 'none'
        };
      } else {
        src = imageURLPrefix + "/" + imageName + ".png";
        style = {
          'backgroundImage': "url(" + src + ")"
        };
      }
      return div({
        className: className,
        style: style,
        onClick: (function() {
          return onSelect(tool);
        }),
        title: _(Lang.Workspace[displayName])
      });
    }
  }));
};

module.exports = createToolButton;


},{"../core/localization":13,"../core/util":19,"./React-shim":44}],53:[function(require,module,exports){
'use strict';

var React = require('./React-shim');
var ReactDOM = require('./ReactDOM-shim');
var LiterallyCanvasModel = require('../core/LiterallyCanvas');
var LiterallyCanvasReactComponent = require('./LiterallyCanvas');

function init(el, opts) {
  var originalClassName = el.className;
  var lc = new LiterallyCanvasModel(opts);
  ReactDOM.render(React.createElement(LiterallyCanvasReactComponent, { lc: lc }), el);
  lc.teardown = function () {
    lc._teardown();
    for (var i = 0; i < el.children.length; i++) {
      el.removeChild(el.children[i]);
    }
    el.className = originalClassName;
  };
  return lc;
}

module.exports = init;

},{"../core/LiterallyCanvas":5,"./LiterallyCanvas":39,"./React-shim":44,"./ReactDOM-shim":45}],54:[function(require,module,exports){
var Ellipse, ToolWithStroke, createShape,
  extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  hasProp = {}.hasOwnProperty;

ToolWithStroke = require('./base').ToolWithStroke;

createShape = require('../core/shapes').createShape;

module.exports = Ellipse = (function(superClass) {
  extend(Ellipse, superClass);

  function Ellipse() {
    return Ellipse.__super__.constructor.apply(this, arguments);
  }

  Ellipse.prototype.name = 'Ellipse';

  Ellipse.prototype.iconName = 'ellipse';

  Ellipse.prototype.cursor = 'crosshair';

  Ellipse.prototype.optionsStyle = 'stroke-and-fill';

  Ellipse.prototype.begin = function(x, y, lc) {
    return this.currentShape = createShape('Ellipse', {
      x: x,
      y: y,
      strokeWidth: this.strokeWidth,
      strokeColor: lc.getColor('primary'),
      fillColor: lc.getColor('secondary')
    });
  };

  Ellipse.prototype["continue"] = function(x, y, lc) {
    this.currentShape.width = x - this.currentShape.x;
    this.currentShape.height = y - this.currentShape.y;
    return lc.drawShapeInProgress(this.currentShape);
  };

  Ellipse.prototype.end = function(x, y, lc) {
    return lc.saveShape(this.currentShape);
  };

  return Ellipse;

})(ToolWithStroke);


},{"../core/shapes":17,"./base":67}],55:[function(require,module,exports){
var Eraser, Pencil, createShape,
  extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  hasProp = {}.hasOwnProperty;

Pencil = require('./Pencil');

createShape = require('../core/shapes').createShape;

module.exports = Eraser = (function(superClass) {
  extend(Eraser, superClass);

  function Eraser() {
    return Eraser.__super__.constructor.apply(this, arguments);
  }

  Eraser.prototype.name = 'Eraser';

  Eraser.prototype.iconName = 'eraser';

  Eraser.prototype.optionsStyle = 'stroke-thickness';

  Eraser.prototype.makePoint = function(x, y, lc) {
    return createShape('Point', {
      x: x,
      y: y,
      size: this.strokeWidth,
      color: '#000'
    });
  };

  Eraser.prototype.makeShape = function() {
    return createShape('ErasedLinePath');
  };

  Eraser.prototype.createCursor = function() {
    return createShape('Ellipse', {
      x: 0,
      y: 0,
      strokeWidth: 1,
      strokeColor: "#000",
      fillColor: 'transparent'
    });
  };

  Eraser.prototype.updateCursor = function(x, y, lc) {
    this.cursorShape.setUpperLeft({
      x: x - this.strokeWidth / 2,
      y: y - this.strokeWidth / 2
    });
    this.cursorShape.width = this.strokeWidth + 1;
    return this.cursorShape.height = this.strokeWidth + 1;
  };

  Eraser.prototype.convertToPoint = function(x, y, lc) {
    if (!this.currentShape) {
      return;
    }
    return this.currentShape = null;
  };

  return Eraser;

})(Pencil);


},{"../core/shapes":17,"./Pencil":61}],56:[function(require,module,exports){
var Eyedropper, Tool, getPixel, util,
  extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  hasProp = {}.hasOwnProperty;

Tool = require('./base').Tool;

util = require('../core/util');

getPixel = function(ctx, arg) {
  var pixel, x, y;
  x = arg.x, y = arg.y;
  pixel = ctx.getImageData(x, y, 1, 1).data;
  if (pixel[3]) {
    return "rgb(" + pixel[0] + ", " + pixel[1] + ", " + pixel[2] + ")";
  } else {
    return null;
  }
};

module.exports = Eyedropper = (function(superClass) {
  extend(Eyedropper, superClass);

  Eyedropper.prototype.name = 'Eyedropper';

  Eyedropper.prototype.iconName = 'none';

  function Eyedropper(lc) {
    this.cursor = 'url("' + lc.opts.imageURLPrefix + '/spoid.cur"), default';
    Eyedropper.__super__.constructor.call(this, lc);
    this.strokeOrFill = 'stroke';
  }

  Eyedropper.prototype.readColor = function(x, y, lc) {
    var canvas, color, newColor, scale;
    if (x < 0 || y < 0 || x > lc.width || y > lc.height) {
      return;
    }
    canvas = lc.getImage();
    scale = util.getBackingScale(lc.ctx);
    newColor = getPixel(canvas.getContext('2d'), {
      x: x,
      y: y
    });
    color = newColor || lc.getColor('background');
    return lc.setColor(this.selected, color);
  };

  Eyedropper.prototype.begin = function(x, y, lc) {
    return this.readColor(x, y, lc);
  };

  Eyedropper.prototype["continue"] = function(x, y, lc) {
    return this.readColor(x, y, lc);
  };

  Eyedropper.prototype.end = function(x, y, lc) {
    return lc.setTool(this.previousTool);
  };

  Eyedropper.prototype.setPrevious = function(tool, selected) {
    this.optionsStyle = tool.optionsStyle;
    this.previousTool = tool;
    return this.selected = selected;
  };

  return Eyedropper;

})(Tool);


},{"../core/util":19,"./base":67}],57:[function(require,module,exports){
var Fill, Tool, getPixel,
  extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  hasProp = {}.hasOwnProperty;

Tool = require('./base').Tool;

getPixel = function(ctx, arg) {
  var pixel, x, y;
  x = arg.x, y = arg.y;
  pixel = ctx.getImageData(x, y, 1, 1).data;
  if (pixel[3]) {
    return "rgb(" + pixel[0] + ", " + pixel[1] + ", " + pixel[2] + ")";
  } else {
    return null;
  }
};

module.exports = Fill = (function(superClass) {
  extend(Fill, superClass);

  Fill.prototype.name = 'Fill';

  Fill.prototype.iconName = 'fill';

  Fill.prototype.optionsStyle = 'color-palette';

  function Fill(lc) {
    this.cursor = 'url("' + lc.opts.imageURLPrefix + '/paint_line.cur"), default';
    Fill.__super__.constructor.call(this, lc);
  }

  Fill.prototype.threshold = 20;

  Fill.prototype.end = function(x, y, lc) {
    var didFinish, fillColor, fillPoint, rect, startPoint;
    didFinish = void 0;
    fillColor = void 0;
    fillPoint = void 0;
    rect = void 0;
    startPoint = void 0;
    rect = lc.getDefaultImageRect();
    startPoint = {
      x: Math.floor(x),
      y: Math.floor(y)
    };
    if (!this.getIsPointInRect(startPoint.x, startPoint.y, rect)) {
      return null;
    }
    fillPoint = {
      x: startPoint.x - rect.x,
      y: startPoint.y - rect.y
    };
    fillColor = lc.colors.secondary;
    didFinish = false;
    lc.setCursor("progress");
    return this.getFillImage(lc.getImage({
      rect: rect
    }), fillPoint, fillColor, this.threshold, (function(_this) {
      return function(image, isDone) {
        var ref1, shape;
        shape = void 0;
        if (didFinish) {
          lc.setCursor(_this.cursor);
          return;
        }
        shape = LC.createShape('Image', {
          x: rect.x + rect.width / 2,
          y: rect.y + rect.height / 2,
          image: image,
          erase: (ref1 = fillColor === 'transparent') != null ? ref1 : {
            "true": false
          }
        });
        if (isDone) {
          lc.setShapesInProgress([]);
          lc.saveShape(shape);
          lc.setCursor(_this.cursor);
          return didFinish = true;
        } else {
          lc.setShapesInProgress([shape]);
          return lc.repaintLayer('main');
        }
      };
    })(this));
  };

  Fill.prototype.getIsPointInRect = function(x, y, rect) {
    if (x < rect.x) {
      return false;
    }
    if (y < rect.y) {
      return false;
    }
    if (x >= rect.x + rect.width) {
      return false;
    }
    if (y >= rect.y + rect.height) {
      return false;
    }
    return true;
  };

  Fill.prototype.getIndex = function(x, y, width) {
    return (y * width + x) * 4;
  };

  Fill.prototype.getColorArray = function(imageData, i) {
    return [imageData[i], imageData[i + 1], imageData[i + 2], imageData[i + 3]];
  };

  Fill.prototype.getAreColorsEqual = function(a, b, threshold) {
    var d, i, j, len, ref;
    d = void 0;
    i = void 0;
    j = void 0;
    len = void 0;
    ref = void 0;
    d = 0;
    ref = [0, 1, 2, 3];
    j = 0;
    len = ref.length;
    while (j < len) {
      i = ref[j];
      d += Math.abs(a[i] - b[i]);
      j++;
    }
    return d <= threshold;
  };

  Fill.prototype.getFillImage = function(canvas, point, fillColor, threshold, callback) {
    var ctx, ewCanvas, ewCtx, imageData, lastCheckpoint, outputData, outputPoints, pixelStack, rect, run, startColor;
    ctx = void 0;
    imageData = void 0;
    lastCheckpoint = void 0;
    ewCanvas = void 0;
    ewCtx = void 0;
    outputData = void 0;
    outputPoints = void 0;
    pixelStack = void 0;
    rect = void 0;
    run = void 0;
    startColor = void 0;
    rect = {
      x: 0,
      y: 0,
      width: canvas.width,
      height: canvas.height
    };
    ctx = canvas.getContext('2d');
    imageData = ctx.getImageData(0, 0, canvas.width, canvas.height).data;
    outputData = new ArrayBuffer(imageData.length);
    outputPoints = [];
    pixelStack = [[point.x, point.y]];
    startColor = this.getColorArray(imageData, this.getIndex(point.x, point.y, rect.width));
    ewCanvas = document.createElement('canvas');
    ewCanvas.width = canvas.width;
    ewCanvas.height = canvas.height;
    ewCanvas.backgroundColor = 'transparent';
    ewCtx = ewCanvas.getContext('2d');
    ewCtx.fillStyle = fillColor;
    lastCheckpoint = Date.now();
    run = (function(_this) {
      return function() {
        var color, i, image, isDone, p, x, y;
        color = void 0;
        i = void 0;
        image = void 0;
        isDone = void 0;
        p = void 0;
        x = void 0;
        y = void 0;
        while (pixelStack.length && Date.now() - lastCheckpoint < 90) {
          p = pixelStack.pop();
          x = p[0];
          y = p[1];
          i = _this.getIndex(x, y, rect.width);
          if (!_this.getIsPointInRect(x, y, rect)) {
            continue;
          }
          if (outputData[i]) {
            continue;
          }
          color = _this.getColorArray(imageData, i);
          if (!_this.getAreColorsEqual(color, startColor, threshold)) {
            continue;
          }
          outputData[i] = true;
          ewCtx.fillRect(x, y, 1, 1);
          outputPoints.push(p);
          pixelStack.push([x, y + 1]);
          pixelStack.push([x + 1, y]);
          pixelStack.push([x - 1, y]);
          pixelStack.push([x, y - 1]);
        }
        isDone = pixelStack.length === 0;
        image = new Image;
        image.src = ewCanvas.toDataURL();
        if (!isDone) {
          setTimeout(run, 0);
        }
        lastCheckpoint = Date.now();
        if (image.width) {
          return callback(image, isDone);
        } else {
          return LC.util.addImageOnload(image, function() {
            return callback(image, isDone);
          });
        }
      };
    })(this);
    return run();
  };

  return Fill;

})(Tool);


},{"./base":67}],58:[function(require,module,exports){
var Line, Pencil, createShape,
  extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  hasProp = {}.hasOwnProperty;

Pencil = require('./Pencil');

createShape = require('../core/shapes').createShape;

module.exports = Line = (function(superClass) {
  extend(Line, superClass);

  function Line() {
    return Line.__super__.constructor.apply(this, arguments);
  }

  Line.prototype.name = 'Line';

  Line.prototype.iconName = 'line';

  Line.prototype.cursor = 'none';

  Line.prototype.usesSimpleAPI = false;

  Line.prototype.didBecomeActive = function(lc) {
    var unsubscribeFuncs;
    unsubscribeFuncs = [];
    this.unsubscribe = (function(_this) {
      return function() {
        var func, i, len, results;
        results = [];
        for (i = 0, len = unsubscribeFuncs.length; i < len; i++) {
          func = unsubscribeFuncs[i];
          results.push(func());
        }
        return results;
      };
    })(this);
    this.cursorShape = this.createCursor();
    this.cursorShape.width = 10;
    this.cursorShape.height = 10;
    unsubscribeFuncs.push(lc.on('lc-pointermove', (function(_this) {
      return function(arg) {
        var x, y;
        x = arg.x, y = arg.y;
        _this.updateCursor(x, y, lc);
        return lc.drawShapeInProgress(_this.cursorShape);
      };
    })(this)));
    unsubscribeFuncs.push(lc.on('lc-pointerdown', (function(_this) {
      return function(arg) {
        var x, y;
        x = arg.x, y = arg.y;
        return _this.currentShape = createShape('Line', {
          x1: x,
          y1: y,
          x2: x,
          y2: y,
          strokeWidth: _this.strokeWidth,
          dash: (function() {
            switch (false) {
              case !this.isDashed:
                return [this.strokeWidth * 2, this.strokeWidth * 4];
              default:
                return null;
            }
          }).call(_this),
          endCapShapes: _this.hasEndArrow ? [null, 'arrow'] : null,
          color: lc.getColor('primary')
        });
      };
    })(this)));
    unsubscribeFuncs.push(lc.on('lc-pointerdrag', (function(_this) {
      return function(arg) {
        var x, y;
        x = arg.x, y = arg.y;
        _this.currentShape.x2 = x;
        _this.currentShape.y2 = y;
        lc.setShapesInProgress([_this.currentShape, _this.cursorShape]);
        return lc.repaintLayer('main', false);
      };
    })(this)));
    unsubscribeFuncs.push(lc.on('lc-pointerup', (function(_this) {
      return function(arg) {
        var x, y;
        x = arg.x, y = arg.y;
        if ((_this.currentShape.x1 === _this.currentShape.x2) && (_this.currentShape.y1 === _this.currentShape.y2)) {
          _this.convertToPoint(x, y, lc);
        }
        lc.saveShape(_this.currentShape);
        _this.currentShape = void 0;
        _this.updateCursor(x, y, lc);
        lc.setShapesInProgress([_this.cursorShape]);
        return lc.drawShapeInProgress(_this.cursorShape);
      };
    })(this)));
    return unsubscribeFuncs.push(lc.on('setStrokeWidth', (function(_this) {
      return function(strokeWidth) {
        _this.strokeWidth = strokeWidth;
        return lc.trigger('toolDidUpdateOptions');
      };
    })(this)));
  };

  return Line;

})(Pencil);


},{"../core/shapes":17,"./Pencil":61}],59:[function(require,module,exports){
var Magnifier, Tool, createShape, util,
  extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  hasProp = {}.hasOwnProperty;

Tool = require('./base').Tool;

createShape = require('../core/shapes').createShape;

util = require('../core/util');

module.exports = Magnifier = (function(superClass) {
  extend(Magnifier, superClass);

  Magnifier.prototype.optionsStyle = 'magnify';

  Magnifier.prototype.name = 'Magnifier';

  Magnifier.prototype.iconName = 'magnifier';

  function Magnifier(lc) {
    this.cursor = 'url("' + lc.opts.imageURLPrefix + '/zoom-in.cur"), default';
    Magnifier.__super__.constructor.call(this, lc);
  }

  Magnifier.prototype.didBecomeActive = function(lc) {
    var eventUnsubscribeFuncs, onKeyDown, onKeyUp;
    eventUnsubscribeFuncs = [];
    this._eventUnsubscribe = (function(_this) {
      return function() {
        var func, i, len, results;
        results = [];
        for (i = 0, len = eventUnsubscribeFuncs.length; i < len; i++) {
          func = eventUnsubscribeFuncs[i];
          results.push(func());
        }
        return results;
      };
    })(this);
    onKeyDown = (function(_this) {
      return function(e) {
        if (e.shiftKey && (e.keyCode === 16 || e.which === 16)) {
          _this.isShift = true;
          return lc.setCursor('url("' + lc.opts.imageURLPrefix + '/zoom-out.cur"), default');
        }
      };
    })(this);
    onKeyUp = (function(_this) {
      return function(e) {
        if (e.keyCode === 16 || e.which === 16) {
          _this.isShift = false;
          return lc.setCursor(_this.cursor);
        }
      };
    })(this);
    eventUnsubscribeFuncs.push(lc.on('keyDown', onKeyDown));
    return eventUnsubscribeFuncs.push(lc.on('keyUp', onKeyUp));
  };

  Magnifier.prototype.willBecomeInactive = function(lc) {
    return this._eventUnsubscribe();
  };

  Magnifier.prototype.end = function(x, y, lc) {
    var oldPosition, panX, panY, scale;
    scale = util.getBackingScale(lc.ctx);
    oldPosition = lc.position;
    if (lc.scale <= 0.5 || lc.scale >= 3) {
      return;
    }
    panX = (x - lc.canvas.width / 2 / scale) * lc.scale * 0.1;
    panY = (y - lc.canvas.height / 2 / scale) * lc.scale * 0.1;
    if (this.isShift) {
      lc.setZoom(lc.scale - 0.1);
      return lc.pan(-panX, -panY);
    } else {
      lc.setZoom(lc.scale + 0.1);
      return lc.pan(panX, panY);
    }
  };

  return Magnifier;

})(Tool);


},{"../core/shapes":17,"../core/util":19,"./base":67}],60:[function(require,module,exports){
var Pan, Tool, createShape,
  extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  hasProp = {}.hasOwnProperty;

Tool = require('./base').Tool;

createShape = require('../core/shapes').createShape;

module.exports = Pan = (function(superClass) {
  extend(Pan, superClass);

  function Pan() {
    return Pan.__super__.constructor.apply(this, arguments);
  }

  Pan.prototype.name = 'Pan';

  Pan.prototype.iconName = 'pan';

  Pan.prototype.usesSimpleAPI = false;

  Pan.prototype.optionsStyle = 'move-attributes';

  Pan.prototype.didBecomeActive = function(lc) {
    var unsubscribeFuncs;
    this.cursor = 'url("' + lc.opts.imageURLPrefix + '/handopen.cur"), default';
    unsubscribeFuncs = [];
    this.unsubscribe = (function(_this) {
      return function() {
        var func, i, len, results;
        results = [];
        for (i = 0, len = unsubscribeFuncs.length; i < len; i++) {
          func = unsubscribeFuncs[i];
          results.push(func());
        }
        return results;
      };
    })(this);
    unsubscribeFuncs.push(lc.on('lc-pointerdown', (function(_this) {
      return function(arg) {
        var rawX, rawY;
        rawX = arg.rawX, rawY = arg.rawY;
        _this.oldPosition = lc.position;
        return _this.pointerStart = {
          x: rawX,
          y: rawY
        };
      };
    })(this)));
    unsubscribeFuncs.push(lc.on('lc-pointerdrag', (function(_this) {
      return function(arg) {
        var dp, rawX, rawY;
        rawX = arg.rawX, rawY = arg.rawY;
        dp = {
          x: (rawX - _this.pointerStart.x) * lc.backingScale,
          y: (rawY - _this.pointerStart.y) * lc.backingScale
        };
        return lc.setPan(_this.oldPosition.x + dp.x, _this.oldPosition.y + dp.y);
      };
    })(this)));
    return unsubscribeFuncs.push(lc.on('lc-pointerup', (function(_this) {
      return function(arg) {
        var rawX, rawY;
        rawX = arg.rawX, rawY = arg.rawY;
        return lc.setCursor(_this.cursor);
      };
    })(this)));
  };

  Pan.prototype.willBecomeInactive = function(lc) {
    return this.unsubscribe();
  };

  return Pan;

})(Tool);


},{"../core/shapes":17,"./base":67}],61:[function(require,module,exports){
var Pencil, ToolWithStroke, createShape,
  extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  hasProp = {}.hasOwnProperty;

ToolWithStroke = require('./base').ToolWithStroke;

createShape = require('../core/shapes').createShape;

module.exports = Pencil = (function(superClass) {
  extend(Pencil, superClass);

  function Pencil() {
    return Pencil.__super__.constructor.apply(this, arguments);
  }

  Pencil.prototype.name = 'Pencil';

  Pencil.prototype.iconName = 'pencil';

  Pencil.prototype.cursor = 'none';

  Pencil.prototype.usesSimpleAPI = false;

  Pencil.prototype.eventTimeThreshold = 10;

  Pencil.prototype.didBecomeActive = function(lc) {
    var unsubscribeFuncs;
    unsubscribeFuncs = [];
    this.unsubscribe = (function(_this) {
      return function() {
        var func, i, len, results;
        results = [];
        for (i = 0, len = unsubscribeFuncs.length; i < len; i++) {
          func = unsubscribeFuncs[i];
          results.push(func());
        }
        return results;
      };
    })(this);
    this.cursorShape = this.createCursor();
    this.cursorShape.width = 10;
    this.cursorShape.height = 10;
    unsubscribeFuncs.push(lc.on('lc-pointermove', (function(_this) {
      return function(arg) {
        var x, y;
        x = arg.x, y = arg.y;
        _this.updateCursor(x, y, lc);
        return lc.drawShapeInProgress(_this.cursorShape);
      };
    })(this)));
    unsubscribeFuncs.push(lc.on('lc-pointerdown', (function(_this) {
      return function(arg) {
        var x, y;
        x = arg.x, y = arg.y;
        _this.color = lc.getColor('primary');
        _this.currentShape = _this.makeShape();
        _this.currentShape.addPoint(_this.makePoint(x, y, lc));
        _this.lastEventTime = Date.now();
        return lc.drawShapeInProgress(_this.cursorShape);
      };
    })(this)));
    unsubscribeFuncs.push(lc.on('lc-pointerdrag', (function(_this) {
      return function(arg) {
        var timeDiff, x, y;
        x = arg.x, y = arg.y;
        timeDiff = Date.now() - _this.lastEventTime;
        if (timeDiff > _this.eventTimeThreshold) {
          _this.lastEventTime += timeDiff;
          _this.currentShape.addPoint(_this.makePoint(x, y, lc));
          _this.updateCursor(x, y, lc);
          lc.setShapesInProgress([_this.currentShape, _this.cursorShape]);
          return lc.repaintLayer('main', false);
        }
      };
    })(this)));
    unsubscribeFuncs.push(lc.on('lc-pointerup', (function(_this) {
      return function(arg) {
        var x, y;
        x = arg.x, y = arg.y;
        if (_this.currentShape.points.length === 1) {
          _this.convertToPoint(x, y, lc);
        }
        if (_this.currentShape) {
          lc.saveShape(_this.currentShape);
        }
        _this.currentShape = void 0;
        _this.updateCursor(x, y, lc);
        return lc.drawShapeInProgress(_this.cursorShape);
      };
    })(this)));
    return unsubscribeFuncs.push(lc.on('setStrokeWidth', (function(_this) {
      return function(strokeWidth) {
        _this.strokeWidth = strokeWidth;
        return lc.trigger('toolDidUpdateOptions');
      };
    })(this)));
  };

  Pencil.prototype.willBecomeInactive = function(lc) {
    this.unsubscribe();
    lc.setShapesInProgress([]);
    return lc.repaintLayer('main', false);
  };

  Pencil.prototype.makePoint = function(x, y, lc) {
    return createShape('Point', {
      x: x,
      y: y,
      size: this.strokeWidth,
      color: this.color
    });
  };

  Pencil.prototype.makeShape = function() {
    return createShape('LinePath');
  };

  Pencil.prototype.convertToPoint = function(x, y, lc) {
    if (!this.currentShape) {
      return;
    }
    return this.currentShape = createShape('Ellipse', {
      x: x - this.strokeWidth / 2,
      y: y - this.strokeWidth / 2,
      0: 0,
      width: this.strokeWidth,
      height: this.strokeWidth,
      strokeColor: 'transparent',
      fillColor: lc.getColor('primary')
    });
  };

  Pencil.prototype.createCursor = function() {
    return createShape('Ellipse', {
      x: 0,
      y: 0,
      strokeWidth: 0,
      strokeColor: 'transparent',
      fillColor: "#000"
    });
  };

  Pencil.prototype.updateCursor = function(x, y, lc) {
    this.cursorShape.setUpperLeft({
      x: x - this.strokeWidth / 2,
      y: y - this.strokeWidth / 2
    });
    this.cursorShape.width = this.strokeWidth + 1;
    this.cursorShape.height = this.strokeWidth + 1;
    return this.cursorShape.fillColor = lc.getColor('primary');
  };

  return Pencil;

})(ToolWithStroke);


},{"../core/shapes":17,"./base":67}],62:[function(require,module,exports){
var Polygon, ToolWithStroke, createShape,
  extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  hasProp = {}.hasOwnProperty;

ToolWithStroke = require('./base').ToolWithStroke;

createShape = require('../core/shapes').createShape;

module.exports = Polygon = (function(superClass) {
  extend(Polygon, superClass);

  function Polygon() {
    return Polygon.__super__.constructor.apply(this, arguments);
  }

  Polygon.prototype.name = 'Polygon';

  Polygon.prototype.iconName = 'polygon';

  Polygon.prototype.usesSimpleAPI = false;

  Polygon.prototype.didBecomeActive = function(lc) {
    var onDown, onMove, onUp, polygonCancel, polygonFinishClosed, polygonFinishOpen, polygonUnsubscribeFuncs;
    Polygon.__super__.didBecomeActive.call(this, lc);
    polygonUnsubscribeFuncs = [];
    this.polygonUnsubscribe = (function(_this) {
      return function() {
        var func, i, len, results;
        results = [];
        for (i = 0, len = polygonUnsubscribeFuncs.length; i < len; i++) {
          func = polygonUnsubscribeFuncs[i];
          results.push(func());
        }
        return results;
      };
    })(this);
    this.points = null;
    this.maybePoint = null;
    onUp = (function(_this) {
      return function() {
        if (_this._getWillFinish()) {
          return _this._close(lc);
        }
        lc.trigger('lc-polygon-started');
        if (_this.points) {
          _this.points.push(_this.maybePoint);
        } else {
          _this.points = [_this.maybePoint];
        }
        _this.maybePoint = {
          x: _this.maybePoint.x,
          y: _this.maybePoint.y
        };
        lc.setShapesInProgress(_this._getShapes(lc));
        return lc.repaintLayer('main');
      };
    })(this);
    onMove = (function(_this) {
      return function(arg) {
        var x, y;
        x = arg.x, y = arg.y;
        if (_this.maybePoint) {
          _this.maybePoint.x = x;
          _this.maybePoint.y = y;
          lc.setShapesInProgress(_this._getShapes(lc));
          return lc.repaintLayer('main');
        }
      };
    })(this);
    onDown = (function(_this) {
      return function(arg) {
        var x, y;
        x = arg.x, y = arg.y;
        _this.maybePoint = {
          x: x,
          y: y
        };
        lc.setShapesInProgress(_this._getShapes(lc));
        return lc.repaintLayer('main');
      };
    })(this);
    polygonFinishOpen = (function(_this) {
      return function() {
        _this.maybePoint = {
          x: 2e308,
          y: 2e308
        };
        return _this._close(lc);
      };
    })(this);
    polygonFinishClosed = (function(_this) {
      return function() {
        _this.maybePoint = _this.points[0];
        return _this._close(lc);
      };
    })(this);
    polygonCancel = (function(_this) {
      return function() {
        return _this._cancel(lc);
      };
    })(this);
    polygonUnsubscribeFuncs.push(lc.on('drawingChange', (function(_this) {
      return function() {
        return _this._cancel(lc);
      };
    })(this)));
    polygonUnsubscribeFuncs.push(lc.on('lc-pointerdown', onDown));
    polygonUnsubscribeFuncs.push(lc.on('lc-pointerdrag', onMove));
    polygonUnsubscribeFuncs.push(lc.on('lc-pointermove', onMove));
    polygonUnsubscribeFuncs.push(lc.on('lc-pointerup', onUp));
    polygonUnsubscribeFuncs.push(lc.on('lc-polygon-finishopen', polygonFinishOpen));
    polygonUnsubscribeFuncs.push(lc.on('lc-polygon-finishclosed', polygonFinishClosed));
    return polygonUnsubscribeFuncs.push(lc.on('lc-polygon-cancel', polygonCancel));
  };

  Polygon.prototype.willBecomeInactive = function(lc) {
    Polygon.__super__.willBecomeInactive.call(this, lc);
    if (this.points || this.maybePoint) {
      this._cancel(lc);
    }
    return this.polygonUnsubscribe();
  };

  Polygon.prototype._getArePointsClose = function(a, b) {
    return (Math.abs(a.x - b.x) + Math.abs(a.y - b.y)) < 10;
  };

  Polygon.prototype._getWillClose = function() {
    if (!(this.points && this.points.length > 1)) {
      return false;
    }
    if (!this.maybePoint) {
      return false;
    }
    return this._getArePointsClose(this.points[0], this.maybePoint);
  };

  Polygon.prototype._getWillFinish = function() {
    if (!(this.points && this.points.length > 1)) {
      return false;
    }
    if (!this.maybePoint) {
      return false;
    }
    return this._getArePointsClose(this.points[0], this.maybePoint) || this._getArePointsClose(this.points[this.points.length - 1], this.maybePoint);
  };

  Polygon.prototype._cancel = function(lc) {
    lc.trigger('lc-polygon-stopped');
    this.maybePoint = null;
    this.points = null;
    lc.setShapesInProgress([]);
    return lc.repaintLayer('main');
  };

  Polygon.prototype._close = function(lc) {
    lc.trigger('lc-polygon-stopped');
    lc.setShapesInProgress([]);
    if (this.points.length > 2) {
      lc.saveShape(this._getShape(lc, false));
    }
    this.maybePoint = null;
    return this.points = null;
  };

  Polygon.prototype._getShapes = function(lc, isInProgress) {
    var shape;
    if (isInProgress == null) {
      isInProgress = true;
    }
    shape = this._getShape(lc, isInProgress);
    if (shape) {
      return [shape];
    } else {
      return [];
    }
  };

  Polygon.prototype._getShape = function(lc, isInProgress) {
    var points;
    if (isInProgress == null) {
      isInProgress = true;
    }
    points = [];
    if (this.points) {
      points = points.concat(this.points);
    }
    if ((!isInProgress) && points.length < 3) {
      return null;
    }
    if (isInProgress && this.maybePoint) {
      points.push(this.maybePoint);
    }
    if (points.length > 1) {
      return createShape('Polygon', {
        isClosed: this._getWillClose(),
        strokeColor: lc.getColor('primary'),
        fillColor: lc.getColor('secondary'),
        strokeWidth: this.strokeWidth,
        points: points.map(function(xy) {
          return createShape('Point', xy);
        })
      });
    } else {
      return null;
    }
  };

  Polygon.prototype.optionsStyle = 'polygon-and-stroke-width';

  return Polygon;

})(ToolWithStroke);


},{"../core/shapes":17,"./base":67}],63:[function(require,module,exports){
var Rectangle, ToolWithStroke, createShape,
  extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  hasProp = {}.hasOwnProperty;

ToolWithStroke = require('./base').ToolWithStroke;

createShape = require('../core/shapes').createShape;

module.exports = Rectangle = (function(superClass) {
  extend(Rectangle, superClass);

  function Rectangle() {
    return Rectangle.__super__.constructor.apply(this, arguments);
  }

  Rectangle.prototype.name = 'Rectangle';

  Rectangle.prototype.iconName = 'rectangle';

  Rectangle.prototype.cursor = 'crosshair';

  Rectangle.prototype.optionsStyle = 'stroke-and-fill';

  Rectangle.prototype.begin = function(x, y, lc) {
    return this.currentShape = createShape('Rectangle', {
      x: x,
      y: y,
      strokeWidth: this.strokeWidth,
      strokeColor: lc.getColor('primary'),
      fillColor: lc.getColor('secondary')
    });
  };

  Rectangle.prototype["continue"] = function(x, y, lc) {
    this.currentShape.width = x - this.currentShape.x;
    this.currentShape.height = y - this.currentShape.y;
    return lc.drawShapeInProgress(this.currentShape);
  };

  Rectangle.prototype.end = function(x, y, lc) {
    return lc.saveShape(this.currentShape);
  };

  return Rectangle;

})(ToolWithStroke);


},{"../core/shapes":17,"./base":67}],64:[function(require,module,exports){
var SelectCut, Tool, createShape, util,
  extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  hasProp = {}.hasOwnProperty;

Tool = require('./base').Tool;

createShape = require('../core/shapes').createShape;

util = require('../core/util');

module.exports = SelectCut = (function(superClass) {
  extend(SelectCut, superClass);

  function SelectCut() {
    return SelectCut.__super__.constructor.apply(this, arguments);
  }

  SelectCut.prototype.name = 'SelectCut';

  SelectCut.prototype.iconName = 'select-cut';

  SelectCut.prototype.cursor = 'crosshair';

  SelectCut.prototype.begin = function(x, y, lc) {
    this.dragStart = {
      x: x,
      y: y
    };
    return this.currentShape = createShape('Rectangle', {
      x: x,
      y: y,
      strokeWidth: 0,
      dash: [2, 2]
    });
  };

  SelectCut.prototype["continue"] = function(x, y, lc) {
    if (!this.dragStart) {
      return;
    }
    this.currentShape.width = x - this.currentShape.x;
    this.currentShape.height = y - this.currentShape.y;
    lc.setShapesInProgress([this.currentShape]);
    return lc.repaintLayer('main');
  };

  SelectCut.prototype.end = function(x, y, lc) {
    var height, image, newErase, newShape, tCtx, tempCanvas, width;
    image = new Image();
    lc.setShapesInProgress([]);
    lc.repaintLayer('main');
    this.currentShape.x = Math.ceil(this.currentShape.x);
    this.currentShape.y = Math.ceil(this.currentShape.y);
    this.currentShape.width = Math.ceil(this.currentShape.width);
    this.currentShape.height = Math.ceil(this.currentShape.height);
    x = this.currentShape.x;
    if (this.currentShape.width < 0) {
      x += this.currentShape.width;
    }
    y = this.currentShape.y;
    if (this.currentShape.height < 0) {
      y += this.currentShape.height;
    }
    width = Math.abs(this.currentShape.width);
    height = Math.abs(this.currentShape.height);
    if (width && height) {
      tempCanvas = document.createElement("canvas");
      tCtx = tempCanvas.getContext("2d");
      tempCanvas.width = width;
      tempCanvas.height = height;
      tCtx.drawImage(lc.getImage(), -x, -y);
      image.src = tempCanvas.toDataURL();
      newErase = createShape('ErasedRectangle', {
        x: x,
        y: y,
        width: width,
        height: height
      });
      newShape = createShape('Image', {
        x: x + width / 2,
        y: y + height / 2,
        image: image,
        width: width,
        height: height
      });
      newErase.isPass = true;
      newShape.isPass = true;
      lc.saveShape(newErase);
      lc.saveShape(newShape);
      lc.setTool(lc.tools.SelectShape);
      lc.tool.setShape(lc, newShape);
    }
    this.currentShape = null;
    return this.dragStart = null;
  };

  return SelectCut;

})(Tool);


},{"../core/shapes":17,"../core/util":19,"./base":67}],65:[function(require,module,exports){
var SelectShape, Tool, createShape, getIsPointInBox,
  extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  hasProp = {}.hasOwnProperty;

Tool = require('./base').Tool;

createShape = require('../core/shapes').createShape;

getIsPointInBox = function(point, box) {
  if (point.x < box.x) {
    return false;
  }
  if (point.y < box.y) {
    return false;
  }
  if (point.x > box.x + box.width) {
    return false;
  }
  if (point.y > box.y + box.height) {
    return false;
  }
  return true;
};

module.exports = SelectShape = (function(superClass) {
  extend(SelectShape, superClass);

  SelectShape.prototype.name = 'SelectShape';

  SelectShape.prototype.iconName = 'pan';

  SelectShape.prototype.usesSimpleAPI = false;

  SelectShape.prototype.optionsStyle = 'move-attributes';

  SelectShape.prototype.nextIsPass = false;

  function SelectShape(lc) {
    this.cursor = 'url("' + lc.opts.imageURLPrefix + '/handopen.cur"), default';
    this.selectCanvas = document.createElement('canvas');
    this.selectCanvas.style['background-color'] = 'transparent';
    this.selectCtx = this.selectCanvas.getContext('2d');
  }

  SelectShape.prototype.didBecomeActive = function(lc) {
    var dispose, onDown, onDrag, onKeyDown, onMove, onUp, selectShapeUnsubscribeFuncs, update;
    selectShapeUnsubscribeFuncs = [];
    this._selectShapeUnsubscribe = (function(_this) {
      return function() {
        var func, j, len, results;
        results = [];
        for (j = 0, len = selectShapeUnsubscribeFuncs.length; j < len; j++) {
          func = selectShapeUnsubscribeFuncs[j];
          results.push(func());
        }
        return results;
      };
    })(this);
    onDown = (function(_this) {
      return function(arg) {
        var br, rawX, rawY, x, y;
        x = arg.x, y = arg.y, rawX = arg.rawX, rawY = arg.rawY;
        _this._drawSelectCanvas(lc);
        _this.didDrag = false;
        _this.dragAction = _this._getPixel(x, y, lc, _this.selectCtx);
        if (_this.dragAction) {
          _this.prevPoint = {
            x: x,
            y: y
          };
          _this.initialShapeBoundingRect = _this.selectedShape.getBoundingRect(lc.ctx);
          _this.prevOpts = {
            x: _this.selectedShape.x,
            y: _this.selectedShape.y,
            width: _this.selectedShape.width,
            height: _this.selectedShape.height,
            rotate: _this.selectedShape.rotate
          };
          br = _this.selectedShape.getBoundingRect();
          return _this.dragOffset = {
            x: x - br.x,
            y: y - br.y
          };
        } else {
          _this.setShape(lc, null);
          _this.selectedShape = null;
          _this.oldPosition = lc.position;
          return _this.pointerStart = {
            x: rawX,
            y: rawY
          };
        }
      };
    })(this);
    onMove = (function(_this) {
      return function(arg) {
        var dragAction, rotate, x, y;
        x = arg.x, y = arg.y;
        if (!_this.selectedShape) {
          return;
        }
        _this._drawSelectCanvas(lc);
        dragAction = _this._getPixel(x, y, lc, _this.selectCtx);
        switch (dragAction) {
          case 1:
            return lc.setCursor("move");
          case 2:
            rotate = -Math.atan2(-(_this.selectedShape.y - y), _this.selectedShape.x - x) / Math.PI * 180 - 90;
            if (rotate < 0) {
              rotate += 360;
            }
            switch (Math.round(rotate / 45) % 4) {
              case 0:
                return lc.setCursor('ns-resize');
              case 1:
                return lc.setCursor('nesw-resize');
              case 2:
                return lc.setCursor('ew-resize');
              case 3:
                return lc.setCursor('nwse-resize');
            }
            break;
          case 3:
            return lc.setCursor('url("' + lc.opts.imageURLPrefix + '/rotate.cur") 8 8, default');
          default:
            return lc.setCursor(_this.cursor);
        }
      };
    })(this);
    onDrag = (function(_this) {
      return function(arg) {
        var br, brBottom, brRight, dp, height, rawX, rawY, rotate, width, x, xC, y, yC;
        x = arg.x, y = arg.y, rawX = arg.rawX, rawY = arg.rawY;
        lc.setCursor('url("' + lc.opts.imageURLPrefix + '/handclosed.cur"), default');
        if (_this.dragAction) {
          br = _this.initialShapeBoundingRect;
          brRight = br.x + br.width;
          brBottom = br.y + br.height;
          switch (_this.dragAction) {
            case 1:
              _this.didDrag = true;
              _this.selectedShape.setUpperLeft({
                x: _this.selectedShape.x - _this.prevPoint.x + x,
                y: _this.selectedShape.y - _this.prevPoint.y + y
              });
              _this.prevPoint = {
                x: x,
                y: y
              };
              break;
            case 2:
              rotate = -_this.selectedShape.rotate * Math.PI / 180;
              xC = (_this.selectedShape.x - x) * 2;
              yC = (_this.selectedShape.y - y) * 2;
              width = Math.abs(Math.abs(Math.cos(rotate) * xC - Math.sin(rotate) * yC) - 5);
              height = Math.abs(Math.abs(Math.sin(rotate) * xC + Math.cos(rotate) * yC) - 5);
              _this.selectedShape.setSize(width, height);
              break;
            case 3:
              rotate = -Math.atan2(-(_this.selectedShape.y - y), _this.selectedShape.x - x) / Math.PI * 180 - 90;
              if (rotate < 0) {
                rotate += 360;
              }
              _this.selectedShape.rotate = rotate;
          }
          lc.trigger('handleShape');
          lc.setShapesInProgress([
            _this.selectedShape, createShape('SelectionBox', {
              shape: _this.selectedShape
            })
          ]);
          return lc.repaintLayer('main');
        } else {
          dp = {
            x: (rawX - _this.pointerStart.x) * lc.backingScale,
            y: (rawY - _this.pointerStart.y) * lc.backingScale
          };
          return lc.setPan(_this.oldPosition.x + dp.x, _this.oldPosition.y + dp.y);
        }
      };
    })(this);
    onUp = (function(_this) {
      return function(arg) {
        var x, y;
        x = arg.x, y = arg.y;
        if (_this.dragAction) {
          switch (_this.dragAction) {
            case 1:
              _this.didDrag = false;
              lc.editShape(_this.selectedShape, {
                x: _this.selectedShape.x,
                y: _this.selectedShape.y,
                isPass: _this.nextIsPass
              }, _this.prevOpts);
              lc.trigger('shapeMoved', {
                shape: _this.selectedShape
              });
              break;
            case 2:
              lc.editShape(_this.selectedShape, {
                x: _this.selectedShape.x,
                y: _this.selectedShape.y,
                width: _this.selectedShape.width,
                height: _this.selectedShape.height,
                isPass: _this.nextIsPass
              }, _this.prevOpts);
              lc.trigger('shapeResized', {
                shape: _this.selectedShape
              });
              break;
            case 3:
              lc.editShape(_this.selectedShape, {
                rotate: _this.selectedShape.rotate,
                isPass: _this.nextIsPass
              }, _this.prevOpts);
              lc.trigger('shapeResized', {
                shape: _this.selectedShape
              });
          }
          _this.nextIsPass = false;
          lc.trigger('handleShape');
          lc.trigger('drawingChange', {});
          lc.repaintLayer('main');
          _this.dragAction = null;
        }
        return lc.setCursor(_this.cursor);
      };
    })(this);
    dispose = (function(_this) {
      return function() {
        return _this.setShape(lc, null);
      };
    })(this);
    update = (function(_this) {
      return function() {
        if (_this.selectedShape) {
          lc.setShapesInProgress([
            _this.selectedShape, createShape('SelectionBox', {
              shape: _this.selectedShape
            })
          ]);
          return lc.repaintLayer('main');
        }
      };
    })(this);
    onKeyDown = (function(_this) {
      return function(e) {
        var diff, pos;
        if (!_this.selectedShape) {
          return;
        }
        pos = {
          x: _this.selectedShape.x,
          y: _this.selectedShape.y
        };
        diff = 5;
        if (e.shiftKey) {
          diff = 1;
        }
        switch (e.keyCode) {
          case 38:
            pos.y = pos.y - diff;
            break;
          case 40:
            pos.y = pos.y + diff;
            break;
          case 37:
            pos.x = pos.x - diff;
            break;
          case 39:
            pos.x = pos.x + diff;
        }
        return lc.editShape(_this.selectedShape, pos);
      };
    })(this);
    dispose = (function(_this) {
      return function(e) {
        _this.setShape(lc, null);
        return _this.selectedShape = null;
      };
    })(this);
    selectShapeUnsubscribeFuncs.push(lc.on('lc-pointerdown', onDown));
    selectShapeUnsubscribeFuncs.push(lc.on('lc-pointerdrag', onDrag));
    selectShapeUnsubscribeFuncs.push(lc.on('lc-pointermove', onMove));
    selectShapeUnsubscribeFuncs.push(lc.on('lc-pointerup', onUp));
    selectShapeUnsubscribeFuncs.push(lc.on('undo', dispose));
    selectShapeUnsubscribeFuncs.push(lc.on('drawingChange', update));
    selectShapeUnsubscribeFuncs.push(lc.on('keyDown', onKeyDown));
    selectShapeUnsubscribeFuncs.push(lc.on('dispose', dispose));
    return this._drawSelectCanvas(lc);
  };

  SelectShape.prototype.willBecomeInactive = function(lc) {
    this._selectShapeUnsubscribe();
    return lc.setShapesInProgress([]);
  };

  SelectShape.prototype.setShape = function(lc, shape, nextIsPass) {
    this.nextIsPass = nextIsPass;
    if (!shape) {
      this.selectedShape = null;
      lc.setShapesInProgress([]);
    } else {
      this.selectedShape = shape;
      lc.setShapesInProgress([
        shape, createShape('SelectionBox', {
          shape: shape
        })
      ]);
    }
    lc.trigger("shapeSelected", this.selectedShape);
    lc.repaintLayer('main');
    return this._drawSelectCanvas(lc);
  };

  SelectShape.prototype._drawSelectCanvas = function(lc) {
    var shape;
    this.selectCanvas.width = lc.canvas.width;
    this.selectCanvas.height = lc.canvas.height;
    this.selectCtx.clearRect(0, 0, this.selectCanvas.width, this.selectCanvas.height);
    if (this.selectedShape) {
      shape = createShape('SelectionBox', {
        shape: this.selectedShape,
        backgroundColor: "#000001",
        isMask: true
      });
      return lc.draw([shape], this.selectCtx);
    }
  };

  SelectShape.prototype._intToHex = function(i) {
    return ("000000" + (i.toString(16))).slice(-6);
  };

  SelectShape.prototype._getPixel = function(x, y, lc, ctx) {
    var p, pixel;
    p = lc.drawingCoordsToClientCoords(x, y);
    pixel = ctx.getImageData(p.x, p.y, 1, 1).data;
    if (pixel[3]) {
      return parseInt(this._rgbToHex(pixel[0], pixel[1], pixel[2]), 16);
    } else {
      return null;
    }
  };

  SelectShape.prototype._componentToHex = function(c) {
    var hex;
    hex = c.toString(16);
    return ("0" + hex).slice(-2);
  };

  SelectShape.prototype._rgbToHex = function(r, g, b) {
    return "" + (this._componentToHex(r)) + (this._componentToHex(g)) + (this._componentToHex(b));
  };

  return SelectShape;

})(Tool);


},{"../core/shapes":17,"./base":67}],66:[function(require,module,exports){
var Text, Tool, createShape, getIsPointInBox,
  extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  hasProp = {}.hasOwnProperty;

Tool = require('./base').Tool;

createShape = require('../core/shapes').createShape;

getIsPointInBox = function(point, box) {
  if (point.x < box.x) {
    return false;
  }
  if (point.y < box.y) {
    return false;
  }
  if (point.x > box.x + box.width) {
    return false;
  }
  if (point.y > box.y + box.height) {
    return false;
  }
  return true;
};

module.exports = Text = (function(superClass) {
  extend(Text, superClass);

  Text.prototype.name = 'Text';

  Text.prototype.iconName = 'text';

  Text.prototype.cursor = 'text';

  function Text() {
    this.text = '';
    this.currentShape = null;
    this.currentShapeState = null;
    this.initialShapeBoundingRect = null;
    this.dragAction = null;
    this.didDrag = false;
  }

  Text.prototype.didBecomeActive = function(lc) {
    var switchAway, unsubscribeFuncs, updateInputEl;
    unsubscribeFuncs = [];
    this.unsubscribe = (function(_this) {
      return function() {
        var func, i, len, results;
        results = [];
        for (i = 0, len = unsubscribeFuncs.length; i < len; i++) {
          func = unsubscribeFuncs[i];
          results.push(func());
        }
        return results;
      };
    })(this);
    switchAway = (function(_this) {
      return function() {
        _this._ensureNotEditing(lc);
        _this._clearCurrentShape(lc);
        return lc.repaintLayer('main');
      };
    })(this);
    updateInputEl = (function(_this) {
      return function() {
        return _this._updateInputEl(lc);
      };
    })(this);
    unsubscribeFuncs.push(lc.on('drawingChange', switchAway));
    unsubscribeFuncs.push(lc.on('zoom', updateInputEl));
    unsubscribeFuncs.push(lc.on('imageSizeChange', updateInputEl));
    unsubscribeFuncs.push(lc.on('snapshotLoad', (function(_this) {
      return function() {
        _this._clearCurrentShape(lc);
        return lc.repaintLayer('main');
      };
    })(this)));
    unsubscribeFuncs.push(lc.on('primaryColorChange', (function(_this) {
      return function(newColor) {
        if (!_this.currentShape) {
          return;
        }
        _this.currentShape.color = newColor;
        _this._updateInputEl(lc);
        return lc.repaintLayer('main');
      };
    })(this)));
    unsubscribeFuncs.push(lc.on('secondaryColorChange', (function(_this) {
      return function(newColor) {
        if (!_this.currentShape) {
          return;
        }
        _this.currentShape.bgColor = newColor;
        _this._updateInputEl(lc);
        return lc.repaintLayer('main');
      };
    })(this)));
    unsubscribeFuncs.push(lc.on('fontChange', (function(_this) {
      return function(font) {
        if (!_this.currentShape) {
          return;
        }
        _this.currentShape.setFont(font);
        _this._setShapesInProgress(lc);
        _this._updateInputEl(lc);
        return lc.repaintLayer('main');
      };
    })(this)));
    unsubscribeFuncs.push(lc.on('lc-pointermove', (function(_this) {
      return function(arg) {
        var br, point, selectionShape, x, y;
        x = arg.x, y = arg.y;
        if (!_this.currentShape) {
          return;
        }
        point = {
          x: x,
          y: y
        };
        br = _this.currentShape.getBoundingRect(lc.ctx);
        selectionShape = _this._getSelectionShape(lc.ctx);
        if (getIsPointInBox(point, br)) {
          return lc.setCursor("move");
        } else if (getIsPointInBox(point, selectionShape.getBottomRightHandleRect())) {
          return lc.setCursor('nwse-resize');
        } else if (getIsPointInBox(point, selectionShape.getTopLeftHandleRect())) {
          return lc.setCursor('nwse-resize');
        } else if (getIsPointInBox(point, selectionShape.getBottomLeftHandleRect())) {
          return lc.setCursor('nesw-resize');
        } else if (getIsPointInBox(point, selectionShape.getTopRightHandleRect())) {
          return lc.setCursor('nesw-resize');
        } else {
          return lc.setCursor(_this.cursor);
        }
      };
    })(this)));
    return unsubscribeFuncs.push(lc.on('dispose', (function(_this) {
      return function() {
        _this.commit(lc);
      };
    })(this)));
  };

  Text.prototype.willBecomeInactive = function(lc) {
    if (this.currentShape) {
      this._ensureNotEditing(lc);
      this.commit(lc);
    }
    return this.unsubscribe();
  };

  Text.prototype.setText = function(text) {
    return this.text = text;
  };

  Text.prototype._ensureNotEditing = function(lc) {
    if (this.currentShapeState === 'editing') {
      return this._exitEditingState(lc);
    }
  };

  Text.prototype._clearCurrentShape = function(lc) {
    this.currentShape = null;
    this.initialShapeBoundingRect = null;
    this.currentShapeState = null;
    return lc.setShapesInProgress([]);
  };

  Text.prototype.commit = function(lc) {
    if (this.currentShape.text) {
      lc.saveShape(this.currentShape);
    }
    this._clearCurrentShape(lc);
    return lc.repaintLayer('main');
  };

  Text.prototype._getSelectionShape = function(ctx, backgroundColor) {
    if (backgroundColor == null) {
      backgroundColor = null;
    }
    return createShape('SelectTool', {
      shape: this.currentShape,
      ctx: ctx,
      backgroundColor: backgroundColor,
      margin: 4
    });
  };

  Text.prototype._setShapesInProgress = function(lc) {
    switch (this.currentShapeState) {
      case 'selected':
        return lc.setShapesInProgress([this._getSelectionShape(lc.ctx), this.currentShape]);
      case 'editing':
        return lc.setShapesInProgress([this._getSelectionShape(lc.ctx, '#fff')]);
      default:
        return lc.setShapesInProgress([this.currentShape]);
    }
  };

  Text.prototype.begin = function(x, y, lc) {
    var br, point, selectionBox, selectionShape;
    if (x < 0 || y < 0 || x > lc.width || y > lc.height) {
      return;
    }
    this.dragAction = 'none';
    this.didDrag = false;
    if (this.currentShapeState === 'selected' || this.currentShapeState === 'editing') {
      br = this.currentShape.getBoundingRect(lc.ctx);
      selectionShape = this._getSelectionShape(lc.ctx);
      selectionBox = selectionShape.getBoundingRect();
      point = {
        x: x,
        y: y
      };
      if (getIsPointInBox(point, br)) {
        this.dragAction = 'move';
      }
      if (getIsPointInBox(point, selectionShape.getBottomRightHandleRect())) {
        this.dragAction = 'resizeBottomRight';
      }
      if (getIsPointInBox(point, selectionShape.getTopLeftHandleRect())) {
        this.dragAction = 'resizeTopLeft';
      }
      if (getIsPointInBox(point, selectionShape.getBottomLeftHandleRect())) {
        this.dragAction = 'resizeBottomLeft';
      }
      if (getIsPointInBox(point, selectionShape.getTopRightHandleRect())) {
        this.dragAction = 'resizeTopRight';
      }
      if (this.dragAction === 'none' && this.currentShapeState === 'editing') {
        this.dragAction = 'stop-editing';
        this._exitEditingState(lc);
      }
    } else {
      this.color = lc.getColor('primary');
      this.bgColor = lc.getColor('secondary');
      this.currentShape = createShape('Text', {
        x: x,
        y: y,
        text: this.text,
        color: this.color,
        bgColor: this.bgColor,
        font: lc.getFont(),
        v: 1
      });
      this.dragAction = 'place';
      this.currentShapeState = 'selected';
    }
    if (this.dragAction === 'none') {
      this.commit(lc);
      return;
    }
    this.initialShapeBoundingRect = this.currentShape.getBoundingRect(lc.ctx);
    this.dragOffset = {
      x: x - this.initialShapeBoundingRect.x,
      y: y - this.initialShapeBoundingRect.y
    };
    this._setShapesInProgress(lc);
    return lc.repaintLayer('main');
  };

  Text.prototype["continue"] = function(x, y, lc) {
    var br, brBottom, brRight;
    if (this.dragAction === 'none') {
      return;
    }
    br = this.initialShapeBoundingRect;
    brRight = br.x + br.width;
    brBottom = br.y + br.height;
    switch (this.dragAction) {
      case 'place':
        this.currentShape.x = x;
        this.currentShape.y = y;
        this.didDrag = true;
        break;
      case 'move':
        this.currentShape.x = x - this.dragOffset.x;
        this.currentShape.y = y - this.dragOffset.y;
        this.didDrag = true;
        break;
      case 'resizeBottomRight':
        this.currentShape.setSize(x - (this.dragOffset.x - this.initialShapeBoundingRect.width) - br.x, y - (this.dragOffset.y - this.initialShapeBoundingRect.height) - br.y);
        break;
      case 'resizeTopLeft':
        this.currentShape.setSize(brRight - x + this.dragOffset.x, brBottom - y + this.dragOffset.y);
        this.currentShape.setPosition(x - this.dragOffset.x, y - this.dragOffset.y);
        break;
      case 'resizeBottomLeft':
        this.currentShape.setSize(brRight - x + this.dragOffset.x, y - (this.dragOffset.y - this.initialShapeBoundingRect.height) - br.y);
        this.currentShape.setPosition(x - this.dragOffset.x, this.currentShape.y);
        break;
      case 'resizeTopRight':
        this.currentShape.setSize(x - (this.dragOffset.x - this.initialShapeBoundingRect.width) - br.x, brBottom - y + this.dragOffset.y);
        this.currentShape.setPosition(this.currentShape.x, y - this.dragOffset.y);
    }
    this._setShapesInProgress(lc);
    lc.repaintLayer('main');
    return this._updateInputEl(lc);
  };

  Text.prototype.end = function(x, y, lc) {
    if (!this.currentShape) {
      return;
    }
    this.currentShape.setSize(this.currentShape.forcedWidth, 0);
    if (this.currentShapeState === 'selected') {
      if (this.dragAction === 'place' || (this.dragAction === 'move' && !this.didDrag)) {
        this._enterEditingState(lc);
      }
    }
    this._setShapesInProgress(lc);
    lc.repaintLayer('main');
    return this._updateInputEl(lc);
  };

  Text.prototype._enterEditingState = function(lc) {
    var onChange;
    this.currentShapeState = 'editing';
    if (this.inputEl) {
      throw "State error";
    }
    this.inputEl = document.createElement('textarea');
    this.inputEl.className = 'text-tool-input';
    this.inputEl.style.position = 'absolute';
    this.inputEl.style.transformOrigin = '0px 0px';
    this.inputEl.style.border = 'none';
    this.inputEl.style.outline = 'none';
    this.inputEl.style.margin = '0';
    this.inputEl.style.padding = '4px';
    this.inputEl.style.zIndex = '1000';
    this.inputEl.style.overflow = 'hidden';
    this.inputEl.style.resize = 'none';
    this.inputEl.style.color = '#000';
    this.inputEl.value = this.currentShape.text;
    this.inputEl.addEventListener('mousedown', function(e) {
      return e.stopPropagation();
    });
    this.inputEl.addEventListener('touchstart', function(e) {
      return e.stopPropagation();
    });
    onChange = (function(_this) {
      return function(e) {
        _this.currentShape.setText(e.target.value);
        _this.currentShape.enforceMaxBoundingRect(lc);
        _this._setShapesInProgress(lc);
        lc.repaintLayer('main');
        _this._updateInputEl(lc);
        return e.stopPropagation();
      };
    })(this);
    this.inputEl.addEventListener('keydown', (function(_this) {
      return function() {
        return _this._updateInputEl(lc, true);
      };
    })(this));
    this.inputEl.addEventListener('keyup', onChange);
    this.inputEl.addEventListener('change', onChange);
    this._updateInputEl(lc);
    lc.containerEl.appendChild(this.inputEl);
    this.inputEl.focus();
    return this._setShapesInProgress(lc);
  };

  Text.prototype._exitEditingState = function(lc) {
    this.currentShapeState = 'selected';
    lc.containerEl.removeChild(this.inputEl);
    this.inputEl = null;
    this._setShapesInProgress(lc);
    return lc.repaintLayer('main');
  };

  Text.prototype._updateInputEl = function(lc, withMargin) {
    var br, transformString;
    if (withMargin == null) {
      withMargin = false;
    }
    if (!this.inputEl) {
      return;
    }
    br = this.currentShape.getBoundingRect(lc.ctx, true);
    this.inputEl.style.font = this.currentShape.font;
    this.inputEl.style.backgroundColor = this.currentShape.bgColor;
    this.inputEl.style.left = (lc.position.x / lc.backingScale + br.x * lc.scale - 4) + "px";
    this.inputEl.style.top = (lc.position.y / lc.backingScale + br.y * lc.scale - 4) + "px";
    if (withMargin && !this.currentShape.forcedWidth) {
      this.inputEl.style.width = (br.width + 5 + this.currentShape.renderer.emDashWidth) + "px";
    } else {
      this.inputEl.style.width = (br.width + 7) + "px";
    }
    if (withMargin) {
      this.inputEl.style.height = (br.height + 8 + this.currentShape.renderer.metrics.leading) + "px";
    } else {
      this.inputEl.style.height = (br.height + 8) + "px";
    }
    transformString = "scale(" + lc.scale + ")";
    this.inputEl.style.transform = transformString;
    this.inputEl.style.webkitTransform = transformString;
    this.inputEl.style.MozTransform = transformString;
    this.inputEl.style.msTransform = transformString;
    return this.inputEl.style.OTransform = transformString;
  };

  Text.prototype.optionsStyle = 'font-attributes-color-palette';

  return Text;

})(Tool);


},{"../core/shapes":17,"./base":67}],67:[function(require,module,exports){
var Tool, ToolWithStroke, tools,
  extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  hasProp = {}.hasOwnProperty;

tools = {};

tools.Tool = Tool = (function() {
  function Tool() {}

  Tool.prototype.name = null;

  Tool.prototype.iconName = null;

  Tool.prototype.cursor = null;

  Tool.prototype.usesSimpleAPI = true;

  Tool.prototype.begin = function(x, y, lc) {};

  Tool.prototype["continue"] = function(x, y, lc) {};

  Tool.prototype.end = function(x, y, lc) {};

  Tool.prototype.optionsStyle = null;

  Tool.prototype.didBecomeActive = function(lc) {};

  Tool.prototype.willBecomeInactive = function(lc) {};

  return Tool;

})();

tools.ToolWithStroke = ToolWithStroke = (function(superClass) {
  extend(ToolWithStroke, superClass);

  function ToolWithStroke(lc) {
    this.strokeWidth = lc.opts.defaultStrokeWidth;
  }

  ToolWithStroke.prototype.optionsStyle = 'stroke-palette';

  ToolWithStroke.prototype.didBecomeActive = function(lc) {
    var unsubscribeFuncs;
    unsubscribeFuncs = [];
    this.unsubscribe = (function(_this) {
      return function() {
        var func, i, len, results;
        results = [];
        for (i = 0, len = unsubscribeFuncs.length; i < len; i++) {
          func = unsubscribeFuncs[i];
          results.push(func());
        }
        return results;
      };
    })(this);
    return unsubscribeFuncs.push(lc.on('setStrokeWidth', (function(_this) {
      return function(strokeWidth) {
        _this.strokeWidth = strokeWidth;
        return lc.trigger('toolDidUpdateOptions');
      };
    })(this)));
  };

  ToolWithStroke.prototype.willBecomeInactive = function(lc) {
    return this.unsubscribe();
  };

  return ToolWithStroke;

})(Tool);

module.exports = tools;


},{}]},{},[22])(22)
});