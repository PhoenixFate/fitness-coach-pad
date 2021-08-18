<template>
  <div class="analysis-right">
    <div class="analysis-item">
      <div class="analysis-title" style="margin-left: .8rem">
        <strong>合理建议</strong>
      </div>
      <div class="advice">
        <div class="advice-text">
          <textarea v-model="customer.bodyStatusData.advice" placeholder="请输入合理建议"></textarea>
        </div>
      </div>
    </div>
    <van-collapse v-model="activeNames">
      <van-collapse-item name="1">
        <template #title>
          <div class="analysis-title">
            <strong>体态总揽</strong>
          </div>
        </template>
        <div class="analysis-bodies">
          <div class="analysis-body">
            <img src="images/customer/bodyAnalysis/body-01.png" alt="">
            <p>正常</p>
            <q-radio  v-model="customer.bodyStatusData.bodyCommon" val="1" />
          </div>
          <div class="analysis-body">
            <img src="images/customer/bodyAnalysis/body-02.png" alt="">
            <p>原肩</p>
            <q-radio  v-model="customer.bodyStatusData.bodyCommon" val="2" />
          </div>
          <div class="analysis-body">
            <img src="images/customer/bodyAnalysis/body-03.png" alt="">
            <p>驼背</p>
            <q-radio  v-model="customer.bodyStatusData.bodyCommon" val="3" />
          </div>
          <div class="analysis-body">
            <img src="images/customer/bodyAnalysis/body-04.png" alt="">
            <p>探颈</p>
            <q-radio  v-model="customer.bodyStatusData.bodyCommon" val="4" />
          </div>
          <div class="analysis-body">
            <img src="images/customer/bodyAnalysis/body-05.png" alt="">
            <p>盆骨前倾</p>
            <q-radio  v-model="customer.bodyStatusData.bodyCommon" val="5" />
          </div>
          <div class="analysis-body">
            <img src="images/customer/bodyAnalysis/body-06.png" alt="">
            <p>盆骨后倾</p>
            <q-radio  v-model="customer.bodyStatusData.bodyCommon" val="6" />
          </div>
        </div>
      </van-collapse-item>
      <van-collapse-item :name="itemIndex" v-for="(bodyAnalysisItem,itemIndex) in bodyAnalysisData" :key="itemIndex">
        <template #title>
          <div class="analysis-title">
            <strong>{{bodyAnalysisItem.title}}</strong>
          </div>
        </template>
        <BodyAnalysisRightItem
          :item-index="itemIndex"
          :customer="customer"
          :bodyAnalysis="bodyAnalysisItem">
        </BodyAnalysisRightItem>
      </van-collapse-item>
    </van-collapse>

  </div>
</template>

<script>
import { BodyAnalysisData } from "src/const/customer/assignment/bodyAnalysisData"
import BodyAnalysisRightItem from "components/customer/assignment/bodyAnalysis/BodyAnalysisRightItem";
import "./vant-collapse.scss"
export default {
  name: "BodyAnalysisRight",
  components:{BodyAnalysisRightItem},
  data(){
    return {
      bodyAnalysisData:BodyAnalysisData,
      activeNames: [],
    }
  },
  props:{
    customer:Object
  }
}
</script>

<style scoped lang="scss">
.analysis-right {
  background-color: #fff;
  width: 69%;
  height: 100%;
  overflow: scroll;
  margin-left: 1%;
  border-radius: .3rem;
  padding-bottom: 1.5rem;
  .analysis-title {
    width: 12rem;
    height: 2.5rem;
    background-image: url("../../../../assets/images/customer/assignment/blue-title.png");
    background-repeat: no-repeat;
    background-size: 100% 100%;
    font-size: 1rem;
    color:#fff;
    text-align: left;
    line-height: 2.5rem;
    strong {
      margin-left: 1rem;
    }
  }
  .analysis-bodies {
    display: flex;
    justify-content: space-between;
    .analysis-body {
      display: flex;
      flex-direction: column;
      align-items: center;
      width:14.2%;
      img {
        width: 100%;
        height: auto;
      }
      p {
        text-align: center;
        font-size: .8rem;
        color: #555;
        margin: .5rem 0;
      }
    }

  }
  .analysis-item {
    width: 100%;
    margin-bottom: 1.5rem;
    .analysis-title {
      width: 12rem;
      height: 2.5rem;
      background-image: url("../../../../assets/images/customer/assignment/blue-title.png");
      background-repeat: no-repeat;
      background-size: 100% 100%;
      font-size: 1rem;
      color:#fff;
      text-align: left;
      line-height: 2.5rem;
      margin: .5rem 0;
      strong {
        margin-left: 1rem;
      }
    }
    .advice {
      height: 15rem;
      width: 92%;
      margin: 0 auto;
      background-image: url("../../../../assets/images/customer/assignment/advice-background2.png");
      background-repeat: no-repeat;
      background-size: 100% 100%;
      display: flex;
      justify-content: center;
      align-items: center;
      .advice-text {
        margin-top: -1%;
        margin-left: -3%;
        width: 80%;
        height: 74%;
        background-color: #26A69A;
        textarea{
          width: 100%;
          height: 100%;
          border: none;
          resize: none;
          font-size: 1rem;
        }
      }
    }
  }
}
</style>
