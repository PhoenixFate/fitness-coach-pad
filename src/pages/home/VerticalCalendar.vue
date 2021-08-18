<template>
  <div id="vertical-calendar">
    <div class="header-line">
      <div class="buttons">
        <div class="button-left" @click="goPrevious()">
          <img src="images/home/left.png" alt="">
        </div>
        <div class="button-right" @click="goNext()">
          <img src="images/home/right.png" alt="">
        </div>
      </div>
      <strong>{{ currentMonth }}</strong>
    </div>

    <div class="calendar-content">
      <!--滑动的日期控件-->
      <div class="sliders-body">
        <div class="sliders" ref="sliders" @touchstart="touchStart" @touchmove.prevent="touchmove"
             :style="getTransform()"
             @touchend="touchend"
             @webkit-transition-end="transitionEnd()" @transitionend="transitionEnd()">
          <div class="appointment-calendar" v-for="item in dates" :key="item.date">
            <div v-for="day in getDays(item.date)"
                 :class="day.date===currentSelectedDay?'appointment-item-day-active':''"
                 @click="selectDay(day.date)"
                 class="appointment-week" :key="day.date">
              <img src="images/home/home-calendar-left.png" alt="" v-if="day.date===currentSelectedDay">
              <div class="appointment-item-day">
                {{ parseInt(day.date.split('-')[2]) }}
              </div>
              <div class="appointment-item-title">
                <div><p>周{{ day.week }}</p>
                  <div class="today" v-if="day.date===today">今</div>
                </div>
                <p v-if="day.count">{{ day.count }}节课程</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!--当日课程列表-->
      <div class="class-list">
        <div class="class-item" v-for="(oneClass,classIndex) in customerArrangementList" :key="classIndex"
             :class="currentClassIndex===classIndex?'class-item-selected':''"
             @click="selectClass(classIndex)"
        >
          <img src="images/home/class-finished.png" alt="" v-if="oneClass.status===1" class="finished-image">
          <h5 :class="oneClass.status===1?'finished-h5':''">{{ oneClass.classInfo.className }}</h5>
          <div>
            <img src="images/home/home-time-yellow.png" alt="" v-if="currentClassIndex===classIndex">
            <img src="images/home/home-time.png" alt="" v-if="currentClassIndex!==classIndex">
            <span>{{ oneClass.customerPlan.startTime.substr(0, 5) }}</span>
            <span>~</span>
            <span>{{ oneClass.customerPlan.endTime.substr(0, 5) }}</span>
          </div>
          <img src="images/home/arrow-yellow.png" alt="" class="select-arrow" v-if="currentClassIndex===classIndex">
        </div>
        <div class="class-list-empty" v-if="!customerArrangementList || customerArrangementList.length===0">
          今天暂无课程
        </div>
      </div>
      <!--课程详情-->
      <div class="class-detail">
        <div class="class-detail-empty" v-if="!customer">点击左侧选择课程</div>
        <div class="class-detail-content" v-if="customer">
          <div class="customer-header">
            <div class="customer-avatar">
              <img :src="customer.avatar" alt="" v-if="customer.avatar">
              <img src="images/home/male-default.png" alt=""
                   v-if="!customer.avatar && customer.gender===1 && customer.isVip===1">
              <img src="images/home/female-default.png" alt=""
                   v-if="!customer.avatar && customer.gender===2 && customer.isVip===1">
              <img src="images/home/male-default-novip.png" alt=""
                   v-if="!customer.avatar && customer.gender===1 && customer.isVip===0">
              <img src="images/home/female-default-novip.png" alt=""
                   v-if="!customer.avatar && customer.gender===2 && customer.isVip===0">
              <img src="images/home/crown.png" alt="" class="crown" v-if="customer.isVip===1">
            </div>
            <h5>{{ customer.name }}</h5>
            <p><span>剩余课程: </span><span>{{ customer.totalClass }}节</span></p>
            <p><span>会员有效期: </span> <span>{{ customer.vipEndDate |emptyFormat }}</span></p>
          </div>
          <div class="customer-content">
            <div v-for="(period,periodIndex) in customer.customerPlan.customerPlanPeriods" :key="periodIndex">
              <div class="week-content" v-for="(week,weekIndex) in period.customerPlanWeeks" :key="weekIndex">
                <h6>第{{ chineseIndex[week.weekIndex - 1] }}周</h6>
                <div v-for="(day,dayIndex) in week.customerPlanDays" :key="dayIndex">
                  <div class="class-info"
                       :class="day.customerPlanDayId===currentCustomerPlanDay.customerPlanDayId?'class-info-selected':''"
                       v-if="day.isRest===0">
                    <div class="class-info-left">
                      <div class="circle"></div>
                      <div class="dashed" v-if="dayIndex!==week.customerPlanDays.length-1">...............</div>
                    </div>
                    <div class="class-info-middle">
                      <h5 v-if="day.classInfo">{{ day.classInfo.className }}</h5>
                      <p>{{ day.detailDate }}</p>
                    </div>
                    <div class="class-info-right">
                      <div v-if="day.status===1">已完成</div>
                    </div>
                  </div>
                </div>
                <div class="divider" v-if="weekIndex!==period.customerPlanWeeks.length-1"></div>
              </div>
            </div>
          </div>
          <div class="bottom-cover">
          </div>
          <div class="bottom-button" @click="toCustomerArrangement()">
            <span v-if="currentCustomerPlanDay.status===0">开始上课</span>
            <span v-if="currentCustomerPlanDay.status===1">查看报告</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import moment from "moment";
import {apiCustomerPlanDayList, apiPlanDayOneMonthCount} from "src/api/customerPlanDay";
import {getAge} from "src/util/dateUtil";
import {apiCustomerDetail} from "src/api/customer";
import {ChineseIndex} from "src/const/customer/assignment/chineseIndexData";

export default {
  name: "VerticalCalendar",
  data() {
    return {
      currentMonth: '',
      week: ['一', '二', '三', '四', '五', '六', '日'],
      actIndex: 1,
      distance: {
        x: 0,
        y: 0
      },
      endy: 0,
      isAnimation: true,
      start: {
        x: 0,
        y: 0
      },
      currentSelectedDay: '',
      today: '',
      dates: [],
      dayCountData: [],
      customerArrangementList: [],
      currentCustomerPlanDay: null,
      currentClassIndex: -1,
      customer: null,
      chineseIndex: ChineseIndex,
    }
  },
  created() {
    this.getTime();
  },
  watch: {
    'currentMonth': function (newVal, oldVal) {
      this.loadMonthCount()
    }
  },
  filters: {
    emptyFormat: function (str) {
      return str ? str : '-'
    }
  },
  methods: {
    goPrevious() {
      this.direction = 'right'
      this.actIndex = 0
      this.transitionEnd()
    },
    goNext() {
      this.direction = 'left'
      this.actIndex = 2
      this.transitionEnd()
    },
    selectClass(classIndex) {
      this.currentClassIndex = classIndex
      this.currentCustomerPlanDay = this.customerArrangementList[classIndex]
      this.loadCustomerDetail()
    },
    getTime() {
      let today = moment().format('YYYY-MM-DD') // 当前日期："2018-09-14"
      this.currentSelectedDay = today;
      this.today = today;
      let weekOfDay = parseInt(moment().format('d')) // 计算今天是这周第几天 周日为一周中的第一天
      let startDay = moment().subtract(weekOfDay - 1, 'days').format('YYYY-MM-DD') // 周一日期
      this.dates.push({
        date: moment(startDay).subtract(7, 'd').format('YYYY-MM-DD')
      }, {
        date: moment(startDay).format('YYYY-MM-DD')
      }, {
        date: moment(startDay).add(7, 'd').format('YYYY-MM-DD')
      });
      this.computeMonth()
      this.loadAssignment()
    },
    selectDay(selectedDate) {
      this.currentSelectedDay = selectedDate
      this.loadAssignment()
      this.currentClassIndex = -1;
      this.currentCustomerPlanDay = null;
      this.customer = null;
    },
    toCustomerArrangement() {
      if (this.currentCustomerPlanDay.status === 0) {
        this.$router.push({
          path: "/main/classAssignment/detail", query: {
            customerPlanDayId: this.currentCustomerPlanDay.customerPlanDayId,
            customerPlanId: this.currentCustomerPlanDay.customerPlanId
          }
        });
      } else {
        this.$router.push({
          path: "/main/classAssignment/summary", query: {
            customerPlanDayId: this.currentCustomerPlanDay.customerPlanDayId,
            customerPlanId: this.currentCustomerPlanDay.customerPlanId
          }
        });
      }
    },
    getDays(day) {
      let arr = []
      /* 计算传进来的日期为星期几 */
      for (let i = 0; i < this.week.length; i++) {
        let tempDay = {
          date: moment(day).add(i, 'd').format('YYYY-MM-DD'),
          week: this.week[Number(moment(day).add(i, 'd').format('E')) - 1]
        }
        this.dayCountData.forEach((countData) => {
          if (countData.detailDate === tempDay.date) {
            tempDay.count = countData.count
          }
        })
        arr.push(tempDay)
      }
      return arr
    },

    touchStart(e) {
      this.start.y = e.touches[0].pageY
    },
    touchmove(e) {
      // 这里需要过渡动画
      this.isAnimation = true
      this.distance.y = e.touches[0].pageY - this.start.y
      // 需要移动的容器
      // 向左
      this.endy = this.endy + this.distance.y
      this.$refs.sliders.style["transform"] = 'translateY(' + this.endy + 'px)'
    },
    touchend(e) {
      this.isAnimation = true
      this.distance.y = e.changedTouches[0].pageY - this.start.y
      // 向右
      if (this.distance.y > 5) {
        this.direction = 'right'
        this.actIndex = 0
      } else if (this.distance.y < -5) {
        this.direction = 'left'
        this.actIndex = 2
      }
      this.distance.y = 0
    },
    // 过渡结束
    transitionEnd() {
      console.log("transitionEnd")
      this.isAnimation = false
      if (this.actIndex === 2) {
        this.dates.push({
          date: moment(this.dates[this.actIndex].date).add(7, 'd').format('YYYY-MM-DD')
        })
        this.dates.shift()
        this.actIndex = 1
      } else if (this.actIndex === 0) {
        this.dates.unshift({
          date: moment(this.dates[this.actIndex].date).subtract(7, 'd').format('YYYY-MM-DD')
        })
        this.dates.pop()
        this.actIndex = 1
      }
      //重新计算当前年月，取中间对那天
      this.computeMonth()
    },
    computeMonth() {
      this.currentMonth = moment(this.dates[1].date).add(3, 'd').format('YYYY.MM')
    },
    getTransform() {
      // actIndex: 当前活动视图的缩影，初始为1，sliderWidth：视口的宽度， distance： {x:0, y: 0}: 触摸移动的距离
      this.endy = (-this.actIndex * window.innerWidth * 0.77) + this.distance.y
      let style = {}
      style["transform"] = 'translateY(' + this.endy + 'px)'
      // 这一条必须写，因为触摸移动的时候需要过渡动画，但是在动画结束重组数据的时候需要瞬间回到该去的位置，不能要过渡动画
      style['transition'] = this.isAnimation ? 'transform .5s ease-out' : 'none'
      return style
    },
    loadMonthCount() {
      apiPlanDayOneMonthCount(this.currentMonth.split('.')[0], this.currentMonth.split('.')[1]).then(res => {
        this.dayCountData = res.data.data
      });
    },
    loadAssignment() {
      apiCustomerPlanDayList({date: this.currentSelectedDay}).then(res => {
        console.log(res)
        res.data.data.forEach(temp => {
          if (temp.customer && temp.customer.birthday) {
            temp.customer.age = getAge(temp.customer.birthday);
          }
        });
        this.customerArrangementList = res.data.data;
      });
    },
    loadCustomerDetail() {
      apiCustomerDetail(this.customerArrangementList[this.currentClassIndex].customerId).then((res) => {
        this.customer = res.data.data
        if (this.customer && this.customer.birthday) {
          this.customer.age = getAge(this.customer.birthday)
        }
        if (this.customer.customerPlan) {
          let weekIndex = 1;
          this.customer.customerPlan.customerPlanPeriods.forEach((period) => {
            period.customerPlanWeeks.forEach((week) => {
              week.weekIndex = weekIndex
              weekIndex += 1
              let tempDays = []
              week.customerPlanDays.forEach((day) => {
                if (day.isRest === 0) {
                  tempDays.push(day)
                }
              })
              week.customerPlanDays = tempDays
            })
          })
        }
        console.log(this.customer)
      })
    },
  }
}
</script>

<style scoped lang="scss">
#vertical-calendar {
  height: 40rem;
  width: 100%;
  background-color: #fff;
  margin-bottom: .5rem;

  .header-line {
    width: 100%;
    height: 2rem;
    display: flex;
    justify-content: flex-start;
    align-items: center;
    padding-left: 1.5rem;

    .buttons {
      width: 6rem;
      height: 1.4rem;
      display: flex;
      margin-right: 1rem;

      .button-left, .button-right {
        width: 3rem;
        height: 100%;
        border: .05rem solid #D1D1D7;
        display: flex;
        justify-content: center;
        align-items: center;

        img {
          width: 1rem;
          height: 1rem;
        }
      }

      .button-left {
        border-radius: .1rem 0 0 .1rem;
        padding-right: .4rem;
      }

      .button-right {
        border-radius: 0 0.1rem 0.1rem 0;
        margin-left: -0.05rem;
        padding-left: .4rem;
      }
    }

    strong {
      font-size: 1.5rem;
      font-family: Staatliches-Regular, Staatliches;
      font-weight: 400;
      color: #23262D;
      margin-left: 3rem;
    }
  }

  .calendar-content {
    display: flex;
    padding: .8rem .2rem 2rem .2rem;

    .sliders-body {
      width: 8rem;
      height: 35rem;
      overflow: hidden;
      background-color: #fff;

      .sliders {
        width: 9rem;
        height: 30rem;
        background-color: #fff;

        .appointment-calendar {
          padding: 1rem 0;
          position: relative;
          width: 9rem;
          height: 27.8rem;
          font-family: PingFangSC-Semibold;
          font-size: 14px;
          border-bottom: .05rem solid #EBECEF;;

          .appointment-week {
            width: 9rem;
            height: 3.7rem;
            display: flex;
            justify-content: flex-start;
            align-items: center;
            padding-left: 1.5rem;
            position: relative;

            .appointment-item-day {
              height: 3rem;
              width: 2.4rem;
              display: flex;
              justify-content: flex-start;
              align-items: center;
              font-size: 2.3rem;
              font-family: Staatliches-Regular, Staatliches;
              font-weight: 400;
              color: #23262D;
              z-index: 100;
            }

            .appointment-item-title {
              height: 2rem;
              display: flex;
              flex-direction: column;
              justify-content: space-between;
              z-index: 100;

              p {
                margin: 0;
                font-size: .6rem;
                font-family: PingFangSC-Regular, PingFang SC;
                font-weight: 400;
              }

              > div {
                display: flex;
                justify-content: flex-start;
                align-items: center;

                p {
                  width: 1.4rem;
                }

                .today {
                  height: .6rem;
                  width: .6rem;
                  background: #FFAD2A;
                  display: flex;
                  justify-content: center;
                  align-items: center;
                  font-size: .5rem;
                  color: #fff;
                  border-radius: 50%;
                }
              }

              p:nth-child(1) {
                color: #ABACB4;
              }

              p:nth-child(2) {
                color: #59585E;
              }
            }
          }

          .appointment-item-day-active {
            img {
              position: absolute;
              left: .5rem;
              height: 3.24rem;
              top: .22rem;
              width: 7.5rem;
            }

            .appointment-item-day {
              color: #fff;
            }

            .appointment-item-title {
              p:nth-child(2) {
                color: #fff;
              }
            }
          }
        }
      }
    }

    .class-list {
      width: 12.8rem;
      height: 35rem;
      margin-left: 2rem;
      overflow-y: scroll;

      .class-item {
        width: 100%;
        height: 5.4rem;
        border-radius: .3rem;
        border: .05rem solid #EBECEF;
        display: flex;
        justify-content: space-between;
        flex-direction: column;
        align-items: flex-start;
        padding: 1rem .8rem;
        position: relative;
        margin-bottom: .8rem;

        .finished-image {
          width: 100%;
          height: 100%;
          position: absolute;
          left: 0;
          top: 0;
        }

        h5 {
          font-size: 1.1rem;
          font-family: PingFangSC-Semibold, PingFang SC;
          font-weight: 600;
          color: #23262D;
          z-index: 100;
        }

        .finished-h5 {
          color: #ABACB4;
        }

        > div {
          display: flex;
          justify-content: flex-start;
          flex-direction: row;
          align-items: center;
          z-index: 100;

          img {
            height: 1rem;
            width: 1rem;
            margin-right: .4rem;
          }

          span {
            font-size: .7rem;
            font-family: PingFangSC-Regular, PingFang SC;
            font-weight: 400;
            color: #ABACB4;
          }

          span:nth-child(3) {
            margin: 0 .3rem;
          }
        }

        .select-arrow {
          position: absolute;
          height: 2.2rem;
          width: 2.2rem;
          right: .1rem;
          top: 50%;
          margin-top: -1.2rem;
        }
      }

      .class-item-selected {
        border: .05rem solid #FFAD2A;

        h5 {
          color: #FFAD2A !important;
        }

        > div {
          span {
            color: #FFAD2A;
          }
        }
      }
      .class-list-empty {
        width: 100%;
        height: 100%;
        display: flex;
        justify-content: center;
        align-items: center;
        color: #999;
        font-size: .7rem;
      }
    }

    .class-detail {
      width: 11.8rem;
      height: 35rem;
      background-color: #22262d;
      margin-left: 1.6rem;
      border-radius: .3rem;
      border: .05rem solid #EBECEF;
      box-sizing: border-box;

      .class-detail-empty {
        width: 100%;
        height: 100%;
        display: flex;
        justify-content: center;
        align-items: center;
        color: #fff;
        font-size: .7rem;
      }

      .class-detail-content {
        width: 100%;
        height: 100%;
        padding: .5rem;
        position: relative;

        .customer-header {
          width: 100%;
          height: 8.7rem;
          background-image: url("../../assets/images/home/home-customer-header.png");
          background-size: 100% 100%;
          border-radius: .3rem;
          padding: 1.1rem 1.2rem;
          color: #fff;

          .customer-avatar {
            width: 100%;
            height: 1.8rem;
            position: relative;
            display: flex;
            justify-content: flex-start;
            align-items: center;

            > img {
              width: 1.8rem;
              height: 1.8rem;
              border-radius: 50%;
            }

            .crown {
              position: absolute;
              width: 1.3rem;
              height: 1rem;
              left: -.34rem;
              top: -.4rem;
            }
          }

          h5 {
            font-size: 1.1rem;
            font-weight: 600;
            color: #fff;
            margin-bottom: .8rem;
            height: 1.6rem;
            margin-top: .05rem;
          }

          p {
            margin: 0;
            font-size: .7rem;
            font-family: PingFangSC-Regular, PingFang SC;
            font-weight: 400;

            span:nth-child(1) {
              margin-right: .2rem;
            }
          }

          p:nth-child(3) {
            margin-bottom: .4rem;
          }
        }

        .customer-content {
          height: 20rem;
          width: 100%;
          overflow-y: scroll;
          margin-top: 1.3rem;
          z-index: 10;

          .week-content {
            width: 100%;
            height: auto;
            padding-left: .3rem;

            h6 {
              font-size: .8rem;
              font-weight: 400;
              color: #828386;
              margin-bottom: .9rem;
            }

            .class-info {
              width: 100%;
              height: 3.6rem;
              display: flex;

              .class-info-left {
                width: 1.5rem;
                padding-top: .1rem;

                .circle {
                  width: .8rem;
                  height: .8rem;
                  border-radius: 50%;
                  border: .1rem solid #FFFFFF;
                }

                .dashed {
                  text-align: center;
                  -webkit-writing-mode: vertical-rl;
                  writing-mode: vertical-rl;
                  width: .8rem;
                  height: 2.8rem;
                  line-height: .2rem;
                  overflow: hidden;
                  letter-spacing: .08rem;
                  font-size: 1rem;
                  font-weight: 800;
                  color: #828386;
                }
              }

              .class-info-middle {
                width: 7.3rem;

                h5 {
                  font-size: .9rem;
                  font-weight: 600;
                  color: #FFFFFF;
                  line-height: 1.1rem;
                  margin-bottom: .4rem;
                }

                p {
                  margin: 0;
                  font-size: .7rem;
                  font-family: PingFangSC-Regular, PingFang SC;
                  font-weight: 400;
                  color: #828386;
                }
              }

              .class-info-right {
                width: 1.6rem;
                height: 100%;
                display: flex;
                justify-content: center;
                align-items: flex-start;

                div {
                  width: 1.6rem;
                  font-size: .4rem;
                  border: .05rem solid #828386;
                  color: #828386;
                  border-radius: .2rem;
                  display: flex;
                  justify-content: center;
                  align-items: center;
                  margin-top: .2rem;
                }
              }
            }

            .class-info-selected {
              .class-info-left {
                .circle {
                  width: .8rem;
                  height: .8rem;
                  border-radius: 50%;
                  border: .1rem solid $main_yellow;
                  background-color: #fff;
                }
              }

              .class-info-middle {
                h5 {
                  color: $main_yellow
                }
              }
            }

            .divider {
              width: 95%;
              margin: .3rem 5% 1rem 0;
              height: .05rem;
              background-color: #828386;
            }
          }
        }

        .bottom-cover {
          width: 100%;
          height: 5rem;
          position: absolute;
          left: 0;
          bottom: 2.1rem;
          background: linear-gradient(180deg, rgba(48, 46, 55, 0) 0%, #302E37 100%);
          z-index: 50;
        }

        .bottom-button {
          position: absolute;
          width: calc(100% - 2.4rem);
          height: 2.2rem;
          background-color: #FFAD2A;
          display: flex;
          justify-content: center;
          align-items: center;
          left: 1.2rem;
          bottom: 1.2rem;
          border-radius: .3rem;
          z-index: 100;
          padding-top: .05rem;

          span {
            font-size: .8rem;
            font-family: PingFangSC-Semibold, PingFang SC;
            font-weight: 600;
            color: #FFFFFF;
          }
        }
      }
    }
  }

}
</style>
