var test = require('tap').test
  , dymo = require("./index")
  , scale = new dymo();

test('polling', function (t) {
  t.ok(scale)

  test('weight set to grams', function(t) {
    scale.readData = function () { return [ 3, 4, 2, 0, 140, 9 ] }
    t.similar(scale.poll(), {value:2444,unit:'grams'}, 'return weight in grams');
    t.end();
  });

  test('weight set to ounces', function(t) {
    scale.readData = function () { return [ 3, 4, 11, 255, 190, 3 ] }
    t.similar(scale.poll(), {value:95.8,unit:'ounces'}, 'return weight in ounces')
    t.end();
  });

  test('no device', function(t) {
    scale.isAlive = function () { return false }
    t.equal(scale.poll(), null, 'polling the scale should return nothing');
    t.end();
  });

  t.end();
});
