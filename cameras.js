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
		position: $V([0, 1, -2]),
		lookAt: $V([0, 0, 10]),
		viewportWidth: 20,
		viewportDistance: 10
	}
	this.options = extend(this.defaults, opts);

	this.position = this.options.position;
	this.lookAt = this.options.lookAt;
	this.viewportWidth = this.options.viewportWidth;
	this.viewportHeight = this.options.viewportWidth * Engine.aspectRatio;
	this.viewportDistance = this.options.viewportDistance;

	var xLerp = this.viewportWidth / Engine.width;
	var yLerp = this.viewportHeight / Engine.height;

	var upVector = $V([0, 1, 0]);

	var rightVector = this.position.subtract(this.lookAt).cross( upVector.subtract(this.position) ).toUnitVector();
	var d = this.lookAt.subtract(this.position).toUnitVector();

	var v1 = d.multiply(this.viewportDistance);
	var v2 = upVector.multiply(this.viewportHeight * 0.5);
	var v3 = rightVector.multiply(this.viewportWidth * 0.5);

	var viewPlaneUpLeft = this.position.add(v1).add(v2).subtract(v3);

	this.getRay = function(x, y) {
		var rightFactor = rightVector.multiply(xLerp * x);
		var upFactor    = upVector.multiply(yLerp * y);

		var pixelViewVector = viewPlaneUpLeft.add(rightFactor).subtract(upFactor);
		
		return new Ray(this.position, pixelViewVector);
	}
}