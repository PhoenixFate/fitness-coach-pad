<template>
  <div id="exercise-plan-content">
    <div class="exercise-plan">
      <div class="plan-select-left">
        <img :src="customer.customerPlan.trainingPlan.trainingPlanCoverImage" alt=""
             v-if="customer.customerPlan.trainingPlan">
        <div class="empty" v-if="!customer.customerPlan.trainingPlan">
          暂无训练计划
        </div>
      </div>
      <div class="plan-select-right">
        <div class="select-plan" @click="showPlanListDialog">
          <div class="left">
            <h5 v-if="!customer.customerPlan.trainingPlan"><span>请选择训练计划</span></h5>
            <h5 v-if="customer.customerPlan.trainingPlan">{{ customer.customerPlan.trainingPlan.trainingPlanName }}</h5>
            <p v-if="customer.customerPlan.trainingPlan && customer.customerPlan.trainingPlan.trainingPlanDescription">
              {{ customer.customerPlan.trainingPlan.trainingPlanDescription }}</p>
          </div>
          <div class="right">
            <img src="images/classAssignment/arrow-up.png" alt="">
          </div>
        </div>
        <div class="select-time">
          <div class="left">
            <img src="images/classAssignment/time.png" alt="">
            <span>正常训练时间</span>
          </div>
          <div class="right">
            <date-picker
              v-model="customer.customerPlan.startTime"
              :minute-step="5"
              :second-step="60"
              format="HH:mm"
              value-type="format"
              type="time"
              placeholder="HH:mm"
              style="width: 3rem"
            ></date-picker>
            <strong style="margin-left: .2rem">~</strong>
            <date-picker
              v-model="customer.customerPlan.endTime"
              :minute-step="5"
              :second-step="60"
              format="HH:mm"
              value-type="format"
              type="time"
              placeholder="HH:mm"
              style="width: 3rem"
            ></date-picker>
          </div>
        </div>
        <div class="select-date">
          <div class="left">
            <img src="images/classAssignment/date.png" alt="">
            <span>计划开始日期</span>
          </div>
          <div class="right">
            <date-picker
              v-model="customer.customerPlan.startDate"
              @input="selectStartDate"
              format="YYYY-MM-DD"
              valueType="format"
              placeholder="开始日期"
              style="width: 6rem"
            ></date-picker>
          </div>
        </div>
      </div>
    </div>
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
  </div>
</template>

<script>
import DatePicker from 'vue2-datepicker';
import 'vue2-datepicker/index.css';
import {
  addDateStr,
  compareDate,
  dateDiff, getDayOfWeek,
  getStrDate
} from "src/util/dateUtil";
import AlertMessage from "components/common/AlertMessage";
import "./mx-input.scss"

export default {
  name: "ExercisePlanHeader",
  components: {DatePicker, AlertMessage},
  data() {
    return {
      startTime: "",
      endTime: "",
      hours: Array.from({length: 10}).map((_, i) => i + 8),
      startDate: null,
      alertMessageFlag: false,
      alertMessage: "",
      oldStartDate: ""
    }
  },
  created() {
    console.log(this.planList)
    this.oldStartDate = this.customer.customerPlan.startDate
  },
  methods: {
    selectStartDate(e) {
      console.log(e)
      if (!e) {
        this.customer.customerPlan.startDate = this.oldStartDate
        return
      }
      if (compareDate(getStrDate(new Date), e)) {
        //请选择今天及之后的日期
        this.alertMessage = "请选择今天及之后的日期"
        this.alertMessageFlag = true
        return
      }
      let diffDays = dateDiff(e, this.oldStartDate)
      if (this.customer.customerPlan.trainingPlan) {
        this.customer.customerPlan.customerPlanPeriods.forEach((period, periodIndex) => {
          let tempPeriodDays = []
          //提取出有课程的那几天
          period.customerPlanWeeks.forEach((week, weekIndex) => {
            week.customerPlanDays.forEach((day) => {
              if (day.classId) {
                day.detailDate = addDateStr(day.detailDate, diffDays)
                day.dayOfWeek = getDayOfWeek(day.detailDate)
                tempPeriodDays.push(day)
              }
            })
          })
          period.tempPeriodDays = tempPeriodDays
        })
        this.customer.customerPlan.customerPlanPeriods.forEach((period, periodIndex) => {
          let fullTempDays = []
          //提取出来的有课程的那几天中，补全中间的休息日期
          for (let i = 0; i <= dateDiff(period.tempPeriodDays[period.tempPeriodDays.length - 1].detailDate, period.tempPeriodDays[0].detailDate); i++) {
            let index = -1
            period.tempPeriodDays.forEach((tempDay, dayIndex) => {
              if (addDateStr(period.tempPeriodDays[0].detailDate, i) === tempDay.detailDate) {
                index = dayIndex
              }
            })
            if (index !== -1) {
              fullTempDays.push(period.tempPeriodDays[index])
            } else {
              fullTempDays.push({
                detailDate: addDateStr(period.tempPeriodDays[0].detailDate, i),
                dayOfWeek: getDayOfWeek(addDateStr(period.tempPeriodDays[0].detailDate, i))
              })
            }
          }

          //补齐开始日期前的空余的几天
          let startDate = fullTempDays[0].detailDate
          let tempHeadArray = []
          for (let i = 0; i < getDayOfWeek(startDate); i++) {
            tempHeadArray.push({
              detailDate: addDateStr(startDate, -(getDayOfWeek(startDate) - i)),
              dayOfWeek: i
            })
          }
          fullTempDays = tempHeadArray.concat(fullTempDays)

          //补齐最后一天到最后一天所在礼拜天之间的空隙
          let endDate = fullTempDays[fullTempDays.length - 1]
          for (let i = endDate.dayOfWeek + 1, j = 1; i <= 6; i++, j++) {
            fullTempDays.push({
              detailDate: addDateStr(endDate.detailDate, j),
              dayOfWeek: i
            })
          }

          let customerWeekList = []
          //形成-> period->week-day的数据结构
          for (let i = 0; i < parseInt(fullTempDays.length / 7); i++) {
            let finalDays = []
            let tempWeekItem = {}
            for (let j = 0; j < 7; j++) {
              finalDays.push(fullTempDays[i * 7 + j])
            }
            tempWeekItem.customerPlanDays = finalDays
            customerWeekList.push(tempWeekItem)
          }
          period.customerPlanWeeks = customerWeekList

          period.fullTempDays = fullTempDays
        })

        console.log(this.customer.customerPlan.trainingPlan)
      }
      this.oldStartDate = e
      this.$emit("exercisePeriodInitData")
    },
    showPlanListDialog() {
      this.$emit("showPlanListDialog")
    },
  },
  props: {
    planList: Array,
    planDialogFlag: Boolean,
    customer: Object
  }
}
</script>

<style scoped lang="scss">
#exercise-plan-content {
  padding: 0.2rem 1.5rem 1.8rem;

  .exercise-plan {
    width: 100%;
    background-color: #fff;
    padding: 1.2rem;
    border-radius: .3rem;
    border: .05rem solid #EBECEF;
    height: 13rem;
    display: flex;

    .plan-select-left {
      width: 48%;

      > img {
        width: 100%;
        height: 100%;
        border-radius: .3rem;
      }

      .empty {
        width: 100%;
        height: 100%;
        border-radius: .3rem;
        border: .05rem solid #EBECEF;
        display: flex;
        justify-content: center;
        align-items: center;
        color: #999;
      }
    }

    .plan-select-right {
      width: 52%;
      padding-left: 1.6rem;
      display: flex;
      flex-direction: column;
      justify-content: space-between;

      .select-plan, .select-time, .select-date {
        width: 100%;
        height: 2rem;
        background-color: #f6f7fa;
        border-radius: .3rem;
      }

      .select-plan {
        height: 4.5rem;
        display: flex;

        .left {
          flex: 1;
          height: 100%;
          display: flex;
          justify-content: center;
          align-items: center;
          flex-direction: column;
          padding-left: .9rem;

          h5 {
            font-size: 1.1rem;
            font-family: PingFangSC-Semibold, PingFang SC;
            font-weight: 600;
            color: #23262D;
            text-align: left;
            width: 11rem;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
          }

          p {
            text-align: left;
            width: 11rem;
            margin: 0;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
          }
        }

        .right {
          width: 2.8rem;
          height: 100%;
          display: flex;
          justify-content: center;
          align-items: center;

          img {
            width: 1.2rem;
            height: 1.2rem;
          }
        }
      }

      .select-time, .select-date {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding-left: .8rem;

        .left {
          display: flex;
          align-items: center;

          img {
            width: 1rem;
            height: 1rem;
            margin-right: .6rem;
          }

          span {
            font-size: .7rem;
            font-family: PingFangSC-Regular, PingFang SC;
            font-weight: 400;
            color: #59585E;
          }
        }

        .right {

        }
      }
    }
  }
}

</style>
