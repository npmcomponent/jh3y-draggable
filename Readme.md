# draggable

  Make an element draggable with configurable behaviours. Compatible with [component](https://github.com/component/component) package manager.

## Demo

 A simple demo of making a draggable div can be seen [here](http://jsfiddle.net/PvDLp/6/).

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

	pens: NodeList/array of elements - These define element that a draggable will snap into.
	allowedOutOfPen: true/false - This defines whether a draggable can be dragged out of pens or whether it must always be contained within one of its defined pens.
	contained: true/false - This defines whether a draggable can be dragged outside of its parent or not.
	
An example of passing in options for pens: 

	var myPennedDrag = new draggable(element, {
		pens: document.querySelector('.pen')
	});
	
Examples of all these behaviours can be seen in the [demo](http://jsfiddle.net/PvDLp/6/) or in the [example](https://github.com/jheytompkins/draggable/blob/master/example.html) page.

## Use without component package manager

 If you want to use draggable without the [component](https://github.com/component/component) package manager you can by simply adding [jheytompkins_draggable.js](https://github.com/jheytompkins/draggable/master/jheytompkins_draggable.js) to your script files and using in the following way:

	 		var wheel = new jheytompkins_draggable(element, {
	 			pens: false,
	 			isAllowedOutOfPen: true,
	 			contained: false
	 		});


## Installation

  Install with [component(1)](http://component.io):

    $ component install jheytompkins/draggable

## License

  MIT
