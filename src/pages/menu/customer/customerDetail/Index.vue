<template>
  <div id="customer-detail-content">
    <CustomerDetailHead
      :customer="customer"
      @saveCustomer="saveCustomer"
    ></CustomerDetailHead>
    <div class="detail-body">
      <div class="title-special"></div>
      <div class="title title-edit">
        <span>体测数据</span>
        <div class="more" @click="toBodyTestPage">
          <img src="images/customer/detail/more.png" alt="">
        </div>
      </div>
      <BodyTest :customer="customer" style="margin-bottom: 1.3rem"></BodyTest>
      <div class="title title-edit">
        <span>体态数据</span>
        <div class="more" @click="toBodyStatusPage">
          <img src="images/customer/detail/more.png" alt="">
        </div>
      </div>
      <BodyStatus :customer="customer" style="margin-bottom: 1.3rem"/>
      <div class="title title-edit">
        <span>训练目标</span>
        <div class="more" @click="toCustomerTrainingGoalPage">
          <img src="images/customer/detail/more.png" alt="">
        </div>
      </div>
      <CustomerTrainingGoal
        :goal-id="customer.goalId"
        :goal-list="trainingGoalList"
        style="margin-bottom: 1.3rem"
      ></CustomerTrainingGoal>
      <div class="title title-edit">
        <span>饮食计划</span>
        <div class="more" @click="toCustomerDietPlanPage">
          <img src="images/customer/detail/more.png" alt="">
        </div>
      </div>
      <CustomerDietPlan
        :customerDietPlan="customer.customerDietPlan"
        style="margin-bottom: 1.3rem"
      ></CustomerDietPlan>
      <div class="title title-edit">
        <span>训练计划</span>
        <div class="more" @click="toCustomerPlanPage">
          <img src="images/customer/detail/more.png" alt="">
        </div>
      </div>
      <ClassInfo :customer="customer" :classInfoList="classInfoList"/>
      <div class="saveCustomer" @click="saveCustomer">
        <div>保存客户信息</div>
      </div>
    </div>
    <transition enter-active-class="animate__slideInDown animate__faster"
                leave-active-class="animate__zoomOut animate__fast">
      <AlertMessage
        :alert-message-flag.sync="alertMessageFlag"
        :message="alertMessage"
        class="animate__animated"
        style="z-index: 3000"
        v-if="alertMessageFlag"
      >
      </AlertMessage>
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
    <transition enter-active-class="animate__fadeIn animate__faster"
                leave-active-class="animate__fadeOut animate__faster"
    >
      <LoadingData
        :loadingDataFlag.sync="loadingDataFlag"
        class="animate__animated"
        style="z-index: 6000"
        v-if="loadingDataFlag"
      ></LoadingData>
    </transition>
  </div>
</template>

<script>
import CustomerDetailHead from "components/customer/detail/CustomerDetailHead";
import BodyTest from "components/customer/detail/BodyTest";
import BodyStatus from "components/customer/detail/BodyStatus";
import ClassInfo from "components/customer/detail/ClassInfo";
import {apiCustomerDetail, apiUpdateCustomer, apiUpdateCustomerCommon} from "src/api/customer";
import AlertMessage from "components/common/AlertMessage";
import {getAge} from "src/util/dateUtil";
import SaveFinished from "components/common/SaveFinished";
import {apiClassInfoListWithDetail} from "src/api/classInfo";
import LoadingData from "components/common/LoadingData";
import CustomerDietPlan from "components/customer/detail/CustomerDietPlan";
import {apiTrainingGoalList} from "src/api/trainingGoal";
import CustomerTrainingGoal from "components/customer/detail/CustomerTrainingGoal";

export default {
  name: "Index",
  components: {
    CustomerDetailHead,
    BodyTest,
    BodyStatus,
    ClassInfo,
    AlertMessage,
    SaveFinished,
    LoadingData,
    CustomerDietPlan,
    CustomerTrainingGoal
  },
  created() {
    if (!this.$route.query.customerId) {
      this.alertMessage = "您当前跳转的页面不合法"
      this.alertMessageFlag = true
    } else {
      this.customerId = this.$route.query.customerId
      this.loadData()
    }
    this.loadDataCommon()
  },
  data() {
    return {
      customer: {
        bodyStatusData: {},
        bodyTestData: {},
        customerPlan: {},
      },
      alertMessage: "您当前跳转的页面不合法",
      alertMessageFlag: false,
      customerId: null,
      //点击保存之后的相关属性
      saveDialogFlag: false,
      saveItemSuccessfully: false,
      saveItemFailed: false,
      saveDialogHeaderImage: "images/customer/detail/save-header.png",
      saveMessage: "客户信息",
      classInfoList: [],
      loadingDataFlag: true,
      trainingGoalList: []
    }
  },
  methods: {
    loadData() {
      apiCustomerDetail(this.customerId).then((res) => {
        console.log(res)
        setTimeout(() => {
          this.loadingDataFlag = false
        }, 400)
        if (res.data.data && res.data.data.gender) {
          res.data.data.gender += ""
        }
        this.customer = res.data.data
        if (this.customer && this.customer.birthday) {
          this.customer.age = getAge(this.customer.birthday)
        }
      })
    },
    loadDataCommon() {
      apiClassInfoListWithDetail().then((res) => {
        this.classInfoList = res.data.data
        console.log(this.classInfoList)
      })
      apiTrainingGoalList().then(({data}) => {
        this.trainingGoalList = data.data.list
        console.log(this.trainingGoalList)
      })
    },
    toBodyTestPage() {
      this.$router.push({
        path: "/main/customer/bodyTest", query: {
          customerId: this.customer.customerId,
          age: this.customer.age,
          gender: this.customer.gender
        }
      })
    },
    toBodyStatusPage() {
      this.$router.push({
        path: "/main/customer/bodyStatus", query: {
          customerId: this.customer.customerId,
          gender: this.customer.gender
        }
      })
    },
    toCustomerDietPlanPage() {
      this.$router.push({
        path: "/main/customer/dietPlan", query: {
          customerId: this.customer.customerId
        }
      })
    },
    toCustomerPlanPage() {
      this.$router.push({
        path: "/main/customer/customerPlan", query: {
          customerId: this.customer.customerId
        }
      })
    },
    toCustomerTrainingGoalPage() {
      this.$router.push({
        path: "/main/customer/trainingGoal", query: {
          customerId: this.customer.customerId
        }
      })
    },
    saveDietPlan() {
      this.saveMessage = "客户资料"
      this.saveDialogFlag = true
      apiUpdateCustomerCommon(this.customer).then(() => {
        this.saveItemSuccessfully = true
      }).catch(() => {
        this.saveItemFailed = true;
      }).finally(() => {
        this.hideSaveDialog()
      })
    },
    saveCustomer() {
      console.log(this.customer)
      if (!this.customer.name) {
        this.alertMessage = "请填写姓名"
        this.alertMessageFlag = true
        return
      }
      if (!this.customer.mobile) {
        this.alertMessage = "请填写手机号"
        this.alertMessageFlag = true
        return
      }
      if (!this.customer.gender) {
        this.alertMessage = "请选择性别"
        this.alertMessageFlag = true
        return
      }
      if (this.customer.birthday) {
        let dateFormat = /^([1-9]\d{3})-(\d{2})-(\d{2})$/;
        if (dateFormat.test(this.customer.birthday)) {
          this.customer.age = getAge(this.customer.birthday)
        } else {
          this.alertMessage = "生日格式错误，正确的格式例如：1990-01-01"
          this.alertMessageFlag = true
          return
        }
      }
      //跟新weekIndex
      //更新period和week的index
      if (this.customer.customerPlan.trainingPlan && this.customer.customerPlan.customerPlanPeriods) {
        let weekIndex = 1;
        this.customer.customerPlan.customerPlanPeriods.forEach((period, periodIndex) => {
          period.periodIndex = periodIndex + 1
          period.customerPlanWeeks.forEach((week) => {
            week.weekIndex = weekIndex
            weekIndex += 1
          })
        })
      }
      this.saveDialogFlag = true
      apiUpdateCustomer(this.customer).then((res) => {
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
        }, 1000)
      }, 800)
    }
  }
}
</script>

<style scoped lang="scss">
#customer-detail-content {
  height: 100%;

  .detail-body {
    background-color: #fff;
    width: 100%;
    height: auto;
    margin-top: -.9rem;
    padding: 1.5rem;
    position: relative;
    border-radius: 1rem 1rem 0 0;

    .title-special {
      width: 100%;
      height: 1rem;
      position: absolute;
      left: 0;
      top: 0;
      border-radius: 1rem 1rem 0 0;
    }

    .title {
      height: 2.4rem;
      width: 100%;
      margin: 0 auto 1rem;
      background-color: #fff;
      font-weight: 600;
      font-size: 1.3rem;
      line-height: 3rem;
      position: relative;
    }

    .title-edit {
      .more {
        width: 4rem;
        height: 3rem;
        position: absolute;
        top: 0;
        right: 0;
        display: flex;
        justify-content: flex-end;
        align-items: center;

        img {
          width: 2rem;
          height: 2rem;
        }
      }
    }

    .saveCustomer {
      height: 2rem;
      width: 40%;
      margin: 2rem auto 1.5rem;
      background: linear-gradient(to right, #eac867, #f1d4a3);
      border-radius: .3rem;
      text-align: center;
      line-height: 2rem;
      font-size: .9rem;
      color: #fff;
      box-shadow: .1rem .1rem .2rem #b9baba;
      overflow: hidden;

      div {
        width: 100%;
        height: 100%;
        border-radius: .3rem;
        box-shadow: -.1rem -.1rem .3rem #eccc72 inset;
      }
    }
  }
}
</style>
