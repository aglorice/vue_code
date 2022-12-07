
import babel from 'rollup-plugin-babel'
export default {
    input:'./src/index.js',
    output:{
        file:'./dist/vue.js', // 出口
        name:'Vue', // 全局增加VUE
        format:'umd',
        sourcemap:true, // 希望可以调试代码
    },
    plugins:[
        babel({

            exclude: 'node_modules/**'
        })
    ]
}
