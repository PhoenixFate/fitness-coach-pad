<template>
  <div></div>
</template>

<script>
export default {
  name: "Index",
  created() {
    let coach=localStorage.getItem("coach")
    let token=localStorage.getItem("token")
    if(coach && token){
      this.$router.replace("/home")
    }else {
      this.$router.replace("/login")
    }
  }
}
</script>

<style scoped>

</style>
