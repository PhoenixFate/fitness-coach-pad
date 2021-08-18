<template>
  <div id="assignment-become-vip-content">
    <div class="plan-title">
      <img src="images/customer/becomeVIP/list.png" alt="">
      <h4>训练计划日程</h4>
    </div>
    <div class="plan-empty" v-if="!customer.customerPlan.trainingPlan">
      <img src="images/customer/exercisePlan/plan-empty.png" alt="">
      <p>请先选择训练计划</p>
    </div>
    <div v-if="customer.customerPlan.trainingPlan && customer.customerPlan.customerPlanPeriods">
      <PlanPeriod
          v-for="(period,index) in customer.customerPlan.customerPlanPeriods"
          :index="index"
          ref="planPeriod"
          v-bind="period"
          :key="index">
      </PlanPeriod>
    </div>

    <div class="plan-title">
      <img src="images/customer/becomeVIP/pay.png" alt="">
      <h4>支付信息</h4>
    </div>
    <div class="pay-info">
      <div class="star star-4"></div>
      <div class="title-special">
        <div class="title-common">订单详情</div>
        <div class="title-select" v-if="customer.customerPlan.trainingPlan">
          <div class="title-select-item">
            <div class="selected-circle" v-if="payTrainingPlan">
              <img src="images/customer/becomeVIP/selected.png" alt="">
            </div>
            <div class="select-circle" v-if="!payTrainingPlan" @click="selectPayTrainingPlan()"></div>
            <span>按计划付费</span>
          </div>
          <div class="title-select-item">
            <div class="selected-circle" v-if="!payTrainingPlan">
              <img src="images/customer/becomeVIP/selected.png" alt="">
            </div>
            <div class="select-circle" v-if="payTrainingPlan" @click="selectPayTotalClass()"></div>
            <span>按课程付费</span>
          </div>
        </div>
        <div class="title-refresh" v-if="customer.customerPlan.trainingPlan" @click="refreshPrice">
          <img src="images/customer/becomeVIP/refresh2.png" alt="">
        </div>
      </div>
      <div class="pay-content">
        <!--  单张会员卡 -->
        <div class="pay-content-item" v-if="customer.vipCard && !customer.customerPlan.trainingPlan"
             @click="showVipCardDialog">
          <div class="item-left">
            <div class="item-left-content">
              <div class="vip-card" :class="customer.vipCard.className">
                <h6>VIP</h6>
                <h4>{{ customer.vipCard.vipCardName }}</h4>
              </div>
            </div>
          </div>
          <div class="item-middle">
            <h6>健身会员卡-{{ customer.vipCard.vipCardName }}</h6>
            <p>¥ {{ customer.vipCard.price }}</p>
            <div class="card-change">换</div>
          </div>
          <div class="item-right">
            <h6>¥ {{ customer.vipCard.price }}</h6>
            <p><span>x</span>1</p>
          </div>
          <div class="item-divider"></div>
        </div>

        <!--训练计划-按照计划付费-->
        <div class="pay-content-item" v-if="customer.customerPlan.trainingPlan && payTrainingPlan">
          <div class="item-left">
            <div class="item-left-content">
              <div class="training-plan">
                <img :src="customer.customerPlan.trainingPlan.trainingPlanCoverImage" alt="">
              </div>
            </div>
          </div>
          <div class="item-middle">
            <h6>{{ customer.customerPlan.trainingPlan.trainingPlanName }}</h6>
            <p>{{ weekLength }}周-{{ dayLength }}天</p>
            <p>¥ {{ customer.customerPlan.trainingPlan.price }}</p>
          </div>
          <div class="item-right">
            <h6>¥ {{ customer.customerPlan.trainingPlan.price }}</h6>
            <p><span>x</span>1</p>
          </div>
          <div class="item-divider"></div>
        </div>
        <!--训练计划-按照课程总费用付费-->
        <div class="pay-content-item pay-content-item-total-class"
             v-if="customer.customerPlan.trainingPlan && !payTrainingPlan">
          <div class="item-left">
            <div class="item-left-content">
              <div class="training-plan">
                <img :src="customer.customerPlan.trainingPlan.trainingPlanCoverImage" alt="">
              </div>
            </div>
          </div>
          <div class="item-middle">
            <h6>{{ coach.coachName }}-私教课程</h6>
            <p>{{ customer.customerPlan.trainingPlan.trainingPlanName }}-{{ dayLength }}节课</p>
            <p>¥ {{ coach.perClassPrice }}</p>
          </div>
          <div class="item-right">
            <h6>¥ {{ coach.perClassPrice * dayLength }}</h6>
            <div class="count-operation">
              <div class="minus" @click="minusClass">
                <img src="images/customer/becomeVIP/minus.png" alt="">
              </div>
              <p><span>x</span>{{ dayLength }}</p>
              <div class="add" @click="addClass">
                <img src="images/customer/becomeVIP/add.png" alt="">
              </div>
            </div>
          </div>
          <div class="item-divider"></div>
        </div>
        <!--赠送的年卡-->
        <div class="pay-content-item free-card" v-if="customer.vipCard && customer.customerPlan.trainingPlan">
          <div class="item-left">
            <div class="item-left-content">
              <div class="vip-card" :class="customer.vipCard.className">
                <div class="free-status">赠送</div>
                <h6>VIP</h6>
                <h4>{{ customer.vipCard.vipCardName }}</h4>
              </div>
            </div>
          </div>
          <div class="item-middle">
            <h6>健身会员卡-{{ customer.vipCard.vipCardName }}</h6>
            <p>¥ {{ customer.vipCard.price }}</p>
          </div>
          <div class="item-right">
            <h6>¥ 0</h6>
            <p><span>x</span>1</p>
          </div>
          <div class="item-divider"></div>
        </div>


        <!--  单张会员卡 -->
        <div class="total-money">
          <div class="total-money-content">
            <span>合计: </span>
            <span>¥ {{ customer.totalMoney }}</span>
          </div>
        </div>

      </div>
    </div>

    <div class="pay-info">
      <div class="star star-5"></div>
      <div class="title">
        支付方式
      </div>
      <div class="pay-way">
        <div class="pay-way-select">
          <div class="pay-way-select-item"
               :class="index===currentPayWay?'selected':''"
               v-for="(way,index) in payWay"
               @click="selectPayWay(index)"
               :key="way.id">
            <div class="name">
              <div><img :src="way.imageURL" alt=""></div>
              <span>{{ way.name }}</span>
            </div>
            <div class="circle" v-if="index!==currentPayWay">
            </div>
            <div class="circle-selected" v-if="index===currentPayWay">
              <img src="images/customer/becomeVIP/selected.png" alt="">
            </div>
          </div>
        </div>
        <div class="pay-way-qr-code">
          <div class="qr-code-background" :style="payWay[currentPayWay].borderColor">
            <img :src="payWay[currentPayWay].backgroundImageURL" alt="">
            <div class="qr-code-image">
              <img src="images/customer/becomeVIP/QRCode.png" alt="" v-if="!qrCodeImageUrl">
              <img :src="qrCodeImageUrl" alt="" v-if="qrCodeImageUrl">
              <div class="to-refresh" v-if="refreshFlag" @click="createQrCode(payWay)">
                <img src="images/customer/becomeVIP/refresh.png" alt="">
                <p>点击刷新</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import {PayWayData} from "src/const/customer/assignment/payWayData";
import PlanPeriod from "components/customer/assignment/becomeVIP/PlanPeriod";
import "./vip-card.scss"
import {apiGetCoachInfo} from "src/api/coach";
import {addDateStr, dateDiff, getDayOfWeek} from "src/util/dateUtil";
import {apiAlipayPreOrder} from "src/api/ailpay";
import {apiWechatPayPreOrder} from "src/api/wechatPay";

export default {
  name: "AssignmentBecomeVIP",
  components: {PlanPeriod},
  data() {
    return {
      payWay: PayWayData,
      currentPayWay: 0,
      weekLength: 0,
      dayLength: 0,
      refreshFlag: true,
      //是否按照训练计划整个套餐付费 还是按照课程数量付费
      payTrainingPlan: true,
      coach: {},
      qrCodeImageUrl: "",
    }
  },
  created() {
    console.log("becomeVIP created")
    console.log(this.customer)
    let coach = localStorage.getItem("coach");
    if (coach) {
      this.coach = JSON.parse(coach)
    }
    this.computeWeekAndDayLength()

    //有训练计划，赠送1年vip会员
    if (this.customer.customerPlan.trainingPlan) {
      //有训练计划、默认送1年年卡
      this.vipCardList.forEach((vipCard) => {
        if (vipCard.vipCardType === "YEAR_CARD") {
          this.customer.vipCard = vipCard
        }
      })
      this.customer.totalMoney = this.customer.customerPlan.trainingPlan.price
    }
    //如果没有训练计划，默认选择1年健身卡
    if (!this.customer.customerPlan.trainingPlan && !this.customer.vipCard) {
      this.vipCardList.forEach((vipCard) => {
        if (vipCard.vipCardType === "YEAR_CARD") {
          this.customer.vipCard = vipCard
          this.customer.totalMoney = vipCard.price
        }
      })

    }
  },
  mounted() {
  },
  methods: {
    selectPayWay(index) {
      this.currentPayWay = index;
      this.resetQrCode()
    },
    loadCoachInfo() {
      apiGetCoachInfo(this.coach.coachId).then((res) => {
        if (res.data.data) {
          if (this.coach.perClassPrice !== res.data.data.perClassPrice) {
            //价格不一样，刷新内容
            localStorage.setItem("coach", JSON.stringify(res.data.data))
            this.coach = res.data.data
            this.updateTotalMoney()
            this.resetQrCode()
          }
        }
        setTimeout(() => {
          this.$emit("update:updateDataFlag", false)
        }, 1200)
      })
    },
    computeWeekAndDayLength() {
      if (this.customer.customerPlan.trainingPlan && this.customer.customerPlan.customerPlanPeriods) {
        //有训练计划
        let weekLength = 0;
        let dayLength = 0;
        this.customer.customerPlan.customerPlanPeriods.forEach((period) => {
          period.customerPlanWeeks.forEach((week) => {
            let dayFlag = false;
            week.customerPlanDays.forEach((day) => {
              if (day.classInfo && day.isActive === 1) {
                dayLength += 1;
                dayFlag = true;
              }
            })
            if (dayFlag) {
              weekLength += 1;
            }
          })
        })
        this.weekLength = weekLength;
        this.dayLength = dayLength;
      }
    },
    minusClass() {
      if (this.dayLength <= 1) {
        return
      }
      let breakFlag = false;
      for (let i = this.customer.customerPlan.customerPlanPeriods.length - 1; i >= 0; i--) {
        for (let j = this.customer.customerPlan.customerPlanPeriods[i].customerPlanWeeks.length - 1; j >= 0; j--) {
          for (let k = this.customer.customerPlan.customerPlanPeriods[i].customerPlanWeeks[j].customerPlanDays.length - 1; k >= 0; k--) {
            if (this.customer.customerPlan.customerPlanPeriods[i].customerPlanWeeks[j].customerPlanDays[k].classId !== null &&
                this.customer.customerPlan.customerPlanPeriods[i].customerPlanWeeks[j].customerPlanDays[k].isActive === 1) {
              this.customer.customerPlan.customerPlanPeriods[i].customerPlanWeeks[j].customerPlanDays[k].isActive = 0
              breakFlag = true;
              break;
            }
          }
          if (breakFlag) {
            break;
          }
        }
        if (breakFlag) {
          break;
        }
      }
      this.$forceUpdate()
      this.computeWeekAndDayLength()
      this.$refs.planPeriod.forEach((planPeriod) => {
        planPeriod.updateDayLength()
      })
      this.resetQrCode()
    },
    addClass() {
      let breakFlag = false;
      for (let i = 0; i < this.customer.customerPlan.customerPlanPeriods.length; i++) {
        for (let j = 0; j < this.customer.customerPlan.customerPlanPeriods[i].customerPlanWeeks.length; j++) {
          for (let k = 0; k < this.customer.customerPlan.customerPlanPeriods[i].customerPlanWeeks[j].customerPlanDays.length; k++) {
            if (this.customer.customerPlan.customerPlanPeriods[i].customerPlanWeeks[j].customerPlanDays[k].classId !== null &&
                this.customer.customerPlan.customerPlanPeriods[i].customerPlanWeeks[j].customerPlanDays[k].isActive === 0) {
              this.customer.customerPlan.customerPlanPeriods[i].customerPlanWeeks[j].customerPlanDays[k].isActive = 1
              breakFlag = true;
              break;
            }
          }
          if (breakFlag) {
            break;
          }
        }
        if (breakFlag) {
          break;
        }
      }
      if (breakFlag) {

      } else {
        //新增课程
        // let startDate=addDateStr(this.customer.customerPlan.startDate,0-getDayOfWeek(this.customer.customerPlan.startDate));
        let startDate = this.customer.customerPlan.startDate
        console.log("startDate: " + startDate)
        let fullDayIndex = 0;
        this.customer.customerPlan.customerPlanPeriods.forEach((period, periodIndex) => {
          let tempPeriodDays = []
          //提取出有课程的那几天(包括中间的休息，但不包括最前+最后面的几天)
          period.customerPlanWeeks.forEach((week) => {
            week.customerPlanDays.forEach((day) => {
              if (day.isRest != null) {
                day.detailDate = addDateStr(startDate, fullDayIndex)
                day.dayOfWeek = getDayOfWeek(addDateStr(startDate, fullDayIndex))
                tempPeriodDays.push(day)
                fullDayIndex += 1
              }
            })
          })
          //按照计划模板重新repeat一次
          this.customer.customerPlan.trainingPlan.trainingPeriods[periodIndex].trainingPeriodDays.forEach((periodDay) => {
            tempPeriodDays.push({
              classId: periodDay.classId,
              classInfo: periodDay.classInfo,
              detailDate: addDateStr(startDate, fullDayIndex),
              dayOfWeek: getDayOfWeek(addDateStr(startDate, fullDayIndex)),
              isRest: periodDay.isRest,
              isActive: 0,
            })
            fullDayIndex += 1
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
                dayOfWeek: getDayOfWeek(addDateStr(period.tempPeriodDays[0].detailDate, i)),
                isRest: 1
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

          //最后一周如果都是休息，则删除最后一周
          let hasClass = false
          if (customerWeekList.length > 1) {
            for (let i = 0; i < customerWeekList[customerWeekList.length - 1].customerPlanDays.length; i++) {
              if (customerWeekList[customerWeekList.length - 1].customerPlanDays[i].classId) {
                hasClass = true
              }
            }
          }
          if (!hasClass && customerWeekList.length > 1) {
            //删除最后一周
            customerWeekList.pop()
          }
          period.customerPlanWeeks = customerWeekList
          period.fullTempDays = fullTempDays
        })
        //将第一天显示出来
        let breakFlag2 = false;
        for (let i = 0; i < this.customer.customerPlan.customerPlanPeriods.length; i++) {
          for (let j = 0; j < this.customer.customerPlan.customerPlanPeriods[i].customerPlanWeeks.length; j++) {
            for (let k = 0; k < this.customer.customerPlan.customerPlanPeriods[i].customerPlanWeeks[j].customerPlanDays.length; k++) {
              if (this.customer.customerPlan.customerPlanPeriods[i].customerPlanWeeks[j].customerPlanDays[k].classId !== null &&
                  this.customer.customerPlan.customerPlanPeriods[i].customerPlanWeeks[j].customerPlanDays[k].isActive === 0) {
                this.customer.customerPlan.customerPlanPeriods[i].customerPlanWeeks[j].customerPlanDays[k].isActive = 1
                breakFlag2 = true;
                break;
              }
            }
            if (breakFlag2) {
              break;
            }
          }
          if (breakFlag2) {
            break;
          }
        }

      }
      this.$forceUpdate()
      this.computeWeekAndDayLength()
      this.$refs.planPeriod.forEach((planPeriod) => {
        planPeriod.updateDayLength()
      })
      this.resetQrCode()
    },
    resetQrCode() {
      this.refreshFlag = true;
      this.qrCodeImageUrl = ""
    },
    createQrCode(payWay) {
      this.$emit("update:generateDialogFlag", true)
      let orderData = {
        customerId: this.customer.customerId,
        coachId: this.coach.coachId,
        orderItems: []
      }
      if (this.customer.customerPlan.trainingPlan && this.payTrainingPlan) {
        //按照训练计划整个付费
        orderData.orderType = "OPEN_CLASS_BY_TRAINING_PLAN"
        let orderItem = {
          itemCount: 1,
          orderItemType: "TRAINING_PLAN",
          trainingPlanId: this.customer.customerPlan.trainingPlan.trainingPlanId,
          vipCardId: this.customer.vipCard.vipCardId
        }
        orderData.orderItems.push(orderItem)
      } else if (this.customer.customerPlan.trainingPlan && !this.payTrainingPlan) {
        //根据课程单价*总价开通私教课
        orderData.orderType = "OPEN_CLASS_BY_TOTAL"
        let orderItem = {
          itemCount: this.dayLength,
          orderItemType: "COACH_CLASS",
          trainingPlanId: this.customer.customerPlan.trainingPlan.trainingPlanId,
          vipCardId: this.customer.vipCard.vipCardId
        }
        orderData.orderItems.push(orderItem)
      } else if (!this.customer.customerPlan.trainingPlan) {
        //开通会员卡
        orderData.orderType = "OPEN_VIP"
        let orderItem = {
          itemCount: 1,
          orderItemType: "VIP_CARD",
          vipCardId: this.customer.vipCard.vipCardId
        }
        orderData.orderItems.push(orderItem)
      } else {
        return
      }
      if (payWay.id === 'alipay') {
        //支付宝
        apiAlipayPreOrder(orderData).then((res) => {
          console.log(res)
          this.afterPay(res)
        })
      } else {
        //微信
        apiWechatPayPreOrder(orderData).then((res) => {
          console.log(res)
          this.afterPay(res)
        })
      }
    },
    afterPay(res){
      this.$emit("update:generateDialogFlag", false)
      if (res.data.code === 0) {
        //成功
        this.refreshFlag = false
        this.$emit("setOrderNumber", res.data.order.orderNumber)
        this.qrCodeImageUrl = process.env.API + "/fitness/" + res.data.order.qrCodeImageUrl
      }
    },
    showVipCardDialog() {
      this.$emit("update:vipCardDialogFlag", true)
    },
    selectPayTrainingPlan() {
      if (!this.payTrainingPlan) {
        this.payTrainingPlan = true
        this.customer.totalMoney = this.customer.customerPlan.trainingPlan.price
        this.resetQrCode()
      }
    },
    selectPayTotalClass() {
      if (this.payTrainingPlan) {
        this.payTrainingPlan = false
        this.customer.totalMoney = this.coach.perClassPrice * this.dayLength
        this.resetQrCode()
      }
    },
    updateTotalMoney() {
      if (!this.payTrainingPlan) {
        this.customer.totalMoney = this.coach.perClassPrice * this.dayLength
      }
    },
    refreshPrice() {
      this.loadCoachInfo()
      this.$emit("update:updateDataFlag", true)
    },
  },
  props: {
    customer: Object,
    vipCardDialogFlag: Boolean,
    vipCardList: Array,
    updateDataFlag: Boolean,
    generateDialogFlag: Boolean
  }
}
</script>

<style scoped lang="scss">
#assignment-become-vip-content {
  .plan-title {
    height: 3.3rem;
    margin: .4rem auto .4rem;
    background-color: #fff;
    width: 99%;
    display: flex;
    flex-direction: column;
    justify-content: center;
    position: relative;
    padding-left: 3.7rem;
    box-shadow: .1rem .1rem .2rem #b0afaf;

    img {
      position: absolute;
      width: 1.8rem;
      height: 1.8rem;
      left: 1rem;
    }

    h4 {
      font-size: 1.2rem;
      margin: 0;
    }
  }

  .plan-empty {
    height: 20rem;
    width: 99%;
    margin-left: 1%;
    background-color: #fff;
    box-shadow: .1rem .1rem .3rem #b0afaf;
    border-radius: .3rem;
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
    margin-top: .5rem;

    img {
      height: 14rem;
    }

    p {
      color: #888;
      font-size: .8rem;
      margin-top: 1rem;
      margin-bottom: .2rem;
    }
  }


  .pay-info {
    width: 99%;
    margin: .4rem auto;
    border-radius: .5rem;
    box-shadow: .1rem .1rem .2rem #b0afaf;
    background-color: #ffffff;
    position: relative;
    overflow: hidden;

    .star {
      position: absolute;
      left: 0;
      top: 0;
      width: .5rem;
      height: 2.5rem;
    }

    .star-4 {
      background-color: #dd6525;
    }

    .star-5 {
      background-color: #2db4cb;
    }

    .title {
      height: 2.5rem;
      width: 100%;
      font-size: 1.1rem;
      line-height: 2.5rem;
      padding-left: 1.4rem;
    }

    .title-special {
      display: flex;
      justify-content: flex-start;
      align-items: center;
      height: 2.5rem;

      .title-common {
        width: 24%;
        height: 100%;
        font-size: 1.1rem;
        padding-left: 1.4rem;
        line-height: 2.5rem;
      }

      .title-select {
        width: 56%;
        height: 100%;
        display: flex;

        .title-select-item {
          width: 50%;
          height: 100%;
          display: flex;
          justify-content: center;
          align-items: center;

          .selected-circle {
            height: .8rem;
            width: .8rem;
            margin-right: .6rem;
            display: flex;
            justify-content: center;
            align-items: center;

            img {
              width: 100%;
              height: 100%;
            }
          }

          .select-circle {
            height: .8rem;
            width: .8rem;
            border-radius: 50%;
            border: 1px solid #999;
            margin-right: .6rem;
            box-sizing: border-box;
          }

          span {
            font-size: .8rem;
          }
        }

        .title-select-item:nth-child(2) {
          justify-content: flex-start;
        }
      }

      .title-refresh {
        width: 20%;
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

    .pay-content {
      height: auto;
      padding-bottom: .6rem;

      .pay-content-item {
        height: 7.4rem;
        width: 90%;
        margin: .7rem 5% .7rem 5%;
        display: flex;
        justify-content: space-between;
        position: relative;

        .item-divider {
          height: .1rem;
          border-bottom: 1px solid #d4d4d4;
          width: 70%;
          position: absolute;
          left: 26%;
          bottom: -.2rem;
        }

        .item-left {
          width: 33%;
          height: 100%;
          display: flex;
          justify-content: flex-start;
          align-items: center;

          .item-left-content {
            width: 88%;
            height: 80%;

            .vip-card {
              width: 100%;
              height: 100%;
              border-radius: .6rem;
              display: flex;
              justify-content: center;
              align-items: center;
              position: relative;

              h4 {
                font-size: 1.1rem;
              }

              h6 {
                position: absolute;
                left: .8rem;
                top: .2rem;
                font-size: .7rem;
              }
            }

            .training-plan {
              width: 100%;
              height: 100%;
              border-radius: .6rem;
              border: 1px solid #f5ce0b;
              display: flex;
              justify-content: center;
              align-items: center;
              overflow: hidden;

              img {
                width: 100%;
                height: 100%;
              }
            }
          }
        }

        .item-middle {
          width: 41%;
          height: 100%;
          display: flex;
          justify-content: center;
          align-items: flex-start;
          flex-direction: column;
          position: relative;

          h6 {
            font-size: 1.1rem;
            padding-bottom: 0.1rem;
            margin-top: -1rem;
          }

          p {
            font-size: .7rem;
            color: #858585;
            margin-bottom: 0.2rem;
          }

          .card-change {
            position: absolute;
            right: -.8rem;
            top: 56%;
            width: 1.6rem;
            height: 1.6rem;
            font-size: .7rem;
            margin-top: -1.6rem;
            border-radius: 50%;
            border: .1rem solid #1686a2;
            color: #1686a2;
            display: flex;
            justify-content: center;
            align-items: center;
            font-weight: 500;
          }
        }

        .item-right {
          width: 26%;
          height: 100%;
          display: flex;
          justify-content: center;
          padding-left: .8rem;
          align-items: center;
          flex-direction: column;

          h6 {
            color: #c63753;
            font-size: 1.2rem;
            margin-bottom: 0.1rem;
            margin-top: -0.15rem;
          }

          p {
            font-size: 1rem;

            span {
              margin-right: .4rem;
            }
          }
        }


      }

      .pay-content-item-total-class {
        .item-right {
          .count-operation {
            display: flex;
            align-items: center;

            p {
              margin: 0 .3rem;
            }

            .minus, .add {
              width: 2rem;
              height: 2rem;
              display: flex;
              justify-content: center;
              align-items: center;
            }

            .minus {
              img {
                width: 100%;
                height: 100%;
              }
            }

            .add {
              img {
                width: 76%;
                height: 76%;
                margin-top: .1rem;
              }
            }
          }
        }
      }

      .free-card {
        .item-left {
          .item-left-content {
            .vip-card {
              position: relative;
              overflow: hidden;

              h6 {
                right: .6rem !important;
                text-align: right;
              }

              .free-status {
                position: absolute;
                width: 4.8rem;
                height: 4.8rem;
                left: -2.4rem;
                top: -2.4rem;
                color: #fff;
                font-size: .9rem;
                transform: rotate(-45deg);
                display: flex;
                justify-content: center;
                align-items: flex-end;
                padding-bottom: .2rem;
                background-color: #38bc57;
              }
            }
          }
        }
      }

      .total-money {
        height: 4.2rem;
        width: 90%;
        margin-left: 5%;
        display: flex;
        justify-content: flex-end;

        .total-money-content {
          height: 100%;
          width: 12rem;
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding-right: .2rem;

          span:nth-child(1) {
            margin-right: 10%;
            font-size: 1.4rem;
          }

          span:nth-child(2) {
            font-size: 1.4rem;
            color: #d99a24
          }
        }
      }
    }

    .pay-way {

      .pay-way-select {
        width: 100%;
        margin-top: 1rem;

        .pay-way-select-item {
          height: 3rem;
          width: 50%;
          margin: .5rem 0 .5rem 4rem;
          background-color: #f7f8f9;
          border: .1rem solid #f7f8f9;
          border-radius: .4rem;
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 0 1rem;

          .name {
            display: flex;
            justify-content: flex-start;
            align-items: center;
            width: 6rem;

            div {
              width: 2rem;
              height: 2rem;
              background-color: #fff;
              margin-right: 1rem;
              border-radius: 50%;

              img {
                width: 100%;
                height: 100%;
              }
            }

            span {
              font-size: .9rem;
              font-weight: bold;
            }
          }

          .circle {
            width: 1.5rem;
            height: 1.5rem;
            border: .1rem solid #abacad;
            border-radius: 50%;
            box-sizing: border-box;
          }

          .circle-selected {
            width: 1.5rem;
            height: 1.5rem;
            border-radius: 50%;

            img {
              width: 100%;
              height: 100%;
            }
          }
        }

        .selected {
          background-color: #fdfcf5;
          border: .1rem solid #fdc50b;
        }
      }

      .pay-way-qr-code {
        width: 100%;
        height: 26rem;
        display: flex;
        justify-content: center;
        align-items: center;

        .qr-code-background {
          width: 15rem;
          height: 23rem;
          position: relative;
          border-radius: 1rem;

          img:nth-child(1) {
            width: 100%;
            height: 100%;
          }

          .qr-code-image {
            width: 10rem;
            height: 10rem;
            position: absolute;
            left: 2.5rem;
            top: 7rem;

            img {
              width: 100%;
              height: 100%;
            }

            .no-support-cover, .to-refresh {
              width: 100%;
              height: 100%;
              background-color: rgba(255, 255, 255, 0.9);
              z-index: 20;
              position: absolute;
              left: 0;
              top: 0;
              display: flex;
              justify-content: center;
              align-items: center;
              flex-direction: column;

              img {
                margin-top: .8rem;
                width: 3rem;
                height: 3rem;
              }

              p {
                font-size: 1rem;
                margin-top: .5rem;
              }
            }
          }

        }

      }
    }
  }
}
</style>
