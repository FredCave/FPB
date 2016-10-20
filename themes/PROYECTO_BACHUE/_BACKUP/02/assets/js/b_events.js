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

// 1.2. IMAGE GRID CLICK

	$(document).on( "click", ".image_cell_toggle", function(){
		gridOpen( $(this) );
	});

	$(document).on( "click", ".grid_close", function(){
		gridClose( $(this) );
	});

// X.X. HOME
	
	$(document).on( "mouseover", ".home_multiple_image", function(){
		homeHover( $(this) );
	});

	$(document).on( "click", ".home_multiple_image", function(){
		homeClick( $(this) );
	});

	$(document).on( "click", ".text_link a", function(e){
		e.preventDefault();
		homeLinkOpen( $(this).parents("li").data("link") );
	});	

// X.X. PUBLICATIONS + EXHIBITIONS

	$(document).on( "click", ".banner_link", function(e) {
		e.preventDefault();
		bannerLink( $(this) );
	});

// X.X. ARCHIVE

	$(document).on( "change", "#archive_filter select", function(e) {
		e.preventDefault();
		// GET VALUE
		var selec = $(this).val();
		console.log( 52, selec );
		archiveFilter( selec );
	});

// X.X. COLLECTION FILTER

	$(document).on( "keyup", "#search_input", function () {
		var term = $("#search_input").val();
		collSearch( term );				
	});

	$(document).on( "change", "#coll_filter select", function(e) {
		e.preventDefault();
		// GET VALUE
		var selec = $(this).val();
		console.log( 66, selec );
		collFilter( selec );
	});

// X.X. WINDOW EVENTS

	var winScroll;

	$(window).on("load", function(){
		// RESET SCROLL
		$("html, body").animate({
			scrollTop : 0
		}, 100 );
		homeImages();
		gridManager();
		imageManager();

	}).on('scroll', _.throttle(function() {

		winScroll = $(window).scrollTop();
		

	}, 500 )).on( "resize", _.throttle(function(){
		imageManager();
	}, 500 ));

	// STOP SCROLL ANIMATIONS ON MANUAL SCROLL

	var page = $("html, body");
	page.on("scroll mousedown wheel DOMMouseScroll mousewheel keyup touchmove", function(e){
		page.stop();
	});

	page.on("mousewheel wheel DOMMouseScroll", _.throttle(function(e){
		// edgeDetect(e);
	}, 250 ));

	var first = true;
	var handleMediaChange = function (mql) {
		console.log("mql");
	    if ( mql.s.matches ) {
	        // LESS THAN 600PX WIDE     
			gridManager();
	    } else if ( mql.m.matches ) {
	        // MORE THAN 600PX WIDE
			gridManager();
	    } else {
	    	// MORE THAN 900PX WIDE
			gridManager();
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