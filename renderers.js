var Renderer = {};

Renderer.pathtracer = function() {

	this.seedVector = null;
	this.traceDepth = 6;

	this.vecOrtho = function(v) {
	    if( Math.abs(v.elements[0]) > Math.abs(v.elements[2]) ) {
	    	return $V([-v.elements[1], v.elements[0], 0.0]);
	    } else {
	    	return $V([0.0, -v.elements[2], v.elements[1]]);
	    }
	}

	this.rand2n = function() {
		this.seedVector = this.seedVector.add($V([-1, 1]));
	    return $V([ Math.sin(globals.currentScreenX * Math.random()) % 1, Math.cos(globals.currentScreenY * Math.random()) % 1])
	}

	this.getRandomVectorInHemisphere = function(normal) {
		var dir = normal.toUnitVector();;
		var o1  = this.vecOrtho(dir).toUnitVector();
		var o2  = dir.cross(o1).toUnitVector();;
		var r = this.rand2n();
		r.elements[0] = r.elements[0] * 2 * Math.PI;

		var oneminus = Math.sqrt(1.0 - r.elements[1] * r.elements[1]);
		var p1 = o1.multiply(Math.cos(r.elements[0]) * oneminus);
		var p2 = o2.multiply(Math.sin(r.elements[0]) * oneminus);
		var p3 = dir.multiply(r.elements[1]);

		return p1.add(p2).add(p3);
	}

	this.getColor = function(intersection) {
		if( intersection ) {
			var hitPosition = intersection.ray.origin.add(intersection.ray.direction.multiply(intersection.distance));
			var hitNormal = intersection.object.getNormal(hitPosition);
			var luminance = 1.0;

			var Albedo = 1.2;
			var matColor = 0.45;

			for(var i = 0; i < this.traceDepth; i++) {
				this.seedVector = $V([
					globals.currentScreenX,
					globals.currentScreenY
				]).multiply(i);

				var newDir = this.getRandomVectorInHemisphere(hitNormal);
				luminance *= 2.0 * matColor * Albedo * newDir.dot(hitNormal);
				var newOrigin = hitPosition.add(hitNormal.multiply(MIN_DIST * 2))

				var newRay = new Ray(newOrigin, newDir);

				var newIntersect = newRay.cast(Engine.objects); 
				if( ! newIntersect ) {
					return new Color(luminance);
				}
			}
		}

		return new Color(0.0);
	}
}

Renderer.zBuffer = function(opts) {

	this.defaults = {
		minDepth: 0,
		maxDepth: 20 
	}

	this.options = extend(this.defaults, opts);

	this.getColor = function(intersection) {
		if( intersection ) {

			var hitPosition = intersection.ray.origin.add(intersection.ray.direction.multiply(intersection.distance));
			var zValue = hitPosition.elements[2];

			if( zValue < this.options.minDepth ) {
				zValue = this.options.minDepth;
			}
			if( zValue > this.options.maxDepth ) {
				zValue = this.options.maxDepth;
			}
			zValue /= (this.options.maxDepth - this.options.minDepth);

			return new Color(zValue);
		}

		return new Color(0.0);
	}
}