<template>
  <div id="save-finished-content">
    <BackgroundBlack @click.native="hiddenDialog"></BackgroundBlack>
    <div class="save-dialog">
      <div class="header">
        <img src="images/common/alert-message.png" alt="">
      </div>
      <div class="message-content">
        <h5>温馨提示</h5>
        <div>{{alertMessage}}</div>
      </div>
      <div class="sure-buttons">
        <div class="btn" @click="hiddenDialog">取消</div>
        <div class="border"></div>
        <div class="btn" @click="sureLeave">确认离开</div>
      </div>
    </div>
  </div>
</template>

<script>
import BackgroundBlack from "components/common/BackgroundBlack";
export default {
  name: "AlertMessageBetter",
  components:{BackgroundBlack},
  data() {
    return {}
  },
  mounted() {

  },
  methods: {
    hiddenDialog(){
      this.$emit("update:alertMessageBetterFlag",false)
    },
    sureLeave(){
      this.$emit("sureLeave")
    }
  },
  props:{
    alertMessageBetterFlag:Boolean,
    alertMessage:String
  }
}
</script>

<style scoped lang="scss">
#save-finished-content {
  position: relative;
  z-index: 10;
  .save-dialog {
    width: 50%;
    height: 24rem;
    overflow: hidden;
    position: fixed;
    top: 50%;
    margin-top: -12rem;
    left: 25%;
    background-color: #fff;
    z-index: 2010;
    border-radius: .5rem;
    .header {
      height: 44%;
      width: 100%;
      display: flex;
      justify-content: center;
      align-items: center;
      img {
        width: 70%;
        height: 70%;
        margin-top: 0;
      }
    }
    .message-content {
      height: 40%;
      width: 100%;
      >h5 {
        height: 2rem;
        text-align: center;
        font-size: 1.3rem;
        font-weight: bold;
      }
      div {
        height: calc(100% - 2rem);
        padding: 0 3.5% .5rem 6%;
        font-size: 1rem;
        color: #4c4b4b;
        text-indent: 2em;
        display: flex;
        justify-content: center;
        align-items: center;
        overflow: hidden;
      }
    }
    .sure-buttons {
      height: 16%;
      width: 100%;
      display: flex;
      justify-content: center;
      align-items: center;
      .btn {
        width: 50%;
        height: 100%;
        display: flex;
        justify-content: center;
        font-size: 1.1rem;
        align-items: center;
      }
      .border {
        height: 60%;
        width: .1rem;
        background-color: #d0d0d0;
      }
      >div:nth-child(1){
        color:#999;
      }
      >div:nth-child(3){
        color: #fd6666;
      }
    }

  }
}
</style>
