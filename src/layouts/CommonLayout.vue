<template>
  <div id="common-content">
    <q-layout view="lHh LpR lff">
      <q-header :class="headerClass">
        <q-toolbar>
          <q-btn
            flat
            round
            icon="img:images/menu/top-back.png"
            aria-label="返回"
            label="返回"
            style="font-size: .9rem;font-weight: normal"
            @click="goBack"
            v-if="returnArrowBlack"
          />
          <q-btn
            flat
            round
            icon="img:images/menu/top-back-white.png"
            aria-label="返回"
            label="返回"
            style="font-size: .9rem;font-weight: normal"
            @click="goBack"
            v-if="!returnArrowBlack"
          />
          <q-toolbar-title style="font-size: .9rem;font-weight: bold">
            {{ title }}
          </q-toolbar-title>
        </q-toolbar>
      </q-header>
      <q-page-container style="margin-top: -1px">
        <router-view/>
      </q-page-container>
    </q-layout>
    <transition enter-active-class="animate__fadeIn animate__faster"
                leave-active-class="animate__fadeOut animate__faster"
    >
      <AlertMessageBetter
        :alert-message-better-flag.sync="alertMessageBetterFlag"
        :alert-message="alertMessageBetter"
        @sureLeave="sureLeave"
        v-show="alertMessageBetterFlag"
        class="animate__animated"
        style="z-index: 3000"
      >
      </AlertMessageBetter>
    </transition>
  </div>
</template>

<script>
import AlertMessageBetter from "components/common/AlertMessageBetter";

export default {
  name: "CommonLayout",
  components: {AlertMessageBetter},
  data() {
    return {
      alertMessageBetterFlag: false,
      alertMessageBetter: "",
      returnArrowBlack: true,
      headerClass: ''
    }
  },
  created() {
    this.computeHeaderClass()
  },
  computed: {
    title() {
      return this.$route.meta.title
    }
  },
  watch: {
    '$route.name': function (newVal, oldVal) {
      this.computeHeaderClass()
    }
  },
  methods: {
    computeHeaderClass() {
      if (this.$route.name === "customerDetail") {
        this.headerClass = "customer-detail"
        this.returnArrowBlack = false
      } else if (this.$route.name === 'customerBodyTest' || this.$route.name === 'customerBodyStatus' || this.$route.name === 'customerDietPlan' || this.$route.name === 'customerTrainingGoal' || this.$route.name === 'customerPlan') {
        this.headerClass = 'body-test'
        this.returnArrowBlack = false
      } else if (this.$route.name === "customerForm") {
        this.returnArrowBlack = false
        this.headerClass = "customer-form"
      } else if (this.$route.name === "customerAssignment") {
        this.headerClass = "customer-assignment"
      } else if (this.$route.name === "info") {
        this.headerClass = "coach-userinfo"
      } else if (this.$route.name === "about") {
        this.headerClass = "about"
      } else if (this.$route.name === "action") {
        this.headerClass = "action-management"
      } else if (this.$route.name === "equipment") {
        this.headerClass = "fitness-equipment"
      } else if (this.$route.name === "classManagement") {
        this.headerClass = "class-management"
      } else if (this.$route.name === "planTemplate") {
        this.headerClass = "plan-template"
      } else if (this.$route.name === "classAssignmentDetail") {
        this.headerClass = "assignment-detail"
        this.returnArrowBlack = false
      } else if(this.$route.name === "classAssignmentSummary"){
        this.headerClass = "assignment-summary"
        this.returnArrowBlack = false
      } else if (this.$route.name === "diet") {
        this.headerClass = "food-management"
      } else {
        this.headerClass = "common-background"
      }
    },
    goBack() {
      if (this.$route.name === "classAssignmentDetail") {
        //返回添加提示按钮
        this.alertMessageBetter = "离开当前页面可能会导致数据丢失，请先确认是否已经暂存数据!"
        this.alertMessageBetterFlag = true
        return
      }
      this.$router.go(-1);
    },
    sureLeave() {
      this.$router.go(-1);
      this.alertMessageBetterFlag = false
    }
  }
}
</script>

<style lang="scss">
#common-content {
  .q-toolbar__title {
    text-align: center;
    padding-right: 78px;
  }

  .about {
    background-color: #fff;
    color: #000;
  }

  .customer-detail {
    background-image: url("../assets/images/customer/detail/customer-detail-background-01.png");
    background-repeat: no-repeat;
    background-size: 100% 100%;
  }

  .customer-form {
    background-color: #ffad2a;
  }

  .customer-assignment {
    background-color: #eeeff3;
    color:#21252c;
  }

  .coach-userinfo {
    background-image: url("../assets/images/mine/info/userinfo-background-01.png");
    background-repeat: no-repeat;
    background-size: 100% 100%;
  }

  .action-management {
    background-image: url("../assets/images/action/action-background-01.png");
    background-repeat: no-repeat;
    background-size: 100% 100%;
    color: #2dab5b;
  }

  .fitness-equipment {
    background-image: url("../assets/images/equipment/equipment-background-01.png");
    background-repeat: no-repeat;
    background-size: 100% 100%;
    color: #2d2c2c;

    .q-btn__wrapper {
      color: #2d2c2c;
    }
  }

  .class-management {
    background-image: url("../assets/images/classManagement/class-management-background-01.png");
    background-repeat: no-repeat;
    background-size: 100% 100%;
    color: #983d50;
  }

  .plan-template {
    background-image: url("../assets/images/template/template-header-01.png");
    background-repeat: no-repeat;
    background-size: 100% 100%;
    color: #151414;
  }

  .assignment-detail {
    color: #fff;
    background-color: transparent;
  }

  .assignment-summary {
    color: #fff;
    background-image: url("../assets/images/classAssignment/detail-header-background-01.png");
    background-repeat: no-repeat;
    background-size: 100% 100%;
  }

  .food-management {
    background-image: url("../assets/images/diet/header-background-01.png");
    background-repeat: no-repeat;
    background-size: 100% 100%;
    color: #c18011;
  }

  .body-test {
    background-image: url("../assets/images/customer/bodyTest/body-test-background1.png");
    background-repeat: no-repeat;
    background-size: 100% 100%;
    color: #fff;
  }

  .common-background {
    background-color: #fff;
    color: #22262d;
  }

  .q-layout {
    height: 100%;
  }

  .q-page-container {
    height: 100%;
  }

}
</style>
