dojo.require("esri.layers.FeatureLayer");
var esiDemo ={};
(function(){
  console.log("In demo js");
  var THIS = this;
  var map, basemapUrl, url1, url2, url3, legend;
  basemapUrl = "http://server.arcgisonline.com/ArcGIS/rest/services/World_Topo_Map/MapServer";
  url1 = 'http://sampleserver3.arcgisonline.com/ArcGIS/rest/services/Hydrography/Watershed173811/MapServer';
  url2="http://sampleserver3.arcgisonline.com/ArcGIS/rest/services/Fire/Sheep/MapServer";
  url3="http://sampleserver3.arcgisonline.com/ArcGIS/rest/services/Earthquakes/EarthquakesFromLastSevenDays/MapServer"
  url4="http://sampleserver3.arcgisonline.com/ArcGIS/rest/services/World/Temperature/ImageServer";
  url5="http://sampleserver3.arcgisonline.com/ArcGIS/rest/services/Fire/Sheep/FeatureServer/0";
  url6 = "http://server.arcgisonline.com/ArcGIS/rest/services/USA_Topo_Maps/MapServer";

  var initialExtent = new esri.geometry.Extent({"xmin":-10753431.069899248,"ymin":4624151.391548632,"xmax":-10737799.697614951,"ymax":4635884.47539039,"spatialReference":{"wkid":102100}});
  THIS.load = function(){
    map = new esri.Map("map", {extent:initialExtent});
    console.log("map created");
    var basemap=new esri.layers.ArcGISTiledMapServiceLayer(basemapUrl);
    dojo.connect(basemap, 'onLoad', function(l){
      THIS.legend = $("#toc").agsLegend({map:map,autoLoadTemplates: true});

      map.addLayer(new esri.layers.ArcGISImageServiceLayer(url4));
      map.addLayer(new esri.layers.ArcGISTiledMapServiceLayer(url6));
      map.addLayer(new esri.layers.ArcGISDynamicMapServiceLayer(url1));
      map.addLayer(new esri.layers.ArcGISDynamicMapServiceLayer(url3));
      map.addLayer(new esri.layers.FeatureLayer(url5,
      {
          mode: esri.layers.FeatureLayer.MODE_SNAPSHOT,
          outFields: ["*"]
        }));
      
    });
    map.addLayer(basemap);
    
    bindAjaxEvents();

  };

  function bindAjaxEvents(){
    $("#loading").bind({
      ajaxStart: function() {
                   $( this ).show();
                 },
      ajaxStop: function() {$( this ).hide();}
    });
  };

//resize stuff
  try{
   var resizeTimer;
   $(window).resize(function(evt){
   		console.log("reszing");
	   clearTimeout(resizeTimer);
	    resizeTimer = setTimeout( function() {
	      map.resize();
	      map.reposition();
	    }, 500);
	});
  } catch (e){
    _log(e.message);
  } 
  
}).apply(esiDemo);
dojo.addOnLoad(esiDemo.load);

