var Map = require('ti.map');

module.exports = function() {
	var $ = Ti.UI.createWindow({
		title : 'RefugeeMaps for Hamburg',
		exitOnClose : true
	});
	$.addEventListener('open', function() {
		$.map = Map.createView({
			region : {
				latitude : 53.553,
				longitude : 10,
				latitudeDelta : 0.1,
				longitudeDelta : 0.1,
				enableZoomControls : false
			}
		});
		$.add($.map);
		var adapter = require('adapters/refmaps')();
		adapter.OK = function(markers) {

		};
	});
	$.open();
};
