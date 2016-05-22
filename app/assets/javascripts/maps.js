$( document ).ready( function() {
  MapModule.init();
});

var MapModule = (function() {

  var map, baseLayers, overlays;

  var init = function() {
    $.getJSON( "http://ip-api.com/json", function( data ) {
      _initMap(data.lat, data.lon);
      _initBase();
      _initOverlay();
      _initControl();
    });
  };

  var _initMap = function(lat, lon) {
    map = L.map('mapid').setView([lat, lon], 12);
  };

  var _initBase = function() {
    var topo = L.esri.basemapLayer("Topographic");

    topo.addTo(map);

    baseLayers = {
      topo: topo,
    }
  };

  var _initOverlay = function() {
    var hotspots = L.esri.featureLayer({
      url: "http://tmservices1.esri.com/arcgis/rest/services/LiveFeeds/MODIS_Thermal/MapServer/0"
    })

    hotspots.addTo(map);

    overlays = {
      hotspots: hotspots,
    }
  }

  var _initControl = function() {
    L.control.layers(baseLayers, overlays).addTo(map);
  }

  return {
    init: init,
  };
})();
