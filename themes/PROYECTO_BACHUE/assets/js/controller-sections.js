// (function ($) {
// 	'use strict';

	var controllerSections = {

		sectionsInit: function () {

			viewCollection.passwordInit();

		},

		bannerOpen: function ( click ) {

			var thisId = click.data("link");
			// SCROLL TO TOP
			viewPage.currentScrollToTop();
			// MAIN REVEAL FUNCTION
			viewPage.bannerReveal( $("#" + thisId) );
			// OPEN ANY IFRAMES
			viewPage.openIframes( parent );
			// // CALCULATE IMAGE SIZES		
			controllerPage.imageManager( parent );	

		},

		archiveInit: function () {

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

		},

		archiveFilter: function ( value ) {

			if ( value === "0" ) {
				// SHOW ALL POSTS
				$(".archive_post").show().removeClass("hidden");
			} else {
				// HIDE ALL POSTS
				$(".archive_post").hide().addClass("hidden");
				// SHOW ONLY POSTS WITH ID
				$("[data-cat=" + value + "]").show();		
			}

		}
			
	}

// })(jQuery);
