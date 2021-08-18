<template>
  <div id="assignment-header-content">
    <div class="customer-info">
      <div class="info">
        <div class="avatar">
          <img :src="customer.avatar" alt="" v-if="customer.avatar">
          <img src="images/home/male-default.png" alt=""
               v-if="!customer.avatar && customer.gender==1">
          <img src="images/home/female-default.png" alt=""
               v-if="!customer.avatar && customer.gender==2">
        </div>
        <div class="detail-info1">
          <h5>{{ customer.name }}</h5>
          <h6>NO.{{ customer.customerNumber }}</h6>
        </div>
        <div class="divider"></div>
        <div class="detail-info2">
          <div>
            <img src="images/customer/detail/new-gender-male.png" alt="" v-if="customer.gender==1">
            <img src="images/customer/detail/new-gender-female.png" alt="" v-if="customer.gender==2">
            <span>{{customer.age|formatEmpty}}</span>
          </div>
          <div>
            <img src="images/customer/detail/new-mobile.png" alt="">
            <span>{{customer.mobile|formatEmpty}}</span>
          </div>
          <div>
            <img src="images/customer/detail/new-city.png" alt="">
            <span>{{customer.city|formatEmpty}}</span>
          </div>
        </div>
        <div class="detail-info3">
          <div>
            <img src="images/customer/detail/new-birthday.png" alt="">
            <span>{{customer.birthday|formatEmpty}}</span>
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
        <div class="gender-image">
          <img src="images/customer/detail/gender-male-beauty.png" alt="" v-if="customer.gender==1">
          <img src="images/customer/detail/gender-female-beauty.png" alt="" v-if="customer.gender==2">
        </div>
      </div>
      <div class="edit-button" @click="showCustomerInfoDialog">
        <img src="images/classAssignment/new-modify.png" alt="">
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
  name: "AssignmentHeader",
  components:{EditCustomerInfoDialog},
  data(){
    return {
      customerInfoDialogFlag:false,
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
  props:{
    customer:{
      type:Object,
      require:true,
    },
    saveCustomerInfoFlag:Boolean,
  },
  methods:{
    showCustomerInfoDialog(){
      this.customerInfoDialogFlag=true
    },
    saveCustomerHeader(){
      this.customerInfoDialogFlag=false
      console.log("header save customer")
      this.$emit("update:saveCustomerInfoFlag",true)
      this.$emit("saveCustomer")
    }
  }
}
</script>

<style scoped lang="scss">
#assignment-header-content{
  background-color: #eeeff3;
  height: 7.7rem;
  display: flex;
  justify-content: center;
  align-items: center;
  .customer-info {
    height: 6rem;
    width: 93%;
    background: linear-gradient(to right, #1f232a 0%, #33353e 100%);
    border-radius: .3rem;
    margin-top: -.8rem;
    color:#fff;
    .info {
      width: 100%;
      display: flex;
      height: 6rem;
      justify-content: flex-start;
      align-items: center;
      color: #fff;
      .avatar {
        width: 15%;
        display: flex;
        justify-content: center;
        align-items: center;
        padding-left: .4rem;
        >img {
          width: 3.2rem;
          height: 3.2rem;
          border-radius: 50%;
        }
      }
      .detail-info1 {
        width: 20%;
        display: flex;
        flex-direction: column;
        height: 3.2rem;
        justify-content: space-between;
        h5 {
          font-family: PingFangSC-Semibold, PingFang SC;
          font-weight: 600;
          color: #FFFFFF;
          line-height: 26px;
          font-size: 1.3rem;
        }
        h6 {
          font-size: 1.4rem;
          font-family: Staatliches-Regular, Staatliches;
          font-weight: 400;
          color: #FFAD2A;
          line-height: 28px;
        }
      }
      .divider {
        width: .05rem;
        height: 3.2rem;
        background: #FFFFFF;
        opacity: 0.1;
      }
      .detail-info2,.detail-info3 {
        display: flex;
        flex-direction: column;
        text-align: center;
        align-items: flex-start;
        div {
          display: flex;
          align-items: center;
          font-size: .8rem;
          color: #fff;
          justify-content: flex-start;
          img {
            width: .8rem;
            height: .8rem;
            margin-right: .3rem;
          }
          span {
            font-size: .7rem;
          }
        }
        div:nth-child(2){
          margin: .36rem 0;
        }
      }
      .detail-info2 {
        width: 21.4%;
        display: flex;
        flex-direction: column;
        text-align: center;
        align-items: flex-start;
        font-size: 1.2rem;
        padding-left: 1rem;
      }
      .detail-info3 {
        width: 26%;
      }
      .gender-image {
        flex: 1;
        height: 100%;
        position: relative;
        img {
          width: 6rem;
          height: 6rem;
          position: absolute;
          right: -.8rem;
          bottom: -1.2rem;
          z-index: 500;
        }
      }
    }
    .edit-button {
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
