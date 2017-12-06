// axios公用部分
import {$$ajax} from '../common/common.service'
//导入接口前缀
import {apiUrl} from '../common/network'

// java接口地址
const apiUrlObj = {
  ongoingActivities : `${apiUrl}activity.ActivityView.queryAll.query`,  //聚合活动-
};

/**
 *  servicesRequest  服务请求处理
 *  e: 调用传过来的this对象
 *
 *  login: 用户登录
 *  signup: 用户注册
 * */
let avtivity = {
  //购物金一级分类下的商品
  ongoingActivities : (e,data,successCallback) =>{
    $$ajax(e,apiUrlObj.ongoingActivities,data,function (data) {
      successCallback(data);
    });
  },
};

export {avtivity}
