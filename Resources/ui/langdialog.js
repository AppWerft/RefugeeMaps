module.exports = function(_e) {
	var lastlang = Ti.App.Properties.getString('MYLANG'),
	    langs = ['arabic', 'persian', 'albanian', 'english', 'german'],
	    selected = null;
	if (lastlang === undefined) {
		lastlang = 'german';
		console.log('lastlangsetting2=' + lastlang);
	}
	console.log('lastlang=' + lastlang);
	langs.forEach(function(l, i) {
		if (l == lastlang)
			selected = i;
	});
	console.log('lang=' + selected);
	var opts = {
		options : ['العربية', 'زبان فارسی', 'Shqipja', 'English', 'Deutsch'],
		selectedIndex : selected
	};
	console.log(opts);
	var dialog = Ti.UI.createOptionDialog(opts);
	dialog.addEventListener('click', function(e) {
		console.log(e);
		Ti.App.Properties.setString('MYLANG', langs[e.index]);
	});
	dialog.show();

};
