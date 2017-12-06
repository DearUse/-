// ajax公用部分
let $$ajax = (obj, url, data, callback, resType) => {

  // 如果是登录接口就添加 content-type
  if (url.indexOf("/user.login.do") === -1) {
    obj.$ajax({
      method: resType?resType: 'post',
      url: url,
      data: data,
    }).then(res=>{
      //报错返回格式
      if(res.data.exception){
        callback(res.data)
      }else{
        callback(res.data.data);
      }
    }).then(req=>{
      //console.log(123);
    })
  } else {
    return (obj.$ajax({
      method: "post",
      url: url,
      data: data,
      transformRequest: [function (data) {
        let ret = '';
        for (let it in data) {
          ret += encodeURIComponent(it) + '=' + encodeURIComponent(data[it]) + '&';
        }
        return ret;
      }],
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'HDB-App-Version': appVersion
      }
    }).then(res=>{
      callback(res)
    }))
  }
};

export {$$ajax}
