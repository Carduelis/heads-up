var checkVersion = function() {

	$.getJSON('assets/config.json')
	.success(function(json) {
		if (!localRead('version')) {
			localSave('version',json.version);
		} else if (localRead('version') != json.version) {
			alert('new version available!');
		}
	}) 
	.fail(function (json) {
		alert('Can not reach config-file');
	})

};