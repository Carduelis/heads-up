(function(){
var Data = {}, View = {};

View.GraphHolder = Marionette.View.extend({
	template: '#t-accelerometer-holder',
	className: 'accelerometer-holder',
	regions: new RegionSetter('gravity','source'),
	onRender: function() {
		this.getRegion('gravity').show(new View.Graph_gravity);
		this.getRegion('source').show(new View.Graph_source);
	}
});
View.Graph_gravity = Marionette.View.extend({
	template: '#t-accelerometer',
	className: 'accelerometer-chart',
	initialize: function(options) {
		this.chartContainerId = "chartContainer-"+this.cid;
	},
	onAttach: function() {
		var dps = []; // dataPoints

		var chart = new CanvasJS.Chart(this.chartContainerId,{
			title :{
				text: "Live Random Data"
			},			
			data: [{
				type: "line",
				dataPoints: dps 
			}]
		});

		var xVal = 0;
		var yVal = 0;
		var dataLength = 500; // number of dataPoints visible at any point

		var updateChart = function (count) {
			count = count || 1;
			// count is number of times loop runs to generate random dataPoints.
			
			for (var j = 0; j < count; j++) {	
				yVal = app.model.get('gravity').z;
				dps.push({
					x: xVal,
					y: yVal
				});
				xVal++;
			};
			if (dps.length > dataLength) {
				dps.shift();				
			}
			
			chart.render();		

		};

		// generates first set of dataPoints
		updateChart(dataLength); 

		// update chart after specified time. 
		app.model.on('change', function(){
			updateChart()
		});
	},
	templateContext: function() {
		return {
			chartContainerId: this.chartContainerId
		}
	}
});
View.Graph_source = Marionette.View.extend({
	template: '#t-accelerometer',
	className: 'accelerometer-chart',
	initialize: function(options) {
		this.chartContainerId = "chartContainer-"+this.cid;
	},
	onAttach: function() {
		var dps = []; // dataPoints

		var chart = new CanvasJS.Chart(this.chartContainerId,{
			title :{
				text: "Live Random Data"
			},			
			data: [{
				type: "line",
				dataPoints: dps 
			}]
		});

		var xVal = 0;
		var yVal = 0;
		var dataLength = 500; // number of dataPoints visible at any point

		var updateChart = function (count) {
			count = count || 1;
			// count is number of times loop runs to generate random dataPoints.
			
			for (var j = 0; j < count; j++) {	
				yVal = app.model.get('z');
				dps.push({
					x: xVal,
					y: yVal
				});
				xVal++;
			};
			if (dps.length > dataLength) {
				dps.shift();				
			}
			
			chart.render();		

		};

		// generates first set of dataPoints
		updateChart(dataLength); 

		// update chart after specified time. 
		app.model.on('change', function(){
			updateChart()
		});
	},
	templateContext: function() {
		return {
			chartContainerId: this.chartContainerId
		}
	}
});
var EntryPoint = Marionette.Object.extend({
	initialize: function() {

		$.getScript('http://canvasjs.com/assets/script/canvasjs.min.js', ()=>{
			this.triggerMethod('start');
		});
	},
	onStart: function() {
		app.rootView.getRegion('test').show(new View.GraphHolder());
	}
});
window.Accelerometer = {
	View: View,
	Data: Data,
	Entry: EntryPoint
}

}());