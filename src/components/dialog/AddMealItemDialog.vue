<template>
  <div id="meal-item-dialog-content">
    <BackgroundBlack @click.native="hiddenDialog"></BackgroundBlack>
    <div class="meal-item-dialog">
      <div class="dialog-title">添加用料</div>
      <div class="dialog-body">
        <div class="item-line">
          <div>用料：</div>
          <div><q-input v-model="tempMealItem.healthyMealItemName" placeholder="请输入用料名称"/></div>
        </div>
        <div class="item-line">
          <div>含量：</div>
          <div><q-input v-model="tempMealItem.weight" type="number"/>克</div>
        </div>
        <div class="item-line">
          <div>份数：</div>
          <div><q-input v-model="tempMealItem.share" type="number"/>份</div>
        </div>
      </div>
      <div class="dialog-buttons">
        <div class="cancel" @click="cancel">取消</div>
        <div class="confirm" @click="addItem">添加</div>
      </div>
    </div>
    <transition enter-active-class="animate__slideInDown animate__faster"
                leave-active-class="animate__zoomOut animate__fast">
      <AlertMessage
        :alert-message-flag.sync="alertMessageFlag"
        :message="alertMessage"
        class="animate__animated"
        style="z-index: 3000"
        v-show="alertMessageFlag"
      >
      </AlertMessage>
    </transition>

  </div>
</template>

<script>
import BackgroundBlack from "components/common/BackgroundBlack";
import AlertMessage from "components/common/AlertMessage";
export default {
name: "AddMealItemDialog",
  components:{BackgroundBlack,AlertMessage},
  data(){
    return {
      alertMessage:"",
      alertMessageFlag:false,
      tempMealItem:{
        healthyMealItemName:"",
        weight:0,
        share:1,
      },
    }
  },
  created() {
    this.initData()
  },
  props:{
    mealItemDialogFlag:Boolean,
  },
  methods:{
    initData(){
      this.tempMealItem={
        healthyMealItemName:"",
        weight:0,
        share:1,
      }
    },
    cancel(){
      this.$emit("update:mealItemDialogFlag", false)
    },
    addItem(){
      if(!this.tempMealItem.healthyMealItemName){
        this.alertMessage="是输入用料名称"
        this.alertMessageFlag=true
        return
      }
      if(!this.tempMealItem.weight || this.tempMealItem.weight<=0){
        this.alertMessage="是输入含量"
        this.alertMessageFlag=true
        return
      }
      if(!this.tempMealItem.share || this.tempMealItem.share<=0){
        this.alertMessage="是输入份数"
        this.alertMessageFlag=true
        return
      }
      this.$emit("addMealItem",this.tempMealItem)
    },
    hiddenDialog() {
      this.$emit("update:mealItemDialogFlag", false)
    },
  }
}
</script>

<style scoped lang="scss">
#meal-item-dialog-content {
  .meal-item-dialog {
    width: 60%;
    height: 28rem;
    position: fixed;
    top: 50%;
    margin-top: -14rem;
    left: 20%;
    z-index: 2010;
    border-radius: 1rem;
    border: none;
    background-color: #fdf9d2;
    .dialog-title {
      position: absolute;
      width: 7rem;
      left:50%;
      margin-left: -3.5rem;
      top:-1.1rem;
      height: 2.5rem;
      background-color: #ffc35a;
      font-size: .9rem;
      font-weight: bold;
      border-radius: .3rem;
      text-align: center;
      line-height: 2.5rem;
      color:#fff;
    }
    .dialog-body {
      margin-top: 10%;
      height: 74%;
      width: 100%;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      .item-line {
        height: 5rem;
        width: 100%;
        padding: 0 15%;
        display: flex;
        justify-content: space-between;
        align-items: center;
        font-size: 1rem;
        div:nth-child(1){
          width: 36%;
          font-size: 1.2rem;
        }
        div:nth-child(2){
          display: flex;
          width: 70%;
          justify-content: center;
          align-items: center;
          label {
            font-size: 1rem;
            width: 90%;
          }
        }
      }
      .item-line:nth-child(2),.item-line:nth-child(3){
        div:nth-child(2){
          label {
            width: 3rem;
          }
        }
      }
    }

    .dialog-buttons {
      position: absolute;
      bottom: 0;
      height: 5rem;
      left: 5%;
      width: 90%;
      display: flex;
      justify-content: space-around;
      align-items: center;
      .cancel,.confirm {
        width: 5.5rem;
        height:2rem;
        background-color: #fff;
        line-height: 2rem;
        border-radius: .4rem;
        text-align: center;
        font-size: .9rem;
      }
      .cancel {
        border: 1px solid #b8b8b8;
        color:#888;
      }
      .confirm {
        border: 1px solid #ffc35a;
        background-color: #fde6bb;
        color: #f6a501;
      }
    }
  }
}
</style>
