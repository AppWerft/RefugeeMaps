! function() {
	var DB = require('tibaqend');
	DB.connect('http://tutorial.baqend.com/');
	DB.ready(function() {
		console.log('Info: Baqend connected ========================================');
		DB.User.find();
	});
	require('ui/main')();
}();

