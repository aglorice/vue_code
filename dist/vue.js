(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
  typeof define === 'function' && define.amd ? define(factory) :
  (global = typeof globalThis !== 'undefined' ? globalThis : global || self, global.Vue = factory());
})(this, (function () { 'use strict';

  function _typeof(obj) {
    "@babel/helpers - typeof";

    return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (obj) {
      return typeof obj;
    } : function (obj) {
      return obj && "function" == typeof Symbol && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
    }, _typeof(obj);
  }
  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }
  function _defineProperties(target, props) {
    for (var i = 0; i < props.length; i++) {
      var descriptor = props[i];
      descriptor.enumerable = descriptor.enumerable || false;
      descriptor.configurable = true;
      if ("value" in descriptor) descriptor.writable = true;
      Object.defineProperty(target, _toPropertyKey(descriptor.key), descriptor);
    }
  }
  function _createClass(Constructor, protoProps, staticProps) {
    if (protoProps) _defineProperties(Constructor.prototype, protoProps);
    if (staticProps) _defineProperties(Constructor, staticProps);
    Object.defineProperty(Constructor, "prototype", {
      writable: false
    });
    return Constructor;
  }
  function _toPrimitive(input, hint) {
    if (typeof input !== "object" || input === null) return input;
    var prim = input[Symbol.toPrimitive];
    if (prim !== undefined) {
      var res = prim.call(input, hint || "default");
      if (typeof res !== "object") return res;
      throw new TypeError("@@toPrimitive must return a primitive value.");
    }
    return (hint === "string" ? String : Number)(input);
  }
  function _toPropertyKey(arg) {
    var key = _toPrimitive(arg, "string");
    return typeof key === "symbol" ? key : String(key);
  }

  // 重写数组中的部分方法

  var oldArrayProto = Array.prototype; // 获取数组的原型

  // https://blog.csdn.net/XuM222222/article/details/98742164（Object.create 解释）
  var newArrayProto = Object.create(oldArrayProto);

  // 只有这七种方法可以改变数据
  var methods = ['push', 'sort', 'shift', 'unshift', 'splice', 'reverse', 'pop'];
  methods.forEach(function (method) {
    newArrayProto[method] = function () {
      var _oldArrayProto$method;
      for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
        args[_key] = arguments[_key];
      }
      // 重写了数组的方法
      var result = (_oldArrayProto$method = oldArrayProto[method]).call.apply(_oldArrayProto$method, [this].concat(args)); // 内部调用原来的方法，函数的劫持，切片编程
      console.log('method', method);
      var inserted;
      var ob = this.__ob__;
      switch (method) {
        case 'push':
        case 'unshift':
          inserted = args;
          break;
        case 'splice':
          inserted = args.slice(2);
          break;
      }
      console.log(inserted); // 新增的内容
      if (inserted) {
        ob.observeArray(inserted);
      }
      return result;
    };
  });

  var Observe = /*#__PURE__*/function () {
    function Observe(data) {
      _classCallCheck(this, Observe);
      // Object.defineProperty 劫持已有的属性
      // 不可枚举
      Object.defineProperty(data, '__ob__', {
        value: this,
        enumerable: false // 将__ob__变成不可枚举
      });

      if (Array.isArray(data)) {
        // 重写数组中的几个方法
        data.__proto__ = newArrayProto; // 保留原有数组的方法，并且对其修改
        this.observeArray(data);
      } else {
        this.walk(data);
      }
    }
    _createClass(Observe, [{
      key: "walk",
      value: function walk(data) {
        // 循环对象，对属性依次劫持
        // 重新定义数据
        Object.keys(data).forEach(function (key) {
          return defineReactive(data, key, data[key]);
        });
      }
    }, {
      key: "observeArray",
      value: function observeArray(data) {
        data.forEach(function (item) {
          return observe(item);
        }); // 将数组中的每一项进行观测
      }
    }]);
    return Observe;
  }();
  function defineReactive(target, key, value) {
    // 闭包
    observe(value);
    Object.defineProperty(target, key, {
      get: function get() {
        // 取值的时候调用get
        return value;
      },
      set: function set(newValue) {
        // 修改的时候调用
        if (newValue === value) return;
        observe(newValue); // 判断是否为对象，是则继续进行劫持
        value = newValue;
      }
    });
  }
  function observe(data) {
    // 对这个对象进行劫持
    if (_typeof(data) !== 'object' || data === null) {
      return; // 只对对象进行劫持
    }

    if (data.__ob__ instanceof Observe) {
      return data.__ob__;
    }
    return new Observe(data);
  }

  // 状态初始化
  function initState(vm) {
    // 状态初始化
    var opts = vm.$options; // 获取所有的选项
    if (opts.data) {
      // 如果有数据就进行数据初始化
      initData(vm);
    }
  }
  // 对数韩进行初始化
  function initData(vm) {
    var data = vm.$options.data;
    // 判断用户的数据是函数还是对象
    data = typeof data === 'function' ? data.call(vm) : data;
    //
    vm._data = data;
    // 对数据进行劫持（使用defineProperty）
    //
    observe(data);

    // 将vm_data 代理
    for (var key in data) {
      proxy(vm, '_data', key);
    }
  }

  // 给vm._data 加上代理
  function proxy(vm, target, key) {
    Object.defineProperty(vm, key, {
      get: function get() {
        return vm[target][key];
      },
      set: function set(newValue) {
        vm[target][key] = newValue;
      }
    });
  }

  function initMixin(Vue) {
    Vue.prototype._init = function (options) {
      // 用作初始化操作
      var vm = this;
      this.$options = options; // 将用户的选项挂载到实例上
      // 初始化状态
      initState(vm);
      //
    };
  } // 给vue增加init方法

  // 通过构造函数来实现
  function Vue(options) {
    // 接收用户的选项
    this._init(options);
  }
  initMixin(Vue);

  return Vue;

}));
//# sourceMappingURL=vue.js.map
