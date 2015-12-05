var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var YouBike = new Schema({
  sno: String,
  sna: String,
  tot: String,
  sbi: String,
  sarea: String,
  mday: String,
  lat: String,
  lng: String,
  ar: String,
  sareaen: String,
  snaen: String,
  aren: String,
  bemp: String,
  act: String
}, {
  versionKey: false
});

module.exports = mongoose.model('YouBike', YouBike);
