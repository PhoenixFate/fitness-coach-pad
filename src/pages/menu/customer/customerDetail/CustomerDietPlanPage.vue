<template>
  <div id="customer-diet-plan-content">
    <div class="customer-diet-plan-header">
    </div>
    <div class="customer-diet-plan-add" @click="showCustomerDietPlanDialogAdd">
      <img src="images/customer/bodyTest/add.png" alt="">
      <span>+</span>
    </div>
    <div class="customer-diet-plan-body">
      <div class="customer-diet-plan-item" v-for="(customerDietPlan,itemIndex) in customerDietPlanList"
           :key="itemIndex">
        <div class="status status-new" v-if="itemIndex===0">NEW</div>
        <div class="status status-old" v-if="itemIndex!==0">OLD</div>
        <div class="item-header">
          <div class="header-left">
            <span>饮食阶段: </span>
            <strong>{{ customerDietPlan.startDate }}</strong>
            <strong style="margin: 0 .4rem">~</strong>
            <strong>{{ customerDietPlan.endDate }}</strong>
          </div>
          <div class="header-modify" @click="showBodyTestDialogUpdate(itemIndex)">
            <img src="images/customer/bodyTest/modify.png" alt="">
          </div>
        </div>
        <div class="diet-plan-name">
          <span>饮食计划: </span>
          <strong>{{ customerDietPlan.dietPlan.dietPlanName }}</strong>
        </div>
        <DietPlanDetailItem
          :diet-plan-item="dietPlanItem"
          v-for="(dietPlanItem,dietPlanItemIndex) in customerDietPlan.dietPlan.dietPlanItems"
          :key="dietPlanItemIndex"
        >
        </DietPlanDetailItem>
      </div>
      <div class="customer-diet-plan-item customer-diet-plan-empty"
           v-if="!customerDietPlanList || customerDietPlanList.length===0">
        <img src="images/customer/detail/diet-plan-empty.png" alt="">
        <p>暂无饮食计划</p>
      </div>
    </div>

    <transition enter-active-class="animate__fadeIn animate__faster"
                leave-active-class="animate__fadeOut animate__faster"
    >
      <CustomerDietPlanDialog
        :customerDietPlanDialogFlag.sync="customerDietPlanDialogFlag"
        :customer-diet-plan="tempCustomerDietPlan"
        @saveCustomerDietPlan="saveCustomerDietPlan"
        class="animate__animated"
        style="z-index: 4000"
        v-if="customerDietPlanDialogFlag"
      ></CustomerDietPlanDialog>
    </transition>
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
import {apiDietPlanList, apiSaveDietPlan, apiUpdateDietPlan} from "src/api/customer";
import SaveFinished from "components/common/SaveFinished";
import CustomerDietPlanDialog from "components/dialog/customer/CustomerDietPlanDialog";
import DietPlanDetailItem from "components/diet/dietPlan/DietPlanDetailItem";

export default {
  components: {CustomerDietPlanDialog, SaveFinished, DietPlanDetailItem},
  name: "CustomerDietPlanPage",
  created() {
    if (!this.$route.query.customerId) {
      this.alertMessage = "您当前跳转的页面不合法"
      this.alertMessageFlag = true
    } else {
      this.customerId = this.$route.query.customerId
      this.loadData()
    }
  },
  data() {
    return {
      customerId: -1,

      customerDietPlanList: [],
      tempCustomerDietPlan: {},
      customerDietPlanDialogFlag: false,

      //点击保存之后的相关属性
      saveDialogFlag: false,
      saveItemSuccessfully: false,
      saveItemFailed: false,
      saveDialogHeaderImage: "images/customer/detail/save-header.png",
      saveMessage: "客户饮食计划",
    }
  },
  methods: {
    loadData() {
      apiDietPlanList(this.customerId).then(({data}) => {
        console.log(data)
        this.customerDietPlanList = data.data
      })
    },
    showCustomerDietPlanDialogAdd() {
      this.tempCustomerDietPlan = {
        customerId: this.customerId
      }
      this.customerDietPlanDialogFlag = true
    },
    showBodyTestDialogUpdate(index) {
      this.tempCustomerDietPlan = JSON.parse(JSON.stringify(this.customerDietPlanList[index]));
      this.customerDietPlanDialogFlag = true
    },
    saveCustomerDietPlan() {
      this.saveDialogFlag = true
      if (this.tempCustomerDietPlan.customerDietPlanRelationId) {
        // 修改
        apiUpdateDietPlan(this.tempCustomerDietPlan).then(() => {
          this.saveItemSuccessfully = true
          this.loadData()
        }).catch(() => {
          this.saveItemFailed = true;
        }).finally(() => {
          this.hideSaveDialog()
        })
      } else {
        // 新增
        apiSaveDietPlan(this.tempCustomerDietPlan).then(() => {
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
#customer-diet-plan-content {
  height: 100%;
  width: 100%;
  background-color: #eeecec;
  position: relative;

  .customer-diet-plan-header {
    height: 16rem;
    width: 100%;
    background-image: url("../../../../assets/images/customer/bodyTest/body-test-background2.png");
    background-size: 100% 100%;
  }

  .customer-diet-plan-add {
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

  .customer-diet-plan-body {
    width: 90%;
    position: fixed;
    left: 5%;
    height: 86%;
    top: 11%;
    overflow-y: scroll;
    padding: .5rem;

    .customer-diet-plan-item {
      min-height: 20rem;
      width: 100%;
      border-radius: 1rem;
      background-image: url("../../../../assets/images/customer/bodyTest/body-test-item-background.png");
      box-shadow: 0 .2rem .2rem #7ebdff;
      background-size: 100% 20rem;
      margin-bottom: 1.2rem;
      position: relative;
      overflow: hidden;
      padding-bottom: 1rem;
      .item-header {
        height: 4rem;
        width: 100%;
        position: relative;

        .header-left {
          height: 4rem;
          width: 26rem;
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

      .diet-plan-name {
        height: 2rem;
        width: 100%;
        line-height: 2rem;
        padding-left: 3rem;

        span {
          font-size: 1rem;
          margin-right: 1.6rem;
        }

        strong {
          font-size: 1.1rem;
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
        height: 16rem;
        padding: .2rem 2rem 0 2rem;

        .customer-diet-plan-line {
          width: 100%;
          height: 2rem;
          display: flex;
          justify-content: space-between;

          .body-item {
            width: 45%;
            height: 100%;
            padding: .3rem;
            font-size: .9rem;
            display: flex;
            align-items: center;
            font-weight: 500;

            img {
              width: 1.8rem;
              height: 1.8rem;
            }

            .body-item-right {
              flex: 1;
              display: flex;
              justify-content: space-between;
              padding-left: 1.4rem;
              align-items: center;

              .body-item-input {
                display: flex;
                justify-content: flex-end;
                align-items: center;

                span {
                  font-size: .6rem;
                  font-weight: normal;
                }

                strong {
                  font-size: .8rem;
                  margin-left: .3rem;
                  font-weight: bold;
                  margin-right: .3rem;
                }
              }
            }
          }
        }
      }
    }

    .customer-diet-plan-empty {
      display: flex;
      justify-content: center;
      align-items: center;
      flex-direction: column;

      img {
        width: 16rem;
        height: 16rem;
      }

      p {
        font-size: 1rem;
        color: #999;
      }
    }
  }
}
</style>
