/****************************************************************************
    
	FUNCTIONS
		1.	 GENERAL
			1.1. NAVIGATING BETWEEN SECTIONS
			1.2. CONTENT LOADER
		2. 	NAV

		3.	IMAGE GRIDS

		4. SECTIONS
			4.1. HOME
			4.X. COLLECTION


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
			if ( direction === "up" ) {
				$(".current").removeClass("current").prev().addClass("current").removeClass("scroll_block"); 
				$(".previous").removeClass("previous");
				$(".current").next().addClass("previous");				
			} else if ( direction === "down" ) {
				$(".current").removeClass("current")
				$(".previous").removeClass("previous").addClass("current").removeClass("scroll_block");
				$(".current").next().addClass("previous");
			}
			// UPDATE CURRENT SECTION STORED IN WRAPPER
			var curr = $(".current").attr("data-content");
			console.log( 49, curr );
			$("#wrapper").attr( "data-current", curr );
			// UNBLOCK FUNCTION
			switchBlock = true;
		}
	}

	function _scrollDown(delta) {
		console.log("_scrollDown", $("#wrapper").attr("data-current"));

		var current = $(".current"),
			winH = $(window).height(),
			currTop = parseInt( current.css('transform').split(',')[5] ),
			currH = $(".current").outerHeight(),
			multiple = 1,
			newTop = currTop - ( delta * multiple );
			// console.log( newTop );

		// ADD SCROLL_BLOCK CLASS
		current.addClass("scroll_block");

		// console.log( 65, currH + currTop );

		// IF VISIBLE
		if ( currH + currTop >= 40 ) {
			// console.log( 70, currH + currTop, currTop, delta );
			current.css({
				"-webkit-transform" : "translateY(" + newTop + "px)",
  					"-ms-transform" : "translateY(" + newTop + "px)",
						"transform" : "translateY(" + newTop + "px)"
			});
		} else {			
			// SWITCH CLASSES
			_switchClasses("up");
		}

	}

	var wheelBlock = false;
	function _scrollUp(delta) {
		console.log("_scrollUp", $("#wrapper").attr("data-current"));

		var current = $(".current"),
			currTop = parseInt( current.css('transform').split(',')[5] ),
			currH = $(".current").outerHeight(),
			multiple = 1;
		console.log( 91, "currTop: ", currTop, "currScrollTop: ", current.scrollTop() )

		console.log("Scrolling up.");
		// CHECK IF CURRENT TOP > 0
		if ( currTop < 0 && !wheelBlock ) {
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
			console.log( 126, "Remove scroll_block class." );
			current.removeClass("scroll_block");

			// IF CURRENT SCROLLTOP IS 0 AND WRAPPER DATA-CURRENT IS NOT 1
			// SWITCH CLASSES + ANIMATE

			if ( current.scrollTop() <= 10 && $("#wrapper").attr("data-current") != 1 ) {
				if ( !wheelBlock ) {
					console.log( 110, "Animate" );
					// BLOCK SCROLLING
					wheelBlock = true;
					console.log("Wheel blocked.");
					// SWITCH CLASSES
					_switchClasses("down");
					$(".current").css({
								"transition": "transform 2s",
						"-webkit-transform" : "",
			      			"-ms-transform" : "",
								"transform" : ""			
					});
					setTimeout( function(){
						wheelBlock = false;
						console.log("Wheel unblocked.");
						$(".current").css({
								"transition": "transform 1s"		
						});

					}, 2000 );
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
			// IF CURRENT AT TOP 
			if ( current.scrollTop() <= 20 ) {
				_scrollUp(delta);
			} else {
				console.log("Normal scrolling.");
				// ALLOW CURRENT TO SCROLL NORMALLY
				current.removeClass("scroll_block");				
			}
		}

	}

// 1.3. IMAGE MANAGER

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


/****************************************************************************
    
	2. NAV

*****************************************************************************/

function bottomNavCheck () {
	// console.log("bottomNavCheck");
	// GET HEIGHT OF TOP NAV
	var topMargin = $("#top_header").outerHeight();
	// GET CURRENT TOP POSITION OF BOTTOM NAV
	var bottomTop = Math.floor( $("#bottom_header_unfixed").offset().top );
	console.log("bottomNavCheck", 217, topMargin, bottomTop);
	// NEED TO LEAVE PLACEHOLDER THAT SCROLLS WITH THE PAGE

	if ( bottomTop <= topMargin ) {
		console.log("Fix nav.");
		$("#bottom_header").appendTo( $("#bottom_header_fixed") );
	} else {
		console.log("Unfix nav.");
		$("#bottom_header").appendTo( $("#bottom_header_unfixed") );
	}

	// // CALCULATE MAIN LOGO SEPARATELY
	// var logoTop = $("#main_logo").offset().top;
	// // SET TOP AND THEN ANIMATE
	// $("#bottom_header").css( "top", bottomTop );
	// $("#main_logo").css( "top", logoTop );
	// setTimeout( function(){

	// 	$("#main_logo").css({
	// 		"top" : topMargin - 8, 
	// 		"bottom" : "initial"
	// 	});		
	// }, 0 );
}

function bottomNavReset () {
	console.log("bottomNavReset");
	// CALCULATE BOTTOM
	var currBottom = $(window).height() - ( $("#bottom_header").offset().top + $("#bottom_header").outerHeight() );
	// CALCULATE MAIN LOGO SEPARATELY
	var logoBottom = $(window).height() - ( $("#main_logo").offset().top + $("#bottom_header").outerHeight() );
	// SET BOTTOM AND THEN ANIMATE
	$("#bottom_header").css( "bottom", currBottom );
	$("#main_logo").css( "bottom", logoBottom );
	setTimeout( function(){
		$("#bottom_header").css({
			"top" : "",
			"padding-top" : "",
			"bottom" : "" 
		});
		$("#main_logo").css({
			"top" : "", 
			"bottom" : ""
		});		
	}, 50 );
	firstShift = true;
}

function navHighlight () {
	console.log("navHighlight");
	// GET CURRENT
	var currId = parseInt( $(".current").attr("data-content") );
	// console.log( 241, currId );
	// RESET SIBLINGS
	$("#bottom_header li").removeClass("highlight");
	// IF NOT HOME LINK
	if ( currId !== 1 ) {
		$("#bottom_header [data-id='" + currId + "']").parent().addClass("highlight");
	}
}

function navClick ( targetId ) {
	console.log( "navClick", targetId );
	var currentId = parseInt( $(".current").attr("data-content") );
	// IF TARGET IS VISIBLE
	if ( targetId === currentId ) {
		// SCROLL TO TOP OF CURRENT
		$(".current").animate({ scrollTop: 0 }, 500 );
	// IF LOADED IN NEXT
	} else if ( targetId === currentId + 1 ) {
		// SHIFTUP TO NEXT
		shiftUp();
	// ELSE IF LOADED IN PREVIOUS
	} else if ( targetId === currentId - 1 ) {
		// SHIFTDOWN TO PREV
		shiftDown();
	// ELSE LOAD CONTENT
	} else {
		if ( targetId > currentId + 1 ) {
			// IF TARGET HIGHER THAN CURRENT LOAD IN NEXT
			console.log("Load content in next.");
			contentLoader( targetId, "next" );
		} else if ( targetId < currentId - 1 ) {
			// ELSE LOAD IN PREVIOUS
			console.log("Load content in previous.");
			contentLoader( targetId, "prev" );			
		}		
	}
}

/****************************************************************************
    
	3. IMAGE GRIDS

*****************************************************************************/

// 1.2. IMAGE GRID MANAGER

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

// 1.3. IMAGE GRID TOGGLE

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
    
	4. SECTIONS

*****************************************************************************/

// 4.1. HOME

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
		thisTop = heightArray[i];	
		// console.log( 480, i, thisTop, thisLeft );
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

	// MASONRY INIT

// function masonryInit () {
// 	$('#home_multiple_images').masonry({
// 		itemSelector: '.home_multiple_image',
// 		gutter: 60
// 	});
// }

	// HOME IMAGES HOVER

function homeHover ( home_post ) {
	console.log("homeHover");
	var currZ = parseInt( home_post.css("z-index") );
	home_post.css( "z-index", currZ + 1 ).siblings(".home_multiple_image").css( "z-index", "1" );
}

	// HOME IMAGES CLICK

function homeClick ( click ) {
	console.log("homeClick");
	var link = click.data("link");
	// CLOSE ANY OTHER OPEN TEXT BLOCKS
	$(".home_text").hide();
	// IF NO TEXT BLOCK
	if ( !click.siblings(".home_text").length ) {
		console.log("No text block.", link);
		// SCROLL DOWN TO LINK
		homeLinkOpen(link);
		return;
	}
	// CHECK WHICH SIDE OF IMAGE THERE IS THE MOST SPACE
	var winW = $(window).width(),
		leftMargin = Math.floor( click.position().left / winW * 100 ), // PERCENTAGE
		imgW = Math.floor( click.width() / winW * 100 ), // PERCENTAGE
		rightMargin = 100 - ( leftMargin + imgW ), // PERCENTAGE
		leftPos,
		topPos = Math.random() * 67;
	console.log( 525, imgW, leftMargin, rightMargin );
	if ( leftMargin > rightMargin ) {
		console.log("LEFT", rightMargin);
		// SHOW ON LEFT
			// IF MARGIN BIGGER THAN TEXT BLOCK – CENTER
		if ( leftMargin > imgW ) {
			// CENTRE ON LEFT
			leftPos = ( leftMargin - imgW ) / 2;
		} else {
			// STICK TO LEFT
			leftPos = 0;
		}
	} else {
		console.log("RIGHT");
		// SHOW ON RIGHT
			// IF MARGIN BIGGER THAN TEXT BLOCK – CENTER
		if ( rightMargin > click.width() ) {
			// CENTRE ON RIGHT
			leftPos = 100 - ( ( rightMargin - imgW ) / 2 ) - imgW;
		} else {
			// STICK TO RIGHT
			leftPos = 100 - rightMargin;
		}
	}
	console.log( 548, leftPos );
	click.siblings(".home_text").css({
		"display" : "block",
		"left" : leftPos + "%",
		"top" : topPos + "%"
	});
}

function homeLinkOpen ( link ) {
	console.log("homeLinkOpen");
	if ( link.substring(0,3) === "int" ) {
		// GET SECTION AND POST TO SCROLL TO
		var section = link.split("_")[1],
			post = link.split("_")[2],
			targetId;
		switch ( section ) {
			case "publications":
				targetId = 3;
				break;
			case "exhibitions":
				targetId = 4;
				break;
			case "news":
				targetId = 5;
				break;
		}
		// NAVIGATE TO SECTION
		contentLoader( targetId, "next" );
		// SCROLL TO POST
			
	} else if ( link.substring(0,4) === "http" ) {
		console.log("external");		
	}
}

// 4.2. PUBLICATIONS LINK

function bannerLink ( click ) {
	// CLICK = A.BANNER_LINK
	console.log("bannerLink");
	var thisId = click.data("link");
	console.log( 480, thisId );
	// HIDE OTHER PUBLICATIONS
	$( ".list_post" ).hide().removeClass("selected");
	// SHOW SELECTED PUBLICATION
	$( "#" + thisId ).show().addClass("selected");
	// ANIMATE PARENT HEIGHT
	var thisH = $( "#" + thisId ).height();
	$( "#" + thisId ).parents(".list").css( "height", thisH );
	// SCROLL TO SELECTED POST
	var listTop = $( "#" + thisId ).parents(".list").position().top,
		offset = 120;
	$(".current").animate( { scrollTop: listTop - offset }, 500 );
}

// 4.3. ARCHIVE FILTER

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

// 4.3. COLLECTION

	// PASSWORD FORM

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

	// COLLECTION FILTER

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



/****************************************************************************
    
	5.

*****************************************************************************/
