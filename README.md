
# Using dependency injection with titanium

This example explain how to integrate a dependency injection library with titanium (3.3.0.GA) using
alloy 1.3.1. This should work with previous versions.

When compiling the titanium app alloy creates some boilerplate code to embed your Controller code. This
Controller code is normally a javascript script. This script does not have a well defined structure in terms
of context sharing which leads to the usage of global variables and events to share information across the
application.

In terms of long term maintenance the usage of global variables and events as a communication mechanism is
very hard. That's why a more structured approach is needed and therefore the usage of dependency injection
as the backbone of the application.

## Dependencies

* [app/lib/vendor/intravenous](http://www.royjacobs.org/intravenous/) - IOC library

## Application Structure

### Bootstrap

The app/alloy.js file is used as the application bootstraper. This file should contain the Service Layer
registrations. Its where we register the business layer services...

### Controllers

Each controller can declare dependencies that will be resolved by the Dependency Injection Framework. To enable 
this app/lib/ControllerFactory was created. The create() method creates a nested container in which the View and 
its arguments are declared.

To check how this is working check:

* app/lib/ControllerFactory.js
* app/controllers/index.js

## Example

This example only contain a Logger service that was registered as a singleton. This means that the same reference 
will be used across the application.

See:

* app/lib/services/Logger.js
* app/alloy.js

## TODO

* Lifetime on Controllers. Implementation and testing of disposal methods...

## Conclusion

I wish that Alloy Controller compilation make it easier to use this without using a global variable to declare the IOC 
app container. You can see [here](https://gist.github.com/aetheon/7cd64e530cfaf1bb579b) that Alloy generated code is not
very flexible.

Coding this way you are avoid the following:

* Using events to communicate information between Controller instances.
* Using singleton modules across the app
* Using global variables


Coding this way you are getting:

* Easier testing
* Declaration of dependencies on app bootstrap
* Easier control of instances ( "singleton", "perinstance" )
* Separation between UI and Business logic


## Authors

Oscar Brito - @aetheon