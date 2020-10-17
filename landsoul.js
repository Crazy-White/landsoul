/**
 * landsoul
 * Properties and Methods
 * https://developer.mozilla.org/en-US/docs/Web/API/Element
 */
'use strict';
const landsoul = function (ele) {
    if (ele.length) ele = ele[0];
    return function (method, ...args) {
        const called = ele[method];
        const localHandler = landsoul._methods[method];
        switch (typeof called) {
            case 'function':
                ele[method](...args);
                break;
            case 'string':
                if (args.length === 0) return called;
                ele[method] = args[0];
                break;
            default:
                if (typeof localHandler === 'function') localHandler(ele, ...args);
                else console.error('Not handled');
        }
        return landsoul(ele);
    };
};
// FIXIT: many bugs below!!!
Object.defineProperty(landsoul, '_methods', {
    configurable: false,
    value: Object.create(null),
});

Object.assign(landsoul, {
    select(query) {
        const collection = document.querySelectorAll(query);
        const func = (...args) => landsoul(collection)(...args);
        func.each = fn => collection.forEach(raw => fn(raw));
        return func;
    },
    plugin(methodName, func) {
        this._methods = { [methodName]: func, ...this._methods };
    },
    extend(propName, func) {
        Object.defindProperty(this, propName, {
            enumerable: false,
            configurable: false,
            writable: false,
            value: func,
        });
    },
});

/*
landsoul.plugin("doit", (ele, ...args) => {
     const wrapper = landsoul(ele);
     alert(args);
     wrapper("innerHTML", `<center>${ele.innerHTML}</center>`)("className", "centered");
})
landsoul.select("p").each(ele => landsoul(ele)("doit", "in an alert"))
 */

landsoul.proxy = function (element) {
    return new Proxy(element, {
        get: function (target, property, receiver) {
            return function (...args) {
                const called = element[property];
                const localHandler = landsoul._methods[property];
                switch (typeof called) {
                    case 'function':
                        element[property](...args);
                        break;
                    case 'string':
                        element[property] = args[0];
                        break;
                    default:
                        if (typeof localHandler === 'function') localHandler(element, ...args);
                        else console.error('Not handled');
                }
                return receiver;
            };
        },
    });
};

/* mapping diagram
landsoul.proxy.select(query) -> {
    0: landsoul.proxy(eles[0]),
    1: landsoul.proxy(eles[1]),
    ...... ,
    each: f=>{eles.forEach(f); return this}
}
*/
landsoul.proxy.select = function (query) {
    const collection = document.querySelectorAll(query);
    return new Proxy(collection, {
        get: function (target, property, receiver) {
            if (property === 'each') {
                return func => {
                    collection.forEach(func);
                    return receiver;
                };
            } else {
                return landsoul.proxy(collection[property]);
            }
        },
    });
};
