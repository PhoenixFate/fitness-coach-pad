<template>
  <div class="exercise-period">>
    <div class="title">
      <span style="margin-right: .8rem">阶段{{ chineseIndex[periodIndex - 1] }}:</span>
      <span>{{ periodName }}</span>
    </div>
    <div class="period-content">
      <div class="period-left">
        <div class="week-content">
          <div v-for="(week,weekIndex) in weeks" :key="weekIndex" @click="selectWeek(weekIndex)" class="week">
            <img src="images/classAssignment/week.png" alt="" v-if="currentWeekIndex!==weekIndex">
            <img src="images/classAssignment/week-selected.png" alt="" v-if="currentWeekIndex===weekIndex">
            <span
              :class="currentWeekIndex===weekIndex?'week-selected':''"
            >第{{ chineseIndex[weekIndex] }}周</span>
          </div>
        </div>
        <div class="week-operation">
          <div class="week-minus" @click="minusWeek">
            -
          </div>
          <div class="week-add" @click="addWeek">
            +
          </div>
        </div>
      </div>
      <div class="period-right">
        <div class="days">
          <div class="day-item" v-for="(day,index) in weeks[currentWeekIndex].customerPlanDays"
               :key="index"
               @click="selectDay(index)">
            <DayItem
              :current-day-index="currentDayIndex"
              :index="index"
              v-bind="day">
            </DayItem>
          </div>
        </div>
        <div class="select-class" @click="selectClassInfo" v-if="!currentDay.classInfo || currentDay.isActive===0">
          <span>请选择课程</span>
          <img src="images/classAssignment/arrow-up.png" alt="">
        </div>
        <div class="class-empty" v-if="!currentDay.classInfo || currentDay.isActive===0">
          <img src="images/classAssignment/class-empty.png" alt="">
          <h6>今天是休息日</h6>
        </div>
        <div class="has-class" v-if="currentDay.classInfo && currentDay.isActive===1" @click="selectClassInfo">
          <img :src="currentDay.classInfo.classCoverImage" alt="">
          <div>
            <strong>{{ currentDay.classInfo.className }}</strong>
            <img src="images/classAssignment/arrow-up.png" alt="">
          </div>
        </div>
        <div class="class-exercises" v-if="currentDay.classInfo && currentDay.isActive===1">
          <ExerciseItem v-for="(exercise,exerciseIndex) in currentDay.classInfo.exercises"
                        :key="exerciseIndex"
                        v-bind="exercise">
          </ExerciseItem>
        </div>
      </div>
    </div>
    <transition enter-active-class="animate__fadeIn animate__faster"
                leave-active-class="animate__fadeOut animate__faster"
    >
      <ClassInfoListDialog
        :classInfoDialogFlag.sync="classInfoDialogFlag"
        :class-info-list="classInfoList"
        :day-item="currentDay"
        v-show="classInfoDialogFlag"
        class="animate__animated"
        style="z-index: 3000"
      >
      </ClassInfoListDialog>
    </transition>

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

  </div>
</template>

<script>
import "./q-select.scss"
import WeekItem from "components/customer/assignment/exercisePlan/left/WeekItem";
import DayItem from "components/customer/assignment/exercisePlan/right/DayItem";
import ExerciseItem from "components/template/right/ExerciseItem";
import ClassInfoListDialog from "components/customer/assignment/exercisePlan/ClassInfoListDialog";
import {getStrDate} from "src/util/dateUtil";
import {ChineseDayData} from "src/const/template/chineseDayData";
import AlertMessage from "components/common/AlertMessage";
import {addDateStr} from "src/util/dateUtil";
import {ChineseIndex} from "src/const/customer/assignment/chineseIndexData";

export default {
  name: "ExercisePeriod",
  components: {DayItem, ExerciseItem, ClassInfoListDialog, AlertMessage},
  data() {
    return {
      currentWeekIndex: 0,
      currentDayIndex: 0,
      currentClassInfo: {},
      currentDay: {},

      alertMessage: "",
      alertMessageFlag: false,
      classInfoDialogFlag: false,
      chineseDays: ChineseDayData,
      chineseIndex: ChineseIndex,
    }
  },
  created() {
    this.initData()
  },
  props: {
    periodIndex: {
      type: Number,
      require: true,
    },
    periodName: {
      type: String,
      require: true
    },
    weeks: {
      type: Array,
      require: true
    },
    classInfoList: Array,
    customer: Object,
  },
  methods: {
    initData() {
      if (this.weeks.length > 0 && this.weeks[0].customerPlanDays.length > 0) {
        this.currentDay = this.weeks[0].customerPlanDays[0]
      } else {
        this.currentDay = {}
      }
      this.currentWeekIndex = 0
      this.currentDayIndex = 0
    },
    minusWeek() {
      if (this.weeks.length === 1) {
        this.alertMessage = "当前阶段只剩1周内容，无法删除"
        this.alertMessageFlag = true
        return
      }
      if (this.weeks.length === 0) {
        this.alertMessage = "请先添加一周的课程"
        this.alertMessageFlag = true
        return
      }
      this.weeks.splice(this.currentWeekIndex, 1)
      this.currentWeekIndex = 0
      this.updateDate()
    },
    addWeek() {
      console.log(this.weeks)
      let finalDays = []
      this.chineseDays.forEach((commonDay) => {
        let customerDay = {
          dayOfWeek: commonDay.dayOfWeek,
        }
        finalDays.push(customerDay)
      })
      let week = {
        customerPlanId: this.weeks[0].customerPlanId,
        customerPeriodId: this.weeks[0].customerPeriodId,
        customerPlanDays: finalDays
      }
      this.weeks.push(week)
      this.updateDate()
    },
    updateDate() {
      let i = 0;
      let startDate = this.customer.customerPlan.customerPlanPeriods[0].customerPlanWeeks[0].customerPlanDays[0].detailDate
      console.log(startDate)
      this.customer.customerPlan.customerPlanPeriods.forEach((period) => {
        period.customerPlanWeeks.forEach((period) => {
          period.customerPlanDays.forEach((day) => {
            day.detailDate = addDateStr(startDate, i)
            i += 1
          })
        })
      })
      this.$forceUpdate()
    },
    selectClassInfo() {
      this.classInfoDialogFlag = true
    },
    selectWeek(index) {
      this.currentWeekIndex = index;
      this.currentDay = this.weeks[index].customerPlanDays[this.currentDayIndex]
      this.$forceUpdate();
    },
    selectDay(index) {
      console.log(index)
      console.log("select day")
      this.currentDayIndex = index;
      this.currentDay = this.weeks[this.currentWeekIndex].customerPlanDays[index]
      this.$forceUpdate();
    },
  }
}
</script>

<style scoped lang="scss">
.exercise-period {
  width: 100%;
  height: 36rem;
  position: relative;
  border-radius: .4rem;
  padding: 1.5rem;
  background-color: #fff;

  .title {
    width: 100%;
    font-size: 1.3rem;
    font-family: PingFangSC-Semibold, PingFang SC;
    font-weight: 600;
    color: #23262D;
    height: 2rem;
    margin-bottom: .9rem;
  }

  .period-content {
    height: 28.8rem;
    width: 100%;
    display: flex;
    padding-right: .6rem;

    .period-left {
      width: 6.5rem;
      height: 100%;

      .week-content {
        width: 100%;
        height: 24rem;
        overflow-y: scroll;
        padding-top: .6rem;

        .week {
          width: 5.5rem;
          height: 2.5rem;
          position: relative;
          margin: 0 .8rem 1rem 0;
          display: flex;
          justify-content: center;
          align-items: center;
          padding-right: .7rem;

          img {
            width: 100%;
            height: 100%;
            position: absolute;
            left: 0;
            top: 0;
          }

          span {
            font-size: .8rem;
            font-family: PingFangSC-Semibold, PingFang SC;
            font-weight: 600;
            color: #23262D;
            z-index: 10;
          }

          .week-selected {
            color: #fff;
          }
        }
      }

      .week-operation {
        width: 100%;
        height: 4.8rem;
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        align-items: flex-start;

        .week-add, .week-minus {
          width: 5.5rem;
          height: 2rem;
          border-radius: .3rem;
          border: .1rem solid #D1D1D7;
          display: flex;
          justify-content: center;
          align-items: center;
          color: #ABACB4;
          font-weight: 600;
          font-size: 1.4rem;
          padding-bottom: .1rem;
        }
      }
    }

    .period-right {
      flex: 1;
      height: 28.8rem;
      border: .05rem solid #EBECEF;
      border-radius: .3rem;
      padding: .5rem 1.5rem 1.5rem 1.5rem;

      .days {
        width: 100%;
        display: flex;
        justify-content: space-between;
        padding: 0 .2rem;
      }

      .select-class {
        width: 100%;
        height: 3.2rem;
        background: #F6F7FA;
        border-radius: .3rem;
        border: .05rem solid #EBECEF;
        margin-top: 1rem;
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 0 1.2rem;

        span {
          font-size: 1.2rem;
          font-family: PingFangSC-Semibold, PingFang SC;
          font-weight: 600;
          color: #23262D;
          margin-left: .2rem;
        }

        img {
          width: 1.2rem;
          height: 1.2rem;
        }
      }

      .class-empty {
        width: 100%;
        height: 19rem;
        display: flex;
        justify-content: center;
        align-items: center;
        flex-direction: column;
        padding-top: .9rem;

        img {
          width: 19rem;
          height: 13rem;
        }

        h6 {
          font-size: 1.1rem;
          font-family: PingFangSC-Regular, PingFang SC;
          font-weight: 400;
          color: #ABACB4;
          margin-top: 1.2rem;
        }
      }

      .has-class {
        width: 100%;
        height: 5.5rem;
        background: #F6F7FA;
        border-radius: .3rem;
        position: relative;
        overflow: hidden;
        margin-top: .9rem;

        > img {
          width: 100%;
          height: auto;
          position: absolute;
          top: 0;
          left: 0;
          border-radius: .3rem;
          transform: translate(0, -50%);
        }

        div {
          height: 2rem;
          width: 100%;
          position: absolute;
          left: 0;
          top: 50%;
          margin-top: -1rem;
          z-index: 1000;
          color: #fff;
          display: flex;
          justify-content: flex-start;
          align-items: center;
          padding-left: 1.5rem;

          strong {
            margin-right: .8rem;
            font-size: 1.2rem;
            font-family: PingFangSC-Semibold, PingFang SC;
            font-weight: 600;
            color: #FFFFFF;
          }

          img {
            height: 1.2rem;
            width: 1.2rem;
          }
        }
      }

      .class-exercises {
        width: 100%;
        height: 15.2rem;
        border: .05rem solid #EBECEF;
        margin-top: .6rem;
        border-radius: .3rem;
        overflow-y: scroll;
        padding: .2rem 1rem;
      }
    }
  }

  //.week-operation {
  //  position: absolute;
  //  left: 0;
  //  bottom: 0;
  //  width: 30%;
  //  .week-minus,.week-add {
  //    text-align: center;
  //    margin: .5rem auto;
  //    width: 90%;
  //    height: 3rem;
  //    background-color: rgba(200, 200, 200, 0.3);
  //    font-size: 1.8rem;
  //    border-radius: .7rem;
  //    color: #999;
  //    line-height: 2.7rem;
  //  }
  //  .week-minus{
  //    font-size: 2.3rem;
  //  }
  //}
  //.week {
  //  width: 30%;
  //  max-height: 18rem;
  //  margin-top: 3.5rem;
  //  overflow-y: scroll;
  //}
  //.day {
  //  width: 70%;
  //  min-height: 15rem;
  //  padding: 0 .5rem 0 1rem;
  //  .day-weeks {
  //    width: 100%;
  //    height: 4.5rem;
  //    background-color: #add7ff;
  //    display: flex;
  //    margin-top: -.6rem;
  //    .day-item{
  //      width: 17%;
  //    }
  //    .one-day:nth-child(7){
  //      border-right: none;
  //    }
  //  }
  //  .weeks-content {
  //    height: 25rem;
  //    overflow-y: scroll;
  //    width: 100%;
  //    margin: .7rem auto;
  //    border-radius: 4px;
  //    background: hsla(0, 0%, 100%, .25) border-box;
  //    box-shadow: 0 0 0 1px hsla(0, 0%, 100%, .5) inset, 0 .2rem .5rem rgba(0, 0, 0, 0.3);
  //    text-shadow: 0 1px 1px hsla(0, 0%, 100%, .3);
  //    position: relative;
  //    padding: 1rem;
  //    .break {
  //      width: 7.5rem;
  //      display: flex;
  //      justify-content: flex-end;
  //      align-items: center;
  //      position: absolute;
  //      right: -.15rem;
  //      top: -.25rem;
  //      color: #3c3c3c;
  //    }
  //    .select-item {
  //      font-size: 1rem;
  //      margin-bottom: 1rem;
  //      display: flex;
  //      align-items: center;
  //      >span {
  //        margin-right: 1rem;
  //        margin-left: .6rem;
  //      }
  //      div {
  //        height: 2rem;
  //        line-height: 2rem;
  //        min-width: 8rem;
  //        background-color: #c4ebef;
  //        border-radius: .2rem;
  //        font-size: .9rem;
  //        display: flex;
  //        justify-content: center;
  //        align-items: center;
  //        padding: 0 .7rem;
  //        span {
  //          margin-right: .5rem;
  //        }
  //        img {
  //          width: 1rem;
  //          height: 1rem;
  //        }
  //      }
  //      .class-info-empty {
  //        background-color: #dbd9d9;
  //      }
  //    }
  //    .empty {
  //      height: 20rem;
  //      display: flex;
  //      justify-content: center;
  //      align-items: center;
  //      flex-direction: column;
  //      img {
  //        width: 100%;
  //        height: 12.5rem;
  //
  //      }
  //      h6{
  //        text-align: center;
  //        color: #6d6d6d;
  //        font-weight: normal;
  //        margin-top: .7rem;
  //      }
  //    }
  //  }
  //  .weeks-content::before {
  //    content: '';
  //    position: absolute;
  //    top: 0;
  //    right: 0;
  //    bottom: 0;
  //    left: 0;
  //    z-index: -1;
  //    filter: blur(2.5rem);
  //  }
  //}
}
</style>
