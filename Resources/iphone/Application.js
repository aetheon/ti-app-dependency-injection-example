var intravenous = require("/vendor/intravenous");

var Application = function() {
    this.ioc = intravenous.create();
};

Application.prototype.registerServices = function() {
    this.ioc.register("Controller", require("/Controller"));
};

module.exports = Application;