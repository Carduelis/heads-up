(function(){
var Data = {}, View = {};

EntryPoint = Marionette.Object.extend({
	initialize: function() {
		this.triggerMethod('get:dictionary');
		wordList = new View.List({
			collection : app.history
		});
		resultActions = new View.Actions();
		app.rootView.getRegion('footer').show(resultActions);
		app.rootView.getRegion('content').show(wordList);
	},

});
View.Word = Marionette.View.extend({
	template: '#t-result-word',
	templateContext: function() {

		
	}
});
View.NoWord = Marionette.View.extend({
	template: '#t-result-empty',
	templateContext: function() {

		
	}
});
View.Actions = Marionette.View.extend({
	template: '#t-result-actions',
	events: {
		'click [data-action="navigate"]': 'navigate'
	},
	navigate: function(e) {
		var routeName = e.currentTarget.dataset.route;
		app.router.navigate(routeName,{
			trigger:true
		})
	},
});
View.List = Marionette.CollectionView.extend({
	childView: View.Word,
	emptyView: View.NoWord,
	className: 'result',
	initialize: function(options) {
		this.collection = options.collection;
	},
	collectionEvents: {
		'all' : 'test'
	},
	test: function(a,b,c) {
		console.log(a,b,c)
	}
})

window.Result = {
	View: View,
	Data: Data,
	Entry: EntryPoint
}

}());