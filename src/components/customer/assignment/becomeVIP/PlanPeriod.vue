<template>
  <div class="plan-period">
    <div class="star" :class="'star-'+index"></div>
    <div class="period-title">
      <div class="title">
        {{ periodName }}
      </div>
      <div class="count">
        {{ dayLength }}天 {{ dayLength }}节课
      </div>
    </div>
    <div class="period-content">
      <div class="day-title">
        <span>日期</span>
        <span>星期</span>
        <span>课程名</span>
        <span>训练项</span>
      </div>
      <div v-for="(week,weekIndex) in customerPlanWeeks" :key="weekIndex">
        <div v-for="(day,dayIndex) in week.customerPlanDays" :key="dayIndex">
          <PlanPeriodItem
            v-if="day.classInfo && day.isActive===1"
            v-bind="day">
          </PlanPeriodItem>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import {ChineseWeek} from "src/const/customer/assignment/chineseIndexData";
import PlanPeriodItem from "components/customer/assignment/becomeVIP/PlanPeriodItem";
export default {
  name: "PlanPeriod",
  components: {PlanPeriodItem},
  data() {
    return {
      chineseWeek: ChineseWeek,
      dayLength:0,

    }
  },
  created() {
    this.updateDayLength()
  },
  props: {
    index: Number,
    periodName: String,
    customerPlanWeeks: Array,
  },
  methods: {
    updateDayLength(){
      let i=0;
      this.customerPlanWeeks.forEach((week)=>{
        week.customerPlanDays.forEach((day)=>{
          if(day.classInfo && day.isActive===1){
            i+=1;
          }
        })
      })
      this.dayLength=i;
    }
  }
}
</script>

<style scoped lang="scss">
.plan-period {
  width: 99%;
  height: auto;
  margin: .4rem auto;
  border-radius: .5rem;
  box-shadow: .1rem .1rem .3rem #b0afaf;
  background-color: #fff;
  position: relative;
  overflow: hidden;

  .star {
    position: absolute;
    left: 0;
    top: 0;
    width: .5rem;
    height: 2.5rem;
  }

  .star-0 {
    background-color: #49c32c;
  }

  .star-1 {
    background-color: #29b09b;
  }

  .star-2 {
    background-color: #c2de25;
  }

  .star-3 {
    background-color: #c63753;
  }

  .star-4 {
    background-color: #b461c3;
  }

  .period-title {
    height: 2.5rem;
    width: 100%;
    display: flex;
    align-items: center;
    font-weight: 500;
    .title {
      flex: 1;
      font-size: 1.1rem;
      line-height: 2.5rem;
      padding-left: 1.4rem;
    }

    .count {
      margin-right: 1rem;
      font-size: .7rem;
      color: #999;
    }
  }

  .period-content {
    padding-bottom: 1rem;
    .day-title{
      width: 94%;
      margin: .5rem auto;
      display: flex;
      span {
        display: block;
        text-align: center;
        strong {
          font-weight: normal;
        }
      }
      span:nth-child(1) {
        width: 20%;
      }
      span:nth-child(2) {
        width: 12%;
      }
      span:nth-child(3) {
        width: 26%;
      }
      span:nth-child(4) {
        width: 40%;
      }
    }

    .day-title {
      font-size: 1rem;
      font-weight: bold;
    }

  }
}
</style>
