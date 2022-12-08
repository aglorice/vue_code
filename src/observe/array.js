// 重写数组中的部分方法


let oldArrayProto = Array.prototype; // 获取数组的原型

// https://blog.csdn.net/XuM222222/article/details/98742164（Object.create 解释）
export let newArrayProto = Object.create(oldArrayProto)


// 只有这七种方法可以改变数据
let methods = [
    'push',
    'sort',
    'shift',
    'unshift',
    'splice',
    'reverse',
    'pop'
]
methods.forEach(method=>{
    newArrayProto[method] = function (...args){ // 重写了数组的方法
        const result = oldArrayProto[method].call(this,...args); // 内部调用原来的方法，函数的劫持，切片编程
        console.log('method',method);

        let inserted;
        let ob = this.__ob__
        switch (method){
            case 'push':
            case 'unshift':
                inserted = args;
                break;
            case 'splice':
                inserted = args.slice(2);
                break;
            default:
                break;
        }
        console.log(inserted); // 新增的内容
        if(inserted){
            ob.observeArray(inserted)
        }
        return result;
    }
})
