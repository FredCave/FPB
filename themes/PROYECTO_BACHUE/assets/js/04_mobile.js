// (function ($) {
// 	'use strict';

	var controllerMobile = {

		touchScreenCheck: function  () {

			console.log("controllerMobile.touchScreenCheck");

			var deviceAgent = navigator.userAgent.toLowerCase();
			var isTouchDevice = Modernizr.touch || 
			(deviceAgent.match(/(iphone|ipod|ipad)/) ||
			deviceAgent.match(/(android)/)  || 
			deviceAgent.match(/(iemobile)/) || 
			deviceAgent.match(/iphone/i) || 
			deviceAgent.match(/ipad/i) || 
			deviceAgent.match(/ipod/i) || 
			deviceAgent.match(/blackberry/i) || 
			deviceAgent.match(/bada/i));
			if (isTouchDevice) {

				console.log("isTouchDevice");

			    // TOUCH SCREEN
			    $("body").addClass("mobile");
			    // ADD EVENT LISTENERS
			    this.init();
		    } 

		},

		init: function () {

			console.log("controllerMobile.init");

			$("#mobile_menu").on("click", function(){
				if ( !$("#mobile_menu").hasClass("clicked") ) {
					controllerMobile.menuOpen();
					$("#mobile_menu").addClass("clicked");
				} else {
					controllerMobile.menuClose();
					$("#mobile_menu").removeClass("clicked");
				}
			});

			// CLICK OUTSIDE TO CLOSE
			$("body.mobile").on( "click", "section", function(e) {
				controllerMobile.menuClose();
			});

			$("body.mobile").on( "touchstart", "section", _.throttle( function(e) {
				controllerMobile.imageCheck();
			}, 1000));

		},

		imageCheck: function () {

			console.log("controllerMobile.imageCheck");

			// CHECK WHICH SECTION IS VISIBLE
			var screenTop = $(window).scrollTop(),
				screenBottom = $(window).scrollTop() + $(window).height();
			// LOOP THROUGH SECTIONS
			$("section").each( function(){
				// console.log( $(this).offset().top );
				var sectionTop = $(this).offset().top,
					sectionBottom = sectionTop + $(this).height();
				if ( sectionTop < screenBottom && sectionBottom > screenTop ) {
					
					console.log( $(this).attr("id") );

					controllerPage.imageManager( $(this) );
				}
			});


		},

		navClickHandler: function ( targetId ) {

			console.log("controllerMobile.navClickHandler");

			// GET OFFSET OF TARGET
			var offsetTop = $("#section_" + targetId).offset().top,
				navHeight = $("#bottom_header").height();
			console.log( 87, offsetTop, navHeight );
			// SCROLL TO
			$("html,body").animate({
				scrollTop: offsetTop - navHeight
			}, 500 );

		},

		menuOpen: function () {

			console.log("controllerMobile.menuOpen");

			if ( !$("#mobile_menu").hasClass("clicked") ) {
				$("#bottom_header_fixed").css({
					"-webkit-transform" : "translateY(0)",
							"transform" : "translateY(0)"
				});	
				// APPEND MENU ITEMS TO TOP FIXED HEADER
				viewPage.navFix();

				$("#mobile_menu").addClass("clicked");
			} 
		},

		menuClose: function () {

			$("#bottom_header_fixed").css({
				"-webkit-transform" : "",
						"transform" : ""
			});	
			$("#mobile_menu").removeClass("clicked");	
		},

		bannerReveal: function ( target ) {

			console.log("controllerMobile.bannerReveal", target);

			var thisH = target.height(),
				parent = target.parents("section"),
				targetTop = parent.find(".list").offset().top,
				scrollOffset = $("#top_header").outerHeight();
				
			// HIDE OTHER PUBLICATIONS
			parent.find(".list_post").hide().removeClass("selected");
			// SHOW SELECTED PUBLICATION
			target.show().addClass("selected");
			// ANIMATE PARENT HEIGHT THEN SET TO AUTO
			target.parents(".list").css( "height", thisH );
			setTimeout( function(){
				target.parents(".list").css( "height", "auto" );

				// SCROLL TO SELECTED POST
				$("html,body").animate({ scrollTop : targetTop - scrollOffset - 20 }, 500 ); 
			}, 750 );

		}

	}

// })(jQuery);
