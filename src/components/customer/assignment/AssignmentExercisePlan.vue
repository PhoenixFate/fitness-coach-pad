<template>
  <div id="assignment-exercise-plan">
    <h5>训练计划</h5>
    <ExercisePlanHeader
      :planList="planList"
      :customer="customer"
      :plan-dialog-flag.sync="planDialogFlag"
      @exercisePeriodInitData="exercisePeriodInitData"
      @showPlanListDialog="showPlanListDialog"
      style="margin-top: .7rem"
    ></ExercisePlanHeader>
    <div class="divider"></div>
    <div v-if="customer.customerPlan.trainingPlan && customer.customerPlan.customerPlanPeriods">
      <div v-for="(period,periodIndex) in customer.customerPlan.customerPlanPeriods" :key="periodIndex">
        <ExercisePeriod
          :periodIndex="period.periodIndex"
          :classInfoList="classInfoList"
          :customer="customer"
          :periodName="period.periodName"
          :weeks="period.customerPlanWeeks"
          ref="exercisePeriod"
        >
        </ExercisePeriod>
        <div class="divider" v-if="periodIndex!==1"></div>
      </div>
      <div class="empty-block"></div>
    </div>
    <div class="empty-training-plan" v-if="!customer.customerPlan.trainingPlan">
      <img src="images/customer/exercisePlan/plan-empty.png" alt="">
      <p>请先选择训练计划</p>
    </div>
  </div>
</template>

<script>
import ExercisePlanHeader from "components/customer/assignment/exercisePlan/ExercisePlanHeader";
import 'vue2-datepicker/index.css';
import ExercisePeriod from "components/customer/assignment/exercisePlan/ExercisePeriod";

export default {
  name: "AssignmentExercisePlan",
  components: {ExercisePlanHeader, ExercisePeriod},
  data() {
    return {}
  },
  created() {
  },
  methods: {
    exercisePeriodInitData() {
      if (this.$refs.exercisePeriod && this.$refs.exercisePeriod.length > 0) {
        this.$refs.exercisePeriod.forEach((period) => {
          period.initData()
        })
      }
    },
    showPlanListDialog() {
      this.$emit("update:planDialogFlag", true)
    },
  },
  props: {
    planList: Array,
    customer: Object,
    classInfoList: Array,
    planDialogFlag: Boolean,
  }
}
</script>

<style lang="scss">
#assignment-exercise-plan {
  margin-top: -.3rem;

  > h5 {
    font-size: 1.4rem;
    font-family: PingFangSC-Semibold, PingFang SC;
    font-weight: 600;
    color: #23262D;
    margin: .2rem 0;
    padding-left: 1.5rem;
  }

  .mx-datepicker {
    width: 6rem;
  }

  .divider {
    width: 100%;
    height: .4rem;
    background: #F1F2F5;
    z-index: 5000;
  }

  .empty-training-plan {
    height: 22rem;
    background-color: #fff;
    margin: 1.36vw 0;
    border-radius: .3rem;
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;

    img {
      width: auto;
      height: 14rem;
      margin-top: 1rem;
    }

    p {
      color: #888;
      font-size: .8rem;
      margin-top: .8rem;
    }
  }

  .empty-block {
    width: 100%;
    height: 1.8vw;
  }

}
</style>
