<template>
  <div class="week-number">
    <div class="number-right">
      <div class="select" :class="index===currentWeekIndex?'selected':''">
        第 <strong>{{index+1}}</strong>周
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "WeekItem",
  props:{
    index:Number,
    currentWeekIndex:Number
  }
}
</script>

<style scoped lang="scss">
.week-number {
  display: flex;
  line-height: 3rem;
  text-align: center;
  margin: .5rem 0 .5rem 4%;
  width: 96%;
  .number-left {
    width: 30%;
    height: 3.5rem;
    background-color: #add7ff;
    margin-right: 4%;
    border-radius: .4rem;
    display: flex;
    justify-content: center;
    align-items: center;
    opacity: 0.7;
    .circle {
      width: .8rem;
      height: .8rem;
      border-radius: 50%;
      border: .1rem solid #4a82f1;
    }
    .circle-selected {
      border: none;
      background-color: #ee7e7e;
    }
  }
  .number-right {
    flex: 1;
    height: 3.5rem;
    background-color: #add7ff;
    color: #296aea;
    border-radius: .4rem;
    font-size: .9rem;
    opacity: 0.7;
    padding: .4rem;
    line-height: 2.8rem;
    .select {
      width: 100%;
      height: 100%;
      background: linear-gradient(to right, #c3c0f5, rgba(255, 255, 255, 0));
      color: #5c44b1;
      border-radius: .2rem;
    }
    .selected {
      width: 100%;
      height: 100%;
      background: linear-gradient(to right, #ee9393, rgba(255, 255, 255, 0));
      color: #f31d0a;
      border-radius: .2rem;
    }
  }
}
</style>
