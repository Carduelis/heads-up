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
			$.get('assets/dictionary.json').success(dictionary => {
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
	onPassWord: function(e) {
		console.log('kek',e);
	},
	onCorrectWord: function(e) {
		console.log('onKek',e);
	},
	onNext: function (e) {
		this.triggerMethod('dictionary:stored');
	}
})

$.get('assets/dictionary.json').success(function(data){
			
		})
Data.Main = Backbone.Model.extend({
	defaults: function() {
		return {
			word: 'Default Word'
		}
	}
});
View.Main = Marionette.View.extend({
	template: '#t-main',
	className: 'game-content',
	initialize: function(options) {
		this.model = new Data.Main(options.dataset)
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
	triggers: {
		'click [data-action="correct"]': 'correct',
		'click [data-action="pass"]': 'pass',
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