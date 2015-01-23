var Ray = function(origin, direction) {
	this.origin = origin;
	this.direction = direction;

	this.lastHitPosition = null;
	this.lastHitNormal = null;

	this.cast = function(sceneObjects) {
		var nearestIntersection = null;

		for(var n in sceneObjects) {
			var o = sceneObjects[n];
			var intersection = o.intersect(this);

			if( intersection && intersection.status == INTERSECT_OK ) {
				if( (! nearestIntersection) || nearestIntersection.distance > intersection.distance ) {
					nearestIntersection = intersection;
				}
			}
		}

		if( nearestIntersection ) {
			this.lastHitPosition = nearestIntersection.ray.origin.add(nearestIntersection.ray.direction.multiply(nearestIntersection.distance));
			this.lastHitNormal = nearestIntersection.object.getNormal(this.lastHitPosition);
		}

		return nearestIntersection;
	}
}