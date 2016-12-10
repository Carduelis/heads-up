(function(){
var Data = {}, View = {};


EntryPoint = Marionette.Object.extend({
	initialize: function() {
		var settings = localRead('settings');
		var dataset = {};
		time = _.find(settings, {title: 'Время на раунд'});
		this.view = new View.Timer({
			model: new Backbone.Model({
				time: time.value*10
			})
		});
		app.rootView.getRegion('footer').show(this.view);
	},
});


var Minutes = Marionette.View.extend({
	template: _.template('<%-minutes%>'),
	initialize: function(options) {
		this.model = options.model
	}
});
var Seconds = Marionette.View.extend({
	template: _.template('<%-seconds%>'),
	initialize: function(options) {
		this.model = options.model
	}
});

View.Timer = Marionette.View.extend({
	template: '#t-timer',
	className: 'timer',
	regions: new RegionSetter('minutes','seconds'),
	initialize: function(options) {
		this.triggerMethod('decrease:time');
	},
	modelEvents: {
		'change:time' : 'onDecreaseTime',
		'change'	: 'render'
	},
	onDecreaseTime: function() {
		var time = this.model.get('time');
		if (time > 0) {
			_.delay(()=>{
				time = time - 1;
				this.model.set('time',time);
			},1000)
		} else {
			
			app.router.navigate('results',{
				trigger: true
			});
		}
	},
	timeToSeconds: function () {
		var time = this.model.get('time');
		var minutes = Math.floor(time / 60);
		seconds = time - minutes * 60;
		if (seconds < 10) {
			seconds = '0'+seconds;
		}
		return seconds
	},
	timeToMinutes : function() {
		var time = this.model.get('time');
		var minutes = Math.floor(time / 60);
		seconds = time - minutes * 60;
		if (minutes < 10) {
			minutes = '0'+minutes;
		}
		return minutes
	},
	onRender: function() {
	},
	templateContext: function() {
		return {
			'seconds' : this.timeToSeconds(),
			'minutes' : this.timeToMinutes(),
		}
	}
});

window.Timer = {
	View: View,
	Data: Data,
	Entry: EntryPoint
}

}());