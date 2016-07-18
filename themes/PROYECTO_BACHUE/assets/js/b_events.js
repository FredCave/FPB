/*****************************************************************************
    
	EVENTS
		2.1. 
		2.2.
		2.3. 

*****************************************************************************/

$( document ).ready(function() {


// 2.3 WINDOW EVENTS

	var winScroll;

	$(window).on("load", function(){
		sectionLoader( 0 );
		newsImages();
	}).on('scroll', _.throttle(function() {
		winScroll = $(window).scrollTop();
		sectionLoader( winScroll );
	}, 500 )).on( "resize", function(){

	});

	// SEPARATE SCROLL EVENT JUST FOR BOTTOM HEADER
	$(window).on( "scroll", function(){
		winScroll = $(window).scrollTop();
		bottomHeader( winScroll );
	});

	var first = true;
	var handleMediaChange = function (mql) {
		console.log("mql");
	    if ( mql.s.matches ) {
	        // LESS THAN 600PX WIDE     
	        
	    } else if ( mql.m.matches ) {
	        // MORE THAN 600PX WIDE
					
	    } else {
	    	// MORE THAN 900PX WIDE
			
	    }
	}

	var mql = {};
	mql.s = window.matchMedia("(max-width: 660px)");
	mql.m = window.matchMedia("(max-width: 900px)");
	mql.s.addListener(function(){
		handleMediaChange(mql);
	});
	mql.m.addListener(function(){
		handleMediaChange(mql);
	});

	handleMediaChange(mql);

	// ON HASH CHANGE

	// $(window).hashchange( function(){

	// });

});