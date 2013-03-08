var test = require("tap").test
  , scale = require("./index");

test("polling", function (t) {
  t.ok(scale);

  test("weight set to grams", function(t) {
    scale.device = function() {
      return { read: function (cb) { cb(null, [ 3, 4, 2, 0, 140, 9 ]); } };
    }

    scale.read(function(_, data) {
      t.ok(data, "return data");
      t.equal(data.value, 2444, "return correct value");
      t.equal(data.unit, "grams", "return correct unit");
      t.end();
    });
  });

  test("weight set to ounces", function(t) {
    scale.device = function() {
      return { read: function (cb) { cb(null, [ 3, 4, 11, 255, 190, 3 ]); } };
    }

    scale.read(function(_, data) {
      t.ok(data, "return data");
      t.equal(data.value, 95.8, "return correct value");
      t.equal(data.unit, "ounces", "return correct unit");
      t.end();
    });
  });

  test("weight is 0", function(t) {
    scale.device = function() {
      return { read: function (cb) { cb(null, [ 3, 5, 11, 255, 0, 0 ]); } };
    }

    scale.read(function(_, data) {
      t.ok(data, "return data");
      t.equal(data.value, 0.0, "return correct value");
      t.equal(data.unit, null, "return correct unit");
      t.end();
    });
  });

  test("no device", function(t) {
    scale.device = function() { return null; }

    scale.read(function(error, data) {
      t.equal(error.message, "device offline", "return an error");
      t.similar(data, null, "do not return data");
      t.end();
    });
  });

  t.end();
});
