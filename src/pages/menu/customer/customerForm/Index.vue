<template>
  <div id="customer-form-content">
    <div class="customer-form">
      <h5>请先录入客户信息</h5>
      <div class="gender-select">
        <div class="one-gender">
          <div class="gender-image" @click="selectGender(1)">
            <img src="images/customer/form/gender-male-select.png" alt="" />
            <div v-if="customer.gender === 1"></div>
          </div>
          <span :class="customer.gender === 1 ? 'gender-selected' : ''">男性</span>
        </div>
        <div class="one-gender" @click="selectGender(2)">
          <div class="gender-image">
            <img src="images/customer/form/gender-female-select.png" alt="" />
            <div v-if="customer.gender === 2"></div>
          </div>
          <span :class="customer.gender === 2 ? 'gender-selected' : ''">女性</span>
        </div>
      </div>
      <div class="customer-info1">
        <div class="customer-info1-line">
          <div class="info-label">
            <span>*</span>
            <span>姓名</span>
          </div>
          <q-input placeholder="请填写姓名" v-model="customer.name" />
        </div>
        <div class="customer-info1-line">
          <div class="info-label">
            <span>*</span>
            <span>手机号</span>
          </div>
          <q-input placeholder="请填写手机号" v-model="customer.mobile" />
        </div>
        <div class="customer-info1-line">
          <div class="info-label">
            <span>*</span>
            <span>生日</span>
          </div>
          <q-input v-model="customer.birthday" placeholder="YYYY-MM-DD" @input="ignore">
            <template v-slot:append>
              <q-icon name="event" class="cursor-pointer">
                <q-popup-proxy ref="qDateProxy" transition-show="scale" transition-hide="scale">
                  <q-date
                    minimal
                    :locale="chineseLocale"
                    v-model="customer.birthday"
                    default-year-month="1990/12"
                    mask="YYYY-MM-DD"
                    @input="() => $refs.qDateProxy.hide()"
                  />
                </q-popup-proxy>
              </q-icon>
            </template>
          </q-input>
        </div>
      </div>

      <div class="form-item">
        <img src="images/customer/form/new-card.png" alt="" />
        <div class="form-item-right">
          <span>身份证</span>
          <q-input placeholder="请输入18位身份证号" v-model="customer.identityCard" />
        </div>
      </div>

      <div class="form-item">
        <img src="images/customer/form/new-mail.png" alt="" />
        <div class="form-item-right">
          <span>邮箱</span>
          <q-input placeholder="请输入邮箱" type="email" v-model="customer.mail" />
        </div>
      </div>
      <div class="form-item">
        <img src="images/customer/form/new-city.png" alt="" />
        <div class="form-item-right">
          <span>城市</span>
          <div class="province-city">
            <van-field readonly required clickable :value="valueArea" placeholder="请选择城市" @click="bindShow" />
            <!--选择省市区-->
            <van-popup v-model="showArea" position="bottom" :style="{ height: '40%' }">
              <van-area :area-list="areaList" @confirm="onAreaConfirm" @cancel="bindCancel" />
            </van-popup>
          </div>
        </div>
      </div>
    </div>

    <div class="bottom-buttons">
      <div class="cancel" @click="doCancel">取消</div>
      <div class="finish" @click="saveCustomer">完成</div>
    </div>

    <transition
      enter-active-class="animate__fadeIn animate__faster"
      leave-active-class="animate__fadeOut animate__faster"
    >
      <SaveFinished
        :save-item-successfully="saveItemSuccessfully"
        :save-item-failed="saveItemFailed"
        :save-dialog-header-image="saveDialogHeaderImage"
        :save-message="saveMessage"
        class="animate__animated"
        style="z-index: 3000"
        v-show="saveDialogFlag"
      ></SaveFinished>
    </transition>
    <transition
      enter-active-class="animate__slideInDown animate__faster"
      leave-active-class="animate__zoomOut animate__fast"
    >
      <AlertMessage
        :alert-message-flag.sync="alertMessageFlag"
        :message="alertMessage"
        class="animate__animated"
        style="z-index: 3000"
        v-show="alertMessageFlag"
      >
      </AlertMessage>
    </transition>
  </div>
</template>

<script>
import SaveFinished from 'components/common/SaveFinished';
import AreaInfo from 'src/const/area/area';
import './area.scss';
import AlertMessage from 'components/common/AlertMessage';
import { apiSaveCustomer } from 'src/api/customer';
import chineseLocale from 'src/const/date/chinese-locale';
export default {
  name: 'CustomerForm',
  components: { SaveFinished, AlertMessage },
  data() {
    return {
      customer: {
        name: '',
        mobile: '',
        gender: '',
        identityCard: '',
        mail: '',
        birthday: '',
        province: '',
        city: '',
        county: ''
      },
      chineseLocale: chineseLocale,
      coach: {},
      //保存相关属性
      saveDialogFlag: false,
      saveItemSuccessfully: false,
      saveItemFailed: false,
      saveDialogHeaderImage: 'images/common/form-header.png',
      saveMessage: '客户基本信息',
      areaList: AreaInfo, //引用地区信息
      showArea: false,
      valueArea: '', //地区值
      alertMessage: '',
      alertMessageFlag: false
    };
  },
  created() {
    this.coach = JSON.parse(localStorage.getItem('coach'));
  },
  methods: {
    ignore(){},
    initData() {},
    bindShow() {
      this.showArea = true;
    },
    bindCancel() {
      this.showArea = false;
    },
    selectGender(gender) {
      this.customer.gender = gender;
    },
    //地区选择
    onAreaConfirm(val) {
      this.showArea = false;
      let addrInfo = val[0].name + '-' + val[1].name + '-' + val[2].name;
      this.customer.province = val[0].name;
      this.customer.city = val[1].name;
      this.customer.county = val[2].name;
      this.valueArea = addrInfo;
    },
    doCancel() {
      this.$router.go(-1);
    },
    saveCustomer() {
      console.log(this.customer);
      if (!this.customer.name) {
        this.alertMessage = '请填写姓名';
        this.alertMessageFlag = true;
        return;
      }
      if (!this.customer.mobile) {
        this.alertMessage = '请填写手机号';
        this.alertMessageFlag = true;
        return;
      }
      if (!this.customer.gender) {
        this.alertMessage = '请选择性别';
        this.alertMessageFlag = true;
        return;
      }
      if (this.customer.birthday) {
        let dateFormat = /^([1-9]\d{3})-(\d{2})-(\d{2})$/;
        if (dateFormat.test(this.customer.birthday)) {
        } else {
          this.alertMessage = '生日格式错误，正确的格式例如：1990-01-01';
          this.alertMessageFlag = true;
          return;
        }
      }
      this.customer.coachId = this.coach.coachId;
      let currentGym = JSON.parse(localStorage.getItem('gym'));
      this.customer.gymId = currentGym.gymId;
      this.saveMessage = '"' + this.customer.name + '"这个客户信息';
      this.saveDialogFlag = true;
      apiSaveCustomer(this.customer)
        .then(res => {
          this.saveItemSuccessfully = true;
          setTimeout(() => {
            this.$router.replace({ name: 'customerAssignment', query: { customerId: res.data.data.customerId } });
          }, 800);
        })
        .catch(() => {
          this.saveItemFailed = true;
        })
        .finally(() => {
          this.hideSaveDialog();
        });
    },
    hideSaveDialog() {
      setTimeout(() => {
        this.saveDialogFlag = false;
        setTimeout(() => {
          this.saveItemFailed = false;
        }, 1000);
      }, 800);
    }
  }
};
</script>

<style scoped lang="scss">
#customer-form-content {
  height: 100%;
  width: 100%;
  background: linear-gradient(to bottom, #feaf31 0%, #ffd896 100%);

  .customer-form {
    width: 94%;
    height: 82%;
    position: absolute;
    top: 7.4%;
    left: 3%;
    background-image: url('../../../../assets/images/customer/form/form-background.png');
    background-size: 100% 100%;
    padding-top: 5.6vh;

    h5 {
      text-align: center;
      font-size: 1.7rem;
      font-family: PingFangSC-Semibold, PingFang SC;
      font-weight: 600;
      color: #23262d;
    }

    .gender-select {
      width: 24rem;
      margin: 1.4vh auto;
      height: 12rem;
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding-top: 0.9rem;

      .one-gender {
        width: 12rem;
        height: 15rem;
        display: flex;
        justify-content: center;
        align-items: center;
        flex-direction: column;

        .gender-image {
          width: 10rem;
          height: 10rem;
          border-radius: 0.3rem;
          position: relative;

          img {
            width: 12.6rem;
            height: 11rem;
            position: absolute;
            left: -1.3rem;
            top: -0.5rem;
            z-index: 10;
          }

          div {
            width: 11.2rem;
            height: 10.5rem;
            border-radius: 0.4rem;
            position: absolute;
            left: -0.6rem;
            top: -0.6rem;
            border: 0.2rem solid #22262d;
          }
        }

        > span {
          font-size: 0.8rem;
          color: #aaabb3;
          margin-top: 0.3rem;
        }

        .gender-selected {
          color: #22262d;
        }
      }
    }

    .customer-info1 {
      width: 22.8rem;
      height: 9.6rem;
      border: 0.1rem solid #22262d;
      border-radius: 0.3rem;
      background-color: #f6f7fa;
      margin: 0.4vh auto 1.8vh;

      .customer-info1-line {
        display: flex;
        justify-content: space-between;
        align-items: center;
        height: 3.2rem;
        border-bottom: 0.05rem solid #fff;
        padding: 0 1.6rem 0 0.6rem;

        .info-label {
          font-size: 1.1rem;
          font-family: PingFangSC-Semibold, PingFang SC;
          font-weight: 600;
          color: #23262d;

          span:nth-child(1) {
            margin-right: 0.5rem;
          }
        }

        label {
          width: 10rem;
          text-align: right;
        }
      }
    }

    .form-item {
      display: flex;
      justify-content: space-between;
      align-items: center;
      height: 5vh;
      position: relative;
      width: 22.8rem;
      margin: 0 auto 0.5rem;
      border-bottom: 0.05rem solid #f3f4f7;

      img {
        width: 1.2rem;
        height: 1.2rem;
      }

      .must {
        width: 1.5rem;
        height: 100%;
        display: flex;
        justify-content: center;
        align-items: center;
        font-size: 1.5rem;
        color: #f3253b;
        position: absolute;
        top: 0.2rem;
        left: -1.5rem;
      }

      .form-item-right {
        width: calc(100% - 2rem);
        display: flex;
        justify-content: space-between;
        align-items: center;

        span {
          width: 36%;
          font-size: 0.9rem;
        }

        label {
          flex: 1;
        }

        .q-gutter-sm {
          flex: 1;
        }

        .province-city {
          flex: 1;
        }

        label {
          font-size: 0.9rem;
        }
      }
    }
  }

  .bottom-buttons {
    height: 12%;
    width: 22rem;
    display: flex;
    justify-content: space-between;
    align-items: center;
    position: absolute;
    bottom: 0;
    left: 50%;
    margin-left: -11rem;

    .cancel,
    .finish {
      width: 10.5rem;
      height: 3rem;
      border-radius: 0.3rem;
      background-color: #0b76bf;
      display: flex;
      justify-content: center;
      align-items: center;
      font-size: 1.1rem;
      font-weight: 600;
    }

    .cancel {
      background-color: #ebecef;
      color: #22262d;
    }

    .finish {
      background-color: #23262d;
      color: #ffffff;
    }
  }
}
</style>
