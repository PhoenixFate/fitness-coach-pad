<template>
  <div id="achievement-page">
    <div class="achievement-type">
      <h5>周任务指标</h5>
      <div class="achievement-line" v-if="target.weekTargets">
        <div class="achievement-item" v-for="(target,targetIndex) in target.weekTargets" :key="targetIndex">
          <div class="line-top">
            <img src="images/target/customer-number.png" alt="" v-if="target.targetType==='NEW_CUSTOMER'">
            <img src="images/target/vip-number.png" alt="" v-if="target.targetType==='NEW_VIP'">
            <img src="images/target/sale-money.png" alt="" v-if="target.targetType==='SALE_MONEY'">
            <div class="target-name" v-if="target.targetType==='NEW_CUSTOMER' || target.targetType==='SALE_MONEY'">
              <strong>{{ target.targetName.slice(0, 3) }}</strong> <br>
              <strong>{{ target.targetName.slice(3) }}</strong>
            </div>
            <div class="target-name" v-if="target.targetType==='NEW_VIP'">
              <strong>{{ target.targetName.slice(0, 4) }}</strong> <br>
              <strong>{{ target.targetName.slice(4) }}</strong>
            </div>
            <div class="detail-number"
                 :class="target.targetType==='NEW_CUSTOMER'?'common-color':(target.targetType==='NEW_VIP'?'vip-color':'money-color')"
            >
              <span>目标: </span><br>
              <span>{{ target.detailNumber }}</span>
              <span v-if="target.targetType==='NEW_CUSTOMER' || target.targetType==='NEW_VIP'">人</span>
              <span v-if="target.targetType==='SALE_MONEY'">元</span>
            </div>
            <div class="finished-number" v-if="target.targetType==='NEW_CUSTOMER' || target.targetType==='NEW_VIP'">
              <img src="images/target/detail-number1.png" alt="" v-if="target.targetType==='NEW_CUSTOMER'">
              <img src="images/target/detail-number2.png" alt="" v-if="target.targetType==='NEW_VIP'">
              <div>{{ target.coachFinishedNumber |formatTwoNumber }}</div>
            </div>
            <div class="finished-number-money" v-if="target.targetType==='SALE_MONEY'">
              <img src="images/target/detail-number3.png" alt="" v-if="target.targetType==='SALE_MONEY'">
              <div>{{ target.coachFinishedNumber }}</div>
            </div>
          </div>
          <div class="line-bottom">
            <van-progress
              class="progress"
              :percentage="target.coachFinishedNumber / target.detailNumber*100"
              stroke-width=".4rem"
              track-color="#fff"
              :color="target.targetType==='NEW_CUSTOMER'?'#9c9db0':(target.targetType==='NEW_VIP'?'#7e6bd4':'#ffac27')"
              :show-pivot="false"
            />
            <span>{{ parseInt(target.coachFinishedNumber / target.detailNumber*100) }}%</span>
          </div>
        </div>
      </div>
    </div>
    <div class="divider"></div>
    <div class="achievement-type">
      <h5>月任务指标</h5>
      <div class="achievement-line" v-if="target.monthTargets">
        <div class="achievement-item" v-for="(target,targetIndex) in target.weekTargets" :key="targetIndex">
          <div class="line-top">
            <img src="images/target/customer-number.png" alt="" v-if="target.targetType==='NEW_CUSTOMER'">
            <img src="images/target/vip-number.png" alt="" v-if="target.targetType==='NEW_VIP'">
            <img src="images/target/sale-money.png" alt="" v-if="target.targetType==='SALE_MONEY'">
            <div class="target-name" v-if="target.targetType==='NEW_CUSTOMER' || target.targetType==='SALE_MONEY'">
              <strong>{{ target.targetName.slice(0, 3) }}</strong> <br>
              <strong>{{ target.targetName.slice(3) }}</strong>
            </div>
            <div class="target-name" v-if="target.targetType==='NEW_VIP'">
              <strong>{{ target.targetName.slice(0, 4) }}</strong> <br>
              <strong>{{ target.targetName.slice(4) }}</strong>
            </div>
            <div class="detail-number"
                 :class="target.targetType==='NEW_CUSTOMER'?'common-color':(target.targetType==='NEW_VIP'?'vip-color':'money-color')"
            >
              <span>目标: </span><br>
              <span>{{ target.detailNumber }}</span>
              <span v-if="target.targetType==='NEW_CUSTOMER' || target.targetType==='NEW_VIP'">人</span>
              <span v-if="target.targetType==='SALE_MONEY'">元</span>
            </div>
            <div class="finished-number" v-if="target.targetType==='NEW_CUSTOMER' || target.targetType==='NEW_VIP'">
              <img src="images/target/detail-number1.png" alt="" v-if="target.targetType==='NEW_CUSTOMER'">
              <img src="images/target/detail-number2.png" alt="" v-if="target.targetType==='NEW_VIP'">
              <div>{{ target.coachFinishedNumber |formatTwoNumber }}</div>
            </div>
            <div class="finished-number-money" v-if="target.targetType==='SALE_MONEY'">
              <img src="images/target/detail-number3.png" alt="" v-if="target.targetType==='SALE_MONEY'">
              <div>{{ target.coachFinishedNumber }}</div>
            </div>
          </div>
          <div class="line-bottom">
            <van-progress
              class="progress"
              :percentage="target.coachFinishedNumber / target.detailNumber *100"
              stroke-width=".4rem"
              track-color="#fff"
              :color="target.targetType==='NEW_CUSTOMER'?'#9c9db0':(target.targetType==='NEW_VIP'?'#7e6bd4':'#ffac27')"
              :show-pivot="false"
            />
            <span>{{ parseInt(target.coachFinishedNumber / target.detailNumber*100) }}%</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import {apiGetCoachTarget} from "src/api/coach";

export default {
  name: "Index.vue",
  data() {
    return {
      target: {},
      coach: null
    }
  },
  filters: {
    formatTwoNumber: function (num) {
      if (num < 10 && num > 0) {
        return '0' + num
      }
      return num
    }
  },
  created() {
    this.coach = JSON.parse(localStorage.getItem("coach"))
    this.loadCoachTarget()
  },
  methods: {
    loadCoachTarget() {
      apiGetCoachTarget(this.coach.coachId).then(({data}) => {
        if (data.data && data.data.coachTargetDetailList) {
          let weekTargets = []
          let monthTargets = []
          data.data.coachTargetDetailList.forEach((target) => {
            if (target.targetPeriodType === "WEEK_TARGET") {
              weekTargets.push(target)
            }
            if (target.targetPeriodType === "MONTH_TARGET") {
              monthTargets.push(target)
            }
          })
          data.data.weekTargets = weekTargets
          data.data.monthTargets = monthTargets
        }
        this.target = data.data
        console.log(this.target)
      })
    },
  }
}
</script>
<style scoped lang="scss">
#achievement-page {
  .achievement-type {
    height: 23rem;
    background-color: #fff;
    padding: .2rem 1.5rem 1rem 1.5rem;
    h5 {
      font-weight: bold;
      line-height: 4rem;
      font-size: 1.7rem;
    }
    .achievement-line {
      height: 16.9rem;
      width: 100%;
      overflow-x: scroll;
      overflow-y: hidden;
      justify-content: flex-start;
      align-items: center;
      display: flex;

      .achievement-item {
        width: 10.9rem;
        height: 16.9rem;
        border-radius: .3rem;
        overflow: hidden;
        margin-right: .9rem;
        flex-shrink: 0;

        .line-top {
          height: 12rem;
          position: relative;

          img {
            width: 100%;
            height: 100%;
            position: absolute;
            left: 0;
            top: 0;
          }

          .target-name {
            position: absolute;
            top: .9rem;
            left: .9rem;
            width: 6rem;
            height: 5rem;
            font-size: 1.2rem;
            font-weight: bold;
            line-height: 1.6rem;

          }

          .detail-number {
            position: absolute;
            top: 5rem;
            left: .9rem;
            font-size: .9rem;
          }

          .common-color {
            color: #818285;
          }

          .vip-color {
            color: #7965d2;
          }

          .money-color {
            color: #ffac27;
          }

          .finished-number, .finished-number-money {
            width: 4.1rem;
            height: 3.6rem;
            position: absolute;
            top: 10.18rem;
            left: .9rem;

            img {
              position: absolute;
              left: 0;
              top: 0;
              width: 100%;
              height: 100%;
            }

            div {
              height: 100%;
              width: 100%;
              position: absolute;
              left: 0;
              top: 0;
              display: flex;
              justify-content: center;
              align-items: center;
              font-size: 2.4rem;
              color: #fff;
              z-index: 10;
              font-family: 'Staatliches-Regular', 'Staatliches';
              font-weight: 400;
            }
          }

          .finished-number-money {
            width: 4.9rem;

            div {
              font-size: 1.7rem;
            }
          }

        }

        .line-bottom {
          height: 4.9rem;
          width: 100%;
          background-color: #edeef1;
          display: flex;
          justify-content: center;
          align-items: center;
          padding-top: 1.8rem;

          .progress {
            width: 64%;
            margin-right: .8rem;
          }
        }
      }

      .achievement-item:last-child {
        margin-right: 0;
      }
    }
  }
  .achievement-type:last-child{
    padding: .6rem 1.5rem .4rem 1.5rem;
  }

  .divider {
    background-color: #ebecef;
    height: .1rem;
    margin-top: -.2rem;
  }
}
</style>
