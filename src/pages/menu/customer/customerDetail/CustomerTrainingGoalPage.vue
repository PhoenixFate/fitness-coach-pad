<template>
  <div id="customer-training-goal-content">
    <div class="customer-training-goal-header">
    </div>
    <div class="customer-training-goal-body">
      <div class="customer-training-goal-item">
        <h5>顾客训练目标</h5>
        <div class="goals">
          <div class="goal-item"
               :class="customer.goalId===goal.trainingGoalId?'goal-item-selected':''"
               @click="selectTrainingGoal(goalIndex)"
               v-for="(goal,goalIndex) in goalList" :key="goalIndex">
            {{ goal.goalName }}
          </div>
        </div>
        <div class="saveCustomer" @click="saveCustomer">
          <div>保存客户训练目标</div>
        </div>
      </div>
    </div>
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
import {apiCustomerInfo, apiUpdateCustomerCommon} from "src/api/customer";
import SaveFinished from "components/common/SaveFinished";
import {apiTrainingGoalList} from "src/api/trainingGoal";

export default {
  components: {SaveFinished},
  name: "CustomerBodyTestPage",
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
      customer: {
        goalId: -1
      },
      //点击保存之后的相关属性
      saveDialogFlag: false,
      saveItemSuccessfully: false,
      saveItemFailed: false,
      saveDialogHeaderImage: "images/customer/detail/save-header.png",
      saveMessage: "客户训练目标",
      goalList: []
    }
  },

  methods: {
    loadData() {
      apiCustomerInfo(this.customerId).then(({data}) => {
        this.customer = data.data
      })
      apiTrainingGoalList().then(({data}) => {
        this.goalList = data.data.list
        console.log(this.goalList)
      })
    },
    selectTrainingGoal(index) {
      this.customer.goalId = this.goalList[index].trainingGoalId
    },
    saveCustomer() {
      this.saveDialogFlag = true
      apiUpdateCustomerCommon(this.customer).then(() => {
        this.saveItemSuccessfully = true
      }).catch(() => {
        this.saveItemFailed = true;
      }).finally(() => {
        this.hideSaveDialog()
      })
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
#customer-training-goal-content {
  height: 100%;
  width: 100%;
  background-color: #eeecec;
  position: relative;

  .customer-training-goal-header {
    height: 16rem;
    width: 100%;
    background-image: url("../../../../assets/images/customer/bodyTest/body-test-background2.png");
    background-size: 100% 100%;
  }

  .customer-training-goal-add {
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

  .customer-training-goal-body {
    width: 90%;
    position: fixed;
    left: 5%;
    height: 86%;
    top: 11%;
    overflow-y: scroll;
    padding: .5rem;

    .customer-training-goal-item {
      min-height: 20rem;
      width: 100%;
      border-radius: 1rem;
      background-image: url("../../../../assets/images/customer/bodyTest/body-test-item-background.png");
      box-shadow: 0 .2rem .2rem #7ebdff;
      background-size: 100% 20rem;
      margin-bottom: 1.2rem;
      position: relative;
      overflow: hidden;
      display: flex;
      justify-content: center;
      align-items: center;
      padding-bottom: 2rem;

      h5 {
        position: absolute;
        top: 2rem;
        left: 2.8rem;
      }

      .goals {
        display: flex;
        justify-content: center;
        align-items: center;

        .goal-item {
          width: 5.4rem;
          height: 2.8rem;
          background-color: #e5e5e5;
          display: flex;
          justify-content: center;
          align-items: center;
          border-right: 1px solid #fff;
        }

        .goal-item-selected {
          background-color: #99c9d7;
          color: #076997;
        }
      }

      .saveCustomer {
        height: 2.5rem;
        width: 40%;
        margin: 2rem auto 1.5rem;
        background: linear-gradient(to right, #e7bc3f, #f5d195);
        border-radius: .3rem;
        text-align: center;
        line-height: 2.5rem;
        font-size: 1rem;
        color: #fff;
        box-shadow: .1rem .1rem .2rem #b9baba;
        overflow: hidden;
        position: absolute;
        bottom: 0;

        div {
          width: 100%;
          height: 100%;
          border-radius: .3rem;
          box-shadow: -.1rem -.1rem .3rem #eccc72 inset;
        }
      }
    }
  }
}
</style>
