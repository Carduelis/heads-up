(function(){
var Data = {}, View = {};


EntryPoint = Marionette.Object.extend({
	initialize: function() {
		
		this.view = new View.Settings({
			dataset: dataset
		});
		app.rootView.getRegion('content').show(this.view);
	},
});

var Minutes = Marionette.View.extend({
	template: _.template('<%-minutes%>'),
});
var Seconds = Marionette.View.extend({
	template: _.template('<%-seconds%>'),
});

View.Timer = Marionette.View.extend({

});

window.Timer = {
	View: View,
	Data: Data,
	Entry: EntryPoint
}

}());