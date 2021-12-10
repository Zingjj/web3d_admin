import Vue from 'vue';
import App from './App.vue';
import router from '@/router';
import store from './store';
import '@/style/index.scss'; // glob scss
import './plugins/element.js';
import animated from 'animate.css';
import '@/assets/iconfont/iconfont.css';
import '@/assets/myIcon/iconfont.css';
import Web3dSdkPc from 'web3d_sdk/dist/Web3dSdkPc';

Vue.use(animated);
// import SlideVerify from 'vue-monoplasty-slide-verify'

// Vue.use(SlideVerify)
Vue.config.productionTip = false;

export const web3dSdk = new Web3dSdkPc();
web3dSdk.initSdk();

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
