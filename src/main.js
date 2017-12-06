// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App.vue'
import router from './router'
import Axios from 'axios'
import store from './statusControl/status'
import './css/common/common.styl';
import wx from 'weixin-js-sdk'
//rem布局
require('../static/flexible.js');
//点击延迟
const FastClick = require('fastclick');
FastClick.attach(document.body);
//网络请求
Vue.config.productionTip = false;
Vue.prototype.$ajax = Axios;
Axios.defaults.withCredentials = true;
// console.log(wx)

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  template: '<App/>',
  components: { App }
})
