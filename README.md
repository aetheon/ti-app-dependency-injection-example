
# Using dependency injection with titanium

This example explain how to integrate a dependency injection library with titanium (3.3.0.GA) using
alloy 1.3.1.

When compiling the titanium app alloy creates some boilerplate code to embed your Controller code. This
Controller code is normaly a javascript script. This script does not have a well defined structure in terms
of context sharing which leads to the usage of global variables and events to share information across the
application.

In terms of long term maintenance the usage of global variables and events as a communication mechanism is
very hard. That's why a more structured approach is needed and therefore the usage of dependency injection
as the backbone of the application.

## Dependencies

* app/lib/vendor/intravenous - IOC library
* app/lib/vendor/q - Promises library

## Application Structure

The app/alloy.js file is used as the application bootstraper. This file should contain the Service Layer
registrations. Its there that we store the global IOC container.



## Authors

Oscar Brito - @aetheon