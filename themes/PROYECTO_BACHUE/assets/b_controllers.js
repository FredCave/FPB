var controllerPage = {

	pageInit: function () {

		// PAGE INIT
		viewPage.init();
		// HOME INIT
		controllerSections.homeInit();
		// TOUCH SCREEN CHECK
		this.touchScreenCheck();

	},

	touchScreenCheck: function  () {

		console.log("touchScreenCheck");

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
	    } 

	},

	linksInit: function () {

		// LOOP THROUGH LINKS TO MAKE SURE TARGET=_BLANK
		$("#wrapper a").each( function(){
			if ( $(this).attr("href").substring(0,4) == "http" ) {
				$(this).attr("target","_blank");
			}
		});

	},

	getCurrent: function () {

		return model.currentSection;

	},

	updateCurrent: function ( newCurrent ) {

		model.currentSection = newCurrent;

	},

	getWheelBlock: function () {

		return model.wheelBlock;

	},

	toggleWheelBlock: function () {

		model.wheelBlock = !model.wheelBlock;


	},

	navFixManager: function () {

		// ONLY RUN IF SCREEN IS WIDER THAN 500PX
		if ( $(window).width() > 500 ) {
			
			// VARIABLES
			var topMargin = $("#top_header").outerHeight(),
				bottomTop = Math.floor( $("#bottom_header_unfixed")[0].getBoundingClientRect().top ), // GET CURRENT TOP POSITION OF BOTTOM NAV RELATIVE TO WINDOW
				logoH = $("#main_logo").outerHeight(),
				logoTop = bottomTop + $("#bottom_header_unfixed").height() - logoH;

			if ( bottomTop <= topMargin ) {
				viewPage.navFix( topMargin );
			} else {
				viewPage.navUnfix();
			}

			// CALCULATE MAIN LOGO SEPARATELY
			if ( logoTop <= topMargin ) {
				viewPage.logoFix();
			} else {
				viewPage.logoUnfix();
			}

		} else {
			viewPage.navFix( topMargin );
		}

	},

	scrollManager: function ( delta ) {

		var current = $(".current"),
			currentNumber = this.getCurrent();

		if ( currentNumber == 1 ) {
			this.navFixManager();
		}
		// IF SCROLLING DOWN
		if ( delta > 0 ) {
			// IF CURRENT AT BOTTOM (OR TOP)
			if ( current.scrollTop() + current.innerHeight() >= current[0].scrollHeight - 10 ) {
				// IF NOT LAST SECTION
				if ( currentNumber != 6 ) {
					this.scrollDown(delta);	
				} 
			} else {
				// ALLOW CURRENT TO SCROLL NORMALLY
				viewPage.scrollUnblock( current );			
			}
		// IF SCROLLING UP
		} else if ( delta < 0 ) {
			this.scrollUp(delta);
		}
	},

	scrollDown: function ( delta ) {

		var current = $(".current"),
			currTop = parseInt( current.css('transform').split(',')[5] ),
			currH = $(".current").outerHeight(),
			multiple = 1,
			newTop = currTop - ( delta * multiple );

		// SCROLL BLOCK 
		viewPage.scrollBlock( current );	
		// IF VISIBLE
		if ( currH + currTop >= 40 ) {
			viewPage.currentTransform(newTop);
		} else {		
			// SWITCH CLASSES
			this.switchClasses("down");
		}

	},

	scrollUp: function ( delta ) {

		var current = $(".current"),
			currTop = parseInt( current.css('transform').split(',')[5] ),
			currH = $(".current").outerHeight(),
			newTop;

		// ADD SCROLL_BLOCK CLASS
		viewPage.scrollBlock( current );
		// IF CURRENT TOP (TRANSFORM) < 0 – CURRENT IS ON THE WAY OUT
		if ( currTop < 0 && !this.getWheelBlock() ) {
			newTop = currTop - delta;
			if ( newTop >= 0 ) {
				newTop = 0;
			}
			viewPage.currentTransform(newTop);
		} else if ( currTop == 0 && !this.getWheelBlock() ) {

			// IF CURRENT INTERIOR SCROLLTOP IS 0 AND WRAPPER DATA-CURRENT IS NOT 1
			// SWITCH CLASSES + TRANSFORM UP
			if ( current.scrollTop() <= 0 && this.getCurrent() != 1 ) {
				// CHECK IF WHEEL BLOCK – ADDED TO STOP CONSECUTIVE SWITCHCLASSES
				if ( !this.getWheelBlock() ) {
					// ADD WHEEL_BLOCK
					this.toggleWheelBlock();
					// SWITCH CLASSES
					this.switchClasses("up");
					newTop = currTop + delta;
					// ????????????????????
					// if ( newTop < 0 ) {
					// 	newTop = 0;
					// }
					// viewPage.currentTransform(newTop);
					// RUN NAV CHECK DURING ANIMATION
					this.navFixManager();	
					setTimeout( function(){
						controllerPage.toggleWheelBlock();
					}, 500 );

				}
			} else if ( current.scrollTop() != 0  ) {
				// NORMAL SCROLLING
				viewPage.scrollUnblock( current );	
			}
		} 
	},

	switchClasses: function ( direction ) {

		// PREVIOUS VERSION HAS SWITCHBLOCKER – NECESSARY???

		if ( direction === "down" ) {
			viewPage.switchNext();
			// LOAD NEXT FUNCTION
			viewPage.contentReveal();				
		} else if ( direction === "up" ) {
			viewPage.switchPrev();
		}
		// UPDATE CURRENT SECTION STORED IN WRAPPER
		this.updateCurrent( $(".current").attr("data-content") );

	},

	navToSection: function ( section ) {

		var navInterval = 0;

		// IF BEFORE CURRENT 
		if ( section > this.getCurrent() ) {
			// ANIMATE ALL SECTIONS BEFORE
			viewPage.multipleTransform( section, "prev" );
		// ELSE IF AFTER
		} else if ( section <= this.getCurrent() ) {
			// ANIMATE ALL SECTIONS AFTER
			viewPage.multipleTransform( section, "next" );
		}
		// ADD CURRENT CLASS
		viewPage.switchTarget( section );
		// UPDATE DATA-CURRENT
		this.updateCurrent( section );

	},

	imageManager: function ( section ) {

		// LOOP THROUGH IMAGES
		section.find("img").each( function(i){
			this.imageCalc( $(this) );
		});

	},

	imageCalc: function ( image ) {
	
		var img = image,
			currSrc,
			newSrc,
			imgW;

		// GET CURRENT SRC
		if ( !image.is("img") ) {
			// IF CONTAINS IMG
			if ( image.has("img").length ) {
				img = image.find("img");
				currSrc = img.attr("src");
			// ELSE IF BG_IMAGE
			} else if ( image.has(".bg_image").length ) {
				img = image.find(".bg_image");
				currSrc = img.attr("data-src");			
			}
		}
		// CALCULATE SIZE
		if ( img.hasClass("bg_image") ) {
			// IF WIN IS VERTICAL
			if ( $(window).width() < $(window).height() ) {
				imgW = $(window).height() * img.attr("data-ratio");
			}
		} else {
			imgW = img.width();
		}	
		// CHANGE POINTS: THM = 300 / MED = 600 / LRG = 900
		if ( imgW <= 300 ) {
			newSrc = img.attr("data-thm");
		} else if ( imgW > 300 && imgW <= 600 ) {
			newSrc = img.attr("data-med");
		} else {
			newSrc = img.attr("data-lrg");
		}
		// IS NEW SRC DIFFERENT: RENDER 
		if ( newSrc !== currSrc ) {
			viewImages.render( img, newSrc );
		} 
	}

}

var controllerSections = {

	homeInit: function () {

		// IF VIDEO VISIBLE
		if ( $("#player").length ) {
			console.log("Home video.");
		// IF IMAGES VISIBLE
		} else if ( $("#home_slideshow").length ) {
			// INITIATE SLIDESHOW
			viewSections.slide();
		}
		// SHOW TEXT
		viewSections.textInit();
	}, 

	homeLinkOpen: function ( click ) {
		
		// 	var link = click.parents(".home_text").data("link");
		// 	// GET SECTION AND POST TO SCROLL TO
		// 	var section = link.split("_")[1],
		// 		post = link.split("_")[2],
		// 		targetId;
		// 	// SCROLL TO SECTION
		// 	navToSection( section );
		// 	// AFTER 1 SECOND SCROLL TO POST
		// 	setTimeout( function(){
		// 		// TRIGGER CLICK ON BANNER LINK
		// 		bannerLink( $("[data-link="+post+"]") ).trigger("click");
		// 	}, 1000 );

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

	gridInit: function () {

		// LOOP THROUGH ALL LOADED GRIDS
		// $(".image_grid").each( function(){
			
		// 	var cols = $(this).attr("data-col"),
		// 		count = 1,
		// 		row = 1,
		// 		totalCells = $(this).find(".image_cell").not(".hidden").length;
			
		// 	// SET NUMBER OF COLUMNS
		// 	if ( winW <= 500 ) {
		// 		$(this).attr("data-col", 1 );
		// 	} else if ( winW > 500 && winW <= 900 ) {
		// 		$(this).attr("data-col", 2 );
		// 	}

		// 	// RESET – IS THERE A BETTER WAY THAN REMOVING .GRID_LARGE??
		// 	this.gridReset( $(this) );
		// 	// LOOP THROUGH CELLS 

		// 	$(this).find(".image_cell").not(".hidden").each( function(){

		// 		$(this).attr( "data-row", row );
		// 		// IF END OF THE ROW OR IF LAST CELL
		// 		if ( count % cols === 0 || count === totalCells ) {
		// 			// REMOVE MARGIN-RIGHT
		// 			console.log( 609, $(this).find(".coll_title").text() );
		// 			$(this).css({
		// 				"margin-right" : "0%"
		// 			});
		// 			// ADD CLEAR DIV + IMAGE WRAPPER
		// 			$(this).after("<div class='clear'></div><div class='grid_large row_" + row + "'><div class='image_wrapper'></div><div class='grid_close'></div></div>");
		// 			row++;
		// 		} 
		// 		count++;
		// 	});
		// 	// RUN ROW HEIGHT ON THIS GRID
		// 	// rowHeight( $(this) );

		// }); // END OF IMAGE GRID LOOP

	},

	gridReset: function () {

		console.log("gridReset");

	},

	gridOpen: function ( click ) {

		// IF WINDOW IS WIDER THAN 500PX
		if ( $(window).width() > 500 ) {

			var grid = click.parents(".image_grid"),
				img = click.find("img"),
				rowLength = grid.attr("data-col");	

			// CLOSE OTHER IMAGES
			// IF IN COLLECTION
				// APPEND INFO TO GRID LARGE
				// CALCULATE GRID_LARGE HEIGHT
			// ELSE
				// CALCULATE HEIGHT OF GRID_LARGE
			// GIVE HEIGHT TO FOLLOWING GRID_LARGE
			// CLONE IMAGE AND APPEND TO FOLLOWING .GRID_LARGE
			// DELETE AND ELEMENTS LEFT OVER FROM COLLECTION
			// RUN IMAGE RESIZE
			// FADE IN
			// IF IN PUBLICATIONS – ANIMATE PARENT HEIGHT
			// SCROLL DOWN TO OPENED IMAGE
			// viewPage.scrollToTarget(  );

		}


		// 	// CLOSE OTHER IMAGES
		// 	grid.find(".grid_large").css({
		// 		"height" : "0"
		// 	});

		// 	// CLOSE ANY OPEN IMAGES IN GRID
		// 	// + ADD RESET CLASS
		// 	grid.find(".grid_large").css("height","0").find(".image_wrapper").empty().removeClass("full").addClass("empty");	

		// 	// IF IN COLLECTION
		// 	if ( click.hasClass("coll_post") ) {
		// 		// APPEND INFO TO GRID LARGE
		// 		var nextLarge = click.nextAll(".grid_large").eq(0);
		// 		click.find(".hidden_content").clone().removeClass("hide").appendTo(nextLarge);
		// 		// CALCULATE GRID_LARGE HEIGHT
		// 		var img = nextLarge.find(".hidden_content"),
		// 			largeH = nextLarge.find(".hidden_content").height(),
		// 			rowNo = click.attr("data-row");
		// 		console.log( 574, largeH );
		// 	} else {
		// 		// CALCULATE HEIGHT OF GRID_LARGE
		// 		var imgW = parseInt( img.attr("width") ),
		// 			imgH = parseInt( img.attr("height") ),
		// 			colW = parseInt( grid.width() ),
		// 			largeH = imgH / imgW * colW * 0.9,
		// 			rowNo = click.parents("li").attr("data-row");
		// 		if ( img.hasClass("portrait") ) {
		// 			console.log( 162, largeH );
		// 			largeH = largeH * 0.67 + 24;
		// 			console.log( 164, largeH );
		// 		} 
		// 	}

		// 	// GIVE HEIGHT TO FOLLOWING GRID_LARGE
		// 	console.log( 167, rowNo );
		// 	grid.find( ".row_" + rowNo ).css({
		// 		"height" : largeH
		// 	});

		// 	// CLONE IMAGE AND APPEND TO FOLLOWING .GRID_LARGE
		// 	img.clone().appendTo( grid.find( ".row_" + rowNo + " .image_wrapper" ) );
		// 	// DELETE AND ELEMENTS LEFT OVER FROM COLLECTION
		// 	grid.find(".grid_large .hidden_content").each( function(){
		// 		if ( !$(this).parent(".image_wrapper").length ) {
		// 			console.log( 606 );
		// 			$(this).remove();
		// 		}
		// 	});
		// 	// RUN IMAGE RESIZE
		// 	imageManager( grid.find( ".row_" + rowNo + " img" ) );
		// 	// FADE IN
		// 	grid.find( ".row_" + rowNo ).removeClass("empty").addClass("full").find(".grid_close").fadeIn();
		// 	// IF IN PUBLICATIONS – ANIMATE PARENT HEIGHT
		// 	if ( click.parents("#publications_list").length ) {
		// 		// GET CURRENT HEIGHT
		// 		var parentH = $("#publications_list").height();
		// 		$("#publications_list").css( "height", "auto" );
		// 	} 
		// 	// SCROLL DOWN TO OPENED IMAGE
		// 	var target = grid.find( ".row_" + rowNo ).position().top,
		// 		offset = $("#top_header").outerHeight();
		// 	console.log( 628, target );
		// 	if ( parseInt( $("#wrapper").attr("data-current") ) !== 1 ) {
		// 		offset += $("#bottom_header").outerHeight();
		// 	} 
		// 	$(".current").animate( { scrollTop: target - offset }, 500 );	

		// }


	}	

}

$(document).on("ready", function(){
	controllerPage.pageInit();
});
