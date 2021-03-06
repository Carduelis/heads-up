(function(){
var Data = {}, View = {};


EntryPoint = Marionette.Object.extend({
	initialize: function() {
		this.dictionaryName = Dictionary.choosed.getName();
		if (localRead('dictionaryName') === this.dictionaryName) {
			this.triggerMethod('dictionary:stored', localRead('dictionary'));
		} else {
			this.triggerMethod('load:dictionary');
		}
	},
	onLoadDictionary: function() {
		console.log('onLoadDictionary');
		$.get('assets/dictionaries/'+this.dictionaryName+'.json').success(dictionary => {
			this.triggerMethod('dictionary:stored', dictionary);
			this.storeDictionary(dictionary);
		}).error(error => {
			alert("Sorry, can't reach the dictionary. Try again or pick another one");
		});
	},
	storeDictionary: function(dictionary) {
		console.log('storeDictionary');
		localSave('dictionaryName',this.dictionaryName);
		localSave('dictionary',dictionary);
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
		console.log('onDictionaryStored');
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
		view.model.set('guessed',false);
		app.history.push(view.model);
	},
	onCorrectWord: function(view) {
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
		var defaultSettings = {
			// accLog: [],
			delay: 200,
			accZ: 0,
			accSum41: 0,
			accSum41Start: 0,
			accSum41StartValue: 0,
			accGravityZ: 0,
			accGravityZHistory: {},
			accGravityZAverage: 0,
			accTicks: 0,
		}
		_.extend(this, defaultSettings);
		this.model = new Data.Main(options.dataset);
		_.delay(()=>{
			this.bindEvents(app.model,this.accelerometerModelEvents);
		},300);
		_.delay(()=>{
			this.triggerMethod('vibra');
		},1000);
		this.triggerMethod('get:info');
	},
	_calculateAccelerometerData: function(model){
		var ts = new Date().getTime();
		this.accGravityZ = model.get('gravity').z;
		this.accZ = model.get('z');
		// this.accLog.push({
		// 	ts: ts,
		// 	z: this.accZ,
		// 	gZ: this.accGravityZ
		// });
		if (this.accTicks === 0) {
			this.accSum41Start = ts;
		};
		this.accGravityZAverage = (this.accGravityZAverage*this.accTicks+this.accGravityZ)/(this.accTicks+1)
	// start
		this.accTicks++;
		// прибавляем текущее значение
		this.accSum41 += this.accGravityZ;
		// вычитаем значение на начало периода
		this.accSum41 -= this.accSum41StartValue;
		if (ts - this.accSum41Start > this.delay) {
			// сбрасываем стартовое время тика
			this.accTicks = 0;
			this.accSum41Start = ts;
			// сбрасываем стартовое значение
			this.accSum41StartValue = this.accGravityZ;
		}
	},


	onGetInfo: function() {
		$.get('//api.pearson.com/v2/dictionaries/ldoce5/entries?headword='+this.model.get('word')).success(response => {
			this.triggerMethod('render:info',response)
		});
	},
	onRenderInfo : function(response) {
		if (response.status == 200) {
			try {
				this.$el.find('.info').html('may be a <b>'+response.results[0].part_of_speech+'</b>')
			} catch (e) {
				this.$el.find('.info').text('not found');
				console.error(e);
			}
		}	
	},
	onDestroy: function() {
		this.unbindEvents(app.model,this.accelerometerModelEvents);
		this.doNotVibrate = true;
		stopVibrate();
	},
	onVibra: function() {
		stopVibrate();
		if (this.getOption('doNotVibrate') !== true) {
			var tilt = app.model.get('gravity').z;
			var vibroFrequencyModifier = Math.abs(tilt)-3;
			// [tilt 0..2]
			// 0 - rare
			// 2 - frequently
			if (Math.abs(tilt) < 6 && Math.abs(tilt) > 3) {
				delay = 300 - vibroFrequencyModifier*100;
				// delay = delay < 100 ? 100 : delay;
				delay = 100;
				duration = 10 + vibroFrequencyModifier*10;
				duration = duration > 50 ? 50 : duration;
				startPeristentVibrate(duration, delay);
			}

			_.delay(()=>{
				this.triggerMethod('vibra')
			},300)
		}
	},
	templateContext: function() {
		var length = this.model.get('word').length;
		var base = 1;
		var width = $(document).width();
		var k = width*0.8/length/16
		var delta = k < 3 ? k : 3; 
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
	onTriggered: function () {
		this.triggered = true;
		_.delay(()=>{
			if (this.triggered == true) {
				if (this.accGravityZAverage > 0) {
					this.triggerMethod('normal:state');
					this.triggerMethod('pass',this);
				} else {
					this.triggerMethod('normal:state');
					this.triggerMethod('correct',this);
				}
			}
		}, this.delay);
	},
	onGravityChange: function(model) {
		this._calculateAccelerometerData(model);
		var tilt = model.get('gravity').z;
		var accelerateTilt = model.get('z');
		var conditions = {
			vertical		 : Math.abs(tilt) < 3,
			warningVertical	 : Math.abs(tilt) < 6 && Math.abs(tilt) > 3,
			// BEGIN not in use
			wordCorrect		 : tilt < -6 && accelerateTilt > 0.8,
			wordIncorrect	 : tilt > 6 && accelerateTilt < -0.8,
			wordCorrect		 : tilt < -6 && accelerateTilt < -4,
			wordIncorrect	 : tilt > 6 && accelerateTilt > 4,
			// END not in use
			wordTrigger			: Math.abs(tilt) > 5 && Math.abs(accelerateTilt) > 2
		};
		if (conditions.vertical) {
			this.triggerMethod('normal:state')
		}
		if (app.timer.view.timer.pause !== true) {
			if (conditions.wordTrigger) {
				this.triggerMethod('triggered');
			}
			if (conditions.warningVertical) {
				this.triggerMethod('warning:state', tilt);
			}
		} else {
			this.triggerMethod('normal:state');
		}

	},
	onNormalState: function() {
		this.triggered = false;
		this.$el.removeClass('warning');
		console.log('normal:state')
		stopVibrate();
	},
	onWarningState: function(tilt) {
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
		// disable vibra
		this.doNotVibrate = true;
	},
	onPass: function() {
		playSound('wrong');
		this.$el.addClass('pass');
		this.triggerMethod('disable:guessing');
		this.triggerMethod('start:swipe:animation');
	},
	onBeforeWordDissapearing: function() {
		
	},
	onPrev : function() {
		prevWordModel = app.history.last()
	},
	onCorrect: function() {
		playSound('correct');
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