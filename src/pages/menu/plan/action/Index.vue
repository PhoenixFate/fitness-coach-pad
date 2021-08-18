<template>
  <div id="action-management-content">
    <div class="action-header">
      <div class="tabs">
        <div class="left" @click="changeTab(0)">
          <div class="content"></div>
          <div class="title" :class="currentTabIndex === 0 ? 'title-selected' : ''">
            分类管理
            <div class="title-selected-line" v-if="currentTabIndex === 0"></div>
          </div>
        </div>
        <div class="middle">
          <div class="line"></div>
        </div>
        <div class="right" @click="changeTab(1)">
          <div class="content"></div>
          <div class="title" :class="currentTabIndex === 1 ? 'title-selected' : ''">
            动作管理
            <div class="title-selected-line" v-if="currentTabIndex === 1"></div>
          </div>
        </div>
      </div>
    </div>
    <div class="flower-01">
      <img src="images/action/flower-01.png" alt="" />
    </div>
    <div class="action-body">
      <transition enter-active-class="animate__slideInLeft" leave-active-class="animate__slideOutRight animate__faster">
        <keep-alive include="ActionDetail,ActionType">
          <ActionType v-if="currentTabIndex === 0" class="animate__animated"></ActionType>
          <ActionDetail v-if="currentTabIndex === 1" class="animate__animated"></ActionDetail>
        </keep-alive>
      </transition>
    </div>
  </div>
</template>

<script>
import ActionDetail from 'components/action/ActionDetail';
import ActionType from 'components/action/ActionType';
export default {
  name: 'Index',
  components: { ActionDetail, ActionType },
  data() {
    return {
      currentTabIndex: 1
    };
  },
  watch: {},
  created() {},
  methods: {
    changeTab(index) {
      this.currentTabIndex = index;
    }
  }
};
</script>

<style scoped lang="scss">
@import './my-animate.scss';
#action-management-content {
  height: 100%;
  width: 100%;
  display: flex;
  flex-direction: column;
  position: relative;

  .flower-01 {
    position: absolute;
    top: 23.8%;
    left: 14.28%;
    width: 22%;
    height: 3rem;
    img {
      width: 100%;
      height: 100%;
    }
  }

  .action-header {
    height: 26%;
    width: 100%;
    background-image: url('../../../../assets/images/action/action-background-02.png');
    background-repeat: no-repeat;
    background-size: 100% 100%;
    position: relative;

    .tabs {
      position: absolute;
      width: 100%;
      left: 0;
      height: 61%;
      bottom: 0;
      background: linear-gradient(to bottom, rgba(#ebfaf0, 0.7) 0%, rgba(#8ef1b5, 0.62) 100%);
      display: flex;
      box-shadow: -0.15rem -0.3rem 0.5rem #31e08e inset;

      .left,
      .right {
        width: 45%;
        height: 100%;
        display: flex;
        align-items: center;
        position: relative;

        .content {
          width: 76%;
          height: 66%;
          background-color: rgba(255, 255, 255, 0.48);
          filter: blur(12px);
        }

        .title {
          position: absolute;
          width: 60%;
          height: 50%;
          font-size: 1.4rem;
          font-weight: bold;
          border-bottom: 2px solid #4ba560;
          display: flex;
          justify-content: center;
          align-items: center;
          color: #7e7d7d;
          z-index: 1;
          text-shadow: 2px 1px 2px #c3c1c1;

          .title-selected-line {
            height: 100%;
            width: 60%;
            left: 20%;
            position: absolute;
            border-bottom: 0.2rem solid #96ee08;
            margin-top: 4px;
            z-index: 3;
          }
        }

        .title-selected {
          color: #13b76a;
          text-shadow: 0.1rem 1px 0.1rem #8edda0;
        }
      }

      .left {
        justify-content: flex-end;

        .title {
          left: 32%;
          top: 18%;
        }
      }

      .right {
        justify-content: flex-start;

        .title {
          right: 32%;
          top: 18%;
        }
      }

      .middle {
        width: 10%;
        display: flex;
        justify-content: center;
        align-items: center;

        .line {
          width: 3px;
          height: 40%;
          background-color: #fff;
        }
      }
    }
  }

  .action-body {
    width: 100%;
    height: 74%;
  }
}
</style>
