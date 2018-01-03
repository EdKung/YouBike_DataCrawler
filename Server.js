var express = require('express');
var YouBike = require('./YouBike');
var mongoose = require('mongoose');
var constants = require("./constants");
var Promise = require("bluebird");
var fs = Promise.promisifyAll(require('fs'));
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
  fs.readFileAsync('./station.json', 'utf8')
    .then(JSON.parse)
    .then(function (data) {
      response.contentType('application/json');
      response.send(data);
      response.end();
  });
});

// Route for /youbike/:staionId
app.route('/youbike/:staionId')
  //===========================GET /youbike/:staionId===========================
  .get(function(request, response) {
    YouBike.findOne({
      sno: request.params.staionId
    }).sort({_id : -1}).exec(function(err, found_file) {
      response.send(found_file);
    });
  })

// Route for /nearYouBike/:staionId
app.route('/nearYouBike/:staionId')
  //===========================GET /nearYouBike/:staionId===========================
  .get(function(request, response) {
    YouBike.findOne({
      sno: request.params.staionId
    }).exec(function(err, found_file) {
      jsonArr = [];
      var lat1 = found_file.lat;
      var lng1 = found_file.lng;
      // console.log(lat1);
      // console.log(lng1);

      for(var i=1; i<= constants.Total_Station_Num; i++) {
        var targetId = addZero(i, 4);
        if(targetId !== request.params.staionId) {
          YouBike.findOne({
            sno: addZero(i, 4)
          }).exec(function(err, stationNode) {
            if(!err) {
              if(stationNode != null) {
                var lat2 = stationNode.lat;
                var lng2 = stationNode.lng;
                var distance = GetDistance(lat1,lng1,lat2,lng2);

                console.log(lat2);
                console.log(lng2);
                console.log("---distance: " + distance);

                jsonArr.push({
                    sno: stationNode.sno, sna: stationNode.sna, dist: distance,
                    sbi: stationNode.sbi, bemp: stationNode.bemp
                });

                if(jsonArr.length === constants.Total_Station_Num - 1) {
                  sortByKey(jsonArr, 'dist');
                  // console.log(JSON.stringify(jsonArr));
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
  })

app.listen(8080);

function sortByKey(array, key) {
  return array.sort(function(a, b) {
  var x = a[key]; var y = b[key];
  return ((x < y) ? -1 : ((x > y) ? 1 : 0));
  });
}

/**
  * Function for searching
  */

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
    //s = Math.round(s * 10000) / 10000;    // Unit: km
    s = Math.round(s * 10000) / 10;    // Unit: m
    //s=s.toFixed(4);
    return s;
}

function addZero(num, n) {
  var len = num.toString().length;
  while (len < n) {
    num = "0" + num;
    len++;
  }
  return num;
}
