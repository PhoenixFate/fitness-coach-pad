<template>
  <div class="action">
    <div class="title">
      <div></div>
      <strong>{{ exerciseName }}</strong>
    </div>
    <div class="action-set-item" v-for="(actionSet,setIndex) in actionSets" :key="setIndex"
         :class="setIndex===actionSets.length-1?'action-set-special':''">
      <div class="action-set-item-left">
        <div class="action-set-type">
          <div class="set-type" :class="actionSetType[actionSet.actionSetType].activeClass">
            <img src="images/classAssignment/yellow-set.png" alt="" v-if="actionSet.actionSetType==='COMMON_SET'">
            <img src="images/classAssignment/red-set.png" alt="" v-if="actionSet.actionSetType==='SUPER_SET'">
            <img src="images/classAssignment/green-set.png" alt="" v-if="actionSet.actionSetType==='REDUCE_SET'">
            <span>{{ actionSetType[actionSet.actionSetType].name }}</span>
          </div>
        </div>
        <div class="action-set-detail-name">
          <div class="action-line" v-for="(action,actionIndex) in actionSet.actions" :key="actionIndex">
            <span>{{ action.actionName }}</span>
          </div>
        </div>
        <div class="action-set-detail-set">
          {{ actionSet.actions[0].setNumber }}组
        </div>
        <div class="action-set-detail-count">
          <div class="action-line" v-for="(action,actionIndex) in actionSet.actions" :key="actionIndex">
            <span v-if="action.unit==='SET'">{{ action.count }}次/组</span>
            <span v-if="action.unit==='SECOND'">{{ action.time }}秒</span>
          </div>
        </div>
      </div>
      <div class="action-set-item-right">
        <div class="line" v-for="(action,actionIndex) in actionSet.actions" :key="actionIndex"
             @click="playVideo(setIndex,actionIndex)">
          <img src="images/customer/exercisePlan/video.png" alt="" v-if="action.actionVideoUrl">
          <img src="images/classAssignment/video-no.png" alt="" v-if="!action.actionVideoUrl">
        </div>
      </div>
    </div>

    <AlertMessage
      :alert-message-flag.sync="alertMessageFlag"
      :message="alertMessage"
      class="animate__animated"
      style="z-index: 3000"
      v-show="alertMessageFlag"
    >
    </AlertMessage>
    <video-player
      :video-url="videoUrl"
      :videoPlayerFlag.sync="videoPlayerFlag"
      style="z-index: 3000"
      v-if="videoPlayerFlag"
    >
    </video-player>

  </div>
</template>

<script>
import {ActionSetType} from "src/const/classManagement/actionSetType";
import VideoPlayer from "components/common/VideoPlayer";
import AlertMessage from "components/common/AlertMessage";

export default {
  name: "ExerciseItem",
  components: {VideoPlayer, AlertMessage},
  data() {
    return {
      actionSetType: ActionSetType,
      videoUrl: '',
      videoPlayerFlag: false,
      alertMessage: "",
      alertMessageFlag: false,

    }
  },
  props: {
    exerciseName: String,
    actionSets: Array,
  },
  methods: {
    //点击按钮出现弹窗播放视频
    playVideo(setIndex, actionIndex) {
      let videoUrl = this.actionSets[setIndex].actions[actionIndex].actionVideoUrl;
      if (!videoUrl) {
        this.alertMessage = "暂无视频"
        this.alertMessageFlag = true
        return
      }
      this.videoPlayerFlag = true;
      this.videoUrl = videoUrl;
    }
  }
}
</script>

<style scoped lang="scss">
.action {
  width: 100%;

  .title {
    height: 1.4rem;
    font-size: 1rem;
    font-weight: bold;
    line-height: 1.4rem;
    margin: .4rem 0 .8rem 0;
    display: flex;
    justify-content: flex-start;
    align-items: center;

    div {
      width: .2rem;
      height: 1rem;
      background: #23262D;
      border-radius: .1rem;
      margin-right: .4rem;
    }
  }

  .action-set-item {
    font-size: .8rem;
    height: auto;
    display: flex;
    padding: .75rem 0;
    border-radius: .3rem;
    border-bottom: .05rem solid #EBECEF;;

    .action-set-item-left {
      width: 80%;
      display: flex;
      justify-content: space-between;

      .action-set-type {
        width: 20%;
        display: flex;
        justify-content: flex-start;
        align-items: center;
        padding-left: .2rem;

        .set-type {
          width: 3rem;
          height: 1.2rem;
          display: flex;
          justify-content: center;
          align-items: center;
          position: relative;
          >img {
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

        .type-super {
          color: #f33a3a;
        }

        .type-common {
          color:#FFAD2A;
        }

        .type-reduce {
          color: #2dab5b;
        }
      }

      .action-set-detail-name {
        width: 32%;
        height: auto;

        .action-line {
          height: 2rem;
          line-height: 2rem;
          display: flex;
        }
      }

      .action-set-detail-set {
        width: 20%;
        height: auto;
        display: flex;
        justify-content: center;
        align-items: center;
        color: #828386;
      }

      .action-set-detail-count {
        width: 20%;
        height: auto;
        color: #828386;
        .action-line {
          height: 2rem;
          line-height: 2rem;
          text-align: center;
        }
      }
    }

    .action-set-item-right {
      width: 20%;
      display: flex;
      justify-content: center;
      align-items: center;
      flex-direction: column;

      .line {
        height: 2rem;
        width: 100%;
        display: flex;
        justify-content: flex-end;
        align-items: center;

        img {
          width: 1.2rem;
          height: 1.2rem;
          margin-right: .2rem;
        }
      }
    }
  }

  .action-set-special {
    border: none !important;
  }
}
</style>
