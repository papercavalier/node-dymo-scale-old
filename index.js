module.exports = exports = function() {
  this.device = function() {
    var HID = require('node-hid');

    var devices = HID.devices().filter(function(x) {
      return x.manufacturer === 'DYMO';
    });

    if(devices.length > 0) {
      return new HID.HID(devices[0].path);
    }
  }()

  this.readData = function() {
    if (this.device) {
      return this.device.getFeatureReport(0xfa13, 7);
    }
  }

  this.poll = function() {
    if (data = this.readData()) {
      var weight = { value: 0.0, unit: false }
      var rawValue = ((256 * data[5]) + data[4]);

      if (data[1] === 4) {
        if (data[2] === 11) {
          weight.value = parseFloat(rawValue/10.0)
          weight.unit = 'ounces'
        } else if (data[2] === 2) {
          weight.value =  rawValue
          weight.unit =  'grams'
        }
      }

      return weight;
    }
  }
}
