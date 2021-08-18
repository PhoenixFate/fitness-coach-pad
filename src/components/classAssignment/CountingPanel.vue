<template>
  <div id="counting-panel-content">
    <div class="counting-panel">
      <div class="close-dialog" @click="closeDialog">
        <img src="images/classAssignment/console-close.png" alt="">
      </div>
      <div class="panel-time">
        <div>{{ currentSet.minute|formatTwoNumber }}</div>
        <div>{{ currentSet.second|formatTwoNumber }}</div>
        <div>{{ currentSet.microSecond|formatTwoNumber }}</div>
      </div>
      <div class="panel-set">
        <div class="one-set"
             :class="setIndex===currentSetIndex?'one-set-selected':''"
             v-for="(oneSet,setIndex) in actionSet.oneSets" :key="setIndex" @click="selectSet(setIndex)">
          <img src="images/classAssignment/one-set.png" alt="" v-if="setIndex!==currentSetIndex"
               class="one-set-background">
          <img src="images/classAssignment/one-set-selected.png" alt="" v-if="setIndex===currentSetIndex"
               class="one-set-background">
          <img src="images/classAssignment/one-set-finish.png" alt=""
               v-if="oneSet.status===3 && setIndex!==currentSetIndex" class="one-set-finish">
          <img src="images/classAssignment/one-set-finish-selected.png" alt=""
               v-if="oneSet.status===3 && setIndex===currentSetIndex" class="one-set-finish">
          <span>第{{ oneSet.setIndex }}组</span>
        </div>
      </div>
      <div class="exercise-content">
        <div class="exercise-content-scroll" v-if="currentTab===1">
          <div class="one-action" v-for="(oneSetDetail,detailIndex) in currentSet.oneSetDetails" :key="detailIndex">
            <div class="title" :class="actionSetType[actionSet.actionSetType].activeClass">
              {{ oneSetDetail.action.actionName }}
            </div>
            <div class="complete-one-set" @click="completeAction(detailIndex)">
              <img src="images/classAssignment/action-unfinished.png" alt=""
                   v-if="oneSetDetail.isComplete===0">
              <img src="images/classAssignment/action-finished.png" alt=""
                   v-if="oneSetDetail.isComplete===1">
            </div>
            <div class="operation-line" v-if="oneSetDetail.action.containWeight">
              <div class="left">
                <img src="images/classAssignment/icon-weight.png" alt="">
                <span>推荐重量: </span>
                <span>{{ oneSetDetail.standardWeight |weightEmptyFilter }}kg</span>
              </div>
              <div class="right">
                <div class="buttons-left">
                  <div class="operation-button" @click="addFinishedWeight(-10,detailIndex)">-10</div>
                  <div class="operation-button" @click="addFinishedWeight(-5,detailIndex)">-5</div>
                  <div class="operation-button" @click="addFinishedWeight(-2.5,detailIndex)">-2.5</div>
                </div>
                <div class="current-number">
                  {{ oneSetDetail.realWeight }}
                </div>
                <div class="buttons-right">
                  <div class="operation-button" @click="addFinishedWeight(2.5,detailIndex)">2.5</div>
                  <div class="operation-button" @click="addFinishedWeight(5,detailIndex)">5</div>
                  <div class="operation-button" @click="addFinishedWeight(10,detailIndex)">10</div>
                </div>
              </div>
            </div>
            <div class="operation-line" v-if="oneSetDetail.action.unit==='SET'">
              <div class="left">
                <img src="images/classAssignment/icon-count.png" alt="">
                <span>推荐个数: </span>
                <span>{{ oneSetDetail.standardCount }}个</span>
              </div>
              <div class="right">
                <div class="buttons-left">
                  <div class="operation-button" @click="addFinishedCount(-5,detailIndex)">-5</div>
                  <div class="operation-button" @click="addFinishedCount(-2,detailIndex)">-2</div>
                  <div class="operation-button" @click="addFinishedCount(-1,detailIndex)">-1</div>
                </div>
                <div class="current-number">{{ oneSetDetail.realCount }}</div>
                <div class="buttons-right">
                  <div class="operation-button" @click="addFinishedCount(1,detailIndex)">1</div>
                  <div class="operation-button" @click="addFinishedCount(2,detailIndex)">2</div>
                  <div class="operation-button" @click="addFinishedCount(5,detailIndex)">5</div>
                </div>
              </div>
            </div>
            <div class="operation-line" v-if="oneSetDetail.action.unit==='SECOND'">
              <div class="left">
                <img src="images/classAssignment/icon-count.png" alt="">
                <span>推荐时长: </span>
                <span>{{ oneSetDetail.standardTime }}秒</span>
              </div>
              <div class="right">
                <div class="buttons-left">
                  <div class="operation-button" @click="addFinishedTime(-30,detailIndex)">-30</div>
                  <div class="operation-button" @click="addFinishedTime(-10,detailIndex)">-10</div>
                  <div class="operation-button" @click="addFinishedTime(-1,detailIndex)">-1</div>
                </div>
                <div class="current-number">{{ oneSetDetail.realTime }}</div>
                <div class="buttons-right">
                  <div class="operation-button" @click="addFinishedTime(1,detailIndex)">1</div>
                  <div class="operation-button" @click="addFinishedTime(10,detailIndex)">10</div>
                  <div class="operation-button" @click="addFinishedTime(30,detailIndex)">30</div>
                </div>
              </div>
            </div>
            <div class="item-counter" v-if="oneSetDetail.action.unit==='SECOND'">
              <span>单项计时: </span>
              <span>{{ oneSetDetail.realTime }}</span>
              <span>秒</span>
              <div class="start"
                   v-if="currentSet.status===1 && !oneItemCounterInternal"
                   @click="startOneItemCounter(0)">
            <span
              v-if="oneSetDetail.realTime===0">开始</span>
                <span
                  v-if="oneSetDetail.realTime!==0">继续</span>
              </div>
              <div class="start gray"
                   v-if="currentSet.status!==1 || oneItemCounterInternal"
              >
            <span
              v-if="oneSetDetail.realTime===0">开始</span>
                <span
                  v-if="oneSetDetail.realTime!==0">继续</span>
              </div>
              <div class="stop"
                   v-if="currentSet.status===1 && oneItemCounterInternal"
                   @click="stopOneItemCounter(0)">
                暂停
              </div>
              <div class="stop gray"
                   v-if="currentSet.status!==1 || !oneItemCounterInternal"
              >
                暂停
              </div>
            </div>
          </div>
        </div>
        <div class="rest-content" v-if="currentTab===2">
          <img src="images/classAssignment/rest-male.png" alt="" v-if="customer.gender===1">
          <img src="images/classAssignment/rest-female.png" alt="" v-if="customer.gender===2">
          <p v-if="restTime>0">推荐间歇: <span>{{ restTime }}</span>s</p>
          <p v-if="restTime<=0">已经休息了: <span style="color: #f34644;">{{runningSet.realRestTime }}</span>s</p>
        </div>
      </div>

      <!--<div class="exercise-content-big"-->
      <!--     v-if="actionSet.actionSetType==='SUPER_SET' && currentTab===1">-->
      <!--  <div class="exercise-content-item" v-for="(oneSetDetail,actionIndex) in currentSet.oneSetDetails"-->
      <!--       :key="actionIndex">-->
      <!--    <div class="title">{{ actionSet.actions[actionIndex].actionName }}</div>-->
      <!--    <div class="operation-line" v-if="actionSet.actions[actionIndex].containWeight">-->
      <!--      <div class="left">-->
      <!--        <span>推荐重量: </span>-->
      <!--        <span>{{ oneSetDetail.standardWeight |weightEmptyFilter }}</span>-->
      <!--      </div>-->
      <!--      <div class="right">-->
      <!--        <span>完成重量: </span>-->
      <!--        <div class="operation-detail">-->
      <!--          <div class="buttons-left">-->
      <!--            <div class="operation-button" @click="addFinishedWeight(-10,actionIndex)">-10</div>-->
      <!--            <div class="operation-button" @click="addFinishedWeight(-5,actionIndex)">-5</div>-->
      <!--            <div class="operation-button" @click="addFinishedWeight(-2.5,actionIndex)">-2.5</div>-->
      <!--          </div>-->
      <!--          <div class="current-number">-->
      <!--            {{ oneSetDetail.realWeight }}KG-->
      <!--          </div>-->
      <!--          <div class="buttons-right">-->
      <!--            <div class="operation-button" @click="addFinishedWeight(2.5,actionIndex)">2.5</div>-->
      <!--            <div class="operation-button" @click="addFinishedWeight(5,actionIndex)">5</div>-->
      <!--            <div class="operation-button" @click="addFinishedWeight(10,actionIndex)">10</div>-->
      <!--          </div>-->
      <!--        </div>-->
      <!--      </div>-->
      <!--    </div>-->
      <!--    <div class="operation-line" v-if="actionSet.actions[actionIndex].unit==='SET'">-->
      <!--      <div class="left">-->
      <!--        <span>推荐个数: </span>-->
      <!--        <span>{{ actionSet.actions[actionIndex].count }}个</span>-->
      <!--      </div>-->
      <!--      <div class="right">-->
      <!--        <span>完成个数: </span>-->
      <!--        <div class="operation-detail">-->
      <!--          <div class="buttons-left">-->
      <!--            <div class="operation-button" @click="addFinishedCount(-5,actionIndex)">-5</div>-->
      <!--            <div class="operation-button" @click="addFinishedCount(-2,actionIndex)">-2</div>-->
      <!--            <div class="operation-button" @click="addFinishedCount(-1,actionIndex)">-1</div>-->
      <!--          </div>-->
      <!--          <div class="current-number">-->
      <!--            {{ oneSetDetail.realCount }}个-->
      <!--          </div>-->
      <!--          <div class="buttons-right">-->
      <!--            <div class="operation-button" @click="addFinishedCount(1,actionIndex)">1</div>-->
      <!--            <div class="operation-button" @click="addFinishedCount(2,actionIndex)">2</div>-->
      <!--            <div class="operation-button" @click="addFinishedCount(5,actionIndex)">5</div>-->
      <!--          </div>-->
      <!--          <div class="complete-one-set" @click="completeAction(actionIndex)">-->
      <!--            <img src="images/day/complete-gray.png" alt=""-->
      <!--                 v-if="oneSetDetail.isComplete===0">-->
      <!--            <img src="images/day/complete-green.png" alt=""-->
      <!--                 v-if="oneSetDetail.isComplete===1">-->
      <!--          </div>-->
      <!--        </div>-->
      <!--      </div>-->
      <!--    </div>-->
      <!--    <div class="operation-line" v-if="actionSet.actions[actionIndex].unit==='SECOND'">-->
      <!--      <div class="left">-->
      <!--        <span>推荐时长: </span>-->
      <!--        <span>{{ actionSet.actions[actionIndex].time }}秒</span>-->
      <!--      </div>-->
      <!--      <div class="right">-->
      <!--        <span>完成时长: </span>-->
      <!--        <div class="operation-detail">-->
      <!--          <div class="buttons-left">-->
      <!--            <div class="operation-button" @click="addFinishedTime(-30,actionIndex)">-30</div>-->
      <!--            <div class="operation-button" @click="addFinishedTime(-10,actionIndex)">-10</div>-->
      <!--            <div class="operation-button" @click="addFinishedTime(-1,actionIndex)">-1</div>-->
      <!--          </div>-->
      <!--          <div class="current-number">-->
      <!--            {{ oneSetDetail.realTime }}秒-->
      <!--          </div>-->
      <!--          <div class="buttons-right">-->
      <!--            <div class="operation-button" @click="addFinishedTime(1,actionIndex)">1</div>-->
      <!--            <div class="operation-button" @click="addFinishedTime(10,actionIndex)">10</div>-->
      <!--            <div class="operation-button" @click="addFinishedTime(30,actionIndex)">30</div>-->
      <!--          </div>-->
      <!--        </div>-->
      <!--      </div>-->
      <!--    </div>-->
      <!--    <div class="item-counter" v-if="actionSet.actions[actionIndex].unit==='SECOND'">-->
      <!--      <span>单项计时: </span>-->
      <!--      <span>{{ oneSetDetail.realTime }}</span>-->
      <!--      <span>秒</span>-->
      <!--      <div class="start"-->
      <!--           v-if="currentSet.status===1 && !oneItemCounterInternal"-->
      <!--           @click="startOneItemCounter(actionIndex)">-->
      <!--      <span-->
      <!--        v-if="oneSetDetail.realTime===0">开始</span>-->
      <!--        <span-->
      <!--          v-if="oneSetDetail.realTime!==0">继续</span>-->
      <!--      </div>-->
      <!--      <div class="start gray"-->
      <!--           v-if="currentSet.status!==1 || oneItemCounterInternal"-->
      <!--      >-->
      <!--      <span-->
      <!--        v-if="oneSetDetail.realTime===0">开始</span>-->
      <!--        <span-->
      <!--          v-if="oneSetDetail.realTime!==0">继续</span>-->
      <!--      </div>-->
      <!--      <div class="stop"-->
      <!--           v-if="currentSet.status===1 && oneItemCounterInternal && actionIndex===currentActionIndex"-->
      <!--           @click="stopOneItemCounter(actionIndex)">-->
      <!--        暂停-->
      <!--      </div>-->
      <!--      <div class="stop gray"-->
      <!--           v-if="currentSet.status!==1 || !oneItemCounterInternal || actionIndex!==currentActionIndex"-->
      <!--      >-->
      <!--        暂停-->
      <!--      </div>-->
      <!--    </div>-->
      <!--  </div>-->

      <!--</div>-->

      <!--<div class="exercise-content-reduce"-->
      <!--     v-if="actionSet.actionSetType==='REDUCE_SET' && currentTab===1">-->


      <!--  <div class="title">{{ actionSet.actions[0].actionName }}</div>-->
      <!--  <div class="reduce-content">-->
      <!--    <div class="reduce-content-item" v-for="(oneSetDetail,detailIndex) in currentSet.oneSetDetails"-->
      <!--         :key="detailIndex">-->
      <!--      <div class="operation-line" v-if="actionSet.actions[0].containWeight">-->
      <!--        <div class="left">-->
      <!--          <span>推荐重量: </span>-->
      <!--          <span>{{ oneSetDetail.standardWeight |weightEmptyFilter }}</span>-->
      <!--        </div>-->
      <!--        <div class="right">-->
      <!--          <span>完成重量: </span>-->
      <!--          <div class="operation-detail">-->
      <!--            <div class="buttons-left">-->
      <!--              <div class="operation-button" @click="addFinishedWeightReduceSet(-10,detailIndex)">-10</div>-->
      <!--              <div class="operation-button" @click="addFinishedWeightReduceSet(-5,detailIndex)">-5</div>-->
      <!--              <div class="operation-button" @click="addFinishedWeightReduceSet(-2.5,detailIndex)">-2.5</div>-->
      <!--            </div>-->
      <!--            <div class="current-number">-->
      <!--              {{ oneSetDetail.realWeight }}KG-->
      <!--            </div>-->
      <!--            <div class="buttons-right">-->
      <!--              <div class="operation-button" @click="addFinishedWeightReduceSet(2.5,detailIndex)">2.5</div>-->
      <!--              <div class="operation-button" @click="addFinishedWeightReduceSet(5,detailIndex)">5</div>-->
      <!--              <div class="operation-button" @click="addFinishedWeightReduceSet(10,detailIndex)">10</div>-->
      <!--            </div>-->
      <!--          </div>-->
      <!--        </div>-->
      <!--      </div>-->
      <!--      <div class="operation-line" v-if="actionSet.actions[0].unit==='SET'">-->
      <!--        <div class="left">-->
      <!--          <span>推荐个数: </span>-->
      <!--          <span>{{ oneSetDetail.standardCount }}个</span>-->
      <!--        </div>-->
      <!--        <div class="right">-->
      <!--          <span>完成个数: </span>-->
      <!--          <div class="operation-detail">-->
      <!--            <div class="buttons-left">-->
      <!--              <div class="operation-button" @click="addFinishedCountReduceSet(-5,detailIndex)">-5</div>-->
      <!--              <div class="operation-button" @click="addFinishedCountReduceSet(-2,detailIndex)">-2</div>-->
      <!--              <div class="operation-button" @click="addFinishedCountReduceSet(-1,detailIndex)">-1</div>-->
      <!--            </div>-->
      <!--            <div class="current-number">-->
      <!--              {{ oneSetDetail.realCount }}个-->
      <!--            </div>-->
      <!--            <div class="buttons-right">-->
      <!--              <div class="operation-button" @click="addFinishedCountReduceSet(1,detailIndex)">1</div>-->
      <!--              <div class="operation-button" @click="addFinishedCountReduceSet(2,detailIndex)">2</div>-->
      <!--              <div class="operation-button" @click="addFinishedCountReduceSet(5,detailIndex)">5</div>-->
      <!--            </div>-->
      <!--          </div>-->
      <!--        </div>-->
      <!--      </div>-->
      <!--      <div class="operation-line" v-if="actionSet.actions[0].unit==='SECOND'">-->
      <!--        <div class="left">-->
      <!--          <span>推荐时长: </span>-->
      <!--          <span>{{ oneSetDetail.standardTime }}秒</span>-->
      <!--        </div>-->
      <!--        <div class="right">-->
      <!--          <span>完成时长: </span>-->
      <!--          <div class="operation-detail">-->
      <!--            <div class="buttons-left">-->
      <!--              <div class="operation-button" @click="addFinishedTimeReduceSet(-30,detailIndex)">-30</div>-->
      <!--              <div class="operation-button" @click="addFinishedTimeReduceSet(-10,detailIndex)">-10</div>-->
      <!--              <div class="operation-button" @click="addFinishedTimeReduceSet(-1,detailIndex)">-1</div>-->
      <!--            </div>-->
      <!--            <div class="current-number">-->
      <!--              {{ oneSetDetail.realTime }}秒-->
      <!--            </div>-->
      <!--            <div class="buttons-right">-->
      <!--              <div class="operation-button" @click="addFinishedTimeReduceSet(1,detailIndex)">1</div>-->
      <!--              <div class="operation-button" @click="addFinishedTimeReduceSet(10,detailIndex)">10</div>-->
      <!--              <div class="operation-button" @click="addFinishedTimeReduceSet(30,detailIndex)">30</div>-->
      <!--            </div>-->
      <!--          </div>-->
      <!--        </div>-->
      <!--      </div>-->

      <!--      <div class="operation-divider"></div>-->
      <!--    </div>-->
      <!--    <div class="add-reduce-one-set-detail" @click="manualAddReduceOneDetail">-->
      <!--      <div>添加递减一组</div>-->
      <!--    </div>-->
      <!--  </div>-->
      <!--</div>-->


      <div class="bottom-tab">
        <div class="circle-click" @click="tabClick(1)">
          <div class="circle">
            <div v-if="currentTab===1"></div>
          </div>
        </div>
        <div class="circle-click" @click="tabClick(2)">
          <div class="circle">
            <div v-if="currentTab===2"></div>
          </div>
        </div>
      </div>

      <div class="bottom-buttons">
        <div class="buttons-left">
          <div class="start" @click="startSet" v-if="currentSet.status===0 && currentTab===1 && !counterInternal">开始
          </div>
          <div class="start" @click="stopSet" v-if="currentSet.status===1">暂停</div>
          <div class="start" @click="startSet" v-if="currentSet.status===2">继续</div>
          <div class="start start-finished"
               v-if="currentSet.status===3 || (currentTab===2 && currentSet.status===0) || (currentTab===1 && currentSet.status===0 && counterInternal)">
            开始
          </div>
        </div>
        <div class="buttons-middle" @click="showRecordImage">
          <img src="images/day/record.png" alt="">
        </div>
        <div class="buttons-right">
          <div class="finish-set" @click="finishSet" v-if="currentSet.status===1 || currentSet.status===2">
            结束当前组
          </div>
          <div class="finish-set-finished" v-if="currentSet.status===0 || currentSet.status===3">
            结束当前组
          </div>
        </div>
      </div>
    </div>

    <RecordImage
      :recordImageFlag.sync="recordImageFlag"
      :imageUrls="actionSet.imageUrls"
      @uploadCustomerImage="uploadCustomerImage"
      style="z-index: 3000"
      v-if="recordImageFlag"
    >
    </RecordImage>
    <input style="display: none" type="file" ref="refUploadFile" accept="image/*" @change="readLocalFile">
  </div>
</template>

<script>
import {ActionSetType} from "src/const/classManagement/actionSetType";
import RecordImage from "components/common/RecordImage";
import {apiUploadImage} from "src/api/upload";

export default {
  name: "CountingPanel",
  components: {RecordImage},
  data() {
    return {
      currentTab: 1,
      currentActionIndex: -1,
      actionSetType: ActionSetType,
      counterInternal: null,
      currentSet: {},
      runningSet: null,
      restTime: 0,
      restTimeInternal: null,
      currentSetIndex: 0,
      minSetCount: 0,
      //单项计时
      oneItemCounterFlag: false,
      oneItemCounterInternal: null,
      oneItemRunningSet: null,
      recordImageFlag: false,
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
        return value
      }
    }
  },
  beforeDestroy() {
    if (this.counterInternal !== null) {
      clearInterval(this.counterInternal)
      this.counterInternal = null
    }
    if (this.restTimeInternal !== null) {
      clearInterval(this.restTimeInternal)
      this.restTimeInternal = null
    }
    if (this.oneItemCounterInternal != null) {
      this.currentActionIndex = -1
      clearInterval(this.oneItemCounterInternal)
      this.oneItemCounterInternal = null
    }
    if (this.runningSet.status === 1) {
      this.runningSet.status = 2;
    }
  },
  beforeMount() {
    console.log(this.customer)
    //currentSet.status
    //0: 未开始
    //1：正在进行
    //2：已暂停
    //3：已完成
    if (!this.actionSet.oneSets || this.actionSet.oneSets.length === 0) {
      let oneSets = []
      for (let i = 0; i < this.actionSet.standardSetNumber; i++) {
        let oneSet = this.addOneSet(i)
        oneSets.push(oneSet)
      }
      this.actionSet.oneSets = oneSets
    }
    this.currentActionIndex = -1
    this.currentSet = this.actionSet.oneSets[0]
    this.restTime = this.actionSet.standardRestInternal
    this.runningSet = this.currentSet

    console.log(this.currentSet)
  },
  props: {
    actionSet: Object,
    customer: Object,
    countingPanelFlag: Boolean,
  },
  methods: {
    reduceCount(count, index) {
      if (count - 0.2 * index * count < 1) {
        return 1
      }
      return parseInt(count - 0.2 * index * count);
    },
    addOneSet(oneSetIndex) {
      let oneSet = {
        setIndex: oneSetIndex + 1,
        realTime: 0,
        status: 0,
        minute: 0,
        second: 0,
        microSecond: 0,
        realRestTime: 0,
        oneSetDetails: []
      }
      let oneSetDetails = [];
      if (this.actionSet.actionSetType === 'COMMON_SET' || this.actionSet.actionSetType === 'SUPER_SET') {
        this.actionSet.actions.forEach((action, actionIndex) => {
          let oneSetDetail = {
            detailIndex: actionIndex + 1,
            actionId: action.actionId,
            action: action,
            isComplete: 0
          }
          if (action.unit === 'SET') {
            oneSetDetail.standardCount = action.count;
            oneSetDetail.realCount = action.count;
          } else if (action.unit === 'SECOND') {
            oneSetDetail.standardTime = action.time;
            oneSetDetail.realTime = 0;
          }
          if (action.containWeight === 1) {
            oneSetDetail.standardWeight = action.weight;
            oneSetDetail.realWeight = action.weight;
          }
          oneSetDetails.push(oneSetDetail)
        })
      } else if (this.actionSet.actionSetType === 'REDUCE_SET') {
        //递减组生成详细的数据
        for (let i = 0; i < this.actionSet.standardReduceSetNumber; i++) {
          let oneSetDetail = {
            detailIndex: i + 1,
            actionId: this.actionSet.actions[0].actionId,
            action: this.actionSet.actions[0],
            standardCount: this.reduceCount(this.actionSet.actions[0].count, i),
            realCount: this.reduceCount(this.actionSet.actions[0].count, i),
            standardWeight: this.reduceCount(this.actionSet.actions[0].weight, i),
            standardTime: this.reduceCount(this.actionSet.actions[0].time, i),
            realTime: this.reduceCount(this.actionSet.actions[0].time, i),
            isComplete: 0
          }
          //默认实际重量为推荐重量
          if (this.actionSet.actions[0].containWeight) {
            oneSetDetail.realWeight = this.reduceCount(this.actionSet.actions[0].weight, i)
          }
          oneSetDetails.push(oneSetDetail)
        }
      }
      oneSet.oneSetDetails = oneSetDetails
      return oneSet
    },
    selectSet(setIndex) {
      this.currentSetIndex = setIndex
      this.currentSet = this.actionSet.oneSets[setIndex]
    },
    showRecordImage() {
      this.recordImageFlag = true
    },
    uploadCustomerImage() {
      this.$refs.refUploadFile.value = ''
      this.$refs.refUploadFile.click();
    },
    startOneItemCounter(actionIndex) {
      if (this.oneItemCounterInternal == null) {
        this.currentActionIndex = actionIndex
        this.oneItemRunningSet = this.actionSet.oneSets[this.currentSetIndex].oneSetDetails[actionIndex]
        this.oneItemCounterInternal = setInterval(() => {
          console.log("one item counter")
          this.oneItemRunningSet.realTime += 1
        }, 1000)
      }
    },
    stopOneItemCounter(actionIndex) {
      if (actionIndex !== this.currentActionIndex) {
        return
      }
      if (this.oneItemCounterInternal != null) {
        this.currentActionIndex = -1
        clearInterval(this.oneItemCounterInternal)
        this.oneItemCounterInternal = null
      }
    },
    addFinishedWeight(weight, actionIndex) {
      let currentWeight = parseFloat(this.actionSet.oneSets[this.currentSetIndex].oneSetDetails[actionIndex].realWeight)
      if ((currentWeight + weight) <= 0) {
        return
      }
      this.actionSet.oneSets[this.currentSetIndex].oneSetDetails[actionIndex].realWeight = currentWeight + weight
      this.$forceUpdate()
    },
    //点击上传图片
    readLocalFile() {
      let file = this.$refs.refUploadFile.files[0]
      let params = new FormData()  // 创建form对象
      params.append('file', file)  // 通过append向form对象添加数据
      params.append('prefix', 'customerPlanDay') // 添加form表单中其他数据
      apiUploadImage(params).then((res) => {
        this.actionSet.imageUrls.push(res.data.data)
      })
    },
    completeAction(actionIndex) {
      if (this.actionSet.oneSets[this.currentSetIndex].oneSetDetails[actionIndex].isComplete === 0) {
        this.actionSet.oneSets[this.currentSetIndex].oneSetDetails[actionIndex].isComplete = 1
      } else {
        this.actionSet.oneSets[this.currentSetIndex].oneSetDetails[actionIndex].isComplete = 0
      }
    },
    addFinishedCount(count, actionIndex) {
      let currentCount = parseInt(this.actionSet.oneSets[this.currentSetIndex].oneSetDetails[actionIndex].realCount)
      if ((currentCount + count) <= 0) {
        return
      }
      this.actionSet.oneSets[this.currentSetIndex].oneSetDetails[actionIndex].realCount = currentCount + count
      this.$forceUpdate()
    },

    addFinishedTime(time, actionIndex) {
      let currentTime = parseInt(this.actionSet.oneSets[this.currentSetIndex].oneSetDetails[actionIndex].realTime)
      if ((currentTime + time) <= 0) {
        return
      }
      this.actionSet.oneSets[this.currentSetIndex].oneSetDetails[actionIndex].realTime = currentTime + time
      this.$forceUpdate()
    },

    addFinishedWeightReduceSet(weight, detailIndex) {
      let currentWeight = parseInt(this.currentSet.oneSetDetails[detailIndex].realWeight)
      if (currentWeight + weight <= 0) {
        return
      }
      this.currentSet.oneSetDetails[detailIndex].realWeight = currentWeight + weight
      this.$forceUpdate()
    },

    addFinishedCountReduceSet(count, detailIndex) {
      let currentCount = parseInt(this.currentSet.oneSetDetails[detailIndex].realCount)
      if (currentCount + count <= 0) {
        return
      }
      this.currentSet.oneSetDetails[detailIndex].realCount = currentCount + count
      this.$forceUpdate()
    },

    addFinishedTimeReduceSet(time, detailIndex) {
      let currentTime = parseInt(this.currentSet.oneSetDetails[detailIndex].realTime)
      if (currentTime + time <= 0) {
        return
      }
      this.currentSet.oneSetDetails[detailIndex].realTime = currentTime + time
      this.$forceUpdate()
    },

    manualAddReduceOneDetail() {
      //手动添加新的递减组里面的一个详情
      let oneSetDetail = {
        actionId: this.actionSet.actions[0].actionId,
        action: this.actionSet.actions[0],
        detailIndex: this.currentSet.oneSetDetails.length + 1,
        standardCount: this.reduceCount(this.actionSet.actions[0].count, this.currentSet.oneSetDetails.length),
        realCount: this.reduceCount(this.actionSet.actions[0].count, this.currentSet.oneSetDetails.length),
        standardTime: this.reduceCount(this.actionSet.actions[0].time, this.currentSet.oneSetDetails.length),
        realTime: this.reduceCount(this.actionSet.actions[0].time, this.currentSet.oneSetDetails.length),
        isComplete: 0
      }
      //默认实际重量为推荐重量*系数
      if (this.actionSet.actions[0].containWeight) {
        oneSetDetail.standardWeight = this.reduceCount(this.actionSet.actions[0].weight, this.currentSet.oneSetDetails.length);
        oneSetDetail.realWeight = this.reduceCount(this.actionSet.actions[0].weight, this.currentSet.oneSetDetails.length)
      }
      this.currentSet.oneSetDetails.push(oneSetDetail)
    },

    startSet() {
      this.currentSet.status = 1
      this.runningSet = this.currentSet
      this.counterInternal = setInterval(this.timer, 10)
      if (this.restTimeInternal != null) {
        clearInterval(this.restTimeInternal)
        this.restTime = this.actionSet.standardRestInternal
      }
    },
    stopSet() {
      if (this.counterInternal !== null) {
        clearInterval(this.counterInternal)
        this.counterInternal = null
      }
      if (this.oneItemCounterInternal != null) {
        clearInterval(this.oneItemCounterInternal)
        this.oneItemCounterInternal = null
      }
      this.runningSet.status = 2;
    },
    finishSet() {
      if (this.counterInternal != null) {
        clearInterval(this.counterInternal)
        this.counterInternal = null
      }
      //用于超时提醒，只提醒一次
      this.actionSet.alertOneTime = true

      let finishedSetNumber = 0
      this.actionSet.oneSets.forEach((oneSet) => {
        if (oneSet.status === 3) {
          finishedSetNumber += 1
        }
      })
      this.actionSet.realSetNumber = finishedSetNumber + 1

      if (this.currentSetIndex === this.actionSet.oneSets.length - 1) {
        //若完成最后一组，自动添加一组
        let oneSet = this.addOneSet(this.actionSet.oneSets.length);
        this.actionSet.oneSets.push(oneSet)
      }
      this.runningSet.status = 3;
      this.currentSetIndex += 1
      this.currentSet = this.actionSet.oneSets[this.currentSetIndex]
      //休息倒计时
      this.currentTab = 2;
      if (this.restTimeInternal != null) {
        clearInterval(this.restTimeInternal)
      }
      this.restTime = this.actionSet.standardRestInternal
      this.restTimeInternal = setInterval(() => {
        this.runningSet.realRestTime += 1;
        this.restTime -= 1;
        if (this.restTime <= -10 && this.actionSet.alertOneTime) {
          //超时提醒
          this.$emit("showTimeoutDialog")
          this.actionSet.alertOneTime = false
        }
      }, 1000)

      if (this.oneItemCounterInternal != null) {
        this.currentActionIndex = -1
        clearInterval(this.oneItemCounterInternal)
        this.oneItemCounterInternal = null
      }

      //滚动到组列表到底部
      // this.$nextTick(() => {
      //   this.$refs.actionSetDiv.scrollTop = this.$refs.actionSetDiv.scrollHeight;
      //   console.log(this.$refs.actionSetDiv.scrollHeight)
      //   this.$forceUpdate()
      // })
    },
    tabClick(index) {
      this.currentTab = index;
    },
    closeDialog() {
      this.$emit("update:countingPanelFlag", false)
    },
    timer() {
      this.runningSet.microSecond = this.runningSet.microSecond + 1;
      if (this.runningSet.microSecond >= 100) {
        this.runningSet.microSecond = 0;
        this.runningSet.second = this.runningSet.second + 1;
      }
      if (this.runningSet.second >= 60) {
        this.runningSet.second = 0;
        this.runningSet.minute = this.runningSet.minute + 1;
      }
      this.$forceUpdate()
    }
  }
}
</script>

<style scoped lang="scss">
#counting-panel-content {
  z-index: 10;
  position: relative;

  .counting-panel {
    position: fixed;
    width: 100%;
    height: 100vh;
    top: 0;
    left: 0;
    background-color: #fff;
    padding: 9vh 1.2rem 2rem 1.2rem;
    z-index: 2010;
    overflow: hidden;
    background-image: url("../../assets/images/classAssignment/console-background.png");
    background-size: 100% 100%;

    .panel-time {
      height: 5.2rem;
      width: 29rem;
      margin: 0 auto 2vh;
      background-image: url("../../assets/images/classAssignment/counter-background.png");
      background-size: 100% 100%;
      position: relative;

      div {
        width: 5rem;
        height: 4rem;
        display: flex;
        justify-content: center;
        align-items: center;
        font-size: 4rem;
        font-family: Staatliches-Regular, Staatliches;
        font-weight: 400;
        color: #FFFFFF;
        position: absolute;
        top: .7rem;
      }

      div:nth-child(1) {
        left: 5.55rem;
      }

      div:nth-child(2) {
        left: 12.05rem;
      }

      div:nth-child(3) {
        left: 18.65rem;
      }
    }

    .close-dialog {
      position: absolute;
      width: 2.4rem;
      height: 2.4rem;
      right: 1.7rem;
      top: 1rem;
      display: flex;
      justify-content: center;
      align-items: center;

      img {
        width: 100%;
        height: 100%;
      }
    }

    .panel-set {
      width: 100%;
      height: 2.4rem;
      overflow-x: scroll;
      display: flex;
      flex-wrap: nowrap;

      .one-set {
        height: 2.4rem;
        width: 5.5rem;
        display: flex;
        justify-content: center;
        align-items: center;
        position: relative;
        margin-right: .9rem;
        font-size: .9rem;
        font-family: PingFangSC-Semibold, PingFang SC;
        font-weight: 600;
        color: #FFFFFF;

        .one-set-background {
          width: 100%;
          height: 100%;
          position: absolute;
          left: 0;
          top: 0
        }

        .one-set-finish {
          width: .9rem;
          height: .9rem;
          z-index: 100;
          margin-right: .3rem;
          margin-left: -.3rem;
        }
      }

      .one-set-selected {
        span {
          color: $font-black;
          z-index: 100;
        }
      }
    }


    .exercise-content {
      height: 54vh;
      margin-top: 1rem;
      border-radius: .3rem;
      position: relative;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      background-color: #fff;
      padding: 1.2rem;

      .exercise-content-scroll {
        height: 100%;
        width: 100%;
        overflow-y: scroll;

        .one-action {
          height: auto;
          width: 100%;
          position: relative;
          border-radius: .3rem;
          border: .05rem solid #EBECEF;
          padding: 1.6rem 2rem .5rem 1rem;
          margin-bottom: .9rem;

          .title {
            width: auto;
            height: 1.5rem;
            position: absolute;
            padding: 0 1rem;
            left: 0;
            top: 0;
            font-size: .8rem;
            font-weight: bold;
            display: flex;
            justify-content: center;
            align-items: center;
            border-radius: .3rem 0 .8rem 0;
          }

          .type-common {
            background-color: $common-set-bg;
            color: $common-set;
          }

          .type-super {
            background-color: $super-set-bg;
            color: $super-set;
          }

          .type-reduce {
            background-color: $reduce-set-bg;
            color: $reduce-set;
          }

          .complete-one-set {
            position: absolute;
            right: -.05rem;
            top: -.05rem;
            width: 1.9rem;
            height: 1.5rem;

            img {
              width: 100%;
              height: 100%;
            }
          }

          .operation-line {
            height: 3rem;
            width: 100%;
            display: flex;
            justify-content: space-between;
            align-items: center;
            font-size: .8rem;

            .left {
              width: 30%;
              display: flex;
              justify-content: flex-start;
              align-items: center;
              font-size: .7rem;
              font-family: PingFangSC-Regular, PingFang SC;
              font-weight: 400;
              color: #828386;

              img {
                height: 1.2rem;
                width: 1.2rem;
                margin-right: .4rem;
              }

              span:nth-child(2) {
                margin-right: .4rem;
              }
            }

            .right {
              width: 70%;
              display: flex;
              justify-content: space-between;

              .buttons-left, .buttons-right {
                display: flex;
                align-items: center;

                .operation-button {
                  height: 2.2rem;
                  border-radius: .3rem;
                  border: .1rem solid #D1D1D7;
                  width: 2.2rem;
                  display: flex;
                  justify-content: center;
                  align-items: center;
                  font-size: 1.1rem;
                  font-family: Staatliches-Regular, Staatliches;
                  font-weight: 400;
                  color: #D1D1D7;
                  margin-right: .8rem;
                }

                .operation-button:last-child {
                  margin-right: 0;
                }
              }

              .current-number {
                width: 3.4rem;
                text-align: center;
                display: flex;
                justify-content: center;
                align-items: center;
                font-size: 1.8rem;
                font-family: Staatliches-Regular, Staatliches;
                font-weight: 400;
                color: $font-black;
              }
            }
          }
        }
      }
      .rest-content {
        width: 100%;
        height: 100%;
        position: relative;
        display: flex;
        flex-direction: column;
        justify-content: flex-end;
        align-items: center;
        padding-bottom: 2vh;
        img {
          height: 70%;
          width: auto;
        }
        p {
          margin: 2rem 0 0 0 ;
          font-size: 1rem;
          font-family: PingFangSC-Regular, PingFang SC;
          font-weight: 400;
          color: #828386;
        }
      }

      .item-counter {
        height: 4.4rem;
        width: 100%;
        display: flex;
        justify-content: flex-start;
        align-items: center;
        font-size: .8rem;
        padding-left: 9rem;

        > span:nth-child(1) {
          margin-right: 2rem;
        }

        > span:nth-child(2) {
          font-size: 1.3rem;
          color: #2dab5b;
          font-weight: bold;
          margin-top: -.2rem;
          margin-right: .2rem;
          width: 2.4rem;
          text-align: center;
        }

        .start, .stop {
          width: 2.6rem;
          height: 2.6rem;
          border-radius: 50%;
          color: #fff;
          display: flex;
          justify-content: center;
          align-items: center;
          font-weight: bold;
          font-size: .7rem;

        }

        .start {
          background-color: #0e9d43;
          margin-left: 2rem;
          margin-right: 3.3rem;
        }

        .stop {
          background-color: #eca656;
        }

        .gray {
          background-color: #999;
        }
      }

    }


    .exercise-content-big {
      height: 30vh;
      overflow-y: scroll;
      margin-top: .5rem;

      .exercise-content-item {
        height: 7rem;
        margin-top: 1rem;
        border-radius: .3rem;
        border: 1px solid #3d79e0;
        position: relative;
        display: flex;
        justify-content: center;
        align-items: center;
        flex-direction: column;

        .title {
          width: auto;
          height: 1.5rem;
          position: absolute;
          padding: 0 1rem;
          left: 10%;
          top: -.7rem;
          font-size: .9rem;
          font-weight: bold;
          text-align: center;
          border-radius: .2rem;
          background-color: #3d79e0;
          color: #fff;
        }

        .operation-line {
          height: 3.4rem;
          width: 100%;
          display: flex;
          justify-content: space-between;
          align-items: center;

          .left {
            width: 23%;
            padding-left: 1.4%;

            span:nth-child(1) {
              margin-right: 2%;
            }
          }

          .right {
            width: 77%;
            display: flex;
            justify-content: flex-start;
            padding-left: .2rem;

            span {
              display: flex;
              justify-content: center;
              align-items: center;
            }

            .operation-detail {
              display: flex;
              font-size: .8rem;
              margin-left: .4rem;

              .buttons-left, .buttons-right {
                display: flex;

                .operation-button {
                  width: 6vw;
                  height: 6vw;
                  font-size: .8rem;
                  border: 1px solid #3d79e0;
                  margin-right: -1px;
                  display: flex;
                  justify-content: center;
                  align-items: center;

                }
              }

              .current-number {
                width: 3.4rem;
                text-align: center;
                display: flex;
                justify-content: center;
                align-items: center;

                label {
                  font-size: .8rem;
                }
              }
            }

            .complete-one-set {
              width: 2rem;
              height: 2rem;
              margin-left: .4rem;
              display: flex;
              justify-content: center;
              align-items: center;

              img {
                width: 80%;
                height: 80%;
              }
            }
          }
        }

        .item-counter {
          height: 3.4rem;
          width: 100%;
          display: flex;
          justify-content: flex-start;
          align-items: center;
          font-size: .8rem;
          padding-left: 7.58rem;

          > span:nth-child(1) {
            margin-right: 2rem;
          }

          > span:nth-child(2) {
            font-size: 1.3rem;
            color: #2dab5b;
            font-weight: bold;
            margin-top: -.2rem;
            margin-right: .2rem;
            width: 2.4rem;
            text-align: center;
          }

          .start, .stop {
            width: 2.6rem;
            height: 2.6rem;
            border-radius: 50%;
            color: #fff;
            display: flex;
            justify-content: center;
            align-items: center;
            font-weight: bold;
            font-size: .7rem;

          }

          .start {
            background-color: #0e9d43;
            margin-left: 2rem;
            margin-right: 3.3rem;
          }

          .stop {
            background-color: #eca656;
          }

          .gray {
            background-color: #999;
          }
        }
      }

      .exercise-content-item:last-child {
        margin-bottom: .4rem;
      }
    }

    .exercise-content-reduce {
      height: 17.5rem;
      margin-top: 1rem;
      border-radius: .3rem;
      border: 1px solid #3d79e0;
      position: relative;

      .title {
        width: auto;
        height: 1.5rem;
        position: absolute;
        padding: 0 1rem;
        left: 10%;
        top: -.7rem;
        font-size: .9rem;
        font-weight: bold;
        text-align: center;
        border-radius: .2rem;
        background-color: #3d79e0;
        color: #fff;
      }

      .reduce-content {
        margin-top: 1rem;
        width: 100%;
        height: 16rem;
        overflow-y: scroll;

        .reduce-content-item {
          .operation-line {
            height: 3.4rem;
            width: 100%;
            display: flex;
            justify-content: space-between;
            align-items: center;

            .left {
              width: 24%;
              padding-left: 2%;
              font-size: .8rem;

              span:nth-child(1) {
                margin-right: 2%;
              }
            }

            .right {
              width: 76%;
              display: flex;
              justify-content: space-around;
              font-size: .8rem;

              span {
                display: flex;
                justify-content: center;
                align-items: center;
              }

              .operation-detail {
                display: flex;

                .buttons-left, .buttons-right {
                  display: flex;

                  .operation-button {
                    width: 6vw;
                    height: 6vw;
                    font-size: .8rem;
                    border: 1px solid #3d79e0;
                    margin-right: -1px;
                    display: flex;
                    justify-content: center;
                    align-items: center;
                  }
                }

                .current-number {
                  width: 3.4rem;
                  text-align: center;
                  display: flex;
                  justify-content: center;
                  align-items: center;
                }
              }
            }
          }
          .operation-divider {
            height: 1px;
            width: 90%;
            background-color: #999;
            margin-left: 5%;
            margin-bottom: 1.8vh;
            margin-top: 0.2vh;
          }
        }

        .add-reduce-one-set-detail {
          height: 3.5rem;
          width: 100%;
          margin-top: -.8rem;
          display: flex;
          justify-content: center;
          align-items: center;
          font-size: .8rem;

          div {
            border: 1px solid #3d79e0;
            width: 6rem;
            line-height: 1.4rem;
            border-radius: .3rem;
            display: flex;
            justify-content: center;
            align-items: center;
            color: #3d79e0;
          }
        }
      }
    }
    .bottom-tab {
      height: 3.8vh;
      width: 100%;
      display: flex;
      justify-content: center;
      align-items: center;
      z-index: 10;

      .circle-click {
        width: 1.5rem;
        height: 100%;
        display: flex;
        justify-content: center;
        align-items: center;

        .circle {
          width: .5rem;
          height: .5rem;
          border-radius: 50%;
          border: .05rem solid #fff;
          display: flex;
          justify-content: center;
          align-items: center;
          box-sizing: border-box;

          div {
            width: .5rem;
            height: .5rem;
            border-radius: 50%;
            background-color: #fff;
          }
        }
      }
    }

    .bottom-buttons {
      height: 10vh;
      width: 84%;
      margin: .5rem auto 0;
      position: absolute;
      left: 8%;
      bottom: 1rem;
      display: flex;
      justify-content: space-between;
      align-items: center;

      .buttons-left, .buttons-right, .buttons-middle {
        display: flex;
        justify-content: center;
        align-items: center;
        height: 3.6rem;
        font-size: 1.2rem;
        color: #fff;
        font-family: PingFangSC-Semibold, PingFang SC;
        font-weight: 600;
        border-radius: .3rem;
        overflow: hidden;
      }

      .buttons-left {
        width: 12rem;
        height: 3.6rem;

        .start {
          width: 100%;
          height: 100%;
          display: flex;
          justify-content: center;
          align-items: center;
          background: linear-gradient(171deg, #FFB73D 0%, #F7A014 100%);
        }

        .start-finished {
          display: flex;
          justify-content: center;
          align-items: center;
          background: linear-gradient(171deg, #B9BAC2 0%, #A3A4AF 100%);
        }
      }

      .buttons-right {
        width: 12rem;
        height: 3.6rem;

        .finish-set {
          width: 100%;
          height: 100%;
          display: flex;
          justify-content: center;
          align-items: center;
          background: linear-gradient(171deg, #FFB73D 0%, #F7A014 100%);
        }

        .finish-set-finished {
          width: 100%;
          height: 100%;
          display: flex;
          justify-content: center;
          align-items: center;
          background: linear-gradient(171deg, #B9BAC2 0%, #A3A4AF 100%);
        }
      }

      .buttons-middle {
        width: 3.6rem;
        height: 3.6rem;

        img {
          width: 100%;
          height: 100%;
        }
      }
    }
  }

}
</style>
