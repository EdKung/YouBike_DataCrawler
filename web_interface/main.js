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

  $('#BtnShowFiveNearSta').on('click', function(event) {
    var eID = document.getElementById("staDropDownList");
    var eSno = eID.options[eID.selectedIndex].value;
    var eSta = eID.options[eID.selectedIndex].text;
    $.getJSON('/nearYouBike/' + eSno, function(near_youbikeSta) {
      //console.log(near_youbikeSta);
      var result = $('<div></div>');
      result.append('<p>離此捷運站最近的五個UBike站資訊</p>')
      result.append('<p result1>' + '最近: ' + near_youbikeSta[0].sno + '-' + near_youbikeSta[0].sna + '<br>距離: ' + near_youbikeSta[0].dist + '公尺' + '<br>可借車輛: '+  near_youbikeSta[0].sbi +  '<br>可停空位: ' +  near_youbikeSta[0].bemp +'</p><br>');
      result.append('<p result2>' + '第二: ' + near_youbikeSta[1].sno + '-' + near_youbikeSta[1].sna + '<br>距離: ' + near_youbikeSta[1].dist + '公尺' + '<br>可借車輛: '+  near_youbikeSta[1].sbi +  '<br>可停空位: ' +  near_youbikeSta[1].bemp +'</p><br>');
      result.append('<p result3>' + '第三: ' + near_youbikeSta[2].sno + '-' + near_youbikeSta[2].sna + '<br>距離: ' + near_youbikeSta[2].dist + '公尺' + '<br>可借車輛: '+  near_youbikeSta[2].sbi +  '<br>可停空位: ' +  near_youbikeSta[2].bemp +'</p><br>');
      result.append('<p result4>' + '第四: ' + near_youbikeSta[3].sno + '-' + near_youbikeSta[3].sna + '<br>距離: ' + near_youbikeSta[3].dist + '公尺' + '<br>可借車輛: '+  near_youbikeSta[3].sbi +  '<br>可停空位: ' +  near_youbikeSta[3].bemp +'</p><br>');
      result.append('<p result5>' + '第五: ' + near_youbikeSta[4].sno + '-' + near_youbikeSta[4].sna + '<br>距離: ' + near_youbikeSta[4].dist + '公尺' + '<br>可借車輛: '+  near_youbikeSta[4].sbi +  '<br>可停空位: ' +  near_youbikeSta[4].bemp +'</p><br>');
      $('.station-status').fadeToggle();
      $('.station-status').html(result).fadeToggle();
    });
  });

  $('#BtnShowTheNearestSta').on('click', function(event) {
    var eID = document.getElementById("staDropDownList");
    var eSno = eID.options[eID.selectedIndex].value;
    var eSta = eID.options[eID.selectedIndex].text;
    $.getJSON('/nearYouBike/' + eSno, function(near_youbikeSta) {
      //console.log(near_youbikeSta);
      var result = $('<div></div>');
      result.append('<p>離此捷運站最近的UBike站資訊</p>')
      result.append('<p result1>' + near_youbikeSta[0].sno + '-' + near_youbikeSta[0].sna + '<br>距離: ' + near_youbikeSta[0].dist + '公尺' + '<br>可借車輛: '+  near_youbikeSta[0].sbi +  '<br>可停空位: ' +  near_youbikeSta[0].bemp +'</p><br>');
            $('.station-status').fadeToggle();
      $('.station-status').html(result).fadeToggle();
    });
  });

  $('#BtnSelectSta').on('click', function(event) {
    var eID = document.getElementById("staDropDownList");
    var eSno = eID.options[eID.selectedIndex].value;
    var eSta = eID.options[eID.selectedIndex].text;
    $.getJSON('/youbike/' + eSno, function(youbike_info) {
      //console.log(youbike_info);
      var result = $('<div></div>');
      result.append('<p sta_id>' + '編號: ' + youbike_info.sno + '</p>');
      result.append('<p sta_num>' + '站名: ' + youbike_info.sna + '</p>');
      if(youbike_info.act == 1) {
        result.append('<p sta_running_status>' + '狀態: ' + '運作中' + '</p>');
        result.append('<p sta_sarea>' + '區域: ' + youbike_info.sarea + '</p>');
        result.append('<p sta_ar>' + '位置: ' + youbike_info.ar + '</p>');
        result.append('<p sta_sbi>' + '可借車輛: '+  youbike_info.sbi + '</p>');
        result.append('<p sta_bemp>' + '可停空位: '+  youbike_info.bemp + '</p>');
        result.append('<p sta_mday>' + '更新時間: '+
                      youbike_info.mday.substring(0,4) +'.'+
                      youbike_info.mday.substring(4,6) +'.'+
                      youbike_info.mday.substring(6,8) +' '+
                      youbike_info.mday.substring(8,10) +':'+
                      youbike_info.mday.substring(10,12) + '</p>');
      } else {
        result.append('<p sta_running_status>' + '狀態: ' + '維修中' + '</p>');
      }
      $('.station-status').fadeToggle();
      $('.station-status').html(result).fadeToggle();
    });
  });
})
