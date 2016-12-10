var Router = Marionette.AppRouter.extend({
	routes: { 
		"" : 					"welcome",
		"setup":				"setup",
		"game":				"game",
		"result": "result",
		"results": "result",
		"reports/:id":			"report",
		"reports(/p:pid)(/:-*params)" : "reports", // все репорты с фильтрацией и паджинацией
		
		"data/:entity(/p:page)(/f*params)":	"rootCollection",
	},
	welcome: function() {
		new Game.Entry();
		// new Result.Entry();
	},
	game: function () {
		app.history.reset();
		this.clearRegions();
		new Timer.Entry();
		new Game.Entry();
	},
	result: function () {
		this.clearRegions();
		new Result.Entry();
	},
	setup: function() {
		this.clearRegions();
		new Setup.Entry();
	},
	showWord: function(dataset) {
	},
	onRoute: function(name, path, args) {
		console.log(name, path, args);
	},
	clearRegions: function(regions) {
		var regions = app.rootView.regions;
		for (var i in regions) {
			app.rootView.getRegion(i).empty();
		}
	}
});
app.router = new Router();