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
			4.2. HOME IMAGES HOVER
			4.3. HOME IMAGES CLICK
			4.4. HOME LINK OPEN
		5. PUBLICATIONS + EXHIBITIONS
			5.1. BANNER LINKS
		6. ARCHIVE + COLLECTIONS
			6.1. ARCHIVE FILTER
			6.2. COLLECTION PASSWORD
			6.3. COLLECTION FILTER


*****************************************************************************/

var winH = $(window).height()
	winW = $(window).width();

// MOBILE TMP

function winHFix () {
	$("section").css("min-height",winH);
}


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
			multiple = 1;
		// console.log( 91, "currTop: ", currTop, "currScrollTop: ", current.scrollTop() )

		console.log("Scrolling up.");
		// CHECK IF CURRENT TOP > 0
		if ( currTop < 0 && !$("#wrapper").hasClass("wheel_block") ) {
			var newTop = currTop - ( delta * multiple );
			if ( newTop >= 0 ) {
				newTop = 0;
			}
			current.css({
				"-webkit-transform" : "translateY(" + newTop + "px)",
  					"-ms-transform" : "translateY(" + newTop + "px)",
						"transform" : "translateY(" + newTop + "px)"
			});
		} else {
			// REMOVE SCROLLING CLASS
			// console.log( 126, "Remove scroll_block class." );
			current.removeClass("scroll_block");

			// IF CURRENT SCROLLTOP IS 0 AND WRAPPER DATA-CURRENT IS NOT 1
			// SWITCH CLASSES + ANIMATE

			if ( current.scrollTop() <= 0 && $("#wrapper").attr("data-current") != 1 ) {
				if ( !$("#wrapper").hasClass("wheel_block")) {
					console.log( 110, "Animate" );
					// BLOCK SCROLLING
					$("#wrapper").addClass("wheel_block");
					// console.log("Wheel blocked.");
					
					// SWITCH CLASSES
					_switchClasses("up");
					$(".current").css({
								"transition": "transform 1s",
						"-webkit-transform" : "",
			      			"-ms-transform" : "",
								"transform" : ""			
					});
					// RUN NAV CHECK DURING ANIMATION
					setTimeout( function(){
						bottomNavCheck();	
					}, 200 );
					setTimeout( function(){
						$("#wrapper").removeClass("wheel_block");
						// console.log("Wheel unblocked.");
						$(".current").css({
								"transition": ""		
						});

					}, 1500 );
				}
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
			console.log( 158, "Current at bottom.", current.scrollTop() + current.innerHeight(), current[0].scrollHeight );
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
			console.log( 169, "Scrolling up." );
			// IF CURRENT AT TOP 
			if ( current.scrollTop() <= 20 ) {
				console.log( 158, "Current at top(<20)." );
				_scrollUp(delta);
			} else {
				console.log("Normal scrolling.");
				// ALLOW CURRENT TO SCROLL NORMALLY
				current.removeClass("scroll_block");				
			}
		}

	}

// 1.2. IMAGE MANAGER

function imageResizer ( img ) {
	console.log("imageResizer");
	// CHANGE POINTS: THM = 300 / MED = 600 / LRG = 900
	var thisSrc;
	if ( img.width() <= 300 ) {
		thisSrc = img.attr("data-thm");
	} else if ( img.width() > 300 && img.width() <= 600 ) {
		thisSrc = img.attr("data-med");
	} else {
		thisSrc = img.attr("data-lrg");
	}
	console.log( 214, thisSrc );
	// IF BG IMAGE
	if ( img.hasClass("bg_image") ) {
		var bgSrc = "url('"+ thisSrc +"')";
		console.log( 225, bgSrc );
		img.css({
			"background-image" : bgSrc 
		});
	} else {
		img.attr("src",thisSrc);
	}
	img.removeClass("blurred");
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
		imageResizer( $(".bg_image") );

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
		console.log("Not touch.");
    }
	var classes = $("body").attr("class");
	$("#console p").text(classes);

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
		// console.log( 289, bottomTop, topMargin );
		$("#console p").append( bottomTop - topMargin + ", " );
		if ( bottomTop <= topMargin ) {
			// console.log("Fix nav.");
			$("#bottom_header").appendTo( $("#bottom_header_fixed") );
		} else {
			// console.log("Unfix nav.");
			$("#bottom_header").appendTo( $("#bottom_header_unfixed") );
		}

	// 	// // CALCULATE MAIN LOGO SEPARATELY
	// 	var logoH = $("#main_logo").outerHeight(),
	// 		logoTop = bottomTop + $("#bottom_header_unfixed").height() - logoH;
	// 		// console.log( 311, logoTop, topMargin );
	// 	if ( logoTop <= topMargin ) {
	// 		$("#main_logo").appendTo( $("#bottom_header_fixed") ).css({
	// 			"position" : "fixed",
	// 			"top" : topMargin, 
	// 			"bottom" : "initial"
	// 		});	
	// 	} else {
	// 		$("#main_logo").appendTo( $("#bottom_header_unfixed") ).css({
	// 			"position" : "",
	// 			"top" : "", 
	// 			"bottom" : ""
	// 		});	
	// 	}
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

// 4.1. HOME IMAGE PLACEMENT

function homeImages () {
	console.log("homeImages");

	var img = $(".current #home_multiple_images li"),
		maxW = 67, // PERCENTAGE
		heightArray = [],
		noImages = img.length,
		tranche = maxW / noImages,
		i = 0;

	// FILL HEIGHT ARRAY
	while ( i < noImages ) {
		randH = Math.random() * tranche;
		// console.log( 470, tranche, randH, tranche * i );		
		height = randH + ( tranche * i );
		if ( height > 67 ) {
			height = height - ( Math.random() * 25 + 25 );
		}
		heightArray.push( height );
		i++;
	}
	// SHUFFLE HEIGHT ARRAY
	heightArray = _.shuffle(heightArray);

	// LOOP THROUGH LI
	img.each( function(i){
		var rand = Math.random() * tranche / 2 + ( tranche / 4 );
		thisLeft = rand + ( tranche * i );
		thisTop = heightArray[i],
		thisBottom = ( thisTop / 100 * img.parents(".content_wrapper").height() ) + $(this).height(),	
		bottomMax = img.parents(".content_wrapper").height();
		if ( thisBottom > bottomMax ) {
			console.log( 530, "Image too low.");
			thisTop = thisTop * 0.8;
		}
		$(this).css({
			"top" : thisTop + "%",
			"left" : thisLeft + "%"
		});
	});

	// FADE IN IMAGES
	img.animate({
		"opacity": 1
	}, 500);

}

	// 4.2. HOME IMAGES HOVER

function homeHover ( home_post ) {
	console.log("homeHover");
	var currZ = parseInt( home_post.css("z-index") );
	home_post.css({ "z-index": currZ + 1 }).siblings("li").css({ "z-index": "1" });
}

	// 4.3. HOME IMAGES CLICK

function homeClick ( click ) {
	console.log("homeClick");
	var link = click.data("link");
	// CLOSE ANY OTHER OPEN TEXT BLOCKS
	$(".home_text").hide();
	// IF NO TEXT BLOCK
	if ( !click.next(".home_text").length ) {
		console.log("No text block.", link);
		// SCROLL DOWN TO LINK
		homeLinkOpen(link);
		return;
	}
	// CHECK IF POSITION HAS ALREADY BEEN CALCULATED
	if ( click.siblings(".home_text").attr("data-left").length && click.siblings(".home_text").attr("data-top").length ) {
		// SHOW BLOCK
		click.siblings(".home_text").show();
	} else {
		// CALCULATE POSITION – ALL FIGURES IN PERCENTAGES
		var leftMargin = Math.floor( click.position().left / winW * 100 ), 
			imgW = Math.floor( click.width() / winW * 100 ), 
			rightMargin = 100 - ( leftMargin + imgW ),
			leftPos,
			topPos = Math.floor( Math.random() * 67 );
		if ( leftMargin > rightMargin ) {
			// SHOW ON LEFT
			if ( leftMargin > imgW ) {
				// CENTRE ON LEFT
				leftPos = ( leftMargin - imgW ) / 2;
			} else {
				// STICK TO LEFT
				leftPos = 0;
			}
		} else {
			// SHOW ON RIGHT
			if ( rightMargin > imgW ) {
				// CENTRE ON RIGHT
				leftPos = rightMargin + ( ( rightMargin - imgW ) / 2 );
			} else {
				// STICK TO RIGHT
				leftPos = 100 - imgW;
			}
		}
		// IF WINDOW WIDTH IS SMALLER THAN 500px
		if ( winW < 500 ) {
			leftPos = 20;
			topPos = 10;
		}
		click.siblings(".home_text").attr({
			"data-left" : leftPos,
			"data-top" : topPos
		}).css({
			"display" : "block",
			"left" : leftPos + "%",
			"top" : topPos + "%"
		});
	}
}

function homeLinkOpen ( link ) {
	console.log("homeLinkOpen");
	if ( link.substring(0,3) === "int" ) {
		// GET SECTION AND POST TO SCROLL TO
		var section = link.split("_")[1],
			post = link.split("_")[2],
			targetId;
		// SCROLL TO SECTION
		navToSection( section );
		// SCROLL TO POST
		console.log( 664, "Scroll to post." );
	} else if ( link.substring(0,4) === "http" ) {
		console.log("external");		
	}
}

function homeClose () {
	console.log("homeClose");
	$(".home_text").hide();
}

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
	e.preventDefault();
	return false;
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
		// console.log( "Show only: ", $("[data-type='" + value + "']") );
		// HIDE ALL POSTS
		$(".coll_post").hide().addClass("hidden");
		// SHOW ONLY POSTS WITH ID
		if ( menu === "type" ) {
			$("[data-type='" + value + "']").show().removeClass("hidden");	
		} else if ( menu === "theme" ) {
			$("[data-theme='" + value + "']").show().removeClass("hidden");
		}
	}
}
