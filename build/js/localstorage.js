function localSave(e,s){try{localStorage.setItem(e,JSON.stringify(s)),lsChannel.trigger("save:success",e)}catch(r){console.error(r),lsChannel.trigger("save:error")}return!0}function localHas(e){return null!==localRead(e)}function localRead(e){var s=JSON.parse(localStorage.getItem(e));return s}var lsChannel=Backbone.Radio.channel("ls"),LS=Marionette.Object.extend({channelName:"ls",radioEvents:{"save:success":"showSuccessMessage","save:error":"showErrorMessage"},showSuccessMessage:function(e){console.log(e,"is saved")},showErrorMessage:function(e){alert("Save-error")}});ls=new LS;
//# sourceMappingURL=localstorage.js.map
