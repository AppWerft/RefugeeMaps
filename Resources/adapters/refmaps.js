const URL = 'http://refugeemaps.eu/_api/hotspots/hamburg.json';

if (!Ti.App.Properties.hasProperty('MARKERS')) {
	var refmaps = require('adapters/refmaps.default').markers;
	Ti.App.Properties.setString('MARKERS', JSON.stringify(refmaps));
}

var GeoTools = require('vendor/georoute').createGeo();

exports.sortByDistanceToOwnPosition = function(_markerdata, _onPosition, _onAddress) {
	GeoTools.getLocation(function(_coords) {
		_markerdata.forEach(function(marker) {
			marker.distance = GeoTools.getDistBearing(_coords.latitude, _coords.longitude, marker.position.lat, marker.position.lng).distance;
			marker.bearing = GeoTools.getDistBearing(_coords.latitude, _coords.longitude, marker.position.lat, marker.position.lng).bearing;
		});
		_markerdata.sort(function(a, b) {
			return a.distance > b.distance ? 1 : -1;
		});
		_onPosition(_markerdata);
		GeoTools.getAddress(_coords, _onAddress);
	});

};

exports.getPOIs = function(OKFn) {
	function callbackFn() {
		var markers = JSON.parse(Ti.App.Properties.getString('MARKERS'));
		var lastcategories = Ti.App.Properties.getObject('MARKERCATEGORIES', {});
		var categories = {};
		markers.forEach(function(marker) {
			categories[marker.category] = (lastcategories[marker.category] == undefined) ? true : lastcategories[marker.category];
		});
		if (categories.freewifi == undefined) categories.freewifi = true;
		Ti.App.Properties.setObject('MARKERCATEGORIES', categories);
		var result = {
			markers : markers,
			categories : categories
		};
		if (OKFn)
			OKFn(result);
		else if ($.OK)	
			$.OK(result);
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
