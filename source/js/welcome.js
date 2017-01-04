(function(){
var Data = {}, View = {};

EntryPoint = Marionette.View.extend({
	template: '#t-welcome',
	regions: new RegionSetter('dictionary-list'),
	className: 'container navibar-pad',
	tagName: 'section',
	initialize: function(options) {

	},
	onRender: function(){
		this.getRegion('dictionary-list').show(new View.Dictionaries());
	}
});


View.Dictionary = Marionette.View.extend({
	tagName: 'li',
	template: '#t-dictionary',
	ui: {
		'card' : '.card',
		'ripple' : '.ripple'
	},
	events: {
		'mousedown @ui.card' : 'animate',
	},
	triggers: {
		// 'click' : 'before:start:game',
	},
	animate: function(e) {
		var $card = this.getUI('card');
		var $ripple = this.getUI('ripple');
		$ripple.removeClass("animate");
		var x = parseInt(e.pageX - $card.offset().left) - ($ripple.width() / 2);
		var y = parseInt(e.pageY - $card.offset().top) - ($ripple.height() / 2);
		$ripple.css({
			top: y,
			left: x
		}).addClass("animate");
		_.delay(()=>{
			this.triggerMethod('before:start:game')
		},300)
	},
	onBeforeStartGame: function() {
		Dictionary.choosed = this.model;
		this.triggerMethod('start:game');
	},
	onStartGame: function() {
		app.router.navigate('game',{
			trigger: true
		})
	}
});
View.Dictionaries = Marionette.CollectionView.extend({
	childView : View.Dictionary,
	className: 'themes',
	tagName: 'ul',
	initialize: function(options) {
		this.collection = new Dictionary.Collection([
			{
				title: "Легкие слова из Шляпы",
				name: 'shlyapa_low',
				language: 'ru',
				complexity: 1,
				version: 0,
				description: 'Легкие слова с shlyapa-game.com'
			},{
				title: 'The Great Noun List',
				name: 'great_noun_list',
				language: 'en',
				complexity: 5,
				version: 0,
				description: '4401 English nouns. Here words of varying difficulty'
			},{
				title: 'Default dictionary',
				name: 'default',
				language: 'en',
				version: 0,
				description: 'Contains different words'
			},{
				title: "Shlyapa's Eng",
				name: 'shlyapa_low',
				language: 'en',
				complexity: 1,
				version: 0,
				description: 'Low-level words from shlyapa-game.com'
			},{
				title: "Shlyapa's Eng",
				name: 'shlyapa_mid',
				language: 'en',
				complexity: 3,
				version: 0,
				description: 'Mid-level words from shlyapa-game.com'
			},{
				title: "Anna's dictionary",
				name: 'anna',
				language: 'en',
				complexity: 3,
				version: 0,
				description: 'IELST list'
			},{
				title: "Shlyapa's Eng",
				name: 'shlyapa_hard',
				language: 'en',
				complexity: 5,
				version: 0,
				description: 'Hard words from shlyapa-game.com'
			}
		])
	}
});


window.Welcome = {
	View: View.Main,
	Data: Data,
	Entry: EntryPoint,
}

}());