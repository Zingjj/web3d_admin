/*
set sidebar open or close,and some app setting
 */
const state = {
  opened: sessionStorage.getItem('open')
    ? sessionStorage.getItem('open')
    : 'false',
  msgIsShow: false,
  showDriver: localStorage.getItem('driver')
    ? localStorage.getItem('driver')
    : 'yes'
}
const mutations = {
  SET_OPENED(state, payload) {
    state.opened = String(payload)
    sessionStorage.setItem('open', payload)
  },
  SET_MSGISOPEN(state) {
    state.msgIsShow = !state.msgIsShow
  },
  SET_DRIVER(state, payload) {
    state.showDriver = payload
    localStorage.setItem('driver', payload)
  }
}

// 如果希望你的模块具有更高的封装度和复用性
// 你可以通过添加 namespaced: true 的方式使其成为带命名空间的模块。
// 当模块被注册后，它的所有 getter、action 及 mutation 都会自动根据模块注册的路径调整命名
export default {
  namespaced: true,
  state,
  mutations
}
