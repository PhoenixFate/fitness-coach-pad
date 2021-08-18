<template>
  <div id="alert-message-content">
    <q-dialog v-model="alertMessageFlag">
      <q-card>
        <q-card-section>
          <div class="text-h5">温馨提示</div>
        </q-card-section>
        <q-card-section class="q-pt-none">
          {{ message }}
        </q-card-section>
        <q-card-actions align="right">
          <q-btn outline label="确认" color="light-blue-6" @click="confirm" style="width: 6rem" />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </div>
</template>
<script>
export default {
  name: 'AlertMessage',
  data() {
    return {};
  },
  props: {
    alertMessageFlag: Boolean,
    message: String
  },
  methods: {
    hiddenDialog() {
      this.$emit('update:alertMessageFlag', false);
    },
    confirm() {
      this.$emit('update:alertMessageFlag', false);
    }
  }
};
</script>

<style scoped lang="scss">
@import 'q-dialog.scss';

#alert-message-content {
  //width: 100%;
  //height: 100%;
  //position: relative;
  //z-index: 1;
}
</style>
