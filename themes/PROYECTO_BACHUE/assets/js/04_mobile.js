// (function ($) {
// 	'use strict';

	var controllerMobile = {

		touchScreenCheck: function  () {

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
			    // TOUCH SCREEN
			    $("body").addClass("mobile");
			    // ADD EVENT LISTENERS
			    this.mobileInit();
		    } 

		},

		mobileInit: function () {

			$("#mobile_menu").on("click", function(){
				mobileMenuOpen( $(this) );
			});

			// CLICK OUTSIDE TO CLOSE
			$("body.mobile").on( "click", "section", function(e) {
				mobileMenuClose();
			});

		},

		navClickMobile: function ( targetId ) {

			// GET OFFSET OF TARGET
			var offsetTop = $("#section_" + targetId).offset().top;
			// RUN BOTTOM NAV CHECK DURING ANIMATION
			var navInterval = 0;
			navInterval = setInterval( function(){
				bottomNavCheck();
			}, 10 );
			// SCROLL TO
			$("html,body").animate({
				scrollTop: offsetTop
			}, 500, function(){
				clearInterval(navInterval);
			});

		},

		mobileMenuOpen: function ( click ) {

			if ( !click.hasClass("clicked") ) {
				$("#bottom_header_fixed").css({
					"-webkit-transform" : "translateY(0)",
							"transform" : "translateY(0)"
				});	
				click.addClass("clicked");
			} 
		},

		mobileMenuClose: function () {

			$("#bottom_header_fixed").css({
				"-webkit-transform" : "",
						"transform" : ""
			});	
			$("#mobile_menu").removeClass("clicked");	
		}

	}

// })(jQuery);
