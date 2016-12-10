(function(){
var Data = {}, View = {};

EntryPoint = Marionette.View.extend({
	template: '#t-welcome',
	className: 'container',
	tagName: 'section',
	initialize: function(options) {
	},
	events: {
		'click .card': 'startGame'
	},
	startGame: function() {
		// definitely this link shoud be in childView
		app.router.navigate('game',{
			trigger: true
		})
	}
})



window.Welcome = {
	View: View.Main,
	Data: Data,
	Entry: EntryPoint,
}

}());