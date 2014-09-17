"use strict";

/**
 *
 * The controller factory
 * 
 * @type {Object}
 * 
 */
var ControllerFactory = {

	/**
	 *
	 * Creates a Controller with support to IOC
	 * 
	 * @param  {Function} ControllerClass
	 * @param  {Objects} Object
	 * @param  {Array} arguments
	 * 
	 * @return {Object}
	 * 
	 */
	create: function(ControllerClass, view, arguments){

		/// nested IOC container
		var container = Alloy.Globals.IOC.create();

		/// create the base Controller
		var Controller = function(){};

		/// create the destroy method of the controller
		Controller.destroy = function(){
			container.dispose();
		};

		ControllerClass.prototype = new Controller();
		ControllerClass.prototype.constructor = ControllerClass;

		/// register the controller on this nested controller
		container.register("Controller", ControllerClass);
		container.register("View", view);
		container.register("Arguments", arguments);

		/// get the controller from the nested controller
		return container.get("Controller");

	}

};

module.exports = ControllerFactory;