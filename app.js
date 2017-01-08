var express = require('express');
const Promise = require('promise');
const Camera = require('./libs/camera')
var app = express();

app.use(express.static('web'));

app.listen(8000, function () {
  console.log('app listening on port 8000!');
});

