<template>
  <div id="vip-dialog-content">
    <BackgroundBlack></BackgroundBlack>
    <div class="vip-content">
      <div class="diamond">
        <img src="images/customer/becomeVIP/diamond.png" alt="">
      </div>
      <div class="title">
        <div class="confirm" v-if="confirmFlag">
          <h4>您确认要为</h4>
          <h4><span>"{{customer.name}}"</span>开通VIP权限吗</h4>
        </div>
        <div class="becoming" v-if="becomingFlag">
          <h4>正在为</h4>
          <h4><span>"{{customer.name}}"</span>开通VIP权限...</h4>
        </div>
        <div class="success" v-if="vipSaveSuccessfully">
          <h4>开通成功！</h4>
        </div>
        <div class="success" v-if="vipSaveFailure">
          <h4>开通失败！</h4>
        </div>
      </div>
      <div class="body">
        <div class="confirm" v-if="confirmFlag" @click="sonOpenVIP">
          <div class="confirm-button">开通VIP</div>
        </div>
        <div class="confirm-cancel" v-if="confirmFlag" @click="cancel">
          取消
        </div>
        <div class="becoming" v-if="becomingFlag">
          <p>请稍等一会</p>
          <img src="images/customer/becomeVIP/vip-waiting.gif" alt="">
        </div>
        <div class="success" v-if="vipSaveSuccessfully">
          <img src="images/customer/becomeVIP/vip-success.png" alt="">
          <div @click="completeVIP"><div>完成</div></div>
        </div>
        <div class="success" v-if="vipSaveFailure">
          <img src="images/customer/becomeVIP/vip-success.png" alt="">
          <div @click="cancel"><div>知道了</div></div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import BackgroundBlack from "components/common/BackgroundBlack";
export default {
  name: "VipDialog",
  components:{BackgroundBlack},
  data(){
    return {
      confirmFlag:true,
      becomingFlag:false,
    }
  },
  mounted() {
    if(this.openVipManualFlag){
      this.confirmFlag=true;
      this.becomingFlag=false;
    }else {
      this.confirmFlag=false;
      this.becomingFlag=true;
    }
  },
  props:{
    vipSaveDialogFlag:Boolean,
    vipSaveSuccessfully:Boolean,
    vipSaveFailure:Boolean,
    customer:Object,
    openVipManualFlag:Boolean
  },
  methods:{
    sonOpenVIP(){
      this.confirmFlag=false;
      this.becomingFlag=true;
      this.$emit("openVip")
    },
    completeVIP(){
      this.$emit("finishVIP")
    },
    cancel(){
      this.$emit("update:vipSaveDialogFlag",false)
    }
  }
}
</script>

<style scoped lang="scss">
#vip-dialog-content {
  height: 100%;
  width: 100%;
  position: relative;
  z-index: 1;
  .vip-content {
    position: fixed;
    width: 18rem;
    height: 27rem;
    left: 50%;
    margin-left: -9rem;
    top: 50%;
    margin-top: -13.5rem;
    background-color: #fff;
    border-radius: 1.3rem;
    z-index: 2010;
    background-image: url("../../../../assets/images/customer/assignment/vip-dialog-background.png");
    background-size: 100% 100%;
    .diamond {
      position: absolute;
      right:4%;
      top:-10%;
      width: 40%;
      height: 30%;
      img {
        width: 100%;
        height: 100%;
      }
    }
    .title {
      width: 100%;
      height: 43%;
      position: relative;
      .confirm,.becoming {
        width: 100%;
        height: 100%;
        padding: 24% 0 0 10%;
        h4 {
          font-size: 1.2rem;
          color: #fceed6;
          span {
            margin-right: .3rem;
            color: #e2bc6c;
          }
        }
      }
      .success {
        font-size: 1.3rem;
        width: 100%;
        height: 4rem;
        text-align: center;
        position: absolute;
        bottom: 0;
        color: #fde5b8;
        h4 {
          color: #fde5b8;
        }
      }
    }
    .body {
      width: 100%;
      height: 57%;
      position: relative;
      .confirm {
        width: 60%;
        height: 22%;
        position: absolute;
        left:20%;
        bottom: 42%;
        background: linear-gradient(to right, #3b3d3b 0%,#232322 100%);
        border-radius: .3rem;
        font-size: 1.1rem;
        .confirm-button {
          width: 100%;
          height: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #e9b574;
          text-align: center;
        }
      }
      .confirm-cancel {
        width: 60%;
        height: 20%;
        position: absolute;
        left: 20%;
        bottom: 16%;
        font-size: 1.1rem;
        color: #4f4c4c;
        text-align: center;
        display: flex;
        align-items: center;
        justify-content: center;
      }
      .becoming {
        display: flex;
        justify-content: center;
        align-items: center;
        height: 100%;
        flex-direction: column;
        p {
          font-size: .9rem;
          color: #625e5e;
          margin-left: -.3rem;
        }
        img {
          width: 8rem;
          height:8rem;
        }
      }
      .success {
        height: 100%;
        display: flex;
        justify-content: center;
        align-items: center;
        flex-direction: column;
        img {
          width: 7rem;
          height: 6rem;
          margin-bottom: 9%;
        }
        > div {
          width: 50%;
          height: 2.5rem;
          background: linear-gradient(to right, #3b3d3b 0%,#232322 100%);
          border-radius: .3rem;
          text-align: center;
          font-size: 1rem;
          > div {
            width: 100%;
            height: 100%;
            text-align: center;
            line-height: 2.5rem;
            color: #e9b574;
          }
        }
      }

    }
  }
}
</style>
