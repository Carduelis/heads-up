function startVibrate(t){navigator.vibrate(t)}function stopVibrate(){vibrateInterval&&clearInterval(vibrateInterval),navigator.vibrate(0)}function startPeristentVibrate(t,a){vibrateInterval=setInterval(function(){startVibrate(t)},a)}var vibrateInterval;
//# sourceMappingURL=vibration.js.map
