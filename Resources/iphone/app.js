var Alloy = require("alloy"), _ = Alloy._, Backbone = Alloy.Backbone;

var intravenous = require("/vendor/intravenous");

Alloy.Globals.IOC = intravenous.create();

var A = function() {
    this.a = "lopes";
};

Alloy.Globals.IOC.register("A", A);

Alloy.createController("index");