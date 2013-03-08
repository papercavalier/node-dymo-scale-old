# Node.js Dymo Scale

A simple wrapper to Dymo scales

```javascript
var scale = require('dymo-scale');
scale.read(function(error, data) {
  console.log(data); // {value: 10, unit: "grams"}
});
```
