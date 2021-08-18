<template>
  <div id="customer-list-content">
    <div class="search">
      <input type="text" placeholder="姓名、客户编号、手机号等" v-model="searchValue" />
      <div class="search-button" @click="onSearch">
        <img src="images/customer/list/search.png" alt="" />
      </div>
    </div>
    <div class="more-search">
      <div class="search-item" :class="isVip === 1 ? 'search-selected' : ''" @click="selectType(1)">正式会员</div>
      <div class="search-item" :class="isVip === 0 ? 'search-selected' : ''" @click="selectType(0)">潜在客户</div>
      <div class="search-item" :class="gender === 1 ? 'search-selected' : ''" @click="selectGender(1)">男</div>
      <div class="search-item" :class="gender === 2 ? 'search-selected' : ''" @click="selectGender(2)">女</div>
    </div>
    <div v-if="customerAnchorList.length > 0">
      <CustomerListBody :customerAnchorList="customerAnchorList"></CustomerListBody>
    </div>
    <div v-if="customerAnchorList.length === 0" class="customer-empty">
      <img src="images/customer/list/empty.png" alt="" />
      <h5>未查询到客户列表</h5>
    </div>
    <transition
      enter-active-class="animate__fadeIn animate__faster"
      leave-active-class="animate__fadeOut animate__faster"
    >
      <LoadingData
        :loadingDataFlag.sync="loadingDataFlag"
        class="animate__animated"
        style="z-index: 6000"
        v-if="loadingDataFlag"
      ></LoadingData>
    </transition>
  </div>
</template>
<script>
import CustomerListBody from 'components/customer/list/CustomerListBody';
import { apiCustomerList } from 'src/api/customer';
import { indexListData } from 'src/const/customerList/indexListData';
import LoadingData from 'components/common/LoadingData';

export default {
  name: 'Index',
  components: { CustomerListBody, LoadingData },
  data() {
    return {
      customerAnchorList: [],
      indexList: indexListData,
      searchValue: '',
      isVip: -1,
      gender: -1,
      loadingDataFlag: true
    };
  },
  props: {
    coachId: String
  },
  created() {
    this.loadData();
  },
  methods: {
    loadData() {
      this.customerAnchorList = [];
      apiCustomerList({
        limit: 1000,
        searchValue: this.searchValue,
        isVip: this.isVip,
        gender: this.gender,
        coachId: this.coachId
      }).then(res => {
        setTimeout(() => {
          this.loadingDataFlag = false;
        }, 400);
        this.indexList.forEach(item => {
          let customerAnchor = {
            anchorIndex: item,
            customers: []
          };
          res.data.data.list.forEach(customer => {
            if (item === customer.nameIndex) {
              customerAnchor.customers.push(customer);
            }
          });
          this.customerAnchorList.push(customerAnchor);
        });
        let tempList = [];
        this.customerAnchorList.forEach(item => {
          if (item.customers.length > 0) {
            tempList.push(item);
          }
        });
        this.customerAnchorList = tempList;
        console.log(this.customerAnchorList);
      });
    },
    onSearch() {
      this.loadData();
    },
    selectType(type) {
      if (this.isVip === type) {
        this.isVip = -1;
      } else {
        this.isVip = type;
      }
      this.loadData();
    },
    selectGender(gender) {
      if (this.gender === gender) {
        this.gender = -1;
      } else {
        this.gender = gender;
      }
      this.loadData();
    }
  }
};
</script>

<style lang="scss">
#customer-list-content {
  position: relative;
  padding: 1.5rem;

  .search {
    height: 2.4rem;
    border-radius: 0.3rem;
    position: relative;
    overflow: hidden;
    border: 0.05rem solid #eaebee;

    input {
      width: 100%;
      background-color: #f6f7fa;
      height: 2.4rem;
      outline: none;
      border: none;
      padding-left: 3rem;
      z-index: 1;
      font-size: 0.8rem;
    }

    ::-webkit-input-placeholder {
      color: #abacb4;
    }

    .search-button {
      width: 2.4rem;
      height: 2.4rem;
      position: absolute;
      left: 0.3rem;
      top: 0;
      display: flex;
      justify-content: center;
      align-items: center;

      img {
        width: 2.2rem;
        height: 2.2rem;
      }

      z-index: 10;
    }
  }

  .more-search {
    height: 5rem;
    display: flex;
    justify-content: space-between;
    align-items: center;

    .search-item {
      width: 8.6rem;
      height: 2.4rem;
      color: #23262d;
      border-radius: 0.4rem;
      margin-right: 1rem;
      float: left;
      font-size: 0.8rem;
      display: flex;
      justify-content: center;
      align-items: center;
      background-image: url('../../../assets/images/customer/list/item-unselected.png');
      background-size: 100% 100%;
    }

    .search-selected {
      color: #fff;
      background-image: url('../../../assets/images/customer/list/item-selected.png');
      background-size: 100% 100%;
    }
  }

  .customer-empty {
    width: 80vw;
    height: 80vh;
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
    position: absolute;
    left: 10vw;
    top: 5vh;

    img {
      width: 15rem;
      height: 20rem;
    }

    h5 {
      color: #999;
      font-size: 1rem;
      margin-top: 1rem;
    }
  }
}
</style>
