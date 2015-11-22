var Map = require('ti.map');
// find . -type f -name "*.png" -exec convert {} -strip {} \;
var Adapter= require('adapters/refmaps');

module.exports = function() {
	var $ = Ti.UI.createWindow({
		title : 'RefugeeMaps for Hamburg',
		exitOnClose : true,
		backgroundColor : 'white',
		theme : 'Theme.NoActionBar'
	});
	$.addEventListener('open', function() {
		$.activity.actionBar.hide();
		$.map = Map.createView({
			region : {
				latitude : 53.553,
				longitude : 10,
				latitudeDelta : 0.1,
				longitudeDelta : 0.1

			},
			enableZoomControls : false,
			compassEnabled : false,
			userLocation:true,
			userLocationButton:false,
			
		});
		$.list = Ti.UI.createView({
			top : 50,
			bottom : 0
		});
		$.list.add(Ti.UI.createTableView({
			top : 50,
		}));
		$.add(Ti.UI.createScrollableView({
			views : [$.map, $.list]
		}));
		
		Adapter.getPOIs(function(markerdata) {
			$.map.addAnnotations(markerdata.map(function(marker) {
				return Map.createAnnotation({
					latitude : marker.position.lat,
					longitude : marker.position.lng,
					title : marker.name,
					subtitle : marker.translations[0].text,
					image : '/images/' + marker.category + '.png'
				});
			}));
			Adapter.sortByDistanceToOwnPosition(markerdata,function(sortedmarkerdata){
				$.list.children[0].setData(sortedmarkerdata.map(require('ui/row')));
			});
			
		});
		$.add(Ti.UI.createView({
			top : 0,
			height : 50,
			backgroundColor : '#6000'
		}));
		$.children[1].add(Ti.UI.createButton({
			backgroundImage : '/assets/map.png',
			width : 30,
			height : 30,
			right : 10
		}));
		$.children[1].add(Ti.UI.createButton({
			backgroundImage : '/assets/filter.png',
			width : 30,
			height : 30,
			right : 70
		}));
		$.children[1].children[0].addEventListener('click', function(_e) {
			if ($.children[0].currentPage == 0) {
				$.children[0].scrollToView(1);
			} else {
				$.children[0].scrollToView(0);
			}
		});
		$.children[0].addEventListener('scrollend', function(_e) {
			 $.children[1].children[0].backgroundImage=  _e.source.currentPage == 0 ? '/assets/map.png' : '/assets/list.png';
		});
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
