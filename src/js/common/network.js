let apiUrl     //接口前缀
let apiImgUrl  //图片接口前缀

if(process.env.NODE_ENV == 'production'){  //正式服务器
  apiUrl = "https://v2m.55bjg.com/api/"; //接口前缀
  apiImgUrl =  "https://cache.55bjg.com";  //图片接口前缀
}else if(process.env.NODE_ENV == 'ali-test'){  //阿里测试服务器
  apiUrl = "http://api.twozii.com/api/";
  apiImgUrl = "http://api.twozii.com/api";
}else if(process.env.NODE_ENV == 'local-test'){  //本地测试  根据个人本地服务器修改
  apiUrl = "http://192.168.0.155:18881/";
  apiImgUrl = "http://192.168.0.155:18881";
}else{
  // apiUrl = "http://192.168.0.194:18881/";
  // apiImgUrl = "http://192.168.0.194:18881";

  apiUrl = "https://v2m.55bjg.com/api/"; //接口前缀
  apiImgUrl =  "https://cache.55bjg.com";  //图片接口前缀
}

export {apiUrl, apiImgUrl}
