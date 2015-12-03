var request = require('request');
var fs = require('fs');
var zlib = require("zlib");
var url = 'http://data.taipei/youbike';
var YouBike = require('./YouBike');
var mongoose = require('mongoose');

mongoose.connect('mongodb://localhost/youbike');

var sleep_time = 1000;

fetchdata(1000);

function fetchdata(sleep_time) {
  d = new Date();
  console.log(d);
  setTimeout(function() {
    var start = +new Date();
    var source = request(url);
    var download_file = fs.createWriteStream('./youbike.json.gz');
    source.on('response', function(res) {
      res.pipe(download_file);
    });

    download_file.on('finish', function() {
      var inp = fs.createReadStream('youbike.json.gz');
      var out = fs.createWriteStream('youbike.json');

      inp.pipe(zlib.createGunzip()).pipe(out);
      out.on('close', function() {
        var testing = require('./youbike.json');
        var length = Object.keys(testing.retVal).length;
        var one_item = 0;

        YouBike.findOne({
          mday: testing.retVal["0001"].mday
        }, function(err, youbike_data) {
          if (!youbike_data) {
            // do stuff here
            for (var i = 1; i <= length; i++) {
              one_item = testing.retVal[addZero(i, 4)];
              //===========================Store into Database===========================
              // console.log(one_item);
              var new_bike = new YouBike(one_item);
              new_bike.save();
              //===========================Store into Database===========================
            }
          }
        });
        // for (var i = 1; i <= length; i++) {
        //   one_item = testing.retVal[addZero(i, 4)];
        //   //===========================Store into Database===========================
        //   // console.log(one_item);
        //   // var new_bike = new YouBike(one_item);
        //   // new_bike.save();
        //   //===========================Store into Database===========================
        // }
        var end = +new Date();
        // console.log((end - start) / 1000);
        fetchdata(60000 - (end - start))
      })
    })
  }, sleep_time);
}


function addZero(num, n) {
  var len = num.toString().length;
  while (len < n) {
    num = "0" + num;
    len++;
  }
  return num;
}
