
///
/// Application bootstrap
///

var intravenous = require("/vendor/intravenous");

Alloy.Globals.IOC = intravenous.create();

/// 
/// Service registration
/// 
Alloy.Globals.IOC.register("Logger", require("/services/Logger"), "singleton");




