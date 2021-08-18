<template>
  <div id="customer-plan-content">
    <div class="customer-plan-header">
    </div>
    <div class="customer-plan-add" @click="showCustomerDietPlanDialogAdd">
      <img src="images/customer/bodyTest/add.png" alt="">
      <span>+</span>
    </div>
    <div class="customer-plan-body">
      <div class="customer-plan-item" v-for="(customerPlan,itemIndex) in customerPlanList"
           :key="itemIndex">
        <div class="status status-new" v-if="itemIndex===0">NEW</div>
        <div class="status status-old" v-if="itemIndex!==0">OLD</div>

        <div class="item-header">
          <div class="header-left">
            <strong v-if="customerPlan.trainingPlan">{{ customerPlan.trainingPlan.trainingPlanName }}</strong>
            <strong v-if="!customerPlan.trainingPlan">未选择训练计划</strong>
          </div>
          <div class="header-modify" @click="showBodyTestDialogUpdate(itemIndex)">
            <img src="images/customer/bodyTest/modify.png" alt="">
          </div>
        </div>
        <div class="customer-plan-name">
          <span>计划开始日期: </span>
          <strong>{{ customerPlan.startDate }}</strong>
        </div>
        <div class="customer-plan-name">
          <span>训练时段: </span>
          <strong>{{ customerPlan.startTime }} <span style="margin: 0 1rem">~</span> {{ customerPlan.endTime }}</strong>
        </div>
        <div v-if="customerPlan.trainingPlan && customerPlan.customerPlanPeriods">
          <PlanPeriod
            style="width: 90%;margin: .8rem auto"
            v-for="(period,index) in customerPlan.customerPlanPeriods"
            :index="index"
            ref="planPeriod"
            v-bind="period"
            :key="index">
          </PlanPeriod>
        </div>
      </div>
    </div>

    <transition enter-active-class="animate__fadeIn animate__faster"
                leave-active-class="animate__fadeOut animate__faster"
    >
      <CustomerDietPlanDialog
        :customerPlanDialogFlag.sync="customerPlanDialogFlag"
        :customer-plan="tempCustomerDietPlan"
        @saveCustomerDietPlan="saveCustomerDietPlan"
        class="animate__animated"
        style="z-index: 4000"
        v-if="customerPlanDialogFlag"
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
import {apiCustomerPlanList, apiSaveDietPlan, apiUpdateDietPlan} from "src/api/customer";
import SaveFinished from "components/common/SaveFinished";
import CustomerDietPlanDialog from "components/dialog/customer/CustomerDietPlanDialog";
import PlanPeriod from "components/customer/assignment/becomeVIP/PlanPeriod";

export default {
  components: {CustomerDietPlanDialog, SaveFinished, PlanPeriod},
  name: "CustomerPlanPage",
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

      customerPlanList: [],
      tempCustomerDietPlan: {},
      customerPlanDialogFlag: false,

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
      apiCustomerPlanList(this.customerId).then(({data}) => {
        console.log(data)
        this.customerPlanList = data.data
      })
    },
    showCustomerDietPlanDialogAdd() {
      this.tempCustomerDietPlan = {
        customerId: this.customerId
      }
      this.customerPlanDialogFlag = true
    },
    showBodyTestDialogUpdate(index) {
      this.tempCustomerDietPlan = JSON.parse(JSON.stringify(this.customerPlanList[index]));
      this.customerPlanDialogFlag = true
    },
    saveCustomerDietPlan() {
      this.saveDialogFlag = true
      if (this.tempCustomerDietPlan.customerPlanRelationId) {
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
#customer-plan-content {
  height: 100%;
  width: 100%;
  background-color: #eeecec;
  position: relative;

  .customer-plan-header {
    height: 16rem;
    width: 100%;
    background-image: url("../../../../assets/images/customer/bodyTest/body-test-background2.png");
    background-size: 100% 100%;
  }

  .customer-plan-add {
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

  .customer-plan-body {
    width: 90%;
    position: fixed;
    left: 5%;
    height: 86%;
    top: 11%;
    overflow-y: scroll;
    padding: .5rem;

    .customer-plan-item {
      min-height: 20rem;
      width: 100%;
      border-radius: 1rem;
      background-color: #fff;
      box-shadow: 0 .2rem .2rem #7ebdff;
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
          padding-left: 4rem;
          padding-top: .6rem;

          strong {
            font-size: 1rem;
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

      .customer-plan-name {
        height: 2rem;
        width: 100%;
        line-height: 2rem;
        padding-left: 4rem;

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

        .customer-plan-line {
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

    .customer-plan-empty {
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
