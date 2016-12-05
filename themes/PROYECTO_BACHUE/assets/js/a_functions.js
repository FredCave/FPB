/****************************************************************************
    
	FUNCTIONS
		1.	 GENERAL
			1.1. NAVIGATING BETWEEN SECTIONS
			1.2. IMAGE MANAGER
			1.3. OPEN IFRAMES
			1.4. CONTENT LOADER
			1.5. NAVIGATE TO SECTION
			1.6. SECTION CHECK
			1.7. LINK CHECK
		2. 	NAV
			2.1. BOTTOM NAV FIXER
			2.2. NAV SECTION HIGHLIGHTER
			2.3. NAV CLICK
		3.	IMAGE GRIDS
			3.1. IMAGE GRID MANAGER
			3.2. IMAGE GRID TOGGLE
		4. HOME
			4.1. HOME IMAGE PLACEMENT
			4.2. HOME SLIDESHOW
			4.3. HOME LINK 
			4.4. HOME VIDEO
		5. PUBLICATIONS + EXHIBITIONS
			5.1. BANNER LINKS
		6. ARCHIVE + COLLECTIONS
			6.1. ARCHIVE FILTER
			6.2. COLLECTION PASSWORD
			6.3. COLLECTION DROPDOWN FILTER
			6.4. COLLECTION FILTER BY NAME


*****************************************************************************/

var winH = $(window).height(),
	winW = $(window).width();

/****************************************************************************
    
	1. GENERAL

*****************************************************************************/

// 1.1. NAVIGATING BETWEEN SECTIONS

	var switchBlock = true;
	function _switchClasses ( direction ) {
		// CHECK IF FUNCTION BLOCKED TO AVOID RE-RUNNING TOO SOON
		switchBlock = false;
		if ( !switchBlock ) {
			console.log("_switchClasses", direction);
			if ( direction === "down" ) {
				$(".current").removeClass("current").next().addClass("current").removeClass("scroll_block"); 
				$(".previous").removeClass("previous");
				$(".current").prev().addClass("previous");
				// LOAD NEXT FUNCTION
				contentLoader();				
			} else if ( direction === "up" ) {
				$(".current").removeClass("current")
				$(".previous").removeClass("previous").addClass("current").removeClass("scroll_block");
				$(".current").prev().addClass("previous");
			}
			// UPDATE CURRENT SECTION STORED IN WRAPPER
			var curr = $(".current").attr("data-content");
			// console.log( 49, curr );
			$("#wrapper").attr( "data-current", curr );
			// UNBLOCK FUNCTION
			switchBlock = true;
		}
	}

	function _scrollDown( delta ) {
		console.log("_scrollDown", $("#wrapper").attr("data-current"));

		var current = $(".current"),
			currTop = parseInt( current.css('transform').split(',')[5] ),
			currH = $(".current").outerHeight(),
			multiple = 1,
			newTop = currTop - ( delta * multiple );
			// console.log( 62, "New top: ", newTop );

		// ADD SCROLL_BLOCK CLASS
		current.addClass("scroll_block");

		// IF VISIBLE
		if ( currH + currTop >= 40 ) {
			console.log( 85, currH + currTop, currTop, delta, newTop );
			current.css({
				"-webkit-transform" : "translateY(" + newTop + "px)",
  					"-ms-transform" : "translateY(" + newTop + "px)",
						"transform" : "translateY(" + newTop + "px)"
			});

		} else {
			console.log( 92, "Switch" );			
			// SWITCH CLASSES
			_switchClasses("down");
		}

	}

	function _scrollUp(delta) {
		console.log("_scrollUp", $("#wrapper").attr("data-current"));

		var current = $(".current"),
			currTop = parseInt( current.css('transform').split(',')[5] ),
			currH = $(".current").outerHeight(),
			multiple = 1,
			newTop;
		// console.log( 91, "currTop: ", currTop, "currScrollTop: ", current.scrollTop() )
		console.log("Scrolling up.");

		// ADD SCROLL_BLOCK CLASS
		current.addClass("scroll_block");

		console.log( 119, "Current = ", $("#wrapper").attr("data-current"), currTop );
		// IF CURRENT TOP (TRANSFORM) < 0 – CURRENT IS "ON THE WAY OUT"

		if ( currTop < 0 && !$("#wrapper").hasClass("wheel_block") ) {

			console.log( 124, "Translate back." );

			newTop = currTop - ( delta * multiple );
			if ( newTop >= 0 ) {
				newTop = 0;
			}
			current.css({
				"-webkit-transform" : "translateY(" + newTop + "px)",
  					"-ms-transform" : "translateY(" + newTop + "px)",
						"transform" : "translateY(" + newTop + "px)"
			});

		} else if ( currTop == 0 && !$("#wrapper").hasClass("wheel_block") ) {

			console.log( 128, "Switch classes." );
			// REMOVE SCROLL_BLOCK CLASS TO ALLOW INTERIOR SCROLLING
			// current.removeClass("scroll_block");

			// IF CURRENT INTERIOR SCROLLTOP IS 0 AND WRAPPER DATA-CURRENT IS NOT 1
			// SWITCH CLASSES + TRANSFORM UP
			if ( current.scrollTop() <= 0 && $("#wrapper").attr("data-current") != 1 ) {
				// CHECK IF WHEEL BLOCK – ADDED TO STOP CONSECUTIVE SWITCHCLASSES
				if ( !$("#wrapper").hasClass("wheel_block") ) {
					// ADD WHEEL_BLOCK
					$("#wrapper").addClass("wheel_block");
					// SWITCH CLASSES
					_switchClasses("up");

					newTop = currTop + ( delta * multiple );
					if ( newTop < 0 ) {
						newTop = 0;
					}
					console.log( 158, currTop, delta, newTop );

					current.css({
						"-webkit-transform" : "translateY(" + newTop + "px)",
		  					"-ms-transform" : "translateY(" + newTop + "px)",
								"transform" : "translateY(" + newTop + "px)"
					});

					// RUN NAV CHECK DURING ANIMATION
					bottomNavCheck();	

					setTimeout( function(){
						$("#wrapper").removeClass("wheel_block");
						console.log("Wheel unblocked.");
					}, 500 );

				}
			} else if ( current.scrollTop() != 0  ) {
				// NORMAL SCROLLING
				current.removeClass("scroll_block");	
			}

		} 
	}

	function _scrollDetect(delta) {
		console.log("_scrollDetect", delta);
		var current = $(".current"),
			wrapperCurrent = $("#wrapper").attr("data-current"); 
		if ( wrapperCurrent == 1 ) {
			bottomNavCheck();
		}
		// IF SCROLLING DOWN
		if ( delta > 0 ) {
			console.log( 155, "Scrolling down." );
			// IF CURRENT AT BOTTOM (OR TOP)
			if ( current.scrollTop() + current.innerHeight() >= current[0].scrollHeight - 10 ) {
				// IF NOT LAST SECTION
				if ( wrapperCurrent != 6 ) {
					_scrollDown(delta);	
				} 
			} else {
				console.log("Normal scrolling.");
				// ALLOW CURRENT TO SCROLL NORMALLY
				current.removeClass("scroll_block");			
			}
		// IF SCROLLING UP
		} else if ( delta < 0 ) {
			console.log( 169, "Scrolling up.", current.scrollTop() );
			// IF CURRENT AT TOP 
			console.log( 203, current.scrollTop() );
			// if ( current.scrollTop() <= 20 ) {
				// console.log( 158, "Current at top(<20)." );
				_scrollUp(delta);
			// } 
			// else {
			// 	console.log("Normal scrolling.");
			// 	// ALLOW CURRENT TO SCROLL NORMALLY
			// 	current.removeClass("scroll_block");				
			// }
		}

	}

// 1.2. IMAGE MANAGER

function imageResizer ( img ) {
	console.log("imageResizer");
	var thisSrc,
		imgW;
	if ( img.hasClass("bg_image") ) {
		// GET REAL HEIGHT OF IMAGE
		var ratio = img.attr("data-ratio");
		// IF WIN IS VERTICAL
		if ( winW < winH ) {
			imgW = winH * ratio;
		}
	} else {
		imgW = img.width();
	}	
	// CHANGE POINTS: THM = 300 / MED = 600 / LRG = 900
	if ( imgW <= 300 ) {
		thisSrc = img.attr("data-thm");
	} else if ( imgW > 300 && imgW <= 600 ) {
		thisSrc = img.attr("data-med");
	} else {
		thisSrc = img.attr("data-lrg");
	}
	console.log( 214, thisSrc );
	// IF BG IMAGE
	if ( img.hasClass("bg_image") ) {
		var bgSrc = "url('"+ thisSrc +"')";
		img.css({
			"background-image" : bgSrc 
		});
	} else {
		img.attr("src",thisSrc);
	}
	setTimeout( function(){
		img.removeClass("blurred");		
	}, 500 );
}

function imageManager ( img ) {
	console.log("imageManager");
	if (typeof img !== 'undefined') {
		// RUN ON ONE IMAGE
		// console.log( 199, "Run on only one image." );
		imageResizer( img );
    } else {
    	// console.log( 196, "Run on all images.");
		// LOOP THROUGH IMAGES
		$(".loaded img").each( function(i){
			imageResizer( $(this) );
		});
		// RUN ON FIRST IMAGE IN SLIDESHOW
		imageResizer( $(".visible .bg_image") );
    }
}

// 1.3. OPEN IFRAMES

	// RUN ON RESIZE
function ifrHeight ( target ) {
	console.log("ifrHeight");
	// IF TARGET – ONLY ONE IFRAME
	if (typeof target !== 'undefined') {
		// GET RATIO AND WIDTH
		var ratio = target.data("ratio"),
			width = target.width();
		target.css( "height", width*ratio );
	} else {
		// ELSE ALL IFRAMES
		$("iframe").each( function(){
			// GET RATIO AND WIDTH
			var ratio = $(this).data("ratio"),
				width = $(this).width();
			$(this).css( "height", width*ratio );
		});		
	}
}

function openIframes ( section ) {
	console.log("openIframes", section);
	var iframe = $("#" + section).find("iframe");
	// SET RATIO
	var ratio = iframe.attr("height") / iframe.attr("width");
	iframe.attr("data-ratio", ratio);
	// RUN HEIGHT FUNCTION
	ifrHeight ( iframe );
	// ADD SRC
	iframe.attr( "src", iframe.data("src") );
}

// 1.4. CONTENT LOADER

function contentLoader ( target ) {
	console.log("contentLoader", target);
	// RUN ON PAGE LOAD / SWITCHCLASSES / NAVCLICK
	if ( typeof target !== 'undefined' ) {
		// IF TARGET DEFINED
		$("#" + target).show().addClass("loaded");
		// CALCULATE IMAGE SIZES FOR LOADED IMAGES
		imageManager();
	} else {
		// ELSE LOAD NEXT IN LINE
		$(".current").next().show().addClass("loaded");
		// CALCULATE IMAGE SIZES FOR LOADED IMAGES
		imageManager();
	}
}

// 1.5. NAVIGATE TO SECTION

function navToSection ( section ) {
	console.log("navToSection");
	// LOAD RELEVANT SECTION
	if ( !$( "section_" + section ).hasClass("loaded") ) {
		contentLoader( "section_" + section );		
	}
	// ADD WHEEL_BLOCK CLASS
	$("#wrapper").addClass("wheel_block");
	// RUN BOTTOM NAV CHECK DURING ANIMATION
	var navInterval = 0;
	navInterval = setInterval( function(){
		bottomNavCheck();
	}, 100 );
	console.log(298, "Target: ", section, "Current: ", $("#wrapper").data("current") );
	// IF BEFORE CURRENT 
	if ( section > $("#wrapper").attr("data-current") ) {
		console.log(301, "Before");
		// ANIMATE ALL SECTIONS BEFORE
		$("#section_" + section).prevAll().each( function(){
			// WORK OUT HOW MUCH IT HAS TO BE MOVED UP
			var thisH = 0 - $(this).outerHeight();
			$(this).css({
				"transition"		: "transform 1s",
				"-webkit-transform" : "translateY(" + thisH + "px)",
	      			"-ms-transform" : "translateY(" + thisH + "px)",
						"transform" : "translateY(" + thisH + "px)",
				"display"			: "block"		
			});
		});
	// ELSE IF AFTER
	} else if ( section <= $("#wrapper").attr("data-current") ) {
		console.log(311, "After");
		// ANIMATE ALL SECTIONS AFTER
		$("#section_" + section).nextAll().andSelf().each( function(){
			$(this).css({
				"transition"		: "transform 1s",
				"-webkit-transform" : "translateY(0px)",
	      			"-ms-transform" : "translateY(0px)",
						"transform" : "translateY(0px)",
				"display"			: "block"		
			});
		});
	}
	// ADD CURRENT CLASS
	$(".current").removeClass("current");
	$(".previous").removeClass("previous");
	$("#section_" + section).addClass("current").prev().addClass("previous");
	// UPDATE DATA-CURRENT
	$("#wrapper").attr("data-current", section);
	// UPDATE NAV HIGHLIGHT
	navHighlight();
	// REMOVE WHEEL_BLOCK CLASS + RESET TRANSITIONS
	setTimeout( function(){
		$("#wrapper").removeClass("wheel_block");
		$("section").css("transition","");
		// console.log( 308 );
		clearInterval( navInterval );
	}, 1000 );
}

// 1.6. SECTION CHECK

function sectionCheck( click ) {
	console.log("sectionCheck"); 
	// IF CLICKED SECTION DOES NOT EQUAL CURRENT
	if ( click != $("#wrapper").attr("data-current") ) {
		navToSection( click );
	}

}

// 1.7. LINK CHECK

function linkCheck () {
	console.log("linkCheck");
	$("#wrapper a").each( function(){
		var href = $(this).attr("href");
		if ( href.substring(0,4) == "http" ) {
			// ADD TARGET BLANK AS ATTRIBUTE
			$(this).attr("target","_blank");
		}
	});
}

// 1.8. TOUCHSCREEN CHECK

function touchScreenCheck () {
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
    } else {
		// console.log("Not touch.");
    }
	// var classes = $("body").attr("class");
	// $("#console p").text(classes);

}

// 1.9. SECTIONS RESIZE

function winHFix () {
	console.log("winHFix", winH);
	winH = $(window).height();
	$("section").css("min-height",winH);
	$("#home").css("height",winH);
}


/****************************************************************************
    
	2. NAV

*****************************************************************************/

// 2.1. BOTTOM NAV FIXER

function bottomNavCheck () {
	// console.log("bottomNavCheck");
	// ONLY RUN IF SCREEN IS WIDER THAN 500PX
	if ( winW > 500 ) {
		// GET HEIGHT OF TOP NAV
		var topMargin = $("#top_header").outerHeight();
		// GET CURRENT TOP POSITION OF BOTTOM NAV RELATIVE TO WINDOW
		// var bottomTop = Math.floor( $("#bottom_header_unfixed").offset().top );
		var bottomTop = Math.floor( $("#bottom_header_unfixed")[0].getBoundingClientRect().top );
		// NEED TO LEAVE PLACEHOLDER THAT SCROLLS WITH THE PAGE
		$("#console p").append( bottomTop - topMargin + ", " );
		if ( bottomTop <= topMargin ) {
			$("#bottom_header").appendTo( $("#bottom_header_fixed") );
		} else {
			$("#bottom_header").appendTo( $("#bottom_header_unfixed") );
		}

		// CALCULATE MAIN LOGO SEPARATELY
		var logoH = $("#main_logo").outerHeight(),
			logoTop = bottomTop + $("#bottom_header_unfixed").height() - logoH;
			// console.log( 311, logoTop, topMargin );
		if ( logoTop <= topMargin ) {
			$("#main_logo").appendTo( $("#bottom_header_fixed") ).css({
				"position" : "fixed",
				"top" : topMargin, 
				"bottom" : "initial"
			});	
		} else {
			$("#main_logo").appendTo( $("#bottom_header_unfixed") ).css({
				"position" : "",
				"top" : "", 
				"bottom" : ""
			});	
		}
	} else {
		// console.log( 389, "Append to fixed wrapper." );
		$("#bottom_header").appendTo( $("#bottom_header_fixed") );
	}
}

// 2.2. NAV SECTION HIGHLIGHTER

function navHighlight () {
	// console.log("navHighlight");
	// GET CURRENT
	var currId = parseInt( $("#wrapper").attr("data-current") );
	// RESET SIBLINGS
	$("#bottom_header a").removeClass("highlight");
	// IF NOT HOME LINK
	if ( currId !== 1 ) {
		$("#bottom_header [data-id='" + currId + "']").addClass("highlight");
	}
}

// 2.3. NAV CLICK

function navClick ( targetId ) {
	console.log( "navClick", targetId );
	var currentId = parseInt( $(".current").attr("data-content") );
	console.log( 403, currentId );
	// IF TARGET IS VISIBLE
	if ( targetId === currentId ) {
		// SCROLL TO TOP OF CURRENT
		$(".current").animate({ scrollTop: 0 }, 500 );
	// ELSE NAV TO SECTION
	} else {
		console.log("NAV TO SECTION");
		navToSection( targetId );
	}
}

function navClickMobile ( targetId ) {
	console.log("navClickMobile");
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

}

// 2.4. MOBILE MENU

function mobileMenuOpen( click ) {
	console.log("mobileMenuOpen");
	if ( !click.hasClass("clicked") ) {
		$("#bottom_header_fixed").css({
			"-webkit-transform" : "translateY(0)",
					"transform" : "translateY(0)"
		});	
		click.addClass("clicked");
	} 
}

function mobileMenuClose() {
	console.log("mobileMenuClose");
	$("#bottom_header_fixed").css({
		"-webkit-transform" : "",
				"transform" : ""
	});	
	$("#mobile_menu").removeClass("clicked");	
}

/****************************************************************************
    
	3. IMAGE GRIDS

*****************************************************************************/

// 3.1. IMAGE GRID MANAGER

function gridReset( grid ) {
	console.log("gridReset");
	grid.find(".clear").remove();
	grid.find(".grid_large").remove();
}

	// GRID MANAGER
	// RUNS ON AJAX LOAD + MEDIA QUERY RESIZE

function gridManager () {
	console.log("gridManager");
	// LOOP THROUGH ALL LOADED GRIDS
	$(".image_grid").each( function(){
		var cols = $(this).attr("data-col");
		// SET NUMBER OF COLUMNS
		if ( winW <= 500 ) {
			cols = 1;
			$(this).attr("data-col", cols);
		} else if ( winW > 500 && winW <= 900 ) {
			cols = 2;
			$(this).attr("data-col", cols);
		}
		console.log( 594, "number of cols = ", cols );
		// RESET – IS THERE A BETTER WAY THAN REMOVING .GRID_LARGE??
		gridReset( $(this) );
		// LOOP THROUGH CELLS 
		var count = 1,
			row = 1,
			totalCells = $(this).find(".image_cell").not(".hidden").length;
		console.log( 64, totalCells, cols );
		$(this).find(".image_cell").not(".hidden").each( function(){
			console.log( 312 );
			$(this).attr( "data-row", row );
			// IF END OF THE ROW OR IF LAST CELL
			if ( count % cols === 0 || count === totalCells ) {
				// REMOVE MARGIN-RIGHT
				console.log( 609, $(this).find(".coll_title").text() );
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
	});
}

	// ROW HEIGHT

function setRowHeight ( i, grid ) {
	console.log("setRowHeight");
	// GET ALL CELLS IN ROW
	var maxH = 0;
	grid.find( "li[data-row=" + i + "]").each( function(j){
		console.log( 535, i, $(this).height(), maxH );
		if ( $(this).height() > maxH ) {
			maxH = $(this).height() + 24;
		}
	});
	grid.find("li[data-row=" + i + "]").css("height",maxH);
}

function rowHeight ( grid ) {
	console.log("rowHeight");
	// CHECK IF PARENT IS LOADED
	if ( !grid.parents("section").hasClass("loaded") ) {
		grid.parents("section").show().addClass("loaded");
		imageManager();
	}
	// setTimeout( function(){
	// 	grid.imagesLoaded().always( function( instance, image ){
	// 		console.log( 99, "Images loaded." );
	// 		// GET NUMBER OF ROWS
	// 		var rows = parseInt( grid.find(".image_cell").not(".hidden").last().attr("data-row") ),
	// 			i = 1;
	// 		console.log( 377, rows, i );			
	// 		// LOOP THROUGH ROWS
	// 		while ( i <= rows ) {
	// 			setRowHeight( i, grid );
	// 			i++;	
	// 		}	
	// 	});		
	// }, 500 );
}

// 3.2. IMAGE GRID TOGGLE

function gridOpen ( click ) {
	console.log("gridOpen");
	var grid = click.parents(".image_grid"),
		img = click.find("img");
	// CALCULATE HOW MANY IMAGES IN ROW
	var rowL = grid.attr("data-col");
	// CLOSE OTHER IMAGES
	grid.find(".grid_large").css({
		"height" : "0"
	});

	// CLOSE ANY OPEN IMAGES IN GRID
	// + ADD RESET CLASS
	grid.find(".grid_large").css("height","0").find(".image_wrapper").empty().removeClass("full").addClass("empty");	

	// IF IN COLLECTION
	if ( click.hasClass("coll_post") ) {
		// APPEND INFO TO GRID LARGE
		var nextLarge = click.nextAll(".grid_large").eq(0);
		click.find(".hidden_content").clone().removeClass("hide").appendTo(nextLarge);
		// CALCULATE GRID_LARGE HEIGHT
		var img = nextLarge.find(".hidden_content"),
			largeH = nextLarge.find(".hidden_content").height(),
			rowNo = click.attr("data-row");
		console.log( 574, largeH );
	} else {
		// CALCULATE HEIGHT OF GRID_LARGE
		var imgW = parseInt( img.attr("width") ),
			imgH = parseInt( img.attr("height") ),
			colW = parseInt( grid.width() ),
			largeH = imgH / imgW * colW * 0.9,
			rowNo = click.parents("li").attr("data-row");
		if ( img.hasClass("portrait") ) {
			console.log( 162, largeH );
			largeH = largeH * 0.67 + 24;
			console.log( 164, largeH );
		} 
	}

	// GIVE HEIGHT TO FOLLOWING GRID_LARGE
	console.log( 167, rowNo );
	grid.find( ".row_" + rowNo ).css({
		"height" : largeH
	});

	// CLONE IMAGE AND APPEND TO FOLLOWING .GRID_LARGE
	img.clone().appendTo( grid.find( ".row_" + rowNo + " .image_wrapper" ) );
	// DELETE AND ELEMENTS LEFT OVER FROM COLLECTION
	grid.find(".grid_large .hidden_content").each( function(){
		if ( !$(this).parent(".image_wrapper").length ) {
			console.log( 606 );
			$(this).remove();
		}
	});
	// RUN IMAGE RESIZE
	imageManager( grid.find( ".row_" + rowNo + " img" ) );
	// FADE IN
	grid.find( ".row_" + rowNo ).removeClass("empty").addClass("full").find(".grid_close").fadeIn();
	// IF IN PUBLICATIONS – ANIMATE PARENT HEIGHT
	if ( click.parents("#publications_list").length ) {
		// GET CURRENT HEIGHT
		var parentH = $("#publications_list").height();
		$("#publications_list").css( "height", "auto" );
	} 
	// SCROLL DOWN TO OPENED IMAGE
	var target = grid.find( ".row_" + rowNo ).position().top,
		offset = $("#top_header").outerHeight();
	console.log( 628, target );
	if ( parseInt( $("#wrapper").attr("data-current") ) !== 1 ) {
		offset += $("#bottom_header").outerHeight();
	} 
	$(".current").animate( { scrollTop: target - offset }, 500 );	

}

function gridClose ( click ) {
	console.log("gridClose");
	// CLOSE PARENT
	// + ADD RESET CLASS
	click.fadeOut();
	click.parents(".grid_large").css("height","0").find(".image_wrapper").empty().removeClass("full").addClass("empty");	
}


/****************************************************************************
    
	4. HOME

*****************************************************************************/

// 4.1. HOME TEXT PLACEMENT

function homeTextPos () {
	console.log("homeImages");
	if ( winW > 500 ) {
		// GET WIDTH OF TEXT BLOCK
		var textW = $(".home_text").css("width"); // IN PIXELS
		// CALC RANDOM LEFT PERCENTAGE
		var leftPos = Math.random() * ( 1 - ( parseInt(textW) / $(window).width() ) ) * 100,
			topPos = Math.floor( Math.random() * 62 ) + 5;
		console.log( 756, textW, leftPos );
		$(".home_text").css({
			"left" : leftPos + "%",
			"top" : topPos + "%"
		}).show();
	} else {
		$(".home_text").show();		
	}
}

// 4.2. HOME IMAGES SLIDESHOW

function loadNext ( nextLi ) {
	var nextImg = nextLi.find(".bg_image");
	if ( nextImg.hasClass("blurred") ) {
		console.log("loadNext");
		imageResizer( nextImg );
	}
}

function homeSlideInit () {
	console.log("homeSlideInit");
	var gallery = $("#home_slideshow"),
		initDelay = 2000,
		interval = 5000;
	// LOAD NEXT
	loadNext( gallery.find(".visible").next() );
	// DELAY AND THEN INITIATE SLIDESHOW
	setTimeout( function(){
		setInterval( function(){
			// IF NEXT EXISTS
			if ( gallery.find(".visible").next().length ) {			
				// MAKE NEXT VISIBLE
				gallery.find(".visible").removeClass("visible").next().addClass("visible");
				// LOAD NEXT
				loadNext( gallery.find(".visible").next() );
			} else {		
				// GO BACK TO BEGINNING
				gallery.find(".visible").removeClass("visible");
				gallery.find("li:first-child").addClass("visible");				
			}
		}, interval );		
	}, initDelay );
}

// 4.3. HOME LINK

function homeLinkOpen ( link ) {
	console.log("homeLinkOpen");
	if ( link.substring(0,3) === "int" ) {
		// GET SECTION AND POST TO SCROLL TO
		var section = link.split("_")[1],
			post = link.split("_")[2],
			targetId;
		// SCROLL TO SECTION
		navToSection( section );
		// AFTER 1 SECOND SCROLL TO POST
		setTimeout( function(){
			// TRIGGER CLICK ON BANNER LINK
			bannerLink( $("[data-link="+post+"]") ).trigger("click");
		}, 1000 );
	} else if ( link.substring(0,4) === "http" ) {
		console.log("external");
	}
}

function homeClose () {
	console.log("homeClose");
	$(".home_text").hide();
}

// 4.4. HOME VIDEO

// CREATE AN IFRAME AFTER THE API CODE DOWNLOADS
var player;
function onYouTubeIframeAPIReady() {
	console.log( 843, "onYouTubeIframeAPIReady" );
	// GET VIDEO ID
	var vidId = $("#player").attr("data-id");
	player = new YT.Player("player", {
		height: '390',
		width: '640',
		videoId: vidId,
		events: {
			'onReady': onPlayerReady,
			'onStateChange': onPlayerStateChange
		},
		playerVars: {
        	playlist: vidId,
        	loop: 1
      	}
	});

}

// THE API WILL CALL THIS FUNCTION WHEN THE VIDEO PLAYER IS READY
function onPlayerReady(event) {
	// var vidId = $("#player").attr("data-id");
	// event.target.cuePlaylist(playlist:vidId);
	event.target.playVideo();
	event.target.mute();
}

// THE API CALLS THIS FUNCTION WHEN THE PLAYER'S STATE CHANGES
function onPlayerStateChange(event) {
	if ( event.data == YT.PlayerState.PLAYING ) {
		// console.log( 865, "PLAY" );
		playVideo();
	}
}

function playVideo () {
	console.log("playVideo");
	// MAKE IFRAME FIT TO SCREEN
	$("#player").removeClass("paused");
	// SHOW BUTTON
	$("#home_video_button").find("play").hide();
	$("#home_video_button").find("pause").show();
	$("#home_video_button").fadeIn();

}

function pauseVideo () {
	console.log("pauseVideo");
	player.pauseVideo();
	// HIDE BUTTON
	$("#home_video_button").fadeOut();
	$("#home_video_button").find("pause").hide();
	$("#home_video_button").find("play").show();
	// MAKE IFRAME SMALLER
	$("#player").addClass("paused");
}

function loadVideo () {
	console.log("loadVideo");
	// CHECK IF HOME_VIDEO DIV
	if ( $("#player").length ) {
		console.log("Video is present.");
		// LOAD THE IFRAME PLAYER API CODE ASYNCHRONOUSLY
		var tag = document.createElement('script');
		tag.src = "https://www.youtube.com/iframe_api";
		var firstScriptTag = document.getElementsByTagName('script')[0];
		firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
	} // END OF IF #PLAYER CHECK

}



// DETECT PLAY AND REMAKE FULL SIZE

/****************************************************************************
    
	5. PUBLICATIONS + EXHIBITIONS

*****************************************************************************/

// 5.1. BANNER LINKS

function bannerLink ( click ) {
	// CLICK = A.BANNER_LINK
	console.log("bannerLink");
	// SCROLL TO TOP
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
	var thisId = click.data("link");
	// console.log( 480, thisId );
	// HIDE OTHER PUBLICATIONS
	$( ".list_post" ).hide().removeClass("selected");
	// SHOW SELECTED PUBLICATION
	$( "#" + thisId ).show().addClass("selected");
	// ANIMATE PARENT HEIGHT THEN SET TO AUTO
	var thisH = $( "#" + thisId ).height();
	$( "#" + thisId ).parents(".list").css( "height", thisH );
	setTimeout( function(){
		$( "#" + thisId ).parents(".list").css( "height", "auto" );
	}, 500 );
	// SCROLL TO SELECTED POST
	var parent = click.parents("section").attr("id"),
		listTop = $( "#" + thisId ).parents(".list").position().top,
		offset = $("#top_header").outerHeight();
	if ( parseInt(parent.slice(-1)) !== 1 ) {
		offset += $("#bottom_header").outerHeight();
	} 
	setTimeout( function(){
		$(".current").animate( { scrollTop: listTop - offset }, 500 );		
	}, 500 );



	// OPEN ANY IFRAMES
	openIframes( parent );
	// RECALCULATE IMAGE SIZES
	imageManager();
}

/****************************************************************************
    
	6. ARCHIVE + COLLECTION

*****************************************************************************/

// 6.1. ARCHIVE FILTER

function archiveFilter ( value ) {
	console.log("archiveFilter");
	console.log( 451, value );
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

// 6.2. COLLECTION PASSWORD

var attempts = 0;
function passCheck (e) {
	console.log("passCheck");
	// HASH STORED IN HTML
	var hash = $("#pword_form").data("hash"),
		// COMPARE AGAINST HASHED VLAUE OF FORM
		value = $.md5( $("#pword_input").val() ),
		maxAttempts = 5;
	if ( attempts <= maxAttempts ) {
		if ( hash === value ) {
			console.log("Success.");
			// SUCCESS
				// HIDE FORM
			$("#coll_password").remove();
				// LOAD COLLECTION CONTENT
			collLoad();
		} else {
			// DISPLAY ERROR MESSAGE
			$("#error_message").text("Password incorrect.");
		}	
		attempts++;	
	} else {
		// DISPLAY ERROR – TOO MANY ATTEMPTS
		$("#error_message").text("Too many attempts. Try again later.");
	}
	// e.preventDefault();
	return false;
}

	// SUBMIT ON RETURN PRESS

function submitCheck (e) {
	console.log( 959, e );
	if(e && e.keyCode == 13) {
		// e.preventDefault();
		passCheck();
	}
}

// 6.3. COLLECTION FILTER

function collSearch ( input ) {
	// console.log("collFilter", input);
	var listItem = $(".coll_post");
	listItem.each(function(){
		var text = $(this).data("info");
		text += $(this).find("h1").text();
		console.log( 903, text, input, text.toLowerCase().indexOf( input.toLowerCase() ) );
		if ( text.toLowerCase().indexOf( input.toLowerCase() ) !== -1 ) { 
			$(this).show().removeClass("hidden");
		} else {
			$(this).hide().addClass("hidden");   	
		}       
	});

}

function collFilter ( menu, value ) {
	console.log("collFilter");
	console.log( 584, value );
	if ( value === "0" ) {
		console.log("Show all posts.");
		// SHOW ALL POSTS
		$(".coll_post").show().removeClass("hidden");
	} else {
		console.log( "Show only: ", value );
		// HIDE ALL POSTS
		$(".coll_post").hide().addClass("hidden");
		// LOOP THROUGH POSTS
		$(".coll_post").each( function(){
			// IF DATA-CLASS CONTAINS VALUE
			var dataClass = $(this).attr("data-class");
			if ( dataClass.indexOf(value) >= 0 ) {
				$(this).show().removeClass("hidden");	
			}
		});
	}
}

// 6.4. COLLECTION FILTER BY NAME

function collNameFilter () {
	console.log("collNameFilter");
	// CHECK IF LETTERS HAVE ASSOCIATED POSTS
	// FIND MORE EFFICIENT WAY THAN LOOPING!!!!!!!!!!!!!!!!!!!!!!
	$("#coll_letters li").each( function(){
		var ltr = $(this).find("a").text().toLowerCase();
		// IF CLASS EXISTS
		if ( $("." + ltr).length ) {
		// 	console.log(ltr + "exists");
		} else {
		// ELSE			
			$(this).css({
				"color" : "gray",
				"pointer" : "text"
			}).removeClass("active");
		}
	});
}

function collLetterClick( click ) {
	console.log("collLetterClick");
	if ( click.parent().hasClass("active") ) {
		var ltr = click.text().toLowerCase();
		// HIDE ALL POSTS
		$(".coll_post").hide().addClass("hidden");
		// LOOP THROUGH POSTS
		$(".coll_post").each( function(){
			// IF DATA-CLASS CONTAINS VALUE
			if ( $(this).hasClass(ltr) ) {
				$(this).show().removeClass("hidden");	
			}
		});
	}
	// HIGHLIGHT CLICKED LETTER
	$("#coll_letters").find(".clicked").removeClass("clicked");
	click.parent().addClass("clicked");
	// REDRAW GRID
	gridManager();
}
