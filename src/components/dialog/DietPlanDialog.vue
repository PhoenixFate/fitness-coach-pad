<template>
  <div id="diet-plan-list-dialog-content">
    <BackgroundBlackLess @click.native="hiddenDialog"></BackgroundBlackLess>
    <div class="list-content">
      <div class="list-content-scroll">
        <div class="diet-plan-item"
             v-for="(plan,index) in dietPlanList"
             :class="currentIndex===index?'diet-plan-item-selected':''"
             @click="selectItem(index)"
             :key="index">
          <div class="title">
            {{ plan.dietPlanName }}
          </div>
          <div class="item-content">
            <div class="diet-item" v-for="(dietItem,dietItemIndex) in plan.dietPlanItems" :key="dietItemIndex">
              <div class="diet-item-left">
                {{ dietItem.mealType.mealTypeName }}
              </div>
              <div class="diet-item-right">
                <div class="nutrition">
                  <div>
                    <span>热量: </span>
                    <strong>{{ dietItem.hot }}</strong>
                  </div>
                  <div>
                    <span>碳水: </span>
                    <strong>{{ dietItem.carbon }}</strong>
                  </div>
                  <div>
                    <span>脂肪: </span>
                    <strong>{{ dietItem.fat }}</strong>
                  </div>
                  <div>
                    <span>蛋白质: </span>
                    <strong>{{ dietItem.protein }}</strong>
                  </div>
                </div>
                <div class="meal">
                  <span>推荐餐食: </span>
                  <span v-if="dietItem.healthyMeal">
                    {{ dietItem.healthyMeal.healthyMealName }}
                  </span>
                  <span v-if="!dietItem.healthyMeal">
                    暂无
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import BackgroundBlackLess from "components/common/BackgroundBlackLess";

export default {
  name: "DietPlanDialog",
  components: {BackgroundBlackLess},
  data() {
    return {
      currentIndex: -1,
    }
  },
  props: {
    dietPlanList: Array,
    dietPlanDialogFlag: Boolean,
  },
  methods: {
    selectItem(index) {
      this.currentIndex = index;
      this.$emit("selectOneDietPlan", index)
      setTimeout(() => {

        this.$emit("update:dietPlanDialogFlag", false)
      }, 500)
    },
    hiddenDialog() {
      this.$emit("update:dietPlanDialogFlag", false)
    },
  }
}
</script>

<style scoped lang="scss">
#diet-plan-list-dialog-content {
  position: relative;
  z-index: 1;

  .list-content {
    width: 60%;
    height: 30rem;
    overflow-y: scroll;
    position: fixed;
    top: 50%;
    margin-top: -15rem;
    left: 20%;
    background-color: rgba(0, 0, 0, 0.46);
    box-shadow: 0 0 40px #fff;
    z-index: 2010;
    border-radius: 1rem;
    padding: 1rem;
    border: none;

    .list-content-scroll {
      width: 100%;
      height: 100%;
      overflow-y: scroll;
      padding: .6rem;
    }

    .diet-plan-item {
      width: 100%;
      min-height: 8rem;
      margin-bottom: 1.4rem;
      background-color: #fff;
      line-height: 3.5rem;
      font-size: 1.1rem;
      position: relative;
      border-radius: .4rem;
      padding-top: 1.6rem;

      .title {
        position: absolute;
        left: 50%;
        min-width: 10rem;
        height: 2rem;
        top: -.6rem;
        margin-left: -5rem;
        background-color: #eaaf4c;
        color: #fff;
        display: flex;
        justify-content: center;
        align-items: center;
        line-height: 1rem;
        border-radius: .4rem;
        font-size: .9rem;
      }

      .item-content {
        min-height: 6.4rem;
        display: flex;
        justify-content: center;
        align-items: center;
        flex-direction: column;
        width: 100%;

        .diet-item {
          height: 3.6rem;
          width: 100%;
          display: flex;
          margin-bottom: .5rem;

          .diet-item-left {
            width: 23%;
            display: flex;
            justify-content: center;
            align-items: center;
            font-size: 1rem;
          }

          .diet-item-right {
            width: 77%;
            height: 100%;
            display: flex;
            justify-content: center;
            align-items: flex-start;
            flex-direction: column;
            border-bottom: 1px solid #cbcaca;

            .nutrition {
              display: flex;
              height: 1.6rem;
              font-size: .7rem;

              > div {
                width: 3.7rem;
                display: flex;
                justify-content: space-around;
                align-items: center;
              }
            }

            .meal {
              height: 1.6rem;
              font-size: .9rem;
              width: 100%;
              display: flex;
              justify-content: flex-start;
              align-items: center;

              > span:nth-child(1) {
                margin-right: .4rem;
              }
            }
          }
        }

        .diet-item:last-child {
          margin-bottom: 0;
        }
      }
    }

    .diet-plan-item:last-child {
      margin-bottom: 0;
    }

    .diet-plan-item-selected {
      box-shadow: 0 0 .6rem #f6be4c;
    }
  }
}
</style>
