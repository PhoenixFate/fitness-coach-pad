<template>
  <div id="record-image-content">
    <BackgroundBlack @click.native="hiddenDialog"></BackgroundBlack>
    <div class="record-image">
      <div class="record-image-scroll">
        <div class="image-item" v-for="(image,imageIndex) in imageUrls" :key="imageIndex">
          <img :src="image" alt="">
        </div>
      </div>
      <div class="image-item-empty" v-if="!imageUrls || imageUrls.length===0">
        <img src="images/day/action-set-customer-empty.png" alt="">
        <p>暂无顾客训练照片，快点击下方按钮上传吧！</p>
      </div>
      <div class="camera" @click="uploadCustomerImage()">
        <img src="images/day/camera.png" alt="">
      </div>
    </div>
  </div>
</template>

<script>
import BackgroundBlack from "components/common/BackgroundBlack";

export default {
  name: "DeleteConfirm",
  components: {BackgroundBlack},
  data() {
    return {}
  },
  props: {
    recordImageFlag: Boolean,
    imageUrls: Array
  },
  methods: {
    hiddenDialog() {
      this.$emit("update:recordImageFlag", false)
    },
    uploadCustomerImage() {
      this.$emit("uploadCustomerImage")
    }
  }
}
</script>

<style scoped lang="scss">
#record-image-content {
  position: relative;

  .record-image {
    width: 70vw;
    height: 80vw;
    overflow-y: scroll;
    position: fixed;
    top: 50%;
    margin-top: -40vw;
    left: 15%;
    background-color: #fff;
    z-index: 2010;
    border-radius: 1rem;
    padding: 1.8rem 1.8rem 4rem 1.8rem;

    .record-image-scroll {
      height: 100%;
      width: 100%;
      overflow-y: scroll;
      display: flex;
      flex-wrap: wrap;
      justify-content: space-between;

      .image-item {
        width: 29vw;
        height: 29vw;
        border: 1px solid #c2c2c2;
        border-radius: .3rem;
        overflow: hidden;
        margin-bottom: .8rem;
        display: flex;
        justify-content: center;
        align-items: center;

        img {
          width: 100%;
          height: auto;
        }
      }
    }

    .image-item-empty {
      width: 20rem;
      height: 13rem;
      position: absolute;
      top: 50%;
      left: 50%;
      margin-top: -8rem;
      margin-left: -10rem;
      display: flex;
      justify-content: center;
      align-items: center;
      flex-direction: column;
      img {
        width: 80%;
        height: 80%;
      }
      p {
        margin-top: 1.4rem;
        margin-bottom: 0;
        color: #999;
      }
    }


    .camera {
      height: 3rem;
      width: 3rem;
      position: absolute;
      bottom: .5rem;
      left: 50%;
      margin-left: -1.5rem;
      border-radius: 50%;
      display: flex;
      justify-content: center;
      align-items: center;
      padding-bottom: .1rem;
      border: 1px solid #21af4a;

      img {
        width: 66%;
        height: 52%;
      }
    }
  }
}
</style>
