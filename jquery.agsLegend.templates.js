			<input type="checkbox" style="float:left" id="${id}_toggle" /><h3 style="margin:0 0 0 25px;padding:0;">${name}</h3>
			{{if drawingInfo.renderer.type=="simple"}}
				
				{{if drawingInfo.renderer.symbol.type=='esriPMS'}}
					<li style="display:table;" >
					
					<span style="padding:0px 5px 0px 0px;display:table-cell;vertical-align:middle;">${name}</span>
					<img  style="vertical-align:middle;"src="data:${drawingInfo.renderer.symbol.contentType};base64,${drawingInfo.renderer.symbol.imageData}"/>
					
					</li>
				{{else drawingInfo.renderer.symbol.type=='esriSFS'}}
					<li style="display:table;" >
					
					<div style="display:table-cell;width:25px;height:25px;background-color:${$item.getColor()};border:${$item.getBorder(drawingInfo.renderer.symbol.outline)};"></div>
					<span style="padding:0px 5px 0px 5px;display:table-cell;vertical-align:middle;" >${name}</span>
					</li>
				{{else drawingInfo.renderer.symbol.type=='esriSMS'}}
					{{if drawingInfo.renderer.symbol.style=="esriSMSCircle"}}
						{{html $item.drawCircle()}}
					{{/if}}
				{{/if}}
				
			{{else drawingInfo.renderer.type=='uniqueValue'}}
				
				<ul>
				{{each drawingInfo.renderer.uniqueValueInfos}}
					
					{{if $value.symbol.type=='esriPMS'}}
						<li style="display:table;margin:10px 5px;">
						
						<img src="data:${$value.symbol.contentType};base64,${$value.symbol.imageData}" style="vertical-align:middle;"/>
						<span style="padding:0px 5px 0px 0px;display:table-cell;vertical-align:middle;">${$value.label}</span>
						
						</li>
					{{else $value.symbol.type=='esriSFS'}}
						<li style="display:table; margin:10px 5px;" >
							
							<div style="display:table-cell;vertical-align:middle;width:25px;height:25px;background:${$value.getColor()};border:${$item.getBorder($value.symbol.outline)};" ></div>
							<span style="padding:0px 5px 0px 5px;display:table-cell;vertical-align:middle;">${$value.label}</span>
						</li>
					{{else $value.symbol.type=='esriSLS'}}
						<li style="display:table;" >
							
							<div style="margin:8px 5px -15px 5px;;width:25px;height:${$value.symbol.width}px;background:${$value.getColor()};"></div>
							<span style="padding:0px 5px 0px 5px;display:table-cell;vertical-align:middle;">${$value.label}</span>
						</li>
					{{/if}}
				{{/each}}
				</ul>
			{{/if}}