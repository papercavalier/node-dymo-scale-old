var io = require('socket.io').listen(8080);
var HID = require('node-hid');

var DymoScale = new HID.HID(0x0922, 0x8004);

DymoScale.weight = function () {
  this.data = this.getFeatureReport(0xfa13, 7);

  if (this.data[1] === 2) {
    return { value: 0.0, unit: false }
  }

  var data = this.data;
  var rawValue = ((256 * data[5]) + data[4]);

  if (this.data[1] === 4) {
    if (this.data[2] === 11) {
      this.unit = 'ounces';
      this.value = parseFloat(rawValue/10.0);
    }

    if (this.data[2] === 2) {
      this.unit = 'grams';
      this.value = rawValue;
    }

    return { value: this.value, unit: this.unit }
  }
};

io.sockets.on('connection', function (socket) {
  setInterval(function() { socket.emit('dymo', DymoScale.weight().value) }, 250);
});
