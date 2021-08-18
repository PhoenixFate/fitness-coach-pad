<template>
  <div id="body-test-content">
    <div class="body-test-header">
    </div>
    <div class="body-test-add" @click="showBodyStatusDialogAdd">
      <img src="images/customer/bodyTest/add.png" alt="">
      <span>+</span>
    </div>
    <div class="body-test-body">
      <div class="body-test-item" v-for="(bodyStatus,itemIndex) in bodyStatusList" :key="itemIndex">
        <div class="status status-new" v-if="itemIndex===0">NEW</div>
        <div class="status status-old" v-if="itemIndex!==0">OLD</div>
        <div class="item-header">
          <div class="header-left">
            <span>体态记录日期: </span><strong>{{ bodyStatus.addTime }}</strong>
          </div>
          <div class="header-modify" @click="showBodyStatusDialogUpdate(itemIndex)">
            <img src="images/customer/bodyTest/modify.png" alt="">
          </div>
        </div>
        <div class="item-content">
          <div class="body-status-item">
            <div class="header">正面</div>
            <div class="body">
              <img :src="bodyStatus.frontImage" alt="" v-if="bodyStatus.frontImage">
              <img src="images/customer/bodyStatus/body-front-male.png" alt=""
                   v-if="!bodyStatus.frontImage && gender==1">
              <img src="images/customer/bodyStatus/body-front-female.png" alt=""
                   v-if="!bodyStatus.frontImage && gender==2">
              <div class="empty-info" v-if="!bodyStatus.frontImage">
                暂无体态图片
              </div>
            </div>
          </div>
          <div class="body-status-item">
            <div class="header">侧面</div>
            <div class="body">
              <img :src="bodyStatus.sideImage" alt="" v-if="bodyStatus.sideImage">
              <img src="images/customer/bodyStatus/body-side-male.png" alt=""
                   v-if="!bodyStatus.sideImage && gender==1">
              <img src="images/customer/bodyStatus/body-side-female.png" alt=""
                   v-if="!bodyStatus.sideImage && gender==2">
              <div class="empty-info" v-if="!bodyStatus.sideImage">
                暂无体态图片
              </div>
            </div>
          </div>
          <div class="body-status-item">
            <div class="header">背面</div>
            <div class="body">
              <img :src="bodyStatus.backImage" alt="" v-if="bodyStatus.backImage">
              <img src="images/customer/bodyStatus/body-back-male.png" alt=""
                   v-if="!bodyStatus.backImage && gender==1">
              <img src="images/customer/bodyStatus/body-back-female.png" alt=""
                   v-if="!bodyStatus.backImage && gender==2">
              <div class="empty-info" v-if="!bodyStatus.backImage">
                暂无体态图片
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <BodyStatusDialog
      :bodyStatusDialogFlag.sync="bodyStatusDialogFlag"
      :bodyStatus="tempBodyStatus"
      :gender="gender"
      @saveBodyStatus="saveBodyStatus"
      style="z-index: 3000"
      v-if="bodyStatusDialogFlag"
    >
    </BodyStatusDialog>
    <transition enter-active-class="animate__fadeIn animate__faster"
                leave-active-class="animate__fadeOut animate__faster"
    >
      <SaveFinished
        :save-item-successfully="saveItemSuccessfully"
        :save-item-failed="saveItemFailed"
        :save-dialog-header-image="saveDialogHeaderImage"
        :save-message="saveMessage"
        class="animate__animated"
        style="z-index: 4000"
        v-if="saveDialogFlag"
      ></SaveFinished>
    </transition>
  </div>
</template>

<script>
import {apiBodyStatusList, apiUpdateBodyStatus, apiSaveBodyStatus} from "src/api/customer";
import SaveFinished from "components/common/SaveFinished";
import BodyStatusDialog from "components/dialog/customer/BodyStatusDialog";

export default {
  components: {BodyStatusDialog, SaveFinished},
  name: "CustomerBodyStatusPage",
  created() {
    if (!this.$route.query.customerId) {
      this.alertMessage = "您当前跳转的页面不合法"
      this.alertMessageFlag = true
    } else {
      this.customerId = this.$route.query.customerId
      this.gender = this.$route.query.gender + ""
      this.loadData()
    }
  },
  data() {
    return {
      customerId: -1,
      gender: -1,
      bodyStatusList: [],
      tempBodyStatus: {},
      bodyStatusDialogFlag: false,

      //点击保存之后的相关属性
      saveDialogFlag: false,
      saveItemSuccessfully: false,
      saveItemFailed: false,
      saveDialogHeaderImage: "images/customer/detail/save-header.png",
      saveMessage: "客户体态信息",
    }
  },
  methods: {
    loadData() {
      apiBodyStatusList(this.customerId).then(({data}) => {
        this.bodyStatusList = data.data
      })
    },
    showBodyStatusDialogAdd() {
      this.tempBodyStatus = {
        customerId: this.customerId
      }
      this.bodyStatusDialogFlag = true
    },
    showBodyStatusDialogUpdate(index) {
      this.tempBodyStatus = JSON.parse(JSON.stringify(this.bodyStatusList[index]));
      this.bodyStatusDialogFlag = true
    },
    saveBodyStatus() {
      this.saveDialogFlag = true
      if (this.tempBodyStatus.bodyStatusId) {
        // 修改
        apiUpdateBodyStatus(this.tempBodyStatus).then(() => {
          this.saveItemSuccessfully = true
          this.loadData()
        }).catch(() => {
          this.saveItemFailed = true;
        }).finally(() => {
          this.hideSaveDialog()
        })
      } else {
        // 新增
        apiSaveBodyStatus(this.tempBodyStatus).then(() => {
          this.saveItemSuccessfully = true
          this.loadData()
        }).catch(() => {
          this.saveItemFailed = true;
        }).finally(() => {
          this.hideSaveDialog()
        })
      }
    },
    hideSaveDialog() {
      setTimeout(() => {
        this.saveDialogFlag = false
        setTimeout(() => {
          this.saveItemSuccessfully = false
          this.saveItemFailed = false
          this.saveCustomerInfoFlag = false
        }, 1400)
      }, 1000)
    }
  }
}
</script>

<style scoped lang="scss">
#body-test-content {
  height: 100%;
  width: 100%;
  background-color: #eeecec;
  position: relative;

  .body-test-header {
    height: 16rem;
    width: 100%;
    background-image: url("../../../../assets/images/customer/bodyTest/body-test-background2.png");
    background-size: 100% 100%;
  }

  .body-test-add {
    width: 4rem;
    height: 4rem;
    position: absolute;
    top: -1.5rem;
    right: 1rem;
    z-index: 3000;
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: 2.8rem;
    font-weight: 300;
    padding-bottom: .4rem;
    padding-left: .1rem;
    color: #0c5fba;

    img {
      width: 100%;
      height: 100%;
      position: absolute;
      left: 0;
      top: 0;
    }
  }

  .body-test-body {
    width: 96%;
    position: fixed;
    left: 2%;
    height: 87%;
    top: 11%;
    overflow-y: scroll;
    padding: .5rem;

    .body-test-item {
      height: 23rem;
      width: 100%;
      border-radius: 1rem;
      background-image: url("../../../../assets/images/customer/bodyTest/body-test-item-background.png");
      box-shadow: 0 .2rem .2rem #7ebdff;
      background-size: 100% 100%;
      margin-bottom: 1.2rem;
      position: relative;
      overflow: hidden;

      .item-header {
        height: 4rem;
        width: 100%;
        position: relative;

        .header-left {
          height: 4rem;
          width: 20rem;
          display: flex;
          justify-content: flex-start;
          align-items: center;
          padding-left: 3rem;
          padding-top: .6rem;

          span {
            margin-right: 1.6rem;
            font-size: 1rem;
          }

          strong {
            font-size: .8rem;
          }
        }

        .header-modify {
          width: 3rem;
          height: 3rem;
          position: absolute;
          right: 1.5rem;
          top: .6rem;
          display: flex;
          justify-content: center;
          align-items: center;

          img {
            width: 2rem;
            height: 2rem;
          }
        }
      }

      .status {
        position: absolute;
        width: 5rem;
        height: 5rem;
        left: -2.3rem;
        top: -2.3rem;
        color: #fff;
        font-size: .8rem;
        transform: rotate(-45deg);
        display: flex;
        justify-content: center;
        align-items: flex-end;
        padding-bottom: .2rem;
        font-weight: bold;
      }

      .status-new {
        color: #33c155;
      }

      .status-old {
        color: #f1934b;
      }

      .item-content {
        width: 100%;
        height: 18rem;
        padding: .2rem 1rem 0 1rem;
        display: flex;
        justify-content: space-between;
        align-items: center;

        .body-status-item {
          width: 32%;
          height: 100%;
          box-shadow: .1rem .1rem .4rem #b1b1b1;
          background-color: #fff;

          border-radius: .3rem;
          border: .05rem solid #EBECEF;
          overflow: hidden;
          padding: .8rem;

          .header {
            text-align: left;
            height: 1.4rem;
            line-height: 1.4rem;
            font-size: .9rem;
            color: #888;
            margin-top: -.3rem;
          }

          .body {
            height: calc(100% - 1.2rem);
            position: relative;
            display: flex;
            justify-content: center;
            align-items: center;

            img {
              width: auto;
              max-width: 100%;
              height: 100%;
            }

            .empty-info {
              width: 60%;
              position: absolute;
              left: 20%;
              bottom: 10%;
              background-color: rgba(0, 0, 0, 0.4);
              height: 1.5rem;
              border-radius: .2rem;
              color: #fff;
              line-height: 1.5rem;
              text-align: center;
              font-size: .7rem;
            }
          }
        }
      }
    }
  }
}
</style>
