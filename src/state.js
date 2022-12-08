import {observe} from "./observe/index";

// 状态初始化
export function initState(vm){
    // 状态初始化
    const opts = vm.$options; // 获取所有的选项
    if(opts.data){ // 如果有数据就进行数据初始化
        initData(vm);
    }
}
// 对数韩进行初始化
function initData(vm){
    let data =  vm.$options.data;
    // 判断用户的数据是函数还是对象
    data = typeof data === 'function' ? data.call(vm) : data;
    //
    vm._data = data;
    // 对数据进行劫持（使用defineProperty）
    //
    observe(data);

    // 将vm_data 代理
    for(let key in data){
        proxy(vm,'_data',key);
    }
}

// 给vm._data 加上代理
function proxy(vm,target,key){
    Object.defineProperty(vm,key,{
        get() {
            return vm[target][key];
        },
        set(newValue) {
            vm[target][key] = newValue;
        }
    })
}
