<template>
  <div id="class-info-content">
    <div class="item-list">
      <img src="images/class/classInfo/list-header.png" alt="">
      <div class="top-left-search">
        <input type="text" placeholder="筛选课程..." v-model="searchValue">
        <div class="search" @click="doSearch">
          <img src="images/common/search.png" alt="">
        </div>
      </div>
      <div class="top-cover">
      </div>
      <div class="bottom-cover">
        <img src="images/class/classInfo/list-bottom.png" alt="">
        <div @click="newClassItem">新增课程</div>
      </div>
      <div class="item-list-content">
        <div class="item-list-scroll">
          <div class="item"
               v-for="(classItem,index) in classItemsData"
               :key="index"
               :class="currentItemIndex===index?'item-selected':''"
               @click="selectClassItem(index)"
          >
            {{ classItem.className }}
            <div class="item-selected-left" v-if="currentItemIndex===index">
              <img src="images/class/exerciseItem/triangle-left.png" alt="">
            </div>
            <div class="item-selected-right" v-if="currentItemIndex===index">
              <img src="images/class/exerciseItem/triangle-right.png" alt="">
            </div>
          </div>
          <div class="item-empty" v-if="classItemsData.length===0">
            <img src="images/common/no-result.png" alt="">
            <p>暂无搜索结果</p>
          </div>
        </div>
      </div>
    </div>

    <div class="class-info">
      <div class="title">
        <div class="line-left"></div>
        <span>课程名称</span>
        <div class="line-right"></div>
      </div>

      <div class="class-item class-name">
        <div class="label">课程名称</div>
        <div>
          <q-input placeholder="请输入课程名称" v-model="currentClassInfo.className"/>
        </div>
      </div>

      <div class="title">
        <div class="line-left"></div>
        <span>课程封面</span>
        <div class="line-right"></div>
      </div>

      <div class="class-item class-image">
        <div class="cover" v-if="currentClassInfo.classCoverImage">
          <img :src="currentClassInfo.classCoverImage" alt="">
        </div>
        <div class="image-empty" v-if="!currentClassInfo.classCoverImage">
          <img src="images/class/classInfo/image-empty-cover.jpg" alt="">
          <div class="empty-cover" @click="toUploadImage">
            <div class="camera">
              <img src="images/class/classInfo/camera.png" alt="">
            </div>
            <p>请点击上传封面</p>
          </div>
        </div>
        <div class="delete-image" v-if="currentClassInfo.classCoverImage" @click="deleteCoverImage">
          <img src="images/common/delete-gray.png" alt="">
        </div>
      </div>

      <div class="title">
        <div class="line-left"></div>
        <span>课程时长</span>
        <div class="line-right"></div>
      </div>

      <div class="class-item class-duration">
        <div class="label">课程时长</div>
        <div>
          <q-input placeholder="分钟" v-model="currentClassInfo.duration" type="number"/>
          <span>(分钟)</span>
        </div>
      </div>

      <div class="title">
        <div class="line-left"></div>
        <span>课程训练项</span>
        <div class="line-right"></div>
      </div>
      <div class="exercise-item clearfix" v-for="(exerciseItem,index) in currentClassInfo.exercises" :key="index">
        <div class="title">
          {{ exerciseItem.exerciseName }}
        </div>
        <div class="delete" @click="deleteExerciseItem(index)">
          <img src="images/class/exerciseItem/delete.png" alt="">
        </div>
        <div class="tabs">
          <div class="tabs-content">
            <div class="standard-item" v-for="(actionSet,index) in  exerciseItem.actionSets" :key="index">
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
                    <span><q-input
                      v-model="actionSet.restInternal"/>秒</span></div>
                </div>
                <div class="line2" v-if="actionSet.actionSetType==='REDUCE_SET'">
                  <div class="rest">
                    <div class="rest-left">
                      <span>递减组数:</span>
                    </div>
                    <span><q-input
                      v-model="actionSet.reduceSetNumber"/>组</span></div>
                </div>
                <div class="line2" v-if="action.containWeight">
                  <div class="rest">
                    <div class="rest-left">
                      <span>重量:</span>
                    </div>
                    <span v-if="action.containWeight"><q-input v-model="action.weight"/>KG</span>
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
          </div>
        </div>
        <div class="connection">
          <img src="images/class/classInfo/exercise-connection.png" alt="">
          <img src="images/class/classInfo/exercise-connection.png" alt="">
        </div>
      </div>

      <div class="class-item class-exercise-item-add">
        <div class="add-background" @click="showExerciseDialog">
          <img src="images/class/classInfo/exercise-add-background.png" alt="">
          <div class="background-cover">
            <img src="images/class/classInfo/exercise-add.png" alt="">
            <p>请点击添加训练项</p>
          </div>
        </div>
      </div>

      <div class="title">
        <div class="line-left"></div>
        <span>训练项排序</span>
        <div class="line-right"></div>
      </div>
      <div class="tips">
        tips: 长按拖动来修改下面动作组的顺序
      </div>
      <draggable
        :options="{group:'people',animation:150,ghostClass:'sortable-ghost',chosenClass:'chosenClass',scroll:true,scrollSensitivity:200}"
        v-model="currentClassInfo.exercises"
        class="class-item class-sort"
      >
        <div v-for="(exercise, index) in currentClassInfo.exercises"
             :key="index" class="sort-item">
          <div class="left">
            <span>{{ (index + 1)|formatNumber }}</span>
          </div>
          <div class="right">
              {{ exercise.exerciseName }}
          </div>
        </div>
        <div class="empty" v-if="currentClassInfo.exercises.length===0">
          <img src="images/class/exerciseItem/sort-empty.png" alt="">
          <p>请先添加动作，然后进行排序</p>
        </div>
      </draggable>


      <div class="delete-item" @click="deleteItem">删除</div>
      <div class="finish" @click="saveClassInfo">
        <div>保存</div>
      </div>

      <input style="display: none" type="file" ref="refUploadFile" accept="image/*" @change="readLocalFile">


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
        <ExerciseItemListDialog
          :exerciseDialogFlag.sync="exerciseDialogFlag"
          :current-class-info="currentClassInfo"
          :exercise-list="exercises"
          v-if="exerciseDialogFlag"
          class="animate__animated"
          style="z-index: 3000">
        </ExerciseItemListDialog>
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
  </div>
</template>

<script>
import ExerciseItemListDialog from "components/class/ExerciseItemListDialog";
import SaveFinished from "components/common/SaveFinished";
import DeleteConfirm from "components/common/DeleteConfirm";
import {ActionSetType} from "src/const/classManagement/actionSetType";
import {
  apiClassInfoList,
  apiClassInfoDetail,
  apiDeleteClassInfo,
  apiUpdateClassInfo,
  apiSaveClassInfo
} from "src/api/classInfo";
import {apiExerciseListWithDetail} from "src/api/exercise";
import "./q-input.scss"
import {apiUploadImage} from "src/api/upload";
import AlertMessage from "components/common/AlertMessage";
import draggable from "vuedraggable"

export default {
  name: "ClassInfo",
  components: {draggable, SaveFinished, DeleteConfirm, ExerciseItemListDialog, AlertMessage},
  data() {
    return {
      actionSetType: ActionSetType,
      exercises: [],
      currentItemIndex: -1,
      classItemsData: [],
      currentClassInfo: {
        className: "",
        classCoverImage: "",
        duration: null,
        exercises: []
      },
      //删除的相关属性
      deleteDialogFlag: false,
      deleteItemSuccessfully: false,
      deleteItemFailed: false,
      deleteMessage: "",
      //保存的相关属性
      saveDialogFlag: false,
      saveItemSuccessfully: false,
      saveItemFailed: false,
      saveDialogHeaderImage: "images/class/save-header.png",
      saveMessage: "",

      //选择训练项
      exerciseDialogFlag: false,

      alertMessage: "",
      alertMessageFlag: false,
      searchValue: ""
    }
  },
  filters: {
    formatNumber: function (index) {
      return (Array(2).join('0') + index).slice(-2);
    }
  },
  created() {
    this.loadData()
    this.loadDataCommon()
  },
  methods: {
    initData() {
      this.currentClassInfo = {
        className: "",
        classCoverImage: "",
        duration: null,
        exercises: []
      }
      this.currentItemIndex = -1
    },
    loadData() {
      apiClassInfoList({limit: 100, searchValue: this.searchValue}).then((res) => {
        this.classItemsData = res.data.data.list
      })
      this.initData()
    },
    loadDataCommon() {
      apiExerciseListWithDetail().then((res) => {
        this.exercises = res.data.data
      })
    },
    doSearch() {
      this.loadData()
    },
    toUploadImage() {
      this.$refs.refUploadFile.value = ''
      this.$refs.refUploadFile.click();
    },
    //点击上传图片
    readLocalFile() {
      let file = this.$refs.refUploadFile.files[0]
      let params = new FormData()  // 创建form对象
      params.append('file', file)  // 通过append向form对象添加数据
      params.append('prefix', 'actionType') // 添加form表单中其他数据
      apiUploadImage(params).then((res) => {
        this.currentClassInfo.classCoverImage = res.data.data
      })
    },
    newClassItem() {
      this.initData()
    },
    deleteCoverImage() {
      this.currentClassInfo.classCoverImage = ""
    },
    deleteItem() {
      if (this.currentItemIndex === -1) {
        this.alertMessage = "请先选择某一个课程，然后进行删除操作"
        this.alertMessageFlag = true;
        return
      }
      this.deleteMessage = "您确认要删除\"" + this.currentClassInfo.className + "\"这个课程吗？"
      this.deleteDialogFlag = true;
    },
    confirmDelete() {
      setTimeout(() => {
        apiDeleteClassInfo(this.currentClassInfo.classId).then((res) => {
          console.log(res)
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
    showExerciseDialog() {
      this.exerciseDialogFlag = true;
    },
    deleteExerciseItem(index) {
      this.currentClassInfo.exercises.splice(index, 1)
    },
    selectClassItem(index) {
      this.currentItemIndex = index
      apiClassInfoDetail(this.classItemsData[index].classId).then((res) => {
        console.log(res)
        this.currentClassInfo = res.data.data
      })
    },
    saveClassInfo() {
      if (!this.currentClassInfo.className) {
        this.alertMessage = "课程名称不能为空"
        this.alertMessageFlag = true;
        return
      }
      if (!this.currentClassInfo.exercises) {
        this.alertMessage = "训练项目不能为空"
        this.alertMessageFlag = true;
        return
      }
      if (!this.currentClassInfo.duration) {
        this.alertMessage = "请填写课程时长"
        this.alertMessageFlag = true;
        return
      }
      this.saveMessage = "\"" + this.currentClassInfo.className + "\"课程信息";
      this.saveDialogFlag = true
      console.log(this.currentClassInfo)
      if (this.currentClassInfo.classId) {
        apiUpdateClassInfo(this.currentClassInfo).then((res) => {
          this.saveItemSuccessfully = true
          //重新刷新数据
          this.loadData()
        }).catch(() => {
          this.saveItemFailed = true;
        }).finally(() => {
          setTimeout(() => {
            this.saveDialogFlag = false
            setTimeout(() => {
              this.saveItemSuccessfully = false
              this.saveItemFailed = false;
            }, 1000)
          }, 800)
        })
      } else {
        apiSaveClassInfo(this.currentClassInfo).then(() => {
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
#class-info-content {
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
        bottom: 5%;
        left: 4%;
        height: 80%;
        width: 40%;
      }

      div {
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
          margin-bottom: .6rem;
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

  .class-info {
    width: 64%;
    height: 100%;
    padding: .9rem .1rem 1rem 0;
    overflow-y: scroll;
    overflow-x: hidden;
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

    .tips {
      margin: -.3rem 0 .6rem;
      padding-left: 1rem;
      color: #999;
      font-size: .7rem;
    }

    .class-item {
      width: 100%;
      border-radius: .6rem;
      background-color: rgba(255, 255, 255, 0.6);
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
          margin-left: 13%;
        }
      }
    }

    .class-duration {
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
        display: flex;
        align-items: center;

        label {
          font-size: 1rem;
          width: 18%;
          margin-left: 30%;
          text-align: center;
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
        position: absolute;
        top: 2px;
        right: 1px;
        width: 2rem;
        height: 2rem;
        display: flex;
        justify-content: center;
        align-items: center;
        z-index: 20;

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
            background-color: #e5b77d;
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

    .class-exercise-item-add {
      min-height: 13rem;
      padding: 1rem 0;
      box-shadow: 0 .1rem .3rem #fa9285;
      border-radius: 1rem;
      width: 98%;
      margin: 1rem auto;
      display: flex;
      justify-content: center;
      align-items: center;

      .add-background {
        width: 9rem;
        height: 9rem;
        border-radius: 50%;
        position: relative;

        > img {
          width: 80%;
          height: 80%;
          margin-left: 10%;
          margin-top: 10%;
        }

        .background-cover {
          position: absolute;
          left: 0;
          top: 0;
          width: 100%;
          height: 100%;
          background-color: rgba(255, 255, 255, 0.68);
          border-radius: 50%;
          border: .1rem solid #f5d9b7;
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;

          img {
            width: 3rem;
            height: 3rem;
            margin: .6rem 0 .4rem .2rem;
          }

          p {
            color: #403e3e;
            font-size: .8rem;
            margin: 0;
          }
        }
      }
    }

    .exercise-item {
      height: auto;
      width: 98%;
      margin: 1rem auto;
      background-color: rgba(255, 255, 255, 0.6);
      border-radius: 1rem;
      position: relative;
      box-shadow: 0 .1rem .3rem #fa9285;
      display: flex;
      justify-content: center;
      align-items: center;
      padding: 1.8rem .3rem;

      .title {
        position: absolute;
        height: 2rem;
        width: 54%;
        top: -.5rem;
        left: 25%;
        color: #fff;
        text-align: center;
        line-height: 1.6rem;
        background-image: url("../../assets/images/class/classInfo/exercise-title.png");
        background-size: 100% 100%;
        padding-right: 5%;
        font-weight: bold;
        font-size: 1rem;
      }

      .delete {
        position: absolute;
        top: -.8rem;
        right: -.5rem;
        width: 2rem;
        height: 2rem;

        img {
          width: 60%;
          height: 60%;
          margin-left: 20%;
          margin-top: 20%;
        }
      }

      .connection {
        position: absolute;
        bottom: -2.5rem;
        left: 10%;
        height: 4rem;
        width: 80%;
        display: flex;
        justify-content: space-between;
        z-index: 1;

        img {
          width: 1.2rem;
          height: 100%;
        }
      }

      .tabs {
        width: 100%;
        height: auto;
        margin-top: 2%;

        .tabs-title {
          height: 1.7rem;
          display: flex;

          div {
            width: 100%;
            border-top-left-radius: .6rem;
            border-top-right-radius: .6rem;
            line-height: 1.7rem;
            text-align: center;
            color: #8d435d;
            margin-bottom: -1px;
            box-shadow: -.1rem 1px .15rem #f8b54f inset;
            background: linear-gradient(to bottom, #fff9f1 0%, #ffe1c3 38%, #ffcc7e 100%);
            font-size: .9rem;
          }

          .tabs-selected {
            background: linear-gradient(to bottom, #fffaf8 0%, #f9a2a1 100%);
            box-shadow: -.1rem 1px .15rem #f69a99 inset;
          }
        }

        .tabs-content {
          height: auto;
          border: 1px solid #fdad41;
          border-bottom-left-radius: .3rem;
          border-bottom-right-radius: .3rem;
          background-color: #fff;
          padding: .5rem;
          border-radius: .4rem;

          .standard-item {
            width: 100%;
            min-height: 2.5rem;
            background-color: rgb(252, 241, 231);
            margin: 0 auto .5rem;
            line-height: 2.5rem;
            border-radius: .4rem;
            box-shadow: 0 0 .2rem #ddb2b5;
            padding: 0 .2rem 0 2.1rem;
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
                border-bottom: 1px solid #cbcbcb;
                bottom: -.3rem;
                left: 5%;
              }

              label {
                width: 2rem;
                font-size: .9rem;
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

          .action {
            height: 2rem;
            line-height: 2rem;
            display: flex;
            justify-content: space-between;

            span {
              display: flex;
              justify-content: center;
              align-items: center;
            }

            label {
              width: 1.5rem;
              font-size: .9rem;
              height: 60%;
            }

            span:nth-child(1) {
              width: 46%;
              justify-content: flex-start;
            }

            span:nth-child(2) {
              width: 24%;
              text-align: right;
              justify-content: flex-end;
            }

            span:nth-child(3) {
              width: 30%;
              text-align: right;
              padding-right: 1rem;
              justify-content: flex-end;
            }
          }
        }
      }
    }

    .class-sort {
      border-radius: .6rem;
      padding: .7rem .7rem 0 .7rem;
      overflow: hidden;

      .sort-item {
        min-height: 3rem;
        width: 100%;
        line-height: 3rem;
        font-size: .9rem;
        display: flex;
        justify-content: flex-start;
        margin-bottom: .7rem;
        background-color: #fff;
        border-radius: .3rem;
        position: relative;
        overflow: hidden;
        background-image: url("../../assets/images/class/classInfo/class-sort.png");
        background-size: 100% 100%;
        .left {
          width: 44%;
          height: 100%;
          color:#a50202;
          display: flex;
          font-size: 1.3rem;
          font-weight: bold;
          justify-content: center;
          align-items: center;
          padding-left: 2.2rem;
        }
        .right {
          width: 56%;
          height: 100%;
          font-size: .9rem;
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
        box-shadow: -.1rem -.1rem .4rem #c6a29d inset;
      }
    }
  }


}
</style>
