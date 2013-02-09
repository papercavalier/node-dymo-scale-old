var test = require('tap').test
  , dymo = require("./index")
  , scale = new dymo();

test('no device, no response', function (t) {
  t.equal(scale.poll(), null);
  t.end();
});
