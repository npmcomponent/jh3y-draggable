module.exports = draggable;

function draggable(element, html5draggable) {
	if (!(this instanceof draggable)) return new draggable(element);
	this.element = element;
	this.html5draggable = (html5draggable === undefined) ? false : html5draggable;
	this._create();
}
draggable.prototype._create = function () {
	var draggable = this;
	var move = function (event) {
		draggable.element.style.position = 'absolute';
		draggable.element.style.top = (event.clientY - draggable.offY) + 'px';
		draggable.element.style.left = (event.clientX - draggable.offX) + 'px';
	};	
	var mouseUp = function () {
		window.removeEventListener('mousemove', move, true);
	};
	var mouseDown = function (event) {
		draggable.offY = event.clientY - parseInt(draggable.element.offsetTop);
		draggable.offX = event.clientX - parseInt(draggable.element.offsetLeft);
		window.addEventListener('mousemove', move, true);
	};
	var dragStart = function (event) {
		event.dataTransfer.effectAllowed = 'move';
		event.dataTransfer.setData("text/html", draggable.element);
	};
	if (draggable.html5draggable) {
		draggable.element.setAttribute('draggable', 'true');
		draggable.element.addEventListener('dragstart', dragStart, false);
	} else {
		draggable.element.addEventListener('mousedown', mouseDown, false);
	    	window.addEventListener('mouseup', mouseUp, false);
	}
}
