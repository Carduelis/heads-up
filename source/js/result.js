(function(){
var Data = {}, View = {};

EntryPoint = Marionette.Object.extend({
	initialize: function() {
		this.triggerMethod('get:dictionary');
		wordList = new View.List({
			collection : app.history
		});
		app.rootView.getRegion('content').show(wordList);
	},

});
View.Word = Marionette.View.extend({
	template: '#t-result-word',
	templateContext: function() {

		
	}
});
View.List = Marionette.CollectionView.extend({
	childView: View.Word,
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