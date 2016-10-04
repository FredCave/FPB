/*****************************************************************************
    
	EVENTS
		1.   GENERAL

		2.   NEWS

		X.   WINDOW EVENTS

*****************************************************************************/

$( document ).ready(function() {

// 1.1. NAV CLICK

$("#bottom_header a").on("click", function(e){
	e.preventDefault();
	var thisId = $(this).data("id");
	navClick( thisId );
});

// X.X. WINDOW EVENTS

	var winScroll;

	$(window).on("load", function(){
	
		// RESET SCROLL
		$("html, body").animate({
			scrollTop : 0
		}, 100 );
		
	}).on('scroll', _.throttle(function() {

		winScroll = $(window).scrollTop();
		

	}, 500 )).on( "resize", _.throttle(function(){
		

	}, 500 ));

	// STOP SCROLL ANIMATIONS ON MANUAL SCROLL

	var page = $("html, body");
	page.on("scroll mousedown wheel DOMMouseScroll mousewheel keyup touchmove", function(e){
		page.stop();
	});

	page.on("mousewheel wheel DOMMouseScroll", _.throttle(function(e){
		edgeDetect(e);
	}, 250 ));

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
	mql.s = window.matchMedia("(max-width: 600px)");
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