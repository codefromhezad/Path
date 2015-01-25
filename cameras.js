var Camera = {};

Camera.orthographic = function(opts) {
	this.defaults = {
		position: $V([0, 0, -2]),
		viewportWidth: 20,
		viewportDistance: 10
	}
	this.options = extend(this.defaults, opts);

	this.position = this.options.position;
	this.viewportWidth = this.options.viewportWidth;
	this.viewportHeight = this.options.viewportWidth * Engine.aspectRatio;
	this.viewportDistance =this.options.viewportDistance;

	this.position.elements[2] -= this.viewportDistance;

	this.getRay = function(x, y) {
		var d = $V([0, 0, 1]);
		var xLerp = x / Engine.width;
		var yLerp = y / Engine.height;

		var pArr = [];
		pArr[0] = -this.viewportWidth * 0.5 + this.viewportWidth * xLerp;
		pArr[1] = this.viewportHeight * 0.5 - this.viewportHeight * yLerp;
		pArr[2] = -this.viewportDistance;

		var p = $V(pArr);

		return new Ray(p, d);
	}
}


Camera.perspective = function(opts) {
	this.defaults = {
		position: $V([0, 0, -2]),
		direction: $V([0, 0, 1]),
		viewportWidth: 20,
		viewportDistance: 10
	}
	this.options = extend(this.defaults, opts);

	this.position = this.options.position;
	this.viewportWidth = this.options.viewportWidth;
	this.viewportHeight = this.options.viewportWidth * Engine.aspectRatio;
	this.viewportDistance =this.options.viewportDistance;

	this.position.elements[2] -= this.viewportDistance;

	this.getRay = function(x, y) {
		var xLerp = x / Engine.width;
		var yLerp = y / Engine.height;

		var pArr = [];
		pArr[0] = -this.viewportWidth * 0.5 + this.viewportWidth * xLerp;
		pArr[1] = this.viewportHeight * 0.5 - this.viewportHeight * yLerp;
		pArr[2] = -this.viewportDistance;

		var d = $V([pArr[0], pArr[1], this.viewportDistance]).toUnitVector();
		var p = this.position;

		return new Ray(p, d);
	}
}