var express = require('express');
var passport = require('passport');
var Strategy = require('passport-facebook').Strategy;
var request = require('request');
var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var uid = 0;
passport.use(new Strategy({
    clientID: '260140544508723',
    clientSecret: '030fdbd34766e7f8bf55e1b70b8dd1aa',
    callbackURL: 'http://localhost:3000/login/facebook/return'
  },
  function(accessToken, refreshToken, profile, cb) {
    var options={
      'id':profile.id,
      'name':profile.displayName,
      'profile':profile.id
    }
    uid = profile.id;
    request({url: 'http://localhost:4001/api/v1/users/'+profile.id, json: true}, function(err, res, json) {
      if (err) {
        throw err;
      }
      if(json.response == "false"){
        savedb(options)
      }
      else {
      console.log(json.response[0].id)
      }
    });
    //var obj  = JSON.parse(response.body);
    //var keys = Object.keys(obj);
    //savedb(options)
    return cb(null, profile);
  }));


function savedb(postData){
  var clientServerOptions = {
    uri: 'http://localhost:4001/api/v1/users/',
    body: JSON.stringify(postData),
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    }
  }
  request(clientServerOptions, function (error, response) {
    console.log(error,response.body);
    return;
  });
}
passport.serializeUser(function(user, cb) {
  cb(null, user);
});

passport.deserializeUser(function(obj, cb) {
  cb(null, obj);
});


//var app = express();
app.use(express.static(__dirname + '/public'));
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');

app.use(require('morgan')('combined'));
app.use(require('cookie-parser')());
app.use(require('body-parser').urlencoded({ extended: true }));
app.use(require('express-session')({ secret: 'keyboard cat', resave: true, saveUninitialized: true }));

app.use(passport.initialize());
app.use(passport.session());

app.get('/',
  function(req, res) {
    res.render('home', { user: req.user });
  });

app.get('/login',
  function(req, res){
    res.render('login');
  });

app.get('/login/facebook',
  passport.authenticate('facebook'));

app.get('/login/facebook/return',
  passport.authenticate('facebook', { failureRedirect: '/login' }),
  function(req, res) {
    res.redirect('/profile');
  });

app.get('/profile',
  require('connect-ensure-login').ensureLoggedIn(),
  function(req, res){
    res.render('profile', { user: req.user });
  });
var games = [];
var timer = function () {
  for (var i = 0; i < games.length; i ++) {
    games[i].timer ++;
  }
}
setInterval(timer, 1000);

io.on('connection', function (socket) {
  var clientIp = socket.request.connection.remoteAddress;
  var socketId = socket.id;
  var currentIndex = 0;
  var gameIndex = null;
  for (var i = 0; i < games.length; i ++) {
    if (games[i].timer < -3) {
      gameIndex = i;
    }
  }

  if (gameIndex === null) {
    // Тоглолт эхлүүлнэ
    var game = {
      players: [],
      timer: -10,
      id: uid,
    };

    socket.join(game.id); // adding to room
    gameIndex = games.push(game) - 1;
  }


  // Тоглогч үүсгэж байна
  var player = {
    socketId: socket.id,
    currentIndex: 0,
    clientIp: clientIp,
  }

  games[gameIndex]['players'].push(player);

  socket.emit('nyamaa', games[gameIndex]);
  socket.broadcast.to(games[gameIndex].id).emit('socket', games[gameIndex])

  socket.on('disconnect', function () {
    for (var i = 0; i < games.length; i ++) {
      games[i].players = games[i].players.filter(function (player) {
        return player.clientIp !== clientIp;
      });
    }
  });

  // Үг бичихэд хүлээн авч currentIndex илгээж байна.
  socket.on('OnWord', function(){
    currentIndex ++;
    io.emit('word', socketId, currentIndex);
  });
});
http.listen(3000, function(){
    console.log('listening on *:3000');
});
