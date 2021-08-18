<template>
  <div id="class-assignment-header">
    <div class="header-image">
      <img :src="customerPlanDay.classInfo.classCoverImage" alt="">
      <div class="header-image-cover"></div>
    </div>
    <div class="customer-info" v-if="customerPlanDay.customer">
      <div class="avatar">
        <div class="avatar-image">
          <img :src="customerPlanDay.customer.avatar" alt="" v-if="customerPlanDay.customer.avatar">
          <img src="images/home/male-default.png" alt=""
               v-if="!customerPlanDay.customer.avatar && customerPlanDay.customer.gender==1">
          <img src="images/home/female-default.png" alt=""
               v-if="!customerPlanDay.customer.avatar && customerPlanDay.customer.gender==2">
          <img src="images/home/crown.png" alt="" class="crown" v-if="customerPlanDay.customer.isVip===1">
        </div>
      </div>
      <div class="info">
        <div class="line1">
          <span>{{ customerPlanDay.customer.name }}</span>
          <div v-if="customerPlanDay.customer.isVip===1">
            <img src="images/customer/detail/new-vip.png" alt="">
            <span>会员</span>
          </div>
        </div>
        <div class="line2">
          <div style="margin-right: 1rem">
            <span>会员有效期: </span>
            <span>{{ customerPlanDay.customer.vipEndDate }}</span>
          </div>
          <div>
            <span>剩余课程: </span>
            <span>{{
                (customerPlanDay.customer.totalClass - customerPlanDay.customer.currentClass)|formatEmpty
              }}节</span>
          </div>
          <div>
            <span>会员编号: </span>
            <span>{{ customerPlanDay.customer.customerNumber }}</span>
          </div>
        </div>
      </div>
    </div>
    <h5 v-if="customerPlanDay.customerPlan.trainingPlan">
      {{ customerPlanDay.customerPlan.trainingPlan.trainingPlanName }}</h5>
    <div class="class-list">
      <div class="header-content-scroll" ref="historyScroll">
        <div class="class-item" v-for="(historyClass,index) in historyClassInfo" :key="index">
          <img :src="historyClass.classInfo.classCoverImage" alt="">
          <div class="status status-finished" v-if="historyClass.status===1">
            已完成
          </div>
          <div class="status status-now"
               v-if="historyClass.status===0 && historyClass.customerPlanDayId==customerPlanDayId">
            进行中
          </div>
          <div class="status status-future"
               v-if="historyClass.status===0 && historyClass.customerPlanDayId!=customerPlanDayId">
            未完成
          </div>
          <div class="class-cover-info">
            <h6>{{ historyClass.classInfo.className }}</h6>
            <p>{{ historyClass.detailDate }}</p>
          </div>
        </div>
        <div class="history-empty" v-if="historyClassInfo.length===0">
          <img src="images/classAssignment/history-empty.png" alt="">
          <h5>暂无课程列表</h5>
        </div>
        <div class="empty"></div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "ClassAssignmentHeader",
  data() {
    return {}
  },
  methods: {
    scrollToItem(index) {
      this.$nextTick(() => {
        this.$refs.historyScroll.scrollTo(document.body.clientWidth * 0.38 * index, 0);
      })
    }
  },
  created() {
  },
  props: {
    customerPlanDay: Object,
    historyClassInfo: Array,
    customerPlanDayId: String
  }
}
</script>

<style scoped lang="scss">
#class-assignment-header {
  width: 100%;
  height: 29rem;
  margin-top: -3rem;
  padding-top: 3rem;
  position: relative;

  .header-image {
    z-index: 10;
    height: 34rem;
    width: 100%;
    position: absolute;
    left: 0;
    top: -7rem;
    background: linear-gradient(16deg, #23262D 0%, #3D404A 100%);

    .header-image-cover {
      position: absolute;
      left: 0;
      top: 0;
      height: 100%;
      width: 100%;
      background: linear-gradient(270deg, rgba(73, 78, 89, 0) 0%, #23262D 100%);
    }

    img {
      width: 100%;
      height: 100%;
      opacity: .12;
      filter: blur(.3rem);
    }
  }

  .customer-info {
    height: 8em;
    width: 100%;
    z-index: 100;
    position: absolute;
    top: 3.8rem;
    left: 0;
    display: flex;

    .avatar {
      width: 14.6%;
      display: flex;
      justify-content: flex-start;
      align-items: flex-start;
      padding-top: 1rem;
      padding-left: 1.5rem;

      .avatar-image {
        position: relative;
        width: 2.9rem;
        height: 2.9rem;
        border-radius: 50%;

        img {
          width: 100%;
          height: 100%;
          border-radius: 50%;
        }

        .crown {
          position: absolute;
          width: 1.8rem;
          height: 1.6rem;
          left: -.6rem;
          top: -.7rem;
        }
      }
    }

    .info {
      width: 60%;
      display: flex;
      flex-direction: column;
      justify-content: flex-start;
      align-items: flex-start;
      color: #fff;
      padding-top: 1rem;

      .line1 {
        height: 1.4rem;
        width: 100%;
        display: flex;
        align-items: center;
        margin-bottom: .5rem;

        > span {
          font-size: 1.3rem;
          font-weight: 600;
          margin-right: .6rem;
          font-family: PingFangSC-Semibold, PingFang SC;
        }

        > div {
          width: 2.7rem;
          height: .9rem;
          position: relative;
          display: flex;
          justify-content: center;
          align-items: center;

          img {
            width: 100%;
            height: 100%;
            position: absolute;
            left: 0;
            top: 0;
          }

          span {
            color: #23262D;
            font-size: .5rem;
            z-index: 10;
            font-weight: 500;
          }
        }
      }

      .line2 {
        width: 100%;
        display: flex;
        font-size: .7rem;

        div {
          span:nth-child(1) {
            margin-right: .2rem;
          }
        }

        div:nth-child(1) {
          width: 9rem;
        }

        div:nth-child(2) {
          width: 6rem;
        }

        div:nth-child(3) {
          width: 8rem;
        }
      }
    }
  }

  > h5 {
    position: absolute;
    top: 10rem;
    left: 0;
    padding-left: 1.5rem;
    z-index: 100;
    font-size: 1.4rem;
    font-weight: 600;
    color: #FFFFFF;
  }

  .class-list {
    width: 100%;
    height: 16rem;
    position: absolute;
    overflow: hidden;
    bottom: 3rem;
    left: 0;
    z-index: 100;

    .header-content-scroll {
      overflow-x: scroll;
      overflow-y: hidden;
      justify-content: flex-start;
      display: flex;
      height: 100%;
      padding-top: 1rem;

      .class-item {
        width: 38%;
        height: 66%;
        flex-shrink: 0;
        margin-top: 5.8%;
        margin-left: 3%;
        border-radius: .4rem;
        display: flex;
        align-items: center;
        flex-direction: column;
        justify-content: center;
        background-color: rgba(255, 255, 255, 0.4);
        position: relative;
        overflow: hidden;
        border: .05rem solid $font-black;

        img {
          width: 100%;
          height: 100%;
          border-radius: .4rem;
        }

        .status {
          position: absolute;
          width: 3.2rem;
          height: 1.4rem;
          left: 0;
          top: 0;
          display: flex;
          justify-content: center;
          align-items: center;
          font-size: .6rem;
          font-family: PingFangSC-Regular, PingFang SC;
          font-weight: 400;
          color: #FFFFFF;
          border-radius: .3rem 0 .8rem 0;
        }

        .status-finished {
          background-color: #06c187;
        }

        .status-now {
          background-color: #FFAD2A;
        }

        .status-future {
          background-color: #ABACB4;
        }

        .class-cover-info {
          position: absolute;
          left: 0;
          bottom: 0;
          width: 100%;
          height: 3.2rem;
          background: #23262D;
          border-radius: 0 0 .3rem .3rem;
          opacity: 0.6;
          padding: .6rem 0 0 1rem;

          h6 {
            font-size: .9rem;
            color: #fff;
            height: 1.4rem;
            line-height: 1.4rem;
          }

          p {
            font-size: .6rem;
            margin: 0;
            color: #fff;
          }
        }
      }

      .history-empty {
        width: 38%;
        height: 66%;
        flex-shrink: 0;
        margin-top: 5.8%;
        margin-left: 3%;
        border-radius: .4rem;
        display: flex;
        align-items: center;
        flex-direction: column;
        justify-content: center;
        background-color: rgba(255, 255, 255, 0.3);
        padding-top: .3rem;

        img {
          width: 60%;
          height: 76%;
        }

        h5 {
          font-size: .8rem;
          color: #cecece;
          margin-top: -.4rem;
        }
      }

      .empty {
        width: 3%;
        height: 72%;
        flex-shrink: 0;
      }
    }
  }
}
</style>
