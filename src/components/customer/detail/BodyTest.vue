<template>
  <div id="customer-body-test-data">
    <div class="line"  v-if="customer.bodyTestData">
      <div class="line-item">
        <div class="body-item">
          <img src="images/customer/bodyTest/new/height.png" alt="">
          <div class="body-item-right">
            <span>身高</span>
            <div class="body-item-input">
              <span>{{customer.bodyTestData.height}}</span>
              <strong>cm</strong>
            </div>
          </div>
        </div>
        <div class="body-item">
          <img src="images/customer/bodyTest/new/weight.png" alt="">
          <div class="body-item-right">
            <span>体重</span>
            <div class="body-item-input">
              <span>{{customer.bodyTestData.weight}}</span>
              <strong>kg</strong>
            </div>
          </div>
        </div>
        <div class="body-item">
          <img src="images/customer/bodyTest/new/body-fat.png" alt="">
          <div class="body-item-right">
            <span>体脂</span>
            <div class="body-item-input">
              <span>{{customer.bodyTestData.bodyFat}}</span>
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
              <span>{{customer.bodyTestData.bust}}</span>
              <strong>cm</strong>
            </div>
          </div>
        </div>
        <div class="body-item">
          <img src="images/customer/bodyTest/new/waist.png" alt="">
          <div class="body-item-right">
            <span>腰围</span>
            <div class="body-item-input">
              <span>{{customer.bodyTestData.waistLine}}</span>
              <strong>cm</strong>
            </div>
          </div>
        </div>
        <div class="body-item">
          <img src="images/customer/bodyTest/new/hipline.png" alt="">
          <div class="body-item-right">
            <span>臀围</span>
            <div class="body-item-input">
              <span>{{customer.bodyTestData.hipLine}}</span>
              <strong>cm</strong>
            </div>
          </div>
        </div>

      </div>
    </div>
    <div class="line"  v-if="customer.bodyTestData">
      <div class="line-item">
        <div class="body-item">
          <img src="images/customer/bodyTest/new/age.png" alt="">
          <div class="body-item-right">
            <span>年龄</span>
            <div class="body-item-input">
              <span>{{customer.age}}</span>
              <strong>岁</strong>
            </div>
          </div>
        </div>
        <div class="body-item">
          <img src="images/customer/bodyTest/new/heart.png" alt="">
          <div class="body-item-right">
            <span>静态心率</span>
            <div class="body-item-input">
              <span>{{customer.bodyTestData.staticHeartRate}}</span>
              <strong>bpm</strong>
            </div>
          </div>
        </div>
        <div class="body-item">
          <img src="images/customer/bodyTest/new/bmi.png" alt="">
          <div class="body-item-right">
            <span>BMI</span>
            <div class="body-item-input">
              <span>{{customer.bodyTestData.bmi}}</span>
              <strong>kg/㎡</strong>
            </div>
          </div>
        </div>
        <div class="body-item">
          <img src="images/customer/bodyTest/new/bmr.png" alt="">
          <div class="body-item-right">
            <span>BMR</span>
            <div class="body-item-input">
              <span>{{customer.bodyTestData.bmr}}</span>
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
              <span>{{customer.bodyTestData.rightUpperArm}}</span>
              <strong>cm</strong>
            </div>
          </div>
        </div>
        <div class="body-item">
          <img src="images/customer/bodyTest/new/left-arm.png" alt="">
          <div class="body-item-right">
            <span>左上臂</span>
            <div class="body-item-input">
              <span>{{customer.bodyTestData.leftUpperArm}}</span>
              <strong>cm</strong>
            </div>
          </div>
        </div>
        <div class="body-item">
          <img src="images/customer/bodyTest/new/right-leg.png" alt="">
          <div class="body-item-right">
            <span>右大腿</span>
            <div class="body-item-input">
              <span>{{customer.bodyTestData.rightThigh}}</span>
              <strong>cm</strong>
            </div>
          </div>
        </div>
        <div class="body-item">
          <img src="images/customer/bodyTest/new/left-leg.png" alt="">
          <div class="body-item-right">
            <span>左大腿</span>
            <div class="body-item-input">
              <span>{{customer.bodyTestData.leftThigh}}</span>
              <strong>cm</strong>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "BodyTest",
  components:{},
  data() {
    return {

    }
  },
  methods: {},
  props:{
    customer:Object,
  }
}
</script>

<style scoped lang="scss">
#customer-body-test-data {
  width: 100%;
  margin: 0 auto;
  .line {
    display: flex;
    justify-content: space-between;
  }
  .line-item {
    width: calc(50% - .5rem);
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
        align-items: center;
        padding-left: 1rem;
        .body-item-input {
          display: flex;
          justify-content: center;
          align-items: center;
          span {
            font-size: 1.1rem;
            font-weight: 600;
          }
          strong {
            font-size: 1rem;
            margin-left: .4rem;
            color:#D1D1D7;
          }
        }

      }
    }
  }
  .line:nth-child(2) {
    margin-top: 1rem;
  }
}
</style>
