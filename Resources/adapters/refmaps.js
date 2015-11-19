const URL = 'http://refugeemaps.eu/_api/hotspots/hamburg.json';

if (!Ti.App.Properties.hasProperty('MARKERS')) {
	var refmaps = require('adapters/refmaps.default').markers;
	Ti.App.Properties.setString('MARKERS', JSON.stringify(refmaps));
}

module.exports = function() {
	function callbackFn() {
		if ($.OK)
			$.OK(JSON.parse(Ti.App.Properties.getString('MARKERS')));
	};
	if (!Ti.Network.online)
		callbackFn();

	var $ = Ti.Network.createHTTPClient({
		onload : function() {
			Ti.App.Properties.setString('MARKERS', this.responseText);
			callbackFn();
		},
		onerror : callbackFn
	});
	$.open('GET', URL);
	$.send();
	return $;
};
