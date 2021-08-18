<template>
  <div id="customer-body-test-data">
    <div class="line">
      <div class="line-item">
        <div class="body-item">
          <img src="images/customer/bodyTest/new/height.png" alt="">
          <div class="body-item-right">
            <span>身高</span>
            <div class="body-item-input">
              <q-input v-model="customer.bodyTestData.height" style="text-align: right" type="number"/>
              <strong>cm</strong>
            </div>
          </div>
        </div>
        <div class="body-item">
          <img src="images/customer/bodyTest/new/weight.png" alt="">
          <div class="body-item-right">
            <span>体重</span>
            <div class="body-item-input">
              <q-input v-model="customer.bodyTestData.weight" style="text-align: right"/>
              <strong>kg</strong>
            </div>
          </div>
        </div>
        <div class="body-item">
          <img src="images/customer/bodyTest/new/body-fat.png" alt="">
          <div class="body-item-right">
            <span>体脂</span>
            <div class="body-item-input">
              <q-input v-model="customer.bodyTestData.bodyFat" style="text-align: right" type="number"/>
              <strong>%</strong>
            </div>
          </div>
        </div>
      </div>
      <div class="line-item">
        <div class="body-item">
          <img src="images/customer/bodyTest/new/bust.png" alt="">
          <div class="body-item-right">
            <span>胸围</span>
            <div class="body-item-input">
              <q-input v-model="customer.bodyTestData.bust" style="text-align: right" type="number"/>
              <strong>cm</strong>
            </div>
          </div>
        </div>
        <div class="body-item">
          <img src="images/customer/bodyTest/new/waist.png" alt="">
          <div class="body-item-right">
            <span>腰围</span>
            <div class="body-item-input">
              <q-input v-model="customer.bodyTestData.waistLine" style="text-align: right" type="number"/>
              <strong>cm</strong>
            </div>
          </div>
        </div>
        <div class="body-item">
          <img src="images/customer/bodyTest/new/hipline.png" alt="">
          <div class="body-item-right">
            <span>臀围</span>
            <div class="body-item-input">
              <q-input v-model="customer.bodyTestData.hipLine" style="text-align: right" type="number"/>
              <strong>cm</strong>
            </div>
          </div>
        </div>

      </div>
    </div>

    <div class="line">
      <div class="line-item">
        <div class="body-item">
          <img src="images/customer/bodyTest/new/age.png" alt="">
          <div class="body-item-right">
            <span>年龄</span>
            <div class="body-item-input">
              <span v-if="customer.age">{{ customer.age }}</span>
              <span v-if="!customer.age">-</span>
              <strong>岁</strong>
            </div>
          </div>
        </div>
        <div class="body-item">
          <img src="images/customer/bodyTest/new/heart.png" alt="">
          <div class="body-item-right">
            <span>静态心率</span>
            <div class="body-item-input">
              <q-input v-model="customer.bodyTestData.staticHeartRate" style="text-align: right" type="number"/>
              <strong>bpm</strong>
            </div>
          </div>
        </div>
        <div class="body-item">
          <img src="images/customer/bodyTest/new/bmi.png" alt="">
          <div class="body-item-right">
            <span>BMI</span>
            <div class="body-item-input">
              <span>{{ getBMI }}</span>
              <strong>kg/㎡</strong>
            </div>
          </div>
        </div>
        <div class="body-item">
          <img src="images/customer/bodyTest/new/bmr.png" alt="">
          <div class="body-item-right">
            <span>BMR</span>
            <div class="body-item-input">
              <span>{{ getBMR }}</span>
              <strong>kCal</strong>
            </div>
          </div>
        </div>

      </div>

      <div class="line-item">
        <div class="body-item">
          <img src="images/customer/bodyTest/new/right-arm.png" alt="">
          <div class="body-item-right">
            <span>右上臂</span>
            <div class="body-item-input">
              <q-input v-model="customer.bodyTestData.rightUpperArm" style="text-align: right" type="number"/>
              <strong>cm</strong>
            </div>
          </div>
        </div>
        <div class="body-item">
          <img src="images/customer/bodyTest/new/left-arm.png" alt="">
          <div class="body-item-right">
            <span>左上臂</span>
            <div class="body-item-input">
              <q-input v-model="customer.bodyTestData.leftUpperArm" style="text-align: right" type="number"/>
              <strong>cm</strong>
            </div>
          </div>
        </div>
        <div class="body-item">
          <img src="images/customer/bodyTest/new/right-leg.png" alt="">
          <div class="body-item-right">
            <span>右大腿</span>
            <div class="body-item-input">
              <q-input v-model="customer.bodyTestData.rightThigh" style="text-align: right" type="number"/>
              <strong>cm</strong>
            </div>
          </div>
        </div>
        <div class="body-item">
          <img src="images/customer/bodyTest/new/left-leg.png" alt="">
          <div class="body-item-right">
            <span>左大腿</span>
            <div class="body-item-input">
              <q-input v-model="customer.bodyTestData.leftThigh" style="text-align: right" type="number"/>
              <strong>cm</strong>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import "./input.scss"
export default {
  name: "BodyTestForm",
  data() {
    return {}
  },
  methods: {},
  props: {
    customer: Object
  },
  computed: {//计算属性
    getBMI: function () {
      if (this.customer.bodyTestData.height && this.customer.bodyTestData.weight) {
        // eslint-disable-next-line vue/no-side-effects-in-computed-properties
        this.customer.bodyTestData.bmi = (parseFloat(this.customer.bodyTestData.weight) / parseFloat(this.customer.bodyTestData.height / 100) / parseFloat(this.customer.bodyTestData.height / 100)).toFixed(2)
        this.$forceUpdate()
        return this.customer.bodyTestData.bmi
      } else {
        return ""
      }
    },
    /**
     * BMR的计算公式
     * 男性：BMR=10 X 体重（kg） + 6.25 X 身高(cm) - 5 X 年龄 + 5
     * 女性：BMR=10 X 体重（kg） + 6.25 X 身高（cm） - 5 x 年龄 - 161
     */
    getBMR: function () {
      if (this.customer.bodyTestData.height && this.customer.bodyTestData.weight && this.customer.age) {
        if (this.customer.gender == 1) {
          // eslint-disable-next-line vue/no-side-effects-in-computed-properties
          this.customer.bodyTestData.bmr = 10 * this.customer.bodyTestData.weight + 6.25 * this.customer.bodyTestData.height - 5 * this.customer.age + 5
        } else {
          // eslint-disable-next-line vue/no-side-effects-in-computed-properties
          this.customer.bodyTestData.bmr = 10 * this.customer.bodyTestData.weight + 6.25 * this.customer.bodyTestData.height - 5 * this.customer.age - 161
        }
        this.$forceUpdate()
        return this.customer.bodyTestData.bmr
      }
      return ""
    }
  },
}
</script>

<style lang="scss">
#customer-body-test-data {
  width: 100%;
  margin: 0 auto;

  .q-field__native {
    text-align: right;
  }

  .line {
    display: flex;
    justify-content: space-between;
  }

  .line-item {
    width: calc(50% - .4rem);
    height: 100%;
    padding: .5rem;
    border-radius: .3rem;
    border: .05rem solid #EBECEF;

    .body-item {
      height: 2.3rem;
      padding: 0 .5rem;
      font-size: .8rem;
      display: flex;
      align-items: center;

      img {
        width: 1.4rem;
        height: 1.4rem;
      }

      .body-item-right {
        flex: 1;
        display: flex;
        justify-content: space-between;
        padding-left: 6.8%;
        align-items: center;

        .body-item-input {
          display: flex;
          justify-content: flex-end;
          align-items: center;
          font-size: 1.1rem;
          color: #23262D;

          strong {
            font-size: 1.1rem;
            margin-left: .3rem;
            font-weight: 600;
            color: #D1D1D7;
          }

          span {
            font-size: 1.1rem;
            font-family: Staatliches-Regular, Staatliches;
            font-weight: 400;
            color: #23262D;;
          }

          label {
            width: 1.8rem;
            font-size: 1.1rem;

            input {
              text-align: right;
            }

            .q-field__native {
              text-align: right;
            }
          }
        }
      }
    }
  }

  .line:nth-child(2) {
    margin-top: .8rem;
  }
}
</style>
