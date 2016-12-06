var Router=Marionette.AppRouter.extend({routes:{"":"welcome",data:"welcome","reports/:id":"report","reports(/p:pid)(/:-*params)":"reports","data/:entity(/p:page)(/f*params)":"rootCollection"},welcome:function(){new Game.Entry},showWord:function(e){},onRoute:function(e,o,t){console.log(e,o,t)}});app.router=new Router;
//# sourceMappingURL=router.js.map
