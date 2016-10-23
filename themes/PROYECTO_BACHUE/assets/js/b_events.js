/*****************************************************************************
    
	EVENTS
		1. 	NAV
			1.1. NAV CLICK
		2.	IMAGE GRIDS
			2.1. IMAGE GRID CLICK
		3. 	SECTIONS
			3.1. HOME
			3.2. PUBLICATIONS + EXHIBITIONS
			3.3. ARCHIVE
			3.4. COLLECTION FILTER
		4. 	WINDOW EVENTS
			4.1. MAIN WINDOW EVENTS
			4.2. MANUAL SCROLL EVENTS
			4.3. MEDIA QUERIES


*****************************************************************************/

$( document ).ready(function() {

/****************************************************************************
    
	1. NAV

*****************************************************************************/

// 1.1. NAV CLICK

$("#bottom_header a").on("click", function(e){
	e.preventDefault();
	var thisId = $(this).data("id");
	navClick( thisId );
});

/****************************************************************************
    
	2. IMAGE GRIDS

*****************************************************************************/

// 2.1. IMAGE GRID CLICK

	$(document).on( "click", ".image_cell_toggle", function(){
		gridOpen( $(this) );
	});

	$(document).on( "click", ".grid_close", function(){
		gridClose( $(this) );
	});

/****************************************************************************
    
	3. SECTIONS

*****************************************************************************/

// 3.1. HOME
	
	$(document).on( "mouseover", ".home_multiple_image", function(){
		homeHover( $(this) );
	});

	$(document).on( "click", ".home_multiple_image", function(){
		homeClick( $(this) );
	});

	$(document).on( "click", ".text_link a", function(e){
		e.preventDefault();
		var link = $(this).parents(".home_text").prev("li").data("link");
		console.log( 71, link );
		homeLinkOpen( link );
	});	

	$(".home_close").on( "click", function(){
		homeClose();
	});	

// 3.2. PUBLICATIONS + EXHIBITIONS

	$(document).on( "click", ".banner_link", function(e) {
		e.preventDefault();
		bannerLink( $(this) );
	});

// 3.3. ARCHIVE

	$(document).on( "change", "#archive_filter select", function(e) {
		e.preventDefault();
		// GET VALUE
		var selec = $(this).val();
		console.log( 52, selec );
		archiveFilter( selec );
	});

// 3.4. COLLECTION FILTER

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


/****************************************************************************
    
	4. WINDOW EVENTS

*****************************************************************************/

// 4.1. MAIN WINDOW EVENTS

	var winScroll;

	$(window).on("load", function(){
		// RESET SCROLL
		$("html, body").animate({
			scrollTop : 0
		}, 100 );
		bottomNavCheck();
		homeImages();
		// gridManager();
		imageManager();
		contentLoader(); 
	}).on('scroll', _.throttle(function() {
		// winScroll = $(window).scrollTop();
	}, 500 )).on( "resize", _.throttle(function(){
		imageManager();
		ifrHeight();
	}, 500 ));

// 4.2. MANUAL SCROLL EVENTS

	var page = $("html, body");
	page.on("scroll mousedown wheel DOMMouseScroll mousewheel keyup touchmove", function(e){
		// page.stop();
	});

	page.on("mousewheel wheel DOMMouseScroll", function(e){
		if ( !$("#wrapper").hasClass("wheel_block") ) {
			_scrollDetect(e);
		} else {
			console.log("Wheel blocked.");
		}
	});

	page.on("mousewheel wheel DOMMouseScroll", _.throttle( function(e){
		navHighlight();
	}, 500 ));

// 4.3. MEDIA QUERIES

	var first = true;
	var handleMediaChange = function (mql) {
		console.log("mql");
	    if ( mql.s.matches ) {
	        // LESS THAN 600PX WIDE     
			// gridManager();
	    } else if ( mql.m.matches ) {
	        // MORE THAN 600PX WIDE
			// gridManager();
	    } else {
	    	// MORE THAN 900PX WIDE
			// gridManager();
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