;(function(){

/**
 * Require the given path.
 *
 * @param {String} path
 * @return {Object} exports
 * @api public
 */

function require(path, parent, orig) {
  var resolved = require.resolve(path);

  // lookup failed
  if (null == resolved) {
    orig = orig || path;
    parent = parent || 'root';
    var err = new Error('Failed to require "' + orig + '" from "' + parent + '"');
    err.path = orig;
    err.parent = parent;
    err.require = true;
    throw err;
  }

  var module = require.modules[resolved];

  // perform real require()
  // by invoking the module's
  // registered function
  if (!module._resolving && !module.exports) {
    var mod = {};
    mod.exports = {};
    mod.client = mod.component = true;
    module._resolving = true;
    module.call(this, mod.exports, require.relative(resolved), mod);
    delete module._resolving;
    module.exports = mod.exports;
  }

  return module.exports;
}

/**
 * Registered modules.
 */

require.modules = {};

/**
 * Registered aliases.
 */

require.aliases = {};

/**
 * Resolve `path`.
 *
 * Lookup:
 *
 *   - PATH/index.js
 *   - PATH.js
 *   - PATH
 *
 * @param {String} path
 * @return {String} path or null
 * @api private
 */

require.resolve = function(path) {
  if (path.charAt(0) === '/') path = path.slice(1);

  var paths = [
    path,
    path + '.js',
    path + '.json',
    path + '/index.js',
    path + '/index.json'
  ];

  for (var i = 0; i < paths.length; i++) {
    var path = paths[i];
    if (require.modules.hasOwnProperty(path)) return path;
    if (require.aliases.hasOwnProperty(path)) return require.aliases[path];
  }
};

/**
 * Normalize `path` relative to the current path.
 *
 * @param {String} curr
 * @param {String} path
 * @return {String}
 * @api private
 */

require.normalize = function(curr, path) {
  var segs = [];

  if ('.' != path.charAt(0)) return path;

  curr = curr.split('/');
  path = path.split('/');

  for (var i = 0; i < path.length; ++i) {
    if ('..' == path[i]) {
      curr.pop();
    } else if ('.' != path[i] && '' != path[i]) {
      segs.push(path[i]);
    }
  }

  return curr.concat(segs).join('/');
};

/**
 * Register module at `path` with callback `definition`.
 *
 * @param {String} path
 * @param {Function} definition
 * @api private
 */

require.register = function(path, definition) {
  require.modules[path] = definition;
};

/**
 * Alias a module definition.
 *
 * @param {String} from
 * @param {String} to
 * @api private
 */

require.alias = function(from, to) {
  if (!require.modules.hasOwnProperty(from)) {
    throw new Error('Failed to alias "' + from + '", it does not exist');
  }
  require.aliases[to] = from;
};

/**
 * Return a require function relative to the `parent` path.
 *
 * @param {String} parent
 * @return {Function}
 * @api private
 */

require.relative = function(parent) {
  var p = require.normalize(parent, '..');

  /**
   * lastIndexOf helper.
   */

  function lastIndexOf(arr, obj) {
    var i = arr.length;
    while (i--) {
      if (arr[i] === obj) return i;
    }
    return -1;
  }

  /**
   * The relative require() itself.
   */

  function localRequire(path) {
    var resolved = localRequire.resolve(path);
    return require(resolved, parent, path);
  }

  /**
   * Resolve relative to the parent.
   */

  localRequire.resolve = function(path) {
    var c = path.charAt(0);
    if ('/' == c) return path.slice(1);
    if ('.' == c) return require.normalize(p, path);

    // resolve deps by returning
    // the dep in the nearest "deps"
    // directory
    var segs = parent.split('/');
    var i = lastIndexOf(segs, 'deps') + 1;
    if (!i) i = 0;
    path = segs.slice(0, i + 1).join('/') + '/deps/' + path;
    return path;
  };

  /**
   * Check if module is defined at `path`.
   */

  localRequire.exists = function(path) {
    return require.modules.hasOwnProperty(localRequire.resolve(path));
  };

  return localRequire;
};
require.register("draggable/index.js", function(exports, require, module){
module.exports = draggable;

function draggable(element, options) {
  if (!(this instanceof draggable)) return new draggable(element);
  this.element = element;
  this._defaults = {
    contained: false,
    pens: false,
    vertical: true,
    horizontal: true
  };
  var extend = function (a, b) {
    for(var key in b) {
      if (b.hasOwnProperty(key)) {
        a[key] = b[key];
      }
    }
    return a;
  }
  this._options = extend(this._defaults, options);
  this._parent = (this._options.contained) ? this.element.parentNode: window;
  this._roam = (this._options.roam  !== undefined) ? this._options.roam : true;
  this._contained = (this._options.contained !== undefined) ? this._options.contained : false;
  this._pens = this._options.pens;
  this._vertical = (this._options.vertical !== undefined) ? this._options.vertical : true;
  this._horizontal = (this._options.horizontal !== undefined) ? this._options.horizontal : true;
  this._ghosting = (this._options.ghosting !== undefined) ? this._options.ghosting : false;
  this._create();
}
draggable.prototype.setPens = function (pens) {
  if (pens) {
    this._pens = pens;
  }
}
draggable.prototype.setContained = function (contained) {
  if (contained !== undefined) {
    this._contained = contained;
  }
}
draggable.prototype.setRoam = function (roam) {
  if (roam !== undefined) {
    this._roam = roam;
  }
}
draggable.prototype.setVertical = function (vertical) {
  if (vertical !== undefined) {
    this._vertical = vertical;
  }
}
draggable.prototype.setHorizontal = function (horizontal) {
  if (horizontal !== undefined) {
    this._horizontal = horizontal;
  }
}
draggable.prototype.setGhosting = function (ghosting) {
  if (ghosting !== undefined) {
    this._ghosting = ghosting;
  }
}
draggable.prototype._create = function () {
  var draggable = this,
    ghost,
    drag = function (event) {
      //TODO: really cool that on move here you could almost make online paint, didn't even think of that.
      // ghost = draggable.element.cloneNode();
      // ghost.style.opacity = 0.5;
      // document.querySelector('body').appendChild(ghost);
      draggable.element.style.position = 'absolute';
      draggable._newY = event.clientY - draggable._offY;
      draggable._newX = event.clientX - draggable._offX;
      if (draggable._contained) { 
        if (draggable._newX < draggable._boundsXL) {
          draggable._newX = draggable._boundsXL;
        }
        if (draggable._newX > draggable._boundsXR) {
          draggable._newX = draggable._boundsXR;
        }
        if (draggable._newY > draggable._boundsXB) {
          draggable._newY = draggable._boundsXB;
        }
        if (draggable._newY < draggable._boundsXT) {
          draggable._newY = draggable._boundsXT;
        }
      }
      if (draggable._horizontal) {
        draggable.element.style.left = draggable._newX + 'px';
      }
      if (draggable._vertical) {
        draggable.element.style.top = draggable._newY + 'px';
      }
    },
    endDrag = function () {
      if (ghost !== undefined) {
        ghost.remove();
      }
      draggable._parent.removeEventListener('mousemove', drag, true);
      if (draggable._pens && draggable._pens.length > 0) {
        var penned = false,
          currentPen = draggable.element.parentNode,
          isAPen = function (element) {
            for (var i = 0; i <= draggable._pens.length - 1; i++) {
              if (currentPen === draggable._pens[i]) {
                return true;
              }
            };
          };
        for (var i = 0; i < draggable._pens.length - 1; i++) {
          if (draggable._newX < (draggable._pens[i].offsetLeft + draggable._pens[i].offsetWidth) && draggable._newX > (draggable._pens[i].offsetLeft - draggable.element.offsetWidth) && draggable._newY > (draggable._pens[i].offsetTop - draggable.element.offsetHeight) && draggable._newY < (draggable._pens[i].offsetTop + draggable._pens[i].offsetHeight + draggable.element.offsetHeight)) {
            penned = true;
            draggable.element.style.position = '';
            draggable._pens[i].appendChild(draggable.element);
            break;
          }
        };
        if (!penned) {
          if (draggable._roam) {
            document.querySelector('body').appendChild(draggable.element);
          } else {
            if (isAPen(currentPen)) {
              currentPen.appendChild(draggable.element);
              draggable.element.style.position = '';
            }
          }
        }
      }
    },
    startDrag = function (event) {
      draggable._offY = event.clientY - parseInt(draggable.element.offsetTop);
      draggable._offX = event.clientX - parseInt(draggable.element.offsetLeft);
      draggable._boundsXR = (draggable._parent.offsetLeft + draggable._parent.offsetWidth) - draggable.element.offsetWidth;
      draggable._boundsXL = draggable._parent.offsetLeft;
      draggable._boundsXT = draggable._parent.offsetTop;
      draggable._boundsXB = (draggable._parent.offsetTop + draggable._parent.offsetHeight) - draggable.element.offsetHeight;
      if (draggable._ghosting) {
        ghost = draggable.element.cloneNode();
        draggable.element.parentNode.appendChild(ghost);
        ghost.style.opacity = 0.2;
        ghost.style.position = 'absolute';
        ghost.style.left = draggable.element.offsetLeft + 'px';
        ghost.style.top = draggable.element.offsetTop + 'px';
      } 
      draggable._parent.addEventListener('mousemove', drag, true);
    };
  draggable.element.addEventListener('mousedown', startDrag, false);
      draggable.element.addEventListener('mouseup', endDrag, false);
}

});
require.alias("draggable/index.js", "draggable/index.js");if (typeof exports == "object") {
  module.exports = require("draggable");
} else if (typeof define == "function" && define.amd) {
  define(function(){ return require("draggable"); });
} else {
  this["jheytompkins-draggable"] = require("draggable");
}})();