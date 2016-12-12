(function(){
var Data = {}, View = {};


EntryPoint = Marionette.Object.extend({
	initialize: function() {
		this.triggerMethod('get:dictionary');
	},
	onGetDictionary: function() {
		if(localStorage.getItem('dictionary')) {
			this.triggerMethod('dictionary:stored',localStorage.getItem('dictionary'))
		} else {
			$.get('assets/great_noun_list.json').success(dictionary => {
				this.triggerMethod('dictionary:stored', dictionary)
			});
		}
	},
	pickWord: function() {
		// to do 
		// 1. trim dictionary (amount of words === seconds) 
		// 2. shuffle trimmed dictionary
		// 3. pick next word 
		var dictionary = this.getOption('dictionary');
		var pickedWords = this.getOption('pickedWords');
		var length = dictionary.length;
		var wordId = _.random(0,length-1);
		while (typeof pickedWords[wordId] !== 'undefined') {
			wordId = _.random(0,length-1);
		}
		pickedWords[wordId] = dictionary[wordId];
		return dictionary[wordId]
	},
	onDictionaryStored: function(dictionary) {
		this.dictionary = dictionary;
		this.pickedWords = {};	
		this.triggerMethod('show:word');
	},
	onShowWord: function() {
		this.view = new Game.View.Main({
			dataset: {
				word: this.pickWord()
			}
		});
		app.rootView.getRegion('content').show(this.view);
		this.bindEvents(this.view,this.childviewEvents);
	},
	childviewEvents: {
		'pass' 		:	'onPassWord',
		'correct'	:	'onCorrectWord',
		'next'		:	'onNext' 	
	},
	onPassWord: function(view) {

		console.log(view);
		view.model.set('guessed',false);
		app.history.push(view.model);
	},
	onCorrectWord: function(view) {
		console.log(view);
		view.model.set('guessed',true);
		app.history.push(view.model);
	},
	onNext: function (e,a,b) {
		if (app.timer.view.model.get('time') > 0) {
			this.triggerMethod('show:word');
		}

	}
})

Data.Main = Backbone.Model.extend({
	defaults: function() {
		return {
			word: 'Default Word',
			guessed: undefined
		}
	}
});
Data.History = Backbone.Collection.extend({
	model: Data.Main,
	initialize: function() {

	}
});

// word appears | vertical
// word correct | tilted
// word animated | tilted
// word appears | tilted
// word listen accelerometer 

app.history = new Data.History();
View.Main = Marionette.View.extend({
	template: '#t-main',
	className: 'game-content',
	initialize: function(options) {
		this.model = new Data.Main(options.dataset);
		_.delay(()=>{
			this.bindEvents(app.model,this.accelerometerModelEvents);
		},500);
	},
	templateContext: function() {
		var length = this.model.get('word').length;
		var base = 1;
		var width = $(document).width();
		var k = width*0.8/length/16
		var delta = k < 4 ? k : 4; 
		return {
			size: base+delta
		}
	},
	accelerometerModelEvents: {
		'change': 'onGravityChange'
	},
	triggers: {
		'click [data-action="correct"]': 'correct',
		'click [data-action="pass"]': 'pass',
	},
	onGravityChange: function(model) {
		var tilt = model.get('gravity').z;
		var accelerateTilt = model.get('z');
		var conditions = {
			vertical		 : Math.abs(tilt) < 4,
			warningVertical	 : Math.abs(tilt) < 6 && Math.abs(tilt) > 4,
			wordCorrect		 : tilt < -4 && accelerateTilt > 0.8,
			wordIncorrect	 : tilt > 6 && accelerateTilt < -0.8,
		};

		if (conditions.vertical) {
			this.triggerMethod('normal:state')
		}
		if (conditions.wordCorrect) {
			this.triggerMethod('correct',this);
		}
		if (conditions.wordIncorrect) {
			this.triggerMethod('pass',this);
		}
		if (conditions.warningVertical) {
			this.triggerMethod('warning:state', tilt);
		}
	},
	onNormalState: function() {
		this.$el.removeClass('warning');
		console.log('normal:state')
		stopVibrate();
	},
	onWarningState: function(tilt) {
		var vibroFrequencyModifier = (Math.abs(tilt)-4)*100;
		var baseVibroFrequency = 350;
		var frequency = vibroFrequencyModifier + baseVibroFrequency;
		if (!vibrateInterval) {
			startPeristentVibrate(50,350);
		}
		console.log('warning:state')
		this.$el.addClass('warning');
	},
	onStartSwipeAnimation: function () {
		_.delay(()=>{
			this.$el.addClass('swiped');
			_.delay(()=>{
				this.triggerMethod('next');
			},300);
		},300);
	},
	onDisableGuessing: function() {
		// disable accelerometer-way
		this.unbindEvents(app.model,this.accelerometerModelEvents);
		// disable button-way
		this.$el.find('[data-action]').attr('disabled','disabled');	
	},
	onPass: function() {
		this.$el.addClass('pass');
		this.triggerMethod('disable:guessing');
		this.triggerMethod('start:swipe:animation');
	},
	onBeforeWordDissapearing: function() {
		
	},
	onCorrect: function() {
		this.$el.addClass('correct');
		this.triggerMethod('disable:guessing');

		this.triggerMethod('start:swipe:animation');
	},
})

window.Game = {
	View: View,
	Data: Data,
	Entry: EntryPoint
}

}());