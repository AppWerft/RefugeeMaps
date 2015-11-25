var Map = require('ti.map');
// find . -type f -name "*.png" -exec convert {} -strip {} \;
var Adapter = require('adapters/refmaps');
var Refresher = require('com.rkam.swiperefreshlayout');

function capitalize(s) {
	return s[0].toUpperCase() + s.slice(1);
}

var Freifunk = require('adapters/freifunk');
var MarkerManager = require('vendor/markermanager');

module.exports = function() {
	var $ = Ti.UI.createWindow({
		title : 'RefugeeMaps for Hamburg',
		exitOnClose : true,
		backgroundColor : 'white',

	});
	$.map = Map.createView({
		region : {
			latitude : 53.553,
			longitude : 10,
			latitudeDelta : 0.1,
			longitudeDelta : 0.1

		},
		enableZoomControls : false,
		compassEnabled : false,
		userLocation : true,
		userLocationButton : false,

	});
	$.list = Ti.UI.createView({
		top : 50
	});
	$.list.add(Refresher.createSwipeRefresh({
		view : Ti.UI.createTableView({
			top : 50,
		}),
		dummy : 'xyz',
		top : 50
	}));
	$.add(Ti.UI.createScrollableView({
		views : [$.map, $.list]
	}));

	$.add(Ti.UI.createView({
		top : 0,
		height : 50,
		backgroundColor : '#6000'
	}));
	$.children[1].add(Ti.UI.createButton({
		backgroundImage : '/assets/list.png',
		width : 50,
		height : 50,
		right : 10
	}));

	$.children[1].add(Ti.UI.createButton({
		backgroundImage : '/assets/filter.png',
		width : 50,
		height : 50,
		right : 60
	}));
	$.children[1].add(Ti.UI.createLabel({
		width : Ti.UI.FILL,
		color : 'white',
		text : 'Your position:\nunknown',
		font : {
			fontWeight : 'bold'
		},
		height : Ti.UI.FILL,
		left : 10
	}));
	$.drawer = Ti.UI.createScrollView({
		layout : 'vertical',
		scrollType : 'vertical',
		top : 50,
		backgroundColor : 'white',
		left : -200,
		width : 200,
		height : Ti.UI.FILL,
		opacity : 0.96
	});
	Adapter.getPOIs(function(_result) {
		$.markerdata = _result.markers;
		$.categorydata = _result.categories;
		$.map.addAnnotations($.markerdata.map(function(marker) {
			return Map.createAnnotation({
				latitude : marker.position.lat,
				longitude : marker.position.lng,
				title : marker.name,
				subtitle : marker.translations[0].text,
				image : '/images/' + marker.category + '.png'
			});
		}));
		Adapter.sortByDistanceToOwnPosition($.markerdata, function(sortedmarkerdata) {
			$.list.children[0].view.setData(sortedmarkerdata.map(require('ui/row')));
		}, function(_address) {
			$.children[1].children[2].text = 'Your position:\n' + _address.street + ' ' + _address.street_number;
		});
		$.drawer && $.drawer.removeAllChildren();
		console.log('CATEGORIES');
		for (var key in $.categorydata) {
			var selected = $.categorydata[key];
			console.log(key + '=' + selected);
			var strip = Ti.UI.createView({
				top : 5,
				height : 32
			});
			strip.add(Ti.UI.createSwitch({
				right : 10,
				width : Ti.UI.SIZE,
				value : selected !== undefined ? selected : true,
				key : key,
				//	style : Ti.UI.Android.SWITCH_STYLE_TOGGLEBUTTON,
				top : 5,
				height : Ti.UI.SIZE
			}));
			strip.add(Ti.UI.createImageView({
				top : 5,
				touchEnabled : false,
				left : 5,
				width : 20,
				height : 25,
				image : '/assets/' + key + '.png'
			}));
			strip.add(Ti.UI.createLabel({
				top : 5,
				height : Ti.UI.SIZE,
				left : 30,
				color : '#444',
				touchEnabled : false,
				text : capitalize(key)
			}));
			$.drawer && $.drawer.add(strip);
		};

	});

	$.add($.drawer);
	$.drawer.addEventListener('swipe', function(e) {
		if (e.direction == 'left' || (e.direction == 'right'))
			$.drawer.animate({
				left : -200,
				duration : 100
			});
	});
	// changing of filter
	$.drawer.addEventListener('change', function(e) {
		if (e.source.key == 'freewifi') {
			if (e.source.value === false) {
				$.FreifunkOverlay && $.FreifunkOverlay.destroy();
			} else {
				Freifunk(function(res) {
					if (!Array.isArray(res.nodes))
						return;
					var points = res.nodes.map(function(p) {
						return {
							lat : p.lat,
							lng : p.lon,
							title : 'Free Wifi by Freifunk',
							subtitle : p.name,
							image : p.online ? '/images/freifunk.png' : '/images/freifunk_.png'
						};
					});
					$.FreifunkOverlay = new MarkerManager({
						maxannotations : 120,
						points : points,
						map : $.map // reference to mapview
					});
				});

			}
		} else {
		}
		var categories = Ti.App.Properties.getObject('MARKERCATEGORIES', {});
		categories[e.source.key] = e.source.value;
		Ti.App.Properties.setObject('MARKERCATEGORIES', categories);

	});
	$.children[0].addEventListener('scrollend', function(_e) {
		$.children[1].children[0].backgroundImage = _e.source.currentPage == 0 ? '/assets/list.png' : '/assets/map.png';
	});
	// Pagetype  map|list
	$.children[1].children[0].addEventListener('singletap', function(_e) {
		if ($.children[0].currentPage == 0) {
			$.drawer.animate({
				left : -200,
				duration : 100
			});
			$.children[0].scrollToView(1);
		} else {
			$.children[0].scrollToView(0);
		}
	});
	// Filter
	$.children[1].children[1].addEventListener('singletap', function(_e) {
		if ($.drawer.left == 0) {
			$.drawer.animate({
				left : -200,
				duration : 100
			});
		} else {
			$.children[0].scrollToView(0);
			$.drawer.animate({
				left : 0,
				duration : 100
			});
		}
	});
	$.list.children[0].addEventListener('refreshing', function() {
		Adapter.sortByDistanceToOwnPosition($.markerdata, function(sortedmarkerdata) {
			$.list.children[0].setRefreshing(false);
			$.list.children[0].view.setData(sortedmarkerdata.map(require('ui/row')));

		}, function(_address) {
			$.children[1].children[2].text = 'Your position:\n' + _address.street + ' ' + _address.street_number;
		});
		setTimeout(function() {
			$.list.children[0].setRefreshing(false);
		}, 10000);

	});
	$.addEventListener('open', function() {
		$.activity.actionBar.hide();
		Freifunk(function(res) {
			if (!res || !Array.isArray(res.nodes))
				return;
			var points = res.nodes.map(function(p) {
				return {
					lat : p.lat,
					lng : p.lon,
					title : 'Free Wifi by Freifunk',
					subtitle : p.name,
					image : p.online ? '/images/freifunk.png' : '/images/freifunk_.png'
				};
			});
			$.FreifunkOverlay = new MarkerManager({
				maxannotations : 120,
				points : points,
				map : $.map // reference to mapview
			});
		});

		require('vendor/versionsreminder')();
	});
	$.addEventListener("android:back", function(_e) {
		_e.cancelBubble = true;
		var intent = Ti.Android.createIntent({
			action : Ti.Android.ACTION_MAIN,
			flags : Ti.Android.FLAG_ACTIVITY_NEW_TASK
		});
		intent.addCategory(Ti.Android.CATEGORY_HOME);
		Ti.Android.currentActivity.startActivity(intent);
		return false;
	});
	Ti.Gesture.addEventListener('orientationchange', function() {
		$.children[1] && $.children[1].setTop(Ti.Platform.displayCaps.platformHeight > Ti.Platform.displayCaps.platformWidth ? 0 : -50);
	});
	$.open();

};
