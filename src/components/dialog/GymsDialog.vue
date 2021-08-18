<template>
  <div class="gym-dialog-body">
    <BackgroundBlackLess @click.native="hiddenDialog"></BackgroundBlackLess>
    <div class="gym-dialog">
      <div class="dialog-content">
        <div class="gym-item" v-for="(gym,gymIndex) in gymList" @click="selectGym(gymIndex)" :key="gymIndex">
          <img src="images/gym/gym-default.png" alt="" v-if="!gym.gymImageUrl">
          <img :src="gym.gymImageUrl" alt="" v-if="gym.gymImageUrl">
          <div class="gym-info">
            <h3>{{ gym.gymName }}</h3>
            <h6>{{ gym.city }}</h6>
            <p>{{ gym.address }}</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import BackgroundBlackLess from '../common/BackgroundBlackLess'

export default {
  components: {BackgroundBlackLess},
  name: 'GymsDialog',
  data () {
    return {}
  },
  methods: {
    hiddenDialog () {
      this.$emit('update:gymsDialogFlag', false)
    },
    selectGym (gymIndex) {
      this.$emit('selectOneGym', gymIndex)
      this.$emit('update:gymsDialogFlag', false)
    }
  },
  props: {
    gymList: Array,
    gymsDialogFlag: Boolean
  }
}
</script>

<style scoped lang="scss">
.gym-dialog-body {
  .gym-dialog {
    width: 24rem;
    height: 30rem;
    position: fixed;
    left: 50%;
    top: 50%;
    margin-left: -12rem;
    margin-top: -15rem;
    background-color: rgba(0, 0, 0, 0.5);
    border-radius: 1rem;
    padding: 1rem;
    z-index: 2010;

    .dialog-content {
      width: 100%;
      height: 100%;
      overflow-y: scroll;

      .gym-item {
        width: 100%;
        height: 6.2rem;
        margin-bottom: 1rem;
        background-color: #fff;
        border-radius: .4rem;
        position: relative;

        > img {
          width: 7rem;
          height: 5rem;
          position: absolute;
          left: .5rem;
          top: .5rem;
          border-radius: .3rem;
        }
        .gym-info {
          position: absolute;
          left: 8.5rem;
          width: 13rem;
          height: 100%;
          h3 {
            font-size: 1.1rem;
            color: #000;
            line-height: 1.4rem;
            margin-top: .6rem;
          }

          h6 {
            font-size: .8rem;
            line-height: 1rem;
            margin-top: .6rem;
          }

          p {
            font-size: .7rem;
            color: #999;
            margin: .2rem 0;
          }
        }


      }
    }
  }
}
</style>
