(function($){
     var map; 
     //Shell for your plugin code
  $.fn.agsLegend = function(options){
    
    var opts = $.extend({}, $.fn.agsLegend.defaults, options);     
    if (opts.autoLoadTemplates){
      _getTemplates();
    }
    return this.each(function(){
      try{
        $this = $(this);
        map = opts.map;
        dojo.connect(map,'onLayerAdd', _addLayer);
        $this.delegate("input[type='checkbox']", "click", _checkLayerVisibility);
        if (opts.isCollapsible) _makeCollapsible(this);
        _log("Successfully initialized");
        
      } catch (ex){
        _log("ERROR: "+ ex.messsage);
      }
    });
     
    //private methods
    function _handleTemplateResponse(data){
      _log("got the templates");
      var script = document.createElement("script");
      script.style.display="none";
      script.type="text/x-jquery-tmpl";
      script.id="layerTemplate";
      script.text=data;
      $('head').append(script);
    };
    
    // Call to get the Templates 
    // issues an ajax call to opts.templateFileURL
    // and calls opts.onTemplateLoaded if specified
    function _getTemplates(){
       $.ajax({
          url:opts.templateFileURL,
          success:opts.onTemplateLoaded || _handleTemplateResponse
       });

    };

    function _makeCollapsible(wid){
      $( wid).click(function(event){
        var $target = $(event.target);
        if ($target.is('h3')){
          $target.next().slideToggle('slow');
          $target.toggleClass("agsLegendOpen").toggleClass("agsLegendClosed");
        }
      });
    };
    function _isImageService(layer){
      return /ImageServer/i.test(layer.url);
    };
    function _isTiledService(layer){
      return layer.tileInfo;
    };
    function _isFeatureService(layer){
      return /FeatureServer/i.test(layer.url);
    }
    //Dynamic service visiblity is tre different
    function _setVisibilityForDynamicService(layer,ind,visible){
      var visibleLayers = layer.visibleLayers;
      if (visible & visibleLayers.indexOf(ind)==-1){
        visibleLayers.push(ind);
      } 
      else if (!visible & visibleLayers.indexOf(ind)>-1)
      {
        visibleLayers = $.grep(visibleLayers, function(n){
          return n != ind;
        });
      }
      // I get an error if you try to set the visiblity
      // of dynamic layer with an empty array, so, um, don't
      if (visibleLayers.length>0){
        layer.setVisibility(true);
        layer.setVisibleLayers(visibleLayers);
      }
      else
        layer.setVisibility(false);
    };

    //Helper function to perform logging
    function _log(message){
      if (window.console&& window.console.log){
        window.console.log("$.agsLegend: "+ message);
      }
    };

    function _addLayer(layer){
      _log("addLayer: "+ layer.id)
      var $this = $(this), layerInd= layer.layerIndex, url;
      if (layer.id=="layer0")
        return;
      //If it's a FeatureServer, we have to go get each layer
      //ImageServers are different
      url = layer.url;
      if (!_isImageService(layer) && !_isFeatureService(layer)) 
        url +="/layers" 
      _getLayerRenderingInfo(url);
    };
    
    function _getLayerRenderingInfo(url){
      url += "?f=json&callback=?";
      $.getJSON(url, addLayerToTOC);
    };

    function addLayerToTOC(data){
      if ('serviceDataType' in data){
        //Image Service
        $("#imageServiceTemplate").tmpl(data,
          {
            getChecked:_getChecked,
            getCheckboxID:_getCheckboxID,            
          }).appendTo($this);
      }
      else 
        $("#layerTemplate").tmpl((data.layers || data),
        {
          drawCircle: _drawCircle ,
          getColor:_getColor,
          getBorder:  _getBorder,
          getChecked: _getChecked,
          getCheckboxID:_getCheckboxID
        }).appendTo($this);
      };
      
      // Generate the CSS string for the border based on 
      // the symbol info returned from the server
      function _getBorder(outline){
        var col = outline.color;
        if (outline.width==0)
          return 'none';
        var width = (outline.width<1) ? 1 : outline.width;
        var prefix = ($.support.opacity)?"rgba":"rgb";
        var color = (!$.support.opacity)? col[0]+","+col[1]+","+col[2] : col[0]+","+col[1]+","+col[2]+","+col[3];
        return width+"px solid "+ prefix+"("+color+")";
      };
      //Returns the RGB or RGBA color string, based on browser support
      // input is an array of color numbers i.e., [255,255,255,0]
      // Example return value is rgba(255,255,255,0)
      function _getColor(col){
        var prefix = ($.support.opacity)?"rgba":"rgb";
        var color = (!$.support.opacity)? col[0]+","+col[1]+","+col[2] : col[0]+","+col[1]+","+col[2]+","+col[3];
        return  prefix+"("+color+")";
      }
      
      // Draw a circle using Raphael
      // The return value is an HTML list item (<li>) with the 
      // Raphael canvas and the circle rendered
      function _drawCircle(){
        var symId = this.data.name.replace(/\s+/g,"_");
        var li = '<div style="float:left" id="symbol_'+symId+'"><span id="label_'+symId+'">'+this.data.name+'</span></div>';
        var sym=this.data.drawingInfo.renderer.symbol;
        var col = sym.color;
        var size = sym.size+10 ;
        $('#symbol_'+symId).livequery(function(evt){
          console.dir(evt);
             var paper = Raphael('symbol_'+symId,30, size);
              var c =paper.circle(20,size/2,size-10);
              var fill = "rgba("+col[0]+","+col[1]+","+col[2]+","+col[3]+")";

              var outCol = sym.outline.color;
            var stroke =  "rgba("+outCol[0]+","+outCol[1]+","+outCol[2]+","+outCol[3]+")";
             c.attr({
              "fill":fill,
              "stroke":stroke,
              "stroke-width":sym.outline.width
            });
        });
        return li;
      };
      // Return true/false based on default Visibility
      function _getChecked(){
        return (this.data.defaultVisibility) ? "checked":"";
      };
      //Generate the id for our visiblity checkbox
      // appends "_toggle" to the layer name, replacing all spaces with 
      // underscores
      function _getCheckboxID(){
        if (this.data.name==null)
          return "na";
        return this.data.name.replace(/\s/g ,"_") +"_toggle";
      };

      // Handle the visiblity toggle click event
      function _checkLayerVisibility(ev){
        // We'll find the layer based on the name, so capture it
        var nm = /([a-zA-Z0-9_]*)_toggle/.exec(this.id)[1];
        var visible = $(this).attr("checked");
        // Combine layerIds and graphiclaeyrIds (featurelayers use the latter)
        var combindedLayerIds = $.merge([],map.layerIds);
        $.merge(combindedLayerIds, map.graphicsLayerIds);

        // Loop over each layer, and get to work
        $.each(combindedLayerIds, function(ind, layId){
          if (layId=="layer0" && opts.ignoreBasemaps)
            return;
          var lay = map.getLayer(layId);

          if (lay.layerInfos)
          {
            // We're either tiled or dynamic
            $.each(lay.layerInfos, function(ind, lInfo){
                if (lInfo.name.replace(/\s/g,"_")==nm){
                  if (_isTiledService(lay)){
                    // We have a tiled layer
                    lay.setVisibility(visible);
                  } else {
                    // We have a dynamic layer
                    _setVisibilityForDynamicService(lay,ind,visible);
                }
              }
            });
          }
          else 
          {
            // We're either an ImageService or a GraphicsLayer
            if (lay.name.replace(/\s/g,"_")==nm){
              lay.setVisibility(visible);
            }
          }
        });					
      };
        
 }   

 $.fn.agsLegend.defaults = {
      ignoreBasemaps:true,
      autoLoadTemplates: false,
      templateFileURL: "templates.txt",
      onTemplateLoaded: null,
      isCollapsible: true
    };
   
  
  })(jQuery);

//If we are in IE, we have to write our own indexOf function
  if (!Array.indexOf) {
    Array.prototype.indexOf = function (obj, start) {
      for (var i = (start || 0); i < this.length; i++) {
        if (this[i] == obj) {
          return i;
        }
      }
      return -1;
    }
  }	

