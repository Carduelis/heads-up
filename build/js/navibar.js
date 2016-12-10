!function(){var a={},t={};t.Main=Marionette.View.extend({template:"#t-navigate-bar",className:"navibar",tagName:"header",initialize:function(a){},events:{'click [data-action="navigate"]':"navigate"},navigate:function(a){var t=a.currentTarget.dataset.route;app.router.navigate(t,{trigger:!0})},templateContext:function(){}}),window.Navibar={View:t.Main,Data:a}}();
//# sourceMappingURL=navibar.js.map
