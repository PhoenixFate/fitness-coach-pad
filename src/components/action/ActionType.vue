<template>
  <!--  <transition enter-active-class="animate__slideInLeft"-->
  <!--              leave-active-class="animate__slideOutLeft animate__faster">-->
  <div id="action-type-content" class="animate__animated">
    <div class="action-type-body">
      <div class="action-list">
        <div class="top-left-search">
          <input type="text" placeholder="筛选动作类型..." v-model="searchValue" />
          <div class="search" @click="doSearch">
            <img src="images/common/search.png" alt="" />
          </div>
        </div>
        <div class="list-content">
          <div class="type-item" v-for="(type, index) in actionTypeData" :key="index" @click="selectType(index)">
            <img :src="type.actionTypeImageUrl" alt="" />
            <div :class="index === currentTypeIndex ? 'type-selected' : ''">
              <span>{{ type.actionTypeName }}</span>
              <div>
                <img src="images/action/typeDetail/type-selected.png" alt="" v-if="index === currentTypeIndex" />
              </div>
            </div>
          </div>
          <div class="item-empty" v-if="actionTypeData.length === 0">
            <img src="images/common/no-result.png" alt="" />
            <p>暂无搜索结果</p>
          </div>
        </div>
      </div>
      <div class="new-action-button">
        <img src="images/action/typeDetail/new-type.png" alt="" />
        <div class="new-button" @click="newActionType">新增分类</div>
      </div>
      <div class="list-border">
        <div class="border-header"></div>
        <div class="border-body"></div>
        <div class="list-flower">
          <img src="images/action/flower-02.png" alt="" />
        </div>
        <div class="list-flower2">
          <img src="images/action/flower-03.png" alt="" />
        </div>
      </div>
      <div class="type-detail">
        <div class="type-form-item">
          <div class="label">分类图标</div>
          <div class="type-image">
            <img
              src="images/action/typeDetail/upload.png"
              alt=""
              v-if="!actionType.actionTypeImageUrl"
              @click="toUploadImage"
            />
            <p v-if="!actionType.actionTypeImageUrl">请选择上传分类图标</p>
            <img :src="actionType.actionTypeImageUrl" alt="" v-if="actionType.actionTypeImageUrl" />
            <div class="delete" v-if="actionType.actionTypeImageUrl" @click="deleteImage">
              <img src="images/common/delete-gray.png" alt="" />
            </div>
          </div>
        </div>
        <div class="type-form-item type-name">
          <div class="label">分类名称</div>
          <div class="name">
            <q-input placeholder="请输入分类名称" v-model="actionType.actionTypeName" />
          </div>
        </div>
        <div class="finish" @click="saveActionType">
          <div>保存</div>
        </div>
        <div class="delete-action-type" @click="deleteItem">删除</div>
      </div>
    </div>

    <!--  保存组件  -->
    <transition
      enter-active-class="animate__fadeIn animate__faster"
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

    <transition
      enter-active-class="animate__slideInDown animate__faster"
      leave-active-class="animate__zoomOut animate__fast"
    >
      <AlertMessage
        :alert-message-flag.sync="alertMessageFlag"
        :message="alertMessage"
        class="animate__animated"
        style="z-index: 3000"
        v-show="alertMessageFlag"
      >
      </AlertMessage>
    </transition>

    <input style="display: none" type="file" ref="refUploadFile" accept="image/*" @change="readLocalFile" />

    <transition
      enter-active-class="animate__fadeIn animate__faster"
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
  </div>
  <!--  </transition>-->
</template>

<script>
import SaveFinished from 'components/common/SaveFinished';
import AlertMessage from 'components/common/AlertMessage';
import DeleteConfirm from 'components/common/DeleteConfirm';
import { apiActionTypeList, apiSaveActionType, apiUpdateActionType, apiDeleteActionType } from 'src/api/actionType';
import { apiUploadImage } from 'src/api/upload';

export default {
  name: 'ActionType',
  components: { SaveFinished, AlertMessage, DeleteConfirm },
  data() {
    return {
      actionTypeData: [],
      currentTypeIndex: -1,
      actionType: {
        actionTypeImageUrl: '',
        actionTypeName: ''
      },

      //删除的相关属性
      deleteDialogFlag: false,
      deleteItemSuccessfully: false,
      deleteItemFailed: false,
      deleteMessage: '',

      //点击保存之后的相关属性
      saveDialogFlag: false,
      saveItemSuccessfully: false,
      saveItemFailed: false,
      saveDialogHeaderImage: 'images/action/save-header.png',
      saveMessage: '',

      alertMessage: '',
      alertMessageFlag: false,
      searchValue: ''
    };
  },
  created() {
    this.loadData();
  },
  methods: {
    loadData() {
      apiActionTypeList({ limit: 100, searchValue: this.searchValue }).then(res => {
        this.actionTypeData = res.data.data.list;
        this.actionType = {
          actionTypeImageUrl: '',
          actionTypeName: ''
        };
        this.currentTypeIndex = -1;
      });
    },
    doSearch() {
      this.loadData();
    },
    deleteItem() {
      if (!this.actionType.actionTypeId) {
        this.alertMessage = '请先选择某一个，然后进行删除操作';
        this.alertMessageFlag = true;
        return;
      }
      this.deleteMessage = '您确认要删除"' + this.actionType.actionTypeName + '"吗？';
      this.deleteDialogFlag = true;
    },
    confirmDelete() {
      let ids = [];
      ids.push(this.actionType.actionTypeId);
      setTimeout(() => {
        apiDeleteActionType(ids).then(res => {
          console.log(res);
          this.$refs.deleteDialog.deletingFlag = false;
          if (res.status === 204) {
            this.deleteItemSuccessfully = true;
            //重新加载数据
            this.loadData();
          } else {
            this.deleteItemFailed = true;
          }
          setTimeout(() => {
            this.deleteDialogFlag = false;
            setTimeout(() => {
              this.deleteItemSuccessfully = false;
              this.deleteItemFailed = false;
            }, 1000);
          }, 800);
        });
      }, 1000);
    },
    deleteImage() {
      this.actionType.actionTypeImageUrl = '';
    },
    selectType(index) {
      this.currentTypeIndex = index;
      this.actionType = this.actionTypeData[index];
    },
    newActionType() {
      this.actionType = {
        actionTypeImageUrl: '',
        actionTypeName: ''
      };
      this.currentTypeIndex = -1;
    },
    toUploadImage() {
      this.$refs.refUploadFile.value = '';
      this.$refs.refUploadFile.click();
    },
    //点击上传图片
    readLocalFile() {
      let file = this.$refs.refUploadFile.files[0];
      let params = new FormData(); // 创建form对象
      params.append('file', file); // 通过append向form对象添加数据
      params.append('prefix', 'actionType'); // 添加form表单中其他数据
      apiUploadImage(params).then(res => {
        console.log(res);
        this.action.actionExamples.push(res.data.data);
      });
    },
    saveActionType() {
      if (!this.actionType.actionTypeImageUrl) {
        this.alertMessage = '分类图标不能为空';
        this.alertMessageFlag = true;
        return;
      }
      if (!this.actionType.actionTypeName) {
        this.alertMessage = '分类名称不能为空';
        this.alertMessageFlag = true;
        return;
      }
      this.saveMessage = '"' + this.actionType.actionTypeName + '"这个动作类别';
      this.saveDialogFlag = true;
      setTimeout(() => {
        //修改
        if (this.actionType.actionTypeId) {
          apiUpdateActionType(this.actionType).then(res => {
            if (res.status === 204) {
              this.saveItemSuccessfully = true;
              //重新刷新数据
              this.loadData();
            } else {
              this.saveItemFailed = true;
            }
            setTimeout(() => {
              this.saveDialogFlag = false;
              setTimeout(() => {
                this.saveItemSuccessfully = false;
                this.saveItemFailed = false;
              }, 1000);
            }, 800);
          });
        }
        //保存
        else {
          apiSaveActionType(this.actionType).then(res => {
            if (res.status === 201) {
              this.saveItemSuccessfully = true;
              //重新刷新数据
              this.loadData();
            } else {
              this.saveItemFailed = true;
            }
            setTimeout(() => {
              this.saveDialogFlag = false;
              setTimeout(() => {
                this.saveItemSuccessfully = false;
                this.saveItemFailed = false;
              }, 1000);
            }, 800);
          });
        }
      }, 1000);
    }
  }
};
</script>

<style scoped lang="scss">
@import './my-animate.scss';
#action-type-content {
  width: 100%;
  height: 100%;

  .action-type-body {
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
      background: -webkit-gradient(
        linear,
        100% 10%,
        100% 100%,
        color-stop(0, rgba(255, 255, 255, 0)),
        color-stop(0.28, #f0f6e0),
        color-stop(0.65, #cafad6),
        color-stop(1, #aaf3ad)
      );

      img {
        position: absolute;
        left: 0.9rem;
        top: 14%;
        width: auto;
        height: 80%;
      }

      .new-button {
        position: absolute;
        left: 34%;
        width: 50%;
        top: 17%;
        border-radius: 0.5rem;
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
      .top-left-search {
        position: absolute;
        top: 0.5rem;
        left: 3%;
        width: 94%;
        height: 2rem;
        input {
          width: 100%;
          height: 100%;
          font-size: 0.9rem;
          padding-right: 2.3rem;
          border-radius: 1rem;
          background-color: rgba(0, 0, 0, 0.08);
          color: #999999;
          padding-left: 12%;
          border: 1px solid #ffffff;
        }
        .search {
          position: absolute;
          right: 0.1rem;
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
      .list-content {
        position: absolute;
        left: 0;
        top: 2.5rem;
        width: 100%;
        height: calc(100% - 2.5rem);
        padding-bottom: 4rem;
        overflow-y: scroll;

        .type-item {
          width: 100%;
          height: 4.3rem;
          margin-bottom: 0.5rem;
          padding: 0.5rem 4% 0.5rem 6%;
          display: flex;
          justify-content: space-between;
          align-items: center;

          img {
            width: 2.5rem;
            height: 2.5rem;
            margin-right: 0.5rem;
          }

          > div {
            flex: 1;
            height: 2.5rem;
            display: flex;
            align-items: center;
            justify-content: flex-start;
            border-bottom: 1px dashed #58d9d5;
            padding-left: 8%;

            span {
              font-size: 1.1rem;
            }

            > div {
              flex: 1;
              display: flex;
              justify-content: flex-end;
              align-items: center;

              img {
                width: 1.5rem;
                height: 1.5rem;
              }
            }
          }

          .type-selected {
            border-bottom: 0.1rem solid #58ea5a;
            position: relative;
            span {
              color: #328f47;
            }
            div {
              position: relative;
              top: 0;
              left: 0;
            }
          }
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
            margin-top: 0.8rem;
            font-size: 0.8rem;
          }
        }
      }
    }

    .list-border {
      width: 0.3rem;
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
        bottom: 0.5rem;
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
        left: -0.9rem;
        width: 2rem;
        height: 2rem;

        img {
          width: 100%;
          height: 100%;
        }
      }
    }

    .type-detail {
      width: 66%;
      height: 100%;
      overflow-y: scroll;
      padding: 3.5rem 0.5rem 0.5rem 0.7rem;
      position: relative;

      .type-form-item {
        width: 100%;
        height: auto;
        display: flex;
        margin-bottom: 0.5rem;

        .label {
          width: 34%;
          font-size: 1.2rem;
          padding-left: 0.6rem;
        }
      }

      .type-name {
        .label {
          line-height: 2.6rem;
        }

        .name {
          height: 8rem;
          width: 66%;
          padding-right: 26%;

          label {
            font-size: 0.9rem;
          }
        }
      }

      .type-image {
        height: 13rem;
        position: relative;

        img {
          width: 10rem;
        }

        p {
          color: #999;
          font-size: 0.9rem;
          margin-top: 0.7rem;
          text-align: center;
        }

        .delete {
          height: 2rem;
          width: 2rem;
          position: absolute;
          top: -1.1rem;
          right: -1.4rem;
          display: flex;
          justify-content: center;
          align-items: center;

          img {
            width: 1.5rem;
            height: 1.5rem;
          }
        }
      }

      .finish {
        height: 2.5rem;
        width: 56%;
        margin: 0.5rem auto;
        background: linear-gradient(to right, #129b84, #63ddc4);
        border-radius: 0.6rem;
        text-align: center;
        line-height: 2.5rem;
        font-size: 1.1rem;
        color: #fff;
        font-weight: bold;
        box-shadow: 0.1rem 0.1rem 0.2rem #b9baba;
        overflow: hidden;

        div {
          width: 100%;
          height: 100%;
          border-radius: 0.6rem;
          box-shadow: -0.1rem -0.1rem 0.3rem #239680 inset;
        }
      }

      .delete-action-type {
        position: absolute;
        right: 0.3rem;
        top: 0.3rem;
        width: 3.4rem;
        height: 1.6rem;
        border-radius: 0.3rem;
        border: 1px solid #efbaba;
        text-align: center;
        color: #ec8e8e;
        font-size: 0.7rem;
        display: flex;
        justify-content: center;
        align-items: center;
      }
    }
  }
}
</style>
