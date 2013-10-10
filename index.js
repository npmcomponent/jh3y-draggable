module.exports = draggable;

function draggable(element) {
	if (!(this instanceof draggable)) return new draggable(element);
	this.element = element;
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
	draggable.element.addEventListener('mousedown', mouseDown, false);
    	window.addEventListener('mouseup', mouseUp, false);
}
