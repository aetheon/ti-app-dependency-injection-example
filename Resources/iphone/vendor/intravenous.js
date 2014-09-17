(function(window, undefined) {
    !function(factory) {
        if ("function" == typeof require && "object" == typeof exports && "object" == typeof module) {
            var target = module["exports"] || exports;
            factory(target);
        } else "function" == typeof define && define["amd"] ? define([ "exports" ], factory) : factory(window["intravenous"] = {});
    }(function(intravenous) {
        intravenous = "undefined" != typeof intravenous ? intravenous : {};
        var exportSymbol = function(path, object) {
            var tokens = path.split(".");
            var target = intravenous;
            for (var i = 0; tokens.length - 1 > i; i++) target = target[tokens[i]];
            target[tokens[tokens.length - 1]] = object;
        };
        var exportProperty = function(owner, publicName, object) {
            owner[publicName] = object;
        };
        intravenous.version = "0.1.4-beta";
        exportSymbol("version", intravenous.version);
        (function() {
            "use strict";
            var registration = function(key, container, value, lifecycle) {
                this.key = key;
                this.container = container;
                this.value = value;
                this.lifecycle = lifecycle;
            };
            var cacheItem = function(reg, instance) {
                this.registration = reg;
                this.instance = instance;
            };
            var perRequestLifecycle = function(container) {
                this.container = container;
                this.cache = [];
                this.refCounts = {};
                this.tag = 0;
                this.visitedKeys = {};
                this.visitedKeysArray = [];
            };
            perRequestLifecycle.prototype = {
                get: function(key) {
                    for (var t = 0, len = this.cache.length; len > t; t++) {
                        var i = this.cache[t];
                        if (i.registration.key === key && i.tag === this.tag) {
                            if (!i.instance) break;
                            this.set(i);
                            return i.instance;
                        }
                    }
                    this.visitedKeysArray.push(key);
                    if (this.visitedKeys[key]) throw new Error("Circular reference: " + this.visitedKeysArray.join(" --> "));
                    this.visitedKeys[key] = true;
                    return null;
                },
                set: function(cacheItem) {
                    this.cache.push(cacheItem);
                    cacheItem.tag = this.tag;
                    this.refCounts[cacheItem.tag] = this.refCounts[cacheItem.tag] || {};
                    this.refCounts[cacheItem.tag][cacheItem.registration.key] = this.refCounts[cacheItem.tag][cacheItem.registration.key]++ || 1;
                },
                release: function(cacheItem) {
                    return !--this.refCounts[cacheItem.tag][cacheItem.registration.key];
                },
                resolveStarted: function() {
                    this.tag++;
                    this.visitedKeys = {};
                    this.visitedKeysArray = [];
                }
            };
            var singletonLifecycle = function(container, parentLifecycle) {
                this.container = container;
                this.cache = [];
                this.refCounts = {};
                this.parent = parentLifecycle;
            };
            singletonLifecycle.prototype = {
                get: function(key) {
                    for (var t = 0, len = this.cache.length; len > t; t++) {
                        var i = this.cache[t];
                        if (i.registration.key === key) {
                            if (!i.instance) break;
                            this.set(i);
                            return i.instance;
                        }
                    }
                    return this.parent ? this.parent.get(key) : null;
                },
                set: function(cacheItem) {
                    this.cache.push(cacheItem);
                    this.refCounts[cacheItem.registration.key] = this.refCounts[cacheItem.registration.key]++ || 1;
                },
                release: function(cacheItem) {
                    return !--this.refCounts[cacheItem.registration.key];
                },
                resolveStarted: function() {}
            };
            var uniqueLifecycle = function(container) {
                this.container = container;
                this.cache = [];
            };
            uniqueLifecycle.prototype = {
                get: function() {
                    return null;
                },
                set: function(cacheItem) {
                    this.cache.push(cacheItem);
                },
                release: function() {
                    return true;
                },
                resolveStarted: function() {}
            };
            var nullableFacility = {
                suffixes: [ "?" ],
                beforeResolve: function(container, key, reg) {
                    return reg ? {
                        handled: false
                    } : {
                        handled: true,
                        data: null
                    };
                }
            };
            var factoryInstance = function(container, key) {
                this.container = container.create();
                this.key = key;
                exportProperty(this, "dispose", this.dispose);
                exportProperty(this, "get", this.get);
                exportProperty(this, "use", this.use);
            };
            factoryInstance.prototype = {
                get: function() {
                    var args = Array.prototype.slice.call(arguments);
                    args.unshift(this.key);
                    var instance = this.container.get.apply(this.container, args);
                    instance.$containerFactoryInstance = this;
                    return instance;
                },
                use: function(key, value, lifecycle) {
                    this.container.register(key, value, lifecycle);
                    return this;
                },
                dispose: function() {
                    this.container.dispose();
                }
            };
            var factory = function(container, key) {
                this.container = container;
                this.key = key;
                exportProperty(this, "dispose", this.dispose);
                exportProperty(this, "get", this.get);
                exportProperty(this, "use", this.use);
            };
            factory.prototype = {
                get: function() {
                    var fi = new factoryInstance(this.container, this.key);
                    return fi.get.apply(fi, arguments);
                },
                use: function(key, value, lifecycle) {
                    var fi = new factoryInstance(this.container, this.key);
                    return fi.use(key, value, lifecycle);
                },
                dispose: function(obj) {
                    obj.$containerFactoryInstance.dispose();
                    delete obj.$containerFactoryInstance;
                }
            };
            var factoryFacility = {
                suffixes: [ "Factory", "!" ],
                resolve: function(container, key) {
                    return {
                        handled: true,
                        data: new factory(container, key)
                    };
                }
            };
            var container = function(options, parent) {
                this.registry = {};
                this.parent = parent;
                this.lifecycles = {
                    perRequest: new perRequestLifecycle(this),
                    singleton: new singletonLifecycle(this, parent ? parent.lifecycles["singleton"] : null),
                    unique: new uniqueLifecycle(this)
                };
                this.children = [];
                options = options || {};
                this.options = options;
                this.register("container", this);
                exportProperty(this, "dispose", this.dispose);
                exportProperty(this, "get", this.get);
                exportProperty(this, "register", this.register);
            };
            var getFacility = function(container, key) {
                for (var facilityName in container.facilities) {
                    var facility = container.facilities[facilityName];
                    for (var t = 0, len = facility.suffixes.length; len > t; t++) {
                        var suffix = facility.suffixes[t];
                        if (-1 !== key.indexOf(suffix, key.length - suffix.length)) return {
                            data: facility,
                            key: key.slice(0, key.length - suffix.length)
                        };
                    }
                }
                return {
                    data: null,
                    key: key
                };
            };
            var get = function(container, key, extraInjections) {
                var facility = getFacility(container, key);
                key = facility.key;
                facility = facility.data;
                var reg;
                var currentContainer = container;
                while (currentContainer) {
                    reg = currentContainer.registry[key];
                    if (reg) break;
                    currentContainer = currentContainer.parent;
                }
                if (facility && facility.beforeResolve) {
                    var result = facility.beforeResolve(container, key, reg);
                    if (result.handled) return result.data;
                }
                if (!currentContainer) throw new Error("Unknown dependency: " + key);
                if (facility && facility.resolve) {
                    var result = facility.resolve(container, key, reg);
                    if (result.handled) return result.data;
                }
                var instance;
                if (instance = container.lifecycles[reg.lifecycle].get(key)) return instance;
                var returnValue;
                if (reg.value instanceof Function) {
                    var injections = reg.value["$inject"];
                    var resolvedInjections = [];
                    if (injections instanceof Array) for (var t = 0, len = injections.length; len > t; t++) {
                        var injectionKey = injections[t];
                        resolvedInjections.push(get(container, injectionKey, []));
                    }
                    var InjectedInstance = function() {};
                    InjectedInstance.prototype = reg.value.prototype;
                    instance = new InjectedInstance();
                    for (t = 0, len = extraInjections.length; len > t; t++) resolvedInjections.push(extraInjections[t]);
                    returnValue = reg.value.apply(instance, resolvedInjections);
                    if (returnValue instanceof Function) {
                        instance = new factoryInstance(container, key);
                        instance.container.register(key, returnValue);
                        for (var propertyName in returnValue) returnValue.hasOwnProperty(propertyName) && (instance[propertyName] = returnValue[propertyName]);
                        returnValue = undefined;
                    }
                } else instance = reg.value;
                container.lifecycles[reg.lifecycle].set(new cacheItem(reg, instance));
                return returnValue || instance;
            };
            container.prototype = {
                facilities: {
                    nullable: nullableFacility,
                    factory: factoryFacility
                },
                register: function(key, value, lifecycle) {
                    if (getFacility(this, key).data) throw new Error("Cannot register dependency: " + key);
                    if (!lifecycle && this.registry[key]) {
                        this.registry[key].value = value;
                        return;
                    }
                    this.registry[key] = new registration(key, this, value, lifecycle || "perRequest");
                },
                get: function(key) {
                    for (var lifecycleName in this.lifecycles) this.lifecycles.hasOwnProperty(lifecycleName) && this.lifecycles[lifecycleName].resolveStarted(key);
                    var extraInjections = Array.prototype.slice.call(arguments).slice(1);
                    var container = this;
                    var value;
                    while (container && null === (value = get(container, key, extraInjections))) container = container.parent;
                    return value;
                },
                dispose: function() {
                    var item;
                    while (item = this.children.pop()) item.dispose();
                    var cache = this.getCachedObjects();
                    while (item = cache.pop()) this.lifecycles[item.registration.lifecycle].release(item) && this.options["onDispose"] && this.options["onDispose"](item.instance, item.registration.key);
                    return true;
                },
                create: function(options) {
                    options = options || {};
                    options["onDispose"] = options["onDispose"] || this.options["onDispose"];
                    var child = new container(options, this);
                    this.children.push(child);
                    return child;
                },
                getCachedObjects: function() {
                    var result = [];
                    for (var lifecycleName in this.lifecycles) this.lifecycles.hasOwnProperty(lifecycleName) && (result = result.concat(this.lifecycles[lifecycleName].cache));
                    return result;
                }
            };
            intravenous.create = function(options) {
                return new container(options);
            };
            exportSymbol("create", intravenous.create);
        })();
    });
})("undefined" != typeof window ? window : null);