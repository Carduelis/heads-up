function localSave(key,json) {
	localStorage.setItem(key, JSON.stringify(json));
	return true;
};
function localHas(key) {
	return localRead(key) !== null
}
function localRead(key) {
	var json = JSON.parse(localStorage.getItem(key));
	return json;
};
function playSound(id) {
	var sound = $('#audio-'+id).get(0);
	sound.pause();
	sound.currentTime = 0;
	sound.play();
}
var RegionSetter = function() {
	this.arguments = arguments;
	if (this.arguments.length == 1 && _.isArray(this.arguments[0])) {
		this.arguments = arguments[0]
	}
	this.prefix = 'r-';
	return this.builder();
};
RegionSetter.prototype.builder = function() {
	regions = {};
	for (var i in this.arguments) {
		var regionName = this.arguments[i]
		regions[regionName] = {
			el: this.prefix+regionName,
			replaceElement: true
		}
	}
	return regions
};
var AcceleratorData = Backbone.Model.extend({
	defaults: function() {
		return {
			x: 0,
			y: 0,
			z: 0,
			alpha: 0,
			beta: 0,
			gamma: 0,
			gravity: {
				x: 0,
				y: 0,
				z: 0,
			}
		}
	}
});

var App = Marionette.Application.extend({
	region: '#app',
	initialize: function(options) {
		console.log('My options:', options);
		this.model = new AcceleratorData();
	},
	onStart: function() {
		console.log(this.getRegion());
		this.rootView = new RootView({
			model: this.model
		});
		this.getRegion().show(this.rootView);
	},
});
app = new App();
app.on('start', (e) => {
	Backbone.history.start();
	app.dictionary = new Welcome.Data.Dictionary();
	if (typeof window.DeviceMotionEvent !== 'undefined') {
		window.ondevicemotion = function(e) {
			var dataset = _.extend({},e.acceleration);
			dataset.gravity = e.accelerationIncludingGravity;
			if (e.rotationRate) {
				_.extend(dataset,e.rotationRate);
			};
			// _.delay(()=>{
 				app.model.set(dataset);
			// },100);
			
		}
	};
	// if (window.DeviceOrientationEvent) {
	// 	window.addEventListener('deviceorientation', deviceOrientationHandler, false);
		
	// }
});

var AcceleratorDebug = Marionette.View.extend({
	template: '#t-accelerator-debug',
	className: 'acc-debug',
	initialize: function(options) {
		this.model = options.model;
	},
	modelEvents: {
		// 'change': 'checkRender',
		'change': 'render'
	},
	initialize: function() {
		this.triggerMethod('set:render:time');
	},
	getNow: function() {
		return new Date().getTime()
	},
	onSetRenderTime: function() {
		this.lastRenderTime = this.getNow();
	},
	checkRender: function() {
		var delta = this.getNow() - this.lastRenderTime;
		if (delta > 100) {
			this.render();
		}
	},
	onBeforeRender: function() {
		this.triggerMethod('set:render:time')
	}
})
var RootView = Marionette.View.extend({
	template: '#t-root',
	className: 'root',
	regions: new RegionSetter('navibar','statusbar','content','footer'),
	initialize: function(options) {
		this.model = options.model;
	},
	onRender: function () {
		this.getRegion('statusbar').show(new AcceleratorDebug({
			model: this.model
		}));
		this.getRegion('navibar').show(new Navibar.View());
	}
});


$(document).ready(function () {
	app.start();

});




