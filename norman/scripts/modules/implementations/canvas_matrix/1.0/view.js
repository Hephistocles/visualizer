 /*
 * view.js
 * version: dev
 *
 * Copyright 2012 Norman Pellet - norman.pellet@epfl.ch
 * Dual licensed under the MIT or GPL Version 2 licenses.
 */


if(typeof CI.Module.prototype._types.canvas_matrix == 'undefined')
	CI.Module.prototype._types.canvas_matrix = {};

CI.Module.prototype._types.canvas_matrix.View = function(module) {
	this.module = module;
}

CI.Module.prototype._types.canvas_matrix.View.prototype = {
	
	init: function() {	
		
		this.canvas = document.createElement("canvas"); // Store the pointer
		this.canvasContext = this.canvas.getContext('2d'); // Store the context
		this.lastCanvasWidth = 0;
		this.lastCanvasHeight = 0;

		this.dom = document.createElement("div");
		var title = document.createElement("h3");
		
		this._domTitle = title;
		
		var table = document.createElement("table");
		var tr = document.createElement("tr");
		var td = document.createElement("td");
		
		this.dom.appendChild(title);
		this.dom.appendChild(table);
		
		table.appendChild(tr);
		tr.appendChild(td);
		
		td.appendChild(this.canvas);

		this.module.getDomContent().html(this.dom);
		
		
		this.worker = new Worker('./scripts/modules/implementations/canvas_matrix/1.0/worker.js');
		var view = this;
		this.worker.addEventListener('message', function(event) {
			view.canvasContext.putImageData(event.data, 0, 0);
		});
		this.gridImage = this.canvasContext.createImageData(this.canvas.width, this.canvas.height);
		this.updateCanvas();
	},
	
	onResize: function() {
		
		var height = this.module.getDomContent().parent().height() - this.module.getDomContent().find('h3').outerHeight(true);
		
		var table = this.module.getDomContent().find('table').height(height);
		// Set the canvas to full width and height
		var moduleWidth = table.width();
		var moduleHeight = table.height();
		
		var size = Math.min(moduleWidth, moduleHeight);
		
		if(this.rowNumber == undefined || this.colNumber == undefined)
			return;
		
		this.cellHeight = Math.floor(size / this.rowNumber);
		this.cellWidth = Math.floor(size / this.colNumber); 
		
		var newWidth = this.cellWidth * this.colNumber;
		var newHeight = this.cellHeight * this.rowNumber;
		
		
		if(newWidth != this.lastCanvasWidth || newHeight != this.lastCanvasHeight) {
			
			this.lastCanvasWidth = this.canvas.width;
			this.lastCanvasHeight = this.canvas.height;
			
			if(newWidth == 0 || newHeight == 0)
				return;
			
			this.canvas.width = newWidth;
			this.canvas.height = newHeight;
			
			this.gridImage = this.canvasContext.createImageData(this.canvas.width, this.canvas.height); // Store the image
			this.updateCanvas();
		}
	},
	
	update: function() {
		
		var moduleValue = this.module.getValue();
		for(var i in moduleValue) {
			
			this.colNumber = moduleValue[i].nbCols;
			this.rowNumber = moduleValue[i].nbRows;
			
			this._domTitle.innerHTML = moduleValue[i].data.title;
			
			break;
		}
		
		
		
		this.onResize()
	},
	
	updateCanvas: function() {
		
		var view = this,
		    moduleValue = this.module.getValue();
		
		for(var i in moduleValue) {
			
			if(moduleValue[i] == null || this.gridImage == undefined)
				continue;
			
			this.worker.postMessage({
				gridData: moduleValue[i].dataMatrix,
				gridImageData: this.gridImage,
				cols: this.colNumber,
				rows: this.rowNumber,
				cellWidth: this.cellWidth,
				cellHeight: this.cellHeight
			});
		
			break;
		}
		
	},
	
	getDom: function() {
		return this.dom;
	},
	
	// No additional type transform needed
	typeToScreen: {}
}
