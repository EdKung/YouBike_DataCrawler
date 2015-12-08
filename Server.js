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

/*
 *  Return radian by degrees
 */
function Rad(d){
   return d * Math.PI / 180.0;
}

/*
 * Distance Calculation
 * lat1 and lng2 are the latitude and longtitude of point1
 * lat2 and lng2 are the latitude and longtitude of point2
 */
function GetDistance(lat1,lng1,lat2,lng2){
    var radLat1 = Rad(lat1);
    var radLat2 = Rad(lat2);
    var a = radLat1 - radLat2;
    var  b = Rad(lng1) - Rad(lng2);
    var s = 2 * Math.asin(Math.sqrt(Math.pow(Math.sin(a/2),2) +
    Math.cos(radLat1)*Math.cos(radLat2)*Math.pow(Math.sin(b/2),2)));
    s = s *6378.137 ;                     // EARTH_RADIUS;
    s = Math.round(s * 10000) / 10000;    // Unit: km
    //s=s.toFixed(4);
    return s;
}
