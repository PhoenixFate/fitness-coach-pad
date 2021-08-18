<template>
  <div id="body-test-content">
    <div class="body-test-header">
    </div>
    <div class="body-test-add" @click="showBodyTestDialogAdd">
      <img src="images/customer/bodyTest/add.png" alt="">
      <span>+</span>
    </div>
    <div class="body-test-body">
      <div class="body-test-item" v-for="(bodyTest,itemIndex) in bodyTestList" :key="itemIndex">
        <div class="status status-new" v-if="itemIndex===0">NEW</div>
        <div class="status status-old" v-if="itemIndex!==0">OLD</div>
        <div class="item-header">
          <div class="header-left">
            <span>体测日期: </span><strong>{{ bodyTest.addTime }}</strong>
          </div>
          <div class="header-modify" @click="showBodyTestDialogUpdate(itemIndex)">
            <img src="images/customer/bodyTest/modify.png" alt="">
          </div>
        </div>
        <div class="item-content">
          <div class="body-test-line">
            <div class="body-item">
              <img src="images/customer/bodyTest/height.png" alt="">
              <div class="body-item-right">
                <span>身高</span>
                <div class="body-item-input">
                  <strong>{{ bodyTest.height }}</strong>
                  <span>cm</span>
                </div>
              </div>
            </div>
            <div class="body-item">
              <img src="images/customer/bodyTest/bust.png" alt="">
              <div class="body-item-right">
                <span>胸围</span>
                <div class="body-item-input">
                  <strong>{{ bodyTest.bust }}</strong>
                  <span>cm</span>
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
                  <strong>{{ bodyTest.weight }}</strong>
                  <span>kg</span>
                </div>
              </div>
            </div>
            <div class="body-item">
              <img src="images/customer/bodyTest/waist.png" alt="">
              <div class="body-item-right">
                <span>腰围</span>
                <div class="body-item-input">
                  <strong>{{ bodyTest.waistLine }}</strong>
                  <span>cm</span>
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
                  <strong>{{ bodyTest.bodyFat }}</strong>
                  <span>%</span>
                </div>
              </div>
            </div>
            <div class="body-item">
              <img src="images/customer/bodyTest/hip.png" alt="">
              <div class="body-item-right">
                <span>臀围</span>
                <div class="body-item-input">
                  <strong>{{ bodyTest.hipLine }}</strong>
                  <span>cm</span>
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
                  <strong>{{ age }}</strong>
                  <span>岁</span>
                </div>
              </div>
            </div>
            <div class="body-item">
              <img src="images/customer/bodyTest/arm-right.png" alt="">
              <div class="body-item-right">
                <span>右上臂</span>
                <div class="body-item-input">
                  <strong>{{ bodyTest.rightUpperArm }}</strong>
                  <span>cm</span>
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
                  <strong>{{ bodyTest.staticHeartRate }}</strong>
                  <span>次/分钟</span>
                </div>
              </div>
            </div>
            <div class="body-item">
              <img src="images/customer/bodyTest/arm-left.png" alt="">
              <div class="body-item-right">
                <span>左上臂</span>
                <div class="body-item-input">
                  <strong>{{ bodyTest.leftUpperArm }}</strong>
                  <span>cm</span>
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
                  <strong>{{ bodyTest.bmi }}</strong>
                  <span>kg/㎡</span>
                </div>
              </div>
            </div>
            <div class="body-item">
              <img src="images/customer/bodyTest/leg-right.png" alt="">
              <div class="body-item-right">
                <span>右大腿</span>
                <div class="body-item-input">
                  <strong>{{ bodyTest.rightThigh }}</strong>
                  <span>cm</span>
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
                  <strong>{{ bodyTest.bmr }}</strong>
                  <span>kCal</span>
                </div>
              </div>
            </div>
            <div class="body-item">
              <img src="images/customer/bodyTest/leg-left.png" alt="">
              <div class="body-item-right">
                <span>左大腿</span>
                <div class="body-item-input">
                  <strong>{{ bodyTest.leftThigh }}</strong>
                  <span>cm</span>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>

    <BodyTestDialog
      :bodyTestDialogFlag.sync="bodyTestDialogFlag"
      :bodyTest="tempBodyTest"
      :age="age"
      :gender="gender"
      @saveBodyTest="saveBodyTest"
      class="animate__animated"
      style="z-index: 3000"
      v-if="bodyTestDialogFlag"
    >
    </BodyTestDialog>
    <transition enter-active-class="animate__fadeIn animate__faster"
                leave-active-class="animate__fadeOut animate__faster"
    >
      <SaveFinished
        :save-item-successfully="saveItemSuccessfully"
        :save-item-failed="saveItemFailed"
        :save-dialog-header-image="saveDialogHeaderImage"
        :save-message="saveMessage"
        class="animate__animated"
        style="z-index: 4000"
        v-if="saveDialogFlag"
      ></SaveFinished>
    </transition>
  </div>
</template>

<script>
import {apiBodyTestList, apiUpdateBodyTest, apiSaveBodyTest} from "src/api/customer";
import BodyTestDialog from "components/dialog/customer/BodyTestDialog";
import SaveFinished from "components/common/SaveFinished";

export default {
  components: {BodyTestDialog, SaveFinished},
  name: "CustomerBodyTestPage",
  created() {
    if (!this.$route.query.customerId) {
      this.alertMessage = "您当前跳转的页面不合法"
      this.alertMessageFlag = true
    } else {
      this.customerId = this.$route.query.customerId
      this.loadData()
      this.age = this.$route.query.age + ""
      this.gender = this.$route.query.gender +""
    }
  },
  data() {
    return {
      customerId: -1,
      age: null,
      gender: null,
      bodyTestList: [],
      tempBodyTest: {},
      bodyTestDialogFlag: false,

      //点击保存之后的相关属性
      saveDialogFlag: false,
      saveItemSuccessfully: false,
      saveItemFailed: false,
      saveDialogHeaderImage: "images/customer/detail/save-header.png",
      saveMessage: "客户体测信息",
    }
  },
  methods: {
    loadData() {
      apiBodyTestList(this.customerId).then(({data}) => {
        console.log(data)
        this.bodyTestList = data.data
      })
    },
    showBodyTestDialogAdd() {
      this.tempBodyTest = {
        customerId: this.customerId
      }
      this.bodyTestDialogFlag = true
    },
    showBodyTestDialogUpdate(index) {
      this.tempBodyTest = JSON.parse(JSON.stringify(this.bodyTestList[index]));
      this.bodyTestDialogFlag = true
    },
    saveBodyTest() {
      this.saveDialogFlag = true
      if (this.tempBodyTest.bodyTestId) {
        // 修改
        apiUpdateBodyTest(this.tempBodyTest).then(() => {
          this.saveItemSuccessfully = true
          this.loadData()
        }).catch(() => {
          this.saveItemFailed = true;
        }).finally(() => {
          this.hideSaveDialog()
        })
      } else {
        // 新增
        apiSaveBodyTest(this.tempBodyTest).then(() => {
          this.saveItemSuccessfully = true
          this.loadData()
        }).catch(() => {
          this.saveItemFailed = true;
        }).finally(() => {
          this.hideSaveDialog()
        })
      }
    },
    hideSaveDialog() {
      setTimeout(() => {
        this.saveDialogFlag = false
        setTimeout(() => {
          this.saveItemSuccessfully = false
          this.saveItemFailed = false
          this.saveCustomerInfoFlag = false
        }, 1400)
      }, 1000)
    }
  }
}
</script>

<style scoped lang="scss">
#body-test-content {
  height: 100%;
  width: 100%;
  background-color: #eeecec;
  position: relative;

  .body-test-header {
    height: 16rem;
    width: 100%;
    background-image: url("../../../../assets/images/customer/bodyTest/body-test-background2.png");
    background-size: 100% 100%;
  }

  .body-test-add {
    width: 4rem;
    height: 4rem;
    position: absolute;
    top: -1.5rem;
    right: 1rem;
    z-index: 3000;
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: 2.8rem;
    font-weight: 300;
    padding-bottom: .4rem;
    padding-left: .1rem;
    color: #0c5fba;

    img {
      width: 100%;
      height: 100%;
      position: absolute;
      left: 0;
      top: 0;
    }
  }

  .body-test-body {
    width: 90%;
    position: fixed;
    left: 5%;
    height: 86%;
    top: 11%;
    overflow-y: scroll;
    padding: .5rem;

    .body-test-item {
      height: 20rem;
      width: 100%;
      border-radius: 1rem;
      background-image: url("../../../../assets/images/customer/bodyTest/body-test-item-background.png");
      box-shadow: 0 .2rem .2rem #7ebdff;
      background-size: 100% 100%;
      margin-bottom: 1.2rem;
      position: relative;
      overflow: hidden;

      .item-header {
        height: 4rem;
        width: 100%;
        position: relative;

        .header-left {
          height: 4rem;
          width: 20rem;
          display: flex;
          justify-content: flex-start;
          align-items: center;
          padding-left: 3rem;
          padding-top: .6rem;

          span {
            margin-right: 1.6rem;
            font-size: 1rem;
          }

          strong {
            font-size: .8rem;
          }
        }

        .header-modify {
          width: 3rem;
          height: 3rem;
          position: absolute;
          right: 1.5rem;
          top: .6rem;
          display: flex;
          justify-content: center;
          align-items: center;

          img {
            width: 2rem;
            height: 2rem;
          }
        }
      }

      .status {
        position: absolute;
        width: 5rem;
        height: 5rem;
        left: -2.3rem;
        top: -2.3rem;
        color: #fff;
        font-size: .8rem;
        transform: rotate(-45deg);
        display: flex;
        justify-content: center;
        align-items: flex-end;
        padding-bottom: .2rem;
        font-weight: bold;
      }

      .status-new {
        color: #33c155;
      }

      .status-old {
        color: #f1934b;
      }

      .item-content {
        width: 100%;
        height: 16rem;
        padding: .2rem 2rem 0 2rem;

        .body-test-line {
          width: 100%;
          height: 2rem;
          display: flex;
          justify-content: space-between;

          .body-item {
            width: 45%;
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
                  font-size: .6rem;
                  font-weight: normal;
                }

                strong {
                  font-size: .8rem;
                  margin-left: .3rem;
                  font-weight: bold;
                  margin-right: .3rem;
                }
              }
            }
          }
        }
      }
    }
  }
}
</style>
