// (function ($) {
// 	'use strict';

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
				// GET WIDTH OF TEXT BLOCK
				var textW = $(".home_text").css("width"); // IN PIXELS
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

// })(jQuery);
