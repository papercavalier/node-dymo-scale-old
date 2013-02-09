var test = require('tap').test
  , dymo = require("./index")
  , scale = new dymo();

test('polling', function (t) {
  t.ok(scale)

  test('weight set to grams', function(t) {
    scale.readData = function () { return [ 3, 4, 2, 0, 140, 9 ] }
    var data = scale.poll()
    t.ok(data, 'return data when polled')
    t.equal(data.value, 2444, 'return correct value')
    t.equal(data.unit, 'grams', 'return correct unit')
    t.end();
  });

  test('weight set to ounces', function(t) {
    scale.readData = function () { return [ 3, 4, 11, 255, 190, 3 ] }
    var data = scale.poll()
    t.ok(data, 'return data when polled')
    t.equal(data.value, 95.8, 'return correct value')
    t.equal(data.unit, 'ounces', 'return correct unit')
    t.end();
  });

  test('no device', function(t) {
    scale.isAlive = function () { return false }
    t.equal(scale.poll(), null, 'polling the scale should return nothing');
    t.end();
  });

  t.end();
});
