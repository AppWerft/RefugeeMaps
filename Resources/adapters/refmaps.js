const URL = 'http://refugeemaps.eu/_api/hotspots/hamburg.json';

if (!Ti.App.Properties.hasProperty('MARKERS')) {
	console.log('Info: first start=> we copy markers from Resources');

	var refmaps = require('adapters/refmaps.default').markers;
	Ti.App.Properties.setString('MARKERS', JSON.stringify(refmaps));
}

var GeoTools = require('vendor/georoute').createGeo();

exports.sortByDistanceToOwnPosition = function(_markerdata, _cb) {
	GeoTools.getLocation(function(_coords) {
		_markerdata.forEach(function(marker) {
			marker.distance = GeoTools.getDistBearing(_coords.latitude, _coords.longitude, marker.position.lat, marker.position.lng).distance;
			marker.bearing = GeoTools.getDistBearing(_coords.latitude, _coords.longitude, marker.position.lat, marker.position.lng).bearing;
		});
		_markerdata.sort(function(a, b) {
			return a.distance > b.distance ? 1 : -1;
		});
		_cb(_markerdata);
	});

};

exports.getPOIs = function(OKFn) {
	function callbackFn() {
		if (OKFn)
			OKFn(JSON.parse(Ti.App.Properties.getString('MARKERS')));
		else if ($.OK)
			$.OK(JSON.parse(Ti.App.Properties.getString('MARKERS')));
	};
	if (!Ti.Network.online) {
		console.log('Warning: offline => we use old markers');
		callbackFn();
	}
	var $ = Ti.Network.createHTTPClient({
		onload : function() {
			console.log('Info: online => we use fresh markers');
			Ti.App.Properties.setString('MARKERS', this.responseText);
			callbackFn();
		},
		onerror : callbackFn
	});
	$.open('GET', URL);
	$.send();
	return $;
};
