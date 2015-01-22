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

	this.getColorForRay = function(initialRay, luminance, depth) {
		
		var Albedo = 1.2;
		var matColor = 0.45;

		if( depth === undefined ) {
			depth = 0;
		}

		if( luminance === undefined ) {
			luminance = new Color(1.0);
		}

		if( depth >= this.options.traceDepth ) {
			return this.getBackground(initialRay.direction);
		}

		var intersection = initialRay.cast(Engine.objects);

		if( intersection ) {
			var hitPosition = intersection.ray.lastHitPosition;
			var hitNormal = intersection.ray.lastHitNormal;

			var newDir = this.getRandomVectorInHemisphere(hitNormal);
			luminance = luminance.multiply( 2.0 * matColor * Albedo * newDir.dot(hitNormal) );
			var newOrigin = hitPosition.add(hitNormal.multiply(MIN_DIST * 2));

			var newRay = new Ray(newOrigin, newDir);
			
			return this.getColorForRay(newRay, luminance, depth + 1);
		} else {
			return luminance.multiply(this.getBackground(initialRay.direction));
		}
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