<template>
  <div id="exercise-item-content">
    <BackgroundBlack @click.native="hiddenDialog"></BackgroundBlack>
    <div class="list-content">
      <div class="exercise-item"
           v-for="(exerciseItem,index) in exerciseList"
           :class="index===currentIndex?'exercise-item-selected':''"
           @click="selectItem(index)"
           :key="index">
        {{ exerciseItem.exerciseName }}
      </div>
    </div>
  </div>
</template>
<script>
import BackgroundBlack from "components/common/BackgroundBlack";
export default {
  name: "ExerciseItemList",
  components: {BackgroundBlack},
  data() {
    return {
      currentIndex: -1,
    }
  },
  props: {
    exerciseList:Array,
    exerciseDialogFlag: Boolean,
    currentClassInfo: Object,
  },
  mounted() {
    this.currentIndex=-1
  },
  methods: {
    selectItem(index) {
      this.currentIndex = index;
      this.currentClassInfo.exercises.push(this.exerciseList[index])
      setTimeout(() => {
        this.currentIndex = -1;
        this.$emit("update:exerciseDialogFlag", false)
      }, 500)
    },
    hiddenDialog() {
      this.$emit("update:exerciseDialogFlag", false)
    },
  }
}
</script>

<style scoped lang="scss">
#exercise-item-content {
  height: 100%;
  width: 100%;
  position: relative;
  z-index: 1;

  .list-content {
    width: 50%;
    height: 30rem;
    overflow-y: scroll;
    position: fixed;
    top: 50%;
    margin-top: -15rem;
    left: 25%;
    background-color: #fff;
    z-index: 2010;
    border-radius: 1rem;
    padding: 2rem;
    border: none;

    .exercise-item {
      width: 100%;
      height: 3.5rem;
      margin-bottom: .9rem;
      background-color: rgba(255, 255, 255, 0.78);
      line-height: 3.5rem;
      text-align: center;
      font-size: 1.1rem;
      box-shadow: 0 0 .3rem #b3b3b3;
      position: relative;
      border-radius: .4rem;
    }

    .exercise-item:last-child {
      margin-bottom: 0;
    }

    .exercise-item-selected {
      background-color: #f8e3e3;
      color: #81324d;
      box-shadow: 0 0 .3rem #81324d;
    }
  }
}
</style>
