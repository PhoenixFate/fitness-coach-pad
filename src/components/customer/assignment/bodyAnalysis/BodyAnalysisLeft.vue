<template>
  <div class="analysis-left">
    <div class="left-item">
      <img :src="customer.bodyStatusData.frontImage" alt=""  v-if="customer.bodyStatusData.frontImage">
      <div class="name">正</div>
      <div class="image-empty" v-if="!customer.bodyStatusData.frontImage">
        <img src="images/customer/bodyStatus/body-front-male.png" alt=""
             v-if="!customer.bodyStatusData.frontImage && customer.gender==1">
        <img src="images/customer/bodyStatus/body-front-female.png" alt=""
             v-if="!customer.bodyStatusData.frontImage && customer.gender==2">
        <div class="tips">
          暂无体态图片
        </div>
      </div>
      <div class="delete-image" @click="deleteImage(1)" v-if="customer.bodyStatusData.frontImage">
        <img src="images/common/delete-gray.png" alt="">
      </div>
    </div>
    <div class="left-item">
      <img :src="customer.bodyStatusData.sideImage" alt=""  v-if="customer.bodyStatusData.sideImage">
      <div class="name">侧</div>
      <div class="image-empty" v-if="!customer.bodyStatusData.sideImage">
        <img src="images/customer/bodyStatus/body-side-male.png" alt=""
             v-if="!customer.bodyStatusData.sideImage && customer.gender==1">
        <img src="images/customer/bodyStatus/body-side-female.png" alt=""
             v-if="!customer.bodyStatusData.sideImage && customer.gender==2">
        <div class="tips">
          暂无体态图片
        </div>
      </div>
      <div class="delete-image" @click="deleteImage(2)" v-if="customer.bodyStatusData.sideImage">
        <img src="images/common/delete-gray.png" alt="">
      </div>
    </div>
    <div class="left-item">
      <img :src="customer.bodyStatusData.backImage" alt=""   v-if="customer.bodyStatusData.backImage">
      <div class="name">背</div>
      <div class="image-empty" v-if="!customer.bodyStatusData.backImage">
        <img src="images/customer/bodyStatus/body-back-male.png" alt=""
             v-if="!customer.bodyStatusData.backImage && customer.gender==1">
        <img src="images/customer/bodyStatus/body-back-male.png" alt=""
             v-if="!customer.bodyStatusData.backImage && customer.gender==2">
        <div class="tips">
          暂无体态图片
        </div>
      </div>
      <div class="delete-image" @click="deleteImage(3)" v-if="customer.bodyStatusData.backImage">
        <img src="images/common/delete-gray.png" alt="">
      </div>
    </div>
    <input style="display: none" type="file" ref="refUploadFile" accept="image/*" @change="readLocalFile">

  </div>
</template>

<script>
import {apiUploadImage} from "src/api/upload";
export default {
  name: "BodyAnalysisLeft",
  data() {
    return {
      whichImage:""
    }
  },
  props: {
    customer: Object,
  },
  methods:{
    deleteImage(index){
      if(index===1){
        this.customer.bodyStatusData.frontImage=""
      }else if(index===2){
        this.customer.bodyStatusData.sideImage=""
      }else if(index===3){
        this.customer.bodyStatusData.backImage=""
      }
    },
    toUploadImage(index) {
      if(index===1){
        this.whichImage="frontImage"
      }else if(index===2){
        this.whichImage="sideImage"
      }else if(index===3){
        this.whichImage="backImage"
      }
      this.$refs.refUploadFile.click();
    },
    //点击上传图片
    readLocalFile() {
      let file = this.$refs.refUploadFile.files[0]
      let params = new FormData()  // 创建form对象
      params.append('file', file)  // 通过append向form对象添加数据
      params.append('prefix', 'bodyStatus') // 添加form表单中其他数据
      apiUploadImage(params).then((res) => {
        this.customer.bodyStatusData[this.whichImage]=res.data.data
        this.$forceUpdate()
      })
    },
  }
}
</script>

<style scoped lang="scss">
.analysis-left {
  width: 28vw;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;

  .left-item {
    width: 100%;
    height: 28*1.32vw;
    position: relative;
    overflow: hidden;
    border-radius: .6rem;
    .image-empty {
      width: 100%;
      height: 100%;
      position: relative;
      background-color: #fff;
      padding: 1rem;
      display: flex;
      justify-content: center;
      .tips {
        width: 60%;
        position: absolute;
        left:20%;
        bottom: 10%;
        background-color: rgba(0,0,0,0.4);
        height: 1.5rem;
        border-radius: .2rem;
        color:#fff;
        line-height: 1.5rem;
        text-align: center;
        font-size: .8rem;
      }
      img {
        width: auto;
        height: 100%;
      }
    }
    >img {
      width: 100%;
      height: 100%;
    }

    .name {
      position: absolute;
      width: 4.5rem;
      height: 4.5rem;
      left: -2.2rem;
      top: -2.2rem;
      color: #fff;
      font-size: .9rem;
      transform: rotate(-45deg);
      display: flex;
      justify-content: center;
      align-items: flex-end;
      padding-bottom: .2rem;
      font-weight: bold;
      background: linear-gradient(to right, #0b76bf, #8ac3ea); /* 标准的语法 */
      z-index: 5;
    }
    .delete-image {
      width: 2rem;
      height: 2rem;
      display: flex;
      justify-content: flex-end;
      align-items: flex-start;
      position: absolute;
      right: .2rem;
      top:.2rem;
      img {
        width: 60%;
        height: 60%;
      }
    }
  }
}

</style>
