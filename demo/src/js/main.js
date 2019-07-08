(function() {
	// Tween Page Load
	document.querySelector('body').classList.add('tween');

	// grab an element
	var myElement = document.querySelector('.make-readable');
	// construct an instance of Headroom, passing the element
	var readable = new Readable(myElement);
	// initialise
	readable.init();
})();
