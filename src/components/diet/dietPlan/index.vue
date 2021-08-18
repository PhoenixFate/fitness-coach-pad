<template>
  <div id="diet-plan-content">
    <div class="item-list">
      <img src="images/diet/dietPlan/item-title.png" alt="">
      <div class="top-cover"></div>
      <div class="top-left-search">
        <input type="text" placeholder="筛选饮食计划..." v-model="searchValue">
        <div class="search" @click="doSearch()">
          <img src="images/common/search.png" alt="">
        </div>
      </div>
      <div class="bottom-cover" @click="newExerciseItem">
        <img src="images/diet/dietPlan/item-bottom.png" alt="">
        <div>添加饮食计划</div>
      </div>
      <div class="item-list-content">
        <div class="item-list-scroll">
          <div class="item"
               v-for="(plan,index) in dietPlans"
               :key="index"
               :class="currentItemIndex===index?'item-selected':''"
               @click="selectDietItem(index)"
          >
            {{ plan.dietPlanName }}
            <div class="item-selected-left" v-if="currentItemIndex===index">
              <img src="images/diet/food/triangle-left.png" alt="">
            </div>
            <div class="item-selected-right" v-if="currentItemIndex===index">
              <img src="images/diet/food/triangle-right.png" alt="">
            </div>
          </div>
          <div class="item-empty" v-if="dietPlans.length===0">
            <img src="images/common/no-result.png" alt="">
            <p>暂无搜索结果</p>
          </div>
        </div>
      </div>
    </div>

    <div class="food-detail">
      <div class="delete-food" @click="deleteItem">
        删除
      </div>
      <div class="title">
        <div class="line-left"></div>
        <span>饮食计划名称</span>
        <div class="line-right"></div>
      </div>

      <div class="class-item class-name">
        <div class="label">名称</div>
        <div>
          <q-input placeholder="请输入饮食计划名称" v-model="currentDietPlan.dietPlanName"/>
        </div>
      </div>

      <div class="title">
        <div class="line-left"></div>
        <span>饮食计划详情</span>
        <div class="line-right"></div>
      </div>

      <div class="class-item plan-detail">
        <div class="detail-item" v-for="(dietPlanItem,index) in currentDietPlan.dietPlanItems" :key="index">
          <div class="delete-diet-item" @click="deleteDietItem">
            <img src="images/common/delete.png" alt="">
          </div>

          <div class="detail-title">
            <div class="detail-title-left">
              <img src="images/diet/mealType/breakfast.png" alt=""
                   v-if="dietPlanItem.mealType.mealTypeValue==='BREAKFAST'">
              <img src="images/diet/mealType/breakfast-more.png" alt=""
                   v-if="dietPlanItem.mealType.mealTypeValue==='BREAKFAST_MORE'">
              <img src="images/diet/mealType/lunch.png" alt="" v-if="dietPlanItem.mealType.mealTypeValue==='LUNCH'">
              <img src="images/diet/mealType/lunch-more.png" alt=""
                   v-if="dietPlanItem.mealType.mealTypeValue==='LUNCH_MORE'">
              <img src="images/diet/mealType/dinner.png" alt="" v-if="dietPlanItem.mealType.mealTypeValue==='DINNER'">
            </div>
            <div class="detail-title-right">
              <span>{{ dietPlanItem.mealType.mealTypeName }}</span>
            </div>
          </div>
          <h5>用餐时间</h5>
          <div class="meal-time">
            <div class="meal-time-content">
              <span>{{ dietPlanItem.mealType.startTime }}</span>
              <span>~</span>
              <span>{{ dietPlanItem.mealType.endTime }}</span>
            </div>
          </div>

          <h5>摄入指标</h5>
          <div class="target-line">
            <div class="target-item">
              <span>热量</span>
              <span><q-input v-model="dietPlanItem.hot"/>kj</span>
            </div>
            <div class="target-item">
              <span>碳水</span>
              <span><q-input v-model="dietPlanItem.carbon"/>g</span>
            </div>
          </div>
          <div class="target-line">
            <div class="target-item">
              <span>蛋白质</span>
              <span><q-input v-model="dietPlanItem.protein"/>g</span>
            </div>
            <div class="target-item">
              <span>脂肪</span>
              <span><q-input v-model="dietPlanItem.fat"/>g</span>
            </div>
          </div>

          <h5>推荐用餐</h5>
          <div class="food">
            <div class="meal-item" v-if="dietPlanItem.healthyMeal">
              <img :src="dietPlanItem.healthyMeal.healthyMealCoverImage" alt="">
              <p>{{ dietPlanItem.healthyMeal.healthyMealName }}</p>
            </div>
            <div class="food-empty" v-if="!dietPlanItem.healthyMeal" @click="showMealListDialog(index)">
              <img src="images/diet/dietPlan/empty-meal.png" alt="">
              <p>请点击选择餐食</p>
              <div class="empty-click">
                <img src="images/diet/dietPlan/click.png" alt="">
              </div>
            </div>
            <div class="delete-meal" v-if="dietPlanItem.healthyMeal" @click="deleteMeal(index)">
              <img src="images/common/delete-gray.png" alt="">
            </div>
          </div>
        </div>
        <div class="item-add" @click="showAddDietItemDialog">+</div>
      </div>

      <div class="finish" @click="saveDietPlan">
        <div>保存</div>
      </div>
      <transition enter-active-class="animate__fadeIn animate__faster"
                  leave-active-class="animate__fadeOut animate__faster"
      >
        <SaveFinished
          :save-item-successfully="saveItemSuccessfully"
          :save-dialog-header-image="saveDialogHeaderImage"
          :save-message="saveMessage"
          class="animate__animated"
          style="z-index: 3000"
          v-show="saveDialogFlag"
        ></SaveFinished>
      </transition>
    </div>

    <transition enter-active-class="animate__fadeIn animate__faster"
                leave-active-class="animate__fadeOut animate__faster"
    >
      <MealListDialog
        :meal-list-dialog-flag.sync="mealListDialogFlag"
        :current-diet-plan-item="currentDietPlanItem"
        :meal-list="mealList"
        class="animate__animated"
        style="z-index: 3000"
        v-show="mealListDialogFlag"
      ></MealListDialog>
    </transition>

    <transition enter-active-class="animate__fadeIn animate__faster"
                leave-active-class="animate__fadeOut animate__faster"
    >
      <AddDietPlanItemDialog
        :dietItemDialogFlag.sync="dietItemDialogFlag"
        :meal-list="mealList"
        :meal-type-list="mealTypeList"
        @addDietItem="addDietItem"
        class="animate__animated"
        style="z-index: 3000"
        v-if="dietItemDialogFlag"
      ></AddDietPlanItemDialog>
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
import SaveFinished from "components/common/SaveFinished";
import "../q-input.scss"
import {
  apiDietPlanList,
  apiDietPlanDetail,
  apiSaveDietPlan,
  apiUpdateDietPlan,
  apiDeleteDietPlan
} from "src/api/dietPlan";
import {apiHealthyMealList} from "src/api/healthyMeal";
import MealListDialog from "components/dialog/MealListDialog";
import {apiMealTypeList} from "src/api/mealType";
import AddDietPlanItemDialog from "components/dialog/AddDietPlanItemDialog";
import DeleteConfirm from "components/common/DeleteConfirm";
import AlertMessage from "components/common/AlertMessage";

export default {
  name: "DietPlan",
  components: {SaveFinished, MealListDialog, AddDietPlanItemDialog, DeleteConfirm, AlertMessage},
  data() {
    return {
      dietPlans: [],
      mealList: [],
      mealTypeList: [],
      currentItemIndex: -1,
      currentDietPlan: {
        dietPlanName: "",
        dietPlanItems: [],
      },
      currentDietPlanItem: {},

      //删除的相关属性
      deleteDialogFlag: false,
      deleteItemSuccessfully: false,
      deleteItemFailed: false,
      deleteMessage: "",
      //保存的相关属性
      saveDialogFlag: false,
      saveItemSuccessfully: false,
      saveItemFailed: false,
      saveMessage: "",
      saveDialogHeaderImage: "images/diet/food/image-empty-cover.png",
      mealListDialogFlag: false,
      dietItemDialogFlag: false,

      alertMessage: "",
      alertMessageFlag: false,
      searchValue: ""
    }
  },
  created() {
    this.loadData()
    this.loadDataCommon()
  },
  methods: {
    initData() {
      this.currentItemIndex = -1;
      this.currentDietPlan = {
        dietPlanName: "",
        dietPlanItems: [],
      }
    },
    doSearch() {
      this.loadData()
    },
    loadData() {
      apiDietPlanList({limit: 100, searchValue: this.searchValue}).then((res) => {
        this.dietPlans = res.data.data.list
      })
      this.initData()
    },
    loadDataCommon() {
      apiHealthyMealList({limit: 100}).then((res) => {
        this.mealList = res.data.data.list
      })
      apiMealTypeList({limit: 100}).then((res) => {
        this.mealTypeList = res.data.data.list
      })
    },
    showMealListDialog(index) {
      this.currentDietPlanItem = this.currentDietPlan.dietPlanItems[index]
      this.mealListDialogFlag = true
    },
    showAddDietItemDialog() {
      this.dietItemDialogFlag = true;
    },
    addDietItem(tempDietItem) {
      console.log(tempDietItem)
      let dietItem = {
        mealType: tempDietItem.mealType,
        mealTypeId: tempDietItem.mealTypeId,
        hot: tempDietItem.hot,
        carbon: tempDietItem.carbon,
        protein: tempDietItem.protein,
        fat: tempDietItem.fat,
        healthyMeal: tempDietItem.healthyMeal,
        healthyMealId: tempDietItem.healthyMealId,
      }
      this.currentDietPlan.dietPlanItems.push(dietItem)
    },
    newExerciseItem() {
      this.initData()
    },
    selectDietItem(index) {
      this.currentItemIndex = index
      apiDietPlanDetail(this.dietPlans[index].dietPlanId).then((res) => {
        console.log(res)
        this.currentDietPlan = res.data.data
      })
    },
    deleteMeal(dietItemIndex) {
      this.currentDietPlan.dietPlanItems[dietItemIndex].healthyMeal = null
      this.currentDietPlan.dietPlanItems[dietItemIndex].healthyMealId = null
    },
    deleteDietItem(index) {
      this.currentDietPlan.dietPlanItems.splice(index, 1)
    },
    deleteItem() {
      if (!this.currentDietPlan.dietPlanId) {
        this.alertMessage = "请先选择某一个饮食计划，然后进行删除操作"
        this.alertMessageFlag = true;
        return
      }
      this.deleteMessage = "您确认要删除\"" + this.currentDietPlan.dietPlanName + "\"吗？"
      this.deleteDialogFlag = true;
    },
    confirmDelete(index) {
      setTimeout(() => {
        apiDeleteDietPlan(this.currentDietPlan.dietPlanId).then(() => {
          this.$refs.deleteDialog.deletingFlag = false
          this.deleteItemSuccessfully = true
          //重新加载数据
          this.loadData()
        }).catch(() => {
          this.$refs.deleteDialog.deletingFlag = false
          this.deleteItemFailed = true;
        }).finally(() => {
          this.hideDeleteDialog()
        })
      }, 1000)
    },
    hideDeleteDialog() {
      setTimeout(() => {
        this.deleteDialogFlag = false
        setTimeout(() => {
          this.deleteItemSuccessfully = false
          this.deleteItemFailed = false;
        }, 1000)
      }, 800)
    },
    saveDietPlan() {
      if (!this.currentDietPlan.dietPlanName) {
        this.alertMessage = "请填写饮食计划名称"
        this.alertMessageFlag = true
        return
      }
      console.log(this.currentDietPlan)
      this.currentDietPlan.dietPlanItems.forEach((item, index) => {
        item.dietPlanId = this.currentDietPlan.dietPlanId
        item.sort = index + 1
      })
      this.saveMessage = "\"" + this.currentDietPlan.dietPlanName + "\"饮食计划";
      this.saveDialogFlag = true
      if (this.currentDietPlan.dietPlanId) {
        //修改
        apiUpdateDietPlan(this.currentDietPlan).then((res) => {
          this.saveItemSuccessfully = true
          //重新刷新数据
          this.loadData()
        }).catch(() => {
          this.saveItemFailed = true;
        }).finally(() => {
          this.hideSaveDialog()
        })
      } else {
        //新增
        apiSaveDietPlan(this.currentDietPlan).then((res) => {
          this.saveItemSuccessfully = true
          //重新刷新数据
          this.loadData()
        }).catch(() => {
          this.saveItemFailed = true;
        }).finally(() => {
          this.hideSaveDialog()
        })
      }
    },

    hideSaveDialog() {
      setTimeout(() => {
        this.saveDialogFlag = false
        setTimeout(() => {
          this.saveItemSuccessfully = false
          this.saveItemFailed = false;
        }, 1000)
      }, 800)
    }

  }
}
</script>

<style scoped lang="scss">
#diet-plan-content {
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
      width: 56%;
      height: auto;
      position: absolute;
      top: -.1rem;
      left: 22%;
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
          font-size: .7rem;
          box-shadow: 0 0 .6rem rgba(0, 0, 0, 0.18);
          position: relative;
          display: flex;
          justify-content: center;
          align-items: center;
          text-align: center;

          .item-selected-left, .item-selected-right {
            width: .5rem;
            height: .8rem;
            position: absolute;
            margin-top: -.4rem;
            top: 50%;

            > img {
              width: 100%;
              height: 100%;
              position: absolute;
              left: 0;
              top: 0;
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

          > img {
            width: 80%;
            height: 30%;
          }

          > p {
            color: #999;
            margin-top: .7rem;
          }
        }
      }
    }
  }


  .food-detail {
    width: 64%;
    height: 100%;
    padding: .9rem .1rem 1rem 0;
    position: relative;
    overflow-y: scroll;

    .delete-food {
      position: absolute;
      top: 0;
      right: .1rem;
      width: 3.4rem;
      height: 1.6rem;
      border-radius: .3rem;
      border: 1px solid #efbaba;
      color: #ec8e8e;
      z-index: 10;
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
        height: .1rem;
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
      height: 42%;
      display: flex;
      justify-content: center;
      align-items: center;

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

    .plan-detail {
      height: auto;
      padding: .5rem .5rem 1.5rem;
      display: flex;
      justify-content: center;
      align-items: center;
      flex-direction: column;

      .detail-item {
        height: auto;
        width: 100%;
        margin: 1.5rem auto 0;
        background-color: rgba(#efeab8, 0.3);
        box-shadow: 0 0 .2rem #999;
        border-radius: .6rem;
        position: relative;
        padding: 1rem;

        .delete-diet-item {
          width: 2rem;
          height: 2rem;
          display: flex;
          justify-content: center;
          align-items: center;
          position: absolute;
          right: 0;
          top: -1px;

          img {
            width: 60%;
            height: 60%;
          }
        }

        .meal-type-image {
          position: absolute;
          left: 0;
          top: 0;
          width: 3rem;
          height: 3rem;
          display: flex;
          justify-content: center;
          align-items: center;

          img {
            width: 60%;
            height: 60%;
          }
        }

        .detail-title {
          position: absolute;
          width: 8rem;
          left: 50%;
          margin-left: -4rem;
          top: -.9rem;
          height: 2.4rem;
          background-color: #f1a92e;
          font-size: .9rem;
          font-weight: bold;
          border-radius: .3rem;
          color: #fff;
          display: flex;
          justify-content: flex-start;
          align-items: center;

          .detail-title-left {
            width: 40%;
            display: flex;
            justify-content: center;
            align-items: center;

            img {
              width: 1.6rem;
              height: 1.6rem;
            }
          }

          .detail-title-right {
            width: 60%;
            display: flex;
            justify-content: flex-start;
            align-items: center;
          }

        }

        .meal-time {
          height: 2.5rem;
          width: 100%;

          .meal-time-content {
            margin-left: 4%;
            height: 2.5rem;
            width: 66%;
            min-width: 12rem;
            background-color: #fff;
            border-radius: .4rem;
            font-size: .9rem;
            padding-left: 5%;
            line-height: 2.5rem;

            span:nth-child(2) {
              margin: 0 1rem;
            }
          }
        }

        h5 {
          font-size: 1.1rem;
          margin: 1rem 0 .5rem;
        }

        .target-line {
          width: 100%;
          height: 2rem;
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding-left: 4%;
          margin-top: .5rem;

          .target-item {
            width: 46%;
            height: 100%;
            background-color: #fff;
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 0 .5rem;
            border-radius: .4rem;
            font-size: .9rem;

            span:nth-child(2) {
              display: flex;
              justify-content: center;
              align-items: center;
            }

            label {
              width: 2.7rem;
              font-size: .8rem;
            }
          }
        }

        .food {
          height: 9.5rem;
          width: 100%;
          display: flex;
          justify-content: center;
          align-items: center;
          flex-direction: column;
          position: relative;

          .delete-meal {
            width: 2rem;
            height: 2rem;
            display: flex;
            justify-content: center;
            align-items: center;
            position: absolute;
            right: 4%;
            top: -15%;

            img {
              width: 50%;
              height: 50%;
            }
          }

          .food-empty {
            > img {
              width: 9rem;
              height: 7rem;
            }

            p {
              text-align: center;
              color: #888;
              margin-top: .1rem;
            }

            .empty-click {
              width: 3rem;
              height: 3rem;
              border-radius: 50%;
              background-color: rgba(#fff, 0.8);
              position: absolute;
              top: 24%;
              left: 50%;
              margin-left: -1.5rem;
              display: flex;
              justify-content: center;
              align-items: center;
              border: 1px solid #ffc35a;

              img {
                width: 80%;
                height: 80%;
                margin-top: -18%;
                margin-left: 6%;
              }
            }
          }

          img {
            width: 9rem;
            height: 7rem;
            border-radius: .3rem;
          }

          p {
            margin-top: .1rem;
            margin-bottom: 0;
            text-align: center;
            font-size: .8rem;
          }
        }
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
        margin-top: .7rem;
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
          width: 16%;
          height: 100%;
          display: flex;
          justify-content: flex-end;
          align-items: center;

          img {
            height: 1rem;
            width: 1rem;
            margin-right: .3rem;
          }
        }
      }

      .standard-item {
        width: 84%;
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
          width: 2.1rem;
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
