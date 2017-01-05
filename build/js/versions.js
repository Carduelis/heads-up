var checkVersion=function(){$.getJSON("assets/config.json").success(function(e){localRead("version")?localRead("version")!=e.version&&alert("new version available!"):localSave("version",e.version)}).fail(function(e){alert("Can not reach config-file")})};
//# sourceMappingURL=versions.js.map
