# Path, a modular raytracer for the browser.

## Developers

Entites intersect method must either :
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