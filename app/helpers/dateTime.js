var moment    = require('moment'),
    localTime = require('moment-timezone');

var timeHelp = {
  //Returns the current time in Shanghai time zone
  timeShanghai: function () {
    return localTime.tz(moment(), "Asia/Shanghai").format("YYYY-MM-DD HH:mm");
  },
  //Passes in a UNIX time value, converts to local Shanghai Time, and returns the value
  unixToShanghaiTime: function (unixTime) {
    return localTime.tz(moment.unix(unixTime),"Asia/Shanghai")
    .format("YYYY-MM-DD HH:mm");
  },
  //Pass in a Unix timestamp (from the past), calculate how many minutes has elapsed
  //Return the "minutes" value
  howOldInMinutes: function (unixTime) {
    var currentTime = moment().unix(),
        age         = moment(moment.unix(currentTime)).diff(moment.unix(unixTime), 'minutes');
    return age;
  },
  hasExpired: function () {
    var currentDateTime = moment().unix();
    return currentDateTime;
  }
};


 module.exports = timeHelp;
