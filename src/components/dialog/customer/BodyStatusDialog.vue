<template>
  <div id="body-status-dialog-content">
    <BackgroundBlack @click.native="hiddenDialog"></BackgroundBlack>
    <div class="body-status-content">
      <h5>体态数据</h5>
      <div class="body-status">
        <div class="body-status-line">
          <div class="body-status-item">
            <h5>正面</h5>
            <div class="body">
              <img :src="bodyStatus.frontImage" alt="" v-if="bodyStatus.frontImage">
              <div class="image-empty" v-if="!bodyStatus.frontImage" @click="toUploadImage(1)">
                <img src="images/customer/bodyStatus/body-front-male.png" alt=""
                     v-if="!bodyStatus.frontImage && gender==1">
                <img src="images/customer/bodyStatus/body-front-female.png" alt=""
                     v-if="!bodyStatus.frontImage && gender==2">
                <div class="tips">
                  点击上传图片
                </div>
              </div>
            </div>
            <div class="delete" @click="deleteImage(1)" v-if="bodyStatus.frontImage">
              <img src="images/common/delete-gray.png" alt="">
            </div>
          </div>
          <div class="body-status-item">
            <h5>侧面</h5>
            <div class="body">
              <img :src="bodyStatus.sideImage" alt="" v-if="bodyStatus.sideImage">
              <div class="image-empty" v-if="!bodyStatus.sideImage" @click="toUploadImage(2)">
                <img src="images/customer/bodyStatus/body-side-male.png" alt=""
                     v-if="!bodyStatus.sideImage && gender==1">
                <img src="images/customer/bodyStatus/body-side-female.png" alt=""
                     v-if="!bodyStatus.sideImage && gender==2">
                <div class="tips">
                  点击上传图片
                </div>
              </div>
            </div>
            <div class="delete" @click="deleteImage(2)" v-if="bodyStatus.sideImage">
              <img src="images/common/delete-gray.png" alt="">
            </div>
          </div>
        </div>
        <div class="body-status-line">
          <div class="body-status-item">
            <h5>背面</h5>
            <div class="body">
              <img :src="bodyStatus.backImage" alt="" v-if="bodyStatus.backImage">
              <div class="image-empty" v-if="!bodyStatus.backImage" @click="toUploadImage(3)">
                <img src="images/customer/bodyStatus/body-back-male.png" alt=""
                     v-if="!bodyStatus.backImage && gender==1">
                <img src="images/customer/bodyStatus/body-back-female.png" alt=""
                     v-if="!bodyStatus.backImage && gender==2">
                <div class="tips">
                  点击上传图片
                </div>
              </div>
            </div>
            <div class="delete" @click="deleteImage(3)" v-if="bodyStatus.backImage">
              <img src="images/common/delete-gray.png" alt="">
            </div>
          </div>
        </div>
      </div>
      <div class="finish" @click="saveBodyTest">
        <div>保存体测数据</div>
      </div>
    </div>

    <input style="display: none" type="file" ref="refUploadFile" accept="image/*" @change="readLocalFile">
    <transition enter-active-class="animate__slideInDown animate__faster"
                leave-active-class="animate__zoomOut animate__fast">
      <AlertMessage
        :alert-message-flag.sync="alertMessageFlag"
        :message="alertMessage"
        class="animate__animated"
        style="z-index: 3000"
        v-if="alertMessageFlag"
      >
      </AlertMessage>
    </transition>
  </div>
</template>

<script>
import BackgroundBlack from "components/common/BackgroundBlack";
import {apiUploadImage} from "src/api/upload";
import AlertMessage from "components/common/AlertMessage";

export default {
  name: "BodyTestDialog",
  components: {BackgroundBlack, AlertMessage},
  data() {
    return {
      whichImage: "",
      alertMessage: "请至少上传1张体态照片",
      alertMessageFlag: false,
    }
  },
  props: {
    bodyStatusDialogFlag: Boolean,
    bodyStatus: Object,
    gender: String,
  },
  methods: {
    hiddenDialog() {
      this.$emit("update:bodyStatusDialogFlag", false)
    },
    saveBodyTest() {
      // 检查3张照片是否都为空
      if (!this.bodyStatus.frontImage && !this.bodyStatus.sideImage && !this.bodyStatus.backImage) {
        this.alertMessageFlag = true
        return
      }
      this.$emit("update:bodyStatusDialogFlag", false)
      this.$emit("saveBodyStatus")
    },
    deleteImage(index) {
      if (index === 1) {
        this.bodyStatus.frontImage = ""
      } else if (index === 2) {
        this.bodyStatus.sideImage = ""
      } else if (index === 3) {
        this.bodyStatus.backImage = ""
      }
    },
    toUploadImage(index) {
      if (index === 1) {
        this.whichImage = "frontImage"
      } else if (index === 2) {
        this.whichImage = "sideImage"
      } else if (index === 3) {
        this.whichImage = "backImage"
      }
      this.$refs.refUploadFile.value = ''
      this.$refs.refUploadFile.click();
    },
    //点击上传图片
    readLocalFile() {
      let file = this.$refs.refUploadFile.files[0]
      let params = new FormData()  // 创建form对象
      params.append('file', file)  // 通过append向form对象添加数据
      params.append('prefix', 'bodyStatus') // 添加form表单中其他数据
      apiUploadImage(params).then((res) => {
        if (res.data.code === 0) {
          this.bodyStatus[this.whichImage] = res.data.data
          this.$forceUpdate()
        }
      })
    },
  },
}
</script>

<style scoped lang="scss">
#body-status-dialog-content {
  z-index: 1;
  position: relative;

  .body-status-content {
    width: 70%;
    height: 38rem;
    position: fixed;
    top: 50%;
    margin-top: -19rem;
    left: 15%;
    z-index: 2010;
    border-radius: 1rem;
    background-color: #fff;

    h5 {
      line-height: 1.8rem;
      text-align: center;
      font-size: 1.1rem;
      margin-top: .5rem;
    }

    .body-status {
      height: 80%;
      width: 90%;
      margin: 1rem auto 0;

      .body-status-line {
        height: 47%;
        width: 100%;
        display: flex;
        justify-content: space-around;

        .body-status-item {
          width: 45%;
          height: 100%;
          border-radius: .4rem;
          box-shadow: 0 0 .9rem #b7b5b5;
          display: flex;
          flex-direction: column;
          overflow: hidden;
          position: relative;
          padding: .8rem;

          h5 {
            height: 1.4rem;
            line-height: 1.4rem;
            font-size: .9rem;
            color: #888;
            margin-top: -.3rem;
            text-align: left;
          }

          .body {
            height: calc(100% - 1.2rem);
            width: 100%;
            position: relative;

            > img {
              width: auto;
              max-width: 100%;
              height: 100%;
            }

            .image-empty {
              width: 100%;
              height: 100%;
              position: relative;
              display: flex;
              justify-content: center;
              align-items: center;

              .example {
                width: 1.4rem;
                height: 1.4rem;
                border-radius: 50%;
                position: absolute;
                right: 10%;
                top: 2%;
                background-color: #ffdcb7;
                border: .1rem solid #efbf2c;
                display: flex;
                justify-content: center;
                align-items: center;
                font-size: .7rem;
                color: #e99910;
                font-weight: bold;
              }

              .tips {
                width: 80%;
                position: absolute;
                left: 10%;
                bottom: 6%;
                background-color: #f5f5f7;
                height: 2rem;
                border-radius: .3rem;
                line-height: 2rem;
                text-align: center;
                font-size: .8rem;
                font-weight: 400;
                color: #23262D;
                border: .05rem dashed #23262D;
              }

              img {
                width: auto;
                max-width: 100%;
                height: 100%;
              }
            }
          }

          .delete {
            position: absolute;
            right: .1rem;
            top: .2rem;
            width: 1.4rem;
            height: 1.4rem;

            img {
              width: 60%;
              height: 60%;
              position: absolute;
              left: 30%;
              top: 10%;
            }
          }
        }
      }

      .body-status-line:nth-child(2) {
        margin-top: 1rem;
        justify-content: center;
      }
    }

    .finish {
      position: absolute;
      bottom: 1rem;
      height: 1.8rem;
      width: 40%;
      left: 30%;
      background: linear-gradient(to right, #eac867, #f1d4a3);
      border-radius: .3rem;
      text-align: center;
      line-height: 1.8rem;
      font-weight: 500;
      font-size: .8rem;
      color: #fff;
      box-shadow: .1rem .1rem .2rem #b9baba;
      overflow: hidden;

      div {
        width: 100%;
        height: 100%;
        border-radius: .3rem;
        box-shadow: -.1rem -.1rem .3rem #eccc72 inset;
      }
    }
  }
}
</style>
