var MapModule = (function() {

  var map, baseLayers, overlays, addIncident;

  var init = function() {
    addIncident = false;

    $.getJSON( "http://ip-api.com/json", function( data ) {
      _initMap(data.lat, data.lon);
      _initBase();
      _initOverlay();
      _initControl();
      _clickListener();
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

    var incidents = L.esri.featureLayer({
      url: "http://services1.arcgis.com/CHRAD8xHGZXuIQsJ/arcgis/rest/services/dev_challenge_ia/FeatureServer/0"
    })

    hotspots.addTo(map);
    incidents.addTo(map);

    var popupTemplate = "<h3>{name}</h3><p>Lat: {lat}, Lng: {lng}</p><p>Size: {acres} acres</p><p>{notes}</p>";

    incidents.bindPopup(function(e){
      var props = e.feature.properties;
      var data = {
        name: props.Name,
        acres: props.Acres,
        notes: props.Notes,
        lat: e.getLatLng().lat,
        lng: e.getLatLng().lng,
      };
      return L.Util.template(popupTemplate, data)
    });

    overlays = {
      hotspots: hotspots,
      incidents: incidents,
    }
  }

  var _initControl = function() {
    L.control.layers(baseLayers, overlays).addTo(map);
  }

  var _clickListener = function() {
    map.on("click", function(e) {
      if (addIncident) {
        console.log(e.latlng);
        addIncident = false;
      }
    });

    $("#add-incident-button").on("click", function(e) {
      addIncident = true;
    });
  };

  return {
    init: init,
  };
})();

$( document ).ready( function() {
  MapModule.init();
});
