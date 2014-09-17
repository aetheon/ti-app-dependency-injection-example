
/**
 * Index controller
 * @class 
 * 
 */

var ControllerFactory = require("/ControllerFactory");

var Controller = function(View, Arguments, al){

	alert(al.a);
	$.index.open();

};

Controller.$inject = [ "View", "Arguments" ];

/// return the instance of the controller.
module.exports = ControllerFactory.create(Controller, $, arguments);
