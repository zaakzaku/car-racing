$(function () {
  var time = 0;
  var seconds = 0;
  function tick () { // second guij bgaa ni
    seconds ++;
    $('.time').text(time + ":" + seconds);
    if (seconds === 60) {
      time ++;
      seconds = 0;
    }
    setTimeout(tick, 1000);
  }
  tick();
});
