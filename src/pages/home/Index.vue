<template>
  <div id="home-content">
    <div class="home-header"
         :class="headerFixedFlag?'home-header-fixed':''"
    >
      <div class="left-menu" @click="toggleLeftMenu">
        <img src="images/menu/top-left.png" alt="">
      </div>
      <div class="right-menu">
        <img src="images/menu/top-scan.png" alt="">
        <div class="divider"></div>
        <div class="coach-name" v-if="coach" @click="toggleRightMenu">
          <img :src="coach.avatar" alt="">
          <span>{{ coach.coachName }}</span>
        </div>
        <q-btn class="pull" flat round icon="img:images/menu/top-pull.png" @click="toggleRightMenu"/>
      </div>
    </div>
    <div class="daily" :class="!headerFixedFlag?'daily-unfix':''">
      <div class="toggle-calendar">
        <div class="button-left" :class="homeCalendarFlag?'button-disable':''" @click="toggleCalendar(false)">
          <img src="images/home/vertical-calendar.png" alt="" v-if="!homeCalendarFlag">
          <img src="images/home/vertical-calendar-disable.png" alt="" v-if="homeCalendarFlag">
        </div>
        <div class="button-right" :class="!homeCalendarFlag?'button-disable':''" @click="toggleCalendar(true)">
          <img src="images/home/horizontal-calendar.png" alt="" v-if="homeCalendarFlag">
          <img src="images/home/horizontal-calendar-disable.png" alt="" v-if="!homeCalendarFlag">
        </div>
      </div>
      <HorizontalCalendar @select-date="selectOneDay($event)" v-if="homeCalendarFlag"/>
      <VerticalCalendar @select-date="selectOneDay($event)" v-if="!homeCalendarFlag"/>
    </div>
    <div class="today-work" v-if="homeCalendarFlag">
      <div class="home-title" style="margin-bottom: -.4rem">
        当日安排
      </div>
      <div class="work-body">
        <CustomerArrangement
          v-for="customerArrangement in customerArrangementList"
          :customer-arrangement="customerArrangement"
          style="margin-top: 1.1rem"
          :key="customerArrangement.name"
        />
      </div>
      <div v-if="customerArrangementList.length===0" class="assignment-empty">
        <img src="images/home/assignment-empty.png" alt="">
        <p>今天暂无安排，休息一下吧</p>
      </div>
    </div>
    <div class="potential-customer" v-if="potentialCustomerList.length>0">
      <div class="home-title">
        潜在客户
      </div>
      <CustomerListItem v-for="(customer,customerIndex) in potentialCustomerList" :key="customerIndex"
                        :customer="customer" style="margin: .9rem auto"></CustomerListItem>
    </div>
    <div
      v-if="potentialCustomerList.length === 0"
      class="potential-customer-empty"
    >
      <div class="home-title">
        潜在客户
      </div>
      <img src="images/home/customer-empty.png">
      <p>暂无潜在客户，请先添加潜在客户</p>
    </div>
  </div>
</template>
<script>
import HorizontalCalendar from './HorizontalCalendar';
import VerticalCalendar from "pages/home/VerticalCalendar";
import CustomerArrangement from 'components/home/CustomerArrangement';
import CustomerListItem from 'components/customer/list/CustomerListItem';
import {apiCustomerNotVipList} from 'src/api/customer';
import {apiCustomerPlanDayList} from 'src/api/customerPlanDay';
import {getAge, getStrDate} from 'src/util/dateUtil';

export default {
  name: 'Index',
  components: {HorizontalCalendar, VerticalCalendar, CustomerArrangement, CustomerListItem},
  data() {
    return {
      customerArrangementList: [],
      height: '0px',
      potentialCustomerList: [],
      coach: {},
      coachDetail: {},
      gym: {},
      homeCalendarFlag: true,
      headerFixedFlag: true
    };
  },
  props: {
    leftDrawerOpen: Boolean
  },
  created() {
    let coach = localStorage.getItem('coach');
    if (!coach) {
      this.$router.replace('/login');
    } else {
      this.coach = JSON.parse(coach);
      console.log(this.coach);
    }
    let gym = localStorage.getItem('gym');
    if (gym) {
      this.gym = gym;
    }
    this.loadData();
    let date = new Date();
    this.selectDate = getStrDate(date);
    this.loadAssignment();
  },
  methods: {
    loadData() {
      apiCustomerNotVipList({limit: 1000}).then(res => {
        this.potentialCustomerList = res.data.data.list;
      });
    },
    loadAssignment() {
      apiCustomerPlanDayList({date: this.selectDate}).then(res => {
        res.data.data.forEach(temp => {
          if (temp.customer && temp.customer.birthday) {
            temp.customer.age = getAge(temp.customer.birthday);
          }
        });
        this.customerArrangementList = res.data.data;
      });
    },
    toggleLeftMenu() {
      this.$emit("toggleLeftMenu")
    },
    toggleRightMenu() {
      this.$emit("toggleRightMenu")
    },
    selectOneDay(val) {
      this.selectDate = val;
      this.loadAssignment();
    },
    toggleCalendar(flag) {
      this.homeCalendarFlag = flag
    },
    unfixHeader() {
      this.headerFixedFlag = false
    },
    fixHeader() {
      this.headerFixedFlag = true
    },
  }
};
</script>

<style scoped lang="scss">
#home-content {
  background-color: #eeeeee;
  height: auto;
  overflow-y: scroll;

  .home-header {
    height: 3rem;
    width: 100%;
    position: relative;
    z-index: 100;
    padding: 0 1.5rem;
    display: flex;
    justify-content: space-between;
    align-items: center;
    background-color: #fff;

    .left-menu {
      width: 2.2rem;
      height: 2.2rem;
    }

    .right-menu {
      width: 19em;
      height: 2.2rem;
      display: flex;
      justify-content: center;
      align-items: center;

      > img {
        width: 2.2rem;
        height: 2.2rem;
      }

      .divider {
        width: .1rem;
        height: 1.6rem;
        background-color: #eaebee;
        margin: 0 1.5rem;
      }

      .coach-name {
        display: flex;
        margin-right: .8rem;

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
          font-family: PingFangSC-Regular, PingFang SC;
        }
      }
    }
  }

  .home-header-fixed {
    position: fixed;
    left: 0;
    top: 0;
  }

  .daily {
    width: 100%;
    height: auto;
    margin-top: 3rem;
    position: relative;

    .toggle-calendar {
      position: absolute;
      right: 0;
      top: .5rem;
      width: 6rem;
      height: 1.4rem;
      display: flex;
      margin-right: 1rem;

      .button-left, .button-right {
        width: 3rem;
        height: 100%;
        border: .05rem solid #D1D1D7;
        display: flex;
        justify-content: center;
        align-items: center;

        img {
          width: 1rem;
          height: 1rem;
        }
      }

      .button-left {
        border-radius: .1rem 0 0 .1rem;
      }

      .button-right {
        border-radius: 0 0.1rem 0.1rem 0;
        margin-left: -0.05rem;
      }

      .button-disable {
        background-color: #f6f7fa;
      }
    }
  }

  .daily-unfix {
    margin-top: 0;
  }

  .home-title {
    width: 100%;
    height: 2.4rem;
    background-color: #fff;
    line-height: 2.4rem;
    font-size: 1.4rem;
    font-family: PingFangSC-Semibold, PingFang SC;
    font-weight: 600;
    color: $font-black;
  }

  .today-work {
    width: 100%;
    padding: .8rem 1.5rem 1.5rem 1.5rem;
    background-color: #fff;
    margin-top: -1.2rem;

    .work-body {
      margin-bottom: 0.5rem;
      margin-top: .5rem;
    }

    .assignment-empty {
      width: 100%;
      height: 14rem;
      background-color: #fff;
      display: flex;
      justify-content: center;
      align-items: center;
      flex-direction: column;

      img {
        width: 17rem;
        height: 11rem;
        margin-bottom: 1rem;
      }

      p {
        color: #ABACB4;
        font-size: .9rem;
        font-family: PingFangSC-Regular, PingFang SC;
        font-weight: 400;
        margin: 0;
      }
    }

    margin-bottom: .5rem;
  }


  .potential-customer {
    width: 100%;
    height: auto;
    background-color: #fff;
    border-radius: 12px;
    padding: 1.5rem;
  }

  .potential-customer-empty {
    width: 100%;
    height: 20rem;
    background-color: #fff;
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
    padding: 1.5rem;

    img {
      width: 13rem;
      height: 12rem;
    }
    p {
      color: #ABACB4;
      font-size: .9rem;
      font-family: PingFangSC-Regular, PingFang SC;
      font-weight: 400;
      margin: 1rem 0 0 0;
    }
  }
}
</style>
