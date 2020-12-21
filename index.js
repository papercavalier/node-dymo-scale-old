var DymoScale = function() {

  var HID = require("node-hid");
  var deviceHandle = null;

  this.device = function() {
    // HACK: cache the device in a variable (deviceHandle)
    // On some machines (OS X 10.10+ ?) re-opening the same device
    // results in a "cannot open device" error
    if(!deviceHandle) {
      var devices = HID.devices().filter(function(x) {
        return x.manufacturer === "DYMO";
      });

      if (devices.length > 0) {
        deviceHandle = new HID.HID(devices[0].path);
      }
    }
    return deviceHandle;
  };

  this.read = function(callback) {
    var device = this.device();

    if (device) {
      device.read(function(error, data) {
        if (error) {
          deviceHandle = null;
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
