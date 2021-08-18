<template>
  <div id="delete-confirm-content">
    <BackgroundBlack @click.native="hiddenDialog"></BackgroundBlack>
      <div class="confirm-dialog">
        <div class="title">删除确认</div>
        <div class="image">
          <img src="images/common/trash.png" alt="">
        </div>
        <div class="confirm" v-if="confirmFlag">
          <div class="message">
            <div class="empty-1" v-if="deleteMessage.length<=30"></div>
            <div class="empty-2" v-if="deleteMessage.length>30 && deleteMessage.length<=62"></div>
            <p>{{deleteMessage}}</p>
            <p>删除后无法撤销，请慎重。</p>
          </div>
          <div class="delete-button" @click="confirm()">删除</div>
          <div class="cancel" @click="cancel">取消</div>
        </div>
        <div class="deleting" v-if="deletingFlag">
          <h4>正在删除中...</h4>
          <img src="images/common/deleting.gif" alt="">
        </div>
        <div class="deleted" v-if="deleteItemSuccessfully">
          <h4>删除成功！</h4>
          <img src="images/common/delete-success.png" alt="">
        </div>
        <div class="failure" v-if="deleteItemFailed">
          <h4>删除失败！</h4>
          <img src="images/common/save-error.png" alt="">
        </div>
      </div>
  </div>
</template>

<script>
import BackgroundBlack from "components/common/BackgroundBlack";
export default {
  name: "DeleteConfirm",
  components:{BackgroundBlack},
  data(){
    return {
      confirmFlag:true,
      deletingFlag:false,
    }
  },
  props:{
    index:Number,
    deleteDialogFlag:Boolean,
    deleteItemSuccessfully:Boolean,
    deleteItemFailed:Boolean,
    deleteMessage:String,
  },
  mounted() {

  },
  methods:{
    confirm(){
      this.confirmFlag=false;
      this.deletingFlag=true;
      this.$emit("confirmDelete",this.index)
    },
    hiddenDialog(){
      this.$emit("update:deleteDialogFlag",false)
    },
    cancel(){
      this.$emit("update:deleteDialogFlag",false)
    }

  }
}
</script>

<style scoped lang="scss">
#delete-confirm-content {
  position: relative;
  .confirm-dialog {
    width: 56vw;
    height: 70vw;
    overflow-y: scroll;
    position: fixed;
    top: 50%;
    margin-top: -35vw;
    left: 22%;
    background-color: #fff;
    z-index: 2010;
    border-radius: 1rem;
    padding: 4% 3% 0;
    border: none;
    .title {
      text-align: center;
      font-size: 1.4rem;
      font-weight: bold;
    }
    .image {
      margin-top: 4%;
      display: flex;
      justify-content: center;
      align-items: center;
      width: 100%;
      height: 7rem;
      img {
        width: 7rem;
        height: 6.5rem;
      }
    }
    .confirm {
      height: 60%;
      .message {
        height: 50%;
        overflow-y: scroll;
        flex-direction: column;
        .empty-1 {
          height: 18%;
        }
        .empty-2 {
          height: 13%;
        }
        p {
          color:#777;
          text-align: center;
          margin: .3rem;
          font-size: .9rem;
        }
      }
      .delete-button {
        width: 80%;
        margin: 2% auto 0;
        height: 3rem;
        background-color: #ff1134;
        color:#fff;
        font-size: 1.2rem;
        text-align: center;
        border-radius: 1.5rem;
        line-height: 3rem;
        box-shadow: 0 .2rem .3rem #c85d6e;
      }
      .cancel {
        width: 80%;
        margin: 3% auto 0;
        height: 3rem;
        color:#888;
        line-height: 3rem;
        text-align: center;
        font-size: 1rem;
      }
    }

    .deleting {
      text-align: center;
      h4 {
        color: #f39292;
        font-size: 1.1rem;
      }
      img {
        width: 6rem;
        height: 6rem;
        margin-top: 12%;
      }
    }
    .deleted {
      text-align: center;
      h4 {
        color: #67bc48;
        font-size: 1.2rem;
        margin-left: 5%;
        margin-top: 6%;
      }
      img {
        width: 8rem;
        height: 8rem;
        margin-top: 8%;
      }
    }
    .failure {
      text-align: center;
      h4 {
        color:red;
        font-size: 1.2rem;
        margin-left: 5%;
        margin-top: 6%;
      }
      img {
        width: 8rem;
        height: 8rem;
        margin-top: 4%;
        margin-left: 5%;
      }
    }
  }
}
</style>
