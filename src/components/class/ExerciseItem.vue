<template>
  <div id="exercise-item-content">
    <div class="item-list">
      <img src="images/class/exerciseItem/item-title.png" alt="">
      <div class="top-left-search">
        <input type="text" placeholder="筛选训练项..." v-model="searchValue">
        <div class="search" @click="doSearch()">
          <img src="images/common/search.png" alt="">
        </div>
      </div>
      <div class="top-cover">
      </div>
      <div class="bottom-cover" @click="newExerciseItem">
        <img src="images/class/exerciseItem/item-bottom.png" alt="">
        <div>新增训练项</div>
      </div>
      <div class="item-list-content">
        <div class="item-list-scroll">
          <div class="item"
               v-for="(exerciseItem,index) in exerciseItems"
               :key="index"
               :class="currentItemIndex===index?'item-selected':''"
               @click="selectExerciseItem(index)"
          >
            {{ exerciseItem.exerciseName }}
            <div class="item-selected-left" v-if="currentItemIndex===index">
              <img src="images/class/exerciseItem/triangle-left.png" alt="">
            </div>
            <div class="item-selected-right" v-if="currentItemIndex===index">
              <img src="images/class/exerciseItem/triangle-right.png" alt="">
            </div>
          </div>
          <div class="item-empty" v-if="exerciseItems.length===0">
            <img src="images/common/no-result.png" alt="">
            <p>暂无搜索结果</p>
          </div>
        </div>
      </div>
    </div>
    <div class="item-info">
      <div class="title">
        <div class="line-left"></div>
        <span>训练项名称</span>
        <div class="line-right"></div>
      </div>

      <div class="exercise-item exercise-name">
        <div class="label">名称</div>
        <div>
          <q-input placeholder="请输入训练项名" v-model="currentExerciseItem.exerciseName"/>
        </div>
      </div>

      <div class="title">
        <div class="line-left"></div>
        <span>动作组</span>
        <div class="line-right"></div>
      </div>
      <div class="exercise-item exercise-action">
        <div class="add" @click="showAddActionDialog">
          <img src="images/class/exerciseItem/add.png" alt="">
        </div>
        <div class="actions">
          <div v-for="(actionSet,index) in currentExerciseItem.actionSets" :key="index" class="action-line">
            <div class="action-set">
              <span v-for="(action,actionIndex) in actionSet.actions" :key="actionIndex">
              {{ action.actionName }}
              <strong v-if="actionSet.actions.length>1 && actionIndex!==actionSet.actions.length-1">+</strong>
            </span>
            </div>
            <div class="delete-action-set" @click="deleteActionSet(index)">
              <img src="images/class/exerciseItem/delete.png" alt="">
            </div>
          </div>
          <div class="empty" v-if="currentExerciseItem.actionSets.length===0">
            <img src="images/class/exerciseItem/action-empty.png" alt="">
            <p>请点击右侧"+"号，添加所需的动作</p>
          </div>
        </div>
      </div>
      <div class="title">
        <div class="line-left"></div>
        <span>动作组排序</span>
        <div class="line-right"></div>
      </div>
      <div class="tips">
        tips: 长按拖动来修改下面动作组的顺序
      </div>
      <draggable
        :options="{group:'people',animation:150,ghostClass:'sortable-ghost',chosenClass:'chosenClass',scroll:true,scrollSensitivity:200}"
        v-model="currentExerciseItem.actionSets"
        @change="change"
        @start="start"
        @end="end"
        :move="move"
        class="exercise-item exercise-sort"
      >
        <div v-for="(actionSet, index) in currentExerciseItem.actionSets"
             :key="index" class="sort-item">
          <div class="index">
            <span>{{ (index + 1)|formatNumber }}</span>
          </div>
          <div class="left">
            <div class="action-set-type" :class="actionSetType[actionSet.actionSetType].activeClass">
              {{ actionSetType[actionSet.actionSetType].name }}
            </div>
          </div>
          <div class="middle">
            <div class="line" v-for="(action,actionIndex) in actionSet.actions" :key="actionIndex">
              {{ action.actionName }}
              <div class="divider-line" v-if="actionIndex!==actionSet.actions.length-1"></div>
            </div>
          </div>
        </div>
        <div class="empty" v-if="currentExerciseItem.actionSets.length===0">
          <img src="images/class/exerciseItem/sort-empty.png" alt="">
          <p>请先添加动作，然后进行排序</p>
        </div>
      </draggable>

      <div class="title">
        <div class="line-left"></div>
        <span>正常训练强度</span>
        <div class="line-right"></div>
      </div>

      <div class="exercise-item exercise-standard">
        <div class="standard-item" v-for="(actionSet,index) in  currentExerciseItem.actionSets" :key="index">
          <div class="set-type" :class="actionSetType[actionSet.actionSetType].activeClass">
            {{ actionSetType[actionSet.actionSetType].name }}
          </div>
          <div class="action-line" v-for="(action,actionIndex) in actionSet.actions" :key="actionIndex">
            <div class="line1">
              <div class="action-name-special">{{ action.actionName }}</div>
              <div class="action-set-special">
                <span v-if="!(actionSet.actionSetType!=='SUPER_SET')"></span>
                <span v-if="actionSet.actionSetType!=='SUPER_SET'">
                  <q-input v-model="actionSet.setNumber" type="number"/>组
                </span>
                <span v-if="action.unit==='SET'"><q-input v-model="action.count" type="number"/>次/组</span>
                <span v-if="action.unit==='SECOND'"><q-input v-model="action.time" type="number"/>秒</span>
              </div>
            </div>
            <div class="line2" v-if="actionSet.actionSetType!=='SUPER_SET'">
              <div class="rest">
                <div class="rest-left">
                  <span>每组间休息时间:</span>
                </div>
                <span><q-input v-model="actionSet.restInternal" type="number"/>秒</span>
              </div>
            </div>
            <div class="line2" v-if="actionSet.actionSetType==='REDUCE_SET'">
              <div class="rest">
                <div class="rest-left">
                  <span>递减组数:</span>
                </div>
                <span><q-input v-model="actionSet.reduceSetNumber" type="number"/>组</span></div>
            </div>
            <div class="line2" v-if="action.containWeight">
              <div class="rest">
                <div class="rest-left">
                  <span>重量:</span>
                </div>
                <span v-if="action.containWeight"><q-input v-model="action.weight" type="number"/>KG</span>
              </div>
            </div>
            <div class="divider-line"
                 v-if="actionIndex!==actionSet.actions.length-1 || actionSet.actionSetType==='SUPER_SET'"></div>
          </div>
          <div class="special-line" v-if="actionSet.actionSetType==='SUPER_SET'">
            <div class="line2">
              <div class="rest">
                <div class="rest-left">
                  <span>组数:</span>
                </div>
                <span><q-input v-model="actionSet.setNumber" type="number"/>组</span>
              </div>
            </div>
            <div class="line2">
              <div class="rest">
                <div class="rest-left">
                  <span>每组间休息时间:</span>
                </div>
                <span><q-input v-model="actionSet.restInternal" type="number"/>秒</span>
              </div>
            </div>
          </div>
        </div>
        <div class="standard-empty" v-if="currentExerciseItem.actionSets.length===0">
          <img src="images/class/exerciseItem/standard-empty.png" alt="">
          <p>请先添加动作，然后添加训练项标准</p>
        </div>
      </div>

      <div class="delete-item" @click="deleteItem">删除</div>

      <div class="finish" @click="saveExerciseItem">
        <div>保存</div>
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
        <SaveFinished
          :save-item-successfully="saveItemSuccessfully"
          :save-item-failed="saveItemFailed"
          :save-dialog-header-image="saveDialogHeaderImage"
          :save-message="saveMessage"
          class="animate__animated"
          style="z-index: 3000"
          v-show="saveDialogFlag"
        ></SaveFinished>
      </transition>

      <transition enter-active-class="animate__fadeIn animate__faster"
                  leave-active-class="animate__fadeOut animate__faster"
      >
        <ActionListDialog
          :addActionFlag.sync="addActionFlag"
          :actionSearchValue.sync="actionSearchValue"
          :actionData="actionData"
          @loadActionData="loadActionData"
          ref="actionListDialog"
          @addActionSet="addActionSet"
          style="z-index: 3000"
          class="animate__animated"
          v-if="addActionFlag"
        >
        </ActionListDialog>
      </transition>
    </div>
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
import ActionListDialog from "components/class/ActionListDialog";
import draggable from "vuedraggable"
import DeleteConfirm from "components/common/DeleteConfirm";
import SaveFinished from "components/common/SaveFinished";
import {ActionSetType} from "src/const/classManagement/actionSetType";
import "./q-input.scss"
import {
  apiExerciseList,
  apiExerciseDetail,
  apiSaveExercise,
  apiUpdateExercise,
  apiDeleteExercise
} from "src/api/exercise";
import {apiActionList} from "src/api/action";
import LoadingData from "components/common/LoadingData";

export default {
  name: "ExerciseItem",
  components: {
    draggable,
    DeleteConfirm,
    SaveFinished,
    ActionListDialog,
    LoadingData
  },
  data() {
    return {
      actionData: [],
      actionSetType: ActionSetType,
      exerciseItems: [],
      currentItemIndex: -1,
      currentExerciseItem: {
        exerciseName: "",
        actionSets: []
      },
      drag: false,

      //删除的相关属性
      deleteDialogFlag: false,
      deleteItemSuccessfully: false,
      deleteItemFailed: false,
      deleteMessage: "",
      //点击保存之后的相关属性
      saveDialogFlag: false,
      saveItemSuccessfully: false,
      saveItemFailed: false,
      saveDialogHeaderImage: "images/class/save-header.png",
      saveMessage: "",

      //添加动作组对话框
      addActionFlag: false,

      loadingDataFlag: true,
      searchValue: "",
      actionSearchValue: ""
    }
  },
  filters: {
    formatNumber: function (index) {
      return (Array(2).join('0') + index).slice(-2);
    }
  },
  created() {
    this.loadData()
  },
  methods: {
    loadData() {
      apiExerciseList({limit: 100, searchValue: this.searchValue}).then((res) => {
        setTimeout(() => {
          this.loadingDataFlag = false
        }, 400)
        this.exerciseItems = res.data.data.list
      })
      this.currentItemIndex = -1
      this.currentExerciseItem = {
        exerciseName: "",
        actionSets: []
      }
      this.loadActionData()
    },
    loadActionData() {
      console.log(this.actionSearchValue)
      apiActionList({searchValue: this.actionSearchValue}).then((res) => {
        console.log(res)
        res.data.data.forEach((item) => {
          item.actionTypeImageUrl = "img:" + item.actionTypeImageUrl
        })
        this.actionData = res.data.data
      })
    },
    newExerciseItem() {
      this.currentItemIndex = -1
      this.currentExerciseItem = {
        exerciseName: "",
        actionSets: []
      }
    },
    addActionSet(type) {
      let actionList = [];
      this.actionData.forEach((actions) => {
        actions.actions.forEach((action) => {
          if (action.selected) {
            console.log(action)
            let tempAction = {
              actionId: action.actionId,
              actionName: action.actionName,
              containWeight: action.containWeight,
              unit: action.unit,
              index: action.index
            }
            if (action.unit === "SECOND") {
              tempAction.time = 60
              tempAction.count = 10;
            }
            if (action.unit === "SET") {
              tempAction.count = 10;
            }
            if (action.containWeight) {
              tempAction.weight = 10
            }
            actionList.push(tempAction)
          }
        })
      })
      let finalActionList = []
      actionList.forEach((temp, actionIndex) => {
        actionList.forEach((action) => {
          if (action.index === (actionIndex + 1)) {
            finalActionList.push(action)
          }
        })
      })
      let actionSet = {
        actionSetType: type,
        exerciseId: this.currentExerciseItem.exerciseId,
        actions: finalActionList,
        restInternal: 60,
      }
      if (type === 'COMMON_SET') {
        actionSet.setNumber = 3
      } else if (type === 'SUPER_SET') {
        actionSet.setNumber = 1
      } else if (type === 'REDUCE_SET') {
        actionSet.setNumber = 3
        actionSet.reduceSetNumber = 3
      }
      this.currentExerciseItem.actionSets.push(actionSet)
      this.addActionFlag = false
      this.$refs.actionListDialog.initData()
      this.$forceUpdate()
    },
    showAddActionDialog() {
      this.addActionFlag = true;
    },
    selectExerciseItem(index) {
      this.currentItemIndex = index
      apiExerciseDetail(this.exerciseItems[index].exerciseId).then((res) => {
        console.log(res)
        this.currentExerciseItem = res.data.data;
      })
    },
    deleteItem() {
      if (this.currentItemIndex === -1) {
        this.alertMessage = "请先选择某一个训练项，然后进行删除操作"
        this.alertMessageFlag = true;
        return
      }
      this.deleteMessage = "您确认要删除\"" + this.currentExerciseItem.exerciseName + "\"这个训练项吗？"
      this.deleteDialogFlag = true;
    },
    confirmDelete() {
      setTimeout(() => {
        apiDeleteExercise(this.currentExerciseItem.exerciseId).then(() => {
          this.$refs.deleteDialog.deletingFlag = false
          this.deleteItemSuccessfully = true
          //重新加载数据
          this.loadData()
        }).catch(() => {
          this.$refs.deleteDialog.deletingFlag = false
          this.deleteItemFailed = true;
        }).finally(() => {
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
    deleteActionSet(index) {
      this.currentExerciseItem.actionSets.splice(index, 1)
    },
    doSearch() {
      this.loadData()
    },
    //保存训练项目
    saveExerciseItem() {
      this.saveMessage = "\"" + this.currentExerciseItem.exerciseName + "\"训练项"
      this.saveDialogFlag = true
      if (this.currentExerciseItem.exerciseId) {
        apiUpdateExercise(this.currentExerciseItem).then((res) => {
          this.saveItemSuccessfully = true
          //重新刷新数据
          this.loadData()
        }).catch(() => {
          this.saveItemFailed = true;
        }).finally(() => {
          this.hideDialog()
        })
      } else {
        apiSaveExercise(this.currentExerciseItem).then((res) => {
          this.saveItemSuccessfully = true
          //重新刷新数据
          this.loadData()
        }).catch(() => {
          this.saveItemFailed = true;
        }).finally(() => {
          this.hideDialog()
        })
      }
    },

    //evt里面有两个值，一个evt.added 和evt.removed  可以分别知道移动元素的ID和删除元素的ID
    change(evt) {
      console.log(evt, 'change...')
    },
    //start ,end ,add,update, sort, remove 得到的都差不多
    start(evt) {
      this.drag = true
      console.log(evt, 'start...')
    },
    end(evt) {
      console.log(evt, 'end....')
      this.drag = true
      evt.item //可以知道拖动的本身
      evt.to    // 可以知道拖动的目标列表
      evt.from  // 可以知道之前的列表
      evt.oldIndex  // 可以知道拖动前的位置
      evt.newIndex  // 可以知道拖动后的位置
    },
    move(evt, originalEvent) {
      console.log(evt, 'move')
      console.log(originalEvent) //鼠标位置
    },
    hideDialog() {
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
#exercise-item-content {
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
      width: 60%;
      height: auto;
      position: absolute;
      top: 0.2%;
      left: 20%;
      z-index: 2;
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
      background: -webkit-gradient(linear, 100% 10%, 100% 100%, color-stop(0, #f5b6aa), color-stop(0.62, #fff), color-stop(1, rgba(255, 255, 255, 0)));

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
        height: 100%;
        font-size: .9rem;
        padding-right: 2.3rem;
        border-radius: 1rem;
        background-color: rgba(0, 0, 0, 0.08);
        color: #4c4c4c;
        padding-left: 12%;
        border: 1px solid #ffffff;
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

    .bottom-cover {
      position: absolute;
      bottom: 1%;
      left: 1%;
      width: 94%;
      height: 12%;
      z-index: 1;
      border-bottom-left-radius: .6rem;
      border-bottom-right-radius: .6rem;
      background: -webkit-gradient(linear, 100% 10%, 100% 100%, color-stop(0, rgba(255, 255, 255, 0)), color-stop(0.38, #f5e9e9), color-stop(0.65, #f5dfdb), color-stop(1, #f1c7bf));

      img {
        position: absolute;
        top: 8%;
        left: 4%;
        height: 80%;
        width: 40%;
      }

      > div {
        position: absolute;
        width: 58%;
        height: 60%;
        font-size: 1rem;
        line-height: 3rem;
        top: 34%;
        left: 46%;
        display: flex;
        justify-content: flex-start;
        align-items: center;
        color: #81324d;
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
          width: 84%;
          margin-left: 8%;
          height: 3.5rem;
          margin-bottom: .7rem;
          background-color: rgba(255, 255, 255, 0.78);
          text-align: center;
          display: flex;
          justify-content: center;
          align-items: center;
          font-size: 1rem;
          box-shadow: 0 0 .6rem rgba(0, 0, 0, 0.18);
          position: relative;

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
            left: -.7rem;
          }

          .item-selected-right {
            right: -.7rem;
          }
        }

        .item-selected {
          background-color: #f5e9e9;
          color: #81324d;
          box-shadow: 0 0 .6rem rgba(#81324d, 0.38);
        }

        .item-empty {
          width: 100%;
          height: 100%;
          display: flex;
          justify-content: center;
          align-items: center;
          flex-direction: column;

          > img {
            width: 7rem;
            height: 8rem;
          }

          > p {
            color: #999;
            margin-top: .8rem;
            font-size: .8rem;
          }
        }
      }
    }
  }

  .item-info {
    width: 64%;
    height: 100%;
    padding: .9rem .1rem 1rem 0;
    overflow-y: scroll;
    position: relative;

    .title {
      height: 2.4rem;
      display: flex;
      justify-content: center;
      align-items: center;

      .line-left {
        width: 4rem;
        height: .1rem;
        background-color: #eb7775;
      }

      span {
        padding: 0 1rem;
        font-size: 1.1rem;
        color: #ec7777;
        font-weight: bold;
      }

      .line-right {
        flex: 1;
        height: .1rem;
        background-color: #eb7775;
      }
    }

    .exercise-item {
      width: 100%;
      border-radius: .6rem;
      background-color: rgba(255, 255, 255, 0.6);
      margin-bottom: 1rem;
    }

    .exercise-name {
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
          margin-left: 14%;
        }
      }
    }

    .exercise-action {
      min-height: 2rem;
      height: auto;
      display: flex;
      margin-bottom: 1.2rem;

      .actions {
        width: 76%;
        min-height: 2rem;
        height: auto;
        display: flex;
        justify-content: flex-start;
        align-items: flex-start;
        flex-direction: column;
        padding: 0 2rem 0 .4rem;

        .action-line {
          width: 100%;
          height: auto;
          margin-top: .5rem;
          position: relative;

          .action-set {
            background-color: #eaafb4;
            width: auto;
            padding: .3rem .7rem;
            font-size: .9rem;
            color: #983d51;
            border-radius: .2rem;
            display: inline-block;
          }

          .delete-action-set {
            width: 2rem;
            height: 2rem;
            display: flex;
            justify-content: center;
            align-items: center;
            position: absolute;
            right: -2rem;
            top: 50%;
            margin-top: -1rem;

            > img {
              width: 1.2rem;
              height: 1.2rem;
            }
          }
        }

        .action-line:last-child {
          margin-bottom: .5rem;
        }

        .empty {
          width: 100%;
          height: 10rem;
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;

          img {
            width: 7rem;
            height: 7rem;
            margin-top: .2rem;
          }

          p {
            margin: .1rem 0 .4rem 0;
            font-size: .8rem;
            color: #888;
          }
        }
      }

      .add {
        width: 24%;
        height: auto;
        display: flex;
        align-items: center;
        justify-content: center;
        padding-left: .4rem;

        img {
          width: 1.5rem;
          height: 1.5rem;
        }
      }
    }

    .tips {
      margin: -.5rem 0 .5rem;
      padding-left: 1rem;
      color: #999;
      font-size: .7rem;
    }

    .exercise-sort {
      min-height: 7rem;
      border-radius: .6rem;
      padding: .7rem .7rem 0 .7rem;
      overflow: hidden;

      .sort-item {
        min-height: 3rem;
        width: 100%;
        line-height: 3rem;
        font-size: .9rem;
        display: flex;
        justify-content: space-between;
        margin-bottom: .7rem;
        background-color: #fff;
        box-shadow: 0 0 .2rem #de4444;
        border-radius: .3rem;
        position: relative;
        overflow: hidden;

        .index {
          position: absolute;
          width: 4rem;
          height: 4rem;
          left: -2rem;
          top: -2rem;
          color: #fff;
          font-size: 1.1rem;
          transform: rotate(-45deg);
          display: flex;
          justify-content: center;
          align-items: flex-end;
          font-weight: bold;
          background: linear-gradient(to right, #f33a3a, #ea8282);

          span {
            margin-bottom: -.7rem;
          }
        }

        .left {
          width: 45%;
          height: auto;
          display: flex;
          justify-content: flex-end;
          align-items: center;

          .action-set-type {
            width: 4rem;
            height: 1.8rem;
            border: 1px solid #1D1D1D;
            display: flex;
            justify-content: center;
            align-items: center;
            font-size: .9rem;
            margin-right: 10%;
            border-radius: .2rem;
          }

          .type-super {
            border-color: #f33a3a;
            color: #f33a3a;
          }

          .type-common {
            border-color: #eca656;
            color: #eca656;
          }

          .type-reduce {
            border-color: #2dab5b;
            color: #2dab5b;
          }
        }

        .middle {
          width: 50%;
          min-height: 3rem;

          .line {
            height: 3rem;
            position: relative;

            .divider-line {
              position: absolute;
              height: .15rem;
              width: 80%;
              border-bottom: 1px solid #bfbfbf;
              bottom: 0;
              left: 0;
            }
          }
        }
      }

      .empty {
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;

        img {
          width: 10rem;
          height: 9.4rem;
        }

        p {
          margin: .5rem 0 .7rem 0;
          font-size: .9rem;
          color: #888;

        }
      }
    }

    .exercise-standard {
      min-height: 10rem;
      padding: .5rem;

      .standard-item {
        width: 100%;
        min-height: 2.5rem;
        background-color: rgb(252, 241, 231);
        margin: 0 auto .7rem;
        line-height: 2.5rem;
        border-radius: .4rem;
        box-shadow: 0 0 .2rem #ddb2b5;
        padding: 0 .4rem 0 2.2rem;
        font-size: .8rem;
        position: relative;
        overflow: hidden;

        .set-type {
          position: absolute;
          left: 0;
          top: 0;
          width: 2rem;
          height: 3.5rem;
          color: #fff;
          writing-mode: vertical-rl;
          background-color: #eca656;
          font-weight: bold;
          font-size: 1rem;
          display: flex;
          justify-content: center;
          align-items: center;
        }

        .type-common {
          background-color: #eca656;
        }

        .type-super {
          background-color: #f33a3a;
        }

        .type-reduce {
          background-color: #2dab5b;
        }

        .action-line {
          min-height: 3.6rem;
          margin-bottom: .5rem;
          position: relative;

          .divider-line {
            position: absolute;
            height: 1px;
            width: 90%;
            border-bottom: 1px solid #aaa;
            bottom: -0.2rem;
            left: 5%;
          }

          label {
            width: 2rem;
            font-size: 1rem;
            height: 80%;
          }

          .line1, .line2 {
            height: 2.5rem;
            display: flex;
            justify-content: space-between;
            align-items: center;
          }

          .line1 {
            position: relative;

            .action-name-special {
              width: 54%;
              font-size: 1rem;
              min-height: 2.5rem;
              line-height: 2.5rem;
              position: absolute;
              justify-content: flex-start;
              padding-left: 2%;
              left: 0;
              top: 0;
            }

            .action-set-special {
              width: 46%;
              height: 2.5rem;
              position: absolute;
              right: 0;
              top: 0;
              display: flex;

              span {
                display: flex;
                align-items: center;
                text-align: right;
                justify-content: flex-end;
              }

              span:nth-child(1) {
                width: 40%;
              }

              span:nth-child(2) {
                width: 60%;
              }
            }

          }

          .line2 {
            justify-content: flex-end;

            .rest {
              width: 66%;
              display: flex;
              justify-content: space-between;
              align-items: center;

              .rest-left {
                width: 60%;
                font-size: .8rem;
                display: flex;
                justify-content: flex-end;
                align-items: center;
              }

              > span {
                display: flex;
                align-items: center;
                text-align: right;
                justify-content: flex-end;
              }
            }
          }
        }

        .special-line {
          height: 5rem;
          margin: 1rem 0;
          width: 100%;

          label {
            width: 2rem;
            font-size: 1rem;
            height: 80%;
          }

          .line2 {
            height: 2.5rem;
            display: flex;
            align-items: center;
            justify-content: flex-end;

            .rest {
              width: 66%;
              display: flex;
              justify-content: space-between;
              align-items: center;

              .rest-left {
                width: 60%;
                font-size: .8rem;
                display: flex;
                justify-content: flex-end;
                align-items: center;
              }

              > span {
                display: flex;
                align-items: center;
                text-align: right;
                justify-content: flex-end;
              }
            }
          }
        }
      }

      .standard-item:last-child {
        margin-bottom: 0;
      }

      .standard-empty {
        height: 11rem;
        width: 100%;
        display: flex;
        justify-content: center;
        align-items: center;
        flex-direction: column;
        margin-top: .3rem;

        img {
          width: 80%;
          height: 88%;
          border-radius: .8rem;
          margin-top: .8rem;
        }

        p {
          margin: .5rem 0 .8rem 0;
          font-size: .9rem;
          color: #888;
        }
      }
    }

    .delete-item {
      position: absolute;
      right: .1rem;
      top: -1px;
      width: 3rem;
      height: 1.5rem;
      border-radius: .3rem;
      text-align: center;
      color: #fff;
      background-color: #de4b4b;
      display: flex;
      justify-content: center;
      align-items: center;
      font-size: .7rem;
    }

    .finish {
      height: 2.5rem;
      width: 56%;
      margin: 2rem auto 1rem;
      background: linear-gradient(to right, #c49ca0, #e3ccca);
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
        box-shadow: -.1rem -.1rem .3rem #c6a29d inset;
      }
    }
  }
}
</style>
