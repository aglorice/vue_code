import {initState} from "./state";

export function initMixin(Vue) {
    Vue.prototype._init = function (options){
        // 用作初始化操作
        const  vm = this;
        this.$options = options;  // 将用户的选项挂载到实例上
        // 初始化状态
        initState(vm);
        //
    }
}// 给vue增加init方法


