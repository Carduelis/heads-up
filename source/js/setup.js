(function(){
var Data = {}, View = {};


EntryPoint = Marionette.Object.extend({
	initialize: function() {
		var dataset = [];
		if (localStorage.getItem('settings')) {
			dataset = localRead('settings');
		} else {
			dataset = [
				{
					title: 'Количество команд',
					type: 'number',
					name: 'teams',
					disabledState: 'disabled',
					value: 2
				},{
					title: 'Время на раунд',
					type: 'number',
					value: 4,
					name: 'time',
					disabledState: null,
					measure: 'мин'
				},{
					title: 'Категория',
					disableState: 'disabled',
					name: 'category',
					type: 'select',
					value: 1,
					options: [
						{
							id: 1,
							name: 'Общие слова'
						},{
							id: 2,
							name: 'Музыкальные группы и исполнители'
						},{
							id: 3,
							name: 'Продукты питания'
						},{
							id: 4,
							name: 'Гаджеты'
						}
					]
				}
			];
		}
		this.view = new View.Settings({
			dataset: dataset
		});
		app.rootView.getRegion('content').show(this.view);
	},
});

Data.Setting = Backbone.Model.extend({
	defaults: function() {
		return {
			title: 'Заголовок настройки',
			type: 'text',
			description: null,
			options: null,
			measure: null,
			disabledState: 'disabled',
			value: null,
		}
	}
});
Data.Settings = Backbone.Collection.extend({
	model: Data.Setting,

});

View.SettingItem = Marionette.View.extend({
	template: '#t-setting-item',
	className: 'list-group-item list-settings-item',
	events: {
		'input .form-control': 'onInput'
	},
	onInput: function(e) {
		this.model.set('value',e.currentTarget.value);
	}
});
View.Settings = Marionette.CollectionView.extend({
	tagName: 'ul',
	className: 'list-group',
	childView: View.SettingItem,
	initialize: function (options) {
		this.collection = new Data.Settings(options.dataset);
		console.log(this.collection);
		this.bindEvents(app.model,this.accelerometerModelEvents);
	},
	collectionEvents: {
		'change' : 'onModelChange'
	},
	accelerometerModelEvents: {
		'change' : 'onGravityChange'
	},
	onModelChange: function() {
		console.log('saved')
		localSave('settings',this.collection.models);
	},
	onGravityChange: function(model) {
		x = model.get('gravity').x*9/2;
		y = model.get('gravity').y*16/2;
		if (Math.abs(x) > 10/9 && Math.abs(y) > 10/16) {
			this.$el.css({
				transform: 'translate3d('+x+'px, '+y+'px,0)',
				// transform: 'translate3d('+x+'px, '+y+'px,0) rotateX('+y/5+'deg) rotateY('+x/5+'deg)',
				// transform: 'rotateX('+y+'deg) rotateY('+x+'deg) rotateZ('+x+'deg)',
			})
		}
	}

});

window.Setup = {
	View: View,
	Data: Data,
	Entry: EntryPoint
}

}());