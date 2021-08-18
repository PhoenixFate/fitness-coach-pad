<template>
  <div id="customer-arrangement-content" @click="toDetail">
    <div class="customer-info">
      <div class="avatar">
        <img :src="customerArrangement.customer.avatar" alt="" v-if="customerArrangement.customer && customerArrangement.customer.avatar" />
        <img
          src="images/home/male-default.png"
          alt=""
          v-if="!customerArrangement.customer.avatar && customerArrangement.customer.gender === 1"
        />
        <img
          src="images/home/female-default.png"
          alt=""
          v-if="!customerArrangement.customer.avatar && customerArrangement.customer.gender === 2"
        />
        <img src="images/home/crown.png" alt="" class="crown" v-if="customerArrangement.customer.isVip === 1" />
      </div>
      <div class="detail-info">
        <div class="name">
          {{ customerArrangement.customer.name }}
        </div>
        <div class="detail">
          <img src="images/home/gender-male.png" alt="" v-if="customerArrangement.customer.gender === 1" />
          <img src="images/home/gender-female.png" alt="" v-if="customerArrangement.customer.gender === 2" />
          <span>{{ customerArrangement.customer.age }}</span>
          <div></div>
          <img src="images/home/new-phone.png" alt="" />
          <span>{{ customerArrangement.customer.mobile }}</span>
        </div>
      </div>
    </div>
    <div class="classInfo">
      <div class="name">
        <h5>{{ customerArrangement.classInfo.className }}</h5>
        <div>
          <img src="images/home/time.png" alt="" />
          <span>{{ customerArrangement.customerPlan.startTime.substr(0, 5) }}</span>
          <span>~</span>
          <span>{{ customerArrangement.customerPlan.endTime.substr(0, 5) }}</span>
        </div>
      </div>
      <div class="classInfo-status">
        <div class="class-finished" v-if="customerArrangement.status === 1">
          已完成
        </div>
        <div class="class-unfinished" v-if="customerArrangement.status === 0">
          待完成
        </div>
      </div>
    </div>
    <div class="status">
      <img src="images/home/class-finished-beauty.png" alt="" v-if="customerArrangement.status === 1" />
      <img src="images/home/class-unfinished-beauty.png" alt="" v-if="customerArrangement.status === 0" />
    </div>
    <q-dialog v-model="scan">
      <q-card>
        <q-card-section>
          <div class="text-h6">扫描客户二维码</div>
        </q-card-section>

        <q-card-section class="q-pt-none">
          <qrcode-stream @decode="onDecode" />
        </q-card-section>

        <q-card-actions align="right">
          <q-btn flat label="取消" color="primary" v-close-popup />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </div>
</template>

<script>
import { QrcodeStream } from 'vue-qrcode-reader';
import { vipCustomerCheckin } from '../../api/customerPlanDay/index';
export default {
  name: 'CustomerArrangement',
  data() {
    return {
      scan: false
    };
  },
  props: {
    customerArrangement: Object
  },
  created() {},
  components: {
    QrcodeStream
  },
  methods: {
    onDecode(data) {
      console.log('scanned data:', data);
      let scannedData;
      try {
        scannedData = JSON.parse(data);
      } catch (error) {
        this.$q.notify({
          type: 'negative',
          message: '未能识别该有效嘛'
        });
        return;
      }
      console.log('current arrangement:', this.customerArrangement);
      let arrangementCustomer = this.customerArrangement.customer;
      if (arrangementCustomer.customerId != scannedData.customerId) {
        this.$q.notify({
          type: 'negative',
          message: '识别到的用户不正确'
        });
        return;
      }
      this.$q.notify({ type: 'positive', message: '扫码成功！' });
      this.scan = false;
      vipCustomerCheckin({
        customerId: scannedData.customerId,
        classId: this.customerArrangement.classId,
        trainerId: this.customerArrangement.coachId,
        checkinTime: Date.now()
      }).then(() => {
        this.$router.push({
          path: '/main/classAssignment/detail',
          query: {
            customerPlanDayId: this.customerArrangement.customerPlanDayId,
            customerPlanId: this.customerArrangement.customerPlanId
          }
        });
      });
    },
    toDetail() {
      if (this.customerArrangement.status === 0) {
        this.scan = true;
      } else {
        this.$router.push({
          path: '/main/classAssignment/summary',
          query: {
            customerPlanDayId: this.customerArrangement.customerPlanDayId,
            customerPlanId: this.customerArrangement.customerPlanId
          }
        });
      }
    }
  }
};
</script>

<style scoped lang="scss">
#customer-arrangement-content {
  width: 100%;
  height: 4.4rem;
  background-color: #2e3038;
  padding: 0.4rem;
  border-radius: 0.3rem;
  display: flex;

  .customer-info {
    width: 13.4rem;
    height: 100%;
    background-image: url('../../assets/images/home/info.png');
    background-size: 100% 100%;
    display: flex;
    align-content: flex-start;
    align-items: center;
    padding-left: 0.1rem;

    .avatar {
      width: 3.6rem;
      height: 3.6rem;
      display: flex;
      justify-content: center;
      align-items: center;
      position: relative;

      > img {
        width: 80%;
        height: 80%;
        border-radius: 50%;
        overflow: hidden;
      }

      .crown {
        position: absolute;
        width: 1.8rem;
        height: 1.6rem;
        left: -0.1rem;
        top: -0.1rem;
      }
    }

    .detail-info {
      flex: 1;
      height: 100%;
      padding-left: 0.3rem;
      display: flex;
      flex-direction: column;
      padding-top: 0.3rem;

      .name {
        height: 1.3rem;
        width: 100%;
        font-size: 0.9rem;
        font-weight: bold;
        display: flex;
        justify-content: flex-start;
        align-items: center;
      }

      .detail {
        height: 1.8rem;
        width: 100%;
        display: flex;
        justify-content: flex-start;
        align-items: center;

        img {
          width: 0.8rem;
          height: 0.8rem;
          margin-right: 0.2rem;
        }

        span {
          color: #a9aab2;
          font-size: 0.7rem;
        }

        div {
          width: 0.1rem;
          height: 1rem;
          margin: 0 0.5rem;
          background-color: #ebecef;
        }
      }
    }
  }

  .classInfo {
    width: 13rem;
    height: 100%;
    padding-left: 0.6rem;
    display: flex;

    .name {
      width: 80%;
      padding-top: 0.2rem;

      h5 {
        font-size: 1.1rem;
        color: #ffad2a;
        font-weight: bold;
      }

      div {
        display: flex;
        justify-content: flex-start;
        align-items: center;

        img {
          width: 0.8rem;
          height: 0.8rem;
          margin-right: 0.3rem;
        }

        span {
          color: #fff;
          font-size: 0.7rem;
        }

        span:nth-child(3) {
          margin: 0 0.4rem;
        }
      }
    }

    .classInfo-status {
      width: 20%;
      position: relative;

      .class-finished,
      .class-unfinished {
        position: absolute;
        top: 0.6rem;
        width: 100%;
        border-radius: 0.26rem;
        height: 1.1rem;
        left: 0.1rem;
        display: flex;
        justify-content: center;
        align-items: center;
        font-size: 0.5rem;
      }

      .class-finished {
        border: 0.05rem solid #ffad2a;
        color: #ffad2a;
      }

      .class-unfinished {
        border: 0.05rem solid #f8f8f8;
        color: #f8f8f8;
      }
    }
  }

  .status {
    width: 6.6rem;
    height: 100%;
    position: relative;

    img {
      position: absolute;
      left: -0.4rem;
      top: -1rem;
      width: 9.3rem;
      height: 5rem;
    }
  }
}
</style>
