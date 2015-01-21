var Renderer = {};

Renderer.pathtracer = function() {

	this.getColor = function(intersection) {
		if( intersection ) {
			var hitPosition = intersection.ray.origin.add(intersection.ray.direction.multiply(intersection.distance));
			var hitNormal = intersection.object.getNormal(hitPosition);
			var luminance = 1.0;

			var illuminationDepth = 10;
			var Albedo = 1.6;
			var matColor = 0.3;

			for(var i = 0; i < illuminationDepth; i++) {
				var newDir = getRandomVectorInHemisphere(hitNormal);
				luminance *= 2.0 * matColor * Albedo * newDir.dot(hitNormal);
				var newOrigin = hitPosition.add(hitNormal.multiply(MIN_DIST * 2))

				var newIntersect = Pathtracer.traceRay(new Ray(newOrigin, newDir)); 
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