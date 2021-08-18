<template>
  <div id="class-assignment-summary-content">
    <div class="header">
      <div class="avatar">
        <img :src="customerPlanDay.customer.avatar" alt="" v-if="customerPlanDay.customer.avatar">
        <img src="images/home/avatar-male.png" alt=""
             v-if="!customerPlanDay.customer.avatar && customerPlanDay.customer.gender==1">
        <img src="images/home/avatar-female.png" alt=""
             v-if="!customerPlanDay.customer.avatar && customerPlanDay.customer.gender==2">
      </div>
      <div class="board">
        <div class="board-content">
          <h6 v-if="customerPlanDay.customerPlan.trainingPlan">
            {{ customerPlanDay.customerPlan.trainingPlan.trainingPlanName }}</h6>
        </div>
      </div>
      <div class="customer-info">
        <h5>{{ customerPlanDay.customer.name }}</h5>
        <span v-if="customerPlanDay.customer.age">{{ customerPlanDay.customer.age }}岁</span>
        <span v-if="!customerPlanDay.customer.age">未知年龄</span>
        <div><span>会员编号: </span><strong>{{ customerPlanDay.customer.customerNumber }}</strong></div>
      </div>
      <div class="header-cover">
      </div>
      <div class="header-content">
        <div class="history-title">历史训练</div>
        <div class="header-content-scroll">
          <div class="class-item" v-for="(historyClass,index) in historyClassInfo"
               :key="index"
               :class="historyClass.customerPlanDayId==customerPlanDayId?'class-item-selected':''"
               @click="selectDay(index)"
          >
            <img :src="historyClass.classInfo.classCoverImage" alt="">
            <h6>{{ historyClass.classInfo.className }}</h6>
            <p>{{ historyClass.detailDate }}</p>
          </div>
          <div class="history-empty" v-if="historyClassInfo.length===0">
            <img src="images/classAssignment/history-empty.png" alt="">
            <h5>暂无课程列表</h5>
          </div>
          <div class="empty"></div>
        </div>
      </div>
    </div>
    <div class="exercise-detail">
      <div class="big-title">
        <div class="line-left">
          <div class="line"></div>
          <div class="line"></div>
        </div>
        <div class="title-content">
          <span style="margin-right: .5rem">{{ customerPlanDay.detailDate }}</span><span>训练总结</span>
        </div>
        <div class="line-right">
          <div class="line"></div>
          <div class="line"></div>
        </div>
      </div>
      <div v-if="customerPlanDay.classInfo.exercises">
        <div class="exercise-item" v-for="(exerciseItem,exerciseIndex) in customerPlanDay.classInfo.exercises"
             :key="exerciseIndex">
          <div class="exercise-item-title">{{ exerciseItem.exerciseName }}</div>
          <div class="tab-content">
            <div class="tab-action-set-item"
                 v-for="(actionSet,actionSetIndex) in exerciseItem.actionSets" :key="actionSetIndex"
            >
              <div class="set-type" :class="actionSetType[actionSet.actionSetType].activeClass">
                {{ actionSetType[actionSet.actionSetType].name }}
              </div>
              <div class="movement-detail" @click="showSetDetailDialog(exerciseIndex,actionSetIndex)">
                查看详情
              </div>

              <div class="action-line" v-for="(action,actionIndex) in actionSet.actions" :key="actionIndex">
                <div class="action-line-header">
                  <div class="action-name">
                    {{ action.actionName }}
                  </div>
                  <div class="action-time">
                    {{ actionSet.totalMinute|formatTwoNumber }}:{{ actionSet.totalSecond|formatTwoNumber }}
                  </div>
                </div>
                <div class="action-line-content">
                  <div><strong>{{ actionSet.realSetNumber }}</strong>组</div>
                  <div>组件间歇: <strong>{{ actionSet.averageRestTime }}</strong>秒</div>
                </div>
                <div class="divider-line" v-if="actionIndex!==actionSet.actions.length-1"></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="save-button">
        <div class="finish" @click="finishSummary">
          <div>完成</div>
        </div>
      </div>
    </div>
    <transition enter-active-class="animate__slideInDown animate__faster"
                leave-active-class="animate__zoomOut animate__fast">
      <AlertMessage
        :alert-message-flag.sync="alertMessageFlag"
        :message="alertMessage"
        class="animate__animated"
        style="z-index: 3000"
        v-show="alertMessageFlag"
      >
      </AlertMessage>
    </transition>

    <SetDetail
      :setDetailFlag.sync="setDetailFlag"
      :action-set="currentActionSet"
      class="animate__animated"
      style="z-index: 3000"
      v-if="setDetailFlag"
    >
    </SetDetail>

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
import {ActionSetType} from "src/const/classManagement/actionSetType";
import "./q-input.scss"
import {
  apiCustomerPlanDayDetail,
  apiPlanDayOneCustomerHistory
} from "src/api/customerPlanDay";
import {getAge} from "src/util/dateUtil";
import AlertMessage from "components/common/AlertMessage";
import SetDetail from "components/classAssignment/SetDetail";
import LoadingData from "components/common/LoadingData";

export default {
  name: "Index",
  components: {AlertMessage, SetDetail, LoadingData},
  data() {
    return {
      actionSetType: ActionSetType,
      historyClassInfo: [],
      currentClassItem: {},

      countingPanelFlag: false,
      currentActionSet: {},
      actionDetailListFlag: false,
      currentActionDetailList: [],

      customerPlanDay: {
        customer: {},
        customerPlan: {},
        classInfo: {}
      },

      setDetailFlag: false,

      customerPlanDayId: "",
      customerPlanId: "",

      alertMessage: "",
      alertMessageFlag: false,
      loadingDataFlag: true,

    }
  },
  filters: {
    weightEmptyFilter: function (value) {
      if (!value) {
        return "-"
      } else {
        return value + "KG"
      }
    },
    formatTwoNumber: function (num) {
      if (num < 10) {
        return '0' + num
      }
      return num
    }
  },
  computed: {},
  created() {
    if (!this.$route.query.customerPlanDayId) {
      this.alertMessage = "您当前跳转的页面不合法"
      this.alertMessageFlag = true
    } else {
      this.customerPlanDayId = this.$route.query.customerPlanDayId
      this.customerPlanId = this.$route.query.customerPlanId
      this.loadData()
      this.loadDataCommon()
    }

  },
  methods: {
    loadData() {
      apiCustomerPlanDayDetail(this.customerPlanDayId).then((res) => {
        console.log(res)
        setTimeout(() => {
          this.loadingDataFlag = false
        }, 400)
        let customerPlanDay = res.data.data;
        if (customerPlanDay && customerPlanDay.customer && customerPlanDay.customer.birthday) {
          customerPlanDay.customer.age = getAge(customerPlanDay.customer.birthday)
        }
        if (customerPlanDay.classInfo && customerPlanDay.classInfo.exercises) {
          customerPlanDay.classInfo.exercises.forEach((exercise) => {
            exercise.actionSets.forEach((actionSet) => {
              let totalMinute = 0;
              let totalSecond = 0;
              let averageRestTime = 0;
              if (actionSet.oneSets && actionSet.oneSets.length > 0) {
                actionSet.oneSets.forEach((oneSet) => {
                  totalMinute += oneSet.minute
                  totalSecond += oneSet.second
                  averageRestTime += oneSet.realRestTime
                })
                averageRestTime = Math.round(averageRestTime / actionSet.oneSets.length)
                totalMinute = Math.floor((totalMinute * 60 + totalSecond) / 60)
                totalSecond = (totalMinute * 60 + totalSecond) % 60

              } else {
                actionSet.realSetNumber = 0
              }
              actionSet.totalMinute = totalMinute
              actionSet.totalSecond = totalSecond
              actionSet.averageRestTime = averageRestTime
            })
          })
        }
        this.customerPlanDay = customerPlanDay
      })
    },
    selectDay(index) {
      this.customerPlanDayId = this.historyClassInfo[index].customerPlanDayId
      this.loadData()
    },
    loadDataCommon() {
      console.log(this.customerPlanId)
      apiPlanDayOneCustomerHistory(this.customerPlanId).then((res) => {
        console.log(res)
        this.historyClassInfo = res.data.data
      })
    },
    showSetDetailDialog(exerciseIndex, actionSetIndex) {
      this.currentActionSet = this.customerPlanDay.classInfo.exercises[exerciseIndex].actionSets[actionSetIndex]
      console.log(this.currentActionSet)
      this.setDetailFlag = true;
    },
    finishSummary() {
      this.$router.go(-1)
    }
  }
}
</script>

<style scoped lang="scss">
#class-assignment-summary-content {
  height: 100%;
  width: 100%;

  .header {
    height: 17rem;
    width: 100%;
    background: url("../../../../assets/images/classAssignment/detail-header-background-02.png") center center / cover no-repeat;
    background-size: 100% 100%;
    position: relative;

    .avatar {
      width: 6rem;
      height: 6rem;
      position: absolute;
      z-index: 10;
      left: 2rem;
      top: .6rem;
      border-radius: 50%;
      overflow: hidden;
      border: .2rem solid #f3cb04;
      display: flex;
      justify-content: center;
      align-items: center;

      img {
        width: 100%;
        height: 100%;
      }
    }

    .customer-info {
      width: 10rem;
      position: absolute;
      left: 32%;
      top: .6rem;
      color: #fff;
      display: flex;
      justify-content: flex-start;
      flex-direction: column;

      h5 {
        font-weight: bold;
        font-size: 1.4rem;
      }

      > span {
        color: #c3c1c1;
        margin: .2rem 0;
        font-size: .7rem;
      }

      div {
        span {
          font-size: .9rem;
          color: #cb764f;
          margin-right: .4rem;
        }

        strong {
          font-size: 1rem;
          color: #f1c903;
        }
      }
    }

    .board {
      width: 13rem;
      height: 7rem;
      background: url("../../../../assets/images/classAssignment/board.png") center center / cover no-repeat;
      background-size: 100% 100%;
      position: absolute;
      top: 1.1rem;
      right: 0;
      z-index: 3;

      .board-content {
        position: absolute;
        width: 44%;
        height: 40%;
        border-radius: .2rem;
        padding-left: .2rem;
        top: 10%;
        left: 30%;
        padding-top: .5rem;

        p {
          font-size: .7rem;
          margin-bottom: .2rem;
        }

        h6 {
          font-size: .8rem;
          line-height: 1.3;
        }
      }
    }

    .header-cover {
      position: absolute;
      width: 100%;
      height: 64.9%;
      left: 0;
      bottom: 0;
      overflow: hidden;
    }

    .header-cover::before {
      content: "";
      background: url("../../../../assets/images/classAssignment/detail-header-background-03.png") center center / cover no-repeat;
      background-size: 100% 100%;
      filter: blur(.3rem);
      position: absolute;
      left: 0;
      right: 0;
      top: 0;
      bottom: 0;
      z-index: 2;
    }

    .header-content {
      position: absolute;
      width: 100%;
      height: 64.9%;
      left: 0;
      bottom: 0;
      overflow: hidden;
      z-index: 5;
      background-color: rgba(0, 0, 0, 0.18);

      .history-title {
        position: absolute;
        width: 5rem;
        color: #eee6e6;
        font-size: 1.1rem;
        margin-left: 3%;
        margin-top: .3rem;
      }

      .header-content-scroll {
        overflow-x: scroll;
        overflow-y: hidden;
        justify-content: flex-start;
        display: flex;
        height: 100%;

        .class-item {
          width: 30%;
          height: 72%;
          flex-shrink: 0;
          margin-top: 5.8%;
          margin-left: 3%;
          border-radius: .4rem;
          display: flex;
          align-items: center;
          flex-direction: column;
          justify-content: center;
          background-color: rgba(255, 255, 255, 0.4);
          padding-top: .3rem;
          position: relative;
          overflow: hidden;

          img {
            width: 80%;
            height: 67%;
            border-radius: .2rem;
          }

          h6 {
            font-size: .8rem;
            line-height: 1.2;
            margin-top: .2rem;
          }

          p {
            font-size: .6rem;
            margin-bottom: -.2rem;
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
            padding-bottom: .3rem;
            font-weight: bold;
          }

          .status-finished {
            background-color: #31c353;
          }

          .status-now {
            background-color: #e3af21;
          }

          .status-future {
            background-color: #1976d2;
          }
        }

        .class-item-selected {
          width: 32%;
          height: 78%;
          margin-top: 5%;
          margin-left: 3%;
          border: 1px solid #f6b91c;
          box-shadow: 0 0 .3rem #f3c03b;
        }

        .history-empty {
          width: 30%;
          height: 72%;
          flex-shrink: 0;
          margin-top: 5.8%;
          margin-left: 3%;
          border-radius: .4rem;
          display: flex;
          align-items: center;
          flex-direction: column;
          justify-content: center;
          background-color: rgba(255, 255, 255, 0.4);
          padding-top: .3rem;

          img {
            width: 60%;
            height: 76%;
          }

          h5 {
            font-size: .9rem;
            color: #4f4d4d;
            margin-top: -.4rem;
          }
        }

        .empty {
          width: 3%;
          height: 72%;
          flex-shrink: 0;
        }
      }

    }

  }


  .exercise-detail {
    min-height: 30rem;
    width: 100%;
    background-color: #f0ecfc;
    padding: 1rem 0;

    .big-title {
      height: 4rem;
      width: 100%;
      text-align: center;
      display: flex;
      justify-content: center;
      align-items: center;

      .line-left, .line-right {
        width: 22%;
        display: flex;
        justify-content: space-around;
        flex-direction: column;
        height: 1.5rem;

        .line {
          width: 100%;
          height: .15rem;
          background-color: #eecf79;
        }
      }

      .title-content {
        width: auto;
        padding: 0 1rem;
        line-height: 3.4rem;
        font-size: 1.4rem;
        color: #eaab08;
      }
    }

    .exercise-item {
      width: 95.6%;
      height: auto;
      margin: 0 auto 1rem;
      background-color: rgba(255, 255, 255, 0.78);
      box-shadow: 0 0 .3rem #9f96ba;
      border-radius: .3rem;
      position: relative;
      padding: 1.6rem .6rem .7rem .6rem;

      .exercise-item-title {
        width: 26%;
        height: 2rem;
        position: absolute;
        left: 0;
        top: -.5rem;
        border-radius: .6rem;
        background-color: #8387dd;
        box-shadow: .15rem .15rem .3rem #5b4a9b;
        color: #fff;
        padding-left: 5%;
        line-height: 2rem;
        font-size: 1rem;
        font-weight: bold;
      }

      .tab-content {
        width: 100%;
        height: auto;

        .tab-title {
          height: 2rem;
          line-height: 2rem;
        }

        .line-item {
          display: flex;
          text-align: center;

          > div:nth-child(1) {
            width: 30%;
          }

          > div:nth-child(2) {
            width: 10%;
          }

          > div:nth-child(3) {
            width: 10%;
          }

          > div:nth-child(4) {
            width: 10%;
          }

          > div:nth-child(5) {
            width: 10%;
          }

          > div:nth-child(6) {
            width: 10%;
          }

          > div:nth-child(7) {
            width: 10%;
          }

          > div:nth-child(8) {
            width: 20%;
          }

        }

        .tab-title {
          background-color: #6976e5;
          color: #fff;

          div {
            border-right: 1px solid #8f99f3;
          }
        }

        .type-common {
          background-color: #eca656;
          border: 1px solid #eca656;
        }

        .type-super {
          background-color: #f33a3a;
          border: 1px solid #f33a3a;
        }

        .type-reduce {
          background-color: #2dab5b;
          border: 1px solid #2dab5b;
        }

        .tab-action-set-item {
          box-shadow: 0 0 .2rem #999;
          width: 94%;
          margin: .8rem auto;
          height: auto;
          border-radius: .4rem;
          position: relative;
          display: flex;
          flex-direction: column;
          justify-content: center;

          .set-type {
            position: absolute;
            right: 1rem;
            top: 1.2rem;
            width: 5rem;
            height: 1.5rem;
            color: #fff;
            font-weight: bold;
            font-size: .8rem;
            display: flex;
            justify-content: center;
            align-items: center;
            border-radius: .2rem;
          }

          .movement-detail {
            position: absolute;
            right: 1rem;
            top: 2.7rem;
            width: 5rem;
            display: flex;
            justify-content: center;
            align-items: center;
            font-size: .8rem;
            height: 1.5rem;
            line-height: 1.5rem;
            border: 1px solid #a6a1fc;
            border-radius: .2rem;
            margin-top: .8rem;
            color: #2b2597;
            z-index: 5;
          }

          .action-line {
            height: 6rem;
            padding: .5rem;
            position: relative;
            margin-top: .5rem;

            .action-line-header {
              height: 2.6rem;
              display: flex;
              justify-content: space-between;
              align-items: flex-start;
              padding-right: 30%;

              .action-name {
                font-size: 1.1rem;
                font-weight: bold;
                padding-left: 10%;
                width: 50%;
              }

              .action-time {
                font-size: 1.2rem;
                font-weight: bold;
                color: #00bbd4;
                width: 50%;
                text-align: center;
              }
            }

            .action-line-content {
              height: 2.3rem;
              display: flex;
              line-height: 2.3rem;
              padding-right: 30%;
              font-size: .8rem;

              > div {
                line-height: 1rem;

                strong {
                  font-size: .9rem;
                  color: #0e9d43;
                  margin-right: .2rem;
                }
              }

              div:nth-child(1) {
                width: 50%;
                padding-left: 14%;
              }

              div:nth-child(2) {
                width: 50%;
                text-align: center;
              }
            }

            .action-line-detail {
              height: auto;
              width: 80%;
              margin: .5rem auto;
              border: 1px solid #d4d3d3;
              border-radius: .4rem;

              .detail-line {
                height: auto;
                width: 100%;

                .detail-line-content {
                  height: 1.5rem;
                  display: flex;
                  text-align: center;
                  line-height: 1.5rem;

                  > div:nth-child(1) {
                    width: 30%;
                  }

                  > div:nth-child(2) {
                    width: 14%;
                  }

                  > div:nth-child(3) {
                    width: 30%;
                  }

                  > div:nth-child(4) {
                    width: 20%;
                  }

                  > div:nth-child(5) {
                    width: 20%;
                    display: flex;
                    justify-content: center;
                    align-items: center;

                    div {
                      width: 2.4rem;
                      height: 1rem;
                      background-color: #6893db;
                      border-radius: .2rem;
                      line-height: 1rem;
                      color: #fff;
                    }
                  }
                }
              }
            }

            .divider-line {
              position: absolute;
              height: 1px;
              border-bottom: 1px solid #bcbcbc;
              width: 88%;
              bottom: 0;
              left: 6%;
            }
          }
        }
      }
    }

    .save-button {
      width: 100%;
      height: 4rem;
      display: flex;
      justify-content: center;
      align-items: center;
      margin-top: 1rem;

      .finish {
        height: 2.5rem;
        width: 30%;
        margin: 2rem auto 1rem;
        background: linear-gradient(to right, #5362bd, #8a95d1);
        border-radius: .6rem;
        text-align: center;
        line-height: 2.5rem;
        font-size: 1.1rem;
        color: #fff;
        font-weight: bold;
        box-shadow: .1rem .1rem .2rem #b9baba;
        overflow: hidden;

        div {
          width: 100%;
          height: 100%;
          border-radius: .6rem;
          box-shadow: -.1rem -.1rem .3rem #5362bd inset;
        }
      }
    }
  }

}

</style>
