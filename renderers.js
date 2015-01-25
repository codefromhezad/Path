var Renderer = {};

Renderer.pathtracer = function(opts) {
	this.defaults = {
		traceDepth: 8
	}
	this.options = extend(this.defaults, opts);

	this.getOrtho = function(v) {
		return Math.abs(v.elements[0]) > Math.abs(v.elements[2]) ? 
			$V([-v.elements[1], v.elements[0], 0.0]) :
			$V([0.0, -v.elements[2], v.elements[1]]);
	}

	this.rand2D = function() {
		return $V([Math.random(), Math.random()]);
	}

	this.getRandomVectorInHemisphere = function(normal) {
		var o1 = this.getOrtho(normal);
		var o2 = normal.cross(o1);
		var r  = this.rand2D();

		r.elements[0] = r.elements[0] * 2.0 * Math.PI;

		var oneminus = Math.sqrt(1.0 - r.elements[1] * r.elements[1]);

		var v1 = o1.multiply(oneminus * Math.cos(r.elements[0]));
		var v2 = o2.multiply(oneminus * Math.sin(r.elements[0]));
		var v3 = normal.multiply(r.elements[1]);

		var finalVector = v1.add(v2).add(v3);

		return finalVector;
	}

	this.getBackground = function(direction) {
		if( direction.elements[1] > 0 ) {
			return new Color(1.0);
		} else {
			return new Color(0.2);
		}
	}

	this.getColorForRay = function(initialRay, luminance, depth) {
		
		var Albedo = 0.8;
		var matColor = new Color(0.88, 0.91, 1.0);

		if( depth === undefined ) {
			depth = 0;
		}

		if( luminance === undefined ) {
			luminance = new Color(1.0);
		}

		if( depth < this.options.traceDepth ) {
			var intersection = initialRay.cast(Engine.objects);

			if( intersection ) {
				var hitPosition = intersection.ray.lastHitPosition;
				var hitNormal = intersection.ray.lastHitNormal;

				var newDir = this.getRandomVectorInHemisphere(hitNormal);
				var newOrigin = hitPosition.add(hitNormal.multiply(MIN_VECTOR_DIST_ADD * 2));

				var matColor = intersection.object.material.color;
				var albedo = intersection.object.material.albedo;

				luminance = luminance.multiply( matColor.multiply(albedo) );

				var newRay = new Ray(newOrigin, newDir);
				
				return this.getColorForRay(newRay, luminance, depth + 1);
			}
		}
			
		return luminance.multiply(this.getBackground(initialRay.direction));
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