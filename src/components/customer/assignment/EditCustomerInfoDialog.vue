<template>
  <div id="edit-customer-info-dialog-content">
    <BackgroundBlack @click.native="hiddenDialog"></BackgroundBlack>
    <div class="customer-info-dialog">
      <div class="avatar" @click="toUploadImage">
        <img :src="customer.avatar" alt="" v-if="customer.avatar">
        <img src="images/home/avatar-male.png" alt=""
             v-if="!customer.avatar && (customer.gender===null || customer.gender==1)">
        <img src="images/home/avatar-female.png" alt="" v-if="!customer.avatar && customer.gender==2">
        <div class="edit">
          <img src="images/mine/userinfo/camera.png" alt="">
        </div>
      </div>
      <div class="form-item">
        <div class="must">*</div>
        <img src="images/customer/form/name.png" alt="">
        <div class="form-item-right">
          <span>姓名</span>
          <q-input placeholder="请输入姓名" v-model="customer.name"/>
        </div>
      </div>
      <div class="form-item">
        <div class="must">*</div>
        <img src="images/customer/form/phone.png" alt="">
        <div class="form-item-right">
          <span>手机号</span>
          <q-input placeholder="请输入11位手机号码" v-model="customer.mobile" type="number"/>
        </div>
      </div>
      <div class="form-item">
        <div class="must">*</div>
        <img src="images/customer/form/gender.png" alt="">
        <div class="form-item-right">
          <span>性别</span>
          <div class="q-gutter-sm">
            <q-radio keep-color v-model="customer.gender" val=1 label="男" color="red"/>
            <q-radio keep-color v-model="customer.gender" val=2 label="女" color="cyan"/>
          </div>
        </div>
      </div>
      <div class="form-item">
        <img src="images/customer/form/idNumber.png" alt="">
        <div class="form-item-right">
          <span>身份证</span>
          <q-input placeholder="请输入18位身份证号" v-model="customer.identityCard"/>
        </div>
      </div>
      <div class="form-item">
        <img src="images/customer/form/birth.png" alt="">
        <div class="form-item-right">
          <span>生日</span>
          <q-input v-model="customer.birthday" placeholder="YYYY-MM-DD">
            <template v-slot:append>
              <q-icon name="event" class="cursor-pointer">
                <q-popup-proxy ref="qDateProxy" transition-show="scale" transition-hide="scale">
                  <q-date v-model="customer.birthday" mask="YYYY-MM-DD" @input="() => $refs.qDateProxy.hide()"/>
                </q-popup-proxy>
              </q-icon>
            </template>
          </q-input>
        </div>
      </div>
      <div class="form-item">
        <img src="images/customer/form/mail.png" alt="">
        <div class="form-item-right">
          <span>邮箱</span>
          <q-input placeholder="请输入邮箱" type="email" v-model="customer.mail"/>
        </div>
      </div>
      <div class="form-item">
        <img src="images/customer/form/city.png" alt="">
        <div class="form-item-right">
          <span>城市</span>
          <div class="province-city">
            <van-field readonly required clickable :value="valueArea" placeholder="请选择所在地区" @click="bindShow"/>
            <!--选择省市区-->
            <van-popup v-model="showArea" position="bottom" :style="{ height: '40%' }">
              <van-area :area-list="areaList" @confirm="onAreaConfirm" @cancel="bindCancel"/>
            </van-popup>
          </div>
        </div>
      </div>
      <div class="finish" @click="saveCustomer">
        <div>保存客户信息</div>
      </div>
    </div>
    <input style="display: none" type="file" ref="refUploadFile" accept="image/*" @change="readLocalFile">

    <transition enter-active-class="animate__slideInDown animate__faster"
                leave-active-class="animate__zoomOut animate__fast">
      <AlertMessage
        :alert-message-flag.sync="alertMessageFlag"
        :message="alertMessage"
        class="animate__animated"
        style="z-index: 4000"
        v-show="alertMessageFlag"
      >
      </AlertMessage>
    </transition>

  </div>
</template>

<script>
import BackgroundBlack from "components/common/BackgroundBlack";
import AreaInfo from "src/const/area/area";
import "./area.scss"
import {apiUploadImage} from "src/api/upload";
import AlertMessage from "components/common/AlertMessage";
import {getAge} from "src/util/dateUtil";
export default {
  name: "EditCustomerInfoDialog",
  components: {BackgroundBlack,AlertMessage},
  data() {
    return {
      areaList: AreaInfo, //引用地区信息
      showArea: false,
      valueArea: '', //地区值
      alertMessage:"",
      alertMessageFlag:false,
    }
  },
  mounted() {
    if(this.customer.city){
      this.valueArea=this.customer.province+"-"+this.customer.city+"-"+this.customer.county
    }
  },
  props: {
    customerInfoDialogFlag: Boolean,
    customer: Object,
  },
  methods: {
    hiddenDialog() {
      this.$emit("update:customerInfoDialogFlag", false)
    },
    //地区选择
    onAreaConfirm(val) {
      this.showArea = false;
      let addrInfo = val[0].name + '-' + val[1].name + '-' + val[2].name;
      this.customer.province = val[0].name
      this.customer.city = val[1].name
      this.customer.county = val[2].name
      this.valueArea = addrInfo
    },
    bindShow() {
      this.showArea = true;
    },
    bindCancel() {
      this.showArea = false;
    },
    saveCustomer() {
      if (!this.customer.name) {
        this.alertMessage = "请填写姓名"
        this.alertMessageFlag = true
        return
      }
      if (!this.customer.mobile) {
        this.alertMessage = "请填写手机号"
        this.alertMessageFlag = true
        return
      }
      if (!this.customer.gender) {
        this.alertMessage = "请选择性别"
        this.alertMessageFlag = true
        return
      }
      if (this.customer.birthday) {
        let dateFormat = /^([1-9]\d{3})-(\d{2})-(\d{2})$/;
        if (dateFormat.test(this.customer.birthday)) {
          this.customer.age=getAge(this.customer.birthday)
        } else {
          this.alertMessage = "生日格式错误，正确的格式例如：1990-01-01"
          this.alertMessageFlag = true
          return
        }
      }
      this.$emit("saveCustomerHeader")
    },
    toUploadImage() {
      this.$refs.refUploadFile.click();
    },
    //点击上传图片
    readLocalFile() {
      let file = this.$refs.refUploadFile.files[0]
      let params = new FormData()  // 创建form对象
      params.append('file', file)  // 通过append向form对象添加数据
      params.append('prefix', 'avatar') // 添加form表单中其他数据
      apiUploadImage(params).then((res) => {
        this.customer.avatar = res.data.data
      })
    },
  }
}
</script>

<style scoped lang="scss">
#edit-customer-info-dialog-content {
  z-index: 1;
  position: relative;
  .customer-info-dialog {
    width: 76%;
    height: 32rem;
    position: fixed;
    top: 50%;
    margin-top: -16rem;
    left: 15%;
    z-index: 2010;
    border-radius: 1rem;
    border: none;
    background-color: #fff;
    padding: 2.5rem 2rem 0 2.6rem;
    .avatar {
      width: 6rem;
      height: 6rem;
      position: absolute;
      left: 50%;
      margin-left: -3rem;
      margin-top: -6.5rem;
      border-radius: 50%;
      border: .2rem solid #f3b40b;
      z-index: 2;
      img {
        width: 100%;
        height: 100%;
        border-radius: 50%;
      }
      .edit {
        width: 2rem;
        height: 2rem;
        position: absolute;
        right: .1rem;
        bottom: -.2rem;
        img {
          width: 100%;
          height: 100%;
        }
      }
    }
    .form-item {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: .5rem;
      min-height:2.8rem;
      position: relative;
      img {
        width: 2rem;
        height: 2rem;
      }
      .must {
        width: 1.5rem;
        height: 100%;
        display: flex;
        justify-content: center;
        align-items: center;
        font-size:1.5rem;
        color: #f3253b;
        position: absolute;
        top: .2rem;
        left: -1.5rem;
      }
      .form-item-right {
        width: calc(100% - 4rem);
        display: flex;
        justify-content: space-between;
        align-items: center;
        span {
          width: 30%;
          font-size: .9rem;
        }
        label {
          flex: 1;
          font-size: .9rem;
        }
        .q-gutter-sm {
          flex: 1;
        }
        .province-city {
          flex: 1;
          border-bottom: 1px solid #c2c2c2;
        }
      }
    }
    .finish {
      height: 2.5rem;
      width: 50%;
      margin: .5rem auto 0;
      background: linear-gradient(to right, #2864e8, #4499f7);
      border-radius: .4rem;
      text-align: center;
      line-height: 2.5rem;
      font-size: 1rem;
      color: #fff;
      box-shadow: .1rem .15rem .25rem #b9baba;
      overflow: hidden;
      position: absolute;
      bottom: 2rem;
      left: 25%;
      > div {
        width: 100%;
        height: 100%;
        border-radius: .6rem;
        box-shadow: -.15rem -.2rem .3rem #075386 inset;
      }
    }

  }
}
</style>
