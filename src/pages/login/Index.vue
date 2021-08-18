<template>
  <div id="login-content">
    <div class="header">
      <img src="images/login/login-logo.png" alt="">
    </div>
    <div class="image-left">
      <img src="images/login/login-left.png" alt="">
    </div>
    <div class="image-right">
      <img src="images/login/login-right.png" alt="">
    </div>
    <div class="image-bottom">
      <img src="images/login/login-bottom.png" alt="">
    </div>
    <div class="login-content">
      <div class="login-form">
        <input type="text" placeholder="请输入用户名" v-model="loginInfo.username">
        <div class="input-password">
          <input :type="loginInfo.isPwd ? 'password' : 'text'" placeholder="请输入密码" v-model="loginInfo.password">
          <div class="change-type" @click="loginInfo.isPwd = !loginInfo.isPwd">
            <img src="images/login/password-see.png" alt="" v-if="!loginInfo.isPwd">
            <img src="images/login/password-hide.png" alt="" v-if="loginInfo.isPwd">
          </div>
        </div>
        <div class="select-gym" @click="showGymsDialog">
          <span v-if="!loginInfo.gym">请选择健身房</span>
          <span v-if="loginInfo.gym" style="color:#FFAD2A">{{ loginInfo.gym.gymName }}</span>
          <div class="select-pull">
            <img src="images/login/select-pull.png" alt="">
          </div>
          <div class="gym-list" v-if="gymsDialogFlag">
            <div class="one-gym" v-for="(gym,gymIndex) in gymList" :key="gymIndex" @click="selectOneGym(gymIndex)">
              {{ gym.gymName }}
            </div>
          </div>
        </div>
        <div class="error-message">
          {{ errorMessage }}
        </div>
        <div class="login-button"
             :class="loginInfo.username&&loginInfo.password&&loginInfo.agree&&loginInfo.gym?'login-button-ok':''"
             @click="loginApp">
          登录
        </div>
        <div class="agreement">
          <div @click="agreeProtocol">
            <img src="images/login/circle.png" alt="" v-if="!loginInfo.agree">
            <img src="images/login/circle-selected.png" alt="" v-if="loginInfo.agree">
          </div>
          <p>我已阅读并同意 <span>《健身管理系统使用协议》</span></p>
        </div>
        <!--<div class="form-line">-->
        <!--  <q-input v-model="loginInfo.username" placeholder="请输入用户名">-->
        <!--    <template v-slot:prepend>-->
        <!--      <q-icon name="img:images/login/username.png"/>-->
        <!--    </template>-->
        <!--  </q-input>-->
        <!--</div>-->
        <!--<div class="form-line">-->
        <!--  <q-input-->
        <!--    clearable-->
        <!--    v-model="loginInfo.password"-->
        <!--    :type="loginInfo.isPwd ? 'password' : 'text'"-->
        <!--    placeholder="请输入密码"-->
        <!--  >-->
        <!--    <template v-slot:prepend>-->
        <!--      <q-icon name="img:images/login/password.png"/>-->
        <!--    </template>-->
        <!--    <template v-slot:append>-->
        <!--      <q-icon-->
        <!--        :name="loginInfo.isPwd ? 'visibility_off' : 'visibility'"-->
        <!--        class="cursor-pointer"-->
        <!--        @click="loginInfo.isPwd = !loginInfo.isPwd"-->
        <!--        style="margin-right: 1.1rem"-->
        <!--      />-->
        <!--    </template>-->
        <!--  </q-input>-->
        <!--</div>-->
        <!--<div class="form-line">-->
        <!--  <div class="gym-line">-->
        <!--    <div class="gym-icon">-->
        <!--      <img src="images/login/gym.png" alt="">-->
        <!--    </div>-->
        <!--    <div class="gym-select" @click="showGymsDialog">-->
        <!--      <span v-if="!loginInfo.gym">请选择健身房</span>-->
        <!--      <span v-if="loginInfo.gym" style="color:#000">{{ loginInfo.gym.gymName }}</span>-->
        <!--    </div>-->
        <!--  </div>-->
        <!--</div>-->
        <!--<div class="form-line agreement">-->
        <!--  <div @click="agreeProtocol">-->
        <!--    <img src="images/login/ok.png" alt="" v-if="agree">-->
        <!--  </div>-->
        <!--  <h5>我已阅读并同意《<span>健身管理系统使用协议</span>》</h5>-->
        <!--</div>-->
        <!--<div class="error-message">-->
        <!--  <span v-if="errorMessage">{{ errorMessage }}</span>-->
        <!--</div>-->
        <!--<div class="login-button" @click="loginApp">-->
        <!--  登录-->
        <!--</div>-->
      </div>
    </div>
  </div>
</template>

<script>
import "./q-input.scss"
import {apiCoachByUserId, apiCoachLogin} from "src/api/coach";
import {apiGymList} from "src/api/gym";

export default {
  name: "Index",
  data() {
    return {
      loginInfo: {
        username: "",
        password: "",
        isPwd: true,
        userType: 2,
        gymId: null,
        gym: null,
        agree: false
      },
      errorMessage: "",
      gymList: [],
      gymsDialogFlag: false,
    }
  },
  filters: {
    passwordFormat(data) {
      return data.length
    }
  },
  created() {
    this.loadData()
  },
  methods: {
    loadData() {
      apiGymList({limit: 100}).then((res) => {
        this.gymList = res.data.data.list
        console.log(this.gymList)
      })
    },
    agreeProtocol() {
      this.loginInfo.agree = !this.loginInfo.agree
    },
    showGymsDialog() {
      this.gymsDialogFlag = !this.gymsDialogFlag
    },
    selectOneGym(gymIndex) {
      this.loginInfo.gym = this.gymList[gymIndex]
      this.loginInfo.gymId = this.gymList[gymIndex].gymId
      localStorage.setItem("gym", JSON.stringify(this.gymList[gymIndex]))
    },
    loginApp() {
      this.errorMessage = ""
      if (!this.loginInfo.username) {
        this.errorMessage = "用户名不能为空"
        return
      }
      if (!this.loginInfo.password) {
        this.errorMessage = "密码不能为空"
        return
      }
      if (!this.loginInfo.gym) {
        this.errorMessage = "请选择健身房"
        return
      }
      if (!this.loginInfo.agree) {
        this.errorMessage = "请勾选并同意使用协议"
        return
      }
      apiCoachLogin(this.loginInfo).then((res) => {
        // 登录成功，保存token
        localStorage.setItem("token", res.data.data.token)
        //获取教练用户信息
        apiCoachByUserId(res.data.data.userId).then((res) => {
          localStorage.setItem("coach", JSON.stringify(res.data.data))
          this.$router.push("/home")
        })
      }).catch((err) => {
        //登录失败
        console.log(err)
        this.errorMessage = err.data.msg
      })
    }
  }
}
</script>

<style scoped lang="scss">
#login-content {
  position: relative;

  .header {
    height: 24vh;
    display: flex;
    justify-content: center;
    align-items: center;
    padding-top: 1.8vh;

    img {
      width: 14rem;
      height: 3.4rem;
    }
  }

  .image-left, .image-right {
    position: absolute;

    img {
      width: 100%;
      height: 100%;
    }
  }

  .image-left {
    left: -7.2rem;
    top: 14%;
    width: 14rem;
    height: 14rem;
  }

  .image-right {
    right: -8rem;
    width: 15rem;
    height: 15rem;
    top: 11.8%;
  }

  .image-bottom {
    height: 20vh;
    width: 100%;
    position: absolute;
    bottom: 0;
    left: 0;

    img {
      width: 100%;
      height: 100%;
    }
  }

  .login-content {
    height: 46vh;

    .login-form {
      width: 60%;
      height: 40vh;
      margin: 4vh 20% 0 20%;
      color: $main_yellow;

      input {
        width: 100%;
        height: 3.2rem;
        margin-bottom: 1.2rem;
        outline-style: none;
        background: #F6F7FA;
        border-radius: .4rem;
        border: .1rem solid #EBECEF;
        text-align: center;
        font-size: 1.2rem;
        font-family: PingFangSC-Semibold, PingFang SC;
        font-weight: 600;
      }

      input::-webkit-input-placeholder {
        font-family: PingFangSC-Semibold, PingFang SC;
        font-weight: 600;
        color: #D1D1D7;
      }

      .select-gym {
        width: 100%;
        height: 3.2rem;
        background: #F6F7FA;
        border-radius: .4rem;
        border: .1rem solid #EBECEF;
        display: flex;
        justify-content: center;
        align-items: center;
        font-size: 1.2rem;
        position: relative;

        .select-pull {
          position: absolute;
          right: .2rem;
          top: 0;
          height: 3.2rem;
          width: 3.2rem;
          display: flex;
          justify-content: center;
          align-items: center;

          img {
            width: 1.2rem;
            height: 1.2rem;
          }
        }

        .gym-list {
          position: absolute;
          top: 3.7rem;
          max-height: 30vh;
          min-height: 5vh;
          left: 0;
          background: #F6F7FA;
          border-radius: .4rem;
          border: .1rem solid #23262D;
          width: 100%;
          overflow-y: scroll;
          padding: .5rem .8rem;

          .one-gym {
            width: 100%;
            height: 3.5rem;
            border-bottom: .05rem solid #ECEDF0;
            display: flex;
            justify-content: center;
            align-items: center;
            font-size: 1.2rem;
            font-family: PingFangSC-Semibold, PingFang SC;
            font-weight: 600;
            color: #23262D;
          }

          .one-gym:last-child {
            border-bottom: none;
          }
        }
      }

      .input-password {
        width: 100%;
        height: 3.2rem;
        display: flex;
        justify-content: center;
        align-items: center;
        margin-bottom: 1.2rem;
        position: relative;

        input {
          width: 100%;
          height: 100%;
          margin-bottom: 0;
        }

        .change-type {
          position: absolute;
          right: .2rem;
          top: 0;
          height: 3.2rem;
          width: 3.2rem;
          display: flex;
          justify-content: center;
          align-items: center;

          img {
            width: 1.2rem;
            height: 1.2rem;
          }
        }
      }

      .select-gym {
        span {
          font-family: PingFangSC-Semibold, PingFang SC;
          font-weight: 600;
          color: #D1D1D7;
        }
      }

      .error-message {
        width: 100%;
        height: 3.6rem;
        display: flex;
        justify-content: center;
        align-items: center;
        color: #d75252;
        font-size: 1.1rem;
      }

      .login-button {
        width: 100%;
        height: 3.2rem;
        display: flex;
        justify-content: center;
        align-items: center;
        background: #EBECEF;
        border-radius: .3rem;
        font-size: 1.2rem;
        font-family: PingFangSC-Semibold, PingFang SC;
        font-weight: 600;
        color: $font-black;
      }

      .login-button-ok {
        background: $font-black;
        border: .05rem solid #202023;
        color: #fff;
      }

      .agreement {
        height: 3.6rem;
        width: 100%;
        display: flex;
        justify-content: center;
        align-items: center;

        div {
          width: 1.8rem;
          height: 100%;
          display: flex;
          justify-content: center;
          align-items: center;

          img {
            width: 1.1rem;
            height: 1.1rem;
          }
        }

        p {
          margin: 0;
          color: $font-black;

          span {
            color: #568bff;
          }
        }
      }

    }
  }
}
</style>
