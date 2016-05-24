var MapModule = (function() {

  var map, baseLayers, overlays, isDrawable;

  var popupTemplate = "<h3>{name}</h3><p>Lat: {lat}, Lng: {lng}</p><p>Size: {acres} acres</p><p>{notes}</p>";

  var init = function() {
    isDrawable = false;

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

    var hotspots = L.esri.featureLayer({
      url: "http://tmservices1.esri.com/arcgis/rest/services/LiveFeeds/MODIS_Thermal/MapServer/0"
    })

    var feature_server_incidents = "http://services1.arcgis.com/CHRAD8xHGZXuIQsJ/arcgis/rest/services/dev_challenge_ia/FeatureServer/0";

    var incidents = L.esri.featureLayer({
      url: feature_server_incidents,
    })

    var markers = [];

    $.getJSON("http://localhost:3000/incidents", function(data) {
      for ( var i = 0; i < data.length; i++ ) {
        var lat = data[i].lat;
        var lng = data[i].lon;
        var name = data[i].name;
        var acres = data[i].acres;
        var notes = data[i].notes;
        var marker = L.marker([lat, lng], data[i]);
        markers.push(marker);
      }

      markers = L.featureGroup(markers);

      markers.bindPopup(function(e){
        props = e.options
        var data = {
          name: props.name,
          acres: props.acres,
          notes: props.notes,
          lat: e.getLatLng().lat,
          lng: e.getLatLng().lng,
        };
        return L.Util.template(popupTemplate, data)
      });

      // markers.addTo(map);
      overlays.markers = markers;
    });

    hotspots.addTo(map);
    incidents.addTo(map);

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

    overlays.hotspots = hotspots;
    overlays.incidents = incidents;
  }

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
      _createIncident(data);
    });
  };

  var _populateLatLng = function(lat, lng) {
    $("#lat").val(lat);
    $("#lon").val(lng);
  }

  var _createIncident = function(data) {
    $.post(
      "http://localhost:3000/incidents",
      data,
      function( response ) {

        var properties = _buildProperties( response.lat, response.lon, response.name, response.acres, response.notes );

        var marker = _buildMarker( properties );
        _addFeature(marker, properties);
    });
  };

  var _buildMarker = function(properties) {
    var marker = L.marker([properties.lat, properties.lng]);
    marker.addTo(map);

    // Bind the popup to the marker
    marker.bindPopup(L.Util.template(popupTemplate, properties));

    return marker;
  }

  var _addFeature = function(marker, properties) {
    // Convert to GeoJSON
    var geo_json_marker = marker.toGeoJSON();
    geo_json_marker.properties = properties;

    // Add to feature layer
    var incidents = overlays.incidents;
    incidents.addFeature(geo_json_marker);
  }

  var _popupHTML = function(properties) {
    return ""
  }

  var _buildProperties = function(lat, lng, name, acres, notes) {
    return {
      lat: lat,
      lng: lng,
      name: name,
      acres: acres,
      notes: notes,
    };
  }

  return {
    init: init,
  };
})();

$( document ).ready( function() {
  if ( $("#mapid").length > 0 ) {
    MapModule.init();
  }
});
