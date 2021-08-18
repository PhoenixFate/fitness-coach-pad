<template>
  <div id="equipment-content">
    <div class="background">
    </div>
    <div class="equipment">
      <div class="equipment-search">
        <div class="top-left-search">
          <input type="text" placeholder="筛选器材..." v-model="searchValue">
          <div class="search" @click="doSearch">
            <img src="images/common/search-dark-gray.png" alt="">
          </div>
        </div>
      </div>
      <div class="equipment-content-scroll">
        <div class="equipment-item"
             v-for="(equipment,index) in fitnessEquipmentData"
             :key="equipment.name"
             @click="selectEquipment(index)"
             :class="equipment.selected?'equipment-item-selected':''"
        >
          <div class="image">
            <img :src="equipment.equipmentImageUrl" alt="">
          </div>
          <div class="name">
            {{equipment.equipmentName}}
          </div>
          <div class="selected" v-if="equipment.selected">
            <img src="images/fitnessEquipment/selected.png" alt="">
          </div>
        </div>
        <div class="equipment-empty" v-if="fitnessEquipmentData.length===0">
          <img src="images/common/no-result.png" alt="">
          <p>暂无搜索结果</p>
        </div>
        <div class="equipment-item add" @click="newEquipment()">
          +
        </div>
        <div class="equipment-item modify" @click="modifyEquipment()">
          <img src="images/fitnessEquipment/modify.png" alt="">
        </div>
        <div class="equipment-item minus" @click="deleteEquipments()">
          -
        </div>
      </div>

    </div>
    <transition enter-active-class="animate__fadeIn animate__faster"
                leave-active-class="animate__fadeOut animate__faster"
    >
      <DeleteConfirm
        :deleteDialogFlag.sync="deleteDialogFlag"
        :delete-item-successfully="deleteItemSuccessfully"
        :delete-item-failed="deleteItemFailed"
        :delete-message="deleteMessage"
        @confirmDelete="confirmDelete"
        v-if="deleteDialogFlag"
        class="animate__animated"
        style="z-index: 3000"
        ref="deleteDialog"
      ></DeleteConfirm>
    </transition>

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

    <transition enter-active-class="animate__fadeIn animate__faster"
                leave-active-class="animate__fadeOut animate__faster"
    >
      <AddEquipment
        @saveEquipment="saveEquipment"
        :current-operation="currentOperation"
        :add-or-modify-flag.sync="addOrModifyFlag"
        :new-equipment-item="newEquipmentItem"
        class="animate__animated"
        style="z-index: 3000"
        v-if="addOrModifyFlag"
      >
      </AddEquipment>
    </transition>

    <!--  保存组件  -->
    <transition enter-active-class="animate__fadeIn animate__faster"
                leave-active-class="animate__fadeOut animate__faster"
    >
      <SaveFinished
        :save-item-successfully="saveItemSuccessfully"
        :save-dialog-header-image="saveDialogHeaderImage"
        :save-message="saveMessage"
        :saveItemFailed="saveItemFailed"
        class="animate__animated"
        style="z-index: 3000"
        v-if="saveDialogFlag"
      ></SaveFinished>
    </transition>

    <transition enter-active-class="animate__fadeIn animate__faster"
                leave-active-class="animate__fadeOut animate__faster"
    >
      <LoadingData
        :loadingDataFlag.sync="loadingDataFlag"
        class="animate__animated"
        style="z-index: 6000"
        v-if="loadingDataFlag"
      ></LoadingData>
    </transition>
  </div>
</template>

<script>
import DeleteConfirm from "components/common/DeleteConfirm";
import AlertMessage from "components/common/AlertMessage";
import SaveFinished from "components/common/SaveFinished";
import AddEquipment from "components/equipment/AddEquipment";
import {apiEquipmentList,apiSaveEquipment,apiUpdateEquipment,apiDeleteEquipment} from "../../../../api/equipment/index";
import LoadingData from "components/common/LoadingData";
export default {
  name: "Index",
  components:{
    DeleteConfirm,
    AlertMessage,
    SaveFinished,
    AddEquipment,
    LoadingData
  },
  data(){
    return {
      fitnessEquipmentData:[],
      selectItems:[],
      alertMessageFlag:false,
      alertMessage:"",
      newEquipmentItem:{},
      addOrModifyFlag:false,
      currentOperation:0,
      //删除的相关属性
      deleteDialogFlag: false,
      deleteItemSuccessfully:false,
      deleteItemFailed:false,
      deleteMessage: "",
      //点击保存之后的相关属性
      saveDialogFlag: false,
      saveItemSuccessfully: false,
      saveItemFailed:false,
      saveDialogHeaderImage: "images/fitnessEquipment/save-header.png",
      saveMessage:"",
      loadingDataFlag:true,
      searchValue:""
    }
  },
  created() {
    this.loadData()
    this.selectItems=[];
  },
  methods:{
    loadData(){
      apiEquipmentList({limit:100,searchValue:this.searchValue}).then((res)=>{
        console.log(res)
        setTimeout(()=>{
          this.loadingDataFlag=false
        },400)
        res.data.data.list.forEach((equipment)=>{
          equipment.selected=false
        })
        this.fitnessEquipmentData=res.data.data.list
      })
    },
    doSearch(){
      this.loadData()
    },
    selectEquipment(index){
      this.fitnessEquipmentData[index].selected=!this.fitnessEquipmentData[index].selected
      this.selectItems=this.fitnessEquipmentData.filter(item=>item.selected)
    },
    deleteEquipments(){
      if(this.selectItems.length===0){
        this.alertMessage="请先选择健身器材，然后进行删除操作"
        this.alertMessageFlag=true;
        return
      }
      let message=""
      this.selectItems.forEach((item,index)=>{
        if(index===this.selectItems.length-1){
          message+="\""+item.equipmentName+"\"";
        }else {
          message+="\""+item.equipmentName+"\"、"
        }
      })
      this.deleteMessage="您确认要删除"+message+"吗？"
      this.deleteDialogFlag=true;
    },
    confirmDelete(){
      let ids=[]
      this.fitnessEquipmentData.forEach(item=>{
        if(item.selected){
          ids.push(item.equipmentId)
        }
      })
      setTimeout(()=>{
        apiDeleteEquipment(ids).then((res)=>{
          this.$refs.deleteDialog.deletingFlag=false
          if(res.status===204){
            this.deleteItemSuccessfully=true
            //重新加载数据
            this.loadData()
          }else {
            this.deleteItemFailed=true;
          }
          setTimeout(() => {
            this.deleteDialogFlag = false
            setTimeout(() => {
              this.deleteItemSuccessfully = false
              this.deleteItemFailed=false;
            }, 1000)
          }, 800)
        })
      },1000)
    },
    newEquipment(){
      this.currentOperation=0;
      this.newEquipmentItem ={
        equipmentImageUrl:"",
        equipmentName:"",
        sort:this.fitnessEquipmentData[this.fitnessEquipmentData.length-1].sort+5
      }
      this.addOrModifyFlag=true;
    },
    modifyEquipment(){
      this.currentOperation=1;
      if(this.selectItems.length===0){
        this.alertMessageFlag=true;
        this.alertMessage="请选择某一个，然后进行编辑"
        return
      }
      if(this.selectItems.length!==1){
        this.alertMessageFlag=true;
        this.alertMessage="请只选择某一个，然后进行编辑"
        return
      }
      this.newEquipmentItem=this.selectItems[0];
      console.log(this.newEquipmentItem)
      this.addOrModifyFlag=true;
    },
    saveEquipment(){
      this.addOrModifyFlag=false
      this.saveMessage="\""+this.newEquipmentItem.equipmentName+"\"这个器材"
      setTimeout(()=>{
        this.saveDialogFlag = true
        //新增
        if(this.currentOperation===0){
          apiSaveEquipment(this.newEquipmentItem).then((res)=>{
            if(res.status===201){
              this.saveItemSuccessfully = true
              //重新刷新数据
              this.loadData()
            }else {
              this.saveItemFailed=true;
            }
            setTimeout(() => {
              this.saveDialogFlag = false
              setTimeout(() => {
                this.saveItemSuccessfully = false
                this.saveItemFailed=false;
              }, 1000)
            }, 800)
          })
        }
        //修改
        else if(this.currentOperation===1){
          apiUpdateEquipment(this.newEquipmentItem).then((res)=>{
            if(res.status===204){
              this.saveItemSuccessfully = true
              //重新刷新数据
              this.loadData()
            }else {
              this.saveItemFailed=true;
            }
            setTimeout(() => {
              this.saveDialogFlag = false
              setTimeout(() => {
                this.saveItemSuccessfully = false
                this.saveItemFailed=false;
              }, 1000)
            }, 800)
          })
        }
      },600)
    }
  }
}
</script>

<style scoped lang="scss">
#equipment-content {
  width: 100%;
  height: 100%;
  background-image: url("../../../../assets/images/equipment/equipment-background-02.png") ;
  background-repeat: no-repeat;
  background-size: 100% 100%;
  overflow: hidden;
  .background {
    width: 110%;
    height: 110%;
    margin-left: -2rem;
    background: inherit;
    filter: blur(8px);
  }
  .equipment {
    width: 90%;
    height: 90%;
    position: fixed;
    left: 5%;
    top:6%;
    background-color: rgba(255,255,255,0.4);
    border:0.1rem solid #fff;
    border-radius: 0.7rem;
    .equipment-search {
      height: 3rem;
      .top-left-search {
        position: absolute;
        top:0.5rem;
        left:20%;
        width: 60%;
        height: 2rem;
        input {
          width: 100%;
          height: 100%;
          font-size: 0.9rem;
          padding-right: 2.3rem;
          border-radius: 1rem;
          background-color: rgba(0, 0, 0, 0.08);
          color: #4e4e4e;
          padding-left: 1.5rem;
          border:1px solid #ffffff;
        }
        input::-webkit-input-placeholder { /* WebKit browsers 适配谷歌 */
          color: #4e4e4e;
        }
        input:-moz-placeholder { /* Mozilla Firefox 4 to 18 适配火狐 */
          color: #4e4e4e;
        }
        input::-moz-placeholder { /* Mozilla Firefox 19+ 适配火狐 */
          color: #4e4e4e;
        }
        input:-ms-input-placeholder { /* Internet Explorer 10+  适配ie*/
          color: #4e4e4e;
        }
        .search {
          position: absolute;
          right:0.6rem;
          bottom:0;
          top:2px;
          width: 2rem;
          height: 2rem;
          img {
            width: 60%;
            height: 60%;
            position: absolute;
            left:14%;
            top:20%;
          }
        }
      }
    }
    .equipment-content-scroll {
      height: calc(100% - 3rem);
      width: 100%;
      padding: 1% 3% 0;
      overflow-y: scroll;
      .equipment-empty {
        width: 100%;
        height: 20rem;
        display: flex;
        justify-content: center;
        align-items: center;
        flex-direction: column;
        >img {
          width: 10rem;
          height: 12rem;
        }
        >p{
          color: #5f5f5f;
          margin: 1rem 0;
          font-size: .8rem;
        }
      }
    }
    .equipment-item {
      width: 31.3%;
      margin-right: 3%;
      height: 13rem;
      background-color: #fff;
      margin-bottom: 3%;
      float: left;
      border-radius: 1.1rem;
      overflow: hidden;
      box-shadow: 0.1rem 0.1rem 0.2rem #929191;
      border:1px solid #bbb;
      position: relative;
      .image {
        height: 10.5rem;
        display: flex;
        justify-content: center;
        align-items: center;
        border-radius: 1.1rem;
        overflow: hidden;
        img {
          width: 100%;
          max-height: 100%;
        }
      }
      .name {
        font-size: 0.9rem;
        font-weight: bold;
        text-align: center;
        line-height: 2.5rem;
      }
      .selected {
        position: absolute;
        top:0.5rem;
        right: 0.5rem;
        width: 1.4rem;
        height: 1.4rem;
        img {
          width: 100%;
          height: 100%;
        }
      }
    }
    .add,.minus,.modify {
      font-size: 2.8rem;
      display: flex;
      justify-content: center;
      align-items: center;
      box-shadow: none;
      border:none;
    }
    .add {
      background-color: #e6fde6;
      color: #9be39b;

    }
    .modify {
      background-color: #b5ecf3;
      img {
        width: 1.6rem;
        height: 1.6rem;
      }
    }
    .minus {
      background-color: #fceaea;
      color: #f19595;
    }
    .equipment-item-selected {
      box-shadow: 0.1rem 0.1rem 0.15rem #bbeeaf;
      border:1px solid #75e25c;
    }
    .equipment-item:nth-child(3n){
      margin-right: 0;
    }
  }

}
</style>
