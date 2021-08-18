<template>
  <div class="one-day" :class="currentDayIndex===index?'one-day-selected':''">
    <span>周{{ chineseDays[dayOfWeek] }}</span>
    <span>{{ detailDate.substring(8, 10) |zeroFormat}}</span>
    <div class="circle">
      <div class="selected" v-if="classInfo && isActive===1"></div>
    </div>
  </div>
</template>

<script>
export default {
  name: "DayItem",
  data() {
    return {
      chineseDays: ['日', '一', '二', '三', '四', '五', '六'],
    }
  },
  filters: {
    zeroFormat: function (num) {
      return parseInt(num)
    }
  },
  props: {
    index: Number,
    currentDayIndex: Number,
    dayOfWeek: Number,
    detailDate: String,
    classInfo: Object,
    isActive: Number,
  }
}
</script>

<style scoped lang="scss">
.one-day {
  width: 2.4rem;
  height: 4.3rem;
  display: flex;
  flex-direction: column;
  text-align: center;
  font-size: .9rem;
  border-radius: .3rem;
  span:nth-child(1){
    color: #ABACB4;
    font-size: .6rem;
    font-weight: 600;
    margin-top: .4rem;
  }
  span:nth-child(2) {
    font-size: 1.5rem;
    font-family: Staatliches-Regular, Staatliches;
    margin-top: .5rem;
    line-height: 1.5rem;
  }
  .circle {
    width: 100%;
    height: .5rem;
    display: flex;
    justify-content: center;
    align-items: center;
    margin-top: .1rem;
    .selected {
      width: .3rem;
      height: .3rem;
      background-color: #ABACB4;;
      border-radius: 50%;
    }
  }
}
.one-day-selected {
  background: #23262D;
  color: #fff;
  span:nth-child(1) {
    color:#fff;
  }
  .circle {
    .selected {
      background-color: #fff;
    }
  }
}
</style>
