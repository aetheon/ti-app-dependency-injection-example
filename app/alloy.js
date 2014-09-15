// The contents of this file will be executed before any of
// your view controllers are ever executed, including the index.
// You have access to all functionality on the `Alloy` namespace.
//
// This is a great place to do any initialization for your app
// or create any global variables/functions that you'd like to
// make available throughout your app. You can easily make things
// accessible globally by attaching them to the `Alloy.Globals`
// object. For example:
//
// Alloy.Globals.someGlobalFunction = function(){};

var intravenous = require("/vendor/intravenous");

var container = intravenous.create();

container.register("Controller", require("/Controller"));


/**
 *
 * Extend Alloy createController
 * 
 * @param  {String} name
 * @param  {Array} args
 * @return {}
 * 
 */
Alloy.createController = function(name, args) {

	//

	console.log("createController")
	
	//alert(app.ioc)

	var ControllerFactory = container.get("ControllerFactory");

	console.log(ControllerFactory);

	//var controller = ControllerFactory.use("view", { view: "view" }).get();

	/// gets a new instance of the controller
	//return (new require("alloy/controllers/" + name))(args);
	//
	return new (require("alloy/controllers/" + name))(args);

};

