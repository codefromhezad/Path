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
		globals.currentSeedVector = globals.currentSeedVector.add($V([-1, 1]));

		var magicVec1 = $V([12.9898, 78.233]);
		var magicVec2 = $V([4.898, 7.23]);

		var p1 = (Math.sin(globals.currentSeedVector.dot(magicVec1)) * 43758.5453) % 1;
		var p2 = (Math.cos(globals.currentSeedVector.dot(magicVec2)) * 23421.631) % 1;

	    return $V([p1, p2]);
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

			var baseSeedVector = $V([globals.currentScreenX, globals.currentScreenY]);

			for(var i = 0; i < illuminationDepth; i++) {
				
				globals.currentSeedVector = baseSeedVector.multiply(i + 1);

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