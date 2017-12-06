/**
 * 公共函数
 */
!(function (window, document, Object) {

  /**
   * [init 初始化函数]
   * @type {Object}
   */
  let _init = {
    log: str => {

    }
  };

  /**
   * [GetQueryString 截取url上面的参数]
   * @AuthorHTL
   * @DateTime  2017-05-11T16:49:22+0800
   * @param     {[type]}                 val [需要获取值的键名]
   */
  _init.GetQueryString = (name) => {
    let reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
    let r = window.location.search.substr(1).match(reg);
    if (r != null) return unescape(r[2]);
    return null;
  };

  /**
   * [getCode  获取短信验证码]
   * */
  _init.getCode = (className, time, style) => {
    let timeInter = setInterval(function () {
      if(document.getElementsByClassName(className)[0]){
        document.getElementsByClassName(className)[0].innerHTML = time;
        document.getElementsByClassName(className)[0].setAttribute('disabled', 'disabled');
        if(style == "blue"){
          document.getElementsByClassName(className)[0].style.backgroundColor = "#ddd"
        }
        if(style == "red"){
          document.getElementsByClassName(className)[0].style.borderColor = "#ddd"
          document.getElementsByClassName(className)[0].style.color = "#ddd"
        }
        if(Number(time)<0){
          document.getElementsByClassName(className)[0].innerHTML = '发送验证码';
          document.getElementsByClassName(className)[0].removeAttribute('disabled');
          clearInterval(timeInter);
        }else{
          time--;
          if (time <= 0) {
            tiem = 0;
            document.getElementsByClassName(className)[0].innerHTML = '重新获取';
            document.getElementsByClassName(className)[0].removeAttribute('disabled');
            if(style == "blue"){
              document.getElementsByClassName(className)[0].style.backgroundColor = "#0099ff"
            }
            if(style == "red"){
              document.getElementsByClassName(className)[0].style.borderColor = "#d91c37"
              document.getElementsByClassName(className)[0].style.color = "#d91c37"
            }
            clearInterval(timeInter);
          }
        }
      }
    }, 1000);
  };

  /**
   * [tip  提示框显示]
   * @obj this对象
   * @text 提示描述
   * @time 提示框消失的时间
   * */
  _init.tip = (obj,text,time) =>{
    obj.$vux.toast.text(text);
    setTimeout(()=>{
      obj.$vux.toast.hide();
    },time?time:1000)
  };

  /**
   *  [isEmptyObject 判断对象是否为空]
   *  @e 对象
   * */
  _init.isEmptyObject = (e) => {
    var t;
    for (t in e)
      return !1;
    return !0
  };

  /**
   * [upLoadPicture 图片上传]
   * @el input-file对象
   * @el el input上传元素
   * @el base64 vux组件
   * @el callbackFun 成功回调函数
   * @el obj this对象
   * */
  let imgRoom = [];
  let sendData;  //截取掉data部分的 dataUrl
  let dataLength; //base64位图片长度
  let result;  //dataUR
  _init.upLoadPicture = (el, base64, callbackFun, obj,EXIF) => {
    var Orientation = null;// 参数，最大高度
    var MAX_HEIGHT = 600;
    let f = el[0].files[0];
    let fileType = f.type;
    if (/image\/\w+/.test(fileType)) {
      let fileReader = new FileReader();
      let count=0;
      fileReader.onload = function (event) {
        result = event.target.result; //返回的dataURL
        if(f.size==0){
          count++;
          if(count>20){
            obj.$vux.loading.hide();
            obj.$vux.toast.text("无法获取图片内容");
          }else{
            setTimeout(function () {
              fileReader.readAsDataURL(f);
            },500);
          }
          return;
        }
        let image = new Image();
        //若图片大小大于1M，压缩后再上传，否则直接上传
        if (f.size > 1024*1024*7) {
          obj.$vux.loading.hide();
          obj.$vux.toast.text("上传的图片不能超过7M");
          return false
        }else{
          if (f.size > 1024 * 1024) {
            image.onload = function () { //创建一个image对象，给canvas绘制使用
              let canvas = document.getElementById("canvas");


              // 如果高度超标
              if(image.height > MAX_HEIGHT) {
                // 宽度等比例缩放 *=
                let ratio = MAX_HEIGHT / image.height; // 计算缩放比例

                image.width = image.width * ratio;
                image.height = MAX_HEIGHT;
              }
              let ctx = canvas.getContext('2d');
              // canvas清屏
              ctx.clearRect(0, 0, canvas.width, canvas.height);
              // 重置canvas宽高

              canvas.width = image.width;
              canvas.height = image.height;
              ctx.drawImage(image, 0, 0, image.width,image.height);

              EXIF.getData(image, function() {
                EXIF.getAllTags(this);
                Orientation = EXIF.getTag(this, 'Orientation');
              });

              //修复ios
              if (navigator.userAgent.match(/iphone/i)) {
                //如果方向角不为1，都需要进行旋转 added by lzk
                if (Orientation != "" && Orientation != 1) {
                  switch (Orientation) {
                    case 6://需要顺时针（向左）90度旋转
                      rotateImg(image, 'left', canvas);
                      break;
                    case 8://需要逆时针（向右）90度旋转
                      rotateImg(image, 'right', canvas);
                      break;
                    case 3://需要180度旋转
                      rotateImg(image, 'right', canvas);//转两次
                      rotateImg(image, 'right', canvas);
                      break;
                  }
                }
              }

              let newImageData = canvas.toDataURL(fileType, 0.7); //重新生成图片
              //取出base64字符
              sendData = newImageData.replace("data:" + fileType + ";base64,", '');
              dataLength = base64.decode(sendData).length;//base64位图片长度（这里没有写这个方法）
              callbackFun(newImageData);
            };
          } else {
            image.onload = function () { //创建一个image对象，给canvas绘制使用
              //取出base64字符
              sendData = result.replace("data:" + fileType + ";base64,", '');
              dataLength = base64.decode(sendData).length;
              callbackFun(result);
            };
          }
        }

        image.src = result;
      };
      fileReader.readAsDataURL(f);
    } else {
      callbackFun(-1);
    }
  };
  //对图片旋转处理
  function rotateImg(img, direction,canvas) {
    //最小与最大旋转方向，图片旋转4次后回到原方向
    var min_step = 0;
    var max_step = 3;
    if (img == null)return;
    // 如果高度超标

    //img的高度和宽度不能在img元素隐藏后获取，否则会出错
    var height = img.height;
    var width = img.width;

    var step = 2;
    if (step == null) {
      step = min_step;
    }
    if (direction == 'right') {
      step++;
      //旋转到原位置，即超过最大值
      step > max_step && (step = min_step);
    } else {
      step--;
      step < min_step && (step = max_step);
    }
    //img.setAttribute('step', step);
    /*var canvas = document.getElementById('pic_' + pid);
     if (canvas == null) {
     img.style.display = 'none';
     canvas = document.createElement('canvas');
     canvas.setAttribute('id', 'pic_' + pid);
     img.parentNode.appendChild(canvas);
     }  */
    //旋转角度以弧度值为参数

    var degree = step * 90 * Math.PI / 180;
    var ctx = canvas.getContext('2d');
    switch (step) {
      case 0:
        canvas.width = width;
        canvas.height = height;
        ctx.drawImage(img, 0, 0);
        break;
      case 1:
        canvas.width = height;
        canvas.height = width;
        ctx.rotate(degree);
        ctx.drawImage(img, 0, -height,width,height);
        break;
      case 2:
        canvas.width = width;
        canvas.height = height;
        ctx.rotate(degree);
        ctx.drawImage(img, -width, -height,width,height);
        break;
      case 3:
        canvas.width = height;
        canvas.height = width;
        ctx.rotate(degree);
        ctx.drawImage(img, -width, 0,width,height);
        break;
    }
  }

  /**
   *  更新用户信息
   *  @e 对象
   * */
  _init.Updateuserinformation = (obj, shoppingMoney, fn) => {
    //>>购物金余额
    let conmeback = (e) => {
      if(e.exception){
        return
      }
      obj.$store.commit('updataUserMeg', (e.shoppingGold).toCurrency());//购物金
      obj.$store.commit('updataBalance', e.balance ? (e.balance).toCurrency() : 0);//余额
      obj.$store.commit('updataUserId', e.id);//用户id
      obj.$store.commit('updataRewardPoint', e.rewardPoint);//积分
      obj.$store.commit('updataCustoms',e.vUserCustoms);//海关证
      obj.$store.commit('updataCertification',e.realNameCertificationStatus);//认证
      obj.$store.commit('updataPayCode',e.vPaymentPasswordStatus);//支付密码状态
      obj.$store.commit('updataUserMobile',e.mobile);//用户手机号
      if(fn){
        fn()
      }
    };
    let dataChange = {
      "params": {}
    };
    shoppingMoney.bGetUserMessage(obj, dataChange, conmeback)
  };

  //秒转换时分秒
  _init.formatSeconds = (value) => {
    value = parseInt(value);
    var seconds = '00';// 秒
    var minutes = '00';// 分
    var hours = '00';// 小时
    if (value > 60) {
      minutes = parseInt(value / 60);
      seconds = parseInt(value % 60);
      if (seconds < 10) {
        seconds = "0" + seconds
      }
      if (minutes < 10) {
        minutes = "0" + minutes
      }
      if (minutes > 60) {
        hours = parseInt(minutes / 60);
        if (hours < 10) {
          hours = "0" + hours
        }
        minutes = parseInt(minutes % 60);
        if (minutes < 10) {
          minutes = "0" + minutes
        }
      }
    }else{
      seconds = value
      if (seconds < 10) {
        seconds = "0" + seconds
      }
    }
    return {
      hours: hours,
      minutes: minutes,
      seconds: seconds
    }
  };

  //判断是否微信浏览器
  _init.isWeiXin = () => {

    var ua = window.navigator.userAgent.toLowerCase();
    if(ua.match(/MicroMessenger/i) == 'micromessenger'){
      return true;
    }else{
      return false;
    }
  };
  //判断QQ浏览器
  _init.is_QQInnerBro = () => {
    var ua = window.navigator.userAgent.toLowerCase();
    if (ua.match(/QQ/i) == "qq") {
      return true;
    } else {
      return false;
    }
  };

  //创建form表单
  _init.formSubmit = (obj) => {
    var turnForm = document.createElement("form");
    //一定要加入到body中！！
    document.body.appendChild(turnForm);
    turnForm.method = 'get';
    turnForm.action = obj.url;
    turnForm.target = '_blank';
    for(var i in obj.data){
      var newElement = document.createElement("input");
      newElement.setAttribute("name",i);
      newElement.setAttribute("type","hidden");
      newElement.setAttribute("value",obj.data[i]);
      turnForm.appendChild(newElement);
    }
    turnForm.submit()
    turnForm.remove()
  };

  //对象比较
  _init.isObjectValueEqual =(a, b) =>{
    if(a===b){
      //判断是否为0和-0
      return a !== 0 || 1/a ===1/b;
    }
    //判断是否为null和undefined
    if(a==null||b==null){
      return a===b;
    }
    //接下来判断a和b的数据类型
    var classNameA=toString.call(a),
      classNameB=toString.call(b);
    //如果数据类型不相等，则返回false
    if(classNameA !== classNameB){
      return false;
    }
    //如果数据类型相等，再根据不同数据类型分别判断
    switch(classNameA){
      case '[object RegExp]':
      case '[object String]':
        //进行字符串转换比较
        return '' + a ==='' + b;
      case '[object Number]':
        //进行数字转换比较,判断是否为NaN
        if(+a !== +a){
          return +b !== +b;
        }
        //判断是否为0或-0
        return +a === 0?1/ +a === 1/b : +a === +b;
      case '[object Date]':
      case '[object Boolean]':
        return +a === +b;
    }

    //如果是对象类型
    if(a instanceof Object){
      //获取a和b的属性长度
      var propsA = Object.getOwnPropertyNames(a),
        propsB = Object.getOwnPropertyNames(b);
      if(propsA.length != propsB.length){
        return false;
      }
      for(var i=0;i<propsA.length;i++){
        var propName=propsA[i];
        //如果对应属性对应值不相等，则返回false
        if(a[propName] !== b[propName]){
          return false;
        }
      }
      return true;
    }

    //如果是数组类型
    if(classNameA == '[object Array]'){
      if(a.toString() == b.toString()){
        return true;
      }
      return false;
    }
  };
  //img转 src
  _init.convertImgToBase64 = (url, callback, outputFormat) => {
    let canvas = document.createElement('CANVAS'),
      ctx = canvas.getContext('2d'),
      img = new Image;
    img.crossOrigin = 'Anonymous';
    img.onload = function(){
      canvas.height = img.height;
      canvas.width = img.width;
      ctx.drawImage(img,0,0);
      let dataURL = canvas.toDataURL(outputFormat || 'image/png',0.8);
      callback.call(this, dataURL);
      canvas = null;
    };
    img.src = url;
  };

  /**
   * //获取当前地理位置
   * @param r.address.city  所在城市
   * @param callback.call  导出需要的对象
   * @returns {*[]}
   */
  _init.CurrentPosition = (callback) => {
    if (!window.cordova) {
      var geolocation = new BMap.Geolocation();
      geolocation.getCurrentPosition(function(r){
        if(this.getStatus() == BMAP_STATUS_SUCCESS){
          const getLongitude = getCoordWgs84(r.point.lng,r.point.lat);
          const Latitude = {
            locality : r.address.city,
            getLongitude
          };
          callback.call(this,Latitude);
        }else {
          console.log('failed'+this.getStatus());
        }
      },{enableHighAccuracy: true});
    }else {

    }
  };
  /**
   * 提供了百度坐标（BD09）转 WGS84坐标系
   */
  function getCoordWgs84(bd_lon, bd_lat) {
    //百度坐标转国测局坐标
    var coordGcj02 = bd09togcj02(bd_lon,bd_lat);
    //国测局坐标转wgs84坐标
    var coordWgs84 = gcj02towgs84(coordGcj02[0],coordGcj02[1]);
    return coordWgs84
  }
  /**
   * 提供了百度坐标（BD09）、国测局坐标（火星坐标，GCJ02）、和WGS84坐标系之间的转换
   */
    //定义一些常量
  var x_PI = 3.14159265358979324 * 3000.0 / 180.0;
  var PI = 3.1415926535897932384626;
  var a = 6378245.0;
  var ee = 0.00669342162296594323;

  /**
   * 百度坐标系 (BD-09) 与 火星坐标系 (GCJ-02)的转换
   * 即 百度 转 谷歌、高德
   * @param bd_lon
   * @param bd_lat
   * @returns {*[]}
   */
  function bd09togcj02(bd_lon, bd_lat) {
    var bd_lon = +bd_lon;
    var bd_lat = +bd_lat;
    var x = bd_lon - 0.0065;
    var y = bd_lat - 0.006;
    var z = Math.sqrt(x * x + y * y) - 0.00002 * Math.sin(y * x_PI);
    var theta = Math.atan2(y, x) - 0.000003 * Math.cos(x * x_PI);
    var gg_lng = z * Math.cos(theta);
    var gg_lat = z * Math.sin(theta);
    return [gg_lng, gg_lat]
  };

  /**
   * 火星坐标系 (GCJ-02) 与百度坐标系 (BD-09) 的转换
   * 即谷歌、高德 转 百度
   * @param lng
   * @param lat
   * @returns {*[]}
   */
  function gcj02tobd09(lng, lat) {
    var lat = +lat;
    var lng = +lng;
    var z = Math.sqrt(lng * lng + lat * lat) + 0.00002 * Math.sin(lat * x_PI);
    var theta = Math.atan2(lat, lng) + 0.000003 * Math.cos(lng * x_PI);
    var bd_lng = z * Math.cos(theta) + 0.0065;
    var bd_lat = z * Math.sin(theta) + 0.006;
    return [bd_lng, bd_lat]
  };

  /**
   * WGS84转GCj02
   * @param lng
   * @param lat
   * @returns {*[]}
   */
  function wgs84togcj02(lng, lat) {
    var lat = +lat;
    var lng = +lng;
    if (out_of_china(lng, lat)) {
      return [lng, lat]
    } else {
      var dlat = transformlat(lng - 105.0, lat - 35.0);
      var dlng = transformlng(lng - 105.0, lat - 35.0);
      var radlat = lat / 180.0 * PI;
      var magic = Math.sin(radlat);
      magic = 1 - ee * magic * magic;
      var sqrtmagic = Math.sqrt(magic);
      dlat = (dlat * 180.0) / ((a * (1 - ee)) / (magic * sqrtmagic) * PI);
      dlng = (dlng * 180.0) / (a / sqrtmagic * Math.cos(radlat) * PI);
      var mglat = lat + dlat;
      var mglng = lng + dlng;
      return [mglng, mglat]
    }
  };

  /**
   * GCJ02 转换为 WGS84
   * @param lng
   * @param lat
   * @returns {*[]}
   */
  function gcj02towgs84(lng, lat) {
    var lat = +lat;
    var lng = +lng;
    if (out_of_china(lng, lat)) {
      return [lng, lat]
    } else {
      var dlat = transformlat(lng - 105.0, lat - 35.0);
      var dlng = transformlng(lng - 105.0, lat - 35.0);
      var radlat = lat / 180.0 * PI;
      var magic = Math.sin(radlat);
      magic = 1 - ee * magic * magic;
      var sqrtmagic = Math.sqrt(magic);
      dlat = (dlat * 180.0) / ((a * (1 - ee)) / (magic * sqrtmagic) * PI);
      dlng = (dlng * 180.0) / (a / sqrtmagic * Math.cos(radlat) * PI);
      var mglat = lat + dlat;
      var mglng = lng + dlng;
      return [lng * 2 - mglng, lat * 2 - mglat]
    }
  };

  function transformlat(lng, lat) {
    var lat = +lat;
    var lng = +lng;
    var ret = -100.0 + 2.0 * lng + 3.0 * lat + 0.2 * lat * lat + 0.1 * lng * lat + 0.2 * Math.sqrt(Math.abs(lng));
    ret += (20.0 * Math.sin(6.0 * lng * PI) + 20.0 * Math.sin(2.0 * lng * PI)) * 2.0 / 3.0;
    ret += (20.0 * Math.sin(lat * PI) + 40.0 * Math.sin(lat / 3.0 * PI)) * 2.0 / 3.0;
    ret += (160.0 * Math.sin(lat / 12.0 * PI) + 320 * Math.sin(lat * PI / 30.0)) * 2.0 / 3.0;
    return ret
  };

  function transformlng(lng, lat) {
    var lat = +lat;
    var lng = +lng;
    var ret = 300.0 + lng + 2.0 * lat + 0.1 * lng * lng + 0.1 * lng * lat + 0.1 * Math.sqrt(Math.abs(lng));
    ret += (20.0 * Math.sin(6.0 * lng * PI) + 20.0 * Math.sin(2.0 * lng * PI)) * 2.0 / 3.0;
    ret += (20.0 * Math.sin(lng * PI) + 40.0 * Math.sin(lng / 3.0 * PI)) * 2.0 / 3.0;
    ret += (150.0 * Math.sin(lng / 12.0 * PI) + 300.0 * Math.sin(lng / 30.0 * PI)) * 2.0 / 3.0;
    return ret
  };

  /**
   * 判断是否在国内，不在国内则不做偏移
   * @param lng
   * @param lat
   * @returns {boolean}
   */
  function out_of_china(lng, lat) {
    var lat = +lat;
    var lng = +lng;
    // 纬度3.86~53.55,经度73.66~135.05
    return !(lng > 73.66 && lng < 135.05 && lat > 3.86 && lat < 53.55);
  };
  module.exports = _init;  //导出初始化函数

})(window, document, Object);
