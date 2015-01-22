var Renderer = {};

Renderer.pathtracer = function(opts) {

	this.defaults = {
		traceDepth: 6
	}
	this.options = extend(this.defaults, opts);

	this.getRandomVectorInHemisphere = function(normal) {
		var dir = normal.toUnitVector();
		var rndDir = $V([-1 + Math.random() * 2, -1 + Math.random() * 2, -1 + Math.random() * 2]);

		if( rndDir.dot(dir) < 0 ) {
			rndDir = rndDir.multiply(-1);
		}

		return rndDir;
	}

	this.getBackground = function(direction) {
		return new Color(1.0);
	}

	this.getColorForRay = function(initialRay) {
		var intersection = initialRay.cast(Engine.objects);

		if( intersection ) {
			var hitPosition = intersection.ray.origin.add(intersection.ray.direction.multiply(intersection.distance));
			var hitNormal = intersection.object.getNormal(hitPosition);
			var luminance = 1.0;

			var Albedo = 1.2;
			var matColor = 0.45;

			for(var i = 0; i < this.options.traceDepth; i++) {
				var newDir = this.getRandomVectorInHemisphere(hitNormal);
				luminance *= 2.0 * matColor * Albedo * newDir.dot(hitNormal);
				var newOrigin = hitPosition.add(hitNormal.multiply(MIN_DIST * 2));

				var newRay = new Ray(newOrigin, newDir);
				var newIntersect = newRay.cast(Engine.objects); 
				
				if( newIntersect ) {
					hitPosition = newIntersect.ray.origin.add(newIntersect.ray.direction.multiply(newIntersect.distance));
					hitNormal = newIntersect.object.getNormal(hitPosition);
				} else {
					return (new Color(luminance)).multiply(this.getBackground(newDir));
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

	this.getColorForRay = function(initialRay) {
		var intersection = initialRay.cast(Engine.objects);

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