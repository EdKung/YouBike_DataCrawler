var express = require('express');
var YouBike = require('./YouBike');
var mongoose = require('mongoose');
var app = express();
var jsonArr = [];

mongoose.connect('mongodb://localhost/youbike');

console.log("===========================Server is starting===========================");
app.use(express.static('web_interface'));

// Home page
app.get('/', function(request, response) {
  console.log("This is /");
});

app.get('/list',function(request, response) {
  YouBike.find().distinct('sno', function(error, stationId) {
      if (!error){
        jsonArr = [];
        console.log(stationId);
        for(var i=0; i< stationId.length; i++) {
          YouBike.findOne({
            sno: stationId[i]
          }, function(err, stationNode) {
            if(!err) {
              if(stationNode != null) {
                console.log(stationNode.sno);
                console.log(stationNode.sna);
                jsonArr.push({
                    sno: stationNode.sno, sna: stationNode.sna
                });
                if(jsonArr.length === stationId.length) {
                  sortByKey(jsonArr, 'sno');
                  console.log(JSON.stringify(jsonArr));
                  response.contentType('application/json');
                  response.send(JSON.stringify(jsonArr));
                  response.end();
                }
              }
            }
          });
        }
      }
  });
});

app.listen(8080);

function sortByKey(array, key) {
  return array.sort(function(a, b) {
  var x = a[key]; var y = b[key];
  return ((x < y) ? -1 : ((x > y) ? 1 : 0));
  });
}
