<template>
  <q-drawer
    id="left-menu"
    v-bind:value="leftDrawerOpen"
    behavior="mobile"
    class="left-drawer"
    @show="showLeftMenu"
    @hide="hideLeftMenu"
  >
    <div class="coach-info">
      <div class="coach-info-content">
        <img :src="coach.avatar" alt="" v-if="coach.avatar">
        <img src="images/coach/coach-avatar-male.png" alt=""
             v-if="!coach.avatar && (coach.gender===null || coach.gender==1)">
        <img src="images/coach/coach-avatar-female.png" alt="" v-if="!coach.avatar && coach.gender==2">
        <h5>{{ coach.coachName }}</h5>
      </div>
    </div>
    <div class="menu-list">
      <div class="menu-list-content">
        <div class="menu-item" @click="toCustomerList">
          <img src="images/menu/left/menu-customer.png" alt="">
          <span>客户列表</span>
        </div>
        <div class="menu-item" @click="toCustomerForm">
          <img src="images/menu/left/menu-form.png" alt="">
          <span>客户成长</span>
        </div>
        <div class="menu-item" @click="toDiet">
          <img src="images/menu/left/menu-diet.png" alt="">
          <span>饮食管理</span>
        </div>
        <div class="divider"></div>
        <div class="menu-item" @click="toEquipment">
          <img src="images/menu/left/menu-equipment.png" alt="">
          <span>器械介绍</span>
        </div>
        <div class="menu-item" @click="toAction">
          <img src="images/menu/left/menu-action.png" alt="">
          <span>录入动作</span>
        </div>
        <div class="menu-item" @click="toClass">
          <img src="images/menu/left/menu-class.png" alt="">
          <span>训练课程</span>
        </div>
        <div class="menu-item" @click="toPlan">
          <img src="images/menu/left/menu-plan.png" alt="">
          <span>制定计划</span>
        </div>
      </div>
    </div>

  </q-drawer>
</template>

<script>
import {leftMenuData} from "src/const/menu/leftMenuData";
import './left-menu.scss'

export default {
  name: "LeftMenu",
  components: {},
  data() {
    return {
      leftMenuData: leftMenuData,
      coach: {}
    };
  },
  methods: {
    showLeftMenu() {
      this.coach = JSON.parse(localStorage.getItem("coach"))
    },
    hideLeftMenu() {
      this.$emit("toggleLeftMenu");
    },
    toCustomerList() {
      this.$router.push("/main/customer/list")
    },
    toCustomerForm() {
      this.$router.push("main/customer/form")
    },
    toDiet() {
      this.$router.push("main/diet/management")
    },
    toEquipment() {
      this.$router.push("main/plan/equipment")
    },
    toAction() {
      this.$router.push("main/plan/action")
    },
    toClass() {
      this.$router.push("main/plan/class/management")
    },
    toPlan() {
      this.$router.push("main/plan/template")
    }
  },
  props: {
    leftDrawerOpen: {
      type: Boolean,
      required: true
    }
  }
};
</script>
<style scoped lang="scss">
.left-drawer {
  background-color: $font-black;
}

.coach-info {
  height: 32vh;
  width: 20vw;
  position: relative;

  .coach-info-content {
    height: 14vh;
    width: 100%;
    position: absolute;
    left: 2.5rem;
    bottom: 5vh;
    display: flex;
    justify-content: flex-start;
    align-items: flex-start;
    flex-direction: column;

    > img {
      width: 4.2rem;
      height: 4.2rem;
      border-radius: 50%;
    }

    h5 {
      font-size: 1.2rem;
      font-weight: 600;
      color: #FFFFFF;
      margin-top: .8rem;
    }
  }
}

.menu-list {
  height: 66vh;
  width: 100%;
  padding-top: .5rem;
  .menu-list-content {
    width: 26vw;
    margin-left: 1.3rem;
    height: 66vh;

    .menu-item {
      display: flex;
      justify-content: flex-start;
      align-items: center;
      height: 7vh;

      img {
        height: 2.4rem;
        width: 2.4rem;
        margin-right: .9rem;
      }

      span {
        font-size: 1rem;
        font-family: PingFangSC-Semibold, PingFang SC;
        font-weight: 600;
        color: #FFFFFF;
      }
    }

    .divider {
      width: 10rem;
      height: .05rem;
      opacity: 0.2;
      border: .05rem solid #FFFFFF;
      margin: 1.4vh 0 1.4vh .8rem;
    }
  }
}
</style>
