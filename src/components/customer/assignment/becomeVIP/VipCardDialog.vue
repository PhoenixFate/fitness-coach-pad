<template>
  <div id="vip-card-list-dialog-content">
    <BackgroundBlack @click.native="hiddenDialog"></BackgroundBlack>
    <div class="list-content">
      <div class="list-content-scroll">
        <div class="vip-card"
             :class="(currentIndex===cardIndex)?(vipCard.className+'-selected'):''"
             v-for="(vipCard,cardIndex) in vipCardList" :key="cardIndex"
             @click="selectCard(cardIndex)">
          <div class="vip-card-content" :class="vipCard.className">
            <h4>{{vipCard.vipCardName}}</h4>
            <h6><strong>{{vipCard.addVipDays}}</strong>天</h6>
            <div class="vip-content">
              <strong>V</strong>
              <strong>I</strong>
              <strong>P</strong>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import BackgroundBlack from "components/common/BackgroundBlack";
export default {
  name: "VipCardDialog",
  components: {BackgroundBlack},
  data() {
    return {
      currentIndex: -1,
    }
  },
  created() {
    if(this.vipCardList && this.vipCardList.length>0){
      this.vipCardList.forEach((vipCard)=>{
        if(vipCard.vipCardType==="WEEK_CARD"){
          vipCard.className="vip-card-week"
        }else if(vipCard.vipCardType==="MONTH_CARD"){
          vipCard.className="vip-card-month"
        }else if(vipCard.vipCardType==="SEASON_CARD"){
          vipCard.className="vip-card-season"
        }else if(vipCard.vipCardType==="HALF_YEAR_CARD"){
            vipCard.className="vip-card-half-year"
        }else if(vipCard.vipCardType==="THREE_SEASON_CARD"){
          vipCard.className="vip-card-three-season"
        }else if(vipCard.vipCardType==="YEAR_CARD"){
          vipCard.className="vip-card-year"
        }
      })
    }
    if(this.customer.vipCard && this.vipCardList){
      this.vipCardList.forEach((vipCard,cardIndex)=>{
        if(vipCard.vipCardType===this.customer.vipCard.vipCardType){
          this.currentIndex=cardIndex
        }
      })
    }
  },
  props: {
    vipCardDialogFlag:Boolean,
    vipCardList:Array,
    customer:Object
  },
  methods: {
    selectCard(cardIndex){
      console.log(this.customer)
      this.currentIndex=cardIndex
      this.$forceUpdate()
      this.customer.vipCard=this.vipCardList[cardIndex]
      this.customer.totalMoney=this.vipCardList[cardIndex].price
      this.$emit("updateBecomeVipData")
      setTimeout(()=>{
        this.$emit("update:vipCardDialogFlag", false)
      },400)
    },
    hiddenDialog() {
      this.$emit("update:vipCardDialogFlag", false)
    },
  }
}
</script>

<style scoped lang="scss">
#vip-card-list-dialog-content {
  position: relative;
  z-index: 1;
  .list-content {
    width: 60%;
    height: 36rem;
    position: fixed;
    top: 50%;
    margin-top: -18rem;
    left: 20%;
    background-color: #fff;
    z-index: 2010;
    border-radius: 1rem;
    padding: .4rem;
    border: none;
    .list-content-scroll {
      width: 100%;
      height: 100%;
      padding: 1rem;
      overflow-y: scroll;
      .vip-card {
        width: 100%;
        height: 9rem;
        margin-bottom: 1rem;
        border-radius: 4rem;
        position: relative;
        .vip-card-content {
          height: 100%;
          width: 100%;
          border-radius: .7rem;
          background-color: #9b9b9b;
          h4 {
            position: absolute;
            left:.9rem;
            top:.4rem;
            font-size: 1.3rem;
          }
          h6 {
            position: absolute;
            right:.8rem;
            top:.4rem;
            color: #353535;
            font-size: .9rem;
            strong {
              margin-right: .2rem;
            }
          }
          .vip-content {
            width: 100%;
            height: 100%;
            display: flex;
            justify-content: center;
            align-items: center;
            strong {
              margin-right: .6rem;
              font: italic 3rem Georgia, serif;
              margin-top: .3rem;
            }
          }
        }

      }
      .vip-card-week {
        background: linear-gradient(to bottom right, #f1fdf5 0%, #95b8a3 100%) 100% no-repeat;
        border:1px solid #7ba089;
        h4 {
          color: #688c75;
        }
        .vip-content {
          strong {
            color: #76a086;
          }
        }
        h6 {
          color: #4c9668 !important;
        }
      }
      .vip-card-month {
        background: linear-gradient(to bottom right, #f3dbd1 0%, #aa7a6b 100%) 100% no-repeat;
        border:1px solid #80382a;
        h4 {
          color:#80382a;
        }
        .vip-content {
          strong {
            color: #80382a;
          }
        }
        h6 {
          color: #80382a !important;
        }
      }
      .vip-card-season {
        background: linear-gradient(to bottom right, #eaeef1 0%, #bcc5d0 100%) 100% no-repeat;
        border:1px solid #5c7797;
        h4 {
          color: #5c7797;
        }
        .vip-content {
          strong {
            color: #5c7797;
          }
        }
        h6 {
          color: #42658f !important;
        }
      }
      .vip-card-half-year {
        background: linear-gradient(to bottom right, #f6e5b9 0%, #f4c24e 100%) 100% no-repeat;
        border:1px solid #d9a500;
        h4 {
          color: #deab12;
        }
        .vip-content {
          strong {
            color: #d9a500;
          }
        }
        h6 {
          color: #ca8a0b !important;
        }
      }
      .vip-card-three-season {
        background: linear-gradient(to bottom right,#f6e5b9 0%, #de9251 100%) 100% no-repeat;
        border:1px solid #e98f42;
        h4 {
          color: #e36c05;
        }
        .vip-content {
          strong {
            color: #e98f42;
          }
        }
        h6 {
          color: #d26503 !important;
        }
      }
      .vip-card-year {
        background: linear-gradient(to bottom right, #4a4a4a 0%, #000000 100%) 100% no-repeat;
        border:1px solid #eebb76;
        h4 {
          color: #eebb76;
        }
        .vip-content {
          strong {
            color: #eebb76;
          }
        }
        h6 {
          color: #efefef!important;
        }
      }
      .vip-card-week-selected {
        box-shadow: 0 0 1rem #83b195;
      }
      .vip-card-month-selected{
        box-shadow: 0 0 1rem #80382a;
      }
      .vip-card-season-selected {
        box-shadow: 0 0 1rem #5c7797;
      }
      .vip-card-half-year-selected {
        box-shadow: 0 0 1rem #f6b106;
      }
      .vip-card-three-season-selected {
        box-shadow: 0 0 1rem #fc9e00;
      }
      .vip-card-year-selected {
        box-shadow: 0 0 1rem #e59e3b;
      }
    }
  }
}
</style>
