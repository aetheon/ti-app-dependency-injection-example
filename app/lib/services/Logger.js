"use strict";

/**
 *
 * Logger Service
 * 
 */
var Logger = function(){};

/**
 *
 * Info method
 * 
 * @param  {String} message
 * @return
 * 
 */
Logger.prototype.info = function(message){
	console.log(message);
};

module.exports = Logger;