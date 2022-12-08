import {newArrayProto} from "./array";


class Observe{
    constructor(data) {
        // Object.defineProperty 劫持已有的属性
        // 不可枚举
        Object.defineProperty(data,'__ob__',{
            value:this,
            enumerable:false // 将__ob__变成不可枚举
        });
        if(Array.isArray(data)){
            // 重写数组中的几个方法
            data.__proto__ = newArrayProto // 保留原有数组的方法，并且对其修改
            this.observeArray(data)
        }else {
            this.walk(data)
        }

    }
    walk(data){ // 循环对象，对属性依次劫持
        // 重新定义数据
        Object.keys(data).forEach(key=>defineReactive(data,key,data[key]));
    }
    observeArray(data){
        data.forEach(item=> observe(item))  // 将数组中的每一项进行观测
    }
}


export function defineReactive(target,key,value){ // 闭包
    observe(value)
    Object.defineProperty(target,key,{
        get() { // 取值的时候调用get
            return value;
        },
        set(newValue) { // 修改的时候调用
            if(newValue === value) return
            observe(newValue) // 判断是否为对象，是则继续进行劫持
            value = newValue
        }
    })
}
export function observe(data){
    // 对这个对象进行劫持
    if (typeof data !== 'object' || data === null){
        return;  // 只对对象进行劫持
    }
    if (data.__ob__ instanceof Observe){
        return data.__ob__;
    }
    return new Observe(data);
}
