export function getAge(strBirthday){
  let returnAge;
  let strBirthdayArr=strBirthday.split("-");
  let birthYear = parseInt(strBirthdayArr[0]);
  let birthMonth = parseInt(strBirthdayArr[1]);
  let birthDay = parseInt(strBirthdayArr[2]);

  let d = new Date();
  let nowYear = d.getFullYear();
  let nowMonth = d.getMonth() + 1;
  let nowDay = d.getDate();

  if(nowYear === birthYear){
    returnAge = 0;//同年 则为0岁
  } else{
    let ageDiff = nowYear - birthYear ; //年之差
    if(ageDiff > 0){
      if(nowMonth === birthMonth) {
        let dayDiff = nowDay - birthDay;//日之差
        if(dayDiff < 0)
        {
          returnAge = ageDiff - 1;
        }
        else
        {
          returnAge = ageDiff ;
        }
      }
      else
      {
        let monthDiff = nowMonth - birthMonth;//月之差
        if(monthDiff < 0)
        {
          returnAge = ageDiff - 1;
        }
        else
        {
          returnAge = ageDiff ;
        }
      }
    }
    else
    {
      returnAge = -1;//返回-1 表示出生日期输入错误 晚于今天
    }
  }
  return returnAge;//返回周岁年龄
}

export function getStrDate(date){
  return date.getFullYear()+"-"+((date.getMonth()+1)>9?date.getMonth()+1:"0"+(date.getMonth()+1))+"-"+(date.getDate()>9?date.getDate():"0"+date.getDate());
}

function dateFormat(fmt, date) {
  let ret;
  const opt = {
    "Y+": date.getFullYear().toString(),        // 年
    "m+": (date.getMonth() + 1).toString(),     // 月
    "d+": date.getDate().toString(),            // 日
    "H+": date.getHours().toString(),           // 时
    "M+": date.getMinutes().toString(),         // 分
    "S+": date.getSeconds().toString()          // 秒
    // 有其他格式化字符需求可以继续添加，必须转化成字符串
  };
  for (let k in opt) {
    ret = new RegExp("(" + k + ")").exec(fmt);
    if (ret) {
      fmt = fmt.replace(ret[1], (ret[1].length == 1) ? (opt[k]) : (opt[k].padStart(ret[1].length, "0")))
    };
  };
  return fmt;
}

export function stringToDate(str){
  let dateStrs = str[0].split("-");
  let year = parseInt(dateStrs[0], 10);
  let month = parseInt(dateStrs[1], 10) - 1;
  let day = parseInt(dateStrs[2], 10);
  return new Date(year, month, day,0,0,0);
}

// 去除0 参数 日期 如 2020-07-08 返回为 2020-7-8
export function dislodgeZero(str) {
  let strArray = str.split("-");
  strArray = strArray.map(function(val) {
    if (val[0] == "0") {
      return (val = val.slice(1));
    } else {
      return val;
    }
  });
  return strArray.join("-");
}

export function getWeekFirstDay(dd) {
  var week = dd.getDay(); //获取时间的星期数
  dd.setDate(dd.getDate() - week); //获取minus天前的日期
  var y = dd.getFullYear();
  var m = dd.getMonth() + 1; //获取月份
  var d = dd.getDate();
  return y + "-" + m + "-" + d;
}

export function getWeekFirstDay2(dd) {
  var week = dd.getDay(); //获取时间的星期数
  dd.setDate(dd.getDate() - week); //获取minus天前的日期
  return dd;
}
/**
 * 根据日期字符串获取星期几
 * @param dateString 日期字符串（如：2020-05-02）
 * @returns {number}
 */
export function getDayOfWeek(dateString) {
  let dateArray = dateString.split("-");
  let date = new Date(dateArray[0], parseInt(dateArray[1] - 1), dateArray[2]);
  return date.getDay();
}

//时间加一天
export function addDateStr(date, days) {
  if (days == undefined || days == '') {
    days = 0;
  }
  var date = new Date(date);
  date.setDate(date.getDate() + days);
  var month = date.getMonth() + 1;
  var day = date.getDate();
  return date.getFullYear() + '-' + getFormatDate(month) + '-' + getFormatDate(day);
}

function getFormatDate(arg) {
  if (arg == undefined || arg == '') {
    return '';
  }

  var re = arg + '';
  if (re.length < 2) {
    re = '0' + re;
  }
  return re;
}

export function compareDate(d1, d2) {
  return ((new Date(d1.replace(/-/g, "\/"))) > (new Date(d2.replace(/-/g, "\/"))));
}

//计算天数差的函数，通用
export function  dateDiff(sDate1,  sDate2){    //sDate1和sDate2是2006-12-18格式
  var  aDate,  oDate1,  oDate2,  iDays
  aDate  =  sDate1.split("-")
  oDate1  =  new  Date(aDate[1]  +  '-'  +  aDate[2]  +  '-'  +  aDate[0]) //转换为12-18-2006格式
  aDate  =  sDate2.split("-")
  oDate2  =  new  Date(aDate[1]  +  '-'  +  aDate[2]  +  '-'  +  aDate[0])
  iDays  =  parseInt((oDate1  -  oDate2)  /  1000  /  60  /  60  /24) //把相差的毫秒数转换为天数
  return  iDays
}

export function getWeekNumber(dt){
  let d1 = new Date(dt);
  let d2 = new Date(dt);
  d2.setMonth(0);
  d2.setDate(1);
  let rq = d1-d2;
  let days = Math.ceil(rq/(24*60*60*1000));
  let num = Math.ceil(days/7);
  return num;
}

//分组
export const groupBy = (list, fn) => {
  const groups = {};
  list.forEach(function (o) {
    const group = JSON.stringify(fn(o));
    groups[group] = groups[group] || [];
    groups[group].push(o);
  });
  return Object.keys(groups).map(function (group) {
      return groups[group];
  });
  // return groups;
}



