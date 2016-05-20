$( document ).ready( function() {

  $.getJSON( "http://ip-api.com/json", function( data ) {
    var lat = data.lat;
    var lon = data.lon;

    var map = L.map('mapid').setView([lat, lon], 12);

    L.esri.basemapLayer("Topographic").addTo(map);

    L.esri.featureLayer({
      url: "http://tmservices1.esri.com/arcgis/rest/services/LiveFeeds/MODIS_Thermal/MapServer/0"
    }).addTo(map);
  });
});
