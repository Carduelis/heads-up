var Router=Marionette.AppRouter.extend({routes:{"":"welcome",setup:"setup","reports/:id":"report","reports(/p:pid)(/:-*params)":"reports","data/:entity(/p:page)(/f*params)":"rootCollection"},welcome:function(){new Game.Entry},setup:function(){new Setup.Entry},showWord:function(e){},onRoute:function(e,t,o){console.log(e,t,o)}});app.router=new Router;
//# sourceMappingURL=router.js.map
