/****************************************************************************
    
	FUNCTIONS
		1.	 GENERAL
			1.1. SECTION LOADER
			1.2. IMAGE GRID HEIGHT CHECK
			1.3. IMAGE GRID TOGGLE  			
		2.	 NEWS
			2.1. NEWS IMAGES PLACEMENT
			2.2. NEWS IMAGE HOVER
			X.X. BOTTOM HEADER SCROLL

*****************************************************************************/

var winH = $(window).height()
	winW = $(window).width();

// 1.1. SECTION LOADER

// STORE LAST LOADED SECTION
var lastLoaded = 0;
function sectionLoader ( scroll ) {
	// IF ALL LOADED
	if ( lastLoaded > 3 ) {
		return false;
	} else {
		console.log("sectionLoader");
		// CHECK HOW CLOSE TO END OF LASTLOADED
		var target = $("section").eq(lastLoaded);
		var lastTop = target.offset().top;
		var lastEnd = lastTop + target.height();
		console.log( lastLoaded, target.attr("id"), lastTop );
		//console.log( lastLoaded, lastTop, lastEnd, scroll, "limit: ", lastEnd - ( scroll + winH ) );
		if ( ( lastEnd - ( scroll + winH ) ) < ( winH / 2 ) && lastLoaded <= 3 ) {
			console.log("load");
			// LOAD HERE 
			sectionLoad( lastLoaded );
			// UPDATE LASTLOADED
			lastLoaded += 1;
			console.log( 26, lastLoaded );
		} 		
	}

}

// 1.2. IMAGE GRID HEIGHT CHECK

function gridHeight () {
	console.log("gridCheck");
	// LOOP THROUGH ALL GRIDS
	$(".image_grid").each( function(){
		// INITIAL HEIGHT = 15vw
		var gridCellH = winW * 0.15;
		// GET HEIGHT OF BIGGEST CELL 
		// NEEDS IMPROVING – BY ROW
		$(this).find(".image_cell").each( function(){
			var cellH = 0;
			// CHECK IF IMAGES HAVE LOADED
			var thisCell = $(this);
			$(this).imagesLoaded().done( function(){
				console.log( 60, thisCell.find(".image_small img").height() );
				thisCell.find(".image_small").children().each( function(){
					cellH += $(this).outerHeight() + 24;
				});
				// console.log( 54, cellH );
				if ( cellH > gridCellH ) {
					gridCellH = cellH;
				}
			});
		});
		console.log( 63, gridCellH );
		// SET ALL CELL HEIGHTS
		$(this).find(".image_small").css( "height", gridCellH );
	});
}

// 1.3. IMAGE GRID TOGGLE

function gridOpen ( click ) {
	console.log("gridOpen");
	// ADD EXPANDED CLASS TO CLICKED IMAGE
	click.parents(".image_cell").removeClass("collapsed").addClass("expanded").siblings().removeClass("expanded").addClass("collapsed");	
	// GET IMAGE TO FALL BELOW TALLEST IN ROW
	// CALCULATE DISTANCE TO LEFT
}

function gridClose ( click ) {
	console.log("gridClose");
	// REMOVE ALL EXPANDED CLASSES
	click.parents(".image_grid").find(".expanded").removeClass("expanded").addClass("collapsed");
}


// 2.1. PLACEMENT OF NEWS IMAGES

function newsImages () {
	console.log("newsImages");
	// CREATE INTERVALS BASED ON NUMBER OF IMAGES
	// BETWEEN 5% & 65%
	var noImgs = $("#news_list li").length,
		interval = 60 / noImgs,
		intervals = [],
		thisLeft,
		thistop;
	for ( var i = 1; i <= noImgs; i++ ) {
		intervals.push( interval * i + 5 );
	}
	console.log( 47, noImgs, interval, intervals );
	// ASSIGN INTERVALS WITH SLIGHT RANDOM MODIFICATION
	$("#news_list li").each( function(i){
		thisLeft = intervals[intervals.length-(i+1)] * ( Math.random() * 0.9 + 0.1 );
		thisTop = ( intervals[i] - 20 ) * ( Math.random() * 0.9 + 0.1 ); // REDUCED BY 20 SO THAT MAX IS 40
		console.log( 57, thisLeft, thisTop );
		$(this).css({
			"top" : thisTop + "%",
			"left" : thisLeft + "%"
		});

	});
	// FADE IN IMAGES
	$(".news_post").animate({
		"opacity": 1
	}, 500);
}

// 2.2. NEWS IMAGES HOVER

function newsHover ( news_post ) {
	console.log("newsHover");
	var currZ = parseInt( news_post.css("z-index") );
	news_post.css( "z-index", currZ + 1 ).siblings().css( "z-index", "1" );
}

// BOTTOM HEADER SCROLL

function bottomHeader ( scroll ) {
	var topH = $("#top_header").outerHeight();
	if ( scroll < winH - ( topH + $("#bottom_header").outerHeight() ) ) {
		// console.log("bottomHeader", scroll);
		$("#bottom_header").css({
			"bottom": scroll,
			"top": ""
		});
			// LOGO 
		if ( scroll > winH - ( topH + $("#main_logo").outerHeight() ) ) {
			// console.log("Logo fixed.", scroll);
			$("#main_logo").css({
				"position" : "fixed",
				"top": topH,
				"bottom": "inherit",
				"left": "1px"
			});
		} else {
			$("#main_logo").css({
				"position" : "",
				"top": "",
				"bottom": "",
				"left": ""
			});		
		}
	} else {
		// console.log("bottomHeader fixed.", scroll);
		$("#bottom_header").css({
			"top": topH,
			"bottom": "inherit"
		});		
	}

}



