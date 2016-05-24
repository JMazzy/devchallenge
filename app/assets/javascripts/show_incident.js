var APP = APP || {};

APP.ShowIncidentModule = (function() {
  var map;

  var init = function() {
    var lat = Number($(".lat").text());
    var lon = Number($(".lon").text());
    _initMap(lat,lon);
    _initBase();
    _addMarker(lat,lon);
  };

  var _initMap = function(lat, lon) {
    map = L.map('incident').setView([lat, lon], 14);
  };

  var _initBase = function() {
    var topo = L.esri.basemapLayer("Topographic");
    topo.addTo(map);
  }

  var _addMarker = function(lat, lon) {
    L.marker([lat, lon]).addTo(map);
  }

  return {
    init: init,
  };
})();

$( document ).ready( function() {
  if ( $("#incident").length > 0 ) {
    APP.IncidentModule.init();
  }
});
