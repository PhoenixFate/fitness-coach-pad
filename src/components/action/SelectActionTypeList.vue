<template>
  <div>
    <BackgroundBlack @click.native="hiddenDialog"></BackgroundBlack>
    <transition enter-active-class="animate__zoomIn animate__faster"
                leave-active-class="animate__zoomOut">
      <div class="action-type-list animate__animated">
        <div class="action-type-big-item"
             v-for="(actionType,index) in actionTypeData"
             :key="actionType.actionTypeName"
             @click="selectActionType(index)"
        >
          <div class="action-type-item animate__animated animate__flipInY" v-show="!(activeFlag && actionType.actionTypeId===action.actionType.actionTypeId)"
               :class="actionType.actionTypeId===action.actionType.actionTypeId?'action-type-item-selected':''">
            <img :src="actionType.actionTypeImageUrl" alt="">
            <p>{{ actionType.actionTypeName }}</p>
          </div>
          <div class="action-type-final animate__animated animate__flipInY" v-show="activeFlag && actionType.actionTypeId===action.actionType.actionTypeId">
            <img src="images/action/detail/type-select.png" alt="">
          </div>
        </div>
      </div>
    </transition>
  </div>
</template>

<script>
import BackgroundBlack from "components/common/BackgroundBlack";
export default {
  name: "SelectActionTypeList",
  components:{BackgroundBlack},
  data(){
    return {
      activeFlag: false,
    }
  },
  props:{
    actionTypeData:Array,
    actionType:Number,
    action:Object,
    actionTypeDialogFlag:Boolean
  },
  methods:{
    selectActionType(index) {
      if (this.activeFlag === true) {
        return;
      }
      this.action.actionType=this.actionTypeData[index]
      this.activeFlag = true;
      setTimeout(() => {
        this.$emit("update:actionTypeDialogFlag",false)
        this.activeFlag = false;
      }, 800)
    },
    hiddenDialog(){
      this.$emit("update:actionTypeDialogFlag",false)
    }
  }
}
</script>

<style scoped lang="scss">
.action-type-list {
  width: 60%;
  height: 23.6rem;
  overflow-y: scroll;
  position: fixed;
  top: 50%;
  margin-top: -11.8rem;
  left: 20%;
  background-color: #fff;
  z-index: 2010;
  border-radius: 1rem;
  padding: 3%;

  .action-type-big-item {
    width: 30%;
    height: 6.4rem;
    float: left;
    margin-right: 5%;
    margin-bottom: 5%;
    border-radius: 1rem;
  }

  .action-type-item {
    width: 100%;
    height: 100%;
    box-shadow: .1rem .1rem .5rem #d0d0d0;
    border-radius: .6rem;
    display: flex;
    flex-direction: column;
    justify-content:center;
    align-items: center;

    img {
      width: 60%;
      margin-top: .3rem;
    }

    p {
      text-align: center;
      margin: 0.5rem 0 0 0;
      font-size: .7rem;
    }
  }

  .action-type-final {
    width: 100%;
    height: 100%;
    background-color: #6dea7c;
    border-radius: 1rem;
    display: flex;
    justify-content: center;
    align-items: center;

    img {
      width: 50%;
      height: 50%;
    }
  }

  .action-type-item-selected {
    box-shadow:0 0 .4rem #5be26c;
  }

  .action-type-big-item:nth-child(3n) {
    margin-right: 0;
  }
}

</style>
