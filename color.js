var Color = function(r, g, b) {
	this.r;
	this.g;
	this.b;
	this.a = 1.0;

	this.value = null;
	this.is_greyscale = false;

	if( r && (g === undefined || b === undefined) ) {
		this.is_greyscale = true;
		this.value = r;

		this.r     = this.value;
		this.g     = this.value;
		this.b     = this.value;
	}

	this.setAlpha = function(alpha) {
		this.a = alpha;
	}

	this.to255 = function() {
		return {
			r: this.r * 255,
			g: this.g * 255,
			b: this.b * 255,
			a: this.a * 255
		};
	}
}