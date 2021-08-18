<template>
  <div class="background-black"></div>
</template>

<script>
export default {
  name: "BackgroundBlackLess"
}
</script>

<style scoped lang="scss">
.background-black {
  position: fixed;
  background-color: rgba(0,0,0,0.26);
  width: 100%;
  height: calc(100% + 3rem);
  left: 0;
  top:-3rem;
  z-index: 2005;
}
</style>
