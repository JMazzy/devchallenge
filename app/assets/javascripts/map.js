var APP = APP || {};

APP.MapModule = (function() {

  var map, baseLayers, overlays, isDrawable, incidents, hotspots, hotspotLayer, incidentLayer;

  var popupTemplate = "<a href='/incidents/{id}'><h3>{name}</h3></a><p>Lat: {lat}, Lng: {lon}</p><p>Size: {acres} acres</p><p>{notes}</p><button id='edit-incident-button' class='btn btn-default btn-xs'>Edit</button><button id='delete-incident-button' class='btn btn-danger btn-xs pull-right'>Delete</button>";

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

    hotspotLayer = hotspots.getHotspotLayer();
    hotspotLayer.addTo(map);
    overlays.hotspotLayer = hotspotLayer;

    incidentLayer = incidents.getIncidentLayer();
    incidentLayer.addTo(map);
    _bindPopupToLayer(incidentLayer);
    overlays.incidentLayer = incidentLayer;
  }

  var _bindPopupToLayer = function(layer) {
    layer.bindPopup(function(e){
      var props = e.feature.properties;
      var data = {
        fid: props.FID,
        id: props.Id,
        name: props.Name,
        acres: props.Acres,
        notes: props.Notes,
        lat: e.getLatLng().lat,
        lon: e.getLatLng().lng,
      };
      _popupListeners(e);
      return L.Util.template(popupTemplate, data)
    });
  };

  var _popupListeners = function(popup) {
    popup.on("popupopen", function() {
      $("#edit-incident-button").on("click", function(){
        $('#create-incident-button').hide();
        $('#update-incident-button').show();
        $('#incident-modal').modal()

        var props = popup.feature.properties;

        _populateAll(props.FID, props.Id, popup.getLatLng().lat, popup.getLatLng().lng, props.Name, props.Acres, props.Notes);
      });

      $("#delete-incident-button").on("click", function(e) {
        e.preventDefault();
        var id = popup.feature.properties.Id;
        var fid = popup.feature.properties.FID;
        incidents.destroyIncident(fid, id);
      });
    })
  };

  var _initControl = function() {
    L.control.layers(baseLayers, overlays).addTo(map);
  }

  var _clickListener = function() {
    map.on("click", function(e) {
      if (isDrawable) {
        _populateLatLon(e.latlng.lat, e.latlng.lng);
        isDrawable = false;
        $('#create-incident-button').show();
        $('#update-incident-button').hide();
        $('#incident-modal').modal()
      }
    });

    $("#add-incident-button").on("click", function(e) {
      isDrawable = true;
    });

    $("#create-incident-button").on("click", function(e) {
      e.preventDefault();
      var data = _buildRequestData();
      var marker = _buildMarker( data.incident );
      incidents.createIncident(marker, data);
    });

    $("#update-incident-button").on("click", function(e) {
      e.preventDefault();
      var data = _buildRequestData();
      var marker = _buildMarker( data.incident );
      incidents.updateIncident(marker, data);
      marker.closePopup();
    });

    $(".leaflet-control-layers-selector").change(function(e) {
      var clicked = $(e.target);
      var checked = clicked.is(":checked");
      var text = clicked.next().text();
      if (text === " incidentLayer") {
        checked ? map.addLayer(incidentLayer) : map.removeLayer(incidentLayer);
      } else if ( text == " hotspotLayer") {
        checked ? map.addLayer(hotspotLayer) : map.removeLayer(hotspotLayer);
      }
    });
  };

  var _buildRequestData = function() {
    return {
      incident:  {
        fid: $("#fid").val(),
        id: $("#incident-id").val(),
        name: $("#name").val(),
        acres: $("#acres").val(),
        notes: $("#notes").val(),
        lat: $("#lat").val(),
        lon: $("#lon").val(),
      }
    };
  }

  var _populateLatLon = function(lat, lon) {
    $("#lat").val(lat);
    $("#lon").val(lon);
  }

  var _populateAll = function(fid, id, lat, lon, name, acres, notes) {
    _populateLatLon(lat, lon);
    $("#fid").val(fid);
    $("#incident-id").val(id);
    $("#name").val(name);
    $("#acres").val(acres);
    $("#notes").val(notes);
  }

  var _buildMarker = function(properties) {
    var marker = L.marker([properties.lat, properties.lon]);
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
