
# #环境搭建  已搭建
#####   npm install stylus stylus-loader --save-dev
#####   npm install --save axios vue-axios- 
#####   npm install vux --save                     vux组件需依赖一下3个vux-loader css-loader less-loader
#####   npm install --save-dev vux-loader
#####   npm install --save-dev css-loader
#####   npm install --save-dev less-loader
#####   npm install vuex --save-dev
#####   npm install webpack-zepto --save-dev
#####   /static/flexible.js --rem  >>main.js

  #使用方式配置方式
#####   npm install stylus stylus-loader --save-dev   csss>>tylus
#####   npm install --save axios vue-axios            axios网络请求
#####   @import Vue from 'vue'
  
#####   import axios from 'axios'
#####   import VueAxios from 'vue-axios'
#####   Vue.use(VueAxios, axios)
  
#####   npm install vux --save                        vux组件需依赖一下3个vux-loader css-loader less-loader
#####   npm install --save-dev vux-loader
#####   npm install --save-dev css-loader
#####   npm install --save-dev less-loader
  
    @./build/webpack.base.conf.js
      module.exports 替换 originalConfig
      import Vue from 'vue'
      import axios from 'axios'
      import VueAxios from 'vue-axios'
      Vue.use(VueAxios, axios)

  #npm install --save axios vue-axios
  
    @import Axios from 'axios'
    Vue.config.productionTip = false;
    Vue.prototype.$ajax = Axios;
    Axios.defaults.withCredentials = true;
	
  #npm install vuex --save-deb
  
    @新建文件夹statusControl/status.js
      import Vue from 'vue'
      import Vuex from 'vuex'
      Vue.use(Vuex);
      创建相应规则
    @main.js
      import store from './statusControl/status'
      新加入store
      new Vue({
        store,
      })
	  
	  
#插件使用

####   <PayMentKeyBoard ref="keyboard" @inputNum="listenValue" :maxLength="4"></PayMentKeyBoard>
  #upKeyWin()为调起键盘方法   colseKeyWin()关闭键盘方法
#####     1. this.$refs.keyboard.upKeyWin(); 
#####     2. this.$refs.keyboard.colseKeyWin();
#####     3. maxLength 最少输入长度
#####     4. 输入完成自动触发inputNum中的方法listenValue()