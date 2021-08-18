<template>
  <div id="setting-content">
    <div class="setting-list">
      <q-list separator>
        <q-item clickable v-ripple>
          <q-item-section>反馈问题</q-item-section>
          <q-item-section avatar>
            <q-icon name="navigate_next"/>
          </q-item-section>
        </q-item>

        <q-item clickable v-ripple>
          <q-item-section>
            <q-item-label>评价</q-item-label>
          </q-item-section>
          <q-item-section avatar>
            <q-icon name="navigate_next"/>
          </q-item-section>
        </q-item>

        <q-item clickable v-ripple>
          <q-item-section>
            <q-item-label>通用</q-item-label>
          </q-item-section>
          <q-item-section avatar>
            <q-icon name="navigate_next"/>
          </q-item-section>
        </q-item>
        <q-separator/>
      </q-list>
      <q-btn outline color="red"  label="退出登录" class="logout" @click="logout"/>
    </div>
  </div>
</template>

<script>
export default {
  name: "Index",
  data(){
    return {

    }
  },
  methods:{
    logout(){
      localStorage.removeItem("coach")
      localStorage.removeItem("token")
      this.$router.push("/login")
    }
  }

}
</script>

<style lang="scss">
#setting-content {
  height: 100%;
  width: 100%;
  background-color: #F2C037;
  background-image: url("../../../assets/images/mine/setting-background.jpg");
  background-repeat: no-repeat;
  background-size: 100% 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: -1;
  .setting-list {
    width: 60%;
    font-size: 1.1rem;
    height: 30rem;
    border-radius: .7rem;
    box-shadow: .25rem .25rem 1rem #999;
    background-color: #fff;
    position: relative;
    padding: .7rem;
    .logout {
      position: absolute;
      bottom: 2rem;
      width: calc(100% - 1.5rem);
      border-radius: .4rem;
    }
  }
}
</style>
