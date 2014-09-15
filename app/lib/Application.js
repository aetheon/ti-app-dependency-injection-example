
var intravenous = require("/vendor/intravenous");

/**
 *
 * Backbone of the application.
 * 
 * 
 */
var Application = function(){

	/**
	 *
	 * IOC container
	 * 
	 * @type {Object}
	 * 
	 */
	this.ioc = intravenous.create();

};

/**
 * 
 * Register services and dependencies
 * 
 * @return {}
 * 
 */
Application.prototype.registerServices = function(){

	this.ioc.register("Controller", require("/Controller"));

};

module.exports = Application;


