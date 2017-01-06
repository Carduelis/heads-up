var checkVersion = function(json) {
	if (!localRead('version')) {
		localSave('version',json.version);
	} else if (localRead('version') != json.version) {
		alert('new version available!');
	}
};