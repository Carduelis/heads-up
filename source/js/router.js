var Router = Marionette.AppRouter.extend({
	routes: { 
		"" : 					"welcome",
		"setup":				"setup",
		"reports/:id":			"report",
		"reports(/p:pid)(/:-*params)" : "reports", // все репорты с фильтрацией и паджинацией
		
		"data/:entity(/p:page)(/f*params)":	"rootCollection",
	},
	welcome: function() {
		new Game.Entry();
		new Result.Entry();
	},
	setup: function() {
		new Setup.Entry();
	},
	showWord: function(dataset) {
	},
	onRoute: function(name, path, args) {
		console.log(name, path, args)
	}
});
app.router = new Router();