require('dotenv').config()
var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var server = require('http').Server(app);
var io = require('socket.io')(server);
var fs = require('fs');
var cron = require('node-cron');
var fetch = require('node-fetch');


var indexRouter = require('./routes/index');
var commandeRouter = require('./routes/commande');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/commande', commandeRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

server.listen(3002);

io.on('connection', function (socket) {
  socket.on('start', function () {
    fs.readFile('./public/db.json', 'utf8', function readFileCallback(err, data) {
      if (err) {
        console.log(err);
      } else {
        let obj = JSON.parse(data);
        obj.init = true
        socket.emit('data', obj);
      }
    });
  })
  socket.on('count', function (data) {
    writeDb(data)
    socket.broadcast.emit('data', data)
  });
});

const writeDb = (data) => {
  fs.readFile('./public/db.json', 'utf8', function readFileCallback(err, dataDb) {
    if (err) {
      console.log(err);
    } else {
      if (data.init === true) {
        obj = { value: data.value }
      } else {
        obj = JSON.parse(dataDb);
        value = obj.value - parseInt(data.value)
        obj.value = value.toString()
      }
      json = JSON.stringify(obj); //convert it back to json
      fs.writeFile('./public/db.json', json, 'utf8', err => {
        if (err) {
          console.log('Error writing file', err)
        } else {
          console.log('Successfully wrote file')
        }
      }); // write it back 
    }
  });
}

// cron.schedule(' 09 11 * * 1-5', () => {
//   fs.readFile('./public/db.json', 'utf8', function readFileCallback(err, dataDb) {
//     if (err) {
//       console.log(err);
//     } else {
//       obj = JSON.parse(dataDb);

//       number = parseFloat(obj.value).toLocaleString('fr')
//       number = number.replace(',', ' ')

//       const body = {
//         "blocks": [
//           {
//             "type": "section",
//             "text": {
//               "type": "mrkdwn",
//               "text": `Hello <!channel>
              
//               Rappel de l'objectif de la semaine :dart:: *${number} €* :moneybag:
      
//               Bonne Journée à vous !`
//             }
//           }
//         ]
//       };

//       fetch(process.env.SLACK_URL, {
//         method: 'post',
//         body: JSON.stringify(body),
//         headers: { 'Content-Type': 'application/json' },
//       })
//         .then(json => console.log(json));

//     }
//   })
// });

module.exports = app;
