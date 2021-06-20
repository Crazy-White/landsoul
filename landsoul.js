/**
 * landsoul
 * Properties and Methods
 * https://developer.mozilla.org/en-US/docs/Web/API/Ele
 */
'use strict';
const landsoul = function (ele) {
    //ele传入collection！
    if (ele.length) ele = ele[0]; //默认第一个元素
    return function (method, ...args) {
        //method方法，args方法传参
        const called = ele[method]; //获取元素上的方法
        const localHandler = landsoul._methods[method]; //获取自定义的方法
        switch (
            typeof called //优先元素上的方法
        ) {
            case 'function':
                ele[method](...args);
                break;
            case 'string':
                if (args.length === 0) return called; //未传参返回
                ele[method] = args[0]; //否则执行
                break;
            default:
                if (method.startsWith('on')) ele[method] = args[0];
                else if (typeof localHandler === 'function') localHandler(ele, ...args);
                else console.error('Not handled');
        }
        return landsoul(ele); //链式调用
    };
};

/*
Object.defineProperty(landsoul, '_methods', {
    configurable: true,
    value: Object.create(null),
});
*/

landsoul._methods = Object.create(null);

Object.assign(landsoul, {
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

/* example
landsoul.plugin('doit', (ele, ...args) => {
    landsoul(ele)('innerHTML', `<center><p>${args[0]}: ${ele.innerHTML}</p></center>`)('className', 'centered');
});
landsoul.select('p').each(ele => landsoul(ele)('doit', 'Do It'));
*/

//Proxy实现
landsoul.proxy = function (ele) {
    const proxiedEle = new Proxy(ele, {
        get: function (target, property, receiver) {
            console.log(target, property, receiver);
            return function (...args) {
                if (Reflect.has(target, 'length')) target = target[0]; //默认第一个元素
                const called = target[property];
                const localHandler = landsoul._methods[property];
                switch (typeof called) {
                    case 'function':
                        target[property](...args);
                        break;
                    case 'string':
                        target[property] = args[0];
                        break;
                    default:
                        if (property.startsWith('on')) target[property] = args[0];
                        //special handler for eventListener
                        else if (typeof localHandler === 'function') localHandler(target, ...args);
                        else console.error('Not handled');
                }
                return proxiedEle;
            };
        },
    });
    return proxiedEle;
};
