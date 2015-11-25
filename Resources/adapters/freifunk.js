module.exports = function(cbFn) {
	var args = arguments[0] || {};
	if (Ti.Network.online == false) {
		cbFn && cbFn(Ti.App.Properties.getObject("FF"), null);
		return;
	}
	var start = new Date().getTime();
	var xhr = Ti.Network.createHTTPClient({
		timeout : 30000,
		validatesSecureCertificate : false,
		onload : function() {
			this.start = start;
			var res = require('adapters/freifunk.parser')(this);
			Ti.App.Properties.setObject('FF', res);
			cbFn && cbFn(res);
			},
		onerror : function() {
			if (Ti.App.Properties.hasProperty(args.name)) {
				cbFn && cbFn(Ti.App.Properties.getObject('NODE_' + args.name, null));
			}
			cbFn && cbFn(null);
		}
	});
	xhr.open('GET','https://map.hamburg.freifunk.net/nodes.json');
	xhr.setRequestHeader('Accept', 'text/javascript, application/javascript,application/xml');
	xhr.setRequestHeader('User-Agent', 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10.10; rv:37.0) Gecko/20100101 Firefox/37.0');
	xhr.send();
};

