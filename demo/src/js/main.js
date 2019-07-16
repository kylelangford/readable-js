(function() {
	// Tween Page Load
	document.querySelector('body').classList.add('tween');

	// grab an element
	var parent = document.querySelector('.make-readable');
	var elements = document.querySelectorAll('.make-readable p');

	// construct an instance of Readable, passing the element
	// var readable = new Readable(parent, elements, options);
	if (parent) {
		var readable = new Readable(parent, elements);

		// initialise
		readable.init();
	}
})();
