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
	if (draggable.options.html5draggable) {
		draggable.element.setAttribute('draggable', 'true');
		draggable.element.addEventListener('dragstart', dragStart, false);
	} else {
		draggable.element.addEventListener('mousedown', mouseDown, false);
		draggable.element.addEventListener('touchstart', mouseDown, false);
	    	draggable.element.addEventListener('mouseup', mouseUp, false);
	}
}
