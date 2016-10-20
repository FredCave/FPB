/****************************************************************************
    
	FUNCTIONS
		1.	 GENERAL
			1.1. SECTION LOADER
			1.2. IMAGE GRID MANAGER
			1.3. IMAGE GRID TOGGLE  
			1.4. LAZYLOADING 		
		2. 	NAV
			2.1. GLOBAL NAV 
			2.2. BOTTOM HEADER SCROLL
			2.3. NAV UNDERLINE
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
		// IS THERE A BETTER WAY THAN REMOVING .GRID_LARGE??
		$(this).find(".clear").remove();
		$(this).find(".grid_large").remove();
		// LOOP THROUGH CELLS 
		var count = 1,
			row = 1,
			totalCells = $(this).find(".image_cell").length;
		console.log( 64, totalCells );
		$(this).find(".image_cell").each( function(){
			$(this).attr( "data-row", row );
			// IF END OF THE ROW OR IF LAST CELL
			if ( count % cols === 0 || count === totalCells ) {
				// ADD CLEAR DIV + IMAGE WRAPPER
				$(this).after("<div class='clear'></div><div class='grid_large row_" + row + "'><div class='image_wrapper'></div><div class='grid_close'></div></div>");
				row++;
			} 
			count++;
		});
		// RUN ROW HEIGHT ON THIS GRID
		// rowHeight( $(this) );
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
	// CLICK == .IMAGE_SMALL
	console.log("gridOpen");
	var grid = click.parents(".image_grid"),
		img = click.find("img");
	// CALCULATE HOW MANY IMAGES IN ROW
	var rowL = grid.data("col");
	// CLOSE OTHER IMAGES
	grid.find(".grid_large").css({
		"height" : "0"
	});

	// CALCULATE HEIGHT OF GRID_LARGE
	var imgW = parseInt( img.attr("width") ),
		imgH = parseInt( img.attr("height") ),
		colW = parseInt( grid.width() ),
		largeH = imgH / imgW * colW * 0.9;
	if ( img.hasClass("portrait") ) {
		console.log( 162, largeH );
		largeH = largeH * 0.67;
		console.log( 164, largeH );
	} 

	// CLOSE ANY OPEN IMAGES IN GRID
	// + ADD RESET CLASS
	grid.find(".grid_large").css("height","0").find(".image_wrapper").empty().removeClass("full").addClass("empty");	

	// GIVE HEIGHT TO FOLLOWING GRID_LARGE
	var rowNo = click.parents("li").attr("data-row");
	console.log( 167, rowNo );
	
	grid.find( ".row_" + rowNo ).css({
		"height" : largeH
	});

	// CLONE IMAGE AND APPEND TO FOLLOWING .GRID_LARGE
	img.clone().appendTo( grid.find( ".row_" + rowNo + " .image_wrapper" ) );
	// RUN IMAGE RESIZE
	imageManager( grid.find( ".row_" + rowNo + " img" ) );
	// FADE IN
	grid.find( ".row_" + rowNo ).removeClass("empty").addClass("full").find(".grid_close").fadeIn();

}

function gridClose ( click ) {
	console.log("gridClose");
	// CLOSE PARENT
	// + ADD RESET CLASS
	click.fadeOut();
	click.parents(".grid_large").css("height","0").find(".image_wrapper").empty().removeClass("full").addClass("empty");	
}

// 1.4. IMAGE LAZYLOAD

function imageResizer ( img ) {
	console.log("imageResizer");
	// CHANGE POINTS: THM = 300 / MED = 600 / LRG = 900
	if ( img.width() <= 300 ) {
		img.attr( "src", img.attr("data-thm") );
	} else if ( img.width() > 300 && img.width() <= 600 ) {
		img.attr( "src", img.attr("data-med") );
	} else {
		img.attr( "src", img.attr("data-lrg") );
	}
}

function imageManager ( img ) {
	console.log("imageManager");
	if (typeof img !== 'undefined') {
		// RUN ON ONE IMAGE
		console.log( 199, "Run on only one image." );
		imageResizer( img );
    } else {
    	console.log( 196, "Run on all images.");
		// LOOP THROUGH IMAGES
		$("img").each( function(i){
			imageResizer( $(this) );
		});
    }
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
		// RUN UNDERLINE FUNCTION	
		navUnderline( scroll );
	}

}

// 2.3. NAV UNDERLINE

// CREATE EMPTY OBJECT TO HOLD START + END POINTS 
var pb_sections = {};

function sectionMarkers ( ) {
	// RUNS ON AJAX LOAD + RESIZE
	console.log( "sectionMarkers" );
	// LOOP THROUGH SECTIONS
	$("section").each( function(i){
		var start = $(this).offset().top,
			end  = start + $(this).height();
		$(this).attr({
			"data-start" : start, 
			"data-end" : end
		});
		var section = {};
		section._start = start;
		section._end = end;
		// APPEND OBJECT TO PB_SECTIONS
		pb_sections[i] = section;
	});
	console.log( pb_sections );
}

function navUnderline ( scroll ) {
	// console.log( "navUnderline", scroll );
	// LOOP THROUGH PB_SECTIONS OBJECT
	// for ( var i = 5; i >= 0; i-- ) {
	// 	console.log( 350, i, scroll );
	// 	if ( scroll > pb_sections[i]._start && scroll <= pb_sections[i]._end ) {
	// 		$("#bottom_header li").eq( i - 1 ).css({
	// 			"border-bottom" : "2px solid pink"
	// 		}).siblings().css({
	// 			"border-bottom" : ""
	// 		});
	// 	}
	// } 
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


