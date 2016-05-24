var APP = APP || {};

APP.MapModule = (function() {

  var map, baseLayers, overlays, isDrawable, incidents, hotspots;

  var popupTemplate = "<h3>{name}</h3><p>Lat: {lat}, Lng: {lng}</p><p>Size: {acres} acres</p><p>{notes}</p>";

  var init = function(incidentsModule, hotspotsModule) {
    isDrawable = false;

    incidents = incidentsModule;
    incidents.init();

    hotspots = hotspotsModule;
    hotspots.init();

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
    overlays = {};

    var hotspotLayer = hotspots.getHotspotLayer();

    var incidentLayer = incidents.getIncidentLayer();

    hotspotLayer.addTo(map);
    incidentLayer.addTo(map);

    _bindPopupToLayer(incidentLayer);

    overlays.hotspotLayer = hotspotLayer;
    overlays.incidentLayer = incidentLayer;
  }

  var _bindPopupToLayer = function(layer) {
    layer.bindPopup(function(e){
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
  };

  var _initControl = function() {
    L.control.layers(baseLayers, overlays).addTo(map);
  }

  var _clickListener = function() {
    map.on("click", function(e) {
      if (isDrawable) {
        console.log(e)
        _populateLatLng(e.latlng.lat, e.latlng.lng);
        isDrawable = false;
      }
    });

    $("#add-incident-button").on("click", function(e) {
      isDrawable = true;
    });

    $("#submit-incident-button").on("click", function(e) {
      e.preventDefault();
      var data = {  incident:  {
                        name: $("#name").val(),
                        acres: $("#acres").val(),
                        notes: $("#notes").val(),
                        lat: $("#lat").val(),
                        lon: $("#lon").val(), } };
      var marker = _buildMarker( data.incident );
      incidents.createIncident(marker, data);
    });
  };

  var _populateLatLng = function(lat, lng) {
    $("#lat").val(lat);
    $("#lon").val(lng);
  }

  var _buildMarker = function(properties) {
    var marker = L.marker([properties.lat, properties.lng]);
    marker.addTo(map);

    // Bind the popup to the marker
    marker.bindPopup(L.Util.template(popupTemplate, properties));

    return marker;
  }

  return {
    init: init,
  };
})();

$( document ).ready( function() {
  if ( $("#mapid").length > 0 ) {
    APP.MapModule.init(APP.Incidents, APP.Hotspots);
  }
});
