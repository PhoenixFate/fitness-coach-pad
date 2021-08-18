<template>
  <div id="healthy-meal-content">
    <div class="item-list">
      <img src="images/diet/food/item-title.png" alt="">
      <div class="top-left-search">
        <input type="text" placeholder="筛选健康餐..." v-model="searchValue">
        <div class="search" @click="doSearch()">
          <img src="images/common/search.png" alt="">
        </div>
      </div>
      <div class="top-cover"></div>
      <div class="bottom-cover" @click="newFood">
        <img src="images/diet/food/item-bottom.png" alt="">
        <div>添加健康餐</div>
      </div>
      <div class="item-list-content">
        <div class="item-list-scroll">
          <div class="item"
               v-for="(food,index) in foodList"
               :key="index"
               :class="currentItemIndex===index?'item-selected':''"
               @click="selectFood(index)"
          >
            {{ food.healthyMealName }}
            <div class="item-selected-left" v-if="currentItemIndex===index">
              <img src="images/diet/food/triangle-left.png" alt="">
            </div>
            <div class="item-selected-right" v-if="currentItemIndex===index">
              <img src="images/diet/food/triangle-right.png" alt="">
            </div>
          </div>
          <div class="item-empty" v-if="foodList.length===0">
            <img src="images/common/no-result.png" alt="">
            <p>暂无搜索结果</p>
          </div>
        </div>
      </div>
    </div>

    <div class="healthy-meal-detail">
      <div class="delete-food" @click="deleteItem">
        删除
      </div>
      <div class="title">
        <div class="line-left"></div>
        <span>健康餐名称</span>
        <div class="line-right"></div>
      </div>

      <div class="class-item class-name">
        <div class="label">名称</div>
        <div>
          <q-input placeholder="请输入健康餐名称" v-model="currentMeal.healthyMealName"/>
        </div>
      </div>

      <div class="title">
        <div class="line-left"></div>
        <span>健康餐封面</span>
        <div class="line-right"></div>
      </div>

      <div class="class-item class-image">
        <div class="cover" v-if="currentMeal.healthyMealCoverImage">
          <img :src="currentMeal.healthyMealCoverImage" alt="">
        </div>
        <div class="image-empty" v-if="!currentMeal.healthyMealCoverImage" @click="toUploadImage">
          <img src="images/diet/food/image-empty-cover.png" alt="">
          <div class="empty-cover">
            <div class="camera">
              <img src="images/class/classInfo/camera.png" alt="">
            </div>
            <p>请点击上传封面</p>
          </div>
        </div>
        <div class="delete-image" v-if="currentMeal.healthyMealCoverImage" @click="deleteCoverImage">
          <img src="images/common/delete-gray.png" alt="">
        </div>
      </div>
      <input style="display: none" type="file" ref="refUploadFile" accept="image/*" @change="readLocalFile">

      <div class="title">
        <div class="line-left"></div>
        <span>营养成分</span>
        <div class="line-right"></div>
      </div>

      <div class="class-item nutritional-composition">
        <div class="nutritional-body">
          <div class="nutritional-line">
            <div class="nutritional-item">
              <span>热量</span>
              <span><q-input v-model="currentMeal.hot"/>千焦</span>
            </div>
            <div class="nutritional-item">
              <span>蛋白质</span>
              <span><q-input v-model="currentMeal.protein"/>克</span>
            </div>
          </div>
          <div class="nutritional-line">
            <div class="nutritional-item">
              <span>脂肪</span>
              <span><q-input v-model="currentMeal.fat"/>克</span>
            </div>
            <div class="nutritional-item">
              <span>碳水化合物</span>
              <span><q-input v-model="currentMeal.carbon"/>克</span>
            </div>
          </div>
        </div>
      </div>


      <div class="title">
        <div class="line-left"></div>
        <span>健康餐用料</span>
        <div class="line-right"></div>
      </div>

      <div class="class-item exercise-standard">
        <div class="standard-item-big" v-for="(item,index) in  currentMeal.healthyMealItems" :key="index">
          <div class="standard-item">
            <span>{{ item.healthyMealItemName }}</span>
            <span><q-input v-model="item.weight"/>克</span>
            <span><q-input v-model="item.share"/>份</span>
          </div>
          <div class="delete" @click="deleteFoodItem(index)">
            <img src="images/common/delete.png" alt="">
          </div>
        </div>
        <div class="item-add" @click="showAddMealItemDialog">+</div>
      </div>

      <div class="finish" @click="saveMeal">
        <div>保存</div>
      </div>
      <transition enter-active-class="animate__fadeIn animate__faster"
                  leave-active-class="animate__fadeOut animate__faster"
      >
        <SaveFinished
          :save-item-successfully="saveItemSuccessfully"
          :save-item-failed="saveItemFailed"
          :save-dialog-header-image="saveDialogHeaderImage"
          :save-message="saveMessage"
          class="animate__animated"
          style="z-index: 3000"
          v-if="saveDialogFlag"
        ></SaveFinished>
      </transition>

    </div>

    <transition enter-active-class="animate__fadeIn animate__faster"
                leave-active-class="animate__fadeOut animate__faster"
    >
      <AddMealItemDialog
        :meal-item-dialog-flag.sync="mealItemDialogFlag"
        @addMealItem="addMealItem"
        class="animate__animated"
        style="z-index: 3000"
        v-if="mealItemDialogFlag"
      ></AddMealItemDialog>
    </transition>

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


    <transition enter-active-class="animate__fadeIn animate__faster"
                leave-active-class="animate__fadeOut animate__faster"
    >
      <DeleteConfirm
        :deleteDialogFlag.sync="deleteDialogFlag"
        :delete-item-successfully="deleteItemSuccessfully"
        :delete-item-failed="deleteItemFailed"
        :delete-message="deleteMessage"
        @confirmDelete="confirmDelete"
        :index="currentItemIndex"
        v-if="deleteDialogFlag"
        class="animate__animated"
        style="z-index: 3000"
        ref="deleteDialog"
      ></DeleteConfirm>
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
import SaveFinished from "components/common/SaveFinished";
import "../q-input.scss"
import {
  apiHealthyMealList,
  apiHealthyMealDetail,
  apiUpdateHealthyMeal,
  apiSaveHealthyMeal,
  apiDeleteHealthyMeal
} from "src/api/healthyMeal";
import {apiUploadImage} from "src/api/upload";
import AddMealItemDialog from "components/dialog/AddMealItemDialog";
import AlertMessage from "components/common/AlertMessage";
import DeleteConfirm from "components/common/DeleteConfirm";
import LoadingData from "components/common/LoadingData";

export default {
  name: "HealthyMeal",
  components: {
    SaveFinished,
    AddMealItemDialog,
    AlertMessage,
    DeleteConfirm,
    LoadingData
  },
  data() {
    return {
      foodList: [],
      currentItemIndex: -1,
      currentMeal: {
        healthyMealName: "",
        healthyMealCoverImage: "",
        hot: null,
        fat: null,
        carbon: null,
        protein: null,
        healthyMealItems: []
      },
      //删除的相关属性
      deleteDialogFlag: false,
      deleteItemSuccessfully: false,
      deleteItemFailed: false,
      deleteMessage: "",
      //点击保存之后的相关属性
      saveDialogFlag: false,
      saveItemSuccessfully: false,
      saveItemFailed: false,
      saveDialogHeaderImage: "images/diet/food/image-empty-cover.png",
      saveMessage: "",

      mealItemDialogFlag: false,

      alertMessage: "",
      alertMessageFlag: false,
      loadingDataFlag: true,
      searchValue:""
    }
  },
  created() {
    this.loadData()
    this.saveMessage="数据访问记录玩儿"
  },
  methods: {
    initData(){
      this.currentMeal = {
        healthyMealName: "",
        healthyMealCoverImage: "",
        hot: null,
        fat: null,
        carbon: null,
        protein: null,
        healthyMealItems: []
      };
      this.currentItemIndex = -1;
    },
    loadData() {
      apiHealthyMealList({limit: 100,searchValue:this.searchValue}).then((res) => {
        setTimeout(() => {
          this.loadingDataFlag = false
        }, 400)
        this.foodList = res.data.data.list
      })
      this.initData()
    },
    doSearch(){
      this.loadData()
    },
    showAddMealItemDialog() {
      this.mealItemDialogFlag = true;
    },
    addMealItem(tempMealItem) {
      let mealItem = {
        healthyMealItemName: tempMealItem.healthyMealItemName,
        weight: tempMealItem.weight,
        share: tempMealItem.share
      }
      this.currentMeal.healthyMealItems.push(mealItem)
      this.mealItemDialogFlag = false
    },
    toUploadImage() {
      this.$refs.refUploadFile.click();
    },
    //点击上传图片
    readLocalFile() {
      let file = this.$refs.refUploadFile.files[0]
      let params = new FormData()  // 创建form对象
      params.append('file', file)  // 通过append向form对象添加数据
      params.append('prefix', 'food') // 添加form表单中其他数据
      apiUploadImage(params).then((res) => {
        this.currentMeal.healthyMealCoverImage = res.data.data;
      })
    },
    //删除健康餐封面
    deleteCoverImage() {
      this.currentMeal.healthyMealCoverImage = ""
    },
    //初始化数据
    newFood() {
      this.initData()
    },
    selectFood(index) {
      this.currentItemIndex = index
      apiHealthyMealDetail(this.foodList[index].healthyMealId).then((res) => {
        this.currentMeal = res.data.data
      })
    },
    deleteItem() {
      if (!this.currentMeal.healthyMealId) {
        this.alertMessage = "请先选择某一个健康餐，然后进行删除操作"
        this.alertMessageFlag = true;
        return
      }
      this.deleteMessage = "您确认要删除\"" + this.currentMeal.healthyMealName + "\"吗？"
      this.deleteDialogFlag = true;
    },
    confirmDelete(index) {
      setTimeout(() => {
        apiDeleteHealthyMeal(this.currentMeal.healthyMealId).then(() => {
          this.$refs.deleteDialog.deletingFlag = false
          this.deleteItemSuccessfully = true
          //重新加载数据
          this.loadData()
        }).catch(()=>{
          this.$refs.deleteDialog.deletingFlag = false
          this.deleteItemFailed = true;
        }).finally(()=>{
          setTimeout(() => {
            this.deleteDialogFlag = false
            setTimeout(() => {
              this.deleteItemSuccessfully = false
              this.deleteItemFailed = false;
            }, 1000)
          }, 800)
        })
      }, 1000)
    },
    saveMeal() {
      if (!this.currentMeal.healthyMealName) {
        this.alertMessage = "请输入健康餐名称"
        this.alertMessageFlag = true
        return
      }
      if (!this.currentMeal.healthyMealCoverImage) {
        this.alertMessage = "请选择健康餐封面"
        this.alertMessageFlag = true
        return
      }
      if(!this.currentMeal.hot){
        this.alertMessage = "请输入热量总量"
        this.alertMessageFlag = true
        return
      }
      if(!this.currentMeal.protein){
        this.alertMessage = "请输入蛋白质总量"
        this.alertMessageFlag = true
        return
      }
      if(!this.currentMeal.fat){
        this.alertMessage = "请输入脂肪总量"
        this.alertMessageFlag = true
        return
      }
      if(!this.currentMeal.carbon){
        this.alertMessage = "请输入碳水总量"
        this.alertMessageFlag = true
        return
      }

      this.saveMessage = "\n\"" + this.currentMeal.healthyMealName + "\"健康餐";
      this.saveDialogFlag = true
      if (this.currentMeal.healthyMealId) {
        //修改
        apiUpdateHealthyMeal(this.currentMeal).then((res) => {
          this.loadData()
          this.saveItemSuccessfully = true
        }).catch(()=>{
          this.saveItemFailed = true;
        }).finally(()=>{
          this.hideSaveDialog()
        })
      } else {
        //新增
        apiSaveHealthyMeal(this.currentMeal).then((res) => {
          this.loadData()
          this.saveItemSuccessfully = true
        }).catch(()=>{
          this.saveItemFailed = true;
        }).finally(()=>{
          this.hideSaveDialog()
        })
      }
    },
    hideSaveDialog(){
      setTimeout(() => {
        this.saveDialogFlag = false
        setTimeout(() => {
          this.saveItemSuccessfully = false
          this.saveItemFailed = false;
        }, 1200)
      }, 1000)
    },
    deleteFoodItem(index) {
      this.currentMeal.healthyMealItems.splice(index, 1)
    },

  }
}
</script>

<style scoped lang="scss">
#healthy-meal-content {
  height: 100%;
  width: 100%;
  padding: .5rem;
  display: flex;
  position: relative;

  .item-list {
    width: 36%;
    height: 100%;
    position: relative;

    > img {
      width: 54%;
      height: auto;
      position: absolute;
      top: .3rem;
      left: 23%;
      z-index: 2;
    }
    .top-left-search {
      position: absolute;
      top: 7rem;
      left: 3.2%;
      width: 90%;
      height: 2rem;
      z-index: 100;
      input {
        width: 100%;
        font-size: .9rem;
        padding-right: 2.3rem;
        border-radius: 1rem;
        background-color: rgba(0, 0, 0, 0.08);
        color: #4c4c4c;
        padding-left: 12%;
        border: 1px solid #ffffff;
        height: 2rem;
      }
      .search {
        position: absolute;
        right: 0;
        top: 2px;
        width: 2rem;
        height: 2rem;

        img {
          width: 60%;
          height: 60%;
          position: absolute;
          left: 14%;
          top: 20%;
        }
      }
    }
    .top-cover {
      position: absolute;
      top: 3.6rem;
      left: 1%;
      width: 94%;
      height: 7rem;
      z-index: 1;
      border-top-left-radius: .6rem;
      border-top-right-radius: .6rem;
      background: -webkit-gradient(linear, 100% 10%, 100% 100%, color-stop(0, #f8d375), color-stop(0.62, #fff), color-stop(1, rgba(255, 255, 255, 0)));
    }

    .bottom-cover {
      position: absolute;
      bottom: 1%;
      left: 1%;
      width: 94%;
      height: 12%;
      z-index: 1;
      border-bottom-left-radius: .6rem;
      border-bottom-right-radius: .6rem;
      background: -webkit-gradient(linear, 100% 10%, 100% 100%, color-stop(0, rgba(255, 255, 255, 0)), color-stop(0.38, #f6eac6), color-stop(0.65, #f8e09b), color-stop(1, #f8d375));
      img {
        position: absolute;
        bottom: 5%;
        left: 4%;
        height: 80%;
        width: 40%;
      }
      div {
        position: absolute;
        width: 58%;
        height: 60%;
        font-size: .9rem;
        line-height: 3rem;
        top: 34%;
        left: 46%;
        display: flex;
        justify-content: flex-start;
        align-items: center;
        color: #b16a0e;
      }
    }

    .item-list-content {
      position: absolute;
      top: 3.6rem;
      left: 1%;
      height: 88%;
      width: 94%;
      overflow-y: scroll;
      border: .15rem solid #fff;
      border-radius: .6rem;
      background-color: rgba(255, 255, 255, 0.54);
      .item-list-scroll {
        width: 100%;
        height: 100%;
        overflow-y: scroll;
        padding: 6.2rem 0 4rem;
        .item {
          width: 88%;
          margin-left: 6%;
          height: 3.5rem;
          margin-bottom: .6rem;
          background-color: rgba(255, 255, 255, 0.78);
          text-align: center;
          display: flex;
          justify-content: center;
          align-items: center;
          font-size: .7rem;
          box-shadow: 0 0 .6rem rgba(0, 0, 0, 0.18);
          position: relative;

          .item-selected-left, .item-selected-right {
            width: .5rem;
            height: .8rem;
            position: absolute;
            margin-top: -.4rem;
            top: 50%;

            >img {
              width: 100%;
              height: 100%;
              position: absolute;
              left:0;
              top:0;
            }
          }

          .item-selected-left {
            left: -.6rem;
          }

          .item-selected-right {
            right: -.6rem;
          }
        }

        .item-selected {
          background-color: #fdf3dc;
          color: #c18011;
          box-shadow: 0 0 .6rem rgba(#c18011, 0.38);
        }
        .item-empty {
          width: 100%;
          height: 100%;
          display: flex;
          justify-content: center;
          align-items: center;
          flex-direction: column;
          >img {
            width: 80%;
            height: 30%;
          }
          >p{
            color:#999;
            margin-top: .7rem;
          }
        }
      }
    }
  }


  .healthy-meal-detail {
    width: 64%;
    height: 100%;
    padding: .9rem .1rem 1rem 0;
    overflow-y: scroll;
    position: relative;

    .delete-food {
      position: absolute;
      top: 0;
      right: .1rem;
      width: 3.4rem;
      height: 1.6rem;
      border-radius: .3rem;
      border: 1px solid #efbaba;
      color: #ec8e8e;
      font-size: .8rem;
      display: flex;
      justify-content: center;
      align-items: center;
    }

    .title {
      height: 2.4rem;
      display: flex;
      justify-content: center;
      align-items: center;
      .line-left, .line-right {
        height:.1rem;
        background-color: #e99910;
      }

      .line-left {
        width: 4rem;
      }

      span {
        padding: 0 1rem;
        font-size: 1.1rem;
        color: #e99910;
        font-weight: bold;
      }

      .line-right {
        flex: 1;
      }
    }


    .class-item {
      width: 100%;
      border-radius: .6rem;
      background-color: rgba(255, 255, 255, 0.7);
      margin-bottom: 1rem;
    }

    .class-name {
      height: 4.5rem;
      display: flex;
      justify-content: space-between;
      align-items: center;

      .label {
        width: 30%;
        font-size: 1.1rem;
        padding-left: 4%;
      }

      div:nth-child(2) {
        flex: 1;

        label {
          font-size: 1rem;
          width: 80%;
          margin-left: 10%;
        }
      }
    }

    .class-image {
      height: 16rem;
      display: flex;
      justify-content: center;
      align-items: center;
      position: relative;
      .delete-image {
        width: 2rem;
        height: 2rem;
        display: flex;
        justify-content: center;
        align-items: center;
        position: absolute;
        right: 0;
        top: 0;
        img {
          width: 60%;
          height: 60%;
        }
      }
      .cover, .image-empty {
        width: 86%;
        height: 80%;
        border-radius: .5rem;
        border: 1px solid #eab068;
        overflow: hidden;
        img {
          width: 100%;
          height: 100%;
        }
      }

      .image-empty {
        position: relative;

        .empty-cover {
          width: 100%;
          height: 100%;
          position: absolute;
          left: 0;
          top: 0;
          z-index: 1;
          background-color: rgba(255, 255, 255, 0.72);
          display: flex;
          justify-content: center;
          align-items: center;
          flex-direction: column;

          .camera {
            width: 3rem;
            height: 3rem;
            border-radius: 2rem;
            background-color: #f6c269;
            display: flex;
            justify-content: center;
            align-items: center;
            margin-bottom: .6rem;

            img {
              width: 1.8rem;
              height: 1.7rem;
            }
          }

          p {
            color: #5b5959;
            font-size: .8rem;
            margin: 0;
          }
        }
      }
    }

    .nutritional-composition {
      height: 10rem;
      display: flex;
      justify-content: center;
      align-items: center;

      .nutritional-body {
        width: 92%;
        height: 80%;
        background-color: #ffefc6;
        background-color: rgba(#ffefc6, 0.6);
        border-radius: .3rem;
        padding: .5rem .1rem;

        .nutritional-line {
          height: 3.5rem;
          width: 100%;
          display: flex;
          line-height: 3.5rem;
          justify-content: center;

          .nutritional-item {
            display: flex;
            justify-content: space-between;

            label {
              width: 2.6rem;
              font-size: .9rem;
              height: 80%;
            }

            span:nth-child(1) {
              width: 65%;
              font-size: .9rem;
              font-weight: bold;
              padding-left: 8%;
            }

            span:nth-child(2) {
              font-size: .8rem;
              width: 45%;
              display: flex;
              justify-content: center;
              align-items: center;
            }
          }

          .nutritional-item:nth-child(1) {
            width: 45%;

            span:nth-child(2) {
              width: 70%;
              justify-content: center;
            }
          }

          .nutritional-item:nth-child(2) {
            width: 55%;

            span:nth-child(2) {
              text-align: right;
            }
          }
        }
      }
    }


    .exercise-standard {
      min-height: 7rem;
      padding: 1rem;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;

      .standard-item-big {
        width: 100%;
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin: 0 auto .8rem;

        .delete {
          width: 12%;
          height: 100%;
          display: flex;
          justify-content: flex-end;
          align-items: center;

          img {
            height: 1rem;
            width: 1rem;
          }
        }
      }

      .standard-item {
        width: 88%;
        height: 2.5rem;
        background-color: rgba(#fdf3dc, 0.8);
        line-height: 2.5rem;
        border-radius: .4rem;
        box-shadow: 0 0 .2rem #e99910;
        padding: 0 1rem;
        font-size: .8rem;
        display: flex;
        justify-content: space-between;

        label {
          width: 2.2rem;
          font-size: 1rem;
          height: 80%;
        }

        span {
          display: flex;
          align-items: center;
        }

        span:nth-child(1) {
          width: 44%;
          justify-content: flex-start;
        }

        span:nth-child(2) {
          width: 24%;
          text-align: right;
          justify-content: flex-end;
        }

        span:nth-child(3) {
          width: 32%;
          text-align: right;
          justify-content: flex-end;
        }
      }

      .standard-item:last-child {
        margin-bottom: 0;
      }

      .item-add {
        background-color: #ffda9c;
        width: 3rem;
        height: 3rem;
        border-radius: 50%;
        border: .1rem solid #e7c305;
        color: #fff;
        font-size: 2rem;
        line-height: 2.5rem;
        text-align: center;
      }

      .standard-empty {
        height: 9.5rem;
        width: 100%;
        display: flex;
        justify-content: center;
        align-items: center;
        flex-direction: column;
        margin-top: .3rem;

        img {
          width: 80%;
          height: 90%;
          border-radius: 1rem;
          margin-top: .3rem;
        }

        p {
          margin: .4rem;
          color: #888;
        }
      }
    }

    .finish {
      height: 2.5rem;
      width: 56%;
      margin: 2rem auto 1rem;
      background: linear-gradient(to right, #eccc72, #f6e0ba);
      border-radius: .6rem;
      text-align: center;
      line-height: 2.5rem;
      font-size: 1.1rem;
      color: #fff;
      font-weight: bold;
      box-shadow: .1rem .1rem .2rem #b9baba;
      overflow: hidden;

      div {
        width: 100%;
        height: 100%;
        border-radius: .6rem;
        box-shadow: -.1rem -.1rem .3rem #eccc72 inset;
      }
    }

  }


}
</style>
