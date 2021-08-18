<template>
  <div id="main-layout" class="default-bg-color">
    <q-layout view="lHh lpr lFf">
      <LeftMenu
        :leftDrawerOpen="leftDrawerOpen"
        @toggleLeftMenu="toggleLeftMenu"
      ></LeftMenu>
      <q-page-container>
        <div class="first-shadow" v-if="leftDrawerOpen"/>
        <div class="second-shadow" v-if="leftDrawerOpen"/>
        <router-view
          @toggleLeftMenu="toggleLeftMenu"
          @toggleRightMenu="toggleRightMenu"
          ref="mainContent"
          :leftDrawerOpen="leftDrawerOpen"
          class="main-content"
          :class="leftDrawerOpen ? 'show-half' : ''"
        />
      </q-page-container>
      <RightMenu
        :rightDrawerOpen="rightDrawerOpen"
        @toggleRightMenu="toggleRightMenu"
      ></RightMenu>
    </q-layout>
  </div>
</template>

<script>
import LeftMenu from 'components/menu/LeftMenu'
import RightMenu from "components/menu/RightMenu";

export default {
  name: 'MainLayout',
  components: {LeftMenu, RightMenu},
  data() {
    return {
      leftDrawerOpen: false,
      rightDrawerOpen: false,
      coach: null
    }
  },
  created() {
    this.coach = JSON.parse(localStorage.getItem("coach"))
    console.log(this.coach)
  },
  methods: {
    toggleLeftMenu() {
      if(!this.leftDrawerOpen){
        //打开左菜单
        this.$refs.mainContent.unfixHeader()
        this.leftDrawerOpen=true
      }else {
        //关闭左菜单
        this.leftDrawerOpen=false
        setTimeout(()=>{
          this.$refs.mainContent.fixHeader()
        },500)
      }
    },
    toggleRightMenu() {
      this.rightDrawerOpen = !this.rightDrawerOpen;
    }
  }
}
</script>
<style scoped lang="scss">
#main-layout {
  .scanner {
    margin-right: .7rem;
  }

  .q-toolbar__title {
    text-align: center;
  }

  .divider {
    width: .1rem;
    height: 1.4rem;
    background-color: #eaebee;
    margin-right: 2.4rem;
  }

  .coach-name {
    display: flex;

    img {
      width: 1.3rem;
      height: 1.3rem;
      margin-right: .5rem;
    }

    span {
      font-size: .7rem;
      color: #515055;
      display: flex;
      justify-content: center;
      align-items: center;
      margin-right: .8rem;
    }
  }

}

.main-content.show-half {
  position: fixed;
  left: 60vw;
  top: 7vh;
  height: 85vh !important;
  padding: 0 !important;
  border-radius: 1rem;
  overflow: hidden;
  z-index: 100;
}

.main-content {
  position: absolute;
  left: 0;
  top: 0;
  width: 100vw;
  transition: 0.5s;
  z-index: 100;
  height: auto;
}

.first-shadow {
  width: 100vw;
  height: 82vh !important;
  background: #ffffff;
  border-radius: 16px;
  opacity: 0.3;
  position: fixed;
  top: 8vh;
  left: 58vw;
  z-index: 60;
}

.second-shadow {
  z-index: 20;
  width: 100vw;
  height: 78vh !important;
  background: #ffffff;
  border-radius: 16px;
  opacity: 0.1;
  position: fixed;
  top: 9vh;
  left: 56vw;
}
</style>
