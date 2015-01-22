var Entity = {}

Entity.sphere = function(position, radius) {
	
	this.position = position;
	this.radius = radius;

	this.intersect = function(ray) {
		var A = ray.direction.dot(ray.direction);
		var originToCenterRay = ray.origin.subtract(this.position);
		var B = originToCenterRay.dot(ray.direction) * 2;
		var C = originToCenterRay.dot(originToCenterRay) - this.radius * this.radius;

		var delta = B * B - 4 * A * C;

		if(delta > 0) {
			delta = Math.sqrt(delta);
		   	var distance1 = (-B - delta) / (2 * A);
		    var distance2 = (-B + delta) / (2 * A);
		   	
		   	if(distance2 > FLOAT_EPSILON) {
		     	if(distance1 < FLOAT_EPSILON) {
		        	if(distance2 < distance1) {
		            	var distance = distance2;
		            	return {
		            		status: INTERSECT_INSIDE,
		            		distance: distance,
		            		object: this,
		            		ray: ray
		            	};
		         	}
		     	} else {
		        	if(distance1 < distance2) {
		            	var distance = distance1;
		            	return {
		            		status: INTERSECT_OK,
		            		distance: distance,
		            		object: this,
		            		ray: ray
		            	};
		         	}
		      	}
		   	}
		}
		return null;
	}

	this.getNormal = function(intersectPoint) {
		var normal = intersectPoint.subtract(this.position);
		return normal.toUnitVector();
	}
}


Entity.plane = function(referencePoint, normal) {
	
	this.referencePoint = referencePoint;
	this.normal = normal;

	this.intersect = function(ray) {
		var denom = this.normal.dot(ray.direction);

		if( Math.abs(denom) > FLOAT_EPSILON ) {
		    var t = this.referencePoint.subtract(ray.origin).dot(this.normal) / denom;
		    if (t >= FLOAT_EPSILON) {
		    	return {
            		status: INTERSECT_OK,
            		distance: t,
            		object: this,
            		ray: ray
            	};
		    }
		}
		return null;
	}

	this.getNormal = function(intersectPoint) {
		return this.normal;
	}
}