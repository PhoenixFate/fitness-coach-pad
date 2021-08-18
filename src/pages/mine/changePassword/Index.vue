<template>
  <div id="password-content">
    <div class="password-form">
      <form>
        <q-list separator class="form-list">
          <q-item class="password-item">
            <div class="item-text">
              <span class="label">旧密码</span>
              <q-input
                class="input"
                clearable
                filled
                color="primary"
                v-model="form.oldPassword.value"
                autocomplete="current-password"
                :type="form.oldPassword.isPwd ? 'password' : 'text'"
                placeholder="请在此输入旧密码"
              >
                <template v-slot:append>
                  <q-icon
                    :name="form.oldPassword.isPwd ? 'visibility_off' : 'visibility'"
                    class="cursor-pointer"
                    @click="form.oldPassword.isPwd = !form.oldPassword.isPwd"
                    style="margin-right: 1rem"
                  />
                </template>
              </q-input>
            </div>
          </q-item>
          <q-item class="password-item">
            <div class="item-text">
              <span class="label">新密码</span>
              <q-input
                class="input"
                clearable
                filled
                color="primary"
                autocomplete="new-password"
                v-model="form.newPassword.value"
                :type="form.newPassword.isPwd ? 'password' : 'text'"
                placeholder="请在此输入新密码"
              >
                <template v-slot:append>
                  <q-icon
                    :name="form.newPassword.isPwd ? 'visibility_off' : 'visibility'"
                    class="cursor-pointer"
                    @click="form.newPassword.isPwd = !form.newPassword.isPwd"
                    style="margin-right: 1rem"
                  />
                </template>
              </q-input>
            </div>
            <q-item-label class="item-hint" :class="newPasswordClass">
              <span>6-24位长度</span>
            </q-item-label>
          </q-item>
          <q-item class="password-item">
            <div class="item-text">
              <q-item-label class="label">确认新密码</q-item-label>
              <q-input
                class="input"
                clearable
                filled
                color="primary"
                autocomplete="new-password"
                v-model="form.confirmPassword.value"
                :type="form.confirmPassword.isPwd ? 'password' : 'text'"
                placeholder="请确认新密码"
              >
                <template v-slot:append>
                  <q-icon
                    :name="form.confirmPassword.isPwd ? 'visibility_off' : 'visibility'"
                    class="cursor-pointer"
                    @click="form.confirmPassword.isPwd = !form.confirmPassword.isPwd"
                    style="margin-right: 1rem"
                  />
                </template>
              </q-input>
            </div>
            <q-item-label class="item-hint" :class="confirmPasswordClass">
              <span>{{ confirmPasswordText }}</span>
            </q-item-label>
          </q-item>
          <q-separator/>
        </q-list>
      </form>
      <q-btn color="secondary" label="确认修改密码" class="confirm-password" style="width: 10rem" @click="changePassword"/>
    </div>
    <transition enter-active-class="animate__slideInDown animate__faster"
                leave-active-class="animate__zoomOut animate__fast">
      <AlertMessage
        :alert-message-flag.sync="alertMessageFlag"
        :message="alertMessage"
        class="animate__animated"
        style="z-index: 3000"
        v-if="alertMessageFlag"
      >
      </AlertMessage>
    </transition>
    <transition enter-active-class="animate__slideInDown animate__faster"
                leave-active-class="animate__zoomOut animate__fast">
      <ChangePasswordSuccess
        class="animate__animated"
        @afterChangePassword="afterChangePassword"
        style="z-index: 3000"
        v-if="passwordSuccessDialogFlag"
      >
      </ChangePasswordSuccess>
    </transition>
  </div>
</template>

<script>
import AlertMessage from "components/common/AlertMessage";
import {apiChangePassword} from "src/api/coach";
import ChangePasswordSuccess from "components/dialog/ChangePasswordSuccess";

export default {
  components: {AlertMessage, ChangePasswordSuccess},
  name: "Index",
  computed: {
    newPasswordClass() {
      if (this.form.newPassword.value.length === 0) {
        return "item-hint-default"
      }
      if (this.form.newPassword.value.length >= 6 &&
        this.form.newPassword.value.length <= 24) {
        return "item-hint-right"
      }
      return "item-hint-error"
    },
    confirmPasswordClass() {
      if (this.form.confirmPassword.value.length === 0) {
        return "item-hint-default"
      }
      if (this.form.confirmPassword.value === this.form.newPassword.value &&
        this.form.confirmPassword.value.length >= 6 &&
        this.form.confirmPassword.value.length <= 24
      ) {
        return "item-hint-right"
      }
      return "item-hint-error"
    },
    confirmPasswordText() {
      if (this.form.confirmPassword.value.length === 0) {
        return "6-24位长度"
      }
      let lengthMessage = ""
      let confirmMessage = ""
      if (this.form.confirmPassword.value === this.form.newPassword.value) {
        confirmMessage = "密码一致"
      } else {
        confirmMessage = "密码不一致"
      }
      if (this.form.confirmPassword.value.length < 6 ||
        this.form.confirmPassword.value.length > 24
      ) {
        lengthMessage = "6-24位长度;"
      }
      return lengthMessage + " " + confirmMessage
    }
  },
  data() {
    return {
      form: {
        oldPassword: {
          value: "",
          isPwd: true
        },
        newPassword: {
          value: "",
          isPwd: true
        },
        confirmPassword: {
          value: "",
          isPwd: true
        },
      },
      password: "",
      isPwd: "",
      alertMessageFlag: false,
      alertMessage: "",
      passwordSuccessDialogFlag: false
    }
  },
  methods: {
    changePassword() {
      if (!this.form.oldPassword.value) {
        this.alertMessage = "旧密码不能为空!"
        this.alertMessageFlag = true
        return
      }
      if (!this.form.newPassword.value || !this.form.confirmPassword.value) {
        this.alertMessage = "新密码不能为空!"
        this.alertMessageFlag = true
        return
      } else {
        if (!(this.form.newPassword.value.length >= 6 && this.form.newPassword.value.length <= 24)) {
          this.alertMessage = "新密码长度6-24!"
          this.alertMessageFlag = true
          return
        }
      }
      if (this.form.newPassword.value !== this.form.confirmPassword.value) {
        this.alertMessage = "新密码不一致!"
        this.alertMessageFlag = true
        return
      }
      let passwordForm = {
        oldPassword: this.form.oldPassword.value,
        newPassword: this.form.newPassword.value
      }
      apiChangePassword(passwordForm).then(() => {
        //成功
        this.passwordSuccessDialogFlag = true
      }).catch((err) => {
        console.log(err)
        this.alertMessage = err.data.msg
        this.alertMessageFlag = true
      })
    },
    afterChangePassword() {
      this.passwordSuccessDialogFlag = false
      localStorage.removeItem("token")
      localStorage.removeItem("coach")
      this.$router.push("/login")
    }
  }
}
</script>

<style scoped lang="scss">
#password-content {
  margin-top: 5rem;

  .password-form {
    width: 70%;
    margin: 0 auto;
    font-size: 1rem;
    text-align: center;

    .form-list {
      .password-item {
        width: 100%;
        display: flex;
        flex-direction: column;
        padding: 1.7rem 0 .5rem 0;

        .item-text {
          display: flex;

          .label {
            width: 7rem;
            display: flex;
            align-items: center;
          }

          .input {
            flex: 1;
            font-size: .9rem;
          }
        }

        .item-hint {
          padding-left: 7.5rem;
          font-size: .7rem;
          padding-top: .2rem;
          text-align: left;
        }

        .item-hint-default {
          color: #777;
        }

        .item-hint-right {
          color: #21BA45;
        }

        .item-hint-error {
          color: #ff4433;
        }
      }
    }

    .confirm-password {
      margin-top: 4rem;
      height: 2.4rem;
      font-size: .9rem;
      width: 8rem;
    }
  }
}

</style>
