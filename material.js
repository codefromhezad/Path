var Material = function(opts) {
	this.defaults = {
		color: new Color(0.88, 0.91, 1.0),
		albedo: 0.8
	}
	this.options = extend(this.defaults, opts);


	this.color = this.options.color;
	this.albedo = this.options.albedo;
}