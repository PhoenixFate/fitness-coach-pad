<template>
  <div class="diet-plan">
    <div class="diet-plan-empty" v-if="!customerDietPlan">
      <img src="images/customer/detail/diet-plan-empty.png" alt="">
      <p>暂无饮食计划</p>
    </div>
    <div class="diet-plan-detail" v-if="customerDietPlan">
      <div class="diet-plan-line">
        <span>饮食计划: </span>
        <strong>{{ customerDietPlan.dietPlan.dietPlanName }}</strong>
      </div>
      <div class="diet-plan-line">
        <span>时间阶段: </span>
        <strong>{{ customerDietPlan.startDate }}</strong>
        <strong style="margin: 0 1rem">~</strong>
        <strong>{{ customerDietPlan.endDate }}</strong>
      </div>
      <div class="diet-plan-items">
        <DietPlanDetailItem
          :diet-plan-item="dietPlanItem"
          v-for="(dietPlanItem,dietPlanItemIndex) in customerDietPlan.dietPlan.dietPlanItems"
          :key="dietPlanItemIndex"
        >
        </DietPlanDetailItem>
      </div>
    </div>
  </div>
</template>

<script>
import DietPlanDetailItem from "components/diet/dietPlan/DietPlanDetailItem";

export default {
  components: {DietPlanDetailItem},
  name: "CustomerDietPlan",
  data() {
    return {}
  },
  methods: {},
  props: {
    customerDietPlan: Object
  }
}
</script>

<style scoped lang="scss">
.diet-plan {
  height: auto;
  border-radius: .2rem;
  background-color: #fff;
  width: 100%;
  margin: .5rem auto;
  box-shadow: .1rem .1rem .3rem #999;
  display: flex;
  justify-content: flex-start;
  align-items: flex-start;
  flex-direction: column;

  .diet-plan-empty {
    height: 14rem;
    width: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;

    img {
      width: 11rem;
      height: 11rem;
    }

    p {
      color: #999;
      font-size: .9rem;
    }
  }

  .diet-plan-detail {
    height: auto;
    width: 100%;
    min-height: 10rem;
    padding-top: 1rem;
    padding-bottom: 1rem;
    .diet-plan-line {
      height: 3rem;
      padding-left: 2.8rem;
      display: flex;
      justify-content: flex-start;
      align-items: center;

      span {
        margin-right: 1.4rem
      }
    }

    .diet-plan-line:nth-child(1) {
      strong {
        font-size: 1.1rem;
      }
    }
    .diet-plan-items {
      height: auto;
      width: 80%;
      margin: 0 auto;
    }
  }
}
</style>
