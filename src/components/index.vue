<template>
  <div class="storeIndex">
    <header class="store-header"></header>
    <div class="store-row"></div>
    <X-Button @click.native='payType'>Pay</X-Button>
    <PayMentKeyBoard ref="keyboard" @inputNum="listenValue" :maxLength="4"></PayMentKeyBoard>
  </div>
</template>
<script>
  import { XButton } from 'vux'
  import {avtivity} from '../js/services/GoodsQuery'
  import {apiUrl, apiImgUrl} from '../js/common/common'
  import PayMentKeyBoard from './PayMentKeyBoard.vue'
  export default {
    components: {XButton,PayMentKeyBoard},
    data() {
      return {
        title: '个人资料'
      }
    },
    mounted(){

    },
    methods: {
      payType(){
        this.$refs.keyboard.upKeyWin()
      },
      listenValue(a){
        alert(a +'交易中..')
      }
    }
  }
</script>
<style lang='stylus' scoped>
  .storeIndex{
    font-size: 1rem;
  }
</style>
