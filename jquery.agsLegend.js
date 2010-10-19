(function($){
	//Encapsulate our methods
	
		var methods = {
			init: function(options){
				map = options.map
				methods.makeCollapsible($(this));
				//Stupid IE
				methods.checkIndexOf();
				$.extend(options,$.fn.agsLegend.defaults);
				//This is probably bad, but I only want one widget
				this.layerAddListener = dojo.connect(map,'onLayerAdd', dojo.hitch(this,methods.addLayer));
				 $(this).delegate("input[type='checkbox']", "click",function(ev){
				 	
					// We'll find the layer based on the name, so capture it
				 	var nm = /([a-zA-Z0-9_]*)_toggle/.exec(this.id)[1];
				 	var visible = $(this).attr("checked");
				 	
				 	// Loop over each layer, and get to work
				 	$.each(map.layerIds, function(ind, layId){
				 		//TODO: check options.ignoreBaseMaps
				 		if (layId=="layer0")
				 			return;
				 		var lay = map.getLayer(layId);
				 		
				 		$.each(lay.layerInfos, function(ind, lInfo){
				 			
				 			if (lInfo.name.replace(/\s/g,"_")==nm){
				 				if (lay.tileInfo){
				 					// We have a tiled layer
				 					lay.setVisibility(visible);
				 				}else {
				 					// We have a dynamic layer
					 				var vis	= lay.visibleLayers;
					 				if (visible & vis.indexOf(ind)==-1){
					 					vis.push(ind);
					 				} 
					 				else if (!visible & vis.indexOf(ind)>-1)
					 				{
					 					vis = $.grep(vis, function(n){
					 						return n != ind;
					 								
				 						});
					 				}
					 				// I get an error if you try to set the visiblity
					 				// of dynamic layer with an empty array, so, um, don't
					 				if (vis.length>0){
					 					lay.setVisibility(true);
					 					lay.setVisibleLayers(vis);
					 						
				 					}
					 				else
					 					lay.setVisibility(false);
				 				}
			 				}
				 			
			 			});
			 			
			 		});					
					
				});
				return this;
			},
			makeCollapsible:function(wid){
				$(">li>h3", wid).live("click",function(){
					$(this).next().slideToggle('slow');
					$(this).toggleClass("agsLegendOpen").toggleClass("agsLegendClosed");
				});
			},
			checkIndexOf:function(){
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
			},
			addLayer:function(layer){
				var $this = $(this)
				var layerInd= layer.layerIndex;
				if (layer.id=="layer0")
					return;
				$.getJSON(layer.url+"/layers?f=json&callback=?",
					function(data){
						
						$("#layerTemplate").tmpl(data.layers,
							{
								
								drawCircle: function(){
									var sym=this.data.drawingInfo.renderer.symbol;
									var col = sym.color;
									var li = $('<li><div style="float:left" id="symbol_'+this.data.name+'"></div><span id="label_'+this.data.name+'">'+this.data.name+'</span></li>').attr("id",this.data.name).appendTo("#toc");
									var size = sym.size+10 ;
									var paper = Raphael('symbol_'+this.data.name,30, size);
									var c =paper.circle(20,size/2,size-10);
									var fill = "rgba("+col[0]+","+col[1]+","+col[2]+","+col[3]+")";
									
									var outCol = sym.outline.color;
									var stroke =  "rgba("+outCol[0]+","+outCol[1]+","+outCol[2]+","+outCol[3]+")";
									
									c.attr({
										"fill":fill,
										"stroke":stroke,
										"stroke-width":sym.outline.width
									});
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
							}
						)
						.appendTo($this);
					}
				);
			}
			
			
		};
	//Shell for your plugin code
	$.fn.agsLegend = function(method){
		//Plugin code
		if ( methods[method] ) {
	      return methods[method].apply( this, Array.prototype.slice.call( arguments, 1 ));
	    } else if ( typeof method === 'object' || ! method ) {
	      return methods.init.apply( this, arguments );
	    } else {
	      $.error( 'Method ' +  method + ' does not exist on jQuery.agsLegned' );
	    }   
		this.getColor=function(col){
				var prefix = ($.support.opacity)?"rgba":"rgb";
			var color = (!$.support.opacity)? col[0]+","+col[1]+","+col[2] : col[0]+","+col[1]+","+col[2]+","+col[3];
			console.log("returning "+prefix+"("+color+")");
			
			return prefix+"("+color+")";
		};
		
		return this.each(function(){
			// Do something to each item
			
		});
		
	}
	$.fn.agsLegend.defaults = {
		className: 'legend',
		ignoreBaseMaps : true
		
	};		
})(jQuery);