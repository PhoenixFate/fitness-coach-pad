<template>
  <div id="body-test-dialog-context">
    <BackgroundBlack @click.native="hiddenDialog"></BackgroundBlack>
    <div class="body-test-dialog-content">
      <h5>体测数据</h5>
      <div class="body-test-dialog-main">
        <div class="body-test-line">
          <div class="body-item">
            <img src="images/customer/bodyTest/height.png" alt="">
            <div class="body-item-right">
              <span>身高</span>
              <div class="body-item-input">
                <q-input v-model="bodyTest.height" type="number"/>
                <strong>cm</strong>
              </div>
            </div>
          </div>
          <div class="body-item">
            <img src="images/customer/bodyTest/bust.png" alt="">
            <div class="body-item-right">
              <span>胸围</span>
              <div class="body-item-input">
                <q-input v-model="bodyTest.bust" type="number"/>
                <strong>cm</strong>
              </div>
            </div>
          </div>
        </div>
        <div class="body-test-line">
          <div class="body-item">
            <img src="images/customer/bodyTest/weight.png" alt="">
            <div class="body-item-right">
              <span>体重</span>
              <div class="body-item-input">
                <q-input v-model="bodyTest.weight"/>
                <strong>kg</strong>
              </div>
            </div>
          </div>
          <div class="body-item">
            <img src="images/customer/bodyTest/waist.png" alt="">
            <div class="body-item-right">
              <span>腰围</span>
              <div class="body-item-input">
                <q-input v-model="bodyTest.waistLine" type="number"/>
                <strong>cm</strong>
              </div>
            </div>
          </div>
        </div>
        <div class="body-test-line">
          <div class="body-item">
            <img src="images/customer/bodyTest/body-fat.png" alt="">
            <div class="body-item-right">
              <span>体脂</span>
              <div class="body-item-input">
                <q-input v-model="bodyTest.bodyFat" type="number"/>
                <strong>%</strong>
              </div>
            </div>
          </div>
          <div class="body-item">
            <img src="images/customer/bodyTest/hip.png" alt="">
            <div class="body-item-right">
              <span>臀围</span>
              <div class="body-item-input">
                <q-input v-model="bodyTest.hipLine" type="number"/>
                <strong>cm</strong>
              </div>
            </div>
          </div>
        </div>


        <div class="body-test-line">
          <div class="body-item">
            <img src="images/customer/detail/person.png" alt="">
            <div class="body-item-right">
              <span>年龄</span>
              <div class="body-item-input">
                <span>{{ age }}</span>
                <strong>岁</strong>
              </div>
            </div>
          </div>
          <div class="body-item">
            <img src="images/customer/bodyTest/arm-right.png" alt="">
            <div class="body-item-right">
              <span>右上臂</span>
              <div class="body-item-input">
                <q-input v-model="bodyTest.rightUpperArm" type="number"/>
                <strong>cm</strong>
              </div>
            </div>
          </div>
        </div>

        <div class="body-test-line">
          <div class="body-item">
            <img src="images/customer/bodyTest/static-heart-beat.png" alt="">
            <div class="body-item-right">
              <span>静态心率</span>
              <div class="body-item-input">
                <q-input v-model="bodyTest.staticHeartRate" type="number"/>
                <strong>次/分钟</strong>
              </div>
            </div>
          </div>
          <div class="body-item">
            <img src="images/customer/bodyTest/arm-left.png" alt="">
            <div class="body-item-right">
              <span>左上臂</span>
              <div class="body-item-input">
                <q-input v-model="bodyTest.leftUpperArm" type="number"/>
                <strong>cm</strong>
              </div>
            </div>
          </div>
        </div>

        <div class="body-test-line">
          <div class="body-item">
            <img src="images/customer/bodyTest/bmi.png" alt="">
            <div class="body-item-right">
              <span>BMI</span>
              <div class="body-item-input">
                <span>{{ getBMI }}</span>
                <strong>kg/㎡</strong>
              </div>
            </div>
          </div>
          <div class="body-item">
            <img src="images/customer/bodyTest/leg-right.png" alt="">
            <div class="body-item-right">
              <span>右大腿</span>
              <div class="body-item-input">
                <q-input v-model="bodyTest.rightThigh" type="number"/>
                <strong>cm</strong>
              </div>
            </div>
          </div>
        </div>

        <div class="body-test-line">
          <div class="body-item">
            <img src="images/customer/bodyTest/bmr.png" alt="">
            <div class="body-item-right">
              <span>BMR</span>
              <div class="body-item-input">
                <span>{{ getBMR }}</span>
                <strong>kCal</strong>
              </div>
            </div>
          </div>
          <div class="body-item">
            <img src="images/customer/bodyTest/leg-left.png" alt="">
            <div class="body-item-right">
              <span>左大腿</span>
              <div class="body-item-input">
                <q-input v-model="bodyTest.leftThigh" type="number"/>
                <strong>cm</strong>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="finish" @click="saveBodyTest">
        <div>保存体测数据</div>
      </div>
    </div>
  </div>
</template>

<script>
import BackgroundBlack from "components/common/BackgroundBlack";
import "../../customer/detail/input.scss"

export default {
  name: "BodyTestDialog",
  components: {BackgroundBlack},
  data() {
    return {}
  },
  props: {
    bodyTestDialogFlag: Boolean,
    bodyTest: Object,
    age: String,
    gender: String
  },
  computed: {//计算属性
    getBMI: function () {
      if (this.bodyTest.height && this.bodyTest.weight) {
        // eslint-disable-next-line vue/no-side-effects-in-computed-properties
        this.bodyTest.bmi = (parseFloat(this.bodyTest.weight) / parseFloat(this.bodyTest.height / 100) / parseFloat(this.bodyTest.height / 100)).toFixed(2)
        this.$forceUpdate()
        return this.bodyTest.bmi
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
      if (this.bodyTest.height && this.bodyTest.weight && this.age) {
        if (this.gender == 1) {
          // eslint-disable-next-line vue/no-side-effects-in-computed-properties
          this.bodyTest.bmr = 10 * this.bodyTest.weight + 6.25 * this.bodyTest.height - 5 * this.age + 5
        } else {
          // eslint-disable-next-line vue/no-side-effects-in-computed-properties
          this.bodyTest.bmr = 10 * this.bodyTest.weight + 6.25 * this.bodyTest.height - 5 * this.age - 161
        }
        this.$forceUpdate()
        return this.bodyTest.bmr
      }
      return ""

    },
  },
  methods: {
    hiddenDialog() {
      this.$emit("update:bodyTestDialogFlag", false)
    },
    saveBodyTest() {
      this.$emit("update:bodyTestDialogFlag", false)
      this.$emit("saveBodyTest")
    }
  },
}
</script>

<style scoped lang="scss">
#body-test-dialog-context {
  z-index: 1;
  position: relative;

  .body-test-dialog-content {
    width: 82%;
    height: 29rem;
    position: fixed;
    top: 50%;
    margin-top: -15rem;
    left: 9%;
    z-index: 2010;
    border-radius: 1rem;
    background-color: #fff;

    h5 {
      line-height: 2.5rem;
      text-align: center;
      font-size: 1.2rem;
    }

    .body-test-dialog-main {
      width: 88%;
      height: auto;
      margin: 0 auto;

      .body-test-line {
        width: 100%;
        height: 3rem;
        display: flex;
        justify-content: space-between;

        .body-item {
          width: 47%;
          height: 100%;
          padding: .3rem;
          font-size: .9rem;
          display: flex;
          align-items: center;
          font-weight: 500;

          img {
            width: 1.8rem;
            height: 1.8rem;
          }

          .body-item-right {
            flex: 1;
            display: flex;
            justify-content: space-between;
            padding-left: 1.4rem;
            align-items: center;

            .body-item-input {
              display: flex;
              justify-content: flex-end;
              align-items: center;

              span {
                font-size: .8rem;
                font-weight: normal;
              }

              strong {
                font-size: .6rem;
                margin-left: .3rem;
                font-weight: normal;
              }

              label {
                width: 1.8rem;
                font-size: .8rem;
              }
            }
          }
        }
      }
    }

    .finish {
      position: absolute;
      bottom: 1.6rem;
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
