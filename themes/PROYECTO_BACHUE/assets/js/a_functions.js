/****************************************************************************
    
	FUNCTIONS
		1.	 GENERAL
			1.1. SECTION LOADER
			1.2. IMAGE GRID MANAGER
			1.3. IMAGE GRID TOGGLE  			
		2. 	NAV
			2.1. GLOBAL NAV FUNCTION
		3.	 NEWS
			3.1. NEWS IMAGES PLACEMENT
			3.2. NEWS IMAGE HOVER
			X.X. BOTTOM HEADER SCROLL

*****************************************************************************/

var winH = $(window).height()
	winW = $(window).width();

/****************************************************************************
    
	1. GENERAL

*****************************************************************************/

// 1.1. SECTION LOADER

function sectionCheck ( scroll ) {
	var lastLoaded = parseInt( $("#wrapper").attr("data-loaded") );
	// IF ALL LOADED
	if ( lastLoaded > 5 ) {
		return false;
	} else {
		console.log( "sectionCheck", lastLoaded );
		// CHECK HOW CLOSE TO END OF LASTLOADED
		var target = $("section").eq( lastLoaded - 1 );
		var lastTop = target.offset().top;
		var lastEnd = lastTop + target.height();
		//console.log( lastLoaded, lastTop, lastEnd, scroll, "limit: ", lastEnd - ( scroll + winH ) );
		if ( ( lastEnd - ( scroll + winH ) ) < ( winH / 2 ) && lastLoaded <= 5 ) {
			// LOAD HERE 
			console.log( 44 );
			sectionLoad( lastLoaded );
		} 		
	}
}

// 1.2. IMAGE GRID MANAGER

	// GRID MANAGER
	// RUNS ON AJAX LOAD + MEDIA QUERY RESIZE

function gridManager () {
	console.log("gridManager");
	// LOOP THROUGH ALL GRIDS
	$(".image_grid").each( function(){
		var cols = $(this).data("col");
		// RESET
		$(this).find(".clear").remove();
		// LOOP THROUGH CELLS 
		var count = 1,
			row = 1;
		// START FIRST ROW SPAN
		$(this).find(".image_cell").each( function(){
			$(this).attr( "data-row", row );
			if ( count == cols ) {
				// ADD CLEAR DIV
				$(this).after("<div class='clear'></div><span class='grid_large'></span>");
				count = 1;
				row++;
			}
			count++;
		});
		// RUN ROW HEIGHT ON THIS GRID
		rowHeight( $(this) );
	});
}

	// ROW HEIGHT

function getCellHeight ( input ) {
	console.log("getCellHeight");
	var thisH = input.find(".image_small").outerHeight();
	if ( thisH > 0 && thisH !== null ) {
		console.log( 84, thisH );
		return thisH;
	} else {
		setTimeout( function(){
			getCellHeight( input );
		}, 500);
	}
}

function getRowHeight ( i ) {
	console.log("getRowHeight");
	var maxHeight = 0;		
	// LOOP THROUGH CELLS
	$( "li[data-row=" + i + "]").each( function(){
		var thisH = getCellHeight( $(this) )
		if ( thisH > maxHeight ) {
			maxHeight = thisH;
		}					
	});
	return maxHeight;
}

function setRowHeight ( i ) {
	console.log("setRowHeight");
	if ( getRowHeight(i) > 0 ) {
		console.log( 119, getRowHeight(i) );
		$( "li[data-row=" + i + "]" ).find(".image_small").css({
			"height" : getRowHeight(i)
		});			
	} else {
		console.log( 124, "Try again." );
		setTimeout( function(){
			setRowHeight(i);	
		}, 500 );
	}
}

function rowHeight ( grid ) {
	console.log("rowHeight");
	grid.imagesLoaded().always( function( instance, image ){
		console.log( 99, "Images loaded." );
		// GET NUMBER OF ROWS
		var rows = parseInt( grid.find(".image_cell:last-child").attr("data-row") ),
			i = 1;			
		// LOOP THROUGH ROWS
		while ( i <= rows ) {
			setRowHeight( i );
			i++;	
		}	
	});

}

// 1.3. IMAGE GRID TOGGLE

function gridOpen ( click ) {
	// CLICK == IMG TAG
	console.log("gridOpen");
	var grid = click.parents("ul");
	// CALCULATE HOW MANY IMAGES IN ROW
	var rowL = grid.data("col");
	// CLOSE OTHER IMAGES
	grid.find(".grid_large").css({
		"height" : "0"
	});

	// CALCULATE HEIGHT OF GRID_LARGE
	var imgW = parseInt( click.attr("width") ),
		imgH = parseInt( click.attr("height") ),
		colW = parseInt( grid.width() ),
		largeH = imgH / imgW * colW;
	if ( click.hasClass("portrait") ) {
		// console.log( 100, largeH );
		largeH = largeH * 0.67;
		// console.log( 102, largeH );
	} 

	click.clone().appendTo( click.parents().siblings(".clear") );

	// GIVE HEIGHT TO FOLLOWING GRID_LARGE
	var rowNo = click.parents("li").attr("data-row");
	console.log( 167, rowNo );
	
	grid.find( "span:nth-of-type(" + rowNo + ")" ).css({
		"height" : largeH
	});

}

function gridClose ( click ) {
	console.log("gridClose");
	// REMOVE ALL EXPANDED CLASSES
}

/****************************************************************************
    
	2. NAV

*****************************************************************************/

// 2.1. GENERAL NAV FUNCTION

	function navScroll ( target ) {
		console.log( "navScroll", target );
		var scrollPoint = $(target).offset().top,
			scrollOffset = -120;
		if ( scrollPoint != 0 ) {
			console.log( 110, scrollPoint, "Scroll." );
			$("html,body").animate({
				scrollTop : scrollPoint + scrollOffset
			}, 1000 );
		} else {
			console.log( 115, "Keep trying.", scrollPoint );
			setTimeout( function(){
				navScroll( target ); 	
			}, 500 );
		}
	}

	function navManager ( target, id ) {
		console.log("navManager", target, id);
		// PRIMED SWITCH SO ONLE ONE AJAX READY EVENT IS FIRED PER CLICK
		var primed = true;
		if ( $(target).length ) {
			// IF LOADED
			navScroll( target );
		} else {
			// NOT LOADED
			console.log( 109, "Target is not loaded." );
			// COUNT HOW MANY SECTIONS ARE LOADED
			var loaded = parseInt( $("#wrapper").attr("data-loaded") ),
				targetId = parseInt(id);
			// LOOP UP UNTIL TARGET SECTION
			while ( loaded <= targetId ) {
				sectionLoad( loaded );
				loaded++;
			}
			// ON AJAX READY EVENT: SCROLL
			$("#wrapper").on( "ajax_ready", function(e){
				// CHECK IF PRIMED
				if ( primed ) {
					console.log("Ajax loaded. Ready to scroll.", target, loaded, primed);
					setTimeout( function(){
						navScroll( target );	
					}, 200 );
					primed = false;
				}
			});		
		}
	}

// 2.2. BOTTOM HEADER SCROLL

function bottomHeader ( scroll ) {
	var topH = $("#top_header").outerHeight();
	if ( scroll < winH - ( topH + $("#bottom_header").outerHeight() ) ) {
		// NORMAL SCROLLING
		$("#bottom_header").css({
			"position" : "absolute",
			"top" : ""
		});
			// LOGO 
		if ( scroll > winH - ( topH + $("#main_logo").outerHeight() ) ) {
			// LOGO FIXED
			$("#main_logo").css({
				"position" : "fixed",
				"top": topH,
				"bottom": "inherit",
				"left": ""
			});
		} else {
			// LOGO NORMAL SCROLL
			$("#main_logo").css({
				"position" : "",
				"top": "",
				"bottom": "",
				"left": ""
			});		
		}
	} else {
		// FIXED AT TOP
		$("#bottom_header").css({
			"position" : "fixed",
			"top": topH
		});		
	}

}

/****************************************************************************
    
	2. NEWS

*****************************************************************************/

// 3.1. PLACEMENT OF NEWS IMAGES

// function newsImages () {
// 	console.log("newsImages");
// 	// CREATE INTERVALS BASED ON NUMBER OF IMAGES
// 	// BETWEEN 5% & 65%
// 	var noImgs = $("#news_list li").length,
// 		interval = 60 / noImgs,
// 		intervals = [],
// 		thisLeft,
// 		thistop;
// 	for ( var i = 1; i <= noImgs; i++ ) {
// 		intervals.push( interval * i + 5 );
// 	}
// 	// console.log( 47, noImgs, interval, intervals );
// 	// ASSIGN INTERVALS WITH SLIGHT RANDOM MODIFICATION
// 	$("#news_list li").each( function(i){
// 		thisLeft = intervals[intervals.length-(i+1)] * ( Math.random() * 0.9 + 0.1 );
// 		thisTop = ( intervals[i] - 20 ) * ( Math.random() * 0.9 + 0.1 ); // REDUCED BY 20 SO THAT MAX IS 40
// 		// console.log( 57, thisLeft, thisTop );
// 		$(this).css({
// 			"top" : thisTop + "%",
// 			"left" : thisLeft + "%"
// 		});

// 	});
// 	// FADE IN IMAGES
// 	$(".news_post").animate({
// 		"opacity": 1
// 	}, 500);
// }

// 3.2. NEWS IMAGES HOVER

// function newsHover ( news_post ) {
// 	console.log("newsHover");
// 	var currZ = parseInt( news_post.css("z-index") );
// 	news_post.css( "z-index", currZ + 1 ).siblings().css( "z-index", "1" );
// }


