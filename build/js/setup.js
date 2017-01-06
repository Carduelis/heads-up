!function(){var e={},t={};EntryPoint=Marionette.Object.extend({initialize:function(){configGetter(this.onConfigGetted)},onConfigGetted:function(e){localHas("settings")||localSave("settings",e.settings),this.view=new t.SettingsWrapper,app.rootView.getRegion("content").show(this.view)}}),e.Setting=Backbone.Model.extend({defaults:function(){return{title:"Заголовок настройки",type:"text",description:null,options:null,measure:null,disabledState:"disabled",value:null}}}),e.Settings=Backbone.Collection.extend({model:e.Setting}),t.SettingsWrapper=Marionette.View.extend({template:"#t-setup",className:"container navibar-pad",regions:new RegionSetter("list"),initialize:function(e){lsChannel.on("sound:save:success",this.render)},onDestroy:function(){console.warn("kek"),lsChannel.off("sound:save:success")},onRender:function(){var e=new t.Settings({dataset:localRead("settings")});this.getRegion("list").show(e)}}),t.SettingItem=Marionette.View.extend({template:"#t-setting-item",className:"list-group-item list-settings-item",events:{"input .form-control":"onInput",'change .form-control[type="checkbox"]':"onChange"},onInput:function(e){console.log(e.currentTarget.value),this.model.set("value",e.currentTarget.value)},onChange:function(e){this.model.set("value",e.currentTarget.checked),lsChannel.trigger("setup:save:success",this.model.attributes)}}),t.Settings=Marionette.CollectionView.extend({tagName:"ul",className:"list-group navibar-pad",childView:t.SettingItem,initialize:function(t){this.collection=new e.Settings(t.dataset),console.log(this.collection),this.bindEvents(app.model,this.accelerometerModelEvents)},collectionEvents:{change:"onModelChange"},accelerometerModelEvents:{change:"onGravityChange"},onModelChange:function(){console.log("saved"),localSave("settings",this.collection.models)},onGravityChange:function(e){x=9*e.get("gravity").x/2,y=16*e.get("gravity").y/2,Math.abs(x)>10/9&&Math.abs(y)>.625&&this.$el.css({transform:"translate3d("+x+"px, "+y+"px,0)"})}}),window.Setup={View:t,Data:e,Entry:EntryPoint}}();
//# sourceMappingURL=setup.js.map
