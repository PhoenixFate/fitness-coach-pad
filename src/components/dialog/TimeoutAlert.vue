<template>
  <div id="save-finished-content">
    <BackgroundBlack></BackgroundBlack>
    <div class="save-dialog">
      <img src="images/day/alert.png" alt="">
      <h5>超时</h5>
      <p>您已休息完毕，快点继续训练吧！</p>
      <div @click="hiddenDialog">确认</div>
    </div>
  </div>
</template>

<script>
import BackgroundBlack from "components/common/BackgroundBlack";

export default {
  name: "TimeoutAlert",
  components: {BackgroundBlack},
  data() {
    return {}
  },
  methods: {
    hiddenDialog() {
      this.$emit("hideTimeoutDialog")
    }
  },
  props: {
    timeoutAlertFlag: Boolean
  }
}
</script>

<style scoped lang="scss">
#save-finished-content {
  position: relative;
  z-index: 10;

  .save-dialog {
    width: 16rem;
    height: 18rem;
    position: fixed;
    top: 50%;
    margin-top: -9rem;
    left: 50%;
    margin-left: -8rem;
    background-color: #fff;
    z-index: 2010;
    border-radius: .7rem;

    img {
      width: 12rem;
      height: 16rem;
      position: absolute;
      left: 1rem;
      top: -6rem;
    }

    h5 {
      position: absolute;
      width: 100%;
      height: 2rem;
      color: #c14140;
      font-size: 2.2rem;
      left: 0;
      top: 5rem;
      text-align: center;
      font-weight: bold;
    }

    p {
      color: #999;
      font-size: .8rem;
      position: absolute;
      text-align: center;
      top: 11.6rem;
      left: 2rem;
    }

    div {
      width: 6rem;
      height: 2rem;
      color: #fff;
      position: absolute;
      bottom: 1rem;
      left: 50%;
      margin-left: -3rem;
      display: flex;
      justify-content: center;
      align-items: center;
      font-size: .9rem;
      border-radius: .3rem;
      background: linear-gradient(to right, #4987ed 0%, #4753e8 100%);
    }
  }
}
</style>
