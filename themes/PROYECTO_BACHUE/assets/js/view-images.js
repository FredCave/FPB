// (function ($) {
// 	'use strict';

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

// })(jQuery);