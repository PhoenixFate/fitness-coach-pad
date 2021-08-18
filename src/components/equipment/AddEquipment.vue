<template>
  <div id="add-equipment-content">
    <BackgroundBlack @click.native="hiddenDialog"></BackgroundBlack>
    <div class="add-equipment">
      <div class="title">{{ messages[currentOperation].title }}</div>
      <div class="equipment-image">
        <div class="label">器材图片</div>
        <div class="image" v-if="newEquipmentItem.equipmentImageUrl===''">
          <img src="images/fitnessEquipment/toUpload.png" alt="">
          <div class="camera" @click="toUploadImage">
            <img src="images/fitnessEquipment/camera.png" alt="">
          </div>
          <p>请点击上传器材图片</p>
        </div>
        <div class="image" v-if="newEquipmentItem.equipmentImageUrl!==''">
          <img :src="newEquipmentItem.equipmentImageUrl" alt="">
          <div class="delete" @click="deleteImage">
            <img src="images/common/delete-gray.png" alt="">
          </div>
        </div>
      </div>
      <div class="equipment-name">
        <div class="label">器材名称</div>
        <div class="name">
          <q-input placeholder="请输入器材名" v-model="newEquipmentItem.equipmentName"/>
        </div>
      </div>
      <div class="equipment-buttons">
        <div class="cancel"  @click="cancel">取消</div>
        <div :class="messages[currentOperation].className" @click="saveEquipment">{{messages[currentOperation].buttonName}}</div>
      </div>
      <input style="display: none" type="file" ref="refUploadFile"  accept="image/*"  @change="readLocalFile">
    </div>

    <transition enter-active-class="animate__slideInDown animate__faster"
                leave-active-class="animate__zoomOut animate__fast">
      <AlertMessage
        :alert-message-flag.sync="alertMessageFlag"
        :message="alertMessage"
        class="animate__animated"
        style="z-index: 3000"
        v-show="alertMessageFlag"
      >
      </AlertMessage>
    </transition>


  </div>
</template>

<script>
import BackgroundBlack from "components/common/BackgroundBlack";
import AlertMessage from "components/common/AlertMessage";
import {apiUploadImage} from "../../api/upload/index"
export default {
  name: "AddEquipment",
  components:{BackgroundBlack,AlertMessage},
  data(){
    return {
      images:[],
      messages:[
        {
          title:"新增器材",
          buttonName:"新增",
          buttonColor:"green-6",
          className:"sure-add"
        },
        {
          title:"修改器材",
          buttonName:"修改",
          buttonColor: "light-blue-6",
          className:"sure-modify"
        }
      ],
      alertMessage:"",
      alertMessageFlag:false,
    }
  },
  props:{
    currentOperation:Number,
    newEquipmentItem:Object,
    addOrModifyFlag:Boolean,
  },
  methods:{
    deleteImage(){
      this.newEquipmentItem.equipmentImageUrl=""
    },
    toUploadImage(){
      this.$refs.refUploadFile.value = ''
      this.$refs.refUploadFile.click();
    },
    saveEquipment(){
      if(!this.newEquipmentItem.equipmentImageUrl){
        this.alertMessage="器材图片不能为空"
        this.alertMessageFlag=true;
        return
      }
      if(!this.newEquipmentItem.equipmentName){
        this.alertMessage="器材名称不能为空"
        this.alertMessageFlag=true;
        return
      }
      this.$emit("saveEquipment")
    },
    hiddenDialog(){
      this.$emit("update:addOrModifyFlag",false)
    },
    cancel(){
      this.$emit("update:addOrModifyFlag",false)
    },
    //点击上传图片
    readLocalFile() {
      let file = this.$refs.refUploadFile.files[0]
      let params = new FormData()  // 创建form对象
      params.append('file', file)  // 通过append向form对象添加数据
      params.append('prefix', 'equipment') // 添加form表单中其他数据
      apiUploadImage(params).then((res)=>{
        console.log(res)
        if(res.data.code===0){
          this.newEquipmentItem.equipmentImageUrl=res.data.data
        }
      })
    }
  }
}
</script>

<style scoped lang="scss">
#add-equipment-content {
  height: 100%;
  width: 100%;
  position: relative;
  z-index: 1;
  .add-equipment {
    position: fixed;
    width: 86%;
    height: 29rem;
    top:50%;
    margin-top: -14rem;
    left: 7%;
    border-radius: 1rem;
    padding: .25rem 1.5rem 1rem 1.5rem;
    box-shadow: .15rem .15rem .3rem #8a8989;
    background-color: #fff;
    border:1px solid #cdcccc;
    z-index: 2010;
    .title {
      height: 3rem;
      text-align: center;
      line-height: 3rem;
      font-size: 1.2rem;
      font-weight: bold;
      border-bottom: 1px solid #cdcccc;
    }
    .label {
      width: 30%;
      height: 100%;
      display: flex;
      font-size: 1rem;
      justify-content: center;
      align-items: center;
    }
    .equipment-image {
      height: 14rem;
      display: flex;
      margin-bottom: .5rem;
      .image {
        width: 70%;
        padding: .5rem;
        display: flex;
        justify-content: center;
        position: relative;
        .delete {
          position: absolute;
          right: 10%;
          top:1%;
          height: 2.3rem;
          width: 2.3rem;
          display: flex;
          justify-content: center;
          align-items: center;
          img {
            width:1.5rem;
            height: 1.5rem;
          }
        }
        >img {
          height: 100%;
        }
        .camera {
          position: absolute;
          left: 50%;
          top:  50%;
          width: 3rem;
          height: 3rem;
          margin-left: -1.5rem;
          margin-top: -1.5rem;
          display: flex;
          justify-content: center;
          align-items: center;
          background-color: #0b76bf;
          border-radius: 50%;
          >img {
            width: 60%;
            height: 60%;
            margin-top: -.25rem;
          }
        }
        p {
          position: absolute;
          bottom: .5rem;
          font-size: .9rem;
          color:#999;
          margin-bottom: 0.3rem;
        }

      }
    }
    .equipment-name {
      height:4rem;
      display: flex;
      justify-content: space-between;
      .name {
        width: 40%;
        margin-right: 17%;
        label {
          height: 100%;
          font-size: 1rem;
        }
      }
    }
    .equipment-buttons {
      display: flex;
      height: 4rem;
      width: 80%;
      margin-left: 10%;
      margin-top: 1.5rem;
      justify-content: space-around;
      align-items: center;
      .cancel,.sure-add,.sure-modify {
        width: 8rem;
        height: 2.5rem;
        border-radius: .3rem;
        display: flex;
        justify-content: center;
        align-items: center;
        font-size: 1.2rem;
        font-weight: 500;
      }
      .cancel {
        border:1px solid #bdbdbd;
        color:#bdbdbd;
      }
      .sure-add {
        border:1px solid #4caf50;
        color:#4caf50;
      }
      .sure-modify {
        border:1px solid #29b6f6;
        color:#29b6f6;
      }
    }
  }
}
</style>
