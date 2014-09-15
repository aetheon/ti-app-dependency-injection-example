var Alloy = require("alloy"), _ = Alloy._, Backbone = Alloy.Backbone;

var intravenous = require("/vendor/intravenous");

var container = intravenous.create();

container.register("Controller", require("/Controller"));

Alloy.createController = function(name, args) {
    console.log("createController");
    var ControllerFactory = container.get("ControllerFactory");
    console.log(ControllerFactory);
    return new (require("alloy/controllers/" + name))(args);
};

Alloy.createController("index");