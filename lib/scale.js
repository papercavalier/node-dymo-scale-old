var io = require('socket.io').listen(8080);
var HID = require('node-hid');

var devicePath = HID.devices().filter(function(device) { return device.manufacturer === 'DYMO'; })[0].path;
var DymoScale = new HID.HID(devicePath);

DymoScale.weight = function () {
  var weight = { value: 0.0, unit: false };
  var data = this.getFeatureReport(0xfa13, 7);
  var rawValue = ((256 * data[5]) + data[4]);

  if (data[1] === 4) {
    if (data[2] === 11) {
      weight = { value: parseFloat(rawValue/10.0), unit: 'ounces' }
    } else if (data[2] === 2) {
      weight = { value: rawValue, unit: 'grams' }
    }

    return weight;
  }
};

io.sockets.on('connection', function (socket) {
  setInterval(function() { socket.emit('dymo', DymoScale.weight().value) }, 250);
});
