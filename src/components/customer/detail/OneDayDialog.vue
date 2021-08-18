<template>
  <div id="one-day-dialog-content">
    <BackgroundBlack @click.native="hiddenDialog"></BackgroundBlack>
    <div class="one-day-dialog">
      <h5>第一周</h5>
      <div class="day-content">
        <div class="class-name">
          <span>课程</span>
          <div v-if="dayContent.classInfo" class="class-info" @click="selectClassInfo">
            <span>{{ dayContent.classInfo.className }}</span>
            <img src="images/template/click.png" alt="">
          </div>
          <div v-if="!dayContent.classInfo" class="class-info-empty" @click="selectClassInfo">
            <span>当前无课程</span>
            <img src="images/template/click.png" alt="">
          </div>
        </div>
        <div class="class-cover-image">
          <div class="has-class" v-if="dayContent.classInfo">
            <img :src="dayContent.classInfo.classCoverImage" alt="">
          </div>
          <div class="has-not-class" v-if="!dayContent.classInfo">
            <img src="images/customer/exercisePlan/empty.png" alt="">
            <div class="tip">请先选择课程</div>
          </div>
        </div>
        <div class="class-date">
          <span>日期</span>
          <date-picker
            v-model="dayContent.detailDate"
            @input="selectDetailDate"
            format="YYYY-MM-DD"
            valueType="format"
            placeholder="开始日期"
            style="width: 9rem"
          ></date-picker>
        </div>
      </div>
      <div class="save-button">
        <div @click="sureChange">
          确定
        </div>
      </div>
    </div>

    <transition enter-active-class="animate__slideInDown animate__faster"
                leave-active-class="animate__zoomOut animate__fast">
      <CustomerDetailClassInfoListDialog
        :classInfoDialogFlag.sync="classInfoDialogFlag"
        :classInfoList="classInfoList"
        @selectOneClassInfo="selectOneClassInfo"
        class="animate__animated"
        style="z-index: 4000"
        v-if="classInfoDialogFlag"
      >
      </CustomerDetailClassInfoListDialog>
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

  </div>
</template>

<script>
import BackgroundBlack from "components/common/BackgroundBlack";
import 'vue2-datepicker/index.css';
import DatePicker from 'vue2-datepicker';
import CustomerDetailClassInfoListDialog from "components/customer/detail/CustomerDetailClassInfoListDialog";
import {getDayOfWeek} from "src/util/dateUtil";
import AlertMessage from "components/common/AlertMessage";
import "./input.scss"
export default {
  name: "OneDayDialog",
  components: {BackgroundBlack, DatePicker, CustomerDetailClassInfoListDialog,AlertMessage},
  data() {
    return {
      classInfoDialogFlag: false,

      alertMessage:"",
      alertMessageFlag:false,
    }
  },
  created() {
    console.log(this.dayContent)
    console.log(this.classInfoList)
  },
  props: {
    oneDayDialogFlag: Boolean,
    dayContent: Object,
    classInfoList: Array,
  },
  methods: {
    hiddenDialog() {
      this.$emit("update:oneDayDialogFlag", false)
    },
    selectClassInfo() {
      this.classInfoDialogFlag = true
    },
    selectDetailDate(e) {
      if (e != null) {
        this.dayContent.dayOfWeek = getDayOfWeek(e)
      }
    },
    selectOneClassInfo(index) {
      this.dayContent.classId = this.classInfoList[index].classId
      this.dayContent.classInfo = this.classInfoList[index]
    },
    sureChange() {
      if (!this.dayContent.classId) {
        //请选择课程
        this.alertMessage="请先选择课程"
        this.alertMessageFlag=true
        return
      }
      if (!this.dayContent.detailDate) {
        //请选择日期
        this.alertMessage="请先选择日期"
        this.alertMessageFlag=true
        return
      }
      this.$emit("update:oneDayDialogFlag", false)
      this.$emit("sureChange")
    }
  },
}
</script>

<style scoped lang="scss">
#one-day-dialog-content {
  z-index: 1;
  position: relative;
  .one-day-dialog {
    width: 60%;
    height: 24rem;
    position: fixed;
    top: 50%;
    margin-top: -12rem;
    left: 20%;
    z-index: 2010;
    border-radius: 1rem;
    background-color: #fff;
    h5 {
      text-align: center;
      line-height: 2.5rem;
      font-size: 1rem;
      font-weight: bold;
    }
    .day-content {
      height: calc(80% - 2.5rem);
      width: 90%;
      margin: 0 auto;
      padding-left:1.4rem;
      padding-top: 1rem;
      .class-name {
        display: flex;
        justify-content: flex-start;
        align-items: center;
        >span {
          font-size: 1rem;
          display: block;
          width:5rem;
          text-align: left;
        }
        > div {
          height: 2rem;
          line-height: 2rem;
          min-width: 9rem;
          background-color: #c4ebef;
          border-radius: .2rem;
          font-size: .9rem;
          display: flex;
          justify-content: center;
          align-items: center;
          padding: 0 .9rem;
          span {
            margin-right: .5rem;
          }
          img {
            width: 1rem;
            height: 1rem;
          }
        }

        .class-info-empty {
          background-color: #dbd9d9;
        }
      }

      .class-cover-image {
        height: 11rem;
        width: 100%;
        margin-top: 2%;
        display: flex;
        justify-content: center;
        align-items: center;

        .has-class, .has-not-class {
          width: 80%;
          height: 90%;
          border-radius: .4rem;
          overflow: hidden;
          img {
            width: 100%;
            height: 100%;
          }
        }
        .has-not-class {
          position: relative;
          .tip {
            position: absolute;
            padding: 0 .5rem;
            width: 7rem;
            height: 1.5rem;
            line-height: 1.5rem;
            background-color: rgba(0, 0, 0, 0.5);
            color: #e2e2e2;
            left: 50%;
            top: 50%;
            text-align: center;
            border-radius: .2rem;
            margin-left: -3.5rem;
            margin-top: -.8rem;
          }
        }
      }

      .class-date {
        display: flex;
        justify-content: flex-start;
        align-items: center;
        height: 3rem;
        >span {
          font-size: 1rem;
          display: block;
          width: 5rem;
          text-align: left;
        }
      }
    }
    .save-button {
      height: 2rem;
      width: 6rem;
      display: flex;
      justify-content: center;
      align-items: center;
      position: absolute;
      bottom: 1rem;
      left: 50%;
      margin-left: -3rem;
      div {
        width: 6rem;
        height: 2rem;
        line-height: 2rem;
        border: 1px solid #42a5f5;
        color: #42a5f5;
        text-align: center;
        font-size: .9rem;
        border-radius: .4rem;
      }
    }
  }
}
</style>
