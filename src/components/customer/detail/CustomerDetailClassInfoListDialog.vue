<template>
  <div id="class-info-list-dialog-content">
    <BackgroundBlack @click.native="hiddenDialog"></BackgroundBlack>
    <div class="list-content">
      <div class="class-info-item"
           v-for="(classInfo,index) in classInfoList"
           :class="index===currentIndex?'class-info-item-selected':''"
           @click="selectItem(index)"
           :key="index">
        {{ classInfo.className }}
      </div>
    </div>
  </div>
</template>
<script>
import BackgroundBlack from "components/common/BackgroundBlack";
export default {
  name: "CustomerDetailClassInfoListDialog",
  components: {BackgroundBlack},
  data() {
    return {
      currentIndex: -1,
    }
  },
  created() {

  },
  props: {
    classInfoList:Array,
    classInfoDialogFlag:Boolean,
  },
  mounted() {
    this.currentIndex=-1
  },
  methods: {
    selectItem(index) {
      this.currentIndex = index;
      this.$emit("selectOneClassInfo",index)
      setTimeout(() => {
        this.currentIndex = -1;
        this.$emit("update:classInfoDialogFlag", false)
      }, 300)
    },
    hiddenDialog() {
      this.$emit("update:classInfoDialogFlag", false)
    },
  }
}
</script>

<style scoped lang="scss">
#class-info-list-dialog-content {
  .list-content {
    width: 60%;
    height: 56%;
    overflow-y: scroll;
    position: fixed;
    top: 22%;
    left: 20%;
    background-color: #fff;
    z-index: 2010;
    border-radius: 1rem;
    padding: 2rem;
    border: none;
    .class-info-item {
      width: 100%;
      height: 3.5rem;
      margin-bottom: .5rem;
      background-color: rgba(255, 255, 255, 0.78);
      line-height: 3.5rem;
      text-align: center;
      font-size: 1.1rem;
      box-shadow: 0 0 .3rem #b3b3b3;
      position: relative;
      border-radius: .4rem;
    }
    .class-info-not {
      background-color: #efefef;
      border: 1px solid #c3c2c2;
    }
    .class-info-item:last-child {
      margin-bottom: 0;
    }
    .class-info-not-selected {
      background-color: #d6d5d5;
      border:1px solid #9f9f9f;
      box-shadow: 0 0 .3rem #949494;
    }
    .class-info-item-selected {
      background-color: #c9e0f6;
      color: #2e72ae;
      border:1px solid #5895cb;
      box-shadow: 0 0 .3rem #79bcf8;
    }
  }
}
</style>
