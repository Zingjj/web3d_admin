import Vue from 'vue'
import Vuex from 'vuex'
import getters from './getters'
const path = require('path')

Vue.use(Vuex)

// require.context()遍历文件夹中的指定文件然后自动导入
// 不需要每次显式的调用import导入模块
// 接受三个参数：
// 1.directory{String} -读取文件的路径
// 2.useSubdirectories {Boolean} -是否遍历文件的子目录
// 3.regExp {RegExp} -匹配文件的正则
const files = require.context('./modules', false, /\.js$/)
let modules = {}
files.keys().forEach(key => {
  let name = path.basename(key, '.js')
  modules[name] = files(key).default || files(key)
})
console.log(modules)
const store = new Vuex.Store({
  modules,
  getters
})
export default store
