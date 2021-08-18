<template>
  <div class="period-title">
    <div class="period">
      {{chineseIndex[periodIndex-1]}}
      <div class="shadow"></div>
    </div>
    {{periodName}}
  </div>
</template>

<script>
import {ChineseIndex} from "src/const/customer/assignment/chineseIndexData";
export default {
  name: "PeriodTitle",
  data(){
    return {
      chineseIndex:ChineseIndex,
    }
  },
  props:{
    periodIndex: Number,
    periodName: String,
  }
}
</script>

<style scoped lang="scss">
.period-title {
  position: absolute;
  left: .3rem;
  top: -.7rem;
  width: 30%;
  height: 3rem;
  background-color: #99d3ff;
  border-radius: .5rem;
  box-shadow: .15rem .15rem .15rem #a09dd6;
  padding-left: 3.6rem;
  font-size: 1rem;
  color: #4a82f1;
  line-height: 3rem;
  font-weight: bold;
  .period {
    position: absolute;
    width: 3rem;
    height: 3rem;
    left: -.6rem;
    top: -.4rem;
    background-color: #51affd;
    border-top-left-radius: .5rem;
    border-bottom-left-radius: .5rem;
    box-shadow: .1rem .1rem .1rem #827fbc;
    color: #216af9;
    text-align: center;
    font-weight: bold;
    font-size: 1.3rem;
    .shadow {
      width: 0;
      height: 0;
      border-bottom: .4rem solid #777777;
      border-right: .9rem solid transparent;
      position: absolute;
      top: 0;
      right: -.9rem;
    }
  }
}
</style>
