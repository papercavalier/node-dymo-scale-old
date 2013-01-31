var io = require('socket.io').listen(8080);

io.sockets.on('connection', function (socket) {
  setInterval(function() { socket.emit('dymo', Math.ceil(Math.random() * 100)) }, 250);
});
