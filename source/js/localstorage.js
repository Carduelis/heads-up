function localSave(key,json) {
	try {
		localStorage.setItem(key, JSON.stringify(json));
		lsChannel.trigger('save:success',key);
	} catch (e) {
		console.error(e);
		lsChannel.trigger('save:error');
	}
	return true;
};
function localHas(key) {
	return localRead(key) !== null
}
function localRead(key) {
	var json = JSON.parse(localStorage.getItem(key));
	return json;
};

var lsChannel = Backbone.Radio.channel('ls');
var LS = Marionette.Object.extend({
	channelName: 'ls',
	radioEvents: {
		'save:success': 'showSuccessMessage',
		'save:error': 'showErrorMessage'
	},

	showSuccessMessage: function(key) {
		console.log(key,'is saved');
	},
	showErrorMessage: function(msg) {
		alert('Save-error')
	},
});
ls = new LS();