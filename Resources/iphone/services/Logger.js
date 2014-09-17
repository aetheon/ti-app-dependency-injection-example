"use strict";

var Logger = function() {};

Logger.prototype.info = function(message) {
    console.log(message);
};

module.exports = Logger;