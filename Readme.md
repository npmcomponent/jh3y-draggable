# draggable

  Make an element draggable with configurable behaviours. Compatible with [component](https://github.com/component/component) package manager.

## Demo

 A simple demo of making a draggable div can be seen [here](http://jsfiddle.net/PvDLp/8/).

## API

It's really simple. Basically just create a new draggable by passing in the element that you want to be draggable as a parameter.

Example:

	var draggable = require('draggable');
	var element = document.querySelector('.myDraggable');
	element.style.height = '50px';
	element.style.width = '50px';
	element.style.background = 'red';
	var myDrag = new draggable(element);
	
	
There are also options you can pass in to configure the draggables behaviour. These are as follows:

	pens: NodeList/array of elements - Define elements that a draggable will snap into.
	roam: true/false [default: true] - Defines whether a draggable can be dragged out of pens or whether it must always be contained within one of its defined pens.
	contained: true/false [default: false] - Defines whether a draggable can be dragged outside of its parent or not.
	vertical: true/false [default: true] - Defines whether a draggable can be dragged vertically.
	horizontal: true/false [default: true] - Defines whether a draggable can be dragged horizontally.
	ghosting: true/false [default: false] - Define whether draggable has ghosting effect (see demo).
	
An example of passing in options for pens: 

	var myPennedDrag = new draggable(element, {
		pens: document.querySelector('.pen')
	});

There are also some methods you can use on your draggable:

	setPens(NodeList - array of elements): set pen elements for draggable to snap to.
	setContained(bool): set whether a draggable is contained.
	setRoam(bool): set whether a draggable can roam outside of pens.
	setVertical(bool): set whether a draggable can be dragged vertically.
	setHorizontal(bool): set whether a draggable can be dragged horizontally.
	setGhosting(bool): set whether a draggable has the ghosting effect.

Example:

	var myDrag = new draggable(element);
	myDrag.setGhosting(true);
	
Examples of all these behaviours can be seen in the [demo](http://jsfiddle.net/PvDLp/6/) or in the [example](https://github.com/jh3y/draggable/blob/master/example.html) page.

## Use without component package manager

 If you want to use draggable without the [component](https://github.com/component/component) package manager you can by simply adding [jh3y_draggable.js](https://github.com/jh3y/draggable/blob/master/jh3y-draggable.js) to your script files and using in the following way:

	 		var draggable = new jh3y_draggable(element, {
	 			pens: false,
	 			isAllowedOutOfPen: true,
	 			contained: false
	 		});


## Installation

  Install with [component(1)](http://component.io):

    $ component install jh3y/draggable

## License

  MIT
