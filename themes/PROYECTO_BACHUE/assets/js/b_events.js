/*****************************************************************************
    
	3. EVENTS
		3.1. BACKGROUND EVENTS
			3.1.1. 	ON IMAGE CLICK
		3.2. RECEIPT EVENTS
			3.2.1. 	ADDRESS HIGHLIGHT ON HOVER
			3.2.2. 	MAIN VITRINE TOGGLE
			3.2.3. 	BACK TO TOP BUTTON
			3.2.4. 	CURRENT SHOW TOGGLE
			3.2.5. 	MENU CATEGORY CLICK
			3.2.6. 	INDEX CLICK ON LETTER OR CATEGORY
			3.2.	INDEX PAGINATION NAV
			3.2.7. 	ARTIST INFO TOGGLE
			3.2.8. 	ARTIST VITRINE TOGGLE
			3.2.9. 	SEARCH TOGGLE
			3.2.10. SEARCH KEYUP
			3.2.11. JUSTIFY LINES
			3.2.12. GOOGLE MAP TOGGLE
			3.2.13. SHOW IMAGES CLICK
		3.3 WINDOW EVENTS
			3.3.1. 	WINDOW LOAD 
			3.3.2. 	WINDOW SCROLL
			3.3.3. 	RESIZE HANDLER
			3.3.4. 	ON HASH CHANGE

*****************************************************************************/

$( document ).ready(function() {

// 3.1. BACKGROUND EVENTS

	// 3.1.1. ON IMAGE CLICK

	$(".wrapper").on("click", ".bg_image", function(e){
		// console.log( 35, e.target );
		e.preventDefault();		
		// PAUSE / UNPAUSE FUNCTION
		imagesClick( $(this).parents("li") );		
	});

		// ON FACEBOOK LINK CLICK

	$(".wrapper").on("click", ".img_info_icons a.facebook_share", function(e){
		e.preventDefault();
		fbShare( $(this) );
	});	

		// SHOW POST ON RECEIPT
	
	$(".show_share a.facebook_share").on("click", function(e){
		e.preventDefault();
		fbShare( $(this) );
	});	

	// SEE MORE

	$(".wrapper").on("click", ".see_more", function(e){
		seeMoreIndex( $(this).attr("data-artist") );
	});	

		// IMG_INFO_FIXED HERE

	$("#img_info_fixed").on("click", ".see_more", function(){
		seeMoreIndex( $(this).attr("data-artist") );
	});


// 3.2. RECEIPT EVENTS

	// 3.2.1. ADDRESS HIGHLIGHT ON HOVER

	$("#r_address a").hover( function(){
		$(this).find("p").addClass("highlight-centre");
	}, function(){
		$(this).find("p").removeClass("highlight-centre");
	});

	// 3.2.2. MAIN VITRINE TOGGLE

	$("a.main_vitrine").on("click", function(e){
		e.preventDefault();
		vitrineToggle ( $(this).attr("id") );
	});

	// 3.2.3. BACK TO TOP BUTTON

	$(".back_to_top a").on("click", function(e){
		e.preventDefault();
		// get offset of menu
		var menuOffset = $("#r_menu").offset().top - 80;
		// scroll
		$("html,body").animate({
			scrollTop: menuOffset
		}, 500);
	});

	// 3.2.4. CURRENT SHOW TOGGLE

	$(".show_toggle").on( "click", function(e){
		e.preventDefault();
		var following = $(this).next(".show_content");
		var thisId = $(this).parents(".show_wrapper").attr("id");
		if ( following.hasClass("clicked") ) {
			// CLOSE
			showToggleClose( thisId );
		} else {
			// OPEN
			showToggleOpen( thisId );	
		}
	});

		// READ LESS

	$(".show_toggle_text_close").on( "click", function(){
		var thisId = $(this).parents(".show_wrapper").attr("id");
		showToggleClose( thisId );
	});

	// 3.2.5. MENU CATEGORY CLICK

	$(".show_artist_link").on( "click", function(e){
		e.preventDefault();
		var thisSlug = $(this).data("artist");
		// console.log( 105, thisSlug );
		seeMoreIndex( thisSlug );
	});

	// 3.2.6. INDEX CLICK ON LETTER / CATEGORY

		// MENU TOP OF RECEIPT
	$(".menu_index").on("click", function (e) {
		e.preventDefault();
		var thisText = "x_" + $(this).text().toLowerCase();
		catClick( thisText );
		filterIndex( $(this) );
	});

	$("#index_categories a").on("click", function (e) {
		e.preventDefault();
		var thisText = "x_" + $(this).text().toLowerCase();
		catClick( thisText );
		filterIndex( $(this) );
	});	

		// SUB CATS
	$(".sub_cat a").on("click", function (e) {
		e.preventDefault();
		var thisText = "x_" + $(this).text().toLowerCase();
		catClick( thisText );
		filterIndex( $(this) );
	});	

	// 3.2.X. INDEX PAGINATION NAV

	$("#index_nav").on("click", ".index_nav", function (e) {
		e.preventDefault();	
		paginationNav( $(this) );
	});

		// APPENDED NAV

	$("#index_bis").on("click", ".index_nav", function (e) {
		e.preventDefault();	
		console.log( 159, "Appended nav click." );
		// CLOSE VITRINE
			// GET OPEN ARTIST
		$("#index .index_results .result").each( function(){
			if ( $(this).find(".index_artist_content").hasClass("clicked") ) {
				var current = $(this);
				var artistId = current.find(".artist_vitrine_toggle").attr("data-id");
				artistVitrineClose ( artistId );
				// WAIT UNTIL VITRINE ANIMATION IS DONE
				setTimeout( function(){
					// CLOSE INFO
					console.log( 169, "Close info.", current );
					current.find(".index_artist_title a").trigger("click");					
				}, 500 );
			}
		});

		// PAGINATION CLICK

	});	

	// 3.2.7. ARTIST INFO TOGGLE

	$(".index_results").on("click", ".index_artist_title a", function(e){
		e.preventDefault();
		if ( !$(this).hasClass("index_disabled") ) {
			var target = $(this).parents(".index_artist_title").next(".index_artist_content");
			artistInfoToggle( target );
		} 	
	});

	// 3.2.8. ARTIST VITRINE TOGGLE

	$(".index").on("click", ".artist_vitrine_toggle", function(e){
		e.preventDefault();
		// var postId = $(this).attr("data-id").split("-")[1];
		// bgImages( postId );

		// VITRINE OPEN / CLOSE FUNCTION
		artistVitrineToggle( $(this).attr("data-id") );
 		// THIS CALLS BGIMAGES (ONLY ON OPEN)
	});

	// 3.2.10. SEARCH KEYUP

		// INITIATE HIDESEEK PLUGIN

	$('#search').hideseek({
		ignore_accents: true,
		hidden_mode: false
	}).on("_after", function() {
		// EMPTY RESULTS WRAPPER
		var resultWrapper = $("#index .index_results");
		resultWrapper.empty();	
		// CURRENT CAT
		var thisCat = $("#index").attr("data-cat");
		if ( $("#index").attr("data-cat").length ) {
			$(".sub_index li").each( function(){
				if ( $(this).hasClass("hideseek_result") && $(this).hasClass( thisCat ) ) {
					// $(this).clone().appendTo(resultWrapper).hide();
					$(this).clone().appendTo(resultWrapper);
				}
			});	

			// RUN PAGINATION FILTER
			paginationFilter();		

		} else {
			resultWrapper.text("Please select a category.");
		}

		// ANIMATE WRAPPER HEIGHT
		console.log( resultWrapper.height() );
		$(".sub_index").css("height", resultWrapper.height() );

	});

	// 3.2.11. JUSTIFY LINES

	function justify ( ) {

		$(".line_stretch").each( function(){
			// get container width - HACK: receipt width * 0.85
			var thisW = $("#receipt").width() * 0.85;
			// get text width
			var noChars = $(this).text().trim().length;
			var fontS = parseFloat( $(this).css("font-size") );
			var textW = fontS * noChars * 0.5;
			// this ratio (0.595) can be played with
			// calculate difference + no. of characters
			var diff = thisW - textW;
			var space = ( diff / (noChars +1) );
			$(this).css("letter-spacing", space );
		});

	}

	// 3.2.12. GOOGLE MAP TOGGLE

	$("#r_address_map_toggle").on( "click", function (e) {
		e.preventDefault();
		var target = $(this).next("#r_address_map");
		var mapSrc = target.find("iframe").attr("data-src");
		$(this).hide();
		target.find("iframe").attr("src", mapSrc);
		target.css("height","300px");
	});

	// 3.2.13. SHOW IMAGES CLICK

	$(".show_images_nav_left").on( "click", function(e) {
		e.preventDefault();
		showImgsBack( $(this) );
	});	

	$(".show_images_nav_right").on( "click", function(e) {
		e.preventDefault();
		showImgsForward( $(this) );
	});	

// 3.3 WINDOW EVENTS

	// 3.3.1. WINDOW LOAD 

	$(window).on("load", function(){
		console.log("Page loaded.");
		urlDetect();
		imagesInit();
		justify();
		// RUN FILTER WITH FASHION AS DEFAULT
		filterInit();
		// SHOW IMAGES INIT
		showImgsInit();	
		// AGENDA CHECK
		agendaCheck();
	});

	// 3.3.2. WINDOW SCROLL THROTTLED

	$(window).on('scroll', _.throttle(function() {
		// vitrineManageScroll( $(window).scrollTop() );
	}, 500 ));

		// STOP SCROLL ANIMATIONS ON MANUAL SCROLL

	var page = $("html, body");

	page.on("scroll mousedown wheel DOMMouseScroll mousewheel keyup touchmove", function(){
		page.stop();
	});

	// 3.3.3. RESIZE HANDLER
	
	$(window).on( "resize", function(){
		// SHOW IMAGES INIT
		showImgsInit();	
		// ROUND IMAGES RESIZE
		roundImages();
	});

	var first = true;
	var handleMediaChange = function (mql) {
		console.log("mql");
	    // GIVES NUMBER OF COLUMNS FOR IMAGE INJECTION
	    if ( mql.s.matches ) {
	        // LESS THAN 600PX WIDE     
	        noCols();
	        manageCols();
	        imagesAnim(first);
	    } else if ( mql.m.matches ) {
	        // MORE THAN 600PX WIDE
			noCols();
			manageCols();
			imagesAnim(first);
			// RESET ANY IMAGE INFOS
			infoReset();		
	    } else {
	    	// MORE THAN 900PX WIDE
			noCols();
			justify();
			manageCols( 4 );
			imagesAnim(first); // CHECK IF FIRST TIME
			// RESET ANY IMAGE INFOS
			infoReset();
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

	// 3.3.4. ON HASH CHANGE

		// TMP DEACTIVATED – NEED TO PUT BACK
	// $(window).hashchange( function(){
	// 	// urlDetect();
	// });


});