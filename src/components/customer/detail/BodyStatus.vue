<template>
  <div id="body-status-content">
    <div class="body-status">
      <div class="body-status-item" v-if="customer.bodyStatusData">
        <div class="header">正面</div>
        <div class="body">
          <img :src="customer.bodyStatusData.frontImage" alt="" v-if="customer.bodyStatusData.frontImage">
          <img src="images/customer/bodyStatus/body-front-male.png" alt=""
               v-if="!customer.bodyStatusData.frontImage && customer.gender==1">
          <img src="images/customer/bodyStatus/body-front-female.png" alt=""
               v-if="!customer.bodyStatusData.frontImage && customer.gender==2">
          <div class="empty-info" v-if="!customer.bodyStatusData.frontImage">
            暂无体态图片
          </div>
        </div>
      </div>
      <div class="body-status-item" v-if="customer.bodyStatusData">
        <div class="header">侧面</div>
        <div class="body">
          <img :src="customer.bodyStatusData.sideImage" alt="" v-if="customer.bodyStatusData.sideImage">
          <img src="images/customer/bodyStatus/body-side-male.png" alt=""
               v-if="!customer.bodyStatusData.sideImage && customer.gender==1">
          <img src="images/customer/bodyStatus/body-side-female.png" alt=""
               v-if="!customer.bodyStatusData.sideImage && customer.gender==2">
          <div class="empty-info" v-if="!customer.bodyStatusData.sideImage">
            暂无体态图片
          </div>
        </div>
      </div>
      <div class="body-status-item" v-if="customer.bodyStatusData">
        <div class="header">背面</div>
        <div class="body">
          <img :src="customer.bodyStatusData.backImage" alt="" v-if="customer.bodyStatusData.backImage">
          <img src="images/customer/bodyStatus/body-back-male.png" alt=""
               v-if="!customer.bodyStatusData.backImage && customer.gender==1">
          <img src="images/customer/bodyStatus/body-back-female.png" alt=""
               v-if="!customer.bodyStatusData.backImage && customer.gender==2">
          <div class="empty-info" v-if="!customer.bodyStatusData.backImage">
            暂无体态图片
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "BodyStatus",
  components: {},
  data() {
    return {}
  },
  props: {
    customer: Object,
  }
}
</script>

<style scoped lang="scss">
#body-status-content {
  .body-status {
    height: 17rem;
    display: flex;
    width: 100%;
    justify-content: space-between;

    .body-status-item {
      width: 32%;
      height: 100%;
      border-radius: .3rem;
      border: .05rem solid #EBECEF;
      overflow: hidden;
      padding: .8rem;

      .header {
        text-align: left;
        height: 1.4rem;
        line-height: 1.4rem;
        font-size: .9rem;
        color: #888;
        margin-top: -.3rem;
      }

      .body {
        height: calc(100% - 1.2rem);
        position: relative;
        display: flex;
        justify-content: center;
        align-items: center;

        img {
          width: auto;
          max-width: 100%;
          height: 100%;
        }

        .empty-info {
          width: 60%;
          position: absolute;
          left: 20%;
          bottom: 10%;
          background-color: rgba(0, 0, 0, 0.4);
          height: 1.5rem;
          border-radius: .2rem;
          color: #fff;
          line-height: 1.5rem;
          text-align: center;
          font-size: .7rem;
        }
      }
    }
  }
}
</style>
