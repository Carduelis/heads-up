(function(){
var Data = {}, View = {};


EntryPoint = Marionette.Object.extend({
	initialize: function() {
		this.triggerMethod('get:dictionary');
	},
	onGetDictionary: function() {
		if(localStorage.getItem('dictionary')) {

			this.triggerMethod('dictionary:stored')
		} else {
			$.get('assets/great_noun_list.json').success(dictionary => {
				this.dictionary = dictionary;
				this.triggerMethod('dictionary:stored', dictionary)
			});

		}
	},
	onDictionaryStored: function(dictionary) {
		var dictionary = this.getOption('dictionary');
		var length = dictionary.length;
		var pickedWords = [];
		getRandomWord = function() {
			var i = _.random(0,length-1);
			return dictionary[i]
		}
		var theWord = getRandomWord();
		pickedWords.push(theWord);

		this.view = new Game.View.Main({
			dataset: {
				word: theWord
			}
		})
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
		this.triggerMethod('dictionary:stored');
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
		if (Math.abs(tilt) < 4) {
			// ok-state
		} else if (Math.abs(tilt) < 6) {
			// warning-state
		}
		if (tilt < -4 && accelerateTilt > 0.8) {
			this.unbindEvents(app.model,this.accelerometerModelEvents);
			this.triggerMethod('correct',this);
		}
		if (tilt > 6 && accelerateTilt < -0.8) {
			this.unbindEvents(app.model,this.accelerometerModelEvents);
			this.triggerMethod('pass',this);
		}
	},
	onDisableButtons: function () {
		this.$el.find('[data-action]').attr('disabled','disabled');	
	},
	onPass: function() {
		this.triggerMethod('disable:buttons');
		this.$el.addClass('pass');
		this.triggerMethod('start:swipe:animation');
	},
	onStartSwipeAnimation: function () {
		_.delay(()=>{
			this.$el.addClass('swiped');
			_.delay(()=>{
				this.triggerMethod('next');
			},300);
		},300);
	},
	onCorrect: function() {
		this.triggerMethod('disable:buttons');
		this.$el.addClass('correct');
		this.triggerMethod('start:swipe:animation');
	},
})

window.Game = {
	View: View,
	Data: Data,
	Entry: EntryPoint
}

}());