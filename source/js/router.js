var Router = Marionette.AppRouter.extend({
	routes: { 
		"" : 					"welcome",
		"welcome" : 			"welcome",
		"setup":				"setup",
		"game":				"game",
		"gamedebug":				"gamedebug",
		"acc":				"accelerometer",
		"result": "result",
		"results": "result",
		"reports/:id":			"report",
		"reports(/p:pid)(/:-*params)" : "reports", // все репорты с фильтрацией и паджинацией
		
		"data/:entity(/p:page)(/f*params)":	"rootCollection",
	},
	welcome: function() {
		app.rootView.getRegion('content').show(new Welcome.Entry());
		app.rootView.getRegion('footer').empty();
	},
	game: function () {
		// if (screenfull.enabled) {
		// 	screenfull.request();
		// }
		app.history.reset();
		app.timer = new Timer.Entry();
		app.game = new Game.Entry();
	},
	gamedebug: function () {
		// if (screenfull.enabled) {
		// 	screenfull.request();
		// }
		app.history.reset();
		app.timer = new Timer.Entry();
		app.game = new Game.Entry();
		app.acc = new Accelerometer.Entry();
	},
	result: function () {
		new Result.Entry();
	},
	accelerometer: function () {
		console.log('kek')
		app.acc = new Accelerometer.Entry();
	},
	setup: function() {
		new Setup.Entry();
		app.rootView.getRegion('footer').empty();

	},
	showWord: function(dataset) {
	},
	onRoute: function(name, path, args) {
		$('#app').attr('route',name);
	},
});
app.router = new Router();