(function(){
var Data = {}, View = {};

// to do
// Timer is going down and model every 1s changes then render happens
// Timer is not related model, model just gets value of the timer

var Timer = Marionette.Object.extend({
	model: new Backbone.Model(),
	initialize: function(options) {
		var settings = localRead('settings');
		var timeSetting = _.find(settings, {title: 'Время на раунд'});
		if (timeSetting) {
			this.model.set('time',timeSetting.value*60*1000);
		} else {
			this.model.set('time',60*1000); // 1 minute
		}
		this.triggerMethod('start')
	},
	onStart: function() {
		this.model.set('startTime',this.model.get('time'));
		this.pause = false;
		this.triggerMethod('tick');
	},
	onAfterTick: function () {
	},
	onStop: function() {
		this.model.set('time',this.model.get('startTime'));
		this.pause = true;
		var time = this.model.get('time');
	},
	onEnd: function() {
		// first show "time is up"-notify
	},
	onPause: function() {
		this.pause = true;
	},
	onPlay: function() {
		this.pause = false;
	},
	onTick: function(ms) {
		this.triggerMethod('before:tick');
		var ms = ms || 1000;
		this.model.set('time',this.model.get('time') - ms);
		if (this.model.get('time') > 0) {
			if (!this.pause) {
				_.delay(() => {
					this.triggerMethod('tick',ms);
				},ms);
			}
		} else {
			this.triggerMethod('end');
		}
		this.triggerMethod('after:tick');
	}

})
var EntryPoint = Marionette.Object.extend({
	initialize: function() {
		this.timer = new Timer({
			tick: 1000
		});
		this.view = new View.Timer({
			model: this.timer.model
		});
		app.rootView.getRegion('footer').show(this.view);
	},
});


View.Timer = Marionette.View.extend({
	template: '#t-timer',
	className: 'timer',
	initialize: function(options) {

	},
	modelEvents: {
		'change'	: 'render',
	},
	templateContext: function() {
		var time = this.model.get('time');
		var minutes = Math.floor(time / 60 / 1000);
		var seconds = Math.floor((time - minutes * 60 * 1000)/1000);
		if (minutes < 10) {
			minutes = '0'+minutes;
		}
		if (seconds < 10) {
			seconds = '0'+seconds;
		}
		return 	{
			'minutes':minutes,
			'seconds':seconds
		}
	},
	onBeforeRender: function() {
		if (this.model.get('time') == 0) {
			_.delay(()=>{
				this.$el.addClass('time-is-up');
			},100);
			_.delay(()=>{
				this.$el.addClass('bound-out');
			},1100);
			_.delay(()=>{
				app.router.navigate('results',{
					trigger: true
				});
			},1500);
		}
	},
	onRender: function() {
		console.log('render');
	},
});

window.Timer = {
	View: View,
	Data: Data,
	Entry: EntryPoint
}

}());