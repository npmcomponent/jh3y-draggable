
# draggable

  Make a draggable component.

## Installation

  Install with [component(1)](http://component.io):

    $ component install jheytompkins/draggable

## Demo

 A simple demo of making a draggable div can be seen [here](http://jsfiddle.net/PvDLp/).

## API

It's really simple. Basically just create a new draggable by passing in the element that you want to be draggable as a parameter.

Example:

	var draggable = require('draggable');
	var element = document.querySelector('.myDraggable');
	element.style.height = '50px';
	element.style.width = '50px';
	element.style.background = 'red';
	var myDrag = new draggable(element);	

## License

  MIT
