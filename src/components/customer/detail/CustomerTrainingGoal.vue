<template>
  <div class="training-goal">
    <div class="training-goal-empty" v-if="!goalId">
      <img src="images/customer/detail/goal-empty.png" alt="">
      <p>暂无训练目标</p>
    </div>
    <div class="training-goal-detail" v-if="goalId">
      <div class="goal-item"
           :class="goalId===goal.trainingGoalId?'goal-item-selected':''"
           v-for="(goal,goalIndex) in goalList" :key="goalIndex">
        <img src="images/goal/减脂.png" alt="" v-if="goal.goalName==='减脂'">
        <img src="images/goal/增肌.png" alt="" v-if="goal.goalName==='增肌'">
        <img src="images/goal/力量.png" alt="" v-if="goal.goalName==='力量'">
        <img src="images/goal/cross-fit.png" alt="" v-if="goal.goalName==='crossfit'">
        <img src="images/goal/恢复.png" alt="" v-if="goal.goalName==='恢复'">
        <span>{{ goal.goalName }}</span>
        <div class="circle" v-if="goalId!==goal.trainingGoalId"></div>
        <div class="circle-selected" v-if="goalId===goal.trainingGoalId">
          <img src="images/goal/selected.png" alt="" >
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "CustomerDietPlan",
  data() {
    return {}
  },
  methods: {},
  props: {
    goalId: Number,
    goalList: Array
  }
}
</script>

<style scoped lang="scss">
.training-goal {
  height: auto;
  width: 100%;
  margin: .5rem auto;
  border-radius: .3rem;
  border: .05rem solid #EBECEF;
  display: flex;
  justify-content: flex-start;
  align-items: flex-start;
  flex-direction: column;

  .training-goal-empty {
    height: 14rem;
    width: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;

    img {
      width: 9rem;
      height: 9rem;
    }

    p {
      color: #999;
      font-size: .9rem;
      margin-top: .8rem;
      margin-bottom: 0;
    }
  }

  .training-goal-detail {
    width: 100%;
    height: 7rem;
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 1.2rem;

    .goal-item {
      width: 6rem;
      height: 4.8rem;
      background-color: #F6F7FA;
      border-radius: .3rem;
      padding: .8rem;
      position: relative;
      box-sizing: border-box;
      >img {
        position: absolute;
        left: .5rem;
        top: .5rem;
        width: 1.8rem;
        height: 1.8rem;
      }
      span {
        position: absolute;
        bottom: .4rem;
        left: .6rem;
        font-size: .9rem;
        font-weight: 600;
        color: #23262D;
      }
      .circle {
        width: .9rem;
        height: .9rem;
        border-radius: 50%;
        border: .1rem solid #EBECEF;
        position: absolute;
        right:.6rem;
        top:.6rem;
      }
      .circle-selected {
        width: 1rem;
        height: 1rem;
        display: flex;
        justify-content: center;
        align-items: center;
        position: absolute;
        right:.5rem;
        top:.5rem;
        border-radius: 50%;
        >img {
          width: 100%;
          height: 100%;
        }
      }
    }

    .goal-item-selected {
      border: .15rem solid #23262D;
    }
  }
}
</style>
