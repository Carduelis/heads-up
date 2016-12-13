(function(){
var Data = {}, View = {};

View.Main = Marionette.View.extend({
	template: '#t-navigate-bar',
	className: 'navibar',
	tagName: 'header',
	initialize: function(options) {

	},
	events: {
		'click [data-action="navigate"]': 'navigate'
	},
	navigate: function(e) {
		var routeName = e.currentTarget.dataset.route;
			
		app.router.navigate(routeName,{
			trigger:true
		})
	},
	templateContext: function() {
		// var leftBtn 
		// return {
		// 	leftBtn: 
		// }
	}
})



window.Navibar = {
	View: View.Main,
	Data: Data,
}

}());