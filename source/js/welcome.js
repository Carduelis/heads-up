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
	triggers: {
		'click' : 'before:start:game'
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
				id: 1,
				title: "Anna's dictionary",
				name: 'anna',
				version: 0,
				description: 'IELST list'
			},{
				id: 2,
				title: 'The Great Noun List',
				name: 'great_noun_list',
				version: 0,
				description: '4401 English nouns'
			},{
				id: 3,
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