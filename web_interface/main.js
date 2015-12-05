String.prototype.replaceAll = function(s1, s2) {
  return this.replace(new RegExp(s1, "gm"), s2);
}

$(document).ready(function() {
  $.getJSON('/list', function(result) {
    var s = $('<select />');
    $.each(result, function(index, youbike) {
      console.log(youbike);
      $('<option />', {value: youbike.sno, text: youbike.sna}).appendTo(s);
    })
    s.appendTo("#myDiv");
  });
})

/*
function stationListGeneratore() {
  var data = {
    "key1": "value1",
    "key2": "value2"
  }
  var s = $('<select />');
  for(var val in data) {
      $('<option />', {value: val, text: data[val]}).appendTo(s);
  }
  s.appendTo("#myDiv"); // or wherever it should be
} */
