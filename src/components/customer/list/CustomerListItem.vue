<template>
  <div id="customer-content">
    <div class="customer" @click="toCustomerDetail()">
      <div class="customer-avatar">
        <img :src="customer.avatar" alt="" v-if="customer.avatar">
        <img src="images/home/male-default.png" alt=""
             v-if="!customer.avatar && customer.gender===1 && customer.isVip===1">
        <img src="images/home/female-default.png" alt=""
             v-if="!customer.avatar && customer.gender===2 && customer.isVip===1">
        <img src="images/home/male-default-novip.png" alt=""
             v-if="!customer.avatar && customer.gender===1 && customer.isVip===0">
        <img src="images/home/female-default-novip.png" alt=""
             v-if="!customer.avatar && customer.gender===2 && customer.isVip===0">
        <img src="images/home/crown.png" alt="" class="crown" v-if="customer.isVip===1">
      </div>
      <div class="customer-info">
        <div class="customer-info-1">
          <span>{{ customer.name }}</span>
          <div class="vip" v-if="customer.isVip">会员</div>
          <div class="not-vip" v-if="!customer.isVip">潜客</div>
        </div>
        <div class="customer-info-2">
          <img src="images/home/gender-male.png" alt="" v-if="customer.gender===1">
          <img src="images/home/gender-female.png" alt="" v-if="customer.gender===2">
          <span v-if="customer.age || customer.age===0">{{ customer.age }}</span>
          <span v-if="customer.age===null || customer.age===undefined">未知</span>
          <div></div>
          <img src="images/home/new-phone.png" alt="">
          <span>{{ customer.mobile }}</span>
          <div></div>
          <img src="images/customer/list/new-city.png" alt="">
          <span v-if="customer.city" class="city">{{ customer.city }}</span>
          <span v-if="!customer.city" class="city">火星</span>
          <div></div>
          <img src="images/customer/list/new-birthday.png" alt="">
          <span v-if="customer.birthday">{{ customer.birthday }}</span>
          <span v-if="!customer.birthday">未知</span>
        </div>
      </div>
      <div class="customer-progress">
        <div v-if="customer.isVip" class="vip">
          <van-progress
            class="progress"
            :percentage="customer.currentClass / customer.totalClass*100"
            stroke-width=".5rem"
            track-color="#ebecef"
            pivot-text="a"
            pivot-color="#fff"
            color="#f5ad29"
            :show-pivot="true"
            v-if="customer.totalClass"
          />
          <div v-if="customer.totalClass" class="progress-name">
            <strong>{{ customer.currentClass }}/{{ customer.totalClass }}</strong>
            <span>课程进度</span>
          </div>
          <h5 v-if="!customer.totalClass">暂无训练计划</h5>
        </div>
        <div v-if="!customer.isVip" class="not-vip">
          <div class="not-vip-progress">
            <div class="item"
                 :class="index<=customer.progressIndex?'item-selected':''"
                 v-for="index of 5" :key="index"></div>
          </div>
          <div class="progress-name">
            <strong>{{ customer.progressIndex }}/5</strong>
            <span>会员进度</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import {getAge} from "src/util/dateUtil";
import "./vant-index-bar.scss"

export default {
  name: "CustomerListItem.vue",
  created() {
    if (this.customer && this.customer.birthday) {
      this.customer.age = getAge(this.customer.birthday)
    }
  },
  props: {
    customer: {
      type: Object,
      required: true
    },
  },
  methods: {
    toCustomerDetail() {
      if (this.customer.isVip) {
        this.$router.push({path: "/main/customer/detail", query: {customerId: this.customer.customerId}})
      } else {
        this.$router.push({path: "/main/customer/assignment", query: {customerId: this.customer.customerId}})
      }
    }
  }
}
</script>

<style scoped lang="scss">
#customer-content {
  .customer {
    height: 4.4rem;
    width: 100%;
    border: .05rem solid #ebecef;
    border-radius: .3rem;
    display: flex;
    padding: 0 .93rem;

    .customer-avatar {
      width: 3rem;
      height: 100%;
      position: relative;
      display: flex;
      justify-content: center;
      align-items: center;

      > img {
        width: 2.5rem;
        height: 2.5rem;
        border-radius: 50%;
      }

      .crown {
        position: absolute;
        width: 1.8rem;
        height: 1.6rem;
        left: -.2rem;
        top: .2rem;
      }
    }

    .customer-info {
      width: 21rem;
      padding-left: .5rem;
      padding-top: .74rem;

      .customer-info-1 {
        width: 16rem;
        height: 1.5rem;
        display: flex;
        justify-content: flex-start;
        align-items: center;

        > span {
          font-size: 1rem;
          font-weight: bold;
          margin-right: .6rem;
        }

        .vip, .not-vip {
          width: 2.5rem;
          height: 1rem;

          display: flex;
          justify-content: center;
          align-items: center;
          font-size: .6rem;

        }

        .vip {
          background-image: url("../../../assets/images/customer/list/vip-name.png");
          background-size: 100% 100%;
          color: #f5ad29;
        }

        .not-vip {
          background-image: url("../../../assets/images/customer/list/novip-name.png");
          background-size: 100% 100%;
          color: #ABACB4;
        }
      }

      .customer-info-2 {
        height: 1.4rem;
        width: 100%;
        display: flex;
        justify-content: flex-start;
        align-items: center;

        img {
          width: .8rem;
          height: .8rem;
          margin-right: .2rem;
        }

        span {
          color: #a9aab2;
          font-size: .7rem;
        }

        div {
          width: .1rem;
          height: 1rem;
          margin: 0 .5rem;
          background-color: #EBECEF;
        }

        span:nth-child(2) {
          width: 1.4rem;
        }

        span:nth-child(5) {
          width: 4.7rem;
        }

        .city {
          width: 2.3rem;
        }
      }
    }

    .customer-progress {
      width: 7.5rem;
      padding-top: 1.4rem;

      .progress {
        width: 100%;
        margin-bottom: .4rem;
      }

      .not-vip-progress {
        height: .5rem;
        margin-bottom: .4rem;
        display: flex;
        justify-content: space-between;
        align-items: center;

        .item {
          width: 1.4rem;
          height: .5rem;
          background-color: #ebecef;
          border-radius: .3rem;
        }

        .item-selected {
          background-color: #f5ad29;
        }
      }

      .progress-name {
        height: 1.3rem;
        width: 100%;
        display: flex;
        justify-content: flex-end;
        align-items: center;

        span {
          font-size: .7rem;
          color: #a7a8b1;
        }

        strong {
          margin-right: .5rem;
          color: $font-black;
          font-size: 1.2rem;
          font-family: Staatliches-Regular, Staatliches;
          font-weight: 400;
        }
      }

      h5 {
        font-size: .8rem;
        text-align: center;
        color: #999;
        margin-top: -.15rem;
      }
    }
  }
}
</style>
