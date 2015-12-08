String.prototype.replaceAll = function(s1, s2) {
  return this.replace(new RegExp(s1, "gm"), s2);
}

$(document).ready(function() {
  $.getJSON('/list', function(result) {
    var s = $('<select id="staDropDownList"></select>');
    $.each(result, function(index, youbike) {
      //console.log(youbike);
      $('<option />', {value: youbike.sno, text: youbike.sno + '-' + youbike.sna}).appendTo(s);
    })
    s.appendTo("#divForStationList");
  });

  $('#staDropDownList').change(function() {
      alert($(this).val());
  });
})
