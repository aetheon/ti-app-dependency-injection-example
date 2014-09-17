var Alloy = require("alloy"), _ = Alloy._, Backbone = Alloy.Backbone;

var intravenous = require("/vendor/intravenous");

Alloy.Globals.IOC = intravenous.create();

Alloy.Globals.IOC.register("Logger", require("/services/Logger"), "singleton");

Alloy.createController("index");