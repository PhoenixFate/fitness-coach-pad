<template>
  <div id="course-content">
    <el-calendar v-model="currentDate"
                 @input="selectOneDay"
    >
      <template
        slot="dateCell"
        slot-scope="{date, data}">
        <span> {{ data.day.split('-')[2] }}</span>
        <div class="has-class" v-if="hasClass(data.day)">课</div>
        <div class="customer-number" v-if="hasClass(data.day)">{{customerNumber(data.day)}}个客户</div>
      </template>
    </el-calendar>

    <div class="today-work">
      <div class="title">
        当日安排
      </div>
      <div class="work-body">
        <CustomerArrangement
          v-for="customerArrangement in customerArrangementList"
          :customerArrangement="customerArrangement"
          :key="customerArrangement.name">
        </CustomerArrangement>
      </div>

      <div v-if="customerArrangementList.length===0" class="assignment-empty">
        <img src="images/home/assignment-empty.png" alt="">
        <p>今天暂无安排，休息一下吧</p>
      </div>

    </div>
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
import CustomerArrangement from "components/home/CustomerArrangement"
import {dislodgeZero, getAge, getStrDate} from "src/util/dateUtil";
import {apiCustomerPlanDayList,apiPlanDayOneMonthCount} from "src/api/customerPlanDay";
import "./my-calendar.scss"
import LoadingData from "components/common/LoadingData";
export default {
  components: {
    CustomerArrangement,
    LoadingData
  },
  data() {
    return {
      currentDate: new Date(),
      customerArrangementList: [],

      selectDate:"",
      year:"",
      month:"",

      monthCountList:[],
      loadingDataFlag: true,

    }
  },
  created() {
    let date=new Date()
    this.selectDate=getStrDate(date)
    this.year=date.getFullYear()
    this.month=date.getMonth()+1
    this.loadAssignment()
    this.loadMonthCount()
  },
  methods: {
    loadAssignment(){
      apiCustomerPlanDayList({date:this.selectDate}).then((res)=>{
        setTimeout(() => {
          this.loadingDataFlag = false
        }, 400)
        console.log(res)
        res.data.data.forEach((temp)=>{
          if(temp.customer && temp.customer.birthday){
            temp.customer.age=getAge(temp.customer.birthday)
          }
        })
        this.customerArrangementList=res.data.data
      })
    },
    loadMonthCount(){
      apiPlanDayOneMonthCount(this.year,this.month).then((res)=>{
        this.monthCountList=res.data.data
        this.$nextTick(()=>{
          this.$forceUpdate()
        })
      })
    },
    hasClass(day){
      let flag=false;
      for(let i=0;i<this.monthCountList.length;i++){
        if(day===this.monthCountList[i].detailDate){
          flag=true;
          break
        }
      }
      return flag
    },
    customerNumber(day){
      let number=0
      for(let i=0;i<this.monthCountList.length;i++){
        if(day===this.monthCountList[i].detailDate){
          number=this.monthCountList[i].count
          break
        }
      }
      return number
    },
    selectOneDay(e){
      this.selectDate=getStrDate(e)
      this.year=this.selectDate.split("-")[0]
      this.month=this.selectDate.split("-")[1]
      this.loadAssignment()
      this.loadMonthCount()
    }
  }
}

</script>
<style scoped lang="scss">
#course-content{
  .today-work {
    width: 100%;
    margin: .5rem auto 0;
    padding: .5rem;
    background-color: #f5f5f5;
    .title {
      width: 100%;
      height: 3rem;
      color: #1976d2;
      background-color: #fff;
      line-height: 3rem;
      font-size: 1.3rem;
      padding-left: 1rem;
      border-bottom: 1px dashed #1976d2;
      border-top-left-radius: 1rem;
      border-top-right-radius: 1rem;
    }

    .work-body {
      margin-top: .5rem;
    }
    .assignment-empty {
      width: 100%;
      height: 34vh;
      background-color: #fff;
      box-shadow: .1rem .1rem .2rem #abaaaa;
      display: flex;
      justify-content: center;
      align-items: center;
      flex-direction: column;
      img {
        width: 46%;
        height: 70%;
      }
      p {
        color:#999;
      }
    }
  }
}

</style>
