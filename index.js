var DymoScale = function() {

  var HID = require("node-hid");

  this.device = function() {
    var devices = HID.devices().filter(function(x) {
      return x.manufacturer === "DYMO";
    });

    if (devices.length > 0) {
      return new HID.HID(devices[0].path);
    }
  }

  this.read = function(callback) {
    var device = this.device();

    if (device) {
      device.read(function(error, data) {
        if (error) {
          return callback(error);
        }

        var weight = {value: 0, unit: null};
        var raw = ((256 * data[5]) + data[4]);

        if (data[1] === 4) {
          if (data[2] === 11) {
            weight.value = parseFloat(raw / 10.0);
            weight.unit = "ounces";
          } else if (data[2] === 2) {
            weight.value = raw;
            weight.unit = "grams";
          }
        }

        callback(null, weight);
      });
    } else {
      callback(new Error("device offline"));
    }
  }

}

module.exports = exports = new DymoScale();
