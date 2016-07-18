/****************************************************************************
    
	FUNCTIONS
		X.X. SECTION LOADER  			
		X.X. NEWS IMAGES PLACEMENT
		X.X. BOTTOM HEADER SCROLL

*****************************************************************************/

var winH = $(window).height()
	winW = $(window).width();

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

// PLACEMENT OF NEWS IMAGES

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
		thisTop = intervals[i] * ( Math.random() * 0.9 + 0.1 );
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

// BOTTOM HEADER SCROLL

function bottomHeader ( scroll ) {
	var topH = $("#top_header").outerHeight();
	if ( scroll < winH - ( topH + $("#bottom_header").outerHeight() ) ) {
		console.log("bottomHeader", scroll);
		$("#bottom_header").css({
			"bottom": scroll,
			"top": ""
		});
			// LOGO 
		if ( scroll > winH - ( topH + $("#main_logo").outerHeight() ) ) {
			console.log("Logo fixed.", scroll);
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
		console.log("bottomHeader fixed.", scroll);
		$("#bottom_header").css({
			"top": topH,
			"bottom": "inherit"
		});		
	}

}


