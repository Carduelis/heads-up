!function(){var e={},t={};EntryPoint=Marionette.Object.extend({initialize:function(){this.view=new t.Settings({dataset:dataset}),app.rootView.getRegion("content").show(this.view)}});Marionette.View.extend({template:_.template("<%-minutes%>")}),Marionette.View.extend({template:_.template("<%-seconds%>")});t.Timer=Marionette.View.extend({}),window.Timer={View:t,Data:e,Entry:EntryPoint}}();
//# sourceMappingURL=timer.js.map