var DymoScale = function() {
  this.device = function() {
    var HID = require("node-hid");

    var devices = HID.devices().filter(function(x) {
      return x.manufacturer === "DYMO";
    });

    if(devices.length > 0) {
      return new HID.HID(devices[0].path);
    }
  }

  this.read = function(cb) {
    if (var device = this.device()) {
      device.read(function(_, data) {
        var weight = {value: 0.0, unit: false};
        var raw = ((256 * data[5]) + data[4]);

        if (data[1] === 4) {
          if (data[2] === 11) {
            weight.value = parseFloat(raw / 10.0)
            weight.unit = "ounces"
          } else if (data[2] === 2) {
            weight.value =  raw
            weight.unit =  "grams"
          }
        }

        cb(weight);
      });
    } else {
      cb();
    }
  }
}

module.exports = exports = new DymoScale();
