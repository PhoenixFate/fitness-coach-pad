<template>
  <div id="meal-type-list-dialog-content">
    <BackgroundBlack @click.native="hiddenDialog"></BackgroundBlack>
    <div class="list-content">
      <div class="list-content-scroll">
        <div class="meal-type-item"
             v-for="(mealType,index) in mealTypeList"
             :class="index===currentIndex?'meal-type-item-selected':''"
             @click="selectItem(index)"
             :key="index">
          <div class="meal-type-item-cover">
            <img src="images/diet/mealTypeBackground/breakfast.png" alt="" v-if="mealType.mealTypeValue==='BREAKFAST' || mealType.mealTypeValue==='BREAKFAST_MORE'">
            <img src="images/diet/mealTypeBackground/lunch.png" alt="" v-if="mealType.mealTypeValue==='LUNCH' || mealType.mealTypeValue==='LUNCH_MORE'">
            <img src="images/diet/mealTypeBackground/dinner.png" alt="" v-if="mealType.mealTypeValue==='DINNER'">
            <div class="meal-type-content">
              <div class="meal-type-left">
                <img src="images/diet/mealType/breakfast.png" alt="" v-if="mealType.mealTypeValue==='BREAKFAST'">
                <img src="images/diet/mealType/breakfast-more.png" alt="" v-if="mealType.mealTypeValue==='BREAKFAST_MORE'">
                <img src="images/diet/mealType/lunch.png" alt="" v-if="mealType.mealTypeValue==='LUNCH'">
                <img src="images/diet/mealType/lunch-more.png" alt="" v-if="mealType.mealTypeValue==='LUNCH_MORE'">
                <img src="images/diet/mealType/dinner.png" alt="" v-if="mealType.mealTypeValue==='DINNER'">
              </div>
              <div class="meal-type-right">
                <h4>{{ mealType.mealTypeName }}</h4>
                <div>
                  <span>{{mealType.startTime}}</span>
                  <span>~</span>
                  <span>{{mealType.endTime}}</span>
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
import BackgroundBlack from "components/common/BackgroundBlack";
export default {
  name: "MealTypeListDialog",
  components: {BackgroundBlack},
  data() {
    return {
      currentIndex: -1,
    }
  },
  created() {
    console.log(this.tempDietItem)
    if(this.tempDietItem.mealType){
      this.mealTypeList.forEach((mealType,index)=>{
        if(mealType.id===this.tempDietItem.mealType.id){
          this.currentIndex=index
        }
      })
    }
  },
  props: {
    tempDietItem:Object,
    mealTypeList:Array,
    mealTypeListDialogFlag:Boolean,
  },
  methods: {
    selectItem(index) {
      this.currentIndex = index;
      this.$emit("selectOneMealType",index)
      setTimeout(() => {
        this.currentIndex = -1;
        this.$emit("update:mealTypeListDialogFlag", false)
      }, 500)
    },
    hiddenDialog() {
      this.$emit("update:mealTypeListDialogFlag", false)
    },
  }
}
</script>

<style scoped lang="scss">
#meal-type-list-dialog-content {
  .list-content {
    width: 54%;
    height: 28rem;
    overflow-y: scroll;
    position: fixed;
    top: 50%;
    margin-top: -14rem;
    left: 23%;
    background-color: rgba(0, 0, 0, 0.32);
    z-index: 2010;
    border-radius: 1rem;
    padding: .9rem;
    border: none;
    .list-content-scroll {
      overflow-y: scroll;
      padding: .9rem;
      height: 100%;
      width: 100%;
      .meal-type-item {
        width: 100%;
        height: 5.4rem;
        margin-bottom: .9rem;
        font-size: 1.1rem;
        border-radius: .6rem;
        display: flex;
        justify-content: center;
        align-items: center;
        .meal-type-item-cover {
          height: 100%;
          width: 100%;
          position: relative;
          img {
            width: 100%;
            height: 100%;
          }
          .meal-type-content {
            width: 100%;
            height: 100%;
            position: absolute;
            left: 0;
            top: 0;
            display: flex;
            justify-content: center;
            align-content: center;
            .meal-type-left {
              width: 30%;
              display: flex;
              justify-content: center;
              align-items: center;
              padding-left: 4.2vw;
              img {
                width: 3.6rem;
                height: 3.6rem;
              }
            }
            .meal-type-right {
              width: 70%;
              display: flex;
              flex-direction: column;
              justify-content: center;
              align-items: flex-start;
              padding-left: 4vw;
              h4 {
                font-size: 1.1rem;
                font-weight: 500;
                text-align: left;
                line-height: 1.8rem;
              }
              div {
                font-size: .7rem;
                color: #666666;
                padding-left: .2rem;
                span:nth-child(2){
                  font-size: .8rem;
                  font-weight: 500;
                  margin: 0 .5rem;
                }
              }
            }
          }
        }
      }
      .meal-type-item:last-child {
        margin-bottom: 0;
      }
      .meal-type-item-selected {
        border: .1rem solid #ffc35a;
        background-color: #fff7e9;
        box-shadow: 0 0 1.5rem #fff;
      }
    }
  }
}
</style>
