<template>
  <div id="food-content">
    <div class="background-header"></div>
    <div class="background-body"></div>
    <div class="class-tabs">
      <div class="tab-content">
        <div class="content">
          <div @click="changeTab(0)">
            <span :class="currentTabIndex===0?'tab-select':''">健康餐
              <div class="color" :class="currentTabIndex===0?'color-selected':''"></div>
            </span>
          </div>
          <div @click="changeTab(1)">
            <span :class="currentTabIndex===1?'tab-select':''">饮食计划
              <div class="color" :class="currentTabIndex===1?'color-selected':''"></div>
            </span>
          </div>
        </div>
      </div>
    </div>
    <div class="class-body">
      <div class="body-content">
        <keep-alive include="Food,DietPlan">
          <HealthyMeal v-if="currentTabIndex===0"></HealthyMeal>
          <DietPlan v-if="currentTabIndex===1"></DietPlan>
        </keep-alive>
      </div>
    </div>
  </div>
</template>

<script>
import HealthyMeal from "components/diet/healthyMeal";
import DietPlan from "components/diet/dietPlan";

export default {
  name: "Index",
  components: {HealthyMeal, DietPlan},
  data() {
    return {
      currentTabIndex: 0,
    }
  },
  methods: {
    changeTab(index) {
      this.currentTabIndex = index;
    }
  }
}
</script>

<style scoped lang="scss">
#food-content {
  height: 100%;
  width: 100%;
  position: relative;

  .background-header {
    height: 28%;
    width: 100%;
    background-image: url("../../../../assets/images/diet/header-background-02.png");
    background-size: 100% 100%;
  }

  .background-body {
    height: calc(72% + 1px);
    width: 100%;
    margin-top: -1px;
    background: -webkit-gradient(linear, 100% 10%, 100% 100%, color-stop(0, #e7f8ce), color-stop(0.45, #e2f5d1), color-stop(1, #d0eeb5));
  }

  .class-tabs {
    position: absolute;
    width: 94%;
    height: 18%;
    top: 3.4%;
    left: 3%;
    background: linear-gradient(to bottom, rgba(#f5f3e6, 0.62) 0%, rgba(#f3da7e, 0.92) 100%);
    box-shadow: .15rem .15rem .3rem #618349;
    border-top-left-radius: 2rem;
    border-top-right-radius: 2rem;
    overflow: hidden;

    .tab-content {
      width: 100%;
      height: 100%;
      box-shadow: -.2rem -.3rem .5rem #dead49 inset;
      display: flex;
      justify-content: center;
      align-items: center;

      .content {
        width: 80%;
        height: 60%;
        display: flex;
        justify-content: center;
        align-items: center;

        div {
          width: 50%;
          height: 60%;
          font-size: 1.6rem;
          text-shadow: .15rem .1rem .1rem #dedddd;
          color: #696868;
          font-weight: bold;
          display: flex;
          justify-content: center;
          align-items: center;

          span {
            display: block;
            height: 100%;
            line-height: 2.4;

            .color {
              width: 100%;
              height: .23rem;
            }

            .color-selected {
              background: -webkit-gradient(linear, 100% 10%, 100% 100%, color-stop(0, #f1e7a7), color-stop(0.68, #c89911), color-stop(1, #bf911b));
            }
          }

          .tab-select {
            color: #cfa115;
            text-shadow: .15rem .1rem .1rem #f1e7a7;
          }
        }

        > div:nth-child(1) {
          border-right: 1px solid #cb9712;
        }
      }
    }
  }

  .class-body {
    position: absolute;
    width: 94%;
    left: 3%;
    top: 22.8%;
    height: 74.6%;
    border-radius: .8rem;
    box-shadow: .15rem .15rem .3rem #618349;
    overflow: hidden;
    background: -webkit-gradient(linear, 100% 10%, 100% 100%, color-stop(0, rgba(#e6f6cc, .8)), color-stop(0.45, #d2e9b2), color-stop(1, #ecf5c0));

    .body-content {
      width: 100%;
      height: 100%;
      box-shadow: -.15rem -.25rem .4rem #d0db72 inset;
    }
  }
}
</style>
