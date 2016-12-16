function playSound(id) {
	if (_.find(localRead('settings'),{name: 'sound'}).value){
		var sound = $('#audio-'+id).get(0);
		sound.pause();
		sound.currentTime = 0;
		sound.play();
	} else {
		_.each($('audio'), function(el) {
			el.pause();
		})
	}
};

(function(){

Model = Backbone.Model.extend({
	defaults: {
		title: 'Default dictionary',
		name: 'default',
		version: 0,
		description: 'Contains different words'
	},
	getName: function() {
		return this.get('name')+'_v'+this.get('version');
	}
});
Collection = Backbone.Collection.extend({
	model: Model
});

Toggle = Marionette.View.extend({
	template: '#t-sound-toggler',
	className : 'sound-toggler',

	initialize: function() {
		lsChannel.on('setup:save:success',this.render);
	},
	onDestroy: function() {
		lsChannel.off('setup:save:success');
	},
	onBeforeRender: function() {
		var soundDataset = _.find(localRead('settings'),{name: 'sound'});
		this.model = new Setup.Data.Setting(soundDataset);
	},
	triggers: {
		'click' : 'toggle:sound'
	},
	onToggleSound: function() {
		this.model.set('value', !this.model.get('value'));
		var settings = localRead('settings');
		var soundIndex = _.findIndex(settings,{name: 'sound'});
		settings[soundIndex] = this.model.attributes;
		localSave('settings',settings);
		lsChannel.trigger('sound:save:success',settings);
		this.render();
	}

})



window.Sound = {
	choosed: new Model(),
	Model: Model,
	Collection: Collection,
	ToggleView: Toggle
	// Data: Data,
	// Entry: EntryPoint,
}

}());