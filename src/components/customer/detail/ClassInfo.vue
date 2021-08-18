<template>
  <div class="class-info" v-if="customer && customer.customerPlan">
    <div class="exercise-plan" v-if="customer.customerPlan.trainingPlan">
      <div class="plan-select">
        <span>{{ customer.customerPlan.trainingPlan.trainingPlanName }}</span>
      </div>
      <div class="plan-info" v-if="customer.customerPlan.trainingPlan">
        <div class="info-left">
          <img :src="customer.customerPlan.trainingPlan.trainingPlanCoverImage" alt="">
        </div>
        <div class="info-right">
          <h5>简介</h5>
          <div>{{customer.customerPlan.trainingPlan.trainingPlanDescription}}</div>
        </div>
      </div>
      <div class="more-select">
        <div class="select-item">
          <div class="label">正常训练时间</div>
          <div class="select-time">
            <date-picker
              v-model="customer.customerPlan.startTime"
              :minute-step="5"
              :second-step="60"
              format="HH:mm:ss"
              value-type="format"
              type="time"
              placeholder="HH:mm"
            ></date-picker>
            <strong>~</strong>
            <date-picker
              v-model="customer.customerPlan.endTime"
              :minute-step="5"
              :second-step="60"
              format="HH:mm:ss"
              value-type="format"
              type="time"
              placeholder="HH:mm"
            ></date-picker>
          </div>
        </div>
        <div class="select-item">
          <div class="label">计划开始日期</div>
          <span>{{customer.customerPlan.startDate}}</span>
        </div>
      </div>
    </div>

    <div v-if="customer.customerPlan.trainingPlan">
      <div v-for="(period,periodIndex) in customer.customerPlan.customerPlanPeriods" :key="periodIndex">
        <div class="week-line clearfix" v-for="(week,weekIndex) in period.customerPlanWeeks" :key="weekIndex" >
          <h5>第{{chineseIndex[week.weekIndex-1]}}周</h5>
          <template v-for="(day,dayIndex) in week.customerPlanDays">
            <div class="day-item"  :key="dayIndex" v-if="day.classInfo">
              <h6>{{day.classInfo.className}}</h6>
              <img :src="day.classInfo.classCoverImage" alt="">
              <p>{{day.detailDate}}</p>
              <div class="status status-finished" v-if="day.status===1">
                已完成
              </div>
              <div class="status status-future" v-if="day.status===0">
                未完成
              </div>
              <div class="change" v-if="day.status===0" @click="showOneDayDialog(periodIndex,weekIndex,dayIndex)">换</div>
              <div class="delete-day" @click="deleteOneDay(periodIndex,weekIndex,dayIndex)" v-if="day.status===0">
                <img src="images/common/delete.png" alt="">
              </div>
            </div>
          </template>

          <div class="day-item-add" @click="addOneDay(periodIndex,weekIndex)">
            <div class="add">+</div>
          </div>
          <div class="period-name">
            {{ period.periodName }}
          </div>
        </div>
      </div>
    </div>

    <div class="class-empty" v-if="!customer.customerPlan.trainingPlan">
      <img src="images/customer/exercisePlan/plan-empty.png" alt="">
      <p>暂无训练计划</p>
    </div>

    <div class="add-template" v-if="customer.customerPlan.trainingPlan">
      <div class="line">
        <div class="circle"></div>
      </div>
      <div class="line">
        <div class="circle"></div>
      </div>
      <div class="add-content">
        <img src="images/class/classInfo/exercise-add-background.png" alt="">
        <div class="cover" @click="addWeek">
          <img src="images/template/add.png" alt="">
        </div>
      </div>
      <p>点击添加新的训练周</p>
    </div>

    <transition enter-active-class="animate__slideInDown animate__faster"
                leave-active-class="animate__zoomOut animate__fast">
      <OneDayDialog
        :oneDayDialogFlag.sync="oneDayDialogFlag"
        :customer="customer"
        :day-content="oneDayContent"
        :class-info-list="classInfoList"
        @sureChange="sureChange"
        class="animate__animated"
        style="z-index: 3000"
        v-if="oneDayDialogFlag"
      >
      </OneDayDialog>
    </transition>

  </div>
</template>

<script>
import {ChineseIndex} from "src/const/customer/assignment/chineseIndexData";
import DatePicker from 'vue2-datepicker';
import 'vue2-datepicker/index.css';
import OneDayDialog from "components/customer/detail/OneDayDialog";
export default {
  name: "ClassInfo",
  components:{DatePicker,OneDayDialog},
  data() {
    return {
      chineseIndex:ChineseIndex,
      oneDayDialogFlag:false,
      oneDayContent:{},
      currentPeriodIndex:-1,
      currentWeekIndex:-1,
    }
  },
  created() {

  },
  props:{
    customer:Object,
    classInfoList:Array,
  },
  methods:{
    deleteOneDay(periodIndex,weekIndex,dayIndex){
      this.currentPeriodIndex=periodIndex
      this.currentWeekIndex=weekIndex
      this.customer.customerPlan.customerPlanPeriods[periodIndex].customerPlanWeeks[weekIndex].customerPlanDays.splice(dayIndex,1)
    },
    addOneDay(periodIndex,weekIndex){
      this.currentPeriodIndex=periodIndex
      this.currentWeekIndex=weekIndex
      this.oneDayContent={
        customerId:this.customer.customerId,
        customerPlanId:this.customer.customerPlan.customerPlanId,
        customerPlanPeriodId:this.customer.customerPlan.customerPlanPeriods[periodIndex].customerPlanPeriodId,
        customerPlanWeekId:this.customer.customerPlan.customerPlanPeriods[periodIndex].customerPlanWeeks[weekIndex].customerPlanWeekId,
        isRest:0,
        isActive:1,
        status:0,
      }
      this.oneDayDialogFlag=true
    },
    sureChange(){
      if(!this.oneDayContent.customerPlanDayId){
        this.customer.customerPlan.customerPlanPeriods[this.currentPeriodIndex].customerPlanWeeks[this.currentWeekIndex].customerPlanDays.push(this.oneDayContent)
      }
    },
    showOneDayDialog(periodIndex,weekIndex,dayIndex){
      this.oneDayContent=this.customer.customerPlan.customerPlanPeriods[periodIndex].customerPlanWeeks[weekIndex].customerPlanDays[dayIndex];
      this.oneDayDialogFlag=true
    },
    addWeek(){
      console.log(this.customer)
      let weekItem={
        customerPeriodId:this.customer.customerPlan.customerPlanPeriods[0].customerPlanPeriodId,
        customerPlanDays:[],
        customerPlanId:this.customer.customerPlan.customerPlanId
      }
      this.customer.customerPlan.customerPlanPeriods[this.customer.customerPlan.customerPlanPeriods.length-1].customerPlanWeeks.push(weekItem)

      //更新weekIndex
      if(this.customer.customerPlan.trainingPlan && this.customer.customerPlan.customerPlanPeriods){
        let weekIndex=1;
        this.customer.customerPlan.customerPlanPeriods.forEach((period,periodIndex)=>{
          period.periodIndex=periodIndex+1
          period.customerPlanWeeks.forEach((week)=>{
            week.weekIndex=weekIndex
            weekIndex+=1
          })
        })
      }
    },
  }
}
</script>

<style scoped lang="scss">
.class-info {
  display: flex;
  width: 100%;
  flex-direction: column;
  .exercise-plan {
    width: 100%;
    background-color: #fff;
    height: auto;
    box-shadow: .15rem .15rem .3rem #999;
    border-radius: .3rem;
    padding: 1rem 1rem 1rem 2rem;
    margin-bottom: .8rem;
    .plan-select {
      display: flex;
      height: 3rem;
      align-items: center;
      margin-bottom: .5rem;
      >span {
        font-size: 1rem;
        width: 15rem;
        font-weight: bold;
      }
      label {
        width: 12rem;
      }
      .current-plan-empty,.current-plan {
        height: 2rem;
        line-height: 2rem;
        min-width: 8rem;
        border-radius: .2rem;
        font-size: .9rem;
        display: flex;
        justify-content: center;
        align-items: center;
        padding: 0 1rem;
        span {
          margin-right: .5rem;
        }
        img {
          width: 1rem;
          height: 1rem;
        }
      }
      .current-plan-empty {
        background-color: #eaeaea;
      }
      .current-plan {
        background-color: #d6e9f6;
      }
    }
    .plan-info {
      display: flex;
      justify-content: space-between;
      margin-bottom: 1rem;
      height: 12rem;
      .info-left {
        width: 48%;
        display: flex;
        justify-content: center;
        align-items: center;
        img {
          width: 100%;
          height: 100%;
          border-radius: 1rem;
          border:.1rem solid #f1b90e;
        }
      }
      .info-right {
        width: 48%;
        h5{
          font-weight: bold;
          margin:0 0 .7rem 0;
          height: 2rem;
        }
        div {
          height: 8.7rem;
          overflow-y: scroll;
          font-size: .7rem;
          text-indent: 2em;
        }
      }
    }
    .more-select {
      font-size: .9rem;
      height: auto;
      .select-item {
        height: 3.5rem;
        display: flex;
        align-items: center;
        .mx-datepicker {
          width: 6rem;
        }

        .label {
          width: 9rem;
        }
        .aim-items {
          display: flex;
          div {
            width: 5rem;
            height: 2rem;
            border: 1px solid #99d3ff;
            line-height: 2rem;
            text-align: center;
            margin-left: -1px;
          }
          .selected {
            background-color: #add8ff;
            color:#4866f8
          }
        }
        .select-time {
          .label {
            width: 9rem;
          }
          strong {
            margin: 0 1rem;
            font-weight: normal;
          }
        }
      }
    }
  }

  .class-line {
    width: 100%;
    height: 15rem;
    display: flex;
    justify-content: space-between;
    margin-bottom: 1rem;
  }

  .week-line {
    width: 100%;
    min-height: 15rem;
    margin-bottom: .8rem;
    box-shadow: .15rem .15rem .3rem #999;
    background-color: #fff;
    border-radius: .3rem;
    padding: .5rem 2.6% .5rem 2.6%;
    position: relative;
    h5 {
      font-size: 1.1rem;
      font-weight: bold;
      text-align: center;
      margin-bottom: .7rem;
    }
    .day-item,.day-item-add {
      width: 48.6%;
      height: 13rem;
      float: left;
      margin-bottom: .7rem;
      box-shadow: 0 0 .2rem #999;
      display: flex;
      justify-content: center;
      align-items: center;
      flex-direction: column;
      border-radius: .4rem;
      position: relative;
      overflow: hidden;
      h6 {
        margin-bottom: .2rem;
        font-size: 1.1rem;
      }
      >img {
        width: 76%;
        height: 70%;
        border-radius: .5rem;
        border: 1px solid #e9ce1d;
      }
      p {
        margin: .2rem 0;
        font-size: .7rem;
      }
      .status {
        position: absolute;
        width: 5rem;
        height: 5rem;
        left: -2.5rem;
        top: -2.5rem;
        color: #fff;
        font-size: .7rem;
        transform: rotate(-45deg);
        display: flex;
        justify-content: center;
        align-items: flex-end;
        padding-bottom: .2rem;
        font-weight: bold;
      }
      .status-finished {
        background-color: #31c353;
      }
      .status-now {
        background-color: #F2C037;
      }
      .status-future {
        background-color: #1976d2;
      }
      .change {
        width: 1.5rem;
        height: 1.5rem;
        position: absolute;
        bottom: .4rem;
        right:.4rem;
        border-radius: 50%;
        font-size: .7rem;
        border:1px solid #1976d2;
        text-align: center;
        line-height: 1.5rem;
        color:#1976d2;
      }
      .delete-day {
        width: 2rem;
        height: 2rem;
        position: absolute;
        top: 0;
        right:0;
        display: flex;
        align-items: center;
        justify-content: center;
        img {
          width: 60%;
          height: 60%;
        }
      }
    }
    .day-item:nth-child(2n){
      margin-right: 2.6%;
    }
    .day-item-add {
      font-size: 2rem;
      display: flex;
      justify-content: center;
      align-items: center;
      color:#999;
    }
    .period-name {
      width: auto;
      position: absolute;
      right:.7rem;
      top:.5rem;
      color:#999;
      font-size: 1rem;
    }
  }

  .add-template {
    width: 13rem;
    height: 9rem;
    background-color: #e3f7fa;
    margin: .7rem auto 1.5rem;
    position: relative;
    border-radius: .6rem;
    box-shadow: .1rem .1rem .3rem #57585a;
    display: flex;
    justify-content: flex-end;
    align-items: center;
    flex-direction: column;
    .line {
      position: absolute;
      width: .3rem;
      height: 3rem;
      background-color: #219bef;
      top: -1.4rem;

      .circle {
        width: 1rem;
        height: 1rem;
        position: absolute;
        bottom: -.5rem;
        left: -.4rem;
        background-color: #fff;
        border-radius: 50%;
        box-shadow: .1rem .1rem .15rem #57585a inset;
      }
    }

    .line:nth-child(1) {
      left: 14%;
    }

    .line:nth-child(2) {
      right: 14%;
    }

    .add-content {
      width: 6.5rem;
      height: 6.5rem;
      border-radius: 50%;
      border: .1rem solid #94eaf8;
      display: flex;
      justify-content: center;
      align-items: center;
      position: relative;
      overflow: hidden;

      > img {
        width: 70%;
        height: 70%;
      }

      .cover {
        width: 100%;
        height: 100%;
        position: absolute;
        left: 0;
        top: 0;
        background-color: rgba(168, 246, 242, 0.38);
        display: flex;
        justify-content: center;
        align-items: center;
        flex-direction: column;

        img {
          width: 2rem;
          height: 2rem;
          background-color: rgba(255, 255, 255, 0.72);
        }
      }
    }

    p {
      margin: .3rem 0 .4rem;
      font-size: .8rem;
      color: #5b5757;
    }
  }


  .class-empty {
    height: 18rem;
    width: 100%;
    background-color: #fff;
    box-shadow: .15rem .15rem .3rem #999;
    border-radius: .3rem;
    padding: 1rem 1rem 1rem 2rem;
    margin-bottom: .8rem;
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
    img {
      width: 50%;
      height: 80%;
      margin-top: 1rem;
    }
    p {
      font-size: 1rem;
      color:#999;
    }
  }

}

</style>
