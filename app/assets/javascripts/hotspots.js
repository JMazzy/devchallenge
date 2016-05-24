var APP = APP || {};

APP.Hotspots = (function(){
  var hotspotLayer;

  var init = function() {
    hotspotLayer = L.esri.featureLayer({
      url: "http://tmservices1.esri.com/arcgis/rest/services/LiveFeeds/MODIS_Thermal/MapServer/0"
    })
  };

  var getHotspotLayer = function() {
    return hotspotLayer;
  };

  return {
    init: init,
    getHotspotLayer: getHotspotLayer,
  };
})();
