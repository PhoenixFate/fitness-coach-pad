<template>
  <div id="alert-message-content">
    <q-dialog v-model="messageConfirmFlag">
      <q-card>
        <q-card-section>
          <div class="text-h5">确认信息</div>
        </q-card-section>
        <q-card-section class="q-pt-none">
          {{messageConfirm}}
        </q-card-section>
        <q-card-actions align="right">
          <q-btn outline label="取消" color="grey-5" @click="cancel" style="width: 6rem"/>
          <q-btn outline label="确认" color="light-blue-6" @click="confirm" style="width: 6rem"/>
        </q-card-actions>
      </q-card>
    </q-dialog>
  </div>
</template>
<script>
import "./q-dialog.scss"
export default {
  name: "MessageConfirmDialog",
  data(){
    return {

    }
  },
  props:{
    messageConfirmFlag:Boolean,
    messageConfirm:String,
  },
  methods:{
    cancel(){
      this.$emit("update:messageConfirmFlag",false)
    },
    confirm(){
      this.$emit("update:messageConfirmFlag",false)
      this.$emit("messageConfirmMethod")
    }
  }
}
</script>

<style scoped lang="scss">
#alert-message-content {
  //width: 100%;
  //height: 100%;
  //position: relative;
  //z-index: 1;
}
</style>
