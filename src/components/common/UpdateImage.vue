<template>
  <div id="update-data-content">
    <BackgroundBlack @click.native="hiddenDialog"></BackgroundBlack>
    <div class="update-data-dialog">
      <div class="update-data-header">
        <img src="images/action/typeDetail/upload.png" alt="">
      </div>
      <div class="update-data-main">
        <p>正在上传图片...</p>
        <div class="update-data-sure" @click="hiddenDialog">
          <span>确</span>定
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import BackgroundBlack from "components/common/BackgroundBlack";

export default {
  name: "UpdateData",
  components: {BackgroundBlack},
  data() {
    return {}
  },
  props: {
    uploadImageFlag: Boolean,
  },
  mounted() {

  },
  methods: {
    hiddenDialog() {
      this.$emit("update:uploadImageFlag", false)
    },
  }
}
</script>

<style scoped lang="scss">
#update-data-content {
  position: relative;

  .update-data-dialog {
    width: 50%;
    height: 60vw;
    position: fixed;
    top: 50%;
    left: 25%;
    margin-top: -17vw;
    background-color: #fff;
    z-index: 2010;
    border-radius: 3vw;
    overflow: hidden;

    .update-data-header {
      position: absolute;
      width: 80%;
      height: 26vw;
      left: 10%;
      top: 5vw;
      display: flex;
      justify-content: center;
      align-items: center;

      img {
        width: 100%;
        height: 100%;
      }
    }

    .update-data-main {
      width: 100%;
      height: 26vw;
      position: absolute;
      left: 0;
      top: 32vw;
      text-align: center;
      padding-top: 1vw;

      h5 {
        font-size: 3.4vw;
        font-weight: bold;
      }

      p {
        color: #737373;
        margin-top: 5vw;
        font-size: 2.2vw;
      }

      .update-data-sure {
        height: 6vw;
        line-height: 6vw;
        font-size: 2.8vw;
        font-weight: bold;
        width: 50%;
        border-radius: 3vw;
        background-color: #4187f9;
        color: #fff;
        position: absolute;
        bottom: 2vw;
        left: 25%;

        span {
          margin-right: 1.6vw;
        }
      }
    }
  }
}
</style>
