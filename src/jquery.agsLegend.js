var i;
(function ($) {
    var map, opts, script, $target, visibleLayers;

    //private methods
    //Helper function to perform logging
    function log(message) {
        if (window.console && window.console.log) {
            window.console.log("$.agsLegend: " + message);
        }
    }
    function handleTemplateResponse(data) {
        log("got the templates");
        script = document.createElement("script");
        script.style.display = "none";
        script.type = "text/x-jquery-tmpl";
        script.id = opts.templateDOMId;
        script.text = data;
        $('head').append(script);
    }

    // Call to get the Templates 
    // issues an ajax call to opts.templateFileURL
    // and calls opts.onTemplateLoaded if specified
    function getTemplates() {
        $.ajax({
            url: opts.templateFileURL,
            success: opts.onTemplateLoaded || handleTemplateResponse
        });
    }

    function makeCollapsible(wid) {
        $(wid).click(function (event) {
            $target = $(event.target);
            if ($target.is('h3')) {
                $target.next().slideToggle('slow');
                $target.toggleClass("agsLegendOpen").toggleClass("agsLegendClosed");
            }
        });
    }
    function isImageService(layer) {
        return (/ImageServer/i).test(layer.url);
    }
    function isTiledService(layer) {
        return layer.tileInfo;
    }
    function isFeatureService(layer) {
        return (/FeatureServer/i).test(layer.url);
    }
    //Dynamic service visiblity is tre different
    function setVisibilityForDynamicService(layer, ind, visible) {
        visibleLayers = layer.visibleLayers;
        if (visible && visibleLayers.indexOf(ind) === -1) {
            visibleLayers.push(ind);
        } else if (!visible && visibleLayers.indexOf(ind) > -1) {
            visibleLayers = $.grep(visibleLayers, function (n) {
                return n !== ind;
            });
        }
        // I get an error if you try to set the visiblity
        // of dynamic layer with an empty array, so, um, don't
        if (visibleLayers.length > 0) {
            layer.setVisibility(true);
            layer.setVisibleLayers(visibleLayers);
        } else {
            layer.setVisibility(false);
        }
    }
   // Draw a circle using Raphael
    // The return value is an HTML list item (<li>) with the 
    // Raphael canvas and the circle rendered
    function drawCircle() {
        var symId = this.data.name.replace(/\s+/g, "_"),
            widgetID = "symbol_" + symId,
            li = '<div style="float:left" id="' + widgetID + '"><span id="label_' + symId + '">' + this.data.name + '</span></div>',
            sym = this.data.drawingInfo.renderer.symbol,
            col = sym.color,
            size = sym.size + 10;
        $('#' + widgetID).livequery(function (evt) {
            $('#' + widgetID).expire();
            var paper = Raphael('symbol_' + symId, 30, size),
                c = paper.circle(20, size / 2, size - 10),
                fill = "rgba(" + col[0] + "," + col[1] + "," + col[2] + "," + col[3] + ")",
                outCol = sym.outline.color,
                stroke = "rgba(" + outCol[0] + "," + outCol[1] + "," + outCol[2] + "," + outCol[3] + ")";
            c.attr({
                "fill" : fill,
                "stroke" : stroke,
                "stroke-width" : sym.outline.width
            });
        });
        return li;
    }
        
    //Returns the RGB or RGBA color string, based on browser support
    // input is an array of color numbers i.e., [255,255,255,0]
    // Example return value is rgba(255,255,255,0)
    function getColor(col) {
        if (col===null){
          col = [0,0,0,0];
        }
        var prefix = ($.support.opacity) ? "rgba" : "rgb",
            color = (!$.support.opacity) ? col[0] + "," + col[1] + "," + col[2] : col[0] + "," + col[1] + "," + col[2] + "," + col[3];
        return prefix + "(" + color + ")";
    }
    
    // Generate the CSS string for the border based on 
    // the symbol info returned from the server
    function getBorder(outline) {
        if (outline.width === 0) {
            return 'none';
        }
        var width = (outline.width < 1) ? 1 : outline.width;
        return width + "px solid " + getColor(outline.color);
    }

    // Return true/false based on default Visibility
    function getChecked() {
        return (this.data.defaultVisibility) ? "checked" : "";
    }

    //Generate the id for our visiblity checkbox
    // appends "_toggle" to the layer name, replacing all spaces with 
    // underscores
    function getCheckboxID() {
        if (this.data.name === null) {
            return "na";
        }
        return this.data.name.replace(/\s/g, "_") + "_toggle";
    }

    function addLayerToTOC(data) {
        $("#"+opts.templateDOMId).tmpl((data.layers || data),
            {
                drawCircle: drawCircle,
                getColor: getColor,
                getBorder:  getBorder,
                getChecked: getChecked,
                getCheckboxID: getCheckboxID
            }).prependTo($this);
    }

    function getLayerRenderingInfo(url) {
        url += "?f=json&callback=?";
        $.getJSON(url, addLayerToTOC);
    }
    
    function addLayer(layer) {
        log("addLayer: " + layer.id);
        var $this = $(this), url;
        if (layer.id === "layer0" && opts.ignoreBasemaps) {
            return;
        }
        //If it's a FeatureServer, we have to go get each layer
        //ImageServers are different
        url = layer.url;
        if (!isImageService(layer) && !isFeatureService(layer)) {
            url += "/layers";
        }
        getLayerRenderingInfo(url);
    }
    
    // Handle the visiblity toggle click event
    function checkLayerVisibility(ev) {
        // We'll find the layer based on the name, so capture it
        var nm = (/([a-zA-Z0-9_]*)_toggle/).exec(this.id)[1],
            visible = $(this).attr("checked"),
            // Combine layerIds and graphiclaeyrIds (featurelayers use the latter)
            combindedLayerIds = $.merge([], map.layerIds),
            lay;
        $.merge(combindedLayerIds, map.graphicsLayerIds);

        // Loop over each layer, and get to work
        $.each(combindedLayerIds, function (ind, layId) {
            if (layId === "layer0" && opts.ignoreBasemaps) {
                return;
            }
            lay = map.getLayer(layId);

            if (lay.layerInfos) {
                // We're either tiled or dynamic
                $.each(lay.layerInfos, function (ind, lInfo) {
                    if (lInfo.name.replace(/\s/g, "_") === nm) {
                        if (isTiledService(lay)) {
                            // We have a tiled layer
                            lay.setVisibility(visible);
                        } else {
                            // We have a dynamic layer
                            setVisibilityForDynamicService(lay, ind, visible);
                        }
                    }
                });
            } else {
                // We're either an ImageService or a GraphicsLayer
                if (lay.name.replace(/\s/g, "_") === nm) {
                    lay.setVisibility(visible);
                }
            }
        });					
    }

     //Shell for your plugin code
    $.fn.agsLegend = function (options) {
        opts = $.extend({}, $.fn.agsLegend.defaults, options);     
        if (opts.autoLoadTemplates) {
            getTemplates();
        }
        return this.each(function () {
            try {
                $this = $(this);
                map = opts.map;
                dojo.connect(map, 'onLayerAdd', addLayer);
                $this.delegate("input[type='checkbox']", "click", checkLayerVisibility);
                if (opts.isCollapsible) { makeCollapsible(this); }
                log("Successfully initialized");
        
            } catch (ex) {
                log("ERROR: " + ex.messsage);
            }
        });
    };   

    $.fn.agsLegend.defaults = {
        ignoreBasemaps: true,
        autoLoadTemplates: false,
        templateFileURL: "templates.txt",
        onTemplateLoaded: null,
        isCollapsible: true,
        templateDOMId: "layerTemplate"
    };
  
}(jQuery));

//If we are in IE, we have to write our own indexOf function
if (!Array.indexOf) {
    Array.prototype.indexOf = function (obj, start) {
        for (i = (start || 0); i < this.length; i++) {
            if (this[i] === obj) {
                return i;
            }
        }
        return -1;
    };
}	

