# Path, a modular raytracer for the browser.

## Developers



### Entities (Objects that can "live" in a scene)

#### Required methods

* intersect(ray)

	This method *must* either :
	* return false and/or null if no intersection occurs or
	* return an object containing at least the next informations :
	```javascript
	{
		status: INTERSECT_OK | INTERSECT_INNER,
		distance: <intersection distance from the camera>,
		object: <the intersected object (you should use "this")>,
		ray: ray (Return the input ray)
	};
	```

* getNormal(point)
	
	This method *must* return a vector 




### Cameras

#### Required methods

* getRay(screenX, screenY)

	This method *must* return a new Ray() object, ready to be used by intersection methods



### Renderers

#### Required methods

* getColorForRay(initialRay)
