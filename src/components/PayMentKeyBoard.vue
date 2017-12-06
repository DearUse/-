
<template>
  <div>
    <transition name="payAnmiation">
        <div v-show="payAnmiation" class="keyboard">
          <div class="over"><img src="../imgs/close.png" alt="" @click="colseKeyWin"><span>请输入支付密码</span></div>
          <div class="passwordView">
            <div class="inputpassword">
              <input type="password" placeholder="半价团支付密码" v-model="PassValue" readonly="value">
              <img src="../imgs/keyboard/payclose.png" alt="" style="" v-show="close" @click="clearPass">
            </div>
            <button class="goPayment" ref="payBut" disabled="disabled" @click="goPayment">付款</button>
          </div>
          <div class="forgetPassWord"><span @click="forgetPassWord">忘记密码?</span></div>
          <div class="keyType">
            <ul>
              <li>
                <span @touchstart="choseEffect" @touchend="RemoveChoseEffect">1</span>
                <span @touchstart="choseEffect" @touchend="RemoveChoseEffect">2</span>
                <span @touchstart="choseEffect" @touchend="RemoveChoseEffect">3</span>
              </li>
              <li>
                <span @touchstart="choseEffect" @touchend="RemoveChoseEffect">4</span>
                <span @touchstart="choseEffect" @touchend="RemoveChoseEffect">5</span>
                <span @touchstart="choseEffect" @touchend="RemoveChoseEffect">6</span>
              </li>
              <li>
                <span @touchstart="choseEffect" @touchend="RemoveChoseEffect">7</span>
                <span @touchstart="choseEffect" @touchend="RemoveChoseEffect">8</span>
                <span @touchstart="choseEffect" @touchend="RemoveChoseEffect">9</span>
              </li>
              <li>
                <span class="none"></span>
                <span @touchstart="choseEffect" @touchend="RemoveChoseEffect">0</span>
                <a @touchstart="DownRemoveEffect" @touchend="UpRemoveEffect"></a>
              </li>
            </ul>
          </div>
        </div>
    </transition>
    <div class="payMentBg" v-show="payMentBg" @click="colseKeyWin"></div>
  </div>
</template>

<script>
  /*
   * <PayMentKeyBoard ref="keyboard" @inputNum="listenValue" :maxLength="4"></PayMentKeyBoard>  在inputNum中可接受用户输入的回调值
   * upKeyWin()为调起键盘方法   this.$refs.keyboard.upKeyWin();this.$refs.keyboard.colseKeyWin();
   * maxLength 最少输入长度
   * 输入完成自动触发inputNum中的方法listenValue()
   * */
  import $ from 'webpack-zepto'
  export default{
    props:['maxLength'],
    components: {},
    data() {
      return {
        value:[],
        payAnmiation : false,
        payMentBg : false,
        close : false,
        PassValue : ''
      }
    },
    watch:{
      PassValue(){
        if(this.PassValue.length >= this.maxLength){
          this.close = true;
          this.$refs.payBut.style.background = '#128ce4';
          this.$refs.payBut.style.color = '#fff';
          $('.goPayment').removeAttr('disabled','disabled');
        }else {
          this.close = false;
          this.$refs.payBut.style.background = '#d9d9d9';
          this.$refs.payBut.style.color = '#b9b9b9';
          $('.goPayment').attr('disabled','disabled');
        }
      }
    },
    mounted(){

    },
    methods: {
      upKeyWin(){
        this.value = [];
        this.PassValue = '';
        this.payMentBg = !this.payMentBg;
        this.payAnmiation = !this.payAnmiation;
      },
      colseKeyWin(){
        this.value = [];
        this.PassValue = '';
        this.payMentBg = !this.payMentBg;
        this.payAnmiation = !this.payAnmiation;
      },
      /*
       * 删除效果
       */
      DownRemoveEffect(event){
        this.value.pop();
        console.log(this.value);
        let transmit = '';
        $.each(this.value,(i, obj)=> {
          console.log(obj)
          transmit += obj;
        });
        this.PassValue = transmit;
        $(event.changedTouches[0].target).addClass('downDel');
      },
      UpRemoveEffect(event){
        $(event.changedTouches[0].target).removeClass('downDel');
      },
      /*
       * 数字键盘
       */
      choseEffect(event){
        $(event.changedTouches[0].target).addClass('downNum');
      },
      RemoveChoseEffect(event){
        this.value.push($(event.changedTouches[0].target).text());
        console.log(this.value);
        let transmit = '';
        $.each(this.value,(i, obj)=> {
          console.log(obj)
          transmit += obj;
        });
        $(event.changedTouches[0].target).removeClass('downNum');
        this.PassValue = transmit;
      },
      /*
       * 清楚密码
       */
      clearPass(){
        this.value = [];
        this.PassValue = '';
      },
      /*
       * 忘记密码
       */
      forgetPassWord(){

      },
      /*
       * 付款
       */
      goPayment(){
        this.$emit('inputNum',this.PassValue);
      }
    }
  }
</script>

<style lang='stylus' scoped>
  .payAnmiation-enter-active,.payAnmiation-leave-active
    transition all 0.5s ease
  .payAnmiation-enter,.payAnmiation-leave-active
    opacity 1
    transform: translate3d(0, 100%, 0);
    -ms-transform: translate3d(0, 100%, 0); /* IE 9 */
    -moz-transform: translate3d(0, 100%, 0); /* Firefox */
    -webkit-transform: translate3d(0, 100%, 0); /* Safari 和 Chrome */
    -o-transform: translate3d(0, 100%, 0);
  .payMentBg
    position fixed
    top 0
    left 0
    right 0
    bottom 0
    background rgba(0,0,0,0.2);
    z-index 500
  .none
    background #d1d5db !important
    box-shadow none !important
  .downDel
    background url("../imgs/keyboard/del.png") no-repeat center center !important
    background-size auto 0.466667rem !important
  .downNum
    /*box-shadow:inset 0 0 25px #ddd,0 0 3px #333 !important;*/
    background #becad9 !important
  .keyboard
    position fixed
    bottom 0
    width 100%
    z-index 501
    background #fff
    .over
      text-align center
      position relative
      span
        display: inline-block;
        margin: 0.3rem 0;
        font-size: 0.4rem;
        color #333;
      img
        position absolute
        width 0.5rem
        top 50%
        left 0.25rem
        margin-top -0.25rem
    .over:after
      display: block;
      position: absolute;
      left: 0;
      bottom: 0;
      width: 100%;
      border-top: 1px solid #ddd;
      content: ' ';
    .passwordView
      margin 0 0.25rem
      margin-top 0.6rem
      box-sizing border-box
      display flex
      flex-direction row
      .inputpassword
        flex 1
        position relative
        img
          position: absolute;
          width: 0.38rem;
          right: 0.266667rem;
          top: 50%;
          margin-top: -0.19rem;
        input
          position absolute
          top 0
          width 100%
          height 1.253333rem
          border 0.5px solid #ddd
          box-sizing border-box
          padding-left 0.2rem
          font-size 0.4rem
          border-top-left-radius 0.1rem
          border-bottom-left-radius 0.1rem
        ::-webkit-input-placeholder
          color #c4c4ca
          font-size 0.4rem
      button
        width 1.866667rem
        height 1.253333rem
        border-top-right-radius 0.1rem
        border-bottom-right-radius 0.1rem
        font-size 0.4rem
        border 0
        background #d9d9d9
        color #b9b9b9
    .forgetPassWord
      padding 0 0.25rem
      text-align right
      margin-bottom 0.6rem
      span
        color #128ce4
        line-height 1.013333rem
        font-size: 0.38rem;
    .keyType
      width 100%
      background #d1d5db
      ul
        width 100%
        li
          display flex
          justify-content space-around
        span
          flex 1
          width 3.133333rem
          height 1.266667rem
          margin 0.11rem
          line-height 1.266667rem
          text-align center
          font-size 0.6rem
          color #000
          background #fff
          border-radius 0.2rem
          box-shadow 0.2px 2px 3px #a2a7ab
          font-family: Helvetica !important;
        a
          flex 1
          width 3.133333rem
          height 1.266667rem
          margin 0.11rem
          line-height 1.266667rem
          background url("../imgs/keyboard/downDel.png") no-repeat center center
          background-size auto 0.466667rem
</style>
