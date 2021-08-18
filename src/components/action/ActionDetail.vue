<template>
  <div id="action-detail-content">
    <div class="action-detail-body">
      <div class="action-list">
        <div class="top-left-search">
          <input type="text" placeholder="筛选动作..." v-model="searchValue">
          <div class="search" @click="doSearch">
            <img src="images/common/search.png" alt="">
          </div>
        </div>
        <div class="action-list-scroll">
          <q-expansion-item
            expand-separator
            v-for="(actionType,typeIndex) in actionData" :key="typeIndex"
            :icon="actionType.actionTypeImageUrl"
            :label="actionType.actionTypeName"
            default-opened
          >
            <q-item
              v-for="(action,actionIndex) in actionType.actions"
              :key="actionIndex"
              clickable
              :header-inset-level="1"
              :inset-level="0.3"
              @click="selectAction(typeIndex,actionIndex)"
            >
              <div class="selected" v-if="currentActionIndex===actionIndex && currentTypeIndex===typeIndex"></div>
              <q-item-section class="my-section"
                              :class="(currentActionIndex===actionIndex && currentTypeIndex===typeIndex)?'my-section-selected':''">
                <q-item-label>{{ action.actionName }}</q-item-label>
              </q-item-section>
            </q-item>
          </q-expansion-item>
          <div class="item-empty" v-if="actionData.length===0">
            <img src="images/common/no-result.png" alt="">
            <p>暂无搜索结果</p>
          </div>
        </div>
      </div>
      <div class="new-action-button">
        <img src="images/action/detail/new-action.png" alt="">
        <div class="new-button" @click="newAction">新增动作</div>
      </div>
      <div class="list-border">
        <div class="border-header"></div>
        <div class="border-body"></div>
        <div class="list-flower">
          <img src="images/action/flower-02.png" alt="">
        </div>
        <div class="list-flower2">
          <img src="images/action/flower-03.png" alt="">
        </div>
      </div>
      <div class="action-detail">
        <div class="title">
          动作示范
        </div>
        <div class="action-images">
          <div class="guide" v-if="action.actionExamples.length===0">
            <img src="images/action/detail/action-example.png" alt="">
            <p>请点击右侧添加动作示范</p>
          </div>
          <div class="action-image" v-for="(example,exampleIndex) in action.actionExamples" :key="exampleIndex">
            <img :src="example" alt="">
            <div class="delete" @click="deleteActionExample(exampleIndex)"><img src="images/action/detail/delete.png"
                                                                                alt="">
            </div>
          </div>
          <div class="action-image-add" @click="toUploadImage">
            +
          </div>
          <div class="empty"></div>
        </div>
        <div class="action-form-item action-name">
          <div class="label">动作名称</div>
          <div class="name">
            <q-input placeholder="请输入动作名" v-model="action.actionName"/>
          </div>
        </div>
        <div class="action-form-item">
          <div class="label">动作分类</div>
          <div class="action-type" @click="toChooseActionType">
            <img :src="action.actionType.actionTypeImageUrl" alt="" v-if="action.actionType.actionTypeId">
            <h5 v-if="action.actionType.actionTypeId">{{ action.actionType.actionTypeName }}</h5>
            <p v-if="!action.actionType.actionTypeId">请点击选择动作类别</p>
            <div class="choose">
              <img src="images/action/detail/choose.png" alt="">
            </div>
          </div>
        </div>
        <div class="action-form-item">
          <div class="label">涉及器械</div>
          <div class="action-equipment">
            <div class="guide" v-if="action.equipments.length===0">
              <img src="images/action/detail/empty-equipments.png" alt="">
              <p>请点击右侧添加设备</p>
            </div>
            <div class="one-equipment" v-for="(equipment,equipmentIndex) in action.equipments"
                 :key="equipmentIndex">
              <div class="image">
                <img :src="equipment.equipmentImageUrl" alt="">
                <div class="delete" @click="deleteEquipment(equipmentIndex)"><img
                  src="images/action/detail/delete.png" alt="">
                </div>
              </div>
              <div class="name">{{ equipment.equipmentName }}</div>
            </div>
            <div class="equipment-add" @click="showEquipmentList">
              +
            </div>
            <div class="empty">

            </div>
          </div>
        </div>
        <div class="action-form-item">
          <div class="label">是否含重量</div>
          <div class="action-weight">
            <q-radio left-label v-model="action.containWeight" val=1 label="是" color="teal"
                     style="margin-right: .6rem"/>
            <q-radio left-label v-model="action.containWeight" val=0 label="否" color="orange"/>
          </div>
        </div>
        <div class="action-form-item">
          <div class="label">动作训练单位</div>
          <div class="action-weight">
            <q-radio left-label v-model="action.unit" val=SECOND label="秒" color="teal"
                     style="margin-right: .6rem"/>
            <q-radio left-label v-model="action.unit" val=SET label="组" color="orange"
                     style="margin-right: .6rem"/>
            <q-radio left-label v-model="action.unit" val=METER label="米" color="blue"/>
          </div>
        </div>
        <div class="action-form-item">
          <div class="label">动作描述</div>
          <div class="action-description"><textarea v-model="action.actionDescription"
                                                    placeholder="快来添加动作描述吧"></textarea></div>
        </div>
        <div class="action-form-item">
          <div class="label">动作录入</div>
          <div class="action-video" @click="playVideo">
            <img src="images/action/detail/video.png" alt="">
            <p>动作演示讲解</p>
          </div>
        </div>
        <div class="finish" @click="saveActionDetail">
          <div>保存</div>
        </div>
        <div class="delete-action" @click="deleteItem">删除</div>
      </div>
    </div>

    <SelectActionTypeList
      :action="action"
      :action-type-data.sync="actionTypeData"
      :action-type-dialog-flag.sync="actionTypeDialogFlag"
      v-if="actionTypeDialogFlag"
    ></SelectActionTypeList>
    <SelectEquipmentList
      :action="action"
      :fitness-equipment-data.sync="fitnessEquipmentData"
      :equipment-list-dialog-flag.sync="equipmentListDialogFlag"
      v-if="equipmentListDialogFlag"
    ></SelectEquipmentList>

    <!--  保存组件  -->
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
        :index="currentTypeIndex"
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

    <video-player
      :video-url="videoUrl"
      :videoPlayerFlag.sync="videoPlayerFlag"
      style="z-index: 3000"
      v-if="videoPlayerFlag"
    >
    </video-player>

  </div>
</template>

<script>
import SaveFinished from "components/common/SaveFinished";
import SelectActionTypeList from "components/action/SelectActionTypeList";
import SelectEquipmentList from "components/action/SelectEquipmentList";
import {
  apiActionList,
  apiActionDetail,
  apiSaveActionDetail,
  apiUpdateActionDetail,
  apiDeleteActionDetail
} from "src/api/action";
import {apiActionTypeList} from "src/api/actionType";
import {apiUploadImage} from "src/api/upload";
import {apiEquipmentList} from "src/api/equipment";
import AlertMessage from "components/common/AlertMessage";
import DeleteConfirm from "components/common/DeleteConfirm";
import LoadingData from "components/common/LoadingData";
import VideoPlayer from "components/common/VideoPlayer";
export default {
  name: "ActionDetail",
  components: {
    SelectActionTypeList,
    SelectEquipmentList,
    SaveFinished,
    AlertMessage,
    DeleteConfirm,
    LoadingData,
    VideoPlayer
  },
  data() {
    return {
      actionData: [],
      actionTypeData: [],
      currentTypeIndex: -1,
      currentActionIndex: -1,
      fitnessEquipmentData: [],
      activeFlag: false,
      actionTypeDialogFlag: false,
      equipmentListDialogFlag: false,
      action: {
        actionName: "",
        actionType: {},
        containWeight: "0",
        unit: "SET",
        equipments: [],
        actionDescription: "",
        actionExamples: [],
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
      saveDialogHeaderImage: "images/action/save-header.png",
      saveMessage: "",

      alertMessage: "",
      alertMessageFlag: false,

      loadingDataFlag: true,
      searchValue: "",

      videoUrl: '',
      videoPlayerFlag: false
    }
  },
  created() {
    this.loadData()
    this.loadDataCommon()
  },
  methods: {
    initData() {
      this.action = {
        actionName: "",
        actionType: {},
        containWeight: "0",
        unit: "SET",
        equipments: [],
        actionDescription: "",
        actionExamples: [],
      }
      this.currentTypeIndex = -1;
      this.currentActionIndex = -1;
    },
    loadData() {
      apiActionList({searchValue: this.searchValue}).then((res) => {
        console.log(res)
        setTimeout(() => {
          this.loadingDataFlag = false
        }, 400)
        res.data.data.forEach((actionType) => {
          actionType.actionTypeImageUrl = "img:" + actionType.actionTypeImageUrl
        })
        this.actionData = res.data.data
        this.initData()
      })

    },
    loadDataCommon() {
      apiActionTypeList({limit: 100}).then((res) => {
        this.actionTypeData = res.data.data.list
      })
      apiEquipmentList({limit: 100}).then((res) => {
        res.data.data.list.forEach((equipment) => {
          equipment.selected = false
        })
        this.fitnessEquipmentData = res.data.data.list
      })
    },
    doSearch() {
      this.loadData()
    },
    deleteItem() {
      if (!this.action.actionId) {
        this.alertMessage = "请先选择某一个，然后进行删除操作"
        this.alertMessageFlag = true;
        return
      }
      this.deleteMessage = "您确认要删除\"" + this.action.actionName + "\"吗？"
      this.deleteDialogFlag = true;
    },
    confirmDelete(index) {
      setTimeout(() => {
        apiDeleteActionDetail(this.action.actionId).then((res) => {
          this.$refs.deleteDialog.deletingFlag = false
          this.deleteItemSuccessfully = true
          //重新加载数据
          this.loadData()
        }).catch(() => {
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
    toUploadImage() {
      this.$refs.refUploadFile.value = ''
      this.$refs.refUploadFile.click();
    },
    //点击上传图片
    readLocalFile() {
      let file = this.$refs.refUploadFile.files[0]
      let params = new FormData()  // 创建form对象
      params.append('file', file)  // 通过append向form对象添加数据
      params.append('prefix', 'action') // 添加form表单中其他数据
      apiUploadImage(params).then((res) => {
        this.action.actionExamples.push(res.data.data)
      })
    },
    selectAction(typeIndex, actionIndex) {
      this.currentTypeIndex = typeIndex
      this.currentActionIndex = actionIndex
      apiActionDetail(this.actionData[typeIndex].actions[actionIndex].actionId).then((res) => {
        this.action = res.data.data
        console.log(this.action)
        this.action.containWeight += ""
      })
    },
    newAction() {
      this.initData()
    },
    deleteActionExample(index) {
      this.action.actionExamples.splice(index, 1)
    },
    deleteEquipment(index) {
      this.action.equipments.splice(index, 1)
    },
    toChooseActionType() {
      this.actionTypeDialogFlag = true;
    },
    showEquipmentList() {
      this.fitnessEquipmentData.forEach((item) => {
        item.selected = false;
      })
      this.action.equipments.forEach(item => {
        this.fitnessEquipmentData.forEach((equipment) => {
          if (item.equipmentId === equipment.equipmentId) {
            equipment.selected = true
          }
        })
      })
      this.equipmentListDialogFlag = true;
    },
    saveActionDetail() {
      if (this.action.actionName === "") {
        this.alertMessage = "请填写动作名称"
        this.alertMessageFlag = true
        return
      }
      if (!this.action.actionType) {
        this.alertMessage = "请选择动作分类"
        this.alertMessageFlag = true
        return
      }
      this.saveMessage = "\"" + this.action.actionName + "\"这个动作的详细内容"
      this.saveDialogFlag = true
      if (this.action.actionId) {
        //修改
        apiUpdateActionDetail(this.action).then((res) => {
          this.loadData()
          this.saveItemSuccessfully = true
        }).catch(() => {
          this.saveItemFailed = true;
        }).finally(() => {
          this.hideSaveDialog()
        })
      } else {
        //新增
        apiSaveActionDetail(this.action).then((res) => {
          this.loadData()
          this.saveItemSuccessfully = true
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
    },

    //点击按钮出现弹窗播放视频
    playVideo() {
      if (!this.action.actionVideoUrl) {
        this.alertMessage = "暂无视频"
        this.alertMessageFlag = true
        return
      }
      this.videoPlayerFlag = true;
      this.videoUrl = this.action.actionVideoUrl;
    }
  }
}
</script>

<style lang="scss">
@import "./q-expansion.scss";
@import "./my-animate.scss";

#action-detail-content {
  height: 100%;
  width: 100%;

  .action-detail-body {
    width: 100%;
    height: 100%;
    position: relative;
    display: flex;

    .new-action-button {
      position: absolute;
      bottom: 0;
      left: 0;
      width: 32%;
      height: 4rem;
      background: -webkit-gradient(linear, 100% 10%, 100% 100%, color-stop(0, rgba(255, 255, 255, 0)), color-stop(0.28, #f0f6e0), color-stop(0.65, #cafad6), color-stop(1, #aaf3ad));

      img {
        position: absolute;
        left: .5rem;
        top: 10%;
        width: auto;
        height: 80%;
      }

      .new-button {
        position: absolute;
        left: 34%;
        width: 50%;
        top: 17%;
        border-radius: .5rem;
        font-size: 1.1rem;
        text-align: center;
        line-height: 3rem;
        color: #28a547;
      }
    }

    .action-list {
      width: 34%;
      height: 100%;
      position: relative;

      .action-name {
        width: 100%;
        height: 4rem;
        text-align: center;
        font-size: 1rem;
        line-height: 4rem;
      }

      .top-left-search {
        position: absolute;
        top: .5rem;
        left: 3%;
        width: 94%;
        height: 2rem;

        input {
          width: 100%;
          height: 100%;
          font-size: .9rem;
          padding-right: 2.3rem;
          border-radius: 1rem;
          background-color: rgba(0, 0, 0, 0.08);
          color: #999999;
          padding-left: 12%;
          border: 1px solid #ffffff;
        }

        .search {
          position: absolute;
          right: .1rem;
          top: 2px;
          width: 2rem;
          height: 2rem;
          display: flex;
          justify-content: center;
          align-items: center;

          img {
            width: 60%;
            height: 60%;
          }
        }
      }

      .action-list-scroll {
        position: absolute;
        top: 2.5rem;
        left: 0;
        height: calc(100% - 2.5rem);
        width: 100%;
        overflow-y: scroll;
        padding-bottom: 4rem;

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

    .list-border {
      width: .3rem;
      height: 100%;
      position: relative;
      display: flex;
      flex-direction: column;

      .border-header {
        height: 2rem;
        width: 100%;
      }

      .border-body {
        flex: 1;
        background: linear-gradient(to bottom, #3ec6ac, rgba(0, 0, 0, 0) 90%);
      }

      .list-flower {
        position: absolute;
        bottom: .5rem;
        left: -1.8rem;
        width: 3rem;
        height: 6rem;

        img {
          width: 100%;
          height: 100%;
        }
      }

      .list-flower2 {
        position: absolute;
        top: 37%;
        left: -.9rem;
        width: 2rem;
        height: 2rem;

        img {
          width: 100%;
          height: 100%;
        }
      }
    }

    .action-detail {
      width: 66%;
      height: 100%;
      overflow-y: scroll;
      padding: .5rem .5rem .5rem .2rem;
      position: relative;

      .title {
        height: 2rem;
        line-height: 2rem;
        font-size: 1.2rem;
        padding-left: .6rem;
      }

      .action-images {
        height: 13rem;
        width: 100%;
        padding: .5rem;
        overflow-x: scroll;
        overflow-y: hidden;
        display: flex;
        justify-content: flex-start;
        margin-bottom: .5rem;

        .action-image, .action-image-add, .guide {
          width: 9rem;
          height: 100%;
          flex-shrink: 0;
          margin-right: .8rem;
          box-shadow: .15rem .15rem .3rem #a7a7a7;
          border: 1px solid #d9d9d9;
          border-radius: .4rem;
        }

        .action-image {
          position: relative;

          > img {
            width: 100%;
            height: 100%;
            border-radius: .4rem;
          }

          .delete {
            width: 1.2rem;
            height: 1.2rem;
            position: absolute;
            background-color: #FFF;
            border-radius: 50%;
            right: -.4rem;
            top: -.4rem;
            display: flex;
            justify-content: center;
            align-items: center;

            img {
              width: 100%;
              height: 100%;
            }
          }
        }

        .guide {
          display: flex;
          flex-direction: column;
          justify-content: space-around;
          align-items: center;

          img {
            width: 90%;
          }

          p {
            font-size: .7rem;
            color: #888;
            margin: 0;
            line-height: 1rem;
          }
        }

        .action-image-add {
          background-color: rgba(238, 238, 238, 0.3);
          font-size: 2rem;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #999;
        }

        .empty {
          width: .1rem;
          height: 100%;
          flex-shrink: 0;
        }
      }

      .action-form-item {
        width: 100%;
        height: auto;
        display: flex;
        margin-bottom: .5rem;

        .label {
          width: 34%;
          font-size: 1.2rem;
          padding-left: .4rem;
          padding-top: .3rem;
        }

        p {
          font-size: .8rem;
        }
      }

      .action-name {
        .label {
          line-height: 2.4rem;
        }

        .name {
          height: 4rem;
          width: 66%;
          padding-right: 20%;

          label {
            font-size: .9rem;
          }
        }
      }

      .action-equipment {
        width: 68%;
        height: 9rem;
        display: flex;
        justify-content: flex-start;
        padding-top: .3rem;
        overflow-x: scroll;
        overflow-y: hidden;

        .one-equipment, .equipment-add, .guide {
          width: 6rem;
          height: 7rem;
          border: 1px solid #e0e0e0;
          box-shadow: .1rem .1rem .2rem #929191;
          border-radius: .2rem;
          flex-shrink: 0;
          margin-right: .7rem;
          position: relative;

          .image {
            height: 5.5rem;
            display: flex;
            justify-content: center;
            align-items: center;
            border-radius: .2rem;
            overflow: hidden;

            img {
              width: 100%;
              max-height: 100%;
            }
          }

          .name {
            font-size: .6rem;
            height: 1.5rem;
            text-align: center;
            line-height: 1.5rem;
            font-weight: normal;
          }

          .delete {
            width: 1rem;
            height: 1rem;
            position: absolute;
            background-color: #FFF;
            border-radius: 50%;
            right: -.3rem;
            top: -.3rem;
            display: flex;
            justify-content: center;
            align-items: center;

            img {
              width: 100%;
              height: 100%;

            }
          }
        }

        .guide {
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;

          img {
            width: 90%;
          }

          p {
            font-size: .6rem;
            color: #888;
            margin: 0;
            line-height: 1rem;
          }
        }

        .equipment-add {
          background-color: rgba(238, 238, 238, 0.3);
          font-size: 1.6rem;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #999;
        }

        .empty {
          width: .5rem;
          flex-shrink: 0;
        }
      }

      .action-type {
        display: flex;
        align-items: center;
        height: 3rem;
        margin-bottom: 1.5rem;
        position: relative;
        width: 66%;

        img {
          height: 3rem;
          width: 3rem;
          border-radius: 50%;
          margin-right: 1.2rem;
        }

        h5 {
          font-size: 1.3rem;
        }

        p {
          color: #999;
          margin-bottom: 0;
        }

        .choose {
          width: 2rem;
          height: 2rem;
          display: flex;
          justify-content: center;
          align-items: center;
          border-radius: 50%;
          margin-left: 14%;
          border: .1rem solid #bfbfbf;

          img {
            width: 60%;
            height: 60%;
            margin: 0;
          }
        }
      }

      .action-weight {
        display: flex;
        align-items: center;
        height: 3rem;
        margin-bottom: 1.5rem;
        position: relative;
        width: 66%;
        padding-left: 1.8rem;
      }

      .action-description {
        width: 68%;
        height: 12rem;
        padding-top: .4rem;

        textarea {
          width: 94%;
          height: 90%;
          font-size: 1rem;
          resize: none;
          border: 1px solid #bfbfbf;
          padding: .5rem;
          border-radius: .6rem;
        }
      }

      .action-video {
        height: 10rem;
        padding: .5rem;

        img {
          width: 10rem;
          margin-bottom: .2rem;
        }

        p {
          color: #999;
          text-align: center;
          margin-left: -16%;
        }
      }

      .finish {
        height: 2.5rem;
        width: 56%;
        margin: 1rem auto;
        background: linear-gradient(to right, #129b84, #63ddc4);
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
          box-shadow: -.1rem -.1rem .3rem #239680 inset;
        }
      }

      .delete-action {
        position: absolute;
        right: .3rem;
        top: .3rem;
        width: 3.4rem;
        height: 1.6rem;
        border-radius: .3rem;
        border: 1px solid #efbaba;
        text-align: center;
        color: #ec8e8e;
        font-size: .7rem;
        display: flex;
        justify-content: center;
        align-items: center;
      }
    }
  }

}

</style>
