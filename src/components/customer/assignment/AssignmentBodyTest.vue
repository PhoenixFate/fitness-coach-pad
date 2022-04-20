<template>
  <div id="assignment-body-test-content">
    <div class="title row">
      <span class="col">
        体测数据录入
      </span>
      <!--<q-btn rounded flat color="common-set" icon="refresh" @click="connectingToScanDevice()">链接体脂仪</q-btn>-->
    </div>
    <BodyTestForm :customer="customer" style="margin-bottom: 1.3rem"></BodyTestForm>
    <div class="title">
      体态数据录入
    </div>
    <BodyStatus :customer="customer" style="margin-bottom: 1.3rem"></BodyStatus>
    <div class="title">
      选择训练目标
    </div>
    <ExercisePurpose
      :goal-id="customer.goalId"
      :goal-list="trainingGoalList"
      @selectTrainingGoal="selectTrainingGoal"
      style="margin-bottom: 1.3rem"
    ></ExercisePurpose>
  </div>
</template>

<script>
import BodyTestForm from 'components/customer/assignment/bodyTest/BodyTestForm';
import BodyStatus from 'components/customer/assignment/bodyTest/BodyStatus';
import ExercisePurpose from 'components/customer/assignment/bodyTest/ExercisePurpose';
import { syncDeviceData } from 'src/api/customer';
export default {
  name: 'AssignmentBodyTest',
  components: { BodyTestForm, BodyStatus, ExercisePurpose },
  data() {
    return {};
  },
  props: {
    customer: Object,
    trainingGoalList: Array
  },
  methods: {
    selectTrainingGoal(goalId) {
      this.customer.goalId = goalId;
    },
    connectingToScanDevice() {
      this.$q.loading.show({ message: '正在连接扫描仪，同步数据' });
      setTimeout(() => {
        //checking timeout
      });
      syncDeviceData(this.customer.customerId)
        .then(res => {
          this.customer.bodyTestData = res.data.data;
        })
        .finally(() => {
          this.$q.loading.hide();
        })
        .catch(error => {
          this.$q.notify({
            type: 'warning',
            message: '连接失败，请重新尝试'
          });
        });
    }
  }
};
</script>

<style scoped lang="scss">
#assignment-body-test-content {
  padding: 0 1.4rem;
  .title {
    height: 3rem;
    width: 100%;
    font-size: 1.3rem;
    line-height: 3rem;
    font-family: PingFangSC-Semibold, PingFang SC;
    font-weight: 600;
    color: #23262d;
  }
}
</style>
