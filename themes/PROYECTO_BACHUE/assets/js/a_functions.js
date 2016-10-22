/****************************************************************************
    
	FUNCTIONS
		1.	 GENERAL
			1.1. NAVIGATING BETWEEN SECTIONS
			1.2. IMAGE MANAGER
			1.3. OPEN IFRAMES
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
				$(".current").removeClass("current").prev().addClass("current").removeClass("scroll_block"); 
				$(".previous").removeClass("previous");
				$(".current").next().addClass("previous");
				// LOAD NEXT FUNCTION
				contentLoader();				
			} else if ( direction === "up" ) {
				$(".current").removeClass("current")
				$(".previous").removeClass("previous").addClass("current").removeClass("scroll_block");
				$(".current").next().addClass("previous");
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
			winH = $(window).height(),
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

			if ( current.scrollTop() <= 10 && $("#wrapper").attr("data-current") != 1 ) {
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

					}, 1000 );
				}
			}

		}

	}

	function _scrollDetect(e) {
		// console.log("_edgeDetect");
		var delta =  e.originalEvent.deltaY, // NEED CROSSBROWSER SOLUTION
			current = $(".current"),
			wrapperCurrent = $("#wrapper").attr("data-current"); 
		if ( wrapperCurrent == 1 ) {
			bottomNavCheck();
		}
		// IF SCROLLING DOWN
		if ( delta > 0 ) {
			console.log( 155, "Scrolling down." );
			// IF CURRENT AT BOTTOM (OR TOP)
			if ( current.scrollTop() + current.innerHeight() >= current[0].scrollHeight - 10 ) {
				console.log( 158, "Current at bottom." );
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
	if ( img.width() <= 300 ) {
		img.attr( "src", img.attr("data-thm") );
	} else if ( img.width() > 300 && img.width() <= 600 ) {
		img.attr( "src", img.attr("data-med") );
	} else {
		img.attr( "src", img.attr("data-lrg") );
	}
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
		$("img").each( function(i){
			imageResizer( $(this) );
		});
    }
}

// 1.3. OPEN IFRAMES

	// RUN ON RESIZE
function ifrHeight ( target ) {
	console.log("ifrHeight");
	// IF TARGET – ONLY ONE IFRAME
	if (typeof target !== 'undefined') {
		console.log( 220, "one" );
		// GET RATIO AND WIDTH
		var ratio = target.data("ratio"),
			width = target.width();
		target.css( "height", width*ratio );
	} else {
		console.log( 226, "all" );
		// ELSE ALL IFRAMES
		iframe.each( function(){
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
	if (typeof target !== 'undefined') {
		// IF TARGET DEFINED
		// console.log( 269, "Load " +  target);
		$("#" + target).show().addClass("loaded");
	} else {
		// ELSE LOAD NEXT IN LINE
		// console.log( 271, "Load next in line.");
		$(".current").prev().show().addClass("loaded");
	}
}

// 1.5. NAVIGATE TO SECTION



function navToSection ( section ) {
	console.log("navToSection");
	// LOAD RELEVANT SECTION
	contentLoader( "section_" + section );
	// ADD WHEEL_BLOCK CLASS
	$("#wrapper").addClass("wheel_block");
	// RUN BOTTOM NAV CHECK DURING ANIMATION
	var navInterval = 0;
	navInterval = setInterval( function(){
		bottomNavCheck();
	}, 100 );
	// ANIMATE ALL SECTIONS BEFORE
	$("#section_" + section).nextAll().each( function(){
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
	// ADD CURRENT CLASS
	$(".current").removeClass("current");
	$(".previous").removeClass("previous");
	$("#section_" + section).addClass("current").next().addClass("previous");
	// UPDATE DATA-CURRENT
	$("#wrapper").attr("data-current", section);
	// REMOVE WHEEL_BLOCK CLASS + RESET TRANSITIONS
	setTimeout( function(){
		$("#wrapper").removeClass("wheel_block");
		$("section").css("transition","");
		console.log( 308 );
		clearInterval( navInterval );
	}, 1000 );
}


/****************************************************************************
    
	2. NAV

*****************************************************************************/

// 2.1. BOTTOM NAV FIXER

function bottomNavCheck () {
	// console.log("bottomNavCheck");
	// GET HEIGHT OF TOP NAV
	var topMargin = $("#top_header").outerHeight();
	// GET CURRENT TOP POSITION OF BOTTOM NAV
	var bottomTop = Math.floor( $("#bottom_header_unfixed").offset().top );
	// NEED TO LEAVE PLACEHOLDER THAT SCROLLS WITH THE PAGE
	// console.log( 289, bottomTop, topMargin );
	if ( bottomTop <= topMargin ) {
		// console.log("Fix nav.");
		$("#bottom_header").appendTo( $("#bottom_header_fixed") );
	} else {
		// console.log("Unfix nav.");
		$("#bottom_header").appendTo( $("#bottom_header_unfixed") );
	}

	// // CALCULATE MAIN LOGO SEPARATELY
	var logoH = $("#main_logo").outerHeight(),
		logoTop = bottomTop + $("#bottom_header_unfixed").height() - logoH;
		console.log( 311, logoTop, topMargin );
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

}

// 2.2. NAV SECTION HIGHLIGHTER

function navHighlight () {
	// console.log("navHighlight");
	// GET CURRENT
	var currId = parseInt( $("#wrapper").attr("data-current") );
	// RESET SIBLINGS
	$("#bottom_header li").removeClass("highlight");
	// IF NOT HOME LINK
	if ( currId !== 1 ) {
		$("#bottom_header [data-id='" + currId + "']").parent().addClass("highlight");
	}
}

// 2.3. NAV CLICK

function navClick ( targetId ) {
	console.log( "navClick", targetId );
	var currentId = parseInt( $(".current").attr("data-content") );
	// IF TARGET IS VISIBLE
	if ( targetId === currentId ) {
		// SCROLL TO TOP OF CURRENT
		$(".current").animate({ scrollTop: 0 }, 500 );
	// ELSE NAV TO SECTION
	} else {
		console.log("NAV TO SECTION");
	


		// HERE!!!!!





	}
}

/****************************************************************************
    
	3. IMAGE GRIDS

*****************************************************************************/

// 3.1. IMAGE GRID MANAGER

	// GRID MANAGER
	// RUNS ON AJAX LOAD + MEDIA QUERY RESIZE

function gridManager () {
	console.log("gridManager");
	// LOOP THROUGH ALL GRIDS
	$(".current .image_grid").each( function(){
		var cols = $(this).data("col");
		// RESET
		// IS THERE A BETTER WAY THAN REMOVING .GRID_LARGE??
		$(this).find(".clear").remove();
		$(this).find(".grid_large").remove();
		// LOOP THROUGH CELLS 
		var count = 1,
			row = 1,
			totalCells = $(this).find(".image_cell").length;
		console.log( 64, totalCells );
		$(this).find(".image_cell").each( function(){
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
		rowHeight( $(this) );
	});
}

	// ROW HEIGHT

function getCellHeight ( input ) {
	console.log("getCellHeight");
	var thisH = input.find(".image_small").outerHeight();
	if ( thisH > 0 && thisH !== null ) {
		console.log( 84, thisH );
		return thisH;
	} else {
		setTimeout( function(){
			getCellHeight( input );
		}, 500);
	}
}

function getRowHeight ( i ) {
	console.log("getRowHeight");
	var maxHeight = 0;		
	// LOOP THROUGH CELLS
	$( "li[data-row=" + i + "]").each( function(){
		var thisH = getCellHeight( $(this) )
		if ( thisH > maxHeight ) {
			maxHeight = thisH;
		}					
	});
	return maxHeight;
}

function setRowHeight ( i ) {
	console.log("setRowHeight");
	if ( getRowHeight(i) > 0 ) {
		console.log( 119, getRowHeight(i) );
		$( "li[data-row=" + i + "]" ).find(".image_small").css({
			"height" : getRowHeight(i)
		});			
	} else {
		console.log( 124, "Try again." );
		setTimeout( function(){
			setRowHeight(i);	
		}, 500 );
	}
}

function rowHeight ( grid ) {
	console.log("rowHeight");
	grid.imagesLoaded().always( function( instance, image ){
		console.log( 99, "Images loaded." );
		// GET NUMBER OF ROWS
		var rows = parseInt( grid.find(".image_cell:last-child").attr("data-row") ),
			i = 1;
		// console.log( 377, rows, i );			
		// LOOP THROUGH ROWS
		while ( i <= rows ) {
			setRowHeight( i );
			i++;	
		}	
	});

}

// 3.2. IMAGE GRID TOGGLE

function gridOpen ( click ) {
	// CLICK == .IMAGE_SMALL
	console.log("gridOpen");
	var grid = click.parents(".image_grid"),
		img = click.find("img");
	// CALCULATE HOW MANY IMAGES IN ROW
	var rowL = grid.data("col");
	// CLOSE OTHER IMAGES
	grid.find(".grid_large").css({
		"height" : "0"
	});

	// CALCULATE HEIGHT OF GRID_LARGE
	var imgW = parseInt( img.attr("width") ),
		imgH = parseInt( img.attr("height") ),
		colW = parseInt( grid.width() ),
		largeH = imgH / imgW * colW * 0.9;
	if ( img.hasClass("portrait") ) {
		console.log( 162, largeH );
		largeH = largeH * 0.67 + 24;
		console.log( 164, largeH );
	} 

	// CLOSE ANY OPEN IMAGES IN GRID
	// + ADD RESET CLASS
	grid.find(".grid_large").css("height","0").find(".image_wrapper").empty().removeClass("full").addClass("empty");	

	// GIVE HEIGHT TO FOLLOWING GRID_LARGE
	var rowNo = click.parents("li").attr("data-row");
	console.log( 167, rowNo );
	
	grid.find( ".row_" + rowNo ).css({
		"height" : largeH
	});

	// CLONE IMAGE AND APPEND TO FOLLOWING .GRID_LARGE
	img.clone().appendTo( grid.find( ".row_" + rowNo + " .image_wrapper" ) );
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
	home_post.css( "z-index", currZ + 1 ).siblings(".home_multiple_image").css( "z-index", "1" );
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
		var winW = $(window).width(),
			leftMargin = Math.floor( click.position().left / winW * 100 ), 
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
	}, 1000 );
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
	var listTop = $( "#" + thisId ).parents(".list").position().top,
		offset = 120;
	$(".current").animate( { scrollTop: listTop - offset }, 500 );

	// OPEN ANY IFRAMES
	openIframes( click.parents("section").attr("id") );

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
		$(".archive_post").show();
	} else {
		// HIDE ALL POSTS
		$(".archive_post").hide();
		// SHOW ONLY POSTS WITH ID
		$("[data-cat=" + value + "]").show();		
	}
}

// 6.2. COLLECTION PASSWORD

var attempts = 0;
function passCheck () {
	console.log("passCheck");
	// HASH STORED IN HTML
	var hash = $("#password_form").data("hash"),
		// COMPARE AGAINST HASHED VLAUE OF FORM
		value = $.md5( $("#password_input").val() ),
		maxAttempts = 5;
	if ( attempts <= maxAttempts ) {
		if ( hash === value ) {
			console.log("Success.");
			// SUCCESS
				// HIDE FORM
			$("#coll_password").hide();
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
}

// 6.3. COLLECTION FILTER

function collSearch ( input ) {
	// console.log("collFilter", input);
	var listItem = $(".coll_post");
	listItem.each(function(){
		var text = $(this).data("info").toLowerCase();
		if ( text.indexOf(input) !== -1 ) { 
			$(this).show();
		} else {
			$(this).hide();   	
		}       
	});

}

function collFilter ( value ) {
	console.log("archiveFilter");
	console.log( 584, value );
	if ( value === "0" ) {
		console.log("Show all posts.");
		// SHOW ALL POSTS
		$(".coll_post").show();
	} else {
		console.log( "Show only: ", $("[data-type='" + value + "']") );
		// HIDE ALL POSTS
		$(".coll_post").hide();
		// SHOW ONLY POSTS WITH ID
		$("[data-type='" + value + "']").show();		
	}
}
