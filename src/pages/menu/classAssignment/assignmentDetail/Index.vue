<template>
  <div id="class-assignment-detail-content">
    <ClassAssignmentHeader
      :customer-plan-day="customerPlanDay"
      :customer-plan-day-id="customerPlanDayId"
      ref="classAssignmentHeader"
      :historyClassInfo="historyClassInfo"
    ></ClassAssignmentHeader>
    <div class="exercise-detail clearfix">
      <div class="time-operation">
        <div class="title-content">
          <img src="images/classAssignment/title-background-gray.png" alt="">
          <p><span style="margin-right: .2rem" v-if=" customerPlanDay.detailDate">{{
              customerPlanDay.detailDate.substr(0, 4)
            }}.{{ customerPlanDay.detailDate.substr(5, 2) }}.{{ customerPlanDay.detailDate.substr(8, 2) }}</span><span>当日训练</span>
          </p>
        </div>
        <div class="time-item">
          <h5>{{ customerPlanDay.classInfo.duration }}</h5>
          <span>课程总时长</span>
        </div>
        <div class="time-item">
          <h5 v-if="!redFlag">{{ remainingMinute|formatTwoNumber }}:{{ remainingSecond|formatTwoNumber }}</h5>
          <span v-if="!redFlag">剩余时间</span>
          <h5 v-if="redFlag">{{
              customerPlanDay.usedMinute|formatTwoNumber
            }}:{{ customerPlanDay.usedSecond|formatTwoNumber }}</h5>
          <span v-if="redFlag">已用时</span>
        </div>
        <div class="time-button">
          <img src="images/classAssignment/start-circle.png" alt="" v-if="!classTimeInternal"
               @click="startClassInternal">
          <img src="images/classAssignment/stop-circle.png" alt="" v-if="classTimeInternal" @click="stopClassInternal">
        </div>
      </div>
      <div v-if="customerPlanDay.classInfo.exercises">
        <div class="exercise-item" v-for="(exerciseItem,exerciseIndex) in customerPlanDay.classInfo.exercises"
             :key="exerciseIndex">
          <div class="exercise-item-title">
            <div></div>
            {{ exerciseItem.exerciseName }}
          </div>
          <div class="tab-content">
            <div class="tab-action-set"
                 v-for="(actionSet,actionSetIndex) in exerciseItem.actionSets" :key="actionSetIndex">
              <div class="set-type-body">
                <div :class="actionSetType[actionSet.actionSetType].activeClass" class="set-type">
                  <img src="images/classAssignment/yellow-set.png" alt="" v-if="actionSet.actionSetType==='COMMON_SET'">
                  <img src="images/classAssignment/red-set.png" alt="" v-if="actionSet.actionSetType==='SUPER_SET'">
                  <img src="images/classAssignment/green-set.png" alt="" v-if="actionSet.actionSetType==='REDUCE_SET'">
                  <span>{{ actionSetType[actionSet.actionSetType].name }}</span>
                </div>
              </div>
              <div class="action-lines">
                <div class="action-line " v-for="(action,actionIndex) in actionSet.actions" :key="actionIndex">
                  <div> {{ action.actionName }}</div>
                  <div>{{ actionSet.standardSetNumber }}组</div>
                  <div v-if="action.unit==='SET'">{{ action.count }}次/组</div>
                  <div v-if="action.unit==='SECOND'">{{ action.time }}秒</div>
                  <div v-if="action.containWeight">{{ action.weight }}kg</div>
                  <div v-if="!action.containWeight">-</div>
                  <div>
                    <span>实际组数</span>
                    <span>{{ actionSet.realSetNumber }}</span>
                  </div>
                </div>
              </div>
              <div class="operation">
                <div class="start-action-set" @click="startCountingPanel(exerciseIndex,actionSetIndex)">
                  开始
                </div>
              </div>
            </div>
            <div class="add-action-set" @click="showAddActionSetDialog(exerciseIndex)">
              <img src="images/classAssignment/add.png" alt="">
              <span @click="showAddActionSetDialog(exerciseIndex)">添加动作</span>
            </div>
          </div>
        </div>
      </div>
      <div class="save-button">
        <div class="save" @click="saveCustomerPlanDay">
          暂存
        </div>
        <div class="finish" @click="toCompleteCustomerPlanDay">
          完成训练
        </div>
      </div>
    </div>
    <transition enter-active-class="animate__fadeIn animate__faster"
                leave-active-class="animate__fadeOut animate__faster"
    >
      <CountingPanel
        :action-set="currentActionSet"
        :customer="customerPlanDay.customer"
        :counting-panel-flag.sync="countingPanelFlag"
        @showTimeoutDialog="showTimeoutDialog"
        class="animate__animated"
        style="z-index: 3000"
        v-if="countingPanelFlag"
      >
      </CountingPanel>
    </transition>

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

    <transition enter-active-class="animate__fadeIn animate__faster"
                leave-active-class="animate__fadeOut animate__faster"
    >
      <SaveFinished
        :save-item-successfully="saveItemSuccessfully"
        :save-item-failed="saveItemFailed"
        :save-dialog-header-image="saveDialogHeaderImage"
        :save-message="saveMessage"
        class="animate__animated"
        style="z-index: 3000"
        v-show="saveDialogFlag"
      ></SaveFinished>
    </transition>

    <transition enter-active-class="animate__slideInDown animate__faster"
                leave-active-class="animate__zoomOut animate__fast">
      <MessageConfirmDialog
        :messageConfirmFlag.sync="messageConfirmFlag"
        :messageConfirm="messageConfirm"
        @messageConfirmMethod="completeCustomerPlanDay"
        class="animate__animated"
        style="z-index: 3000"
        v-show="messageConfirmFlag"
      >
      </MessageConfirmDialog>
    </transition>


    <transition enter-active-class="animate__fadeIn animate__faster"
                leave-active-class="animate__fadeOut animate__faster"
    >
      <ActionListDialog
        :addActionFlag.sync="addActionFlag"
        :actionData="actionData"
        :actionSearchValue.sync="actionSearchValue"
        ref="actionListDialog"
        @addActionSet="addActionSet"
        @loadActionData="loadActionData"
        style="z-index: 3000"
        class="animate__animated"
        v-if="addActionFlag"
      >
      </ActionListDialog>
    </transition>

    <transition enter-active-class="animate__fadeIn animate__faster"
                leave-active-class="animate__fadeOut animate__faster"
    >
      <LoadingData
        :loadingDataFlag.sync="loadingDataFlag"
        class="animate__animated"
        style=" z-index: 6000"
        v-if="loadingDataFlag"
      ></LoadingData>
    </transition>
    <audio src="images/day/timeout.mp3" ref="timeout" controls="controls" loop="false" hidden="true"></audio>
    <transition enter-active-class="animate__fadeIn animate__faster"
                leave-active-class="animate__fadeOut animate__faster"
    >
      <TimeoutAlert
        :timeoutAlertFlag.sync="timeoutAlertFlag"
        @hideTimeoutDialog="hideTimeoutDialog"
        class="animate__animated"
        style=" z-index: 7000"
        v-if="timeoutAlertFlag"
      ></TimeoutAlert>
    </transition>
  </div>
</template>

<script>
import SaveFinished from "components/common/SaveFinished";
import {ActionSetType} from "src/const/classManagement/actionSetType";
import CountingPanel from "components/classAssignment/CountingPanel";
import "./q-input.scss"
import {
  apiCustomerPlanDayDetail,
  apiSaveCustomerPlanDay,
  apiCompleteCustomerPlanDay,
  apiPlanDayOneCustomer
} from "src/api/customerPlanDay";
import AlertMessage from "components/common/AlertMessage";
import {getAge} from "src/util/dateUtil";
import MessageConfirmDialog from "components/common/MessageConfirmDialog";
import ActionListDialog from "components/class/ActionListDialog";
import {apiActionList} from "src/api/action";
import LoadingData from "components/common/LoadingData";
import TimeoutAlert from "components/dialog/TimeoutAlert";
import ClassAssignmentHeader from "components/classAssignment/ClassAssignmentHeader";

export default {
  name: "Index",
  components: {
    SaveFinished,
    CountingPanel,
    AlertMessage,
    MessageConfirmDialog,
    ActionListDialog,
    LoadingData,
    TimeoutAlert,
    ClassAssignmentHeader
  },
  data() {
    return {
      actionSetType: ActionSetType,
      historyClassInfo: [],
      currentClassItem: {},

      //保存的相关属性
      saveDialogFlag: false,
      saveItemSuccessfully: false,
      saveItemFailed: false,
      saveDialogHeaderImage: "images/classAssignment/save-header.jpg",
      saveMessage: "",

      countingPanelFlag: false,
      currentActionSet: {},
      customerPlanDayId: "",
      customerPlanId: "",

      customerPlanDay: {
        customer: {},
        customerPlan: {},
        classInfo: {}
      },

      currentExerciseIndex: -1,
      alertMessage: "",
      alertMessageFlag: false,
      //完成当日训练，弹出确认按钮
      messageConfirmFlag: false,
      messageConfirm: "",

      //添加动作组对话框
      addActionFlag: false,
      actionData: [],
      loadingDataFlag: true,

      actionSearchValue: "",

      classTimeInternal: null,
      remainingMinute: 0,
      remainingSecond: 0,
      redFlag: false,

      timeoutAlertFlag: false
    }
  },
  filters: {
    formatTwoNumber: function (num) {
      if (num < 10) {
        return '0' + num
      }
      return num
    },
    weightEmptyFilter: function (value) {
      if (!value) {
        return "-"
      } else {
        return value + "KG"
      }
    }
  },
  beforeDestroy() {
    if (this.classTimeInternal !== null) {
      clearInterval(this.classTimeInternal)
      this.classTimeInternal = null
    }
  },
  created() {
    if (!this.$route.query.customerPlanDayId) {
      this.alertMessage = "您当前跳转的页面不合法"
      this.alertMessageFlag = true
    } else {
      this.customerPlanDayId = this.$route.query.customerPlanDayId + ""
      this.customerPlanId = this.$route.query.customerPlanId + ""
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
        if (res.data.data && res.data.data.customer && res.data.data.customer.birthday) {
          res.data.data.customer.age = getAge(res.data.data.customer.birthday)
        }
        this.customerPlanDay = res.data.data
        this.computeRemainingTime()
      })
    },
    loadDataCommon() {
      apiPlanDayOneCustomer(this.customerPlanId).then((res) => {
        this.historyClassInfo = res.data.data
        //将课程列表滚动到进行中的那条
        let index = 0;
        if (this.historyClassInfo && this.historyClassInfo.length > 0) {
          this.historyClassInfo.forEach((history, historyIndex) => {
            if (this.customerPlanDayId == history.customerPlanDayId) {
              index = historyIndex
            }
          })
        }
        this.$refs.classAssignmentHeader.scrollToItem(index)
      })
      this.loadActionData()
    },
    loadActionData() {
      apiActionList({searchValue: this.actionSearchValue}).then((res) => {
        res.data.data.forEach((item) => {
          item.actionTypeImageUrl = "img:" + item.actionTypeImageUrl
        })
        this.actionData = res.data.data
      })
    },
    showAddActionSetDialog(exerciseIndex) {
      this.currentExerciseIndex = exerciseIndex
      this.addActionFlag = true;
    },
    startClassInternal() {
      // 开始课程计时
      if (!this.classTimeInternal) {
        this.classTimeInternal = setInterval(this.timer, 1000)
      }
    },
    stopClassInternal() {
      // 暂停课程计时
      if (this.classTimeInternal !== null) {
        clearInterval(this.classTimeInternal)
        this.classTimeInternal = null
      }
    },
    timer() {
      this.customerPlanDay.usedSecond = this.customerPlanDay.usedSecond + 1;
      if (this.customerPlanDay.usedSecond >= 60) {
        this.customerPlanDay.usedSecond = 0;
        this.customerPlanDay.usedMinute = this.customerPlanDay.usedMinute + 1;
      }
      this.computeRemainingTime()
      this.$forceUpdate()
    },
    showTimeoutDialog() {
      this.timeoutAlertFlag = true
      this.playMusic()
    },
    hideTimeoutDialog() {
      this.timeoutAlertFlag = false
      this.stopMusic()
    },
    playMusic() {
      let music = this.$refs.timeout
      music.play();
    },
    stopMusic() {
      let music = this.$refs.timeout
      music.pause();
      music.load();
    },
    computeRemainingTime() {
      let totalTime = this.customerPlanDay.classInfo.duration
      if (!totalTime) {
        totalTime = 60
      }
      this.remainingMinute = parseInt((totalTime * 60 - (this.customerPlanDay.usedMinute * 60 + this.customerPlanDay.usedSecond)) / 60)
      this.remainingSecond = (totalTime * 60 - (this.customerPlanDay.usedMinute * 60 + this.customerPlanDay.usedSecond)) % 60
      if (this.customerPlanDay.usedMinute >= totalTime) {
        this.redFlag = true
      } else {
        this.redFlag = false
      }
    },
    addActionSet(actionSetType) {
      let actionSet = {
        actionSetType: actionSetType,
        sort: this.customerPlanDay.classInfo.exercises[this.currentExerciseIndex].actionSets.length,
        actions: [],
        standardRestInternal: 60,
        realRestInternal: 0,
        realSetNumber: 0
      }
      if (actionSetType === 'COMMON_SET') {
        actionSet.standardSetNumber = 3;
      } else if (actionSetType === 'SUPER_SET') {
        actionSet.standardSetNumber = 1;
      } else if (actionSetType === 'REDUCE_SET') {
        actionSet.standardSetNumber = 3;
        actionSet.standardReduceSetNumber = 3;
        actionSet.realReduceSetNumber = 0;
      }

      this.actionData.forEach((actions) => {
        actions.actions.forEach((action) => {
          if (action.selected) {
            let tempAction = {
              actionId: action.actionId,
              actionName: action.actionName,
              containWeight: action.containWeight,
              unit: action.unit,
              count: 10,
              weight: 10,
              time: 60,
              restInternal: 60,
              status: 0
            }
            actionSet.actions.push(tempAction)
          }
        })
      })
      this.customerPlanDay.classInfo.exercises[this.currentExerciseIndex].actionSets.push(actionSet)
      this.addActionFlag = false
      this.$refs.actionListDialog.initData()
      this.$forceUpdate()
    },
    showSetDetailDialog(exerciseIndex, actionSetIndex) {
      this.currentActionSet = this.customerPlanDay.classInfo.exercises[exerciseIndex].actionSets[actionSetIndex]
      this.setDetailFlag = true;
    },
    startCountingPanel(exerciseIndex, actionSetIndex) {
      this.currentActionSet = this.customerPlanDay.classInfo.exercises[exerciseIndex].actionSets[actionSetIndex]
      this.countingPanelFlag = true;
    },
    saveCustomerPlanDay() {
      this.saveMessage = "\"当日训练信息\"";
      this.saveDialogFlag = true
      apiSaveCustomerPlanDay(this.customerPlanDay).then(() => {
        this.loadData()
        this.saveItemSuccessfully = true
      }).catch(() => {
        this.saveItemFailed = true;
      }).finally(() => {
        this.hideSaveDialog()
      })
    },
    toCompleteCustomerPlanDay() {
      this.messageConfirmFlag = true;
      this.messageConfirm = "您确认要完成当日训练吗";
    },
    completeCustomerPlanDay() {
      this.saveMessage = "\"当日训练信息\"";
      this.saveDialogFlag = true
      apiCompleteCustomerPlanDay(this.customerPlanDay).then((res) => {
        this.saveItemSuccessfully = true
        this.$router.replace({
          path: "/main/classAssignment/summary", query: {
            customerPlanDayId: this.customerPlanDayId,
            customerPlanId: this.customerPlanId
          }
        });
      }).catch(() => {
        this.saveItemFailed = true;
      }).finally(() => {
        this.hideSaveDialog()
      })
    },
    hideSaveDialog() {
      setTimeout(() => {
        this.saveDialogFlag = false
        setTimeout(() => {
          this.saveItemSuccessfully = false
          this.saveItemFailed = false;
        }, 1000)
      }, 800)
    }

  }
}
</script>

<style scoped lang="scss">
#class-assignment-detail-content {
  height: 100%;
  width: 100%;
  position: relative;

  .exercise-detail {
    position: absolute;
    top: 25.4rem;
    left: 0;
    min-height: 30rem;
    width: 100%;
    background-color: #fff;
    border-radius: 1rem 1rem 0 0;
    padding: 4.2rem 1.5rem 2rem 1.5rem;
    z-index: 200;

    .time-operation {
      height: 9rem;
      width: 100%;
      text-align: center;
      display: flex;
      justify-content: center;
      align-items: center;
      border-radius: .3rem;
      position: relative;
      margin-bottom: 3rem;
      background: #F6F7FA;
      padding: 0 3rem 2rem;

      .title-content {
        width: 17rem;
        height: 2.8rem;
        font-size: 1rem;
        color: #fff;
        position: absolute;
        left: 50%;
        margin-left: -8rem;
        top: -4.4rem;

        > img {
          position: absolute;
          left: 0;
          top: 0;
          width: 100%;
          height: 100%;
        }

        display: flex;
        justify-content: center;
        align-items: center;

        p {
          z-index: 200;
          margin: 0;
          font-family: PingFangSC-Semibold, PingFang SC;
          font-weight: 600;
          color: #FFFFFF;
        }
      }

      .time-item {
        width: 50%;
        display: flex;
        justify-content: center;
        align-items: center;
        flex-direction: column;

        h5 {
          font-size: 2.7rem;
          font-family: Staatliches-Regular, Staatliches;
          font-weight: 400;
          margin-bottom: .4rem;
        }

        span {
          font-size: .7rem;
          font-family: PingFangSC-Regular, PingFang SC;
          font-weight: 400;
          color: #59585E;
        }

        .time-red {
          colro: #f33a3a;
        }
      }

      .time-item:nth-child(3) {
        h5 {
          color: $main_yellow;
        }
      }

      .time-button {
        width: 5.4rem;
        height: 5.4rem;
        border-radius: 50%;
        position: absolute;
        left: 50%;
        margin-left: -2.7rem;
        bottom: -2.7rem;
        background-color: #fff;
        display: flex;
        padding: .5rem;

        img {
          height: 100%;
          width: 100%;
        }
      }
    }

    .exercise-item {
      width: 100%;
      height: auto;
      margin: 0 auto .6rem;
      border-radius: .3rem;
      position: relative;
      padding: 1.5rem .6rem 0 .6rem;

      .exercise-item-title {
        width: auto;
        height: 2rem;
        font-size: 1.4rem;
        font-family: PingFangSC-Semibold, PingFang SC;
        font-weight: 600;
        color: $font-black;
        display: flex;
        justify-content: flex-start;
        align-items: center;
        margin-bottom: 1.1rem;

        div {
          width: .2rem;
          height: 1.2rem;
          background: #23262D;
          border-radius: .1rem;
          margin-right: .3rem;
        }
      }

      .tab-content {
        width: 100%;
        height: auto;

        .type-super {
          color: #f33a3a;
        }

        .type-common {
          color: #FFAD2A;
        }

        .type-reduce {
          color: #2dab5b;
        }

        .tab-action-set {
          height: auto;
          background-color: #fff;
          border-radius: .3rem;
          border: .05rem solid #EBECEF;
          margin-bottom: .8rem;
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: .5rem 0;

          .set-type-body {
            color: #fff;
            display: flex;
            justify-content: center;
            align-items: center;
            width: 14%;
            height: 100%;

            .set-type {
              width: 3rem;
              height: 1.2rem;
              display: flex;
              justify-content: center;
              align-items: center;
              position: relative;

              > img {
                width: 100%;
                height: 100%;
                position: absolute;
                left: 0;
                top: 0;
              }

              span {
                z-index: 100;
                font-size: .6rem;
              }
            }
          }

          .action-lines {
            width: 65%;
            display: flex;
            justify-content: center;
            align-items: center;
            flex-direction: column;

            .action-line {
              height: 2.6rem;
              width: 100%;
              display: flex;
              justify-content: flex-start;
              align-items: center;
              font-size: .7rem;
              font-family: PingFangSC-Regular, PingFang SC;
              font-weight: 400;
              text-align: center;
              color: #828386;

              > div:nth-child(1) {
                text-align: left;
                width: 33%;
                font-size: .8rem;
                font-family: PingFangSC-Semibold, PingFang SC;
                font-weight: 600;
                color: $font-black;
              }

              > div:nth-child(2) {
                width: 9%;
              }

              > div:nth-child(3) {
                width: 18%;
              }

              > div:nth-child(4) {
                width: 11%;
              }

              > div:nth-child(5) {
                width: 23%;
                display: flex;
                justify-content: flex-end;
                align-items: center;

                span:nth-child(1) {
                  margin-right: .3rem;
                }

                span:nth-child(2) {
                  font-size: .8rem;
                  font-family: Staatliches-Regular, Staatliches;
                  font-weight: 400;
                  color: #23262D;
                }
              }
            }
          }

          .operation {
            width: 16%;
            display: flex;
            justify-content: center;
            align-items: center;

            .start-action-set {
              display: flex;
              justify-content: center;
              align-items: center;
              width: 2.7rem;
              height: 1.4rem;
              background: rgba(235, 236, 239, 0.5);
              border-radius: .3rem;
              border: .05rem solid #23262D;
              font-size: .7rem;
              font-family: PingFangSC-Regular, PingFang SC;
              font-weight: 400;
              color: $font-black;
            }
          }
        }

        .add-action-set {
          height: 3.6rem;
          background: #FFFFFF;
          border-radius: .3rem;
          border: .05rem solid #EBECEF;
          width: 100%;
          display: flex;
          justify-content: center;
          align-items: center;

          img {
            width: .8rem;
            height: .8rem;
          }

          span {
            font-size: .8rem;
            font-family: PingFangSC-Regular, PingFang SC;
            font-weight: 400;
            color: #ABACB4;
            margin-left: .5rem;
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
      margin-top: 3.2rem;

      .save, .finish {
        width: 12rem;
        height: 3.2rem;
        border-radius: .3rem;
        font-size: 1.2rem;
        font-family: PingFangSC-Semibold, PingFang SC;
        font-weight: 600;
        display: flex;
        justify-content: center;
        align-items: center;
      }

      .save {
        background: #EBECEF;
        color: $font-black;
        margin-right: .9rem;
      }

      .finish {
        color: #fff;
        background: $font-black;
      }
    }
  }

}

</style>
