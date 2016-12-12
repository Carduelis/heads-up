function startVibrate(t){navigator.vibrate(t)}function stopVibrate(){vibrateInterval&&(clearInterval(vibrateInterval),vibrateInterval=!1),navigator.vibrate(0)}function startPeristentVibrate(t,a){vibrateInterval=setInterval(function(){startVibrate(t)},a)}var vibrateInterval=!1;
//# sourceMappingURL=vibration.js.map
