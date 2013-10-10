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
	this.defaults = {
		contained: false,
		pens: false
	};
	var extend = function (a, b) {
		for(var key in b) {
			if (b.hasOwnProperty(key)) {
				a[key] = b[key];
			}
		}
		return a;
	}
	this.options = extend(this.defaults, options);
	this.parent = (this.options.contained) ? this.element.parentNode: window;
	this.allowedOutOfPen = (this.options.allowedOutOfPen  !== undefined) ? this.options.allowedOutOfPen : true;
	this.pens = this.options.pens;
	this._create();
}
draggable.prototype._create = function () {
	var draggable = this;
	var move = function (event) {
		draggable.element.style.position = 'absolute';
		draggable.newY = event.clientY - draggable.offY;
		draggable.newX = event.clientX - draggable.offX;
		if (draggable.options.contained) {
			if (draggable.newX < draggable.boundsXL) {
				draggable.newX = draggable.boundsXL;
			}
			if (draggable.newX > draggable.boundsXR) {
				draggable.newX = draggable.boundsXR;
			}
			if (draggable.newY > draggable.boundsXB) {
				draggable.newY = draggable.boundsXB;
			}
			if (draggable.newY < draggable.boundsXT) {
				draggable.newY = draggable.boundsXT;
			}
		}
		draggable.element.style.left = draggable.newX + 'px';
		draggable.element.style.top = draggable.newY + 'px';
	};	
	var mouseUp = function () {
		draggable.parent.removeEventListener('mousemove', move, true);
		if (draggable.pens && draggable.pens.length > 0) {
			var penned = false,
				currentPen = draggable.element.parentNode;
			[].forEach.call(draggable.pens, function (pen) {
				if (draggable.newX < (pen.offsetLeft + pen.offsetWidth) && draggable.newX > (pen.offsetLeft - draggable.element.offsetWidth) && draggable.newY > (pen.offsetTop - draggable.element.offsetHeight) && draggable.newY < (pen.offsetTop + pen.offsetHeight + draggable.element.offsetHeight)) {
					penned = true;
					draggable.element.style.position = '';
					pen.appendChild(draggable.element);
				} 
			});
			if (!penned) {
				if (draggable.allowedOutOfPen) {
					document.querySelector('body').appendChild(draggable.element);
				} else {
					currentPen.appendChild(draggable.element);
					draggable.element.style.position = '';
				}
			}
		}
	};
	var mouseDown = function (event) {
		draggable.offY = event.clientY - parseInt(draggable.element.offsetTop);
		draggable.offX = event.clientX - parseInt(draggable.element.offsetLeft);
		draggable.boundsXR = (draggable.parent.offsetLeft + draggable.parent.offsetWidth) - draggable.element.offsetWidth;
		draggable.boundsXL = draggable.parent.offsetLeft;
		draggable.boundsXT = draggable.parent.offsetTop;
		draggable.boundsXB = (draggable.parent.offsetTop + draggable.parent.offsetHeight) - draggable.element.offsetHeight;
		draggable.parent.addEventListener('mousemove', move, true);
	};
	var dragStart = function (event) {
		event.dataTransfer.effectAllowed = 'move';
		event.dataTransfer.setData("text/html", draggable.element);
	};
	draggable.element.addEventListener('mousedown', mouseDown, false);
	draggable.element.addEventListener('touchstart', mouseDown, false);
    	draggable.element.addEventListener('mouseup', mouseUp, false);
}

});
require.alias("draggable/index.js", "draggable/index.js");if (typeof exports == "object") {
  module.exports = require("draggable");
} else if (typeof define == "function" && define.amd) {
  define(function(){ return require("draggable"); });
} else {
  this["jheytompkins-draggable"] = require("draggable");
}})();