var express = require('express');
var request = require('request');
var fs = require('fs');
var zlib = require("zlib");
var url = 'http://data.taipei/youbike';
var YouBike = require('./YouBike');
var mongoose = require('mongoose');
var app = express();

mongoose.connect('mongodb://localhost/youbike');

var CronJob = require('cron').CronJob;
new CronJob('*/30 * * * * *', function() {

  var current_time = new Date();
  console.log(current_time);

  var source = request(url);
  var download_file = fs.createWriteStream('./youbike.json.gz');
  var out = fs.createWriteStream('youbike.json');

  source.on('response', function(res) {
    // console.log("source.on execute");
    res.pipe(download_file);
  });

  download_file.on('finish', function() {
    // console.log("download_file.on execute");
    var inp = fs.createReadStream('youbike.json.gz');
    inp.pipe(zlib.createGunzip()).pipe(out);
  })

  out.on('close', function() {
    // console.log("out.on execute");
    // var youbike_per_minute = require('./youbike.json');
    fs.readFile('./youbike.json', {encoding: 'utf-8'}, function(err, data) {
      if (!err) {
        var youbike_per_minute = JSON.parse(data);
        var length = Object.keys(youbike_per_minute.retVal).length;
        var one_item = 0;
        YouBike.findOne({
          mday: youbike_per_minute.retVal["0001"].mday
        }, function(err, youbike_data) {
          if (!youbike_data) {
            // do stuff here
            // console.log("Find nothing!");
            for (var i = 1; i <= length; i++) {
              one_item = youbike_per_minute.retVal[addZero(i, 4)];
              //===========================Store into Database===========================
              // console.log(one_item);
              var new_bike = new YouBike(one_item);
              new_bike.save();
              //===========================Store into Database===========================

              //console.log(YouBike.distinct( "sno" ));
            }
          }
        });

      } else {
        console.log(err);
      }
    });
  })

}, null, true, 'America/Los_Angeles');


function addZero(num, n) {
  var len = num.toString().length;
  while (len < n) {
    num = "0" + num;
    len++;
  }
  return num;
}
