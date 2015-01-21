var Renderer = {};

Renderer.pathtracing = function() {

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
					return [luminance, luminance, luminance];
				}
			}
		}

		return [0.0, 0.0, 0.0];
	}
}


var DEFAULT_ZBUFFER_DEPTH_SCALE  = 10;
var DEFAULT_ZBUFFER_DEPTH_OFFSET = 0;

Renderer.zBuffer = function(opts) {

	if( ! opts ) { opts = {}; }

	this.depthScale = opts.depthScale ? opts.depthScale : DEFAULT_ZBUFFER_DEPTH_SCALE;
	this.depthScaleMultiplier = 1.0 / this.depthScale;

	this.depthOffset = opts.depthOffset ? opts.depthOffset : DEFAULT_ZBUFFER_DEPTH_OFFSET;

	this.getColor = function(intersection) {
		if( intersection ) {
			var hitPosition = intersection.ray.origin.add(intersection.ray.direction.multiply(intersection.distance));
			var zValue = this.depthOffset + hitPosition.elements[2] * this.depthScaleMultiplier;

			return [zValue, zValue, zValue];
		}

		return [0.0, 0.0, 0.0];
	}
}