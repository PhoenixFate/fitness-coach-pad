<template>
  <div id="save-finished-content">
    <BackgroundBlack></BackgroundBlack>
    <div class="save-dialog">
      <div class="header">
        <img :src="saveDialogHeaderImage" alt="">
      </div>
      <div class="content-waiting" v-if="!saveItemSuccessfully && !saveItemFailed">
        <h4>正在保存</h4>
        <h4>{{saveMessage}}</h4>
        <img src="images/common/wait.gif" alt="">
      </div>
      <div class="content-save-success" v-if="saveItemSuccessfully">
        <h4>保存</h4>
        <h4>{{saveMessage}}</h4>
        <h4>成功！</h4>
        <img src="images/common/success.png" alt="">
      </div>
      <div class="content-save-failure" v-if="saveItemFailed">
        <img src="images/common/save-error.png" alt="">
        <h4>保存</h4>
        <h4>{{saveMessage}}</h4>
        <h4>失败！</h4>
      </div>
    </div>
  </div>
</template>

<script>
import BackgroundBlack from "components/common/BackgroundBlack";
export default {
  name: "SaveFinished",
  components:{BackgroundBlack},
  data() {
    return {}
  },
  mounted() {

  },
  methods: {},
  props:{
    saveItemSuccessfully:Boolean,
    saveDialogHeaderImage:String,
    saveMessage:String,
    saveItemFailed:Boolean,
  }
}
</script>

<style scoped lang="scss">
#save-finished-content {
  position: relative;
  z-index: 10;
  .save-dialog {
    width: 40%;
    height: 22rem;
    overflow: hidden;
    position: fixed;
    top:  50%;
    margin-top: -11rem;
    left: 30%;
    background-color: #fff;
    z-index: 2010;
    border-radius: 1rem;
    .header {
      height: 40%;
      width: 100%;
      img {
        width: 100%;
        height: 100%;
      }
    }
    .content-waiting {
      height: 60%;
      width: 100%;
      display: flex;
      justify-content: center;
      align-items: center;
      flex-direction: column;
      position: relative;
      h4 {
        font-size: 1rem;
        color:#777;
        text-align: center;
        line-height: 1.8rem;
      }
      img {
        width: 9rem;
        height: 3rem;
        margin-top: .4rem;
      }
    }

    .content-save-success {
      height: 60%;
      width: 100%;
      display: flex;
      justify-content: flex-end;
      align-items: center;
      flex-direction: column;
      position: relative;
      h4 {
        font-size: 1rem;
        color:#55d1b2;
        line-height: 1.6rem;
        text-align: center;
      }
      h4:nth-child(3){
        margin-left: .8rem;
      }
      img {
        width: 6rem;
        height: 6rem;
        margin: .7rem 0 .4rem .4rem;
      }
    }

    .content-save-failure {
      height: 60%;
      width: 100%;
      display: flex;
      justify-content: center;
      align-items: center;
      flex-direction: column;
      position: relative;
      img {
        width: 6rem;
        height: 6rem;
        margin-bottom: .4rem;
        margin-left: .6rem;
      }
      h4 {
        font-size: 1rem;
        color: #ff6258;
        line-height: 1.6rem;
        text-align: center;
      }
      h4:nth-child(4){
        margin-left: .8rem;
      }
    }

  }
}
</style>
