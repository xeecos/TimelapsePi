var express = require('express');
var bodyParser = require('body-parser');
const Promise = require('promise');
const Camera = require('./libs/camera')
var app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static('web'));
app.get("/format",function(req,res){
  Camera.sharedObject().format(req.query.exp,req.query.gain).then(function(){
    return Camera.sharedObject().capture();
  }).then(function(buffer){
    require("fs").createWriteStream("./web/capture/result.jpg").end(buffer);
    res.send('ok');
  });
})
app.get("/capture",function(req,res){
  Camera.sharedObject().capture().then(function(buffer){
    if(buffer){
      require("fs").createWriteStream("./web/capture/result.jpg").end(buffer);
    }
    res.send('ok');
  });
})
app.listen(8000, function () {
  console.log('app listening on port 8000!');
});
process.on('uncaughtException', (err) => {
	console.log(err);
});
