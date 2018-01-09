var inputText = "Text messaging is most often used between. Text messages can also be used to interact with automated systems, for example, to order products or services from e-commerce websites, or to participate in online contests.";
var wordList = inputText.split(' ');

$(function () {
  var game;
  var startTime = new Date().getTime();
  var isStarted = false;
  var difference = 0;

  var currentIndex = 0;

  for (i = 0; i < wordList.length; i++) {
    var text = wordList[i];
    var span = $('<span></span>');
    span.addClass('word' + i);

    if (i === 0) {
      span.addClass('active');
    }
    if (i !== wordList.length - 1) {
      text += ' ';
    }

    span.text(text);
    $('#main-text').append(span);
  }

  var input = $('#the-text');
  input.keydown(function (event) {
    if (event.keyCode === 16 || event.keyCode === 18) {
      return;
    }
    if (event.keyCode === 32) {
      event.preventDefault();
    }
    var value = event.target.value;
    if (event.keyCode === 8) {
      value = value.slice(0, -1);
    } else {
      value = value + event.key;
    }
    var word = $('.word' + currentIndex).text();

    if (word.startsWith(value)) {
      input.removeClass('error');
      $('.word' + currentIndex).removeClass('error');
    } else {
      input.addClass('error');
      $('.word' + currentIndex).addClass('error');
    }

    if (word === value) {
      event.target.value = '';
      currentIndex ++;

      var len = 880 / wordList.length;

      $('car img').css({'padding-left': len * currentIndex + 'px'});
      $('.word' + currentIndex).addClass('active');
      $('.word' + (currentIndex - 1)).removeClass('active');

      if (currentIndex === wordList.length) {
        var endTime = new Date().getTime();
        difference = endTime - startTime;
        var wpm = parseInt(wordList.length / (difference / 1000) * 60);
        $('.container').text(wpm + '/wpm');
      }
      socket.emit('OnWord', word);
    }
  });
});

var socket = io();
var startTime = new Date().getTime();
socket.on('nyamaa', function (games) {
  var seconds = games.timer;
  function tick () {
    seconds ++;
    setTimeout(tick, 1000);
    if (seconds < 0) {
      $('#the-text').attr("disabled", true);
    } else {
      $('#the-text').attr("disabled", false);
    }
  }
  tick();
  $('.car').remove();
  socket.on('word', function(socketId, currentIndex) {
    console.log(games.timer);
    var realTime = new Date().getTime();
    differenceReal = realTime - startTime;
    if (currentIndex % 2 == 0) {
      var wpmReal = parseInt(currentIndex / ((differenceReal / 1000) + games.timer) * 60);
      $("#" + socketId + "1").text(wpmReal + '/wpm');
    }

    var len = 880 / wordList.length;
    $("#" + socketId).css("padding-left",+ len*currentIndex + "px");
  });
  for (var i = 0; i < games['players'].length; i ++) {
    var car = $('<div class="car" id = "'+ games.players[i].socketId +'"> \
                                              <img src="/css/transport.png" alt="horse" width="120" height="58"><span id="'+ games.players[i].socketId +'1">00/wpm</span> \
                                                                                          </div>');
    $('.cars').append(car);
  }
});

