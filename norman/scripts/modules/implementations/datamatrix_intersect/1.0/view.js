 /*
 * view.js
 * version: dev
 *
 * Copyright 2012 Norman Pellet - norman.pellet@epfl.ch
 * Dual licensed under the MIT or GPL Version 2 licenses.
 */


if(typeof CI.Module.prototype._types.datamatrix_intersect == 'undefined')
	CI.Module.prototype._types.datamatrix_intersect = {};

CI.Module.prototype._types.datamatrix_intersect.View = function(module) {
	this.module = module;
}

CI.Module.prototype._types.datamatrix_intersect.View.prototype = {
	
	init: function() {	
		this.dom = $("<div />").appendTo(this.module.getDomContent());
	},
	
	onResize: function() {
		var rowLabels = this.getDom().find('dt');
		rowLabels.css({width:"auto"});
		var maxLabelWidth = Math.max.apply( null, rowLabels.map( function () {
				return $( this ).outerWidth( true );
			}).get());
		rowLabels.css({width:maxLabelWidth+"px"});
	},
	
	update: function() {
		
		html = [];
		var moduleValue = this.module.getValue();
		
		for(var i in moduleValue) {
			
			html.push('<dl class="ci-intersect ci-intersect-' + i + '">');
			
			html.push('<div>');
			html.push(this.getLabel(i));
			html.push('</div>');
			
			for(var j in moduleValue[i]) {
				html.push('<dt>');
				html.push(this.getLabel(j));
				html.push('</dt><dd>');
				html.push(CI.toScreen(moduleValue[i][j], j, this));
				html.push('</dd><br/>');
			}
			
			html.push('</dl>');
		}
		
		this.getDom().html(html.join(''));
		this.onResize();
		CI.Grid.checkModuleSize(this.module);
	},
	
	getDom: function() {
		return this.dom;
	},
	
	getLabel: function(key) {
		var val;
		if(typeof (val = this.module.definition.dataModule.labels[key]) !== "undefined")
			return val;
			
		return key;
	}
}
