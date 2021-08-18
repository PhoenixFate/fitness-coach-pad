<template>
  <div id="action-list-dialog-content">
    <BackgroundBlack @click.native="hiddenDialog"></BackgroundBlack>
    <div class="action-list">
      <div class="top-left-search">
        <input type="text" placeholder="筛选动作..." @input="searchAction" :value="actionSearchValue">
        <div class="search" @click="doSearch">
          <img src="images/common/search-dark-gray.png" alt="">
        </div>
      </div>
      <div class="action-list-content">
        <q-expansion-item
          expand-separator
          v-for="(actionType,typeIndex) in actionData" :key="typeIndex"
          :icon="actionType.actionTypeImageUrl"
          :label="actionType.actionTypeName"
          :defaultOpened="isOpen"
        >
          <q-item
            v-for="(action,actionIndex) in actionType.actions"
            :key="action.actionIndex"
            clickable
            :header-inset-level="1"
            :inset-level="0.3"
            @click="selectAction(typeIndex,actionIndex)"
          >
            <q-item-section class="my-section"
                            :class="action.selected?'my-section-selected':''">
              <q-item-label>{{ action.actionName }}</q-item-label>
            </q-item-section>
            <div class="item-selected-number"
                 v-if="action.selected">
              {{action.index}}
            </div>
          </q-item>
        </q-expansion-item>
        <div class="item-empty" v-if="actionData.length===0">
          <img src="images/common/no-result.png" alt="">
          <p>暂无搜索结果</p>
        </div>
      </div>
      <div class="bottom-buttons">
        <div class="bottom-button common-button" @click="makeSet('COMMON_SET')">普通组</div>
        <div class="bottom-button super-button" @click="makeSet('SUPER_SET')">超级组</div>
        <div class="bottom-button reduce-button" @click="makeSet('REDUCE_SET')">递减组</div>
      </div>

      <AlertMessage
        :message="alertMessage"
        :alert-message-flag.sync="alertMessageFlag"
        style="z-index: 4000"
      >
      </AlertMessage>
    </div>
  </div>
</template>

<script>
import BackgroundBlack from "components/common/BackgroundBlack";
import "./q-expansion.scss"
import AlertMessage from "components/common/AlertMessage";

export default {
  name: "ActionListDialog",
  components: {AlertMessage, BackgroundBlack},
  data() {
    return {
      selectIndex: [],
      alertMessageFlag: false,
      alertMessage: "",
      isOpen:false
    }
  },
  mounted() {
    this.initData()
  },
  props: {
    addActionFlag: Boolean,
    actionData:Array,
    actionSearchValue:String
  },
  methods: {
    initData(){
      this.actionData.forEach((actions)=>{
        actions.actions.forEach((action)=>{
          action.selected=false
        })
      })
      this.selectIndex=[]
      this.$forceUpdate()
    },
    searchAction(e){
      console.log(e)
      this.$emit("update:actionSearchValue", e.target.value);
    },
    doSearch(){
      if(this.actionSearchValue){
        this.isOpen=true
      }else {
        this.isOpen=false
      }
      this.$emit("loadActionData")
    },
    hiddenDialog() {
      this.$emit("update:addActionFlag", false)
      this.initData()
    },
    selectAction(typeIndex, actionIndex) {
      if(this.actionData[typeIndex].actions[actionIndex].selected){
        this.selectIndex.splice(this.actionData[typeIndex].actions[actionIndex].index-1,1)
        this.actionData[typeIndex].actions[actionIndex].index=-1;
        this.actionData[typeIndex].actions[actionIndex].selected=false;
        this.actionData.forEach((actions,tempTypeIndex)=>{
          actions.actions.forEach((action,tempActionIndex)=>{
            if(action.selected){
              this.selectIndex.forEach((temp,index)=>{
                if(tempTypeIndex===temp.typeIndex&&tempActionIndex===temp.actionIndex){
                  action.index=index+1
                }
              })
            }
          })
        })
      }else {
        this.selectIndex.push({
          typeIndex: typeIndex,
          actionIndex: actionIndex,
        })
        this.actionData[typeIndex].actions[actionIndex].selected=true;
        this.actionData[typeIndex].actions[actionIndex].index=this.selectIndex.length;
      }
      this.$forceUpdate()
    },
    makeSet(type) {
      if(this.selectIndex.length===0){
        this.alertMessageFlag = true;
        this.alertMessage = "普通组和递减组请选择某个动作，超级组请选择多组动作"
        return;
      }
      if(type==='COMMON_SET' || type==='REDUCE_SET'){
        if(this.selectIndex.length>1){
          this.alertMessageFlag = true;
          this.alertMessage = "普通组和递减组请选择单个动作"
          return;
        }
      }
      if(type==='SUPER_SET'){
        if(this.selectIndex.length===1){
          this.alertMessageFlag = true;
          this.alertMessage = "超级组请选择多组动作"
          return;
        }
      }
      this.$emit("addActionSet",type)
    }
  },

}
</script>

<style scoped lang="scss">
#action-list-dialog-content {
  height: 100%;
  width: 100%;
  position: fixed;
  top:0;
  left:0;
  z-index: 1;
  .action-list {
    width: 60%;
    height: 80vw;
    position: fixed;
    top: 50%;
    margin-top: -40vw;
    left: 20%;
    background-color: #fff;
    z-index: 2010;
    border-radius: 1.5rem;
    padding: 3rem 0 3rem 0;
    overflow: hidden;
    border: none;
    .top-left-search {
      position: absolute;
      top:.7rem;
      left:10%;
      width: 80%;
      height: 2rem;
      input {
        width: 100%;
        height: 100%;
        font-size: .9rem;
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
        right:.5rem;
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
    .action-list-content {
      height: 100%;
      width: 100%;
      overflow-y: scroll;
      border-radius: 1.3rem;
      padding: .5rem 10% .5rem 16%;
      .item-empty {
        width: 100%;
        height: 100%;
        display: flex;
        justify-content: center;
        align-items: center;
        flex-direction: column;
        >img {
          width: 54%;
          height: 30%;
        }
        >p{
          color:#999;
          margin-top: .7rem;
        }
      }
    }

    .bottom-buttons {
      height: 3rem;
      width: 100%;
      position: relative;
      bottom: 0;
      left: 0;
      display: flex;
      justify-content: center;

      .bottom-button {
        width: 33%;
        display: flex;
        justify-content: center;
        align-items: center;
        font-size: 1.1rem;
        color: #fff;
        font-weight: 500;
      }
      .common-button {
        background-color: #eca656;
      }
      .super-button {
        background-color: #f33a3a;
      }
      .reduce-button {
        background-color: #2dab5b;
        flex: 1;
      }
    }
  }
}
</style>
