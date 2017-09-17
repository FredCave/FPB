/* 
	VIEWS:
		VIEWPAGE
		VIEWIMAGES
		VIEWSECTIONS
*/

var viewPage = {

	init: function () {

		// SCROLL TO TOP
		$("html,body").animate({
			scrollTop : 0
		}, 500 );

		this.touchInit();
		this.navInit();
		// BANNER INIT
		this.bannerBind();
		// LOAD SECTION 2
		this.contentReveal( $("#section_2") );

	},

	contentReveal: function ( target ) {

		if ( typeof target !== 'undefined' ) {
			target.show().addClass("loaded");
			// imageManager();
		} else {
			$(".current").next().show().addClass("loaded");
			// imageManager();
		}
		
	},

	touchInit: function () {

		var navBind = _.throttle(function(){
		   // RESET SIBLINGS
			$("#bottom_header a").removeClass("highlight");
			// IF NOT HOME LINK
			if ( controllerPage.getCurrent() !== 1 ) {
				$("#bottom_header [data-id='" + controllerPage.getCurrent() + "']").addClass("highlight");
			}
		}, 500);

		$("html,body").on("mousewheel wheel DOMMouseScroll", function(e){
			if ( !$("#wrapper").hasClass("wheel_block") ) {
				var delta = e.originalEvent.deltaY;
				controllerPage.scrollManager(delta);
			}
			navBind();
		});

	},

	scrollBlock: function ( section ) {

		section.addClass("scroll_block");

	},

	scrollUnblock: function ( section ) {

		section.removeClass("scroll_block");

	},

	currentTransform: function ( newTop ) {

		$(".current").css({
			"-webkit-transform" : "translateY(" + newTop + "px)",
				"-ms-transform" : "translateY(" + newTop + "px)",
					"transform" : "translateY(" + newTop + "px)"
		});

	},

	multipleTransform: function ( section, direction ) {

		// RUN BOTTOM NAV CHECK DURING ANIMATION
		navInterval = setInterval( function(){
			controllerPage.navFixManager();
		}, 100 );

		// ADD WHEEL_BLOCK CLASS
		controllerPage.toggleWheelBlock();

		var sections = $("#section_" + section).prevAll();
		if ( direction === "next" ) {
			sections = $("#section_" + section).nextAll().andSelf();
		}

		sections.each( function(){
			var thisH = 0 - $(this).outerHeight();
			// IF NEXT THISH === 0
			if ( direction === "next" ) {
				thisH = 0;
			}
			$(this).css({
				"transition"		: "transform 1s",
				"-webkit-transform" : "translateY(" + thisH + "px)",
	      			"-ms-transform" : "translateY(" + thisH + "px)",
						"transform" : "translateY(" + thisH + "px)",
				"display"			: "block"		
			});
		});

		// REMOVE WHEEL_BLOCK CLASS + RESET TRANSITIONS
		setTimeout( function(){
			controllerPage.toggleWheelBlock();
			$("section").css("transition","");
			clearInterval( navInterval );
		}, 1000 );

	},

	switchNext: function () {

		$(".current").removeClass("current").next().addClass("current").removeClass("scroll_block"); 
		$(".previous").removeClass("previous");
		$(".current").prev().addClass("previous");

	},

	switchPrev: function () {

		$(".current").removeClass("current")
		$(".previous").removeClass("previous").addClass("current").removeClass("scroll_block");
		$(".current").prev().addClass("previous");

	},

	switchTarget: function ( target ) {

		$(".current").removeClass("current");
		$(".previous").removeClass("previous");
		$("#section_" + target).addClass("current").prev().addClass("previous");

	},

	navFix: function () {

		$("#bottom_header").appendTo( $("#bottom_header_fixed") );

	}, 

	navUnfix: function () {

		$("#bottom_header").appendTo( $("#bottom_header_unfixed") );

	},

	logoFix: function ( topMargin ) {

		$("#main_logo").appendTo( $("#bottom_header_fixed") ).css({
			"position" : "fixed",
			"top" : topMargin, 
			"bottom" : "initial"
		});			

	}, 

	logoUnfix: function () {

		$("#main_logo").appendTo( $("#bottom_header_unfixed") ).css({
			"position" : "",
			"top" : "", 
			"bottom" : ""
		});	

	},

	navInit: function () {

		$("#bottom_header a").on("click", function(e){
			e.preventDefault();
			viewPage.navClickHandler( $(this).data("id") );
		});

	},

	navClickHandler: function ( targetId ) {

		// if ( $("body").hasClass("mobile") ) {
		// 	// IF TOUCH
		// 	navClickMobile( targetId );
		// }

		console.log("navClickHandler");

		// IF TARGET IS VISIBLE
		if ( targetId === controllerPage.getCurrent() ) {
			// SCROLL TO TOP OF CURRENT
			$(".current").animate({ scrollTop: 0 }, 500 );
		// ELSE NAV TO SECTION
		} else {
			controllerPage.navToSection( targetId );
		}
	
	},

	bannerBind: function () {

		console.log("bannerBind");

		$(".banner_link").on("click", function(e){
			e.preventDefault();
			controllerSections.bannerOpen( $(this) );
		});

	},

	bannerReveal: function ( target ) {

		var thisH = target.height(),
			parent = target.parents("section");
			
		// HIDE OTHER PUBLICATIONS
		parent.find(".list_post").hide().removeClass("selected");
		// SHOW SELECTED PUBLICATION
		target.show().addClass("selected");
		// ANIMATE PARENT HEIGHT THEN SET TO AUTO
		target.parents(".list").css( "height", thisH );
		setTimeout( function(){
			target.parents(".list").css( "height", "auto" );
		}, 500 );
		// SCROLL TO SELECTED POST


	},

	scrollToTarget: function ( target, delay ) {

		var targetTop = target.position().top,
			offset = $("#top_header").outerHeight() + $("#bottom_header").outerHeight();

		setTimeout( function(){
			$(".current").animate( { scrollTop: targetTop - offset }, 500 );		
		}, delay );

	},

	currentScrollToTop: function () {

		$(".current").css( {
			"transition" 		: "all 1s",
			"-webkit-transform" : "",
				"-ms-transform" : "",
					"transform" : ""
		}, 500 );

		// AFTER ANIMATION REMOVE TRANSITION
		setTimeout( function(){
			$(".current").css( "transition", "" );			
		}, 1000 );

	},

	openIframes: function () {

		console.log("openIframes");

	}

}

var viewImages = {

	render: function ( image, src ) {

		// IF BG IMAGE
		if ( image.hasClass("bg_image") ) {
			var bgSrc = "url('"+ src +"')";
			image.css({
				"background-image" : src 
			});
		} else {
			image.attr("src",src);
		}

		// IF IMAGE BLURRED
		setTimeout( function(){
			image.removeClass("blurred");		
		}, 500 );

	}

}

var viewSections = {

	slide: function () {

		var gallery = $("#home_slideshow"),
			initDelay = 2000,
			interval = 8000;

		// LOAD FIRST IMAGE + NEXT IMAGE
		controllerPage.imageCalc( gallery.find(".visible") );
		controllerPage.imageCalc( gallery.find(".visible").next() );
		
		// DELAY AND THEN INITIATE SLIDESHOW
		setTimeout( function(){
			setInterval( function(){
				// IF NEXT EXISTS
				if ( gallery.find(".visible").next().length ) {			
					// MAKE NEXT VISIBLE
					gallery.find(".visible").removeClass("visible").next().addClass("visible");
					// LOAD NEXT
					controllerPage.imageCalc( gallery.find(".visible").next() );
				} else {		
					// GO BACK TO BEGINNING
					gallery.find(".visible").removeClass("visible");
					gallery.find("li:first-child").addClass("visible");				
				}
			}, interval );		
		}, initDelay );

	},

	textInit: function () {

		if ( $(window).width() > 500 ) {
			// GET WIDTH + HEIGHT OF TEXT BLOCK
			var textW = $(".home_text").css("width"), // IN PIXELS
				textH = $(".home_text").height();

			console.log( 331, textW, textH );

			// CALC RANDOM LEFT PERCENTAGE
			var leftPos = Math.random() * ( 1 - ( parseInt(textW) / $(window).width() ) ) * 100,
				topPos = Math.floor( Math.random() * 62 ) + 5;
			$(".home_text").css({
				"left" : leftPos + "%",
				"top" : topPos + "%"
			}).fadeIn();
		} else {
			$(".home_text").fadeIn();		
		}
		// BIND CLOSE FUNCTION
		$(".home_close").on( "click", function(){
			$(".home_text").hide();
		});	
		// BIND LINK FUNCTION
		$(".text_link a").on( "click", function(e){
			// IF NO EXTERNAL LINK
			console.log($(this).attr("href"));
			if ( $(this).attr("href") === "" ) {
				e.preventDefault();
				controllerSections.homeLinkOpen( $(this) );
			}
		});	
	},

	openIframes: function ( section ) {

		var iframe = $("#" + section).find("iframe"),
			width = iframe.width(),
			ratio = iframe.attr("height") / iframe.attr("width");
		
		// SET HEIGHT 
		target.css( "height", width * ratio );
		// ADD SRC
		iframe.attr( "src", iframe.data("src") );

	},

	gridInit: function () {

		$(".image_cell_toggle").on("click", function(){
			controllerSections.gridOpen( $(this) );
		});

		$(".grid_close").on( "click", function(){
			// gridClose( $(this) );
		});

	}

}