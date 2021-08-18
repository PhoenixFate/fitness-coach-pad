<template>
  <div id="plan-template-content">
    <div class="header">
      <div class="header-cover">
      </div>
      <div class="header-content">
        <div class="header-search">
          <div class="top-left-search">
            <input type="text" placeholder="筛选计划..." v-model="searchValue">
            <div class="search" @click="doSearch">
              <img src="images/common/search-dark-gray.png" alt="">
            </div>
          </div>
        </div>
        <div class="header-scroll">
          <div class="header-item-add"
               :class="currentIndex===-1?'header-item-add-selected':''"
               @click="newPlan">
            <span>+</span>
          </div>
          <div class="header-item-empty" v-if="trainingPlanList.length===0">
            <img src="images/common/no-result.png" alt="">
            <p>暂无搜索结果</p>
          </div>
          <div class="header-item"
               v-for="(template,index) in trainingPlanList"
               :class="currentIndex===index?'header-item-selected':''"
               @click="selectTemplateItem(index)"
               :key="index">
            <div class="image">
              <img :src="template.trainingPlanCoverImage" alt="">
            </div>
            <h6>{{ template.trainingPlanName }}</h6>
          </div>
          <div class="empty"></div>
        </div>
      </div>
    </div>

    <div class="title">
      <div class="title-cover">
      </div>
      <div class="title-content">
        <div class="left">
          <div class="cover-title">模板计划封面</div>
          <div class="cover-image">
            <img :src="currentPlan.trainingPlanCoverImage" alt="" v-if="currentPlan.trainingPlanCoverImage">
            <img src="images/template/cover-upload-background.png" alt="" v-if="!currentPlan.trainingPlanCoverImage">
            <div class="upload-cover" v-if="!currentPlan.trainingPlanCoverImage" @click="toUploadImage">
              <div class="upload">
                <img src="images/common/camera.png" alt="">
              </div>
              <p>点击上传封面</p>
            </div>
            <div class="delete-image" @click="deleteImage" v-if="currentPlan.trainingPlanCoverImage">
              <img src="images/common/delete-gray.png" alt="">
            </div>
          </div>

        </div>
        <div class="right">
          <div class="right-content">
            <div class="template-item name">
              <div class="item-name">计划名称</div>
              <div class="item-content">
                <q-input placeholder="请输入训练计划名称" v-model="currentPlan.trainingPlanName"/>
              </div>
            </div>
            <div class="template-item price">
              <div class="item-name">计划价格</div>
              <div class="item-content">
                <input placeholder="请填写计划价格" v-model="currentPlan.price" type="number"/>
              </div>
            </div>
            <div class="template-item aim">
              <div class="item-name">计划目标</div>
              <div class="item-content">
                <div class="aim-item"
                     :class="aim.trainingGoalId===currentPlan.goalId?'aim-item-selected':''"
                     v-for="(aim,index) in trainingGoalList" :key="index" @click="selectAim(aim)">{{ aim.goalName }}
                </div>
              </div>
            </div>
            <div class="template-item description">
              <div class="item-name">计划简介</div>
              <div class="item-content">
                <textarea v-model="currentPlan.trainingPlanDescription" placeholder="快来填写训练计划简介吧"></textarea>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="delete-item" @click="deleteItem">删除</div>
    </div>

    <div class="small-title">
      <div class="small-title-background">
        计划各阶段详情
      </div>
    </div>

    <div class="template-body" >
<!--      <TemplateExercisePeriod-->
<!--        v-for="(period,periodIndex) in currentPlan.trainingPeriods"-->
<!--        :periodIndex="period.periodIndex"-->
<!--        :periodName.sync="period.periodName"-->
<!--        @deletePeriod="deletePeriod"-->
<!--        :weeks="period.trainingWeekList"-->
<!--        :class-info-list="classInfoList"-->
<!--        ref="period"-->
<!--        :key="periodIndex">-->
<!--      </TemplateExercisePeriod>-->
      <div class="training-plan-period" v-for="(period,periodIndex) in currentPlan.trainingPeriods" :key="periodIndex">
        <div class="period-index">
          <div>{{chineseIndex[periodIndex]}}</div>
        </div>
        <div class="delete-period" @click="deletePeriod(periodIndex)">
          <img src="images/common/delete.png" alt="">
        </div>
        <div class="period-item">
          <div class="item-left">阶段名称</div>
          <div class="item-right">
            <q-input placeholder="请输入阶段名称" v-model="period.periodName" />
          </div>
        </div>
        <div class="period-item period-item-small">
          <div class="item-left">训练天数</div>
          <div class="item-right">
            <div class="minus minus-empty"></div>
            <span>{{period.trainingDays}}</span>
            <div class="add add-empty" ></div>
          </div>
        </div>
        <div class="period-item period-item-small">
          <div class="item-left">单次周期长度</div>
          <div class="item-right">
            <div class="minus" @click="minusDay(2,periodIndex)">-</div>
            <span>{{period.oneCircleDays}}</span>
            <div class="add" @click="addDay(2,periodIndex)">+</div>
          </div>
        </div>
        <div class="period-item period-item-small">
          <div class="item-left">周期重复次数</div>
          <div class="item-right">
            <div class="minus" @click="minusDay(3,periodIndex)">-</div>
            <span>{{period.circleRepeatTimes}}</span>
            <div class="add" @click="addDay(3,periodIndex)">+</div>
          </div>
        </div>
        <div class="period-class-list">
          <div class="period-class-list-title">单次周期课程</div>
          <div class="period-class-item" v-for="(dayItem,dayIndex) in period.trainingPeriodDays" :key="dayIndex">
            <div class="class-index">
              第{{dayIndex+1}}天
            </div>
            <div class="class-info" v-if="dayItem.isRest===0">
              {{dayItem.classInfo.className}}
            </div>
            <div class="class-rest" v-if="dayItem.isRest===1" @click="showClassInfoDialog(periodIndex,dayIndex)">
              <span>休息</span>
              <strong>|</strong>
              <div >+</div>
            </div>
            <div class="class-delete" v-if="dayItem.isRest===0" @click="deleteClass(periodIndex,dayIndex)">
              <img src="images/common/delete.png" alt="">
            </div>
            <div class="class-delete" v-if="dayItem.isRest===1">
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="add-template">
      <div class="line">
        <div class="circle"></div>
      </div>
      <div class="line">
        <div class="circle"></div>
      </div>
      <div class="add-content">
        <img src="images/class/classInfo/exercise-add-background.png" alt="">
        <div class="cover" @click="addPeriod">
          <img src="images/template/add.png" alt="">
        </div>
      </div>
      <p>点击添加新的训练阶段</p>
    </div>


    <div class="save-button">
      <div class="finish" @click="saveTemplatePlan">
        <div>保存</div>
      </div>
    </div>
    <input style="display: none" type="file" ref="refUploadFile" accept="image/*" @change="readLocalFile">

    <!--  保存组件  -->
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

    <transition enter-active-class="animate__fadeIn animate__faster"
                leave-active-class="animate__fadeOut animate__faster"
    >
      <DeleteConfirm
        :deleteDialogFlag.sync="deleteDialogFlag"
        :delete-item-successfully="deleteItemSuccessfully"
        :delete-item-failed="deleteItemFailed"
        :delete-message="deleteMessage"
        @confirmDelete="confirmDelete"
        :index="currentIndex"
        v-if="deleteDialogFlag"
        class="animate__animated"
        style="z-index: 3000"
        ref="deleteDialog"
      ></DeleteConfirm>
    </transition>

    <transition enter-active-class="animate__slideInDown animate__faster"
                leave-active-class="animate__zoomOut animate__fast">
      <AlertMessage
        :alert-message-flag.sync="alertMessageFlag"
        :message="alertMessage"
        class="animate__animated"
        style="z-index: 3000"
        v-if="alertMessageFlag"
      >
      </AlertMessage>
    </transition>

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

    <transition enter-active-class="animate__fadeIn animate__faster"
                leave-active-class="animate__fadeOut animate__faster"
    >
      <ClassInfoListDialog
        :classInfoDialogFlag.sync="classInfoDialogFlag"
        :class-info-list="classInfoList"
        :periodIndex="currentPeriodIndex"
        :dayIndex="currentDayIndex"
        :currentPlan="currentPlan"
        v-show="classInfoDialogFlag"
        class="animate__animated"
        style="z-index: 3000"
      >
      </ClassInfoListDialog>
    </transition>
  </div>
</template>

<script>
import SaveFinished from "components/common/SaveFinished";
import {apiTrainingGoalList} from "src/api/trainingGoal";
import {apiTrainingPlanList,apiTrainingPlanDetail} from "src/api/trainingPlan";
import {apiUploadImage} from "src/api/upload";
import {apiClassInfoListWithDetail} from "src/api/classInfo";
import {ChineseDayData} from "src/const/template/chineseDayData";
import {apiUpdateTrainingPlan,apiSaveTrainingPlan,apiDeleteTrainingPlan} from "src/api/trainingPlan";
import AlertMessage from "components/common/AlertMessage";
import DeleteConfirm from "components/common/DeleteConfirm";
import LoadingData from "components/common/LoadingData";
import ClassInfoListDialog from "components/template/ClassInfoListDialog"
import {ChineseIndex} from "src/const/customer/assignment/chineseIndexData";
import "./q-input.scss"
export default {
  name: "Index",
  components: {
    SaveFinished,
    AlertMessage,
    DeleteConfirm,
    LoadingData,
    ClassInfoListDialog
  },
  data() {
    return {
      currentIndex: -1,
      currentPlan:{
        trainingPlanName: "",
        trainingPlanCoverImage: "",
        goalId: -1,
        trainingPlanDescription: "",
        trainingPeriods: [
          {
            periodIndex: 1,
            periodName: "",
            periodDescription:"",
            trainingDays:0,
            oneCircleDays:1,
            circleRepeatTimes:1,
            trainingPeriodDays:[
              {
                dayIndex:1,
                isRest:1
              }
            ],
          }
        ]
      },
      trainingGoalList: [],
      trainingPlanList: [],
      classInfoList:[],
      //删除的相关属性
      deleteDialogFlag: false,
      deleteItemSuccessfully: false,
      deleteItemFailed: false,
      deleteMessage: "",
      //保存的相关属性
      saveDialogFlag: false,
      saveItemSuccessfully: false,
      saveItemFailed: false,
      saveMessage: "",
      saveDialogHeaderImage: "images/template/save-header.png",

      chineseDays:ChineseDayData,
      alertMessage:"",
      alertMessageFlag:false,

      loadingDataFlag:true,
      classInfoDialogFlag:false,
      currentPeriodIndex:-1,
      currentDayIndex:-1,
      chineseIndex:ChineseIndex,
      searchValue:""
    }
  },
  mounted() {
    this.loadData()
    this.loadDataCommon()
    this.initData();
  },
  methods: {
    initData(){
      this.currentPlan = {
        trainingPlanName: "",
        trainingPlanCoverImage: "",
        goalId: -1,
        trainingPlanDescription: "",
        trainingPeriods: [
          {
            periodIndex: 1,
            periodName: "",
            periodDescription:"",
            trainingDays:0,
            oneCircleDays:1,
            circleRepeatTimes:1,
            trainingPeriodDays:[
              {
                dayIndex:1,
                isRest:1
              }
            ],
          }
        ]
      }
      this.currentIndex = -1;
    },
    loadData() {
      apiTrainingPlanList({limit: 100,searchValue:this.searchValue}).then((res) => {
        setTimeout(()=>{
          this.loadingDataFlag=false
        },400)
        this.trainingPlanList = res.data.data.list
      })
      this.initData()
      this.$forceUpdate()
    },
    doSearch(){
      this.loadData()
    },
    loadDataCommon() {
      apiTrainingGoalList({limit: 100}).then((res) => {
        this.trainingGoalList = res.data.data.list
        console.log(this.trainingGoalList)
      })
      apiClassInfoListWithDetail().then((res)=>{
        this.classInfoList=res.data.data
      })
    },
    computeTrainingDays(){
      let classCount=0;
      this.currentPlan.trainingPeriods[this.currentPeriodIndex].trainingPeriodDays.forEach((day,dayIndex)=>{
        if(day.classId){
          classCount++;
        }
      })
      this.currentPlan.trainingPeriods[this.currentPeriodIndex].trainingDays=classCount
    },
    deleteClass(periodIndex,dayIndex){
      this.currentPlan.trainingPeriods[periodIndex].trainingPeriodDays[dayIndex].classId=null
      this.currentPlan.trainingPeriods[periodIndex].trainingPeriodDays[dayIndex].classInfo=null
      this.currentPlan.trainingPeriods[periodIndex].trainingPeriodDays[dayIndex].isRest=1
      this.computeTrainingDays()
    },
    selectTemplateItem(index) {
      this.currentIndex = index
      apiTrainingPlanDetail(this.trainingPlanList[index].trainingPlanId).then((res)=>{
        console.log(res)
        this.currentPlan=res.data.data
      })
    },
    deleteImage(){
      this.currentPlan.trainingPlanCoverImage=""
    },
    newPlan(){
      this.initData()
    },
    showClassInfoDialog(periodIndex,dayIndex){
      this.currentPeriodIndex=periodIndex
      this.currentDayIndex=dayIndex
      this.classInfoDialogFlag=true
    },
    minusDay(type,periodIndex){
      this.currentPeriodIndex=periodIndex
      if(type===2){
        if(this.currentPlan.trainingPeriods[periodIndex].oneCircleDays<=1){
          return
        }else {
          this.currentPlan.trainingPeriods[periodIndex].oneCircleDays-=1
          this.currentPlan.trainingPeriods[periodIndex].trainingPeriodDays.pop();
          this.computeTrainingDays()
        }
      }else if(type===3){
        if(this.currentPlan.trainingPeriods[periodIndex].circleRepeatTimes<=1){
          return
        }else {
          this.currentPlan.trainingPeriods[periodIndex].circleRepeatTimes-=1
        }
      }
    },
    addDay(type,periodIndex){
      this.currentPeriodIndex=periodIndex
      if(type===2){
        this.currentPlan.trainingPeriods[periodIndex].oneCircleDays+=1
        this.currentPlan.trainingPeriods[periodIndex].trainingPeriodDays.push({
            isRest:1
        })
      }else if(type===3){
        this.currentPlan.trainingPeriods[periodIndex].circleRepeatTimes+=1
      }
    },
    addPeriod(){
      let period={
        periodIndex: this.currentPlan.trainingPeriods.length+1,
        periodName: "",
        periodDescription:"",
        trainingDays:0,
        oneCircleDays:1,
        circleRepeatTimes:1,
        trainingPeriodDays:[
          {
            dayIndex:1,
            isRest:1
          },
        ],
      }
      this.currentPlan.trainingPeriods.push(period)
    },
    deletePeriod(periodIndex){
      if(this.currentPlan.trainingPeriods.length===1){
        this.alertMessage="当前只剩一个阶段的内容，无法删除"
        this.alertMessageFlag=true
        return
      }
      this.currentPlan.trainingPeriods.splice(periodIndex,1)
    },
    selectAim(aim) {
      this.currentPlan.goalId = aim.trainingGoalId
      this.$forceUpdate()
    },
    toUploadImage() {
      this.$refs.refUploadFile.value = ''
      this.$refs.refUploadFile.click();
    },
    //点击上传图片
    readLocalFile() {
      let file = this.$refs.refUploadFile.files[0]
      let params = new FormData()  // 创建form对象
      params.append('file', file)  // 通过append向form对象添加数据
      params.append('prefix', 'template') // 添加form表单中其他数据
      apiUploadImage(params).then((res) => {
        this.currentPlan.trainingPlanCoverImage = res.data.data
      })
    },
    deleteItem() {
      if(!this.currentPlan.trainingPlanId){
        this.alertMessage="请先选择某一个训练计划，然后进行删除操作"
        this.alertMessageFlag=true;
        return
      }
      this.deleteMessage="您确认要删除\""+this.currentPlan.trainingPlanName+"\"吗？"
      this.deleteDialogFlag=true;
    },
    confirmDelete(index){
      setTimeout(()=>{
        apiDeleteTrainingPlan(this.currentPlan.trainingPlanId).then(()=>{
          this.$refs.deleteDialog.deletingFlag=false
          this.deleteItemSuccessfully=true
          //重新加载数据
          this.loadData()
        }).catch(()=>{
          this.$refs.deleteDialog.deletingFlag=false
          this.deleteItemFailed=true;
        }).finally(()=>{
          setTimeout(() => {
            this.deleteDialogFlag = false
            setTimeout(() => {
              this.deleteItemSuccessfully = false
              this.deleteItemFailed=false;
            }, 1000)
          }, 800)
        })
      },1000)
    },
    saveTemplatePlan() {
      if(!this.currentPlan.trainingPlanName){
        this.alertMessage="计划名称为空，请填写名称"
        this.alertMessageFlag=true
        return
      }
      if(this.currentPlan.goalId===-1){
        this.alertMessage="计划目标为空，请选择计划目标"
        this.alertMessageFlag=true
        return
      }
      if(!this.currentPlan.price){
        this.alertMessage="计划价格为空，请填写计划价格"
        this.alertMessageFlag=true
        return
      }else {
        if(this.currentPlan.price>0 && this.currentPlan.price<=100000){

        }else {
          this.alertMessage="请填写正确的价格：0 ～ 100000之间"
          this.alertMessageFlag=true
          return
        }
      }
      let periodNameEmptyFlag=false
      this.currentPlan.trainingPeriods.forEach((period)=>{
        if(!period.periodName){
          periodNameEmptyFlag=true
        }
      })
      if(periodNameEmptyFlag){
        this.alertMessage="阶段名称为空，请填写阶段名称"
        this.alertMessageFlag=true
        return
      }
      this.currentPlan.trainingPeriods.forEach((period,periodIndex)=>{
        period.periodIndex=periodIndex+1
        period.trainingPeriodDays.forEach((day,dayIndex)=>{
          day.dayIndex=dayIndex+1
        })
      })
      console.log(this.currentPlan)
      this.saveMessage = "\"" + this.currentPlan.trainingPlanName + "\"";
      this.saveDialogFlag = true
      if(this.currentPlan.trainingPlanId){
        //修改
        apiUpdateTrainingPlan(this.currentPlan).then((res)=>{
          this.loadData()
          this.saveItemSuccessfully = true
        }).catch(()=>{
          this.saveItemFailed = true;
        }).finally(()=>{
          this.hideSaveDialog()
        })
      }else {
        //新增
        apiSaveTrainingPlan(this.currentPlan).then((res)=>{
          this.loadData()
          this.saveItemSuccessfully = true
        }).catch(()=>{
          this.saveItemFailed = true;
        }).finally(()=>{
          this.hideSaveDialog()
        })
      }
    },
    hideSaveDialog(){
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
#plan-template-content {
  height: 100%;
  width: 100%;
  .header {
    height: 18rem;
    width: 100%;
    background: url("../../../../assets/images/template/template-header-02.png");
    background-size: 100% 100%;
    position: relative;
    .header-cover {
      position: absolute;
      width: 100%;
      height: 100%;
      left: 0;
      top: 0;
      overflow: hidden;
      z-index: 0;
    }
    .header-cover::before {
      content: "";
      background: url("../../../../assets/images/template/template-header-02.png");
      background-size: 100% 100%;
      filter: blur(.3rem);
      position: absolute;
      left: 0;
      right: 0;
      top: 0;
      bottom: 0;
      margin: -2% 0;
    }

    .header-content {
      position: absolute;
      width: 100%;
      height: 100%;
      left: 0;
      top: 0;
      background-color: rgba(0, 0, 0, 0.1);
      z-index: 1;
      .header-search {
        height: 3rem;
        .top-left-search {
          position: absolute;
          top:1rem;
          left:20%;
          width: 60%;
          height: 2rem;
          input {
            width: 100%;
            height: 100%;
            font-size: .9rem;
            padding-right: 2.3rem;
            border-radius: 1rem;
            background-color: rgba(0, 0, 0, 0.12);
            color: #4e4e4e;
            padding-left: 1.5rem;
            border:1px solid #ffffff;
          }
          input::-webkit-input-placeholder { /* WebKit browsers 适配谷歌 */
            color: #4e4e4e;
          }
          input:-moz-placeholder { /* Mozilla Firefox 4 to 18 适配火狐 */
            color: #4e4e4e;
          }
          input::-moz-placeholder { /* Mozilla Firefox 19+ 适配火狐 */
            color: #4e4e4e;
          }
          input:-ms-input-placeholder { /* Internet Explorer 10+  适配ie*/
            color: #4e4e4e;
          }
          .search {
            position: absolute;
            right:.5rem;
            top:2px;
            width: 2rem;
            height: 2rem;
            img {
              width: 60%;
              height: 60%;
              position: absolute;
              left:14%;
              top:20%;
            }
          }
        }
      }
      .header-scroll {
        width: 100%;
        height: calc(100% - 3rem);
        overflow-x: scroll;
        overflow-y: hidden;
        justify-content: flex-start;
        align-items: center;
        display: flex;

        .header-item-add, .header-item,.header-item-empty{
          width: 32%;
          height: 80%;
          flex-shrink: 0;
          border-radius: .4rem;
          display: flex;
          align-items: center;
          margin-left: 3%;
        }

        .header-item-empty {
          display: flex;
          background-color: rgba(255, 255, 255, 0.3);
          flex-direction: column;
          justify-content: center;
          align-items: center;
          img {
            height: 60%;
            width: auto;
            margin-top: 1.7rem;
          }
          p {
            margin-top: .6rem;
            font-size: .8rem;
            color: #605f5f;
          }
        }

        .header-item-add {
          background-color: rgba(0, 0, 0, 0.2);
          color: #fff;
          font-size: 4.5rem;
          text-align: center;
          justify-content: center;
          font-weight: lighter;
          span {
            margin-bottom: 6%;
          }
        }

        .header-item-add-selected {
          border: 1px solid #fff;
          box-shadow: 0 0 .2rem #fff;
        }

        .header-item {
          background-color: rgba(255, 255, 255, 0.8);
          justify-content: space-between;
          flex-direction: column;
          overflow: hidden;
          .image {
            height: 80%;
            width: 100%;
            display: flex;
            justify-content: center;
            align-items: center;
            img {
              width: 100%;
              height: 100%;
            }
          }

          h6 {
            font-size: .8rem;
            color: #3e3939;
            margin-bottom: .2rem;
            font-weight: normal;
          }
        }

        .empty {
          width: 3%;
          height: 100%;
          flex-shrink: 0;
        }

        .header-item-selected {
          width: 36%;
          height: 88%;
          box-shadow: 0 .15rem .8rem #cd893b;
          border: .1rem solid #eca656;
        }
      }

    }
  }

  .small-title {
    width: 100%;
    height: 3rem;
    margin: .2rem 0 .5rem;
    .small-title-background {
      height: 100%;
      width: 44%;
      background-image: url("../../../../assets/images/template/title-background-small.png");
      background-size: 100% 100%;
      line-height: 3rem;
      font-size: 1.1rem;
      padding-left: 6%;
      margin-left: -0.4%;
    }
  }

  .title {
    width: 100%;
    margin: 1rem auto;
    height: 20rem;
    background-image: url("../../../../assets/images/template/title-background.png");
    background-size: 100% 100%;
    position: relative;
    z-index: 100;
    .delete-item {
      position: absolute;
      right: .2rem;
      top:-.7rem;
      width: 2.8rem;
      height: 1.5rem;
      background-color: #df4b4b;
      color:#fff;
      border-radius: .2rem;
      font-size: .7rem;
      display: flex;
      justify-content: center;
      align-items: center;
    }
    .title-cover {
      width: 100%;
      height: 100%;
      position: absolute;
      background-color: rgba(255, 255, 255, 0.7);
    }

    .title-content {
      width: 97%;
      height: 87%;
      position: absolute;
      left: 1.5%;
      top: 5%;
      border-radius: .8rem;
      background-color: rgba(0, 0, 0, 0.18);

      .left {
        width: 34%;
        height: 100%;
        display: flex;
        justify-content: center;
        align-items: center;
        flex-direction: column;
        float: left;
        padding: 0 0 0 1.8%;

        .cover-title {
          height: 2rem;
          width: 100%;
          font-size: 1.1rem;
          padding-left: .3rem;
          color: #3b3838;
        }

        .cover-image {
          width: 100%;
          height: 54%;
          border-radius: .6rem;
          border: 1px solid #eca656;
          position: relative;
          overflow: hidden;
          .delete-image {
            position: absolute;
            top:-.2rem;
            right:-.2rem;
            width: 2rem;
            height: 2rem;
            display: flex;
            justify-content: center;
            align-items: center;
            img {
              width: 60%;
              height: 60%;
            }
          }

          > img {
            width: 100%;
            height: 100%;
          }

          .upload-cover {
            width: 100%;
            height: 100%;
            position: absolute;
            left: 0;
            top: 0;
            background-color: rgba(255, 255, 255, 0.8);
            display: flex;
            justify-content: center;
            align-items: center;
            flex-direction: column;

            .upload {
              width: 3rem;
              height: 3rem;
              border-radius: 50%;
              background-color: #d4c7d6;
              display: flex;
              justify-content: center;
              align-items: center;
              margin-top: 10%;

              img {
                width: 1.5rem;
                height: 1.5rem;
                margin-bottom: .2rem;
              }
            }

            p {
              font-size: .7rem;
              color: #4c4646;
              margin-top: .4rem;
            }
          }
        }
      }
      .right {
        float: right;
        width: 66%;
        height: 100%;
        position: relative;
        padding: .6rem .6rem .6rem 1.2%;
        .right-content {
          height: 100%;
          background-color: rgba(0, 0, 0, 0.18);
          border-radius: .6rem;
          padding: .1rem .2rem .5rem 0;
          .template-item {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: .5rem;
            .item-name {
              width: 26%;
              height: 100%;
              font-size: 1rem;
              color: #262222;
              display: flex;
              justify-content: flex-start;
              align-items: center;
              padding-left: 1.4%;
            }
            .item-content {
              width: 74%;
              height: 100%;
              label {
                font-size: 1rem;
              }
            }
          }
          .name {
            height: 3rem;
            .item-content {
              padding-right: 2rem;
            }
          }
          .template-item.price{
            margin-bottom: .2rem;
          }
          .price {
            height: 2rem;
            input {
              background-color: rgba(255, 255, 255, 0);
              border:none;
              font-size: .9rem;
              width: 60%;
              height: 2rem;
              line-height: 2rem;
              color: #f6c514;
            }
            input::-webkit-input-placeholder {
              color:#454242
            }
            input:-moz-placeholder {
              color: #454242
            }
            input::-moz-placeholder {
              color: #454242
            }
            input:-ms-input-placeholder {
              color: #454242
            }
          }
          .aim {
            height: 3rem;
            .item-content {
              display: flex;
              align-items: center;
              .aim-item {
                height: 1.5rem;
                width: 20%;
                line-height: 1.5rem;
                text-align: center;
                background-color: rgba(255, 255, 255, 0.1);
                border-right: 1px solid rgba(255, 255, 255, 0.4);
                font-size: .7rem;
              }
              .aim-item:last-child {
                border-right: none;
              }
              .aim-item-selected {
                background-color: rgba(255, 255, 255, 0.7)
              }
            }
          }
          .description {
            .item-name {
              align-items: flex-start;
              height: 6.5rem;
            }
            .item-content {
              height: 6.5rem;
              textarea {
                width: 100%;
                height: 100%;
                background-color: rgba(255, 255, 255, 0.1);
                resize: none;
                border: none;
                border-radius: .25rem;
                padding: .2rem .3rem;
                font-size: 1rem;
              }
              textarea::-webkit-input-placeholder {
                color: #454242;
              }
            }
          }
        }
      }
    }
  }


  .template-body {
    width: 100%;
    min-height: 2rem;
    padding: 0 .6rem 1rem .8rem;
    .training-plan-period {
      width: 96%;
      margin: 0 auto .7rem;
      min-height: 15rem;
      box-shadow: 0 0 .3rem #999;
      border-radius: .5rem;
      position: relative;
      overflow: hidden;
      padding: 1rem .5rem 0 .5rem;
      .delete-period {
        width: 2.4rem;
        height: 2.4rem;
        position: absolute;
        right:0;
        top:0;
        img {
          width: 1.2rem;
          height: 1.2rem;
          position: absolute;
          right:.3rem;
          top:.3rem;
        }
      }
      .period-index {
        position: absolute;
        top:-1.5rem;
        left:-1.5rem;
        width: 5rem;
        height: 5rem;
        border-radius: 50%;
        background-color: #60d0e2;
        div {
          position: absolute;
          width: 3.5rem;
          height: 3.5rem;
          right:0;
          bottom:0;
          text-align: center;
          line-height: 2.7rem;
          font-size: 1.5rem;
          color:#fff;
        }
      }
      .period-item {
        width: 80%;
        margin: .5rem auto;
        height: 3rem;
        display: flex;
        .item-left {
          width: 40%;
          font-size: 1.2rem;
          padding-left: 5%;
          line-height: 3rem;
        }
        .item-right {
          width: 60%;
          padding-left: 5%;
          label {
            width: 80%;
            font-size: 1rem;
          }
        }
      }
      .period-item-small {
        height: 2.5rem;
        line-height: 2.5rem;
        .item-left {
          font-size: 1rem;
        }
        .item-right {
          display: flex;
          justify-content: flex-start;
          align-items: center;
          .minus,.add {
            width: 2rem;
            height: 2rem;
            border: 1px solid #7a7a7a;
            border-radius: .3rem;
            line-height: 1.9rem;
            font-size: 1.2rem;
            text-align: center;
            color: #7a7a7a;
          }

          span {
            font-size: 1.1rem;
            display: block;
            width: 2.5rem;
            text-align: center;
          }
          .minus {
            margin-right: 1.5rem;
          }
          .add {
            margin-left: 1.5rem;
          }
          .minus-empty,.add-empty{
            border:none
          }
          label {
            width: 3rem;
          }
        }
      }
      .period-class-list {
        width: 70%;
        min-height: 10rem;
        box-shadow: 0 0 .2rem #a5a5a5;
        border-radius: .5rem;
        position: relative;
        margin: .9rem auto 1rem;
        overflow: hidden;
        padding-top: 2rem;
        .period-class-list-title {
          background-color: #1b9cc3;
          color:#fff;
          width: 7rem;
          height: 2rem;
          position: absolute;
          left:0;
          top:0;
          font-size: 1rem;
          line-height: 1.8rem;
          padding-left: .3rem;
        }
        .period-class-item {
          width: 90%;
          margin: .5rem auto;
          height: 3.5rem;
          display: flex;
          justify-content: center;
          align-items: center;
          border:1px solid #999;
          border-radius: .4rem;
          .class-index {
            width: 28%;
            text-align: center;
            font-size: 1rem;
          }
          .class-info {
            width: 62%;
            font-size: .9rem;
            text-align: center;
          }
          .class-rest {
            width: 62%;
            display: flex;
            justify-content: center;
            align-items: center;
            font-size: 1rem;
            strong {
              margin: 0 6%;
            }
            div{
              width: 1.5rem;
              height: 1.5rem;
              border-radius: 50%;
              border: 1px solid #999;
              text-align: center;
              line-height: 1.3rem;
              color:#999;
            }
          }
          .class-delete {
            width: 20%;
            display: flex;
            justify-content: center;
            align-items: center;
            img {
              width: 1rem;
              height: 1rem;
            }
          }
        }
      }
    }
  }

  .add-template {
    width: 42%;
    height: 14rem;
    margin-top: 10px;
    background-color: #d6f5fa;
    margin: -.4rem auto 0;
    position: relative;
    border-radius: .6rem;
    box-shadow: -.1rem .1rem .3rem #57585a;
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
        box-shadow: 1px 1px .1rem #57585a inset;
      }
    }

    .line:nth-child(1) {
      left: 14%;
    }

    .line:nth-child(2) {
      right: 14%;
    }

    .add-content {
      width: 8rem;
      height: 8rem;
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
          height:2rem;
          background-color: rgba(255, 255, 255, 0.72);
        }
      }
    }

    p {
      margin: .8rem 0 1.1rem;
      font-size: .9rem;
      color: #5b5757;
    }
  }


  .save-button {
    width: 100%;
    height: 5rem;
    display: flex;
    justify-content: center;
    align-items: center;
    margin-top: .5rem;
    .finish {
      height: 2.5rem;
      width: 40%;
      margin: 2rem auto 1rem;
      background: linear-gradient(to right, #7ccef3, #b1d7fa);
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
        box-shadow: -.1rem -.1rem .3rem #72b6d6 inset;
      }
    }
  }


}
</style>
