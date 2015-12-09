String.prototype.replaceAll = function(s1, s2) {
  return this.replace(new RegExp(s1, "gm"), s2);
}

$(document).ready(function() {
  $.getJSON('/list', function(result) {
    var s = $('<select id="staDropDownList"></select>');
    $.each(result, function(index, youbike) {
      $('<option />', {value: youbike.sno, text: youbike.sno + '-' + youbike.sna}).appendTo(s);
    })
    s.appendTo("#divForStationList");
  });

  $('#BtnSelectSta').on('click', function(event) {
    var eID = document.getElementById("staDropDownList");
    var eSno = eID.options[eID.selectedIndex].value;
    var eSta = eID.options[eID.selectedIndex].text;

    $.getJSON('/youbike/' + eSno, function(youbike_info) {
      console.log(youbike_info);
      var result = $('<div></div>');
      result.append('<p sta_id>' + '編號: ' + youbike_info.sno + '</p>');
      result.append('<p sta_num>' + '站名: ' + youbike_info.sna + '</p>');
      if(youbike_info.act == 1) {
        result.append('<p sta_running_status>' + '狀態: ' + '運作中' + '</p>');
        result.append('<p sta_sarea>' + '區域: ' + youbike_info.sarea + '</p>');
        result.append('<p sta_ar>' + '位置: ' + youbike_info.ar + '</p>');
        result.append('<p sta_sbi>' + '可借車輛: '+  youbike_info.sbi + '</p>');
        result.append('<p sta_bemp>' + '可停空位: '+  youbike_info.bemp + '</p>');
        result.append('<p sta_mday>' + '更新時間: '+  youbike_info.mday.substring(0,4) +'/'+
                      youbike_info.mday.substring(4,6) +'/'+
                      youbike_info.mday.substring(6,8) +'/'+
                      youbike_info.mday.substring(8,10) +':'+
                      youbike_info.mday.substring(10,12) + '</p>');
        /*
        result.append('<p sta_tot>' + 'Total Number of Bikes: ' + youbike_info.tot + '</p>');
        result.append('<p sta_lat>' + youbike_info.lat + '</p>');
        result.append('<p sta_lng>' + youbike_info.lng + '</p>');
        result.append('<p sta_sareaen>' + youbike_info.sareaen + '</p>');
        result.append('<p sta_snaen>' + youbike_info.snaen + '</p>');
        result.append('<p sta_aren>' + youbike_info.aren + '</p>');
        */
      } else {
        result.append('<p sta_running_status>' + '狀態: ' + '維修中' + '</p>');
      }
      $('.station-status').fadeToggle();
      $('.station-status').html(result).fadeToggle();
    });
  });
})
