/**
 * Created by Half
 */
import Vue from 'vue'
import Vuex from 'vuex'
Vue.use(Vuex);

const state = {
  loginToken: {
    isLogin: sessionStorage.getItem('Login') || 0 //登录状态
  },
};

const mutations = {
  /*更新登录状态*/
  updataIsLoginState(state,loginState) {
    sessionStorage.setItem('Login',loginState);
    state.loginToken.isLogin = sessionStorage.getItem('Login')
  },
};

export default new Vuex.Store({
  state,
  mutations
})
