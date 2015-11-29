module.exports = function(e) {
	var lang = {
		names : ['arabic', 'persian', 'albanian', 'english', 'german'],
		labels : ['العربية', 'زبان فارسی', 'Shqipja', 'English', 'Deutsch']
	};
	var currentLanguage = Ti.App.Properties.hasProperty('CURRENTLANG') == true//
	? Ti.App.Properties.getString('CURRENTLANG') : 'english';
	var selected = null;
	if (currentLanguage) {
		lang.names.forEach(function(l, i) {
			if (l == currentLanguage)
				selected = i;
		});
		var dialog = Ti.UI.createOptionDialog({
			options : lang.labels,
			selectedIndex : (selected == undefined) ? lang.names.length - 2 : selected
		});
		dialog.addEventListener('click', function(e) {
			if (e.index >= 0) {
				Ti.App.Properties.setString('CURRENTLANG', lang.names[e.index]);
				Ti.App.fireEvent('changed', {
					language : lang.names[e.index]
				});
			}
		});
		dialog.show();
	}
};
