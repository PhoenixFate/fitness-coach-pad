<template>
  <div class="detail-item">
    <div class="detail-title">
      <div class="detail-title-left">
        <img src="images/diet/mealType/breakfast.png" alt=""
             v-if="dietPlanItem.mealType.mealTypeValue==='BREAKFAST'">
        <img src="images/diet/mealType/breakfast-more.png" alt=""
             v-if="dietPlanItem.mealType.mealTypeValue==='BREAKFAST_MORE'">
        <img src="images/diet/mealType/lunch.png" alt="" v-if="dietPlanItem.mealType.mealTypeValue==='LUNCH'">
        <img src="images/diet/mealType/lunch-more.png" alt=""
             v-if="dietPlanItem.mealType.mealTypeValue==='LUNCH_MORE'">
        <img src="images/diet/mealType/dinner.png" alt="" v-if="dietPlanItem.mealType.mealTypeValue==='DINNER'">
      </div>
      <div class="detail-title-right">
        <span>{{ dietPlanItem.mealType.mealTypeName }}</span>
      </div>
    </div>
    <h5>摄入指标</h5>
    <div class="target-line">
      <div class="target-item">
        <span>热量</span>
        <span><strong>{{dietPlanItem.hot}}</strong>kj</span>
      </div>
      <div class="target-item">
        <span>碳水</span>
        <span><strong>{{dietPlanItem.carbon}}</strong>g</span>
      </div>
    </div>
    <div class="target-line">
      <div class="target-item">
        <span>蛋白质</span>
        <span><strong>{{dietPlanItem.protein}}</strong>g</span>
      </div>
      <div class="target-item">
        <span>脂肪</span>
        <span><strong>{{dietPlanItem.fat}}</strong>g</span>
      </div>
    </div>

    <h5>推荐用餐</h5>
    <div class="food">
      <p v-if="dietPlanItem.healthyMeal">{{ dietPlanItem.healthyMeal.healthyMealName }}</p>
      <img :src="dietPlanItem.healthyMeal.healthyMealCoverImage" alt="" v-if="dietPlanItem.healthyMeal">
      <p v-if="!dietPlanItem.healthyMeal">暂无推荐餐食</p>
      <img src="images/diet/dietPlan/empty-meal.png" alt="" v-if="!dietPlanItem.healthyMeal">
    </div>
  </div>

</template>

<script>
export default {
  name: "DietPlanDetailItem",
  data() {
    return {}
  },
  props: {
    dietPlanItem: Object
  }
}
</script>

<style scoped lang="scss">
.detail-item {
  height: auto;
  width: 80%;
  margin: 1.5rem auto 0;
  background-color: rgba(#efeab8, 0.3);
  box-shadow: 0 0 .2rem #999;
  border-radius: .6rem;
  position: relative;
  padding: 1rem;

  .meal-type-image {
    position: absolute;
    left: 0;
    top: 0;
    width: 3rem;
    height: 3rem;
    display: flex;
    justify-content: center;
    align-items: center;

    img {
      width: 60%;
      height: 60%;
    }
  }

  .detail-title {
    position: absolute;
    width: 8rem;
    left: 50%;
    margin-left: -4rem;
    top: -.9rem;
    height: 2.4rem;
    background-color: #f1a92e;
    font-size: .9rem;
    font-weight: bold;
    border-radius: .3rem;
    color: #fff;
    display: flex;
    justify-content: flex-start;
    align-items: center;

    .detail-title-left {
      width: 40%;
      display: flex;
      justify-content: center;
      align-items: center;

      img {
        width: 1.6rem;
        height: 1.6rem;
      }
    }

    .detail-title-right {
      width: 60%;
      display: flex;
      justify-content: flex-start;
      align-items: center;
    }

  }

  .meal-time {
    height: 2.5rem;
    width: 100%;

    .meal-time-content {
      margin-left: 4%;
      height: 2.5rem;
      width: 66%;
      min-width: 12rem;
      background-color: #fff;
      border-radius: .4rem;
      font-size: .9rem;
      padding-left: 5%;
      line-height: 2.5rem;

      span:nth-child(2) {
        margin: 0 1rem;
      }
    }
  }

  h5 {
    font-size: 1.1rem;
    margin: .6rem 0 .4rem;
  }

  .target-line {
    width: 100%;
    height: 2rem;
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding-left: 4%;
    margin-top: .5rem;

    .target-item {
      width: 46%;
      height: 100%;
      background-color: #fff;
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 0 .5rem;
      border-radius: .4rem;
      font-size: .9rem;

      span:nth-child(2) {
        display: flex;
        justify-content: center;
        align-items: center;
      }

      strong {
        margin-right: .2rem;
      }
    }
  }

  .food {
    height: auto;
    width: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
    position: relative;
    margin-top: -.3rem;
    img {
      width: 10rem;
      height: 7rem;
      border-radius: .4rem;
    }

    p {
      margin-bottom: .4rem;
      text-align: center;
      font-size: 1.1rem;
    }
  }
}
</style>
