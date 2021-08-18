<template>
  <div id="home-calendar">
    <div class="header-line">
      <div class="buttons">
        <div class="button-left" @click="goPrevious()">
          <img src="images/home/left.png" alt="">
        </div>
        <div class="button-right" @click="goNext()">
          <img src="images/home/right.png" alt="">
        </div>
      </div>
      <strong> {{ currentMonth }}</strong>
    </div>
    <full-calendar :options="calendarOptions" style="margin-top: .4rem" ref="assignment-calendar"/>
  </div>
</template>

<script>
import './calendar.scss'
import FullCalendar from '@fullcalendar/vue';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import zhLocale from '@fullcalendar/core/locales/zh-cn';
import {apiPlanDayOneMonthCount} from 'src/api/customerPlanDay';
import {date} from 'quasar';
import {calendar} from '../../util/calendar'

export default {
  components: {
    FullCalendar // make the <FullCalendar> tag available
  },
  data() {
    return {
      currentMonth: '',
      calendarOptions: {
        plugins: [dayGridPlugin, interactionPlugin],
        initialView: 'dayGridMonth',
        views: {
          dayGridMonth: { //转农历
            dayCellContent(item) {
              let _dateF = calendar.solar2lunar(item.date.getFullYear(), item.date.getMonth() + 1, item.date.getDate());
              if (item.isToday) {
                return {
                  html: `<div class="today-text">
                            <img src="icons/emotion-happy-line.png">
                            <span>今天</span>
                        </div>
                        <p>${_dateF.IDayCn}</p>`
                };
              } else {
                if (item.date.getDate() === 1) {
                  let month = item.date.getMonth() + 1;
                  if (month < 10) {
                    month = "0" + month
                  }
                  let day = item.date.getDate();
                  if (day < 10) {
                    day = "0" + day
                  }
                  return {
                    html: `<h5>${month}.${day}</h5><p>${_dateF.IDayCn}</p>`
                  }
                } else {
                  return {
                    html: `<h5>${item.date.getDate()}</h5><p>${_dateF.IDayCn}</p>`
                  }
                }
              }
            }
          }
        },
        dateClick: info => {
          this.getCalendar().select(info.dateStr);
          console.log('selecting date:', info.dateStr);
          this.$emit('select-date', info.dateStr);
        },
        editable: true,
        selectable: true,
        locale: zhLocale,
        headerToolbar: null,
        events: [],
        firstDay: 0,
      }
    };
  },
  methods: {
    goPrevious() {
      this.getCalendar().prev();
      this.loadHeaderText();
      this.loadMonthCount(this.getCalendar().getDate());
    },
    goNext() {
      this.getCalendar().next();
      this.loadHeaderText();
      this.loadMonthCount(this.getCalendar().getDate());
    },
    loadMonthCount(loadingDate) {
      apiPlanDayOneMonthCount(loadingDate.getFullYear(), loadingDate.getMonth() + 1).then(res => {
        if (res.data.data && res.data.data.length > 0) {
          let tileContent = [];
          res.data.data.forEach(oneDay => {
            let tile = {};
            tile.date = oneDay.detailDate;
            tileContent.push(tile);
          });
          this.calendarOptions.events = tileContent;
        }
      });
    },
    loadHeaderText() {
      this.currentMonth = date.formatDate(this.getCalendar().getDate(), 'YYYY.MM');
    },
    getCalendar() {
      return this.$refs['assignment-calendar'].getApi();
    }
  },
  created() {
    this.loadMonthCount(new Date());
    console.log(calendar)
  },
  mounted() {
    this.loadHeaderText();
  }
};
</script>

<style lang="scss">
#home-calendar {
  background-color: #fff;

  .header-line {
    width: 100%;
    height: 2rem;
    display: flex;
    justify-content: flex-start;
    align-items: center;
    padding-left: 1.5rem;

    .buttons {
      width: 6rem;
      height: 1.4rem;
      display: flex;
      margin-right: 1rem;

      .button-left, .button-right {
        width: 3rem;
        height: 100%;
        border: .05rem solid #D1D1D7;
        display: flex;
        justify-content: center;
        align-items: center;

        img {
          width: 1rem;
          height: 1rem;
        }
      }

      .button-left {
        border-radius: .1rem 0 0 .1rem;
        padding-right: .4rem;
      }

      .button-right {
        border-radius: 0 0.1rem 0.1rem 0;
        margin-left: -0.05rem;
        padding-left: .4rem;
      }
    }

    strong {
      font-size: 1.5rem;
      font-family: Staatliches-Regular, Staatliches;
      font-weight: 400;
      color: #23262D;
    }
  }
}

</style>
