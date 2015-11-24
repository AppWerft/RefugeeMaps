module.exports = function(marker) {
	var row = Ti.UI.createTableViewRow({
		height : Ti.UI.SIZE
	});
	row.add(Ti.UI.createImageView({
		left : 5,
		top : 5,
		width : 30,
		height : 40,
		image : '/assets/' + marker.category + '.png'
	}));
	row.add(Ti.UI.createView({
		left : 60,
		top : 5,
		width : Ti.UI.FILL,
		height : Ti.UI.SIZE,
		layout : 'vertical'
	}));
	row.children[1].add(Ti.UI.createLabel({
		top : 0,
		textAlign : 'left',
		width : Ti.UI.FILL,
		text : marker.name,
		color : '#777',
		font : {
			fontSize : 22,
			fontWeight : 'bold'
		}
	}));
	if (marker.address) {
		var address = marker.address.split(',');
		address.pop();
		address.pop();
		row.children[1].add(Ti.UI.createLabel({
			top : 0,
			width : Ti.UI.FILL,
			textAlign : 'left',
			text : address.join(', '),
			color : '#333'
		}));
	}
	console.log(marker.distance);
	row.children[1].add(Ti.UI.createLabel({
		top : 0,
		width : Ti.UI.FILL,
		textAlign : 'left',
		text : 'Distance: ' + (parseFloat(marker.distance) / 1000).toFixed(2) + ' km',
		color : '#111',font: {fontWeight:'bold'}
	}));
	return row;

};
