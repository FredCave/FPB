
	$("section").on( "click", function(e){
		// CHECK IF NOT NAV CLICK
		if ( $(e.target).parents("#bottom_header").length !== 1 ) {
			sectionCheck( parseInt( $(this).data("content") ) );	
		}
	});


	var winScroll;

	$(window).on("load", function(){

		gridManager();
		winHFix();
		loadVideo();

	}).on('touchmove', _.throttle(function() {

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