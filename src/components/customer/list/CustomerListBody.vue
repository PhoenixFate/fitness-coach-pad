<template>
  <div id="component-customer-list-content">
    <van-index-bar :index-list="indexList" v-if="customerAnchorList.length>0">
      <div v-for="customerAnchorItem in customerAnchorList" :key="customerAnchorItem.anchorIndex" >
        <van-index-anchor :index="customerAnchorItem.anchorIndex" />
        <CustomerListItem class="customer-item" v-for="(customer,customerIndex) in customerAnchorItem.customers" :key="customerIndex" :customer="customer" style="width: 98%"></CustomerListItem>
      </div>
    </van-index-bar>
  </div>
</template>

<script>
import "./vant-index-bar.scss"
import CustomerListItem from "components/customer/list/CustomerListItem";
import {indexListData} from "src/const/customerList/indexListData";

export default {
  name: "CustomerListBody",
  components:{CustomerListItem},
  data(){
    return {
      searchValue:"",
      indexList: indexListData,
    }
  },
  methods:{

  },
  props:{
    customerAnchorList:Array,
  }
}
</script>

<style lang="scss">
#component-customer-list-content{
  .customer-item {
    margin: .5rem auto;
  }
}
</style>
