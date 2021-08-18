<template>
  <div id="coach-userinfo-content">
    <div class="userinfo-header">
    </div>
    <div class="userinfo-form">
      <div class="avatar" @click="toUploadImage">
        <img :src="coach.avatar" alt="" v-if="coach.avatar">
        <img src="images/coach/coach-avatar-male.png" alt="" v-if="!coach.avatar && (coach.gender===null || coach.gender==1)">
        <img src="images/coach/coach-avatar-female.png" alt="" v-if="!coach.avatar && coach.gender==2">
        <div class="edit">
          <img src="images/mine/userinfo/camera.png" alt="">
        </div>
      </div>
      <div class="form">
        <div class="form-item">
          <div class="must">*</div>
          <img src="images/customer/form/name.png" alt="">
          <div class="form-item-right">
            <span>姓名</span>
            <q-input placeholder="请输入姓名" v-model="coach.coachName"/>
          </div>
        </div>
        <div class="form-item">
          <div class="must">*</div>
          <img src="images/customer/form/phone.png" alt="">
          <div class="form-item-right">
            <span>手机号</span>
            <q-input placeholder="请输入11位手机号码" v-model="coach.mobile"/>
          </div>
        </div>
        <div class="form-item">
          <div class="must">*</div>
          <img src="images/customer/form/gender.png" alt="">
          <div class="form-item-right">
            <span>性别</span>
            <div class="q-gutter-sm">
              <q-radio keep-color v-model="coach.gender" val="1" label="男" color="red"/>
              <q-radio keep-color v-model="coach.gender" val="2" label="女" color="cyan"/>
            </div>
          </div>
        </div>
        <div class="form-item">
          <img src="images/customer/form/idNumber.png" alt="">
          <div class="form-item-right">
            <span>身份证</span>
            <q-input placeholder="请输入18位身份证号" v-model="coach.identityCard"/>
          </div>
        </div>
        <div class="form-item">
          <img src="images/customer/form/mail.png" alt="">
          <div class="form-item-right">
            <span>邮箱</span>
            <q-input placeholder="请输入邮箱" type="email" v-model="coach.mail"/>
          </div>
        </div>
        <div class="form-item">
          <img src="images/customer/form/birth.png" alt="">
          <div class="form-item-right">
            <span>生日</span>
            <q-input v-model="coach.birthday" placeholder="YYYY-MM-DD">
              <template v-slot:append>
                <q-icon name="event" class="cursor-pointer">
                  <q-popup-proxy ref="qDateProxy" transition-show="scale" transition-hide="scale">
                    <q-date v-model="coach.birthday" mask="YYYY-MM-DD" @input="() => $refs.qDateProxy.hide()"/>
                  </q-popup-proxy>
                </q-icon>
              </template>
            </q-input>
          </div>
        </div>

        <div class="finish" @click="updateCoachInfo">
          <div>保存信息</div>
        </div>
      </div>
    </div>


    <transition enter-active-class="animate__fadeIn animate__faster"
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

    <transition enter-active-class="animate__slideInDown animate__faster"
                leave-active-class="animate__zoomOut animate__fast">
      <AlertMessage
        :alert-message-flag.sync="alertMessageFlag"
        :message="alertMessage"
        class="animate__animated"
        style="z-index: 3000"
        v-show="alertMessageFlag"
      >
      </AlertMessage>
    </transition>

    <input style="display: none" type="file" ref="refUploadFile" accept="image/*" @change="readLocalFile">


  </div>
</template>

<script>
import SaveFinished from "components/common/SaveFinished";
import {apiCoachByUserId,apiUpdateCoach} from "src/api/coach";
import AlertMessage from "components/common/AlertMessage";
import {apiUploadImage} from "src/api/upload";
import "./q-radio.scss"
export default {
  name: "Index",
  components: {SaveFinished,AlertMessage},
  data() {
    return {
      coach: {},
      //保存相关属性
      saveDialogFlag: false,
      saveItemSuccessfully: false,
      saveItemFailed: false,
      saveDialogHeaderImage: "images/common/form-header.png",
      saveMessage: "客户基本信息",

      alertMessage: "",
      alertMessageFlag: false,
    }
  },
  created() {
    let coach=localStorage.getItem("coach")
    if(coach){
      this.coach=JSON.parse(coach)
      if(this.coach.gender){
        this.coach.gender=this.coach.gender+""
      }
    }else {
      this.$router.push("/login")
    }
    //加载最新coach数据
    this.loadData()
  },
  methods: {
    loadData(){
      console.log(this.coach)
      apiCoachByUserId(this.coach.userId).then((res)=>{
        if(res.data.data.gender){
          res.data.data.gender+=""
        }
        this.coach=res.data.data
      })
    },
    toUploadImage() {
      this.$refs.refUploadFile.click();
    },
    //点击上传图片
    readLocalFile() {
      let file = this.$refs.refUploadFile.files[0]
      let params = new FormData()  // 创建form对象
      params.append('file', file)  // 通过append向form对象添加数据
      params.append('prefix', 'coach') // 添加form表单中其他数据
      apiUploadImage(params).then((res) => {
        this.coach.avatar=res.data.data
      })
    },
    updateCoachInfo() {
      if (!this.coach.coachName) {
        this.alertMessage = "请填写姓名"
        this.alertMessageFlag = true
        return
      }
      if (!this.coach.mobile) {
        this.alertMessage = "请填写手机号"
        this.alertMessageFlag = true
        return
      }
      if (!this.coach.gender) {
        this.alertMessage = "请选择性别"
        this.alertMessageFlag = true
        return
      }
      if (this.coach.birthday) {
        let dateFormat = /^([1-9]\d{3})-(\d{2})-(\d{2})$/;
        if (dateFormat.test(this.coach.birthday)) {

        } else {
          this.alertMessage = "生日格式错误，正确的格式例如：1990-01-01"
          this.alertMessageFlag = true
          return
        }
      }

      this.saveMessage = "\"" + this.coach.coachName + "\"这个教练信息"
      this.saveDialogFlag = true

      apiUpdateCoach(this.coach).then((res) => {
        //更换localstorage中的coach
        localStorage.setItem("coach",JSON.stringify(this.coach))
        this.saveItemSuccessfully = true
      }).catch(()=>{
        this.saveItemFailed = true;
      }).finally(()=>{
        setTimeout(() => {
          this.saveDialogFlag = false
          setTimeout(() => {
            this.saveItemFailed = false;
          }, 1000)
        }, 800)
      })
    }
  }
}
</script>

<style scoped lang="scss">
#coach-userinfo-content {
  background-color: #f5f5f5;
  height: 100%;
  width: 100%;

  .userinfo-header {
    height: 15rem;
    width: 100%;
    background-image: url("../../../assets/images/mine/info/userinfo-background-02.png");
    background-repeat: no-repeat;
    background-size: 100% 100%;
  }

  .userinfo-form {
    width: 80%;
    margin: -6.5rem auto 0;
    height: 30rem;
    background-color: #fff;
    border-radius: 1rem;
    box-shadow: .15rem .15rem .4rem #999;
    position: relative;

    .avatar {
      width: 6.5rem;
      height: 6.5rem;
      position: absolute;
      left: 50%;
      margin-left: -3.1rem;
      margin-top: -4.5rem;
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
        right:.1rem;
        bottom: -.2rem;

        img {
          width: 100%;
          height: 100%;
        }
      }
    }

    .form {
      width: 100%;
      height: 100%;
      background-color: #fff;
      border-radius: .5rem;
      padding: 3rem 8% 0 10%;
      position: relative;

      .form-item {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: .5rem;
        position: relative;
        img {
          width:2rem;
          height:2rem;
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
          top: .2rem;
          left: -1.5rem;
        }

        .form-item-right {
          width: 84%;
          display: flex;
          justify-content: space-between;
          align-items: center;

          span {
            width: 30%;
            font-size: .9rem;
          }

          label {
            flex: 1;
            font-size: .8rem;
          }

          .q-gutter-sm {
            flex: 1;
          }
        }
      }

      .finish {
        height: 2.5rem;
        width: 50%;
        margin: 10px auto 0;
        background: linear-gradient(to right, #2864e8, #4499f7);
        border-radius: .6rem;
        text-align: center;
        line-height: 2.5rem;
        font-size: 1rem;
        color: #fff;
        font-weight: bold;
        box-shadow: .1rem .15rem .3rem #b9baba;
        overflow: hidden;
        position: absolute;
        bottom: 2rem;
        left: 25%;

        div {
          width: 100%;
          height: 100%;
          border-radius: .6rem;
          box-shadow: -.15rem -.1rem .3rem #075386 inset;
        }
      }
    }
  }
}
</style>
