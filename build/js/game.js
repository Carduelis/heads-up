!function(){var t={},e={};EntryPoint=Marionette.Object.extend({initialize:function(){this.triggerMethod("get:dictionary")},onGetDictionary:function(){var t=this;localStorage.getItem("dictionary")?this.triggerMethod("dictionary:stored",localStorage.getItem("dictionary")):$.get("assets/great_noun_list.json").success(function(e){t.triggerMethod("dictionary:stored",e)})},pickWord:function(){for(var t=this.getOption("dictionary"),e=this.getOption("pickedWords"),i=t.length,o=_.random(0,i-1);"undefined"!=typeof e[o];)o=_.random(0,i-1);return e[o]=t[o],t[o]},onDictionaryStored:function(t){this.dictionary=t,this.pickedWords={},this.triggerMethod("show:word")},onShowWord:function(){this.view=new Game.View.Main({dataset:{word:this.pickWord()}}),app.rootView.getRegion("content").show(this.view),this.bindEvents(this.view,this.childviewEvents)},childviewEvents:{pass:"onPassWord",correct:"onCorrectWord",next:"onNext"},onPassWord:function(t){console.log(t),t.model.set("guessed",!1),app.history.push(t.model)},onCorrectWord:function(t){console.log(t),t.model.set("guessed",!0),app.history.push(t.model)},onNext:function(t,e,i){app.timer.view.model.get("time")>0&&this.triggerMethod("show:word")}}),t.Main=Backbone.Model.extend({defaults:function(){return{word:"Default Word",guessed:void 0}}}),t.History=Backbone.Collection.extend({model:t.Main,initialize:function(){}}),app.history=new t.History,e.Main=Marionette.View.extend({template:"#t-main",className:"game-content",initialize:function(e){var i=this;this.model=new t.Main(e.dataset),_.delay(function(){i.bindEvents(app.model,i.accelerometerModelEvents)},500),_.delay(function(){i.triggerMethod("vibra")},1500)},onBeforeDestoy:function(){this.doNotVibrate=!0},onVibra:function(){var t=this;if(stopVibrate(),this.getOption("doNotVibrate")!==!0){var e=app.model.get("gravity").z,i=Math.abs(e)-3;Math.abs(e)<6&&Math.abs(e)>3&&(delay=300-100*i,delay=100,duration=10+10*i,duration=duration>50?50:duration,startPeristentVibrate(duration,delay)),_.delay(function(){t.triggerMethod("vibra")},300)}},templateContext:function(){var t=this.model.get("word").length,e=1,i=$(document).width(),o=.8*i/t/16,n=3>o?o:3;return{size:e+n}},accelerometerModelEvents:{change:"onGravityChange"},triggers:{'click [data-action="correct"]':"correct",'click [data-action="pass"]':"pass"},onGravityChange:function(t){var e=t.get("gravity").z,i=t.get("z"),o={vertical:Math.abs(e)<3,warningVertical:Math.abs(e)<6&&Math.abs(e)>3,wordCorrect:-6>e&&i>.8,wordIncorrect:e>6&&-.8>i};o.vertical&&this.triggerMethod("normal:state"),o.wordCorrect&&(this.triggerMethod("normal:state"),this.triggerMethod("correct",this)),o.wordIncorrect&&(this.triggerMethod("normal:state"),this.triggerMethod("pass",this)),o.warningVertical&&this.triggerMethod("warning:state",e)},onNormalState:function(){this.$el.removeClass("warning"),console.log("normal:state"),stopVibrate()},onWarningState:function(t){console.log("warning:state"),this.$el.addClass("warning")},onStartSwipeAnimation:function(){var t=this;_.delay(function(){t.$el.addClass("swiped"),_.delay(function(){t.triggerMethod("next")},300)},300)},onDisableGuessing:function(){this.unbindEvents(app.model,this.accelerometerModelEvents),this.$el.find("[data-action]").attr("disabled","disabled"),this.doNotVibrate=!0},onPass:function(){playSound("wrong"),this.$el.addClass("pass"),this.triggerMethod("disable:guessing"),this.triggerMethod("start:swipe:animation")},onBeforeWordDissapearing:function(){},onPrev:function(){prevWordModel=app.history.last()},onCorrect:function(){playSound("correct"),this.$el.addClass("correct"),this.triggerMethod("disable:guessing"),this.triggerMethod("start:swipe:animation")}}),window.Game={View:e,Data:t,Entry:EntryPoint}}();
//# sourceMappingURL=game.js.map
