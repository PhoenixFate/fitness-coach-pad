<template>
  <q-drawer
    side="right"
    v-bind:value="rightDrawerOpen"
    :show-if-above="false"
    bordered
    @show="showRightMenu()"
    @hide="hideRightMenu()"
    :width="320"
  >
    <q-img class="absolute-top user-background" src="images/mine/userBackground.png">
      <div class="absolute-full bg-transparent user-info">
        <q-avatar size="6rem" class="avatar">
          <img :src="coach.avatar" alt="" v-if="coach.avatar">
          <img src="images/coach/coach-avatar-male.png" alt="" v-if="!coach.avatar && (coach.gender===null || coach.gender==1)">
          <img src="images/coach/coach-avatar-female.png" alt="" v-if="!coach.avatar && coach.gender==2">
        </q-avatar>
        <div class="name">
          <span>{{ coach.coachName }}</span>
          <img src="images/home/male.png" alt="" v-if="coach.gender==1">
          <img src="images/home/female.png" alt="" v-if="coach.gender==2">
        </div>
        <div class="phone">电话: {{coach.mobile}}</div>
      </div>
    </q-img>
    <q-scroll-area class="user-menu">
      <q-list padding>
        <div v-for="menuData in rightMenuData" :key="menuData.title">
          <q-item clickable v-ripple :to="menuData.to">
            <q-item-section avatar>
              <q-icon :name="menuData.icon" />
            </q-item-section>
            <q-item-section>
              {{menuData.title}}
            </q-item-section>
            <q-item-section avatar>
              <q-icon name="navigate_next"/>
            </q-item-section>
          </q-item>
          <q-separator spaced v-if="menuData.hasDivider"/>
        </div>
      </q-list>
    </q-scroll-area>
  </q-drawer>
</template>

<script>
import {rightMenuData} from "src/const/menu/rightMenuData";
import "./right-menu.scss"
export default {
  name: "RightMenu",
  data(){
    return{
      rightMenuData:rightMenuData,
      coach:{}
    }
  },
  created() {
  },
  methods:{
    showRightMenu(){
      this.coach=JSON.parse(localStorage.getItem("coach"))
    },
    hideRightMenu(){
      this.$emit("toggleRightMenu")
    }
  },
  props: {
    rightDrawerOpen: {
      type: Boolean,
      required: true
    },
  }
}
</script>

<style scoped lang="scss">
.user-background {
  height: 40%;
  .user-info {
    text-align: center;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    .avatar {
      margin-bottom: .5rem;
    }
    .name {
      font-size: 1.2rem;
      font-weight: bold;
      margin-bottom: .2rem;
      height: 2rem;
      display: flex;
      align-items: center;
      img {
        width: 1rem;
        height: 1rem;
        margin-left: .2rem;
      }
    }
    .phone {
      font-size: .8rem;
    }
  }
}

.user-menu {
  height: 60%;
  padding-top: 1rem;
  margin-top: 40vh;
  border-right: 1px solid #ddd;
}

</style>
