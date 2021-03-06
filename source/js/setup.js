(function(){
var Data = {}, View = {};



EntryPoint = Marionette.Object.extend({
	initialize: function() {
		configGetter(this.onConfigGetted)
	},
	onConfigGetted: function (config) {
		if (!localHas('settings')) {
			localSave('settings',config.settings);
		}
		this.view = new View.SettingsWrapper();
		app.rootView.getRegion('content').show(this.view);
	}
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
View.SettingsWrapper = Marionette.View.extend({
	template: '#t-setup',
	className: 'container navibar-pad',
	regions: new RegionSetter('list'),
	initialize: function(options) {
		lsChannel.on('sound:save:success', this.render);
		
	},
	onDestroy: function() {
		console.warn('kek');
		lsChannel.off('sound:save:success');
	},
	onRender: function() {
		var settingListView = new View.Settings({
			dataset: localRead('settings')
		});
		this.getRegion('list').show(settingListView)
	}
});

View.SettingItem = Marionette.View.extend({
	template: '#t-setting-item',
	className: 'list-group-item list-settings-item',
	events: {
		'input .form-control': 'onInput',
		'change .form-control[type="checkbox"]': 'onChange',
	},
	onInput: function(e) {
		console.log(e.currentTarget.value);
		this.model.set('value',e.currentTarget.value);
	},
	onChange: function(e) {
		this.model.set('value',e.currentTarget.checked);
		lsChannel.trigger('setup:save:success',this.model.attributes);
	}
});
View.Settings = Marionette.CollectionView.extend({
	tagName: 'ul',
	className: 'list-group navibar-pad',
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