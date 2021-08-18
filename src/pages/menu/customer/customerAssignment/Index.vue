<template>
  <div id="customer-assignment-content">
    <AssignmentHeader
      :customer="customer"
      :save-customer-info-flag.sync="saveCustomerInfoFlag"
      @saveCustomer="saveData"
    ></AssignmentHeader>
    <q-stepper
      v-model="step"
      ref="stepper"
      color="primary"
      header-nav
      class="customer-stepper"
      animated
      style="z-index: 1"
    >
      <q-step
        :name="1"
        title="体态录入"
        icon="ion-body"
        :done="step > 1"
      >
        <AssignmentBodyTest
          :trainingGoalList="trainingGoalList"
          :customer="customer">
        </AssignmentBodyTest>
      </q-step>

      <q-step
        :name="2"
        title="体态讲解"
        icon="transfer_within_a_station"
        :done="step > 2"
      >
        <AssignmentBodyAnalysis
          :customer="customer"
        ></AssignmentBodyAnalysis>
      </q-step>

      <q-step
        :name="3"
        title="训练计划"
        icon="fitness_center"
        :done="step > 3"
      >
        <AssignmentExercisePlan
          :planList="planList"
          :customer="customer"
          :classInfoList="classInfoList"
          :plan-dialog-flag.sync="planDialogFlag"
          ref="exercisePlan"
        ></AssignmentExercisePlan>
      </q-step>

      <q-step
        :name="4"
        title="成为会员"
        icon="add_comment"
      >
        <AssignmentBecomeVIP
          :vip-card-dialog-flag.sync="vipCardDialogFlag"
          :generateDialogFlag.sync="generateDialogFlag"
          :updateDataFlag.sync="updateDataFlag"
          :vip-card-list="vipCardList"
          @setOrderNumber="setOrderNumber"
          ref="becomeVip"
          :customer="customer">
        </AssignmentBecomeVIP>
      </q-step>
      <template v-slot:navigation>
        <q-stepper-navigation>
          <div v-if="step > 1" class="bottom-previous"  @click="$refs.stepper.previous()">上一步</div>
          <div class="bottom-save" @click="saveData" v-if="step!==4">保存</div>
          <div v-if="step===4" class="become-vip" @click="showVipDialog">
            <div class="content">
              <div class="vip-content">
                <div>升级VIP</div>
                <img src="images/customer/becomeVIP/vip.png" alt="">
              </div>
            </div>
          </div>
        </q-stepper-navigation>
      </template>

    </q-stepper>

    <transition enter-active-class="animate__fadeIn animate__faster"
                leave-active-class="animate__fadeOut animate__faster"
    >
      <SaveFinished
        :save-item-successfully="saveItemSuccessfully"
        :save-item-failed="saveItemFailed"
        :save-dialog-header-image="saveDialogHeaderImage"
        :save-message="saveMessage"
        class="animate__animated"
        style="z-index: 3000"
        v-if="saveDialogFlag"
      ></SaveFinished>
    </transition>

    <transition enter-active-class="animate__fadeIn animate__faster"
                leave-active-class="animate__fadeOut animate__faster"
    >
      <vip-dialog
        :vipSaveDialogFlag.sync="vipSaveDialogFlag"
        :vip-save-successfully="vipSaveSuccessfully"
        :vip-save-failure="vipSaveFailure"
        :openVipManualFlag="openVipManualFlag"
        :customer="customer"
        @finishVIP="finishVIP"
        @openVip="openVip"
        ref="vipDialog"
        style="z-index: 3000"
        class="animate__animated"
        v-if="vipSaveDialogFlag"
      ></vip-dialog>
    </transition>
    <transition enter-active-class="animate__slideInDown animate__faster"
                leave-active-class="animate__zoomOut animate__fast">
      <AlertMessage
        :alert-message-flag.sync="alertMessageFlag"
        :message="alertMessage"
        class="animate__animated"
        style="z-index: 4000"
        v-show="alertMessageFlag"
      >
      </AlertMessage>
    </transition>
    <transition enter-active-class="animate__fadeIn animate__faster"
                leave-active-class="animate__fadeOut animate__faster"
    >
      <PlanListDialog
        :customer="customer"
        :planList="planList"
        :plan-dialog-flag.sync="planDialogFlag"
        :vip-card-list="vipCardList"
        @exercisePeriodInitData="exercisePeriodInitData"
        class="animate__animated"
        style="z-index: 5000"
        v-if="planDialogFlag"
      >
      </PlanListDialog>
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

    <transition enter-active-class="animate__fadeIn animate__faster"
                leave-active-class="animate__fadeOut animate__faster"
    >
      <VipCardDialog
        :vip-card-dialog-flag.sync="vipCardDialogFlag"
        :vip-card-list="vipCardList"
        :customer="customer"
        @updateBecomeVipData="updateBecomeVipData"
        class="animate__animated"
        style="z-index: 4000"
        v-if="vipCardDialogFlag"
      ></VipCardDialog>
    </transition>

    <transition enter-active-class="animate__fadeIn animate__faster"
                leave-active-class="animate__fadeOut animate__faster"
    >
      <UpdateData
        :updateDataFlag.sync="updateDataFlag"
        class="animate__animated"
        style="z-index: 4000"
        v-if="updateDataFlag"
      ></UpdateData>
    </transition>

    <transition enter-active-class="animate__fadeIn animate__faster"
                leave-active-class="animate__fadeOut animate__faster"
    >
      <GenerateDialog
        :generateDialogFlag.sync="generateDialogFlag"
        class="animate__animated"
        style="z-index: 4000"
        v-if="generateDialogFlag"
      ></GenerateDialog>
    </transition>

  </div>
</template>

<script>
import AssignmentBodyTest from "components/customer/assignment/AssignmentBodyTest";
import AssignmentHeader from "components/customer/assignment/AssignmentHeader";
import AssignmentBodyAnalysis from "components/customer/assignment/AssignmentBodyAnalysis";
import AssignmentExercisePlan from "components/customer/assignment/AssignmentExercisePlan";
import AssignmentBecomeVIP from "components/customer/assignment/AssignmentBecomeVIP";
import SaveFinished from "components/common/SaveFinished";
import VipDialog from "components/customer/assignment/becomeVIP/VipDialog";
import "./q-stepper.scss"
import AlertMessage from "components/common/AlertMessage";
import {apiCustomerDetail, apiUpdateCustomer} from "src/api/customer";
import {apiTrainingGoalList} from "src/api/trainingGoal";
import {apiTrainingPlanListWithDetail} from "src/api/trainingPlan";
import {apiClassInfoListWithDetail} from "src/api/classInfo";
import {ChineseDayData} from "src/const/template/chineseDayData";
import {addDateStr, getAge, getStrDate, getWeekFirstDay} from "src/util/dateUtil";
import PlanListDialog from "components/customer/assignment/exercisePlan/PlanListDialog";
import LoadingData from "components/common/LoadingData";
import VipCardDialog from "components/customer/assignment/becomeVIP/VipCardDialog";
import {apiVipCardList} from "src/api/vipCard";
import UpdateData from "components/common/UpdateData";
import {apiOrderDetail} from "src/api/order";
import {setStorage, getStorage} from "src/util/storageUtil";
import GenerateDialog from "components/common/GenerateDialog";

export default {
  name: "Index",
  components: {
    AssignmentBodyTest,
    AssignmentHeader,
    AssignmentBodyAnalysis,
    AssignmentExercisePlan,
    AssignmentBecomeVIP,
    SaveFinished,
    VipDialog,
    AlertMessage,
    PlanListDialog,
    LoadingData,
    VipCardDialog,
    UpdateData,
    GenerateDialog
  },
  data() {
    return {
      step: 1,
      trainingGoalList: [],
      planList: [],
      customer: {
        bodyTestData: {},
        bodyStatusData: {}
      },
      saveMessageList: [
        {
          image: "images/common/form-header.png",
          message: "客户基本信息",
        },
        {
          image: "images/customer/bodyTest/save-header.png",
          message: "体态基本数据"
        },
        {
          image: "images/customer/bodyAnalysis/save-header.png",
          message: "体态详细数据"
        },
        {
          image: "images/customer/exercisePlan/save-header.png",
          message: "训练计划"
        }
      ],
      //点击保存之后的相关属性
      saveDialogFlag: false,
      saveItemSuccessfully: false,
      saveItemFailed: false,
      saveDialogHeaderImage: "",
      saveMessage: "",

      //是否是保存客户基本资料的标志
      saveCustomerInfoFlag: false,

      vipSaveDialogFlag: false,
      vipSaveSuccessfully: false,
      vipSaveFailure: false,


      alertMessage: "",
      alertMessageFlag: false,
      customerId: null,

      chineseDays: ChineseDayData,
      classInfoList: [],


      planDialogFlag: false,
      coach: {},
      loadingDataFlag: true,
      vipCardDialogFlag: false,
      updateDataFlag: false,
      generateDialogFlag: false,

      vipCardList: [],
      //默认手动开启vip，也可以付费之后自动开启vip
      openVipManualFlag: true,
      orderNumber: "",
      queryOrderInternal: ""
    }
  },
  created() {
    if (!this.$route.query.customerId) {
      this.alertMessage = "您当前跳转的页面不合法"
      this.alertMessageFlag = true
    } else {
      this.customerId = this.$route.query.customerId
      this.loadData()
    }
    //查询上一次的orderNumber，如果已付费，则开通vip
    this.orderNumber = getStorage("orderNumber" + this.customerId)
    let coach = localStorage.getItem("coach")
    if (coach) {
      this.coach = JSON.parse(coach)
    }
    this.loadDataCommon()
    this.queryOrderIsPaid()
  },
  beforeDestroy() {
    //销毁定时任务
    if (this.queryOrderInternal) {
      clearInterval(this.queryOrderInternal)
    }
  },
  methods: {
    loadData() {
      apiCustomerDetail(this.customerId).then((res) => {
        setTimeout(() => {
          this.loadingDataFlag = false
        }, 400)
        this.customer = res.data.data
        if (this.customer.bodyStatusData.bodyCommon) {
          this.customer.bodyStatusData.bodyCommon += ""
        }
        if (this.customer.bodyStatusData.spineLordosis) {
          this.customer.bodyStatusData.spineLordosis += ""
        }
        if (this.customer.bodyStatusData.roundShoulder) {
          this.customer.bodyStatusData.roundShoulder += ""
        }
        if (this.customer.bodyStatusData.cervicalLordosis) {
          this.customer.bodyStatusData.cervicalLordosis += ""
        }
        if (this.customer.bodyStatusData.highOrLowWaist) {
          this.customer.bodyStatusData.highOrLowWaist += ""
        }
        if (this.customer.bodyStatusData.highOrLowShoulder) {
          this.customer.bodyStatusData.highOrLowShoulder += ""
        }
        if (this.customer.bodyStatusData.headTilt) {
          this.customer.bodyStatusData.headTilt += ""
        }
        this.customer.gender += ""
        if (this.customer.birthday) {
          this.customer.age = getAge(this.customer.birthday)
        }
        //训练时间、计划开始时间赋值默认值
        if (!res.data.data.customerPlan.startTime) {
          res.data.data.customerPlan.startTime = "17:00:00"
        } else {
          if (res.data.data.customerPlan.startTime.length <= 5) {
            res.data.data.customerPlan.startTime += ":00"
          }
        }
        if (!res.data.data.customerPlan.endTime) {
          res.data.data.customerPlan.endTime = "19:00:00"
        } else {
          if (res.data.data.customerPlan.endTime.length <= 5) {
            res.data.data.customerPlan.endTime += ":00"
          }
        }
        if (!res.data.data.customerPlan.startDate) {
          res.data.data.customerPlan.startDate = getStrDate(new Date());
        }
        if (res.data.data.customerPlan.trainingPlan) {
          let i = 0;
          res.data.data.customerPlan.customerPlanPeriods.forEach((period) => {
            if (period.customerPlanWeeks) {
              period.customerPlanWeeks.forEach((week) => {
                let dayList = week.customerPlanDays
                let finalDays = []
                this.chineseDays.forEach((commonDay) => {
                  let index = -1;
                  dayList.forEach((day, dayIndex) => {
                    if (commonDay.dayOfWeek === day.dayOfWeek) {
                      index = dayIndex
                    }
                  })
                  let realStartDate = getWeekFirstDay(new Date(res.data.data.customerPlan.startDate))
                  if (index !== -1) {
                    dayList[index].detailDate = addDateStr(realStartDate, i)
                    finalDays.push(dayList[index])
                  } else {
                    let day = {
                      classId: null,
                      classInfo: null,
                      dayOfWeek: commonDay.dayOfWeek,
                      detailDate: addDateStr(realStartDate, i)
                    }
                    finalDays.push(day)
                  }
                  i += 1
                })
                week.customerPlanDays = finalDays
              })
            }
          })
        }
        console.log(this.customer)
      })
    },
    loadDataCommon() {
      apiTrainingGoalList({limit: 100}).then((res) => {
        this.trainingGoalList = res.data.data.list
      })
      apiTrainingPlanListWithDetail({limit: 100}).then((res) => {
        this.planList = res.data.data
      })
      apiClassInfoListWithDetail().then((res) => {
        this.classInfoList = res.data.data
      })
      apiVipCardList({limit: 100}).then((res) => {
        //给vipCard添加不同的样式
        res.data.data.list.forEach((vipCard) => {
          if (vipCard.vipCardType === "WEEK_CARD") {
            vipCard.className = "vip-card-week"
          } else if (vipCard.vipCardType === "MONTH_CARD") {
            vipCard.className = "vip-card-month"
          } else if (vipCard.vipCardType === "SEASON_CARD") {
            vipCard.className = "vip-card-season"
          } else if (vipCard.vipCardType === "HALF_YEAR_CARD") {
            vipCard.className = "vip-card-half-year"
          } else if (vipCard.vipCardType === "THREE_SEASON_CARD") {
            vipCard.className = "vip-card-three-season"
          } else if (vipCard.vipCardType === "YEAR_CARD") {
            vipCard.className = "vip-card-year"
          }
        })
        this.vipCardList = res.data.data.list
        console.log(this.vipCardList)
      })
    },
    showVipDialog() {
      this.vipSaveDialogFlag = true;
    },
    queryOrderIsPaid() {
      if (this.queryOrderInternal) {
        clearInterval(this.queryOrderInternal)
      }
      //每6秒查询一次是否支付成功
      this.queryOrderInternal = setInterval(() => {
        if (this.orderNumber) {
          apiOrderDetail(this.orderNumber).then((res) => {
            console.log(res)
            if (res.data.data && res.data.data.orderStatus === "PAID") {
              //支付成功
              this.openVipManualFlag = false
              this.vipSaveDialogFlag = true
              setTimeout(() => {
                this.openVip()
              }, 600)
              //清楚定时任务
              clearInterval(this.queryOrderInternal)
              this.orderNumber = null
              localStorage.removeItem("orderNumber" + this.customerId);
            }
          })
        }
      }, 6000)
    },
    setOrderNumber(orderNumber) {
      this.orderNumber = orderNumber
      //生成的二维码30分钟有效
      setStorage("orderNumber" + this.customerId, orderNumber, 30 * 60 * 1000)
    },
    exercisePeriodInitData() {
      this.$refs.exercisePlan.exercisePeriodInitData()
    },
    updateBecomeVipData() {
      this.$refs.becomeVip.$forceUpdate()
      this.$refs.becomeVip.resetQrCode()
    },
    openVip() {
      this.customer.tempProgressIndex = this.step;
      this.customer.progressIndex = 5
      //更新period和week的index
      if (this.customer.customerPlan.trainingPlan && this.customer.customerPlan.customerPlanPeriods) {
        //客户的trainingPlan绑定coachId
        this.customer.customerPlan.coachId = this.coach.coachId
        this.customer.currentClassCoachId = this.coach.coachId
        this.customer.customerPlan.customerPlanPeriods.forEach((period, periodIndex) => {
          period.periodIndex = periodIndex + 1
          period.customerPlanWeeks.forEach((week, weekIndex) => {
            week.weekIndex = weekIndex + 1
          })
        })
      } else {
      }
      apiUpdateCustomer(this.customer).then(() => {
        this.openVipManualFlag = true
        this.vipSaveSuccessfully = true
        this.$refs.vipDialog.becomingFlag = false
      }).catch(() => {
        this.openVipManualFlag = true
        this.vipSaveFailure = true;
        this.$refs.vipDialog.becomingFlag = false
      })
    },
    finishVIP() {
      this.vipSaveDialogFlag = false;
      this.$router.push("/home")
    },
    saveData() {
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
      this.customer.tempProgressIndex = this.step;
      // return
      if (this.step === 1) {
        if (this.customer.progressIndex < 2) {
          this.customer.progressIndex = 2
        }
      } else if (this.step === 2) {
        if (this.customer.progressIndex < 3) {
          this.customer.progressIndex = 3
        }
      } else if (this.step === 3) {
        if (this.customer.progressIndex < 4) {
          this.customer.progressIndex = 4
        }
      }

      //训练时间、计划开始时间格式化
      if (this.customer.customerPlan.startTime.length <= 5) {
        this.customer.customerPlan.startTime += ":00"
      }
      if (this.customer.customerPlan.endTime.length <= 5) {
        this.customer.customerPlan.endTime += ":00"
      }

      //更新period和week的index
      if (this.customer.customerPlan.trainingPlan && this.customer.customerPlan.trainingPlan.customerPlanPeriods) {
        let weekIndex = 1;
        this.customer.customerPlan.trainingPlan.customerPlanPeriods.forEach((period, periodIndex) => {
          period.periodIndex = periodIndex + 1
          period.customerPlanWeeks.forEach((week) => {
            week.weekIndex = weekIndex
            weekIndex += 1
          })
        })
      }
      if (this.saveCustomerInfoFlag) {
        this.saveDialogHeaderImage = this.saveMessageList[0].image
        this.saveMessage = this.saveMessageList[0].message
      } else {
        this.saveDialogHeaderImage = this.saveMessageList[this.step].image
        this.saveMessage = this.saveMessageList[this.step].message
      }
      this.saveDialogFlag = true
      apiUpdateCustomer(this.customer).then(() => {
        this.saveItemSuccessfully = true
        this.$forceUpdate()
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

<style lang="scss">
#customer-assignment-content {
  background-color: #eeeff3;

  .customer-stepper {
    width: 100%;
    margin: 0 auto 0;
    background-color: #fff;
  }
  .bottom-previous,.bottom-save {
    width: 12rem;
    height: 3rem;
    border-radius: .3rem;
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: 24px;
    font-family: PingFangSC-Semibold, PingFang SC;
    font-weight: 600;
  }
  .bottom-previous {
    background-color: #EBECEF;
    color: #23262D;
    margin-right: 1rem;
  }
  .bottom-save {
    background: #23262D;
    color: #FFFFFF;
  }
  .become-vip {
    width: 33%;
    border-radius: .2rem;
    background: linear-gradient(to right, #f0e0af 0%, #e3ac72 100%);
    color: #fff;
    font-weight: bold;
    box-shadow: .1rem .1rem .2rem #bababa;
    overflow: hidden;

    .content {
      width: 100%;
      height: 100%;
      display: flex;
      justify-content: center;
      align-items: center;
      box-sizing: border-box;
      padding: .3rem;
      box-shadow: -1px -1px .1rem #d9882a inset;

      .vip-content {
        width: 100%;
        height: 100%;
        border: 1px solid #dea040;
        border-radius: .2rem;
        display: flex;
        justify-content: center;
        align-items: center;

        div {
          width: 66%;
          text-align: center;
          color: #9b4e2a;
          font-size: 1.1rem;
        }

        img {
          width: 2rem;
          height: 1.5rem;
          margin-bottom: .2rem;
        }
      }
    }


  }
}
</style>
