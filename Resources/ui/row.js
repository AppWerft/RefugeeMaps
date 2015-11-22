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
	row.children[1].add(Ti.UI.createLabel({
		top : 0,
		width : Ti.UI.FILL,
		textAlign : 'left',
		text : marker.address,
		color : '#333'
	}));
	return row;

};
