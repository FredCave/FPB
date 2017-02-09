/************************************************

CONTROLLER

************************************************/

var controllerSections = {

	sectionsInit: function () {

		viewCollection.passwordInit();
		this.bannerBind();
		this.gridInit();

	},

	bannerBind: function () {

		console.log("bannerBind");

		$(".banner_link").on("click", function(e){
			e.preventDefault();
			viewSections.bannerOpen( $(this) );
		});

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

	},

	gridInit: function () {

		console.log("controllerPage.gridInit");

		// BIND EVENTS
		$(".image_cell_toggle").on("click", function(){
			controllerSections.gridOpen( $(this) );
		});

		$(".grid_close").on( "click", function(){
			controllerSections.gridClose( $(this) );
		});

		// LOOP THROUGH ALL LOADED GRIDS
		$(".image_grid").each( function(){
			
			var cols = $(this).attr("data-col"),
				count = 1,
				row = 1,
				totalCells = $(this).find(".image_cell").not(".hidden").length;
			
			// SET NUMBER OF COLUMNS
			if ( $(window).width() <= 500 ) {
				$(this).attr("data-col", 1 );

				console.log( 83, "1 col" );

			} else if ( $(window).width() > 500 && $(window).width() <= 900 ) {
				$(this).attr("data-col", 2 );

				console.log( 88, "2 cols" );

			}

			controllerSections.gridReset( $(this) );
			// LOOP THROUGH CELLS 
			$(this).find(".image_cell").not(".hidden").each( function(){

				$(this).attr( "data-row", row );
				// IF END OF THE ROW OR IF LAST CELL
				if ( count % cols === 0 || count === totalCells ) {
					// REMOVE MARGIN-RIGHT
					$(this).css({
						"margin-right" : "0%"
					});
					// ADD CLEAR DIV + IMAGE WRAPPER
					$(this).after("<div class='clear'></div><div class='grid_large row_" + row + "'><div class='image_wrapper'></div><div class='grid_close'></div></div>");
					row++;
				} 
				count++;
			});
			
			// RUN ROW HEIGHT ON THIS GRID
			// rowHeight( $(this) );

		}); // END OF IMAGE GRID LOOP

	},

	gridReset: function ( grid ) {

		console.log("controllerPage.gridReset");

		grid.find(".clear").remove();
		grid.find(".grid_large").remove();

	},

	gridOpen: function ( click ) {

		console.log("controllerSections.gridOpen");

		// IF WINDOW IS WIDER THAN 500PX
		if ( $(window).width() > 500 ) {

			var grid = click.parents(".image_grid"),
				img = click.find("img"),
				rowNo = click.parents("li").attr("data-row"),
				nextLarge = grid.find(".row_" + rowNo),
				nextWrapper = nextLarge.find(".image_wrapper"),
				firstTime = true;	

			// CLOSE OTHER IMAGES IN GRID
			viewSections.closeImagesInGrid( grid );

			// SCROLL TO OPENED IMAGE (AFTER DELAY FOR CLOSING ANIMATION)			
			viewPage.scrollToTarget( nextLarge, 1000 );

			if ( firstTime ) {
				// FIRST APPEND CONTENT
				click.find(".hidden_content").clone().removeClass("hide").appendTo( nextWrapper );
				firstTime = false;
			}

			// CALCULATE HEIGHT
			if ( click.parents("#coll_list").length ) {

				var img = nextLarge.find(".hidden_content"),
					largeH = nextLarge.find(".hidden_content").height(),
					rowNo = click.attr("data-row");

			} else {
				var largeH = parseInt( img.attr("height") ) / parseInt( img.attr("width") ) * parseInt( grid.width() ) * 0.9,
					rowNo = click.parents("li").attr("data-row");
				
				if ( img.hasClass("portrait") ) {
					largeH = largeH * 0.67 + 24;
				} 
			}

			// GIVE HEIGHT TO FOLLOWING GRID_LARGE
			nextLarge.css({"height" : largeH});

			// RUN IMAGE RESIZE
			controllerPage.imageCalc( nextLarge.find( "img" ) );

			// FADE IN CLOSE BUTTON
			viewSections.fadeInGridClose( nextLarge );
		
			// IF IN PUBLICATIONS – ANIMATE PARENT HEIGHT
			if ( click.parents("#publications_list").length ) {
				// GET CURRENT HEIGHT
				var parentH = $("#publications_list").height();
				$("#publications_list").css( "height", "auto" );
			} 

		}

	},

	gridClose: function ( click ) {

		console.log("controllerPage.gridClose");

		// CLOSE PARENT + ADD RESET CLASS
		click.fadeOut();
		click.parents(".grid_large").css("height","0").find(".image_wrapper").empty().removeClass("full").addClass("empty");	

	}
	
}

/************************************************

    VIEW

************************************************/

var viewSections = {

	openIframes: function ( section ) {

		var iframe = $("#" + section).find("iframe"),
			width = iframe.width(),
			ratio = iframe.attr("height") / iframe.attr("width");
		
		// SET HEIGHT 
		target.css( "height", width * ratio );
		// ADD SRC
		iframe.attr( "src", iframe.data("src") );

	},

	bannerReveal: function ( target ) {

		console.log("viewSections.bannerReveal");

		var thisH = target.height(),
			parent = target.parents("section"),
			// USE PARENT LIST RATHER THAN POST
			targetTop = $("#publications_list").position().top,
			scrollOffset = $("#top_header").outerHeight();

		console.log( 212, targetTop - scrollOffset );
			
		// HIDE OTHER PUBLICATIONS
		parent.find(".list_post").hide().removeClass("selected");
		// SHOW SELECTED PUBLICATION
		target.show().addClass("selected");
		// ANIMATE PARENT HEIGHT THEN SET TO AUTO
		target.parents(".list").css( "height", thisH );
		setTimeout( function(){
			target.parents(".list").css( "height", "auto" );

			console.log( 242, targetTop );

			// SCROLL TO SELECTED POST
			parent.animate({ scrollTop : targetTop - scrollOffset - 35 }, 500 ); 
		}, 750 );

	},

	bannerOpen: function ( click ) {

		console.log("controllerSections.bannerOpen");

		// NEED TO APPLY SECTION CHECK HERE
		controllerPage.sectionCheck( click );

		var thisId = click.data("link");
		// MAIN REVEAL FUNCTION
		if ( !$("body").hasClass("mobile") ) {
			this.bannerReveal( $("#" + thisId) );			
		} else {
			controllerMobile.bannerReveal( $("#" + thisId) );
		}
		// // OPEN ANY IFRAMES
		// viewSections.openIframes( click.parents("section") );

	},


	fadeInGridClose: function ( wrapper ) {

		wrapper.removeClass("empty").addClass("full").find(".grid_close").fadeIn();

	},

	closeImagesInGrid: function ( grid ) {

		console.log("viewPage.closeImagesInGrid", grid);

		grid.find(".grid_large").css("height","0").find(".image_wrapper").empty().removeClass("full").addClass("empty");	

	}

}
