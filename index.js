var HID = require('node-hid');

var path = HID.devices().filter(function(device) { return device.manufacturer === 'DYMO'; })[0].path;
module.exports = exports = new HID.HID(path);

exports.weight = function () {
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
