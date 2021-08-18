<template>
  <div id="about-content">
    <div class="about-head">
      <img src="icons/logo.png" alt="">
      <span class="name">健身云app</span>
      <span class="version">Version&nbsp;&nbsp;&nbsp;0.0.1</span>
    </div>
    <div class="about-bottom">
      <span>《软件许可及服务协议》</span>
      <span>《隐私保护指引》</span>
      <div class="copy-right">
        <span>南京宁扭信息科技有限公司&nbsp;&nbsp;版权所有</span>
        <span>Copyright @ 2018-2020 Nanjing NingNiu Technology Co. Ltd. All Rights Reserved</span>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "Index"
}
</script>

<style scoped lang="scss">
#about-content {
  .about-head {
    width: 100%;
    display: flex;
    flex-direction: column;
    margin-top: 5rem;
    justify-content: center;
    align-items: center;
    img {
      width: 9rem;
      height: 9rem;
    }
    .name {
      font-size: 1.6rem;
      font-weight: bold;
      margin-top: 2rem;
    }
    .version {
      margin-top: .4rem;
      font-size: 1rem;
    }
  }

  .about-bottom {
    position: absolute;
    bottom: 2.5rem;
    width: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    font-size: .9rem;
    .copy-right {
      display: flex;
      flex-direction: column;
      align-items: center;
      color: #999;
      font-size: .6rem;
    }
    > span {
      margin-bottom: 1.3rem;
      color: cornflowerblue;
    }
  }

}
</style>
