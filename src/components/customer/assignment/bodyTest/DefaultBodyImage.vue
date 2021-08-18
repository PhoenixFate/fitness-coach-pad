<template>
  <img :src="url" alt="" @click="$emit('click')"  />
</template>

<script>
export default {
  name: 'DefaultBodyImage',
  props: {
    side: {
      require: true
    },
    gender: {
      require: true
    }
  },
  computed: {
    url() {
      let fileGender = 'male';
      if (this.gender == 1) {
        fileGender = 'male';
      } else if (this.gender == 2) {
        fileGender == 'female';
      }
      return `images/customer/bodyStatus/body-${this.side}-${fileGender}.png`;
    }
  }
};
</script>

<style></style>
