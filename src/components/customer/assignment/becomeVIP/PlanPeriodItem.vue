<template>
    <div class="day-item">
      <span>{{ detailDate }}</span>
      <span>{{ chineseWeek[dayOfWeek] }}</span>
      <span v-if="classInfo">{{ classInfo.className }}</span>
      <span>
      <strong v-for="(exercise,exerciseIndex) in classInfo.exercises"
              :key="exerciseIndex">
        {{ exercise.exerciseName }}
        <span>、</span>
      </strong>
    </span>
    </div>
</template>

<script>
import {ChineseWeek} from "src/const/customer/assignment/chineseIndexData";
export default {
  name: "PlanPeriodItem",
  data(){
    return {
      chineseWeek:ChineseWeek
    }
  },
  props:{
    detailDate:String,
    dayOfWeek:Number,
    classInfo:Object,
  }
}
</script>

<style scoped lang="scss">
.day-item {
  width: 94%;
  margin: .5rem auto;
  display: flex;
  span {
    display: block;
    text-align: center;
    font-size: .8rem;
    strong {
      font-weight: normal;
    }
  }
  span:nth-child(1) {
    width: 20%;
  }
  span:nth-child(2) {
    width: 12%;
  }
  span:nth-child(3) {
    width: 26%;
  }
  span:nth-child(4) {
    width: 40%;
  }
  span:last-child{
    span {
      display: inline-block;
      width: .6rem;
      padding: 0;
    }
    strong:last-child {
      span {
        display: none;
      }
    }
  }
}
</style>
