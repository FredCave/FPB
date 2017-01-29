

var winH = $(window).height(),
	winW = $(window).width();

// 1.9. SECTIONS RESIZE

function winHFix () {
	console.log("winHFix", winH);
	winH = $(window).height();
	$("section").css("min-height",winH);
	$("#home").css("height",winH);
}

function setRowHeight ( i, grid ) {
	console.log("setRowHeight");
	// GET ALL CELLS IN ROW
	var maxH = 0;
	grid.find( "li[data-row=" + i + "]").each( function(j){
		console.log( 535, i, $(this).height(), maxH );
		if ( $(this).height() > maxH ) {
			maxH = $(this).height() + 24;
		}
	});
	grid.find("li[data-row=" + i + "]").css("height",maxH);
}

function rowHeight ( grid ) {
	console.log("rowHeight");
	// CHECK IF PARENT IS LOADED
	if ( !grid.parents("section").hasClass("loaded") ) {
		grid.parents("section").show().addClass("loaded");
		imageManager();
	}
	// setTimeout( function(){
	// 	grid.imagesLoaded().always( function( instance, image ){
	// 		console.log( 99, "Images loaded." );
	// 		// GET NUMBER OF ROWS
	// 		var rows = parseInt( grid.find(".image_cell").not(".hidden").last().attr("data-row") ),
	// 			i = 1;
	// 		console.log( 377, rows, i );			
	// 		// LOOP THROUGH ROWS
	// 		while ( i <= rows ) {
	// 			setRowHeight( i, grid );
	// 			i++;	
	// 		}	
	// 	});		
	// }, 500 );
}

