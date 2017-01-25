// (function ($) {
// 	'use strict';

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

			var navHighlight = _.throttle(function(){
				// RESET SIBLINGS
				$("#bottom_header a").removeClass("highlight");
				// IF NOT HOME LINK
				if ( controllerPage.getCurrent() !== 1 ) {
					
					// IF NOT NEAR BOTTOM
					// SCROLL POSITION: current.scrollTop() 
					// HEIGHT: current.innerHeight()
					// INNER SCROLL: current[0].scrollHeight

					$("#bottom_header [data-id='" + controllerPage.getCurrent() + "']").addClass("highlight");
				}
			}, 500);

			$("html,body").on("mousewheel wheel DOMMouseScroll", function(e){
				if ( !$("#wrapper").hasClass("wheel_block") ) {
					var delta = e.originalEvent.deltaY;
					controllerPage.scrollManager(delta);
				}
				navHighlight();
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
				// "top" : topMargin + 30, 
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

			console.log( 236, targetTop - offset );

			setTimeout( function(){
				$(".current").animate( { scrollTop: targetTop - offset }, 500 );		
			}, delay );

			// TMP
			setTimeout( function(){
				console.log( $(".current").scrollTop() );
			}, 1000 );

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

		},

		fadeInGridClose: function ( wrapper ) {

			wrapper.removeClass("empty").addClass("full").find(".grid_close").fadeIn();

		},

		closeImagesInGrid: function ( grid ) {

			console.log("viewPage.closeImagesInGrid", grid);

			grid.find(".grid_large").css("height","0").find(".image_wrapper").empty().removeClass("full").addClass("empty");	

		}

	}

// })(jQuery);
