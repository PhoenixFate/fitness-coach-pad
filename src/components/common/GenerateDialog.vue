<template>
  <div id="generate-dialog-content">
    <BackgroundBlack @click.native="hiddenDialog"></BackgroundBlack>
    <div class="list-content">
      <div class="image-header">
        <img src="images/common/generate.png" alt="">
      </div>
      <div class="body-content">
        <h5>正在生成二维码</h5>
        <p>请耐心等待...</p>
        <img src="images/common/waiting.gif" alt="">
      </div>
    </div>
  </div>
</template>
<script>
import BackgroundBlack from "components/common/BackgroundBlack";
export default {
  name: "GenerateDialog",
  components: {BackgroundBlack},
  data() {
    return {
    }
  },
  created() {
  },
  props: {
    generateDialogFlag:Boolean,
  },
  methods: {
    hiddenDialog() {
      this.$emit("update:generateDialogFlag", false)
    },
  }
}
</script>

<style scoped lang="scss">
#generate-dialog-content {
  position: relative;
  z-index: 1;
  .list-content {
    width: 50%;
    height: 60vw;
    position: fixed;
    top: 50%;
    left: 25%;
    margin-top: -30vw;
    background-color: #fff;
    z-index: 2010;
    border-radius: 3vw;
    .image-header {
      height: 40%;
      width: 100%;
      display: flex;
      justify-content: center;
      align-items: center;
      margin-top: 6%;
      img {
        height: 80%;
        width: auto;
      }
    }
    .body-content {
      height: 50%;
      width: 100%;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      h5 {
        font-size: 3vw;
        margin-bottom: 2vw;
      }
      p {
        font-size: 2vw;
        color:#999;
        margin-bottom: 2.4vw;
      }
      img {
        width: 14vw;
        height: 14vw;
      }
    }
  }
}
</style>
