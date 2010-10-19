	<script type="text/x-jquery-tmpl" id="layerTemplate" >
			<li><input type="checkbox" style="float:left" id="${$item.getCheckboxID()}" checked="${$item.getChecked()}" />
			<h3 style="margin:0 0 0 25px;padding:0;" >${name}</h3>
			{{if drawingInfo.renderer.type=="simple"}}
				
				{{if drawingInfo.renderer.symbol.type=='esriPMS'}}
					<div style="display:table; margin:10px 5px;" >
					<img  style="padding-right:10px;float:left;display:inline-block;vertical-align:middle;"src="data:${drawingInfo.renderer.symbol.contentType};base64,${drawingInfo.renderer.symbol.imageData}"/>
					<span style="padding:0px 5px 0px 5px;display:table-cell;vertical-align:middle;">${name}</span>
					</div>
				{{else drawingInfo.renderer.symbol.type=='esriSFS'}}
					<div style="display:table;" >
					
					<div style="display:table-cell;width:25px;height:25px;background-color:${$item.getColor(drawingInfo.renderer.symbol.color)};border:${$item.getBorder(drawingInfo.renderer.symbol.outline)};"></div>
					<span style="padding:0px 5px 0px 5px;display:table-cell;vertical-align:middle;" >${name}</span>
					</div>
				{{else drawingInfo.renderer.symbol.type=='esriSMS'}}
					{{if drawingInfo.renderer.symbol.style=="esriSMSCircle"}}
						{{html $item.drawCircle()}}
						<div style="clear:both"></div>
					{{/if}}
				{{/if}}
				
			{{else drawingInfo.renderer.type=='uniqueValue'}}
				
				<ul>
				{{each drawingInfo.renderer.uniqueValueInfos}}
					
					{{if $value.symbol.type=='esriPMS'}}
						<div style="display:table;margin:10px 5px;">
						
						<img src="data:${$value.symbol.contentType};base64,${$value.symbol.imageData}" style="vertical-align:middle;"/>
						<span style="padding:0px 5px 0px 0px;display:table-cell;vertical-align:middle;">${$value.label}</span>
						
						</div>
					{{else $value.symbol.type=='esriSFS'}}
						<li style="display:table; margin:10px 5px;" >
							
							<div style="display:table-cell;vertical-align:middle;width:25px;height:25px;background:${$item.getColor($value.symbol.color)};border:${$item.getBorder($value.symbol.outline)};" ></div>
							<span style="padding:0px 5px 0px 5px;display:table-cell;vertical-align:middle;">${$value.label}</span>
						</li>
					{{else $value.symbol.type=='esriSLS'}}
						<li style="display:table;" >
							
							<div style="margin:8px 5px -15px 5px;;width:25px;height:${$value.symbol.width}px;background:${$item.getColor($value.symbol.color)};"></div>
							<span style="padding:0px 5px 0px 5px;display:table-cell;vertical-align:middle;">${$value.label}</span>
						</li>
					{{/if}}
				{{/each}}
				</ul>
			{{/if}}
			</li>
			<div style="clear:both"/>
	</script>