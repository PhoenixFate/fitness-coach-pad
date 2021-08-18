<template>
  <div id="set-detail-content">
    <BackgroundBlack @click.native="hiddenDialog"></BackgroundBlack>
    <div class="set-detail-dialog">
      <div class="action-set-type" :class="actionSetType[actionSet.actionSetType].activeClass">
        {{ actionSetType[actionSet.actionSetType].name }}
      </div>
      <div class="action" v-for="(oneSet,setIndex) in actionSet.oneSets" :key="setIndex">
        <div v-if="oneSet.status===3">
          <h5>第{{ setIndex + 1 }}组</h5>
          <div class="action-content">
            <div class="action-title">
              <div>动作名称</div>
              <div>预计训练</div>
              <div>实际训练</div>
              <div>推荐重量</div>
              <div>实际重量</div>
              <div>组后休息</div>
            </div>
            <div class="action-one-set" v-for="(setDetail,detailIndex) in oneSet.oneSetDetails"
                 :key="detailIndex">
              <div class="action-one-set-content" v-if="oneSet.status===3">
                <div>{{ actionSet.actions[detailIndex].actionName }}</div>
                <div v-if="actionSet.actions[detailIndex].unit==='SET'">{{ setDetail.standardCount }}次/组</div>
                <div v-if="actionSet.actions[detailIndex].unit==='SET'">{{ setDetail.realCount }}次/组</div>
                <div v-if="actionSet.actions[detailIndex].unit==='SECOND'">{{ setDetail.standardTime }}秒</div>
                <div v-if="actionSet.actions[detailIndex].unit==='SECOND'">{{ setDetail.realTime }}秒</div>
                <div v-if="actionSet.actions[detailIndex].containWeight">{{
                    setDetail.standardWeight | weightEmptyFilter
                  }}
                </div>
                <div v-if="actionSet.actions[detailIndex].containWeight">{{
                    setDetail.realWeight | weightEmptyFilter
                  }}
                </div>
                <div v-if="!actionSet.actions[detailIndex].containWeight">-</div>
                <div v-if="!actionSet.actions[detailIndex].containWeight">-</div>
                <div>{{ oneSet.realRestTime }}秒</div>
              </div>
            </div>
            <div class="one-set-empty"
                 v-if="!actionSet.oneSets || actionSet.oneSets.length===0">
              <img src="images/classAssignment/one-set-empty.png" alt="">
              <p>暂无每组详情</p>
            </div>
          </div>
        </div>
      </div>
    </div>

  </div>
</template>

<script>
import BackgroundBlack from "components/common/BackgroundBlack";
import {ActionSetType} from "src/const/classManagement/actionSetType";

export default {
  name: "SetDetail",
  components: {BackgroundBlack},
  data() {
    return {
      actionSetType: ActionSetType,
    }
  },
  filters: {
    weightEmptyFilter: function (value) {
      if (!value) {
        return "-"
      } else {
        return value + "KG"
      }
    }
  },
  created() {
    console.log(this.actionSet)
  },
  props: {
    setDetailFlag: Boolean,
    actionSet: Object
  },
  methods: {
    hiddenDialog() {
      this.$emit("update:setDetailFlag", false)
    },
  }
}
</script>

<style scoped lang="scss">
#set-detail-content {
  z-index: 20;
  position: relative;

  .set-detail-dialog {
    position: fixed;
    width: 80%;
    height: 28rem;
    top: 50%;
    margin-top: -14rem;
    left: 10%;
    background-color: #fff;
    border-radius: .9rem;
    padding: 3rem 1rem .5rem 1rem;
    z-index: 2010;
    overflow: scroll;

    .action-set-type {
      color: #fff;
      position: absolute;
      left: 0;
      top: 0;
      height: 2rem;
      width: 6rem;
      line-height: 2rem;
      text-align: center;
      font-size: .9rem;
      font-weight: bold;
    }

    .type-common {
      background-color: #eca656;
      border: 1px solid #eca656;
    }

    .type-super {
      background-color: #f33a3a;
      border: 1px solid #f33a3a;
    }

    .type-reduce {
      background-color: #2dab5b;
      border: 1px solid #2dab5b;
    }

    .type-common2 {
      background-color: #f8e2c8;
      box-shadow: 1px 1px .5rem #eca656;
    }

    .type-super2 {
      background-color: #fcd2d2;
      box-shadow: 1px 1px .5rem #f33a3a;
    }

    .type-reduce2 {
      background-color: #cfffe2;
      box-shadow: 1px 1px .5rem #2dab5b;
    }

    .action {
      height: auto;
      width: 100%;
      margin: 0 auto 2rem;

      h5 {
        text-align: center;
        font-size: 1.1rem;
        font-weight: bold;
        margin-bottom: .5rem;
      }

      .action-content {
        height: auto;
        border: 1px solid #6976e5;

        .action-title {
          height: 2rem;
          display: flex;
          background-color: #6976e5;
          font-size: .7rem;

          div {
            line-height: 2rem;
            text-align: center;
            color: #fff;
            width: 20%;
          }
        }

        .action-one-set {
          height: auto;

          .action-one-set-content {
            height: 2rem;
            display: flex;

            div {
              line-height: 2rem;
              text-align: center;
              width: 20%;
            }
          }
        }

        .one-set-empty {
          height: 16rem;
          display: flex;
          justify-content: center;
          align-items: center;
          flex-direction: column;

          img {
            width: 11rem;
            height: 11rem;
          }

          p {
            color: #999;
            margin: .3rem 0 0 0;
            font-size: .8rem;
          }
        }

      }

    }

  }
}
</style>
