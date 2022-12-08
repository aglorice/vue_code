// 通过构造函数来实现
import {initMixin} from "./init";

function Vue(options){  // 接收用户的选项
    this._init(options);
}
initMixin(Vue);

export default Vue

