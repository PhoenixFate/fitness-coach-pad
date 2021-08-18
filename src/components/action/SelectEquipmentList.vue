<template>
  <div>
    <BackgroundBlack  @click.native="hiddenDialog"></BackgroundBlack>
    <transition enter-active-class="animate__zoomIn animate__faster"
                leave-active-class="animate__zoomOut">
      <div class="equipment-list animate__animated" >
        <div class="equipment-items clearfix">
          <div class="equipment-item"
               v-for="(equipment,index) in fitnessEquipmentData"
               :key="index"
               @click="selectEquipment(index)"
               :class="equipment.selected?'equipment-item-selected':''"
          >
            <div class="image">
              <img :src="equipment.equipmentImageUrl" alt="">
            </div>
            <div class="name">
              {{ equipment.equipmentName }}
            </div>
            <div class="status" v-if="equipment.selected">
              <img src="images/action/detail/selected.png" alt="">
            </div>
            <div class="status" v-if="!equipment.selected">
              <img src="images/action/detail/unselected.png" alt="">
            </div>
          </div>
        </div>
        <div class="buttons">
          <div class="cancel"  @click="cancelSelectEquipment">取消</div>
          <div class="sure"  @click="confirmSelectEquipment">确认</div>
        </div>
      </div>
    </transition>
  </div>
</template>

<script>
import BackgroundBlack from "components/common/BackgroundBlack";
export default {
  name: "SelectEquipmentList",
  components:{BackgroundBlack},
  data(){
    return {

    }
  },
  props:{
    fitnessEquipmentData:Array,
    equipmentListDialogFlag:Boolean,
    action:Object,
  },
  methods:{
    hiddenDialog(){
      this.$emit("update:equipmentListDialogFlag",false)
    },
    selectEquipment(index) {
      this.fitnessEquipmentData[index].selected = !this.fitnessEquipmentData[index].selected
    },
    cancelSelectEquipment() {
      this.$emit("update:equipmentListDialogFlag",false)
    },
    confirmSelectEquipment() {
      let equipments = [];
      this.fitnessEquipmentData.forEach((equipment, index) => {
        if (equipment.selected) {
          equipments.push(equipment)
        }
      })
      this.action.equipments = equipments;
      this.$emit("update:equipmentListDialogFlag",false)
    },
  }
}
</script>

<style scoped lang="scss">
.equipment-list {
  position: fixed;
  width: 70%;
  height: 30rem;
  left: 15%;
  top: 50%;
  margin-top: -15rem;
  background-color: #fff;
  border-radius: 1.3rem;
  overflow-y: scroll;
  z-index: 2010;
  padding: 3.2%;

  .equipment-items {
    width: 100%;
    height: auto;

    .equipment-item {
      width: 30%;
      margin-right: 5%;
      height: 8.5rem;
      background-color: #fff;
      margin-bottom: 5%;
      float: left;
      border-radius: .6rem;
      overflow: hidden;
      box-shadow: .1rem .1rem .25rem #929191;
      position: relative;
      .image {
        height: 7rem;
        display: flex;
        justify-content: center;
        align-items: center;
        img {
          width: 100%;
          max-height: 100%;
        }
      }

      .name {
        font-size: .7rem;
        text-align: center;
        line-height: 1.5rem;
      }

      .status {
        position: absolute;
        top: .3rem;
        right: .3rem;
        width: 1.1rem;
        height: 1.1rem;

        img {
          width: 100%;
          height: 100%;
        }
      }
    }

    .equipment-item:nth-child(3n) {
      margin-right: 0;
    }
  }

  .buttons {
    width: 100%;
    height: 2rem;
    display: flex;
    margin-top: .5rem;
    justify-content: space-around;
    .cancel,.sure {
      height: 2rem;
      width: 8rem;
      border-radius: .4rem;
      display: flex;
      justify-content: center;
      align-items: center;
      font-size: .8rem;
    }
    .cancel {
      border: 1px solid #bdbdbd;
      color: #858585;
    }
    .sure {
      border:1px solid #4caf50;
      color:#4caf50;
    }
  }
}
</style>
