<template>
  <div id="class-management-content">
    <div class="background-header"></div>
    <div class="background-body"></div>
    <div class="class-tabs">
      <div class="tab-content">
        <div class="content">
          <div @click="changeTab(0)" >
            <span :class="currentTabIndex===0?'tab-select':''">训练项
              <div class="color" :class="currentTabIndex===0?'color-selected':''"></div>
            </span>
          </div>
          <div @click="changeTab(1)">
            <span :class="currentTabIndex===1?'tab-select':''">课程信息
              <div class="color" :class="currentTabIndex===1?'color-selected':''"></div>
            </span>
          </div>
        </div>
      </div>
    </div>
    <div class="class-body">
      <div class="body-content">
        <keep-alive include="ExerciseItem,ClassInfo">
          <ExerciseItem v-if="currentTabIndex===0"></ExerciseItem>
          <ClassInfo v-if="currentTabIndex===1"></ClassInfo>
        </keep-alive>
      </div>
    </div>

  </div>
</template>

<script>
import ClassInfo from "components/class/ClassInfo";
import ExerciseItem from "components/class/ExerciseItem";
export default {
  name: "Index",
  components:{ExerciseItem,ClassInfo},
  data(){
    return {
      currentTabIndex:0,
    }
  },
  methods:{
    changeTab(index){
      this.currentTabIndex=index;
    }
  }

}
</script>

<style scoped lang="scss">
#class-management-content {
  height: 100%;
  width: 100%;
  position: relative;
  .background-header {
    height: 28%;
    width: 100%;
    background-image: url("../../../../assets/images/classManagement/class-management-background-02.png");
    background-size: 100% 100%;
  }
  .background-body {
    height: calc( 72% + 1px);
    width: 100%;
    margin-top: -1px;
    background:-webkit-gradient(linear ,100% 10%,100% 100%,color-stop(0,#ec7775),color-stop(0.45,#fcab9b),color-stop(1, #ec7775));
  }
  .class-tabs {
    position: absolute;
    width: 96%;
    height: 18%;
    top:3.4%;
    left:2%;
    background: linear-gradient(to bottom,rgba(#f5ede6,0.62) 0%,rgba(#efcfa2,0.92) 100%);
    box-shadow: .15rem .15rem .3rem #c14140;
    border-top-left-radius: 2rem;
    border-top-right-radius: 2rem;
    overflow: hidden;
    .tab-content {
      width: 100%;
      height: 100%;
      box-shadow: -.2rem -.3rem .5rem #e9a857 inset;
      display: flex;
      justify-content: center;
      align-items: center;
      .content {
        width: 80%;
        height: 60%;
        display: flex;
        justify-content: center;
        align-items: center;
        div {
          width: 50%;
          height: 60%;
          font-size: 1.6rem;
          text-shadow: .15rem .1rem .1rem #c1c1c1;
          color:#555;
          font-weight: bold;
          display: flex;
          justify-content: center;
          align-items: center;
          span {
            display: block;
            height: 100%;
            line-height: 2.4;
            .color{
              width: 100%;
              height: .2rem;
            }
            .color-selected{
              background:-webkit-gradient(linear ,100% 10%,100% 100%,color-stop(0, #f6cdc9),color-stop(0.68,#ea7574),color-stop(1, #81324d));
            }
          }
          .tab-select {
            color:#81324d;
            text-shadow: .15rem .1rem .1rem #efa0a0;
          }
        }
        > div:nth-child(1){
          border-right: 1px solid #eb7775;
        }
      }
    }
  }
  .class-body {
    position: absolute;
    width: 96%;
    left: 2%;
    top:22.8%;
    height: 75.6%;
    border-radius: .8rem;
    box-shadow: .15rem .15rem .3rem #c14140;
    overflow: hidden;
    background:-webkit-gradient(linear ,100% 10%,100% 100%,color-stop(0, rgba(#f8e3e2,.8)),color-stop(0.45,#fff0eb),color-stop(1, #eedbc2));
    .body-content {
      width: 100%;
      height: 100%;
      box-shadow: -.15rem -.25rem .5rem #e9a857 inset;
    }
  }
}
</style>
