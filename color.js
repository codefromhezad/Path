var Color = function(r, g, b) {
	this.is_color_object = true;

	this.r = r;
	this.g = g;
	this.b = b;
	this.a = 1.0;

	this.value = null;
	this.is_greyscale = false;

	this.update = function() {
		if( (this.r !== undefined && (this.g === undefined || this.b === undefined)) ||
		    (this.r == this.g == this.b)
		) {
			this.setGreyscale(this.r);
		} else if( r === undefined ) {
			this.setGreyscale(0.0);
		} 
		return this;
	}

	this.setGreyscale = function(value) {
		this.is_greyscale = true;
		this.value = r;

		this.r     = this.value;
		this.g     = this.value;
		this.b     = this.value;
	}

	this.multiply = function(v) {
		if( isNumber(v) ) {
			v = new Color(v);
		}
		
		var newColor = new Color(
			this.r * v.r,
			this.g * v.g,
			this.b * v.b
		);
		newColor.update();
		return newColor;
	}

	this.add = function(v) {
		if( isNumber(v) ) {
			v = new Color(v);
		}
		
		var newColor = new Color(
			this.r + v.r,
			this.g + v.g,
			this.b + v.b
		);
		newColor.update();
		return newColor;
	}

	this.setAlpha = function(alpha) {
		this.a = alpha;
	}

	this.to255 = function() {
		return {
			r: Math.floor(this.r * 255),
			g: Math.floor(this.g * 255),
			b: Math.floor(this.b * 255),
			a: Math.floor(this.a * 255)
		};
	}

	this.toCSS = function() {
		return "rgba("+Math.floor(this.r * 255)+", "+Math.floor(this.g * 255)+", "+Math.floor(this.b * 255)+", "+this.a+")";
	}

	this.update();
}