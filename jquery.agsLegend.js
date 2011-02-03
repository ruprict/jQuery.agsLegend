(function($){
      
     //Shell for your plugin code
  $.fn.agsLegend = function(options){
    
    var opts = $.extend({}, $.fn.agsLegend.defaults, options);     
    if (opts.autoLoadTemplates){
      getTemplates();
    }
    return this.each(function(){
      try{
        $this = $(this);
        map = opts.map;
        dojo.connect(map,'onLayerAdd', dojo.hitch(this, addLayer));
        log("listener added");
        $this.delegate("input[type='checkbox']", "click", checkLayerVisibility);
        log("returning");
        makeCollapsible(this);
        
      } catch (ex){
        log("ERROR: "+ ex.messsage);
      }
    });
     
    //private methods
    function handleTemplateResponse(data){
      log("got the templates");
      var script = document.createElement("script");
      script.style.display="none";
      script.type="text/x-jquery-tmpl";
      script.id="layerTemplate";
      script.text=data;
      $('head').append(script);
    };
 
    function getTemplates(){
       $.ajax({
          url:opts.templateFileURL,
          success:opts.onTemplateLoaded || handleTemplateResponse
       });

    };
    

    function makeCollapsible(wid){
      $( wid).click(function(event){
        var $target = $(event.target);
        if ($target.is('h3')){
          $target.next().slideToggle('slow');
          $target.toggleClass("agsLegendOpen").toggleClass("agsLegendClosed");
        }
      });
    };
    function isImageService(layer){
      return /ImageServer/.test(layer.url);
    };
    function isTiledService(layer){
      return layer.tileInfo;
    };
    //Dynamic service visiblity is tre different
    function setVisibilityForDynamicService(layer,ind,visible){
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
    function log(message){
      if (window.console&& window.console.log){
        window.console.log("$.agsLegend: "+ message);
      }
    };

    function addLayer(layer){
      log("addLayer: "+ layer.id)
      var $this = $(this);
      var layerInd= layer.layerIndex;
      if (layer.id=="layer0")
        return;
      //ImageServers are different
      var url = isImageService(layer) ? layer.url:layer.url+"/layers";
      url += "?f=json&callback=?";
      $.getJSON(url,
        function(data){
          if ('serviceDataType' in data){
            //Image Service
            $("#imageServiceTemplate").tmpl(data,
              {
                getChecked:function()
                {
                  return (this.data.defaultVisibility) ? "checked":"";
                },
                getCheckboxID:function()
                {
                if (this.data.name==null)
                  return "na";
                return this.data.name.replace(/\s/g ,"_") +"_toggle";
              }
            }).appendTo($this);
          }						
          else 
            $("#layerTemplate").tmpl(data.layers,
            {
              drawCircle: function(){
                var symId = this.data.name.replace(/\s+/g,"_");
                var sym=this.data.drawingInfo.renderer.symbol;
                var col = sym.color;
                var li = $('<li><div style="float:left" id="symbol_'+symId+'"></div></li>').attr("id",symId).appendTo("#toc");
                var span = '<span id="label_'+symId+'">'+this.data.name+'</span>';
                var size = sym.size+10 ;
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
                $("#symbol_"+symId).append(span);
                var html= $(li).html();
                li.remove();
                return html;
              },
              getColor:function(col){
                var prefix = ($.support.opacity)?"rgba":"rgb";
                var color = (!$.support.opacity)? col[0]+","+col[1]+","+col[2] : col[0]+","+col[1]+","+col[2]+","+col[3];
                return  prefix+"("+color+")";
              },
              getBorder: function(outline){
                var col = outline.color;
                if (outline.width==0)
                  return 'none';
                var width = (outline.width<1) ? 1 : outline.width;
                var prefix = ($.support.opacity)?"rgba":"rgb";
                var color = (!$.support.opacity)? col[0]+","+col[1]+","+col[2] : col[0]+","+col[1]+","+col[2]+","+col[3];
                return width+"px solid "+ prefix+"("+color+")";
              }, 
              getChecked:function(){
                return (this.data.defaultVisibility) ? "checked":"";
              },
              getCheckboxID:function(){
                if (this.data.name==null)
                  return "na";
                return this.data.name.replace(/\s/g ,"_") +"_toggle";
              }
            }).appendTo($this);
          }
        );
      };
      function checkLayerVisibility(ev){
        // We'll find the layer based on the name, so capture it
        var nm = /([a-zA-Z0-9_]*)_toggle/.exec(this.id)[1];
        var visible = $(this).attr("checked");

        // Loop over each layer, and get to work
        $.each(map.layerIds, function(ind, layId){
          if (layId=="layer0" && opts.ignoreBasemaps)
            return;
          var lay = map.getLayer(layId);
          if (isImageService(lay))
          {
            lay.setVisibility(visible);
          }
          else 
          {
            $.each(lay.layerInfos, function(ind, lInfo){
                if (lInfo.name.replace(/\s/g,"_")==nm){
                  if (isTiledService(lay)){
                    // We have a tiled layer
                    lay.setVisibility(visible);
                  } else {
                    // We have a dynamic layer
                    setVisibilityForDynamicService(lay,ind,visible);
                }
              }
            });
          }
        });					
      };
        
    //Generate the color for the widget based on what the browser supports
    $.fn.agsLegend.getColor=function(col){
      var prefix = ($.support.opacity)?"rgba":"rgb";
      var color = (!$.support.opacity)? col[0]+","+col[1]+","+col[2] : col[0]+","+col[1]+","+col[2]+","+col[3];
      log("returning "+prefix+"("+color+")");

      return prefix+"("+color+")";
    };
 }   
 $.fn.agsLegend.defaults = {
      ignoreBasemaps:true,
      autoLoadTemplates: false,
      templateFileURL: "templates.txt",
      onTemplateLoaded: null
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

