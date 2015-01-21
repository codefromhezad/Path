var Renderer = {};

Renderer.pathtracer = function() {

	this.vecOrtho = function(v) {
	    if( Math.abs(v.elements[0]) > Math.abs(v.elements[2]) ) {
	    	return $V([-v.elements[1], v.elements[0], 0.0]);
	    } else {
	    	return $V([0.0, -v.elements[2], v.elements[1]]);
	    }
	}

	this.rand2n = function() {
	    return $V([ (globals.currentScreenX + Math.random()) % 1, (globals.currentScreenY + Math.random()) % 1])
	}

	this.getRandomVectorInHemisphere = function(normal) {
		var o1 = this.vecOrtho(normal).toUnitVector();
		var o2 = normal.cross(o1).toUnitVector();
		var r = this.rand2n();
		r.elements[0] = r.elements[0] * 2.0 * Math.PI;
		var oneminus = Math.sqrt(1.0 - r.elements[1] * r.elements[1]);

		var v1 = o1.multiply(Math.cos(r.elements[0]) * oneminus);
		var v2 = o2.multiply(Math.sin(r.elements[0]) * oneminus)
		var v3 = normal.multiply(r.elements[1]);
		return v1.add(v2.add(v3));
	}

	this.getColor = function(intersection) {
		if( intersection ) {
			var hitPosition = intersection.ray.origin.add(intersection.ray.direction.multiply(intersection.distance));
			var hitNormal = intersection.object.getNormal(hitPosition);
			var luminance = 1.0;

			var illuminationDepth = 4;
			var Albedo = 1.6;
			var matColor = 0.3;

			for(var i = 0; i < illuminationDepth; i++) {
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

	opts = extend(this.defaults, opts);

	this.getColor = function(intersection) {
		if( intersection ) {

			var hitPosition = intersection.ray.origin.add(intersection.ray.direction.multiply(intersection.distance));
			var zValue = hitPosition.elements[2];

			if( zValue < opts.minDepth ) {
				zValue = opts.minDepth;
			}
			if( zValue > opts.maxDepth ) {
				zValue = opts.maxDepth;
			}
			zValue /= (opts.maxDepth - opts.minDepth);

			return new Color(zValue);
		}

		return new Color(0.0);
	}
}