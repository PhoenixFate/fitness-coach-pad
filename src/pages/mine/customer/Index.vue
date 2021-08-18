<template>
  <div>
    <CustomerList :coach-id="coach.coachId+''"></CustomerList>
  </div>
</template>

<script>
import CustomerList from "components/customer/list/CustomerList";

export default {
  name: "Index",
  components: {CustomerList},
  data() {
    return {
      coach: {}
    }
  },
  created() {
    this.coach = JSON.parse(localStorage.getItem("coach"))
  },
  methods: {}
}
</script>

<style scoped lang="scss">
</style>
