<template>
  <div id="video-player-content">
    <BackgroundBlack @click.native="hiddenDialog"></BackgroundBlack>
    <div class="video-player">
      <video :src='videoUrl' controls='controls' autoplay>
        您的浏览器不支持 video 标签。
      </video>
    </div>
  </div>
</template>

<script>
import BackgroundBlack from "components/common/BackgroundBlack";

export default {
  name: "LoadingData",
  components: {BackgroundBlack},
  data() {
    return {}
  },
  methods: {
    hiddenDialog() {
      this.$emit("update:videoPlayerFlag", false)
    },
  },
  props: {
    videoUrl: String,
    videoPlayerFlag: Boolean
  }
}
</script>

<style scoped lang="scss">
#video-player-content {
  position: relative;
  z-index: 10;

  .video-player {
    width: 100%;
    height: auto;
    z-index: 2010;
    position: fixed;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);

    video {
      width: 100%;
      height: 100%;
    }
  }
}
</style>
