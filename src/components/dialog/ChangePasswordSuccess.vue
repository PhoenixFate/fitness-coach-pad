<template>
  <div id="save-finished-content">
    <BackgroundBlack></BackgroundBlack>
    <div class="save-dialog">
      <h5>修改密码成功！</h5>
      <img src="images/mine/password/passwordSuccess.png" alt="">
      <div @click="hiddenDialog">确认</div>
    </div>
  </div>
</template>

<script>
import BackgroundBlack from "components/common/BackgroundBlack";

export default {
  name: "ChangePasswordSuccess",
  components: {BackgroundBlack},
  data() {
    return {}
  },
  methods: {
    hiddenDialog() {
      this.$emit("afterChangePassword")
    }
  },
  props: {}
}
</script>

<style scoped lang="scss">
#save-finished-content {
  position: relative;
  z-index: 10;

  .save-dialog {
    width: 18rem;
    height: 20rem;
    position: fixed;
    top: 50%;
    margin-top: -10rem;
    left: 50%;
    margin-left: -9rem;
    background-color: #fff;
    z-index: 2010;
    border-radius: .8rem;
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
    img {
      width: 10rem;
      height: 8rem;
      margin-bottom: 2.6rem;
      margin-top: 1.5rem;
    }

    h5 {
      width: 100%;
      height: 2rem;
      color: #000;
      font-size: 1.3rem;
      text-align: center;
      font-weight: bold;
    }

    div {
      width: 7rem;
      height: 2.2rem;
      color: #fff;
      left: 50%;
      display: flex;
      justify-content: center;
      align-items: center;
      font-size: 1rem;
      border-radius: .3rem;
      background: linear-gradient(to right, #a9de6d 0%, #53b12b 100%);
    }
  }
}
</style>
