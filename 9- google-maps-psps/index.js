function initialize() {
  var mapOptions = {
    zoom: 10,

    //estado inicial en bsas - (se puede custom)
    center: new google.maps.LatLng(-34.6132, -58.3774),

    //tipos ROADMAP, SATELLITE, HYBRID, TERRAIN
    mapTypeId: google.maps.MapTypeId.ROADMAP,

    minZoom: 2,
  };

  var map = new google.maps.Map(document.getElementById('map'), mapOptions);
  var infoWindow = new google.maps.InfoWindow();

  //marcador - (se puede custom)
  var marker = new google.maps.Marker({
    position: new google.maps.LatLng(-41.134258, -71.308525),
    map: map,
    title: 'Bariloche, Argentina',
  });

  //click event listener
  marker.addListener('click', function () {
    infoWindow.setContent(marker.title);
    infoWindow.open(map, marker);
  });

  google.maps.event.addDomListener(window, 'resize', function () {
    map.setCenter(mapOptions.center);
  });
}

google.maps.event.addDomListener(window, 'load', initialize);
