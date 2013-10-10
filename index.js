module.exports = draggable;

function draggable(element, options) {
	if (!(this instanceof draggable)) return new draggable(element);
	this.element = element;
	this.defaults = {
		html5draggable: false,
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
	this._create();
}
draggable.prototype._create = function () {
	var draggable = this;
	var move = function (event) {
		draggable.element.style.position = 'absolute';
		var newY = event.clientY - draggable.offY;
		var newX = event.clientX - draggable.offX;
		if (draggable.options.contained) {
			if (newX < draggable.boundsXL) {
				newX = draggable.boundsXL;
			}
			if (newX > draggable.boundsXR) {
				newX = draggable.boundsXR;
			}
			if (newY > draggable.boundsXB) {
				newY = draggable.boundsXB;
			}
			if (newY < draggable.boundsXT) {
				newY = draggable.boundsXT;
			}
		}
		draggable.element.style.left = newX + 'px';
		draggable.element.style.top = newY + 'px';
	};	
	var mouseUp = function () {
		draggable.parent.removeEventListener('mousemove', move, true);
		//snap to bind goes in here. if any of the following elements are being hovered over to append to this for now.
		// this could be a set of classes or a specific element that can be dropped into or the likes.
		if (draggable.pens && draggable.pens.length > 0) {
			//have to check whether the draggable is in there.
			console.log('ets snap to something then.');
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
	if (draggable.options.html5draggable) {
		draggable.element.setAttribute('draggable', 'true');
		draggable.element.addEventListener('dragstart', dragStart, false);
	} else {
		draggable.element.addEventListener('mousedown', mouseDown, false);
		draggable.element.addEventListener('touchstart', mouseDown, false);
	    	draggable.element.addEventListener('mouseup', mouseUp, false);
	}
}
