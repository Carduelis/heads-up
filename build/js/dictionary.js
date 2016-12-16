!function(){Model=Backbone.Model.extend({defaults:{title:"Default dictionary",name:"default",version:0,description:"Contains different words"},getName:function(){return this.get("name")+"_v"+this.get("version")}}),Collection=Backbone.Collection.extend({model:Model}),window.Dictionary={choosed:new Model,Model:Model,Collection:Collection}}();
//# sourceMappingURL=dictionary.js.map
