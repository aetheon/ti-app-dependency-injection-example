function Controller() {
    require("alloy/controllers/BaseController").apply(this, Array.prototype.slice.call(arguments));
    this.__controllerPath = "index";
    arguments[0] ? arguments[0]["__parentSymbol"] : null;
    arguments[0] ? arguments[0]["$model"] : null;
    arguments[0] ? arguments[0]["__itemTemplate"] : null;
    var $ = this;
    var exports = {};
    $.__views.index = Ti.UI.createWindow({
        backgroundColor: "white",
        id: "index"
    });
    $.__views.index && $.addTopLevelView($.__views.index);
    $.__views.label = Ti.UI.createLabel({
        width: Ti.UI.SIZE,
        height: Ti.UI.SIZE,
        color: "#000",
        text: "Hello, World",
        id: "label"
    });
    $.__views.index.add($.__views.label);
    exports.destroy = function() {};
    _.extend($, $.__views);
    var ControllerFactory = require("/ControllerFactory");
    var Controller = function(View, Arguments, al) {
        alert(al.a);
        $.index.open();
    };
    Controller.$inject = [ "View", "Arguments", "A" ];
    module.exports = ControllerFactory.create(Controller, $, arguments);
    _.extend($, exports);
    $.postConstruct && $.postConstruct();
}

var Alloy = require("alloy"), Backbone = Alloy.Backbone, _ = Alloy._;

module.exports = Controller;