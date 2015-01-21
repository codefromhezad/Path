var Camera = {};

Camera.orthographic = function(position, viewportWidth, viewportDistance) {
	this.position = position;
	this.viewportWidth = viewportWidth;
	this.viewportHeight = viewportWidth * Engine.aspectRatio;
	
	this.viewportDistance = viewportDistance;
	this.position.elements[2] -= viewportDistance;

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