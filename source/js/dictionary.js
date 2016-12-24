(function(){

Model = Backbone.Model.extend({
	defaults: function() {
		return {
			id: this.id,
			title: 'Default dictionary',
			name: 'default',
			complexity: 1,
			version: 0,
			language: 'en',
			description: 'Contains different words'
		}
	},
	getName: function() {
		return this.get('language')+'/'+this.get('name')+'_v'+this.get('version');
	}
});
Collection = Backbone.Collection.extend({
	model: Model
});




window.Dictionary = {
	choosed: new Model(),
	Model: Model,
	Collection: Collection,
	// Data: Data,
	// Entry: EntryPoint,
}

}());