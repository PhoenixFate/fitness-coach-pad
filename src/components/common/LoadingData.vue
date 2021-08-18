<template>
  <div id="loading-data-content">
    <BackgroundBlack @click.native="hiddenDialog"></BackgroundBlack>
    <div class="loading-data-dialog">
      <div class="header">
        <img src="images/common/loading-header.png" alt="">
      </div>
      <div class="content-waiting">
        <h4>正在加载...</h4>
        <img src="images/common/running-loading.gif" alt="">
      </div>
    </div>
  </div>
</template>

<script>
import BackgroundBlack from "components/common/BackgroundBlack";
export default {
  name: "LoadingData",
  components:{BackgroundBlack},
  data() {
    return {}
  },
  mounted() {

  },
  methods: {
    hiddenDialog() {
      this.$emit("update:loadingDataFlag", false)
    },
  },
  props:{
    loadingDataFlag:Boolean
  }
}
</script>

<style scoped lang="scss">
#loading-data-content {
  position: relative;
  z-index: 10;
  .loading-data-dialog {
    width: 44%;
    height: 22rem;
    overflow: hidden;
    position: fixed;
    top: 50%;
    margin-top: -11rem;
    left: 28%;
    background-color: #fff;
    z-index: 2010;
    border-radius: 1rem;
    .header {
      height: 40%;
      width: 100%;
      img {
        width: 100%;
        height: 100%;
      }
    }
    .content-waiting {
      height: 60%;
      width: 100%;
      display: flex;
      justify-content: center;
      align-items: center;
      flex-direction: column;
      position: relative;
      h4 {
        font-size: 1rem;
        color:#0d295c;
      }
      img {
        width: 20vw;
        height: 20vw;
        margin-top: 2%;
      }
    }
  }
}
</style>
