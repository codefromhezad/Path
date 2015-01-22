# Path, a modular raytracer for the browser.

## Developers

### Entities (Objects that can "live" in a scene)

Entities *must* have a method "getColorForRay(initialRay)".

This method *must* either :
* return false and/or null if no intersection occurs or
* return an object returning necessary informations for the engine. This object _must_ follow this format :
```javascript
{
	status: INTERSECT_OK | INTERSECT_INNER,
	distance: <intersection distance from the camera>,
	object: <the intersected object (you should use "this")>,
	ray: ray (Return the input ray)
};
```

### Cameras

Cameras *must* have a method "getRay(screenX, screenY)".

This method *must* return a new Ray() object, ready to be used by intersection methods