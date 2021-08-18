<template>
    <div class="analysis-item-content">
      <div class="left">
        <div class="left-item">
          <strong>评估方法: </strong>
          <span>{{ bodyAnalysis.method }}</span>
        </div>
        <div class="left-item">
          <strong>建议强化训练: </strong>
          <span>{{ bodyAnalysis.advice }}</span>
        </div>
        <div class="left-customer">
          <h5>客户情况</h5>
          <div class="customer-select" v-if="itemIndex===0">
            <q-radio v-model="customer.bodyStatusData.spineLordosis" val="1" label="正常" color="teal"/>
            <q-radio v-model="customer.bodyStatusData.spineLordosis" val="3" label="轻微" color="orange"/>
            <q-radio v-model="customer.bodyStatusData.spineLordosis" val="5" label="严重" color="red"/>
          </div>
          <div class="customer-select" v-if="itemIndex===1">
            <q-radio v-model="customer.bodyStatusData.roundShoulder" val="1" label="正常" color="teal"/>
            <q-radio v-model="customer.bodyStatusData.roundShoulder" val="3" label="轻微" color="orange"/>
            <q-radio v-model="customer.bodyStatusData.roundShoulder" val="5" label="严重" color="red"/>
          </div>
          <div class="customer-select" v-if="itemIndex===2">
            <q-radio v-model="customer.bodyStatusData.cervicalLordosis" val="1" label="正常" color="teal"/>
            <q-radio v-model="customer.bodyStatusData.cervicalLordosis" val="3" label="轻微" color="orange"/>
            <q-radio v-model="customer.bodyStatusData.cervicalLordosis" val="5" label="严重" color="red"/>
          </div>
          <div class="customer-select" v-if="itemIndex===3">
            <q-radio v-model="customer.bodyStatusData.highOrLowWaist" val="1" label="正常" color="teal"/>
            <q-radio v-model="customer.bodyStatusData.highOrLowWaist" val="3" label="轻微" color="orange"/>
            <q-radio v-model="customer.bodyStatusData.highOrLowWaist" val="5" label="严重" color="red"/>
          </div>
          <div class="customer-select" v-if="itemIndex===4">
            <q-radio v-model="customer.bodyStatusData.highOrLowShoulder" val="1" label="正常" color="teal"/>
            <q-radio v-model="customer.bodyStatusData.highOrLowShoulder" val="3" label="轻微" color="orange"/>
            <q-radio v-model="customer.bodyStatusData.highOrLowShoulder" val="5" label="严重" color="red"/>
          </div>
          <div class="customer-select" v-if="itemIndex===5">
            <q-radio v-model="customer.bodyStatusData.headTilt" val="1" label="正常" color="teal"/>
            <q-radio v-model="customer.bodyStatusData.headTilt" val="3" label="轻微" color="orange"/>
            <q-radio v-model="customer.bodyStatusData.headTilt" val="5" label="严重" color="red"/>
          </div>
        </div>
      </div>
      <div class="right">
        <img :src="bodyAnalysis.imageURL" alt="">
      </div>
    </div>
</template>

<script>
export default {
  name: "BodyAnalysisRightItem",
  data() {
    return {
    }
  },
  props: {
    itemIndex:Number,
    bodyAnalysis: Object,
    customer:Object,
  }
}
</script>

<style scoped lang="scss">
.analysis-item-content {
  width: 100%;
  height: 20rem;
  display: flex;

  .left {
    width: 60%;
    height: 100%;
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    justify-content: flex-start;
    position: relative;
    padding-left: .3rem;
    color: #515151;
    .left-item {
      font-size: .9rem;
      line-height: 1.8rem;

      strong {
        color: #19a6e7;
      }
      margin-top: .5rem;
    }

    .left-customer {
      position: absolute;
      bottom: 1.5rem;

      h5 {
        font-size: 1rem;
        color: #2f8ccc;
        font-weight: bold;
      }

      .customer-select {
        font-size: .9rem;
      }
    }
  }
  .right {
    width: 40%;
    img {
      width: 100%;
      height: 90%;
      border-radius: .4rem;
    }
  }
}
</style>
