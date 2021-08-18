<template>
  <div id="customer-diet-plan-dialog-context">
    <BackgroundBlack @click.native="hiddenDialog"></BackgroundBlack>
    <div class="customer-diet-plan-dialog-content">
      <h5>饮食计划</h5>
      <div class="content-scroll">
        <div class="diet-plan-time">
          <span>开始日期</span>
          <date-picker
            v-model="customerDietPlan.startDate"
            format="YYYY-MM-DD"
            valueType="format"
            placeholder="开始日期"
            style="width: 8rem"
          ></date-picker>
        </div>
        <div class="diet-plan-time">
          <span>结束日期</span>
          <date-picker
            v-model="customerDietPlan.endDate"
            format="YYYY-MM-DD"
            valueType="format"
            placeholder="结束日期"
            style="width: 8rem"
          ></date-picker>
        </div>
        <div class="diet-plan-time diet-plan-attention">
          <span>注意事项</span>
          <textarea v-model="customerDietPlan.attention"></textarea>
        </div>
        <div class="diet-plan-time diet-plan-select">
          <span>饮食计划</span>
          <div class="diet-plan-name-empty" @click="showDietPlanDialog" v-if="!customerDietPlan.dietPlan">
            <span>点击选择饮食计划</span>
            <img src="images/template/click.png" alt="">
          </div>
          <div class="diet-plan-name" @click="showDietPlanDialog" v-if="customerDietPlan.dietPlan">
            <span>{{ customerDietPlan.dietPlan.dietPlanName }}</span>
            <img src="images/template/click.png" alt="">
          </div>
        </div>

        <div v-if="customerDietPlan.dietPlan">
          <DietPlanDetailItem
            :diet-plan-item="dietPlanItem"
            v-for="(dietPlanItem,dietPlanItemIndex) in customerDietPlan.dietPlan.dietPlanItems"
            :key="dietPlanItemIndex"
          >
          </DietPlanDetailItem>
        </div>

      </div>
      <div class="finish" @click="saveCustomerDietPlan">
        <div>保存饮食计划</div>
      </div>
    </div>

    <DietPlanDialog
      :diet-plan-dialog-flag.sync="dietPlanDialogFlag"
      :dietPlanList="dietPlanList"
      @selectOneDietPlan="selectOneDietPlan"
      class="animate__animated"
      style="z-index: 3000"
      v-if="dietPlanDialogFlag"
    >
    </DietPlanDialog>

    <AlertMessage
      :alert-message-flag.sync="alertMessageFlag"
      :message="alertMessage"
      class="animate__animated"
      style="z-index: 3000"
      v-show="alertMessageFlag"
    >
    </AlertMessage>

  </div>
</template>

<script>
import BackgroundBlack from "components/common/BackgroundBlack";
import "../../customer/detail/input.scss"
import DatePicker from 'vue2-datepicker';
import 'vue2-datepicker/index.css';
import DietPlanDialog from "components/dialog/DietPlanDialog";
import {apiDietPlanList} from "src/api/dietPlan";
import DietPlanDetailItem from "components/diet/dietPlan/DietPlanDetailItem";
import AlertMessage from "components/common/AlertMessage";

export default {
  name: "BodyTestDialog",
  components: {
    BackgroundBlack,
    DatePicker,
    DietPlanDetailItem,
    DietPlanDialog,
    AlertMessage
  },
  data() {
    return {
      dietPlanList: [],
      dietPlanDialogFlag: false,
      alertMessage: "",
      alertMessageFlag: false,
    }
  },
  props: {
    customerDietPlanDialogFlag: Boolean,
    customerDietPlan: Object
  },
  created() {
    this.loadDataCommon()
  },
  methods: {
    loadDataCommon() {
      apiDietPlanList({limit: 100}).then((res) => {
        this.dietPlanList = res.data.data.list
        console.log(this.dietPlanList)
      })
    },
    showDietPlanDialog() {
      this.dietPlanDialogFlag = true
    },
    selectOneDietPlan(index) {
      this.customerDietPlan.dietPlanId = this.dietPlanList[index].dietPlanId
      this.customerDietPlan.dietPlan = this.dietPlanList[index]
    },
    hiddenDialog() {
      this.$emit("update:customerDietPlanDialogFlag", false)
    },
    saveCustomerDietPlan() {
      if (!this.customerDietPlan.startDate) {
        this.alertMessageFlag = true
        this.alertMessage = "请选择开始日期"
        return
      }
      if (!this.customerDietPlan.endDate) {
        this.alertMessageFlag = true
        this.alertMessage = "请选择结束日期"
        return
      }
      if (!this.customerDietPlan.dietPlan) {
        this.alertMessageFlag = true
        this.alertMessage = "请选择饮食计划"
        return
      }

      this.$emit("update:customerDietPlanDialogFlag", false)
      this.$emit("saveCustomerDietPlan")
    }
  },
}
</script>

<style scoped lang="scss">
#customer-diet-plan-dialog-context {
  z-index: 1;
  position: relative;

  .customer-diet-plan-dialog-content {
    width: 70%;
    height: 36rem;
    position: fixed;
    top: 50%;
    margin-top: -18rem;
    left: 15%;
    z-index: 2010;
    border-radius: 1rem;
    background-color: #fff;

    h5 {
      line-height: 2.5rem;
      text-align: center;
      font-size: 1.2rem;
    }

    .content-scroll {
      height: 30rem;
      width: 100%;
      overflow-y: scroll;
      padding-bottom: 1rem;

      .diet-plan-time {
        height: 3rem;
        width: 100%;
        padding-left: 3rem;
        line-height: 3rem;

        > span {
          font-size: .9rem;
          margin-right: 2rem;
        }
      }

      .diet-plan-attention {
        height: 8rem;
        display: flex;
        justify-content: flex-start;
        align-items: flex-start;
        padding-top: .5rem;

        textarea {
          width: 15rem;
          height: 7rem;
          outline: none;
          border: 1px solid #999;
          border-radius: .3rem;
          resize: none;
          padding: .6rem;
          line-height: 1.3rem;
        }
      }

      .diet-plan-select {
        display: flex;
        justify-content: flex-start;
        align-items: center;

        .diet-plan-name-empty, .diet-plan-name {
          padding: 0 1.2rem;
          display: flex;
          justify-content: center;
          align-items: center;
          background-color: #e3e3e3;
          border-radius: .3rem;
          line-height: 2.6rem;

          > span {
            margin-right: .6rem;
            font-size: 1rem;
          }

          img {
            height: 1.6rem;
            width: 1.6rem;
          }
        }

        .diet-plan-name {
          background-color: #f6e1a5;
        }
      }

    }

    .finish {
      position: absolute;
      bottom: 1.2rem;
      height: 2rem;
      width: 40%;
      left: 30%;
      background: linear-gradient(to right, #eac867, #f1d4a3);
      border-radius: .3rem;
      text-align: center;
      line-height: 2rem;
      font-size: .9rem;
      font-weight: 500;
      color: #fff;
      box-shadow: .1rem .1rem .2rem #b9baba;
      overflow: hidden;

      div {
        width: 100%;
        height: 100%;
        border-radius: .3rem;
        box-shadow: -.1rem -.1rem .3rem #eccc72 inset;
      }
    }
  }
}
</style>
