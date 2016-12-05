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
	if ( $("body").hasClass("mobile") ) {
		// IF TOUCH
		navClickMobile( thisId );
	} else {
		// IF NOT TOUCH
		navClick( thisId );
	}
});

$("#mobile_menu").on("click", function(){
	mobileMenuOpen( $(this) );
});

	// CLICK OUTSIDE TO CLOSE

$("section").click(function(e) {
	// CLOSE MENU
	mobileMenuClose();
});

/****************************************************************************
    
	2. IMAGE GRIDS

*****************************************************************************/

// 2.1. IMAGE GRID CLICK

	$(document).on( "click", ".image_cell_toggle", function(){
		// IF WINDOW IS WIDER THAN 500PX
		if ( $(window).width() > 500 ) {
			gridOpen( $(this) );
		}
	});

	$(document).on( "click", ".grid_close", function(){
		gridClose( $(this) );
	});

/****************************************************************************
    
	3. SECTIONS

*****************************************************************************/

// 3.1. GENERAL SECTION CLICK

	$("section").on( "click", function(e){
		// CHECK IF NOT NAV CLICK
		if ( $(e.target).parents("#bottom_header").length !== 1 ) {
			sectionCheck( parseInt( $(this).data("content") ) );	
		}
	});

// 3.2. HOME
	
	$(document).on( "mouseover", "#home_multiple_images li", function(){
		homeHover( $(this) );
	});

	$(document).on( "click", ".home_multiple_image", function(){
		// homeClick( $(this) );
	});

	$(document).on( "click", ".text_link a", function(e){
		// IF NO EXTERNAL LINK
		if ( $(this).attr("href") === "" ) {
			e.preventDefault();
			var link = $(this).parents(".home_text").data("link");
			// console.log( 71, link );
			homeLinkOpen( link );
		}
	});	

	$(".home_close").on( "click", function(){
		homeClose();
	});	

	// VIDEO CONTROLS

	$("#home_video_button .pause").on("click", function(){
		pauseVideo();
	});

	// $("#home_video_button .play").on("click", function(){
	// 	playVideo();		
	// });

// 3.3. PUBLICATIONS + EXHIBITIONS

	$(document).on( "click", ".banner_link", function(e) {
		e.preventDefault();
		bannerLink( $(this) );
	});

// 3.4. ARCHIVE

	$(document).on( "change", "#archive_filter select", function(e) {
		e.preventDefault();
		// GET VALUE
		var selec = $(this).val();
		console.log( 52, selec );
		// GRID RESET
		var grid = $(this).parents(".filter_wrapper").next(".image_grid");
		gridReset( grid );
		archiveFilter( selec );
		gridManager();
	});

// 3.5. COLLECTION FILTER

	$(document).on( "keyup", "#search_input", function () {
		var term = $("#search_input").val(),
			grid = $(this).parents(".filter_wrapper").next(".image_grid");
		collSearch( term );
		
		gridReset( grid );	
		$(".theme").prop('selectedIndex', 0);	
		$(".type").prop('selectedIndex', 0);
		gridManager();		
	});

	$(document).on( "change", "#coll_filter select", function(e) {
		e.preventDefault();
		// GET VALUE
		var selec = $(this).val(),
			menu;
		// RESET SIBLING FILTERS
		$(this).parents(".filter").siblings().find("select").prop('selectedIndex', 0);
		// GRID RESET
		var grid = $(this).parents(".filter_wrapper").next(".image_grid");
		gridReset( grid );
		collFilter( menu, selec );
		gridManager();
	});

	// FILTER BY LETTER

	$("#coll_letters a").on("click", function(e){
		e.preventDefault();
		collLetterClick( $(this) );
	});


/****************************************************************************
    
	4. WINDOW EVENTS

*****************************************************************************/

// 4.1. MAIN WINDOW EVENTS

	var winScroll;

	$(window).on("load", function(){
		// SCROLL TO TOP
		$("html,body").animate({
			scrollTop : 0
		}, 500 );
		touchScreenCheck();
		linkCheck();
		bottomNavCheck();
		homeTextPos();
		homeSlideInit();
		gridManager();
		imageManager();
		contentLoader(); 
		winHFix();
		loadVideo();

		// TMP – REMOVE WHEN COLLECTION IS HIDDEN
		// collNameFilter();
	

	}).on('touchmove', _.throttle(function() {
		var	wrapperCurrent = $("#wrapper").attr("data-current"); 
		if ( wrapperCurrent == 1 ) {
			// $("#console p").append("3");
			bottomNavCheck();
		}
		//$("#console p").append( wrapperCurrent );
		// bottomNavCheck();

	}, 10 )).on( "resize", _.throttle(function(){
		imageManager();
		ifrHeight();
		winHFix();
	}, 500 ));

// 4.2. MANUAL SCROLL EVENTS

	var page = $("html, body");
	page.on("scroll mousedown wheel DOMMouseScroll mousewheel keyup touchmove", function(e){
		page.stop();
	});

	page.on("mousewheel wheel DOMMouseScroll", function(e){
		if ( !$("#wrapper").hasClass("wheel_block") ) {
			var delta = e.originalEvent.deltaY;
			_scrollDetect(delta);
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
	        // LESS THAN 500PX WIDE     
			gridManager();
	    } else if ( mql.m.matches ) {
	        // LESS THAN 900PX WIDE
			gridManager();
	    } else {
	    	// MORE THAN 900PX WIDE
			gridManager();
	    }
	}

	var mql = {};
	mql.s = window.matchMedia("(max-width: 500px)");
	mql.m = window.matchMedia("(max-width: 900px)");
	// IE FALLBACK
	if ( mql.s.addListener ) {
		mql.s.addListener(function(){
			handleMediaChange(mql);
		});
		mql.m.addListener(function(){
			handleMediaChange(mql);
		});
	} else {
		console.log( 221, "IE Fallback." );
		mql.s.addEventListener(function(){ // ?????
			handleMediaChange(mql);
		});
		mql.m.addEventListener(function(){ // ?????
			handleMediaChange(mql);
		});
	}

	handleMediaChange(mql);

	// ON HASH CHANGE

	// $(window).hashchange( function(){

	// });

});