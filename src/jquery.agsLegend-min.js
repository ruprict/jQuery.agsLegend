var i;(function(h){var w,p,v,c,j;function k(y){if(window.console&&window.console.log){window.console.log("$.agsLegend: "+y)}}function x(y){k("got the templates");v=document.createElement("script");v.style.display="none";v.type="text/x-jquery-tmpl";v.id=p.templateDOMId;v.text=y;h("head").append(v)}function m(){h.ajax({url:p.templateFileURL,success:p.onTemplateLoaded||x})}function l(y){h(y).click(function(z){c=h(z.target);if(c.is("h3")){c.next().slideToggle("slow");c.toggleClass("agsLegendOpen").toggleClass("agsLegendClosed")}})}function o(y){return(/ImageServer/i).test(y.url)}function a(y){return y.tileInfo}function n(y){return(/FeatureServer/i).test(y.url)}function b(y,z,A){j=y.visibleLayers;if(A&&j.indexOf(z)===-1){j.push(z)}else{if(!A&&j.indexOf(z)>-1){j=h.grep(j,function(B){return B!==z})}}if(j.length>0){y.setVisibility(true);y.setVisibleLayers(j)}else{y.setVisibility(false)}}function f(){var A=this.data.name.replace(/\s+/g,"_"),D="symbol_"+A,y='<div style="float:left" id="'+D+'"><span id="label_'+A+'">'+this.data.name+"</span></div>",z=this.data.drawingInfo.renderer.symbol,B=z.color,C=z.size+10;h("#"+D).livequery(function(E){h("#"+D).expire();var I=Raphael("symbol_"+A,30,C),J=I.circle(20,C/2,C-10),H="rgba("+B[0]+","+B[1]+","+B[2]+","+B[3]+")",F=z.outline.color,G="rgba("+F[0]+","+F[1]+","+F[2]+","+F[3]+")";J.attr({fill:H,stroke:G,"stroke-width":z.outline.width})});return y}function e(z){if(z===null){z=[0,0,0,0]}var A=(h.support.opacity)?"rgba":"rgb",y=(!h.support.opacity)?z[0]+","+z[1]+","+z[2]:z[0]+","+z[1]+","+z[2]+","+z[3];return A+"("+y+")"}function t(z){if(z.width===0){return"none"}var y=(z.width<1)?1:z.width;return y+"px solid "+e(z.color)}function r(){return(this.data.defaultVisibility)?"checked":""}function g(){if(this.data.name===null){return"na"}return this.data.name.replace(/\s/g,"_")+"_toggle"}function d(y){h("#"+p.templateDOMId).tmpl((y.layers||y),{drawCircle:f,getColor:e,getBorder:t,getChecked:r,getCheckboxID:g}).prependTo($this)}function s(y){y+="?f=json&callback=?";h.getJSON(y,d)}function u(z){k("addLayer: "+z.id);var A=h(this),y;if(z.id==="layer0"&&p.ignoreBasemaps){return}y=z.url;if(!o(z)&&!n(z)){y+="/layers"}s(y)}function q(B){var y=(/([a-zA-Z0-9_]*)_toggle/).exec(this.id)[1],C=h(this).attr("checked"),A=h.merge([],w.layerIds),z;h.merge(A,w.graphicsLayerIds);h.each(A,function(E,D){if(D==="layer0"&&p.ignoreBasemaps){return}z=w.getLayer(D);if(z.layerInfos){h.each(z.layerInfos,function(G,F){if(F.name.replace(/\s/g,"_")===y){if(a(z)){z.setVisibility(C)}else{b(z,G,C)}}})}else{if(z.name.replace(/\s/g,"_")===y){z.setVisibility(C)}}})}h.fn.agsLegend=function(y){p=h.extend({},h.fn.agsLegend.defaults,y);if(p.autoLoadTemplates){m()}return this.each(function(){try{$this=h(this);w=p.map;dojo.connect(w,"onLayerAdd",u);$this.delegate("input[type='checkbox']","click",q);if(p.isCollapsible){l(this)}k("Successfully initialized")}catch(z){k("ERROR: "+z.messsage)}})};h.fn.agsLegend.defaults={ignoreBasemaps:true,autoLoadTemplates:false,templateFileURL:"templates.txt",onTemplateLoaded:null,isCollapsible:true,templateDOMId:"layerTemplate"}}(jQuery));if(!Array.indexOf){Array.prototype.indexOf=function(a,b){for(i=(b||0);i<this.length;i++){if(this[i]===a){return i}}return -1}};
