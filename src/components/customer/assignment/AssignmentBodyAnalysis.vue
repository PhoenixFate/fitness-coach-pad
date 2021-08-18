<template>
  <div id="assignment-body-analysis-content">
    <BodyAnalysisLeft :customer="customer"></BodyAnalysisLeft>
    <BodyAnalysisRight :customer="customer"></BodyAnalysisRight>
  </div>
</template>

<script>
import BodyAnalysisLeft from "components/customer/assignment/bodyAnalysis/BodyAnalysisLeft";
import BodyAnalysisRight from "components/customer/assignment/bodyAnalysis/BodyAnalysisRight";
export default {
  name: "AssignmentBodyAnalysis",
  components:{
    BodyAnalysisLeft,
    BodyAnalysisRight
  },
  data(){
    return {
    }
  },
  props:{
    customer:Object,
  }
}
</script>

<style scoped lang="scss">
#assignment-body-analysis-content {
  width: 100%;
  height: calc(28*3*1.3vw + 3rem);
  padding: .5rem 1.5rem;
  display: flex;
  justify-content: space-between;
}
</style>
