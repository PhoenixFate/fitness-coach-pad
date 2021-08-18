<template>
  <div id="class-info-list-dialog-content">
    <BackgroundBlack @click.native="hiddenDialog"></BackgroundBlack>
    <div class="list-content">
      <div class="class-info-item class-info-not"
           :class="currentIndex===-2?'class-info-not-selected':''"
           @click="clearPlan">
        暂不选择训练计划
      </div>
      <div class="class-info-item"
           v-for="(plan,index) in planList"
           :class="plan.trainingPlanId===customer.customerPlan.trainingPlanId?'class-info-item-selected':''"
           @click="selectItem(index)"
           :key="index">
        {{ plan.trainingPlanName }}
      </div>
    </div>
  </div>
</template>
<script>
import BackgroundBlack from "components/common/BackgroundBlack";
import {ChineseDayData} from "src/const/template/chineseDayData";
import {getStrDate, getWeekFirstDay2, stringToDate,addDateStr,getDayOfWeek} from "src/util/dateUtil";

export default {
  name: "PlanListDialog",
  components: {BackgroundBlack},
  data() {
    return {
      currentIndex: -1,
      chineseDays:ChineseDayData,
    }
  },
  created() {

  },
  props: {
    planList:Array,
    planDialogFlag:Boolean,
    customer:Object,
    vipCardList:Array
  },
  mounted() {
    this.currentIndex=-1
    console.log(this.customer)
    console.log(this.planList)
  },
  methods: {
    clearPlan(){
      this.currentIndex=-2
      this.customer.customerPlan.trainingPlan=null
      this.customer.customerPlan.trainingPlanId=null
      //清空训练计划之后，默认选择1年年卡
      this.vipCardList.forEach((vipCard)=>{
        if(vipCard.vipCardType==="YEAR_CARD"){
          this.customer.vipCard=vipCard
        }
        this.customer.totalMoney=vipCard.price
      })
      this.$parent.$forceUpdate()
      setTimeout(() => {
        this.currentIndex = -1;
        this.$emit("update:planDialogFlag", false)
      }, 500)
    },
    selectItem(index) {
      this.currentIndex = index;
      this.customer.customerPlan.trainingPlan=this.planList[index]
      this.customer.customerPlan.trainingPlanId=this.planList[index].trainingPlanId
      let customerPlanPeriods=[]
      let fullDayIndex=0;
      let startDate=this.customer.customerPlan.startDate;
      this.customer.customerPlan.trainingPlan.trainingPeriods.forEach((period,periodIndex)=>{
        let tempPeriodDays=[];
        let customerPlanPeriod={
          periodIndex:period.periodIndex,
          periodName:period.periodName,
        }
        let customerWeekList=[]

        //补齐开始日期前的空余的几天
        for(let i=0;i<getDayOfWeek(addDateStr(startDate,fullDayIndex));i++){
          tempPeriodDays.push({
            detailDate:addDateStr(addDateStr(startDate,fullDayIndex),-(getDayOfWeek(addDateStr(startDate,fullDayIndex))-i)),
            dayOfWeek:i
          })
        }

        for(let i=1;i<=period.circleRepeatTimes;i++){
          period.trainingPeriodDays.forEach((day,dayIndex)=>{
            if(day.isRest===0){
              tempPeriodDays.push({
                classId:day.classId,
                classInfo:day.classInfo,
                detailDate:addDateStr(startDate,fullDayIndex),
                dayOfWeek:getDayOfWeek(addDateStr(startDate,fullDayIndex)),
                isActive:1,
                isRest:0
              })
            }else {
              tempPeriodDays.push({
                detailDate:addDateStr(startDate,fullDayIndex),
                dayOfWeek:getDayOfWeek(addDateStr(startDate,fullDayIndex)),
                isActive:0,
                isRest:1
              })
            }
            fullDayIndex+=1
          })
        }

        //补齐最后一天到最后一天所在礼拜天之间的空隙
        let j=0;
        for(let i=tempPeriodDays[tempPeriodDays.length-1].dayOfWeek+1;i<=6;i++,j++){
          tempPeriodDays.push({
            detailDate:addDateStr(startDate,fullDayIndex+j),
            dayOfWeek:i
          })
        }

        //形成-> period->week-day的数据结构
        for(let i=0;i<parseInt(tempPeriodDays.length/7);i++){
          let finalDays=[]
          let tempWeekItem={}
          for(let j=0;j<7;j++){
            finalDays.push(tempPeriodDays[i*7+j])
          }
          tempWeekItem.customerPlanDays=finalDays
          customerWeekList.push(tempWeekItem)
        }

        //最后一周如果都是休息，则删除最后一周
        let hasClass=false
        if(customerWeekList.length>1){
          for(let i=0;i<customerWeekList[customerWeekList.length-1].customerPlanDays.length;i++){
            if(customerWeekList[customerWeekList.length-1].customerPlanDays[i].classId){
              hasClass=true
            }
          }
        }
        if(!hasClass && customerWeekList.length>1){
          //删除最后一周
          customerWeekList.pop()
        }

        customerPlanPeriod.customerPlanWeeks=customerWeekList
        customerPlanPeriods.push(customerPlanPeriod)
        period.tempPeriodDays=tempPeriodDays
      })
      this.customer.customerPlan.customerPlanPeriods=customerPlanPeriods
      console.log(this.customer.customerPlan.trainingPlan)

      //选择某个训练计划之后，默认赠送1年vip
      this.vipCardList.forEach((vipCard)=>{
        if(vipCard.vipCardType==="YEAR_CARD"){
          this.customer.vipCard=vipCard
        }
        this.customer.totalMoney=this.customer.customerPlan.trainingPlan.price
      })


      this.$emit("exercisePeriodInitData")
      setTimeout(() => {
        this.currentIndex = -1;
        this.$emit("update:planDialogFlag", false)
      }, 500)
    },
    hiddenDialog() {
      this.$emit("update:planDialogFlag", false)
    },
  }
}
</script>

<style scoped lang="scss">
#class-info-list-dialog-content {
  position: relative;
  z-index: 1;
  .list-content {
    width: 60%;
    height: 30rem;
    border-radius: 1rem;
    padding: 2rem;
    border: none;
    overflow-y: scroll;
    position: fixed;
    top: 50%;
    margin-top: -15rem;
    left: 20%;
    background-color: #fff;
    z-index: 2010;
    .class-info-item {
      width: 100%;
      height: 3.5rem;
      margin-bottom: .9rem;
      background-color: rgba(255, 255, 255, 0.78);
      line-height: 3.5rem;
      text-align: center;
      font-size: 1.1rem;
      box-shadow: 0 0 .3rem #b3b3b3;
      position: relative;
      border-radius: .4rem;
    }
    .class-info-not {
      background-color: #efefef;
      border: 1px solid #c3c2c2;
    }
    .class-info-item:last-child {
      margin-bottom: 0;
    }
    .class-info-not-selected {
      background-color: #d6d5d5;
      border:1px solid #9f9f9f;
      box-shadow: 0 0 .3rem #949494;
    }
    .class-info-item-selected {
      background-color: #c9e0f6;
      color: #2e72ae;
      border:1px solid #5895cb;
      box-shadow: 0 0 .3rem #79bcf8;
    }
  }
}
</style>
