<template>
  <div id="body-status-content">
    <div class="body-status">
      <div class="body-status-item">
        <div class="header">正面</div>
        <div class="body">
          <img :src="customer.bodyStatusData.frontImage" alt="" v-if="customer.bodyStatusData.frontImage" />
          <default-body-image :gender="customer.gender" side="front" v-else @click="toUploadImage(1)" />
        </div>
        <div class="delete" @click="deleteImage(1)" v-if="customer.bodyStatusData.frontImage">
          <img src="images/common/delete-gray.png" alt="" />
        </div>
      </div>
      <div class="body-status-item">
        <div class="header">侧面</div>
        <div class="body">
          <img :src="customer.bodyStatusData.sideImage" alt="" v-if="customer.bodyStatusData.sideImage" />
          <default-body-image :gender="customer.gender" side="side" v-else @click="toUploadImage(2)" />
        </div>
        <div class="delete" @click="deleteImage(2)" v-if="customer.bodyStatusData.sideImage">
          <img src="images/common/delete-gray.png" alt="" />
        </div>
      </div>
      <div class="body-status-item">
        <div class="header">背面</div>
        <div class="body">
          <img :src="customer.bodyStatusData.backImage" alt="" v-if="customer.bodyStatusData.backImage" />
          <default-body-image :gender="customer.gender" side="back" v-else @click="toUploadImage(3)" />
        </div>
        <div class="delete" @click="deleteImage(3)" v-if="customer.bodyStatusData.backImage">
          <img src="images/common/delete-gray.png" alt="" />
        </div>
      </div>
      <input style="display: none" type="file" ref="refUploadFile" accept="image/*" @change="readLocalFile" />
    </div>
  </div>
</template>

<script>
import { apiUploadImage } from 'src/api/upload';
import errorCode from 'src/const/error/errorCode';
import DefaultBodyImage from './DefaultBodyImage.vue';

export default {
  components: { DefaultBodyImage },
  name: 'BodyStatus',
  data() {
    return {
      whichImage: '',
      uploadImageFlag: false
    };
  },
  methods: {
    deleteImage(index) {
      if (index === 1) {
        this.customer.bodyStatusData.frontImage = '';
      } else if (index === 2) {
        this.customer.bodyStatusData.sideImage = '';
      } else if (index === 3) {
        this.customer.bodyStatusData.backImage = '';
      }
    },
    toUploadImage(index) {
      if (index === 1) {
        this.whichImage = 'frontImage';
      } else if (index === 2) {
        this.whichImage = 'sideImage';
      } else if (index === 3) {
        this.whichImage = 'backImage';
      }
      this.$refs.refUploadFile.value = '';
      this.$refs.refUploadFile.click();
    },
    //上传图片
    readLocalFile() {
      this.$q.loading.show({
        message: '正在为您上传照片'
      });
      let file = this.$refs.refUploadFile.files[0];
      let params = new FormData(); // 创建form对象
      params.append('file', file); // 通过append向form对象添加数据
      params.append('prefix', 'bodyStatus'); // 添加form表单中其他数据
      apiUploadImage(params)
        .then(res => {
          this.customer.bodyStatusData[this.whichImage] = res.data.data;
          this.$forceUpdate();
        })
        .finally(() => {
          this.$q.loading.hide();
        })
        .catch(error => {
          this.$q.notify({
            type: 'negative',
            message: '上传失败，请查看网络连接后，重新尝试！'
          });
        });
    }
  },
  props: {
    customer: Object
  }
};
</script>

<style scoped lang="scss">
#body-status-content {
  width: 100%;

  .body-status {
    height: auto;
    display: flex;
    width: 100%;
    margin: 0 auto;
    justify-content: space-between;

    .body-status-item {
      position: relative;
      width: 32%;
      height: 16rem;
      border-radius: 0.3rem;
      border: 0.05rem solid #ebecef;
      overflow: hidden;
      padding: 0.8rem;

      .header {
        text-align: left;
        height: 1.4rem;
        line-height: 1.4rem;
        font-size: 0.9rem;
        color: #888;
        margin-top: -0.3rem;
      }

      .body {
        height: calc(100% - 1.2rem);
        text-align: center;

        img {
          width: auto;
          max-width: 100%;
          height: 100%;
        }

        .tips {
          width: 60%;
          position: absolute;
          left: 20%;
          bottom: 1.3rem;
          height: 2rem;
          line-height: 2rem;
          text-align: center;
          background: rgba(235, 236, 239, 0.5);
          border-radius: 0.3rem;
          border: 1px solid #23262d;
          font-size: 0.9rem;
          color: #23262d;
        }
      }

      .delete {
        position: absolute;
        right: 0.2rem;
        top: 0.2rem;
        width: 1.5rem;
        height: 1.5rem;

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
}
</style>
