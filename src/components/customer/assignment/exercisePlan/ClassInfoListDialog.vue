<template>
  <div id="class-info-list-dialog-content">
    <BackgroundBlack @click.native="hiddenDialog"></BackgroundBlack>
    <div class="list-content">
      <div class="class-info-item class-info-not"
           :class="currentIndex===-2?'class-info-not-selected':''"
           @click="clearClassInfo">
        暂不选择课程
      </div>
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
  name: "ClassInfoListDialog",
  components: {BackgroundBlack},
  data() {
    return {
      currentIndex: -1,
    }
  },
  created() {

  },
  props: {
    classInfoList: Array,
    classInfoDialogFlag: Boolean,
    currentClassInfo: Object,
    dayItem: Object,
  },
  mounted() {
    this.currentIndex = -1
  },
  methods: {
    clearClassInfo() {
      this.currentIndex = -2
      this.dayItem.classInfo = null
      this.dayItem.classId = null
      this.dayItem.isRest = 1
      this.dayItem.isActive = null
      this.$parent.$forceUpdate()
      setTimeout(() => {
        this.currentIndex = -1;
        this.$emit("update:classInfoDialogFlag", false)
      }, 500)
    },
    selectItem(index) {
      this.currentIndex = index;
      this.dayItem.classInfo = this.classInfoList[index]
      this.dayItem.classId = this.classInfoList[index].classId
      this.dayItem.isActive = 1
      this.dayItem.isRest = 0
      this.$parent.$forceUpdate()
      setTimeout(() => {
        this.currentIndex = -1;
        this.$emit("update:classInfoDialogFlag", false)
      }, 500)
    },
    hiddenDialog() {
      this.$emit("update:classInfoDialogFlag", false)
    },
  }
}
</script>

<style scoped lang="scss">
#class-info-list-dialog-content {
  position: relative;
  height: 100%;
  width: 100%;

  .list-content {
    width: 60%;
    height: 30rem;
    overflow-y: scroll;
    position: fixed;
    top: 50%;
    margin-top: -15rem;
    left: 20%;
    background-color: #fff;
    z-index: 2010;
    border-radius: 1rem;
    padding: 2rem;
    border: none;

    .class-info-item {
      width: 100%;
      height: 3.5rem;
      margin-bottom: .9rem;
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
      border: 1px solid #9f9f9f;
      box-shadow: 0 0 .3rem #949494;
    }

    .class-info-item-selected {
      background-color: #c9e0f6;
      color: #2e72ae;
      border: 1px solid #5895cb;
      box-shadow: 0 0 .3rem #79bcf8;
    }
  }
}
</style>
