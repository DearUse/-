import Vue from 'vue'
import Router from 'vue-router'
import index from '@/components/index'

Vue.use(Router)

const routes = [
  {
    path: '/',
    component: index
  }
];

const router = new Router({
  /* mode: "history",
   base: "/#",
   scrollBehavior: scrollBehavior,*/
  routes
});

router.beforeEach((to, from, next) => {
  if (to.matched.length ===0) {         //如果未匹配到路由
    next('/');
  } else {
    next();                            //如果匹配到正确跳转
  }
});

export default router;
