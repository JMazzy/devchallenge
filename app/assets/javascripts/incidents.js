var APP = APP || {};

APP.Incidents = (function(){
  var incidentLayer;

  var init = function() {
    incidentLayer = L.esri.featureLayer({
      url: "http://services1.arcgis.com/CHRAD8xHGZXuIQsJ/arcgis/rest/services/dev_challenge_ia/FeatureServer/0",
    });
  };

  var getIncidentLayer = function() {
    return incidentLayer;
  };

  var createIncident = function(marker, data) {
    $.post(
      "http://localhost:3000/incidents",
      data,
      function( response ) {
        _addToFeatureLayer(marker, response);
      }
    );
  };

  var updateIncident = function(marker, data) {

    _changeOnFeatureLayer(marker, data.incident);

    $.ajax({
      url: "http://localhost:3000/incidents/" + data.incident.id,
      method: "PATCH",
      data: data,
      success: function( response ) {
        console.log(response);
      },
    });
  };

  var destroyIncident = function(fid, id) {
    _removeFromFeatureLayer(fid);
    $.ajax({
      url: "http://localhost:3000/incidents/" + id,
      method: "DELETE",
      success: function( response ) {
      },
    });
  };

  var _addToFeatureLayer = function(marker, properties) {
    // Convert to GeoJSON
    var geo_json_marker = marker.toGeoJSON();
    geo_json_marker.properties = properties;

    // Add to feature layer
    incidentLayer.addFeature(geo_json_marker);
  };

  var _changeOnFeatureLayer = function(marker, properties) {
    incidentLayer.updateFeature({
      type: 'Feature',
      geometry: marker.toGeoJSON().geometry,
      properties: {FID: properties.fid, Id: properties.id, Name: properties.name, Lat: properties.lat, Lng: properties.lon, Notes: properties.notes, Acres: properties.acres},
    }, function(error, response) {
      console.log(error, response);
    });
  };

  var _removeFromFeatureLayer = function(fid) {
    incidentLayer.deleteFeature(fid);
  };

  return {
    init: init,
    getIncidentLayer: getIncidentLayer,
    createIncident: createIncident,
    updateIncident: updateIncident,
    destroyIncident: destroyIncident,
  };
})();
