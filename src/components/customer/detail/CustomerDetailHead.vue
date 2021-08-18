<template>
  <div id="customer-detail-head-content">
    <div class="detail-head">
      <div class="avatar">
        <div class="avatar-image">
          <img :src="customer.avatar" alt="" v-if="customer.avatar">
          <img src="images/home/male-default.png" alt=""
               v-if="!customer.avatar && customer.gender==1">
          <img src="images/home/female-default.png" alt=""
               v-if="!customer.avatar && customer.gender==2">
          <img src="images/home/crown.png" alt="" class="crown" v-if="customer.isVip===1">
        </div>
      </div>
      <div class="info">
        <div class="line1">
          <span>{{ customer.name }}</span>
          <div>
            <img src="images/customer/detail/new-vip.png" alt="">
            <span>会员</span>
          </div>
        </div>
        <div class="line2">
          <div>
            <span>会员有效期: </span>
            <span>{{customer.vipEndDate}}</span>
          </div>
          <div>
            <span>剩余课程: </span>
            <span>{{customer.totalClass|formatEmpty}}节</span>
          </div>
          <div>
            <span>会员编号: </span>
            <span>{{ customer.customerNumber }}</span>
          </div>
        </div>
        <div class="line3">
          <div class="line3-line1">
            <div>
              <img src="images/customer/detail/new-gender-male.png" alt="" v-if="customer.gender==1">
              <img src="images/customer/detail/new-gender-female.png" alt="" v-if="customer.gender==2">
              <span>{{customer.age|formatEmpty}}</span>
            </div>
            <div>
              <img src="images/customer/detail/new-birthday.png" alt="">
              <span>{{customer.birthday|formatEmpty}}</span>
            </div>
            <div>
              <img src="images/customer/detail/new-mobile.png" alt="">
              <span>{{customer.mobile|formatEmpty}}</span>
            </div>
          </div>
          <div class="line3-line2">
            <div>
              <img src="images/customer/detail/new-city.png" alt="">
              <span>{{customer.city|formatEmpty}}</span>
            </div>
            <div>
              <img src="images/customer/detail/new-card.png" alt="">
              <span>{{customer.identityCard|formatEmpty}}</span>
            </div>
            <div>
              <img src="images/customer/detail/new-mail.png" alt="">
              <span>{{customer.mail|formatEmpty}}</span>
            </div>
          </div>
        </div>
      </div>
      <img src="images/customer/detail/gender-male-beauty.png" alt="" class="gender-image" v-if="customer.gender==1">
      <img src="images/customer/detail/gender-female-beauty.png" alt="" class="gender-image" v-if="customer.gender==2">
      <div class="modify-customer" @click="showCustomerInfoDialog">
        <img src="images/customer/detail/new-modify.png" alt="">
      </div>
    </div>

    <transition enter-active-class="animate__fadeIn animate__faster"
                leave-active-class="animate__fadeOut animate__faster"
    >
      <EditCustomerInfoDialog
        :customer="customer"
        :customerInfoDialogFlag.sync="customerInfoDialogFlag"
        class="animate__animated"
        style="z-index: 4000"
        v-if="customerInfoDialogFlag"
        @saveCustomerHeader="saveCustomerHeader"
      >
      </EditCustomerInfoDialog>
    </transition>
  </div>
</template>

<script>
import EditCustomerInfoDialog from "components/customer/assignment/EditCustomerInfoDialog";
export default {
  name: "CustomerDetailHead",
  components:{EditCustomerInfoDialog},
  data() {
    return {
      customerInfoDialogFlag: false
    }
  },
  filters: {
    formatEmpty: function (str) {
      if(!str){
        return '-'
      }
      return str
    },
  },
  props: {
    customer: {
      type: Object,
      require: true
    },
  },
  methods: {
    showCustomerInfoDialog() {
      this.customerInfoDialogFlag = true
    },
    saveCustomerHeader() {
      this.customerInfoDialogFlag = false
      this.$emit("saveCustomer")
    }
  }
}
</script>

<style scoped lang="scss">
#customer-detail-content {
  background-color: #fff;
  height: 100%;
  .detail-head {
    height:11rem;
    width: 100%;
    background-image: url("../../../assets/images/customer/detail/customer-detail-background-02.png");
    background-repeat: no-repeat;
    background-size: 100% 100%;
    display: flex;
    color: #fff;
    position: relative;
    .avatar {
      width: 16%;
      display: flex;
      justify-content: center;
      align-items: flex-start;
      padding-top: 1rem;
      padding-left: .4rem;
      .avatar-image {
        position: relative;
        width: 2.8rem;
        height: 2.8rem;
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
      color:#fff;
      padding-top: 1rem;
      .line1 {
        height: 2rem;
        width: 100%;
        display: flex;
        align-items: center;
        >span {
          font-size: 1.3rem;
          font-weight: 600;
          margin-right: .6rem;
        }
        >div {
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
            top:0;
          }
          span {
            color:#23262D;
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
        div{
          span:nth-child(1){
            margin-right: .2rem;
          }
        }
        div:nth-child(1){
          width: 9rem;
        }
        div:nth-child(2){
          width: 5rem;
        }
        div:nth-child(3){
          width: 8rem;
        }
      }
      .line3 {
        width: 100%;
        background-color: #272932;
        border: .05rem solid #454650;
        border-radius: .3rem;
        padding: .5rem .8rem;
        height: 4rem;
        margin-top: 1rem;
        .line3-line1,.line3-line2 {
          height: 1.5rem;
          display: flex;
          img {
            width: .8rem;
            height: .8rem;
            margin-right: .4rem;
          }
          div {
            display: flex;
            justify-content: flex-start;
            align-items: center;
            height: 1.4rem;
            font-size: .7rem;
          }
          div:nth-child(1){
            width: 4rem;
          }
          div:nth-child(2){
            width: 12rem;
          }
          div:nth-child(3){
            width: 8rem;
          }
        }
      }
    }
    .gender-image {
      position: absolute;
      right: .6rem;
      bottom: .7rem;
      width: 8.4rem;
      height: 7.4rem;
    }
    .modify-customer {
      width: 3rem;
      height: 3rem;
      display: flex;
      justify-content: center;
      align-items: center;
      position: fixed;
      right: .5rem;
      top:0;
      z-index: 3000;
      img {
        width: 2rem;
        height: 2rem;
      }
    }
  }
}
</style>
