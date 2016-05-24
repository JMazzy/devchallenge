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

  var updateIncident = function() {

  };

  var destroyIncident = function() {

  };

  var _addToFeatureLayer = function(marker, properties) {
    // Convert to GeoJSON
    var geo_json_marker = marker.toGeoJSON();
    geo_json_marker.properties = properties;

    // Add to feature layer
    var incidents = overlays.incidents;
    incidents.addFeature(geo_json_marker);
  };

  var _changeOnFeatureLayer = function() {

  };

  var _removeFromFeatureLayer = function() {

  };

  return {
    init: init,
    getIncidentLayer: getIncidentLayer,
    createIncident: createIncident,
    updateIncident: updateIncident,
    destroyIncident: destroyIncident,
  };
})();
