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

var canShift = true,
	firstShift = true;

function edgeDetect ( e ) {
	console.log("edgeDetect");
	var delta =  e.originalEvent.deltaY, // NEED CROSSBROWSER SOLUTION
		current = $(".current");
	// IF AT TOP AND SCROLLING UP
	if ( current.scrollTop() === 0 && delta < 0 ) {
		if ( canShift ) {
			// CHECK IF NOT FIRST SECTION
			if ( parseInt( current.attr("data-content") ) !== 1 ) {
				// SCROLL TO BOTTOM OF PREVIOUS CONTENT
				var previous = $(".previous .content_wrapper"),
					target = previous.innerHeight() - $(window).height();
				previous.parent().animate({ scrollTop: target }, 100);
				shiftDown();				
			}
		}
	// ELSE IF AT BOTTOM AND SCROLLING DOWN
	} else if ( current.scrollTop() + current.innerHeight() >= current[0].scrollHeight - 10 && delta > 0 ) {
		console.log( 46, current.scrollTop(), current[0].scrollHeight, canShift );
		if ( canShift ) {
			// IF FIRST TIME
			// WHY HERE IF IN SHIFTUP??
			// if ( firstShift ) {
			// 	bottomNavInit();
			// 	firstShift = false;
			// }
			// CHECK IF NOT LAST SECTION
			if ( parseInt( current.attr("data-content") ) !== 6 ) {
				shiftUp();				
			}
		}
	}
}

	// UP

function shiftUp () {
	console.log("shiftUp");
	// BLOCK SHIFTUP
	canShift = false;
	// IF FIRST TIME
	console.log( 72, firstShift );
	if ( firstShift ) {
		bottomNavInit();
		firstShift = false; 
	}
	// TEMPORARILY PAUSE MOUSE EVENTS DURING ANIMATION
	$("#wrapper").css("pointer-events","none");
	setTimeout( function(){ $("#wrapper").css("pointer-events","") }, 1000);
	// PREVIOUS BECOMES NEXT – MOVES TO FRONT
	$(".previous").removeClass("previous").addClass("temp-previous");
	$(".current").removeClass("current").addClass("previous");
	$(".next").removeClass("next").addClass("current");
	$(".temp-previous").removeClass("temp-previous").addClass("next");	
	// SCROLL TO TOP OF NEXT CONTENT
	$(".next").animate({ scrollTop: 0 }, 100 );
	// CONTENT LOADER
	contentLoader();
	// UNBLOCK SHIFTUP
	setTimeout( function(){	
		canShift = true;
	}, 1000 );
	// HIGHLIGHT CURRENT
	navHighlight();
}

	// DOWN

function shiftDown () {
	// BLOCK SHIFTDOWN
	canShift = false;
	console.log("shiftDown");
	// GET CURRENT DATA-CONTENT
	var current = parseInt( $(".current").attr("data-content") );
	if ( current === 2 ) {
		// RESET BOTTOM NAV
		bottomNavReset();
	}
	// TEMPORARILY PAUSE MOUSE EVENTS DURING ANIMATION
	$("#wrapper").css("pointer-events","none");
	setTimeout( function(){ $("#wrapper").css("pointer-events","") }, 1000);
	// NEXT BECOMES PREVIOUS – MOVES TO BACK
	$(".next").removeClass("next").addClass("temp-next");
	$(".current").removeClass("current").addClass("next");
	$(".previous").removeClass("previous").addClass("current");
	// TEMPORARILY PAUSE TRANSITIONS
	$(".temp-next").css({
		"transition" : "top 0s",
		"top" : "-100vh"
	});
	setTimeout( function(){
		$(".temp-next")	.removeClass("temp-next").addClass("previous").css({
			"transition" : "",
			"top": ""
		});
		// CONTENT LOADER
		contentLoader();
	}, 100 );
	// UNBLOCK SHIFTDOWN
	setTimeout( function(){
		canShift = true;
	}, 1000 );
	// HIGHLIGHT CURRENT
	navHighlight();
}

// 1.2. CONTENT LOADER

function homeStore ( section ) {
	console.log("homeStore", section);
	// // GET HOME CONTENT
	// setTimeout( function(){
	// 	$("#wrapper").find(".initial_wrapper").hide();
	// }, 1000 );
}

function contentLoader ( target, where ) {
	console.log("contentLoader");
	target = target || 0,
	where = where || 0;
	// NO INPUT – LOAD NEXT AND PREVIOUS
	if ( target === 0 ) {
		// CHECK WHAT IS IN WRAPPERS
		var curr = parseInt( $(".current").attr("data-content") ),
			next = parseInt( $(".next").attr("data-content") ),
			prev = parseInt( $(".previous").attr("data-content") ),
			toLoad;
		// LOAD CURR + 1 IN NEXT
		if ( next !== ( curr + 1 ) && curr <= 6 ) {
			toLoad = curr + 1;
			console.log("Load in next.", toLoad );
			// EMPTY NEXT
			$(".next .content_wrapper").empty();
			// LOAD CURR + 1 IN NEXT
			$("#content_" + toLoad + " .wrapper").clone().appendTo( ".next .content_wrapper" );
			$(".next").attr("data-content", toLoad );
		}
		// LOAD CURR - 1 IN PREV
		if ( prev !== ( curr - 1 ) && curr > 1 ) {
			toLoad = curr - 1;
			console.log("Load in previous.", toLoad );
			// EMPTY PREVIOUS
				// CHECK IF HOME SECTION
			homeStore( $(".previous") );
			$(".previous .content_wrapper").empty();
			// IF HOME
			if ( toLoad === 1 ) {
				console.log( 174, "Load home." );
				$("#wrapper").find(".initial_wrapper").appendTo(".previous").show();
			}
			// LOAD CURR - 1 IN PREVIOUS
			$("#content_" + toLoad + " .wrapper").clone().appendTo( $(".previous .content_wrapper") );
			$(".previous").attr("data-content", toLoad );
		}
	} else {
		console.log( 151, target, where );
		// EMPTY WHERE
		var targetWrapper = $("." + where).find(".content_wrapper");
			// CHECK IF HOME SECTION
		homeStore( targetWrapper );
		targetWrapper.empty();
		// LOAD TARGET
		$("#content_" + target + " .wrapper").clone().appendTo( targetWrapper );
		$("." + where).attr("data-content", target );
		// TRIGGER ANIMATION
		if ( where === "next" ) {
			shiftUp();
		} else {
			shiftDown();
		}
	}
	// TMP – NECESSARY???
	gridManager();
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

function bottomNavInit () {
	console.log("bottomNavInit");
	// GET HEIGHT OF TOP NAV
	var topMargin = $("#top_header").outerHeight();
	// GET CURRENT TOP OFFSET OF BOTTOM NAV
	var bottomTop = $("#bottom_header").offset().top;; 
	// CALCULATE MAIN LOGO SEPARATELY
	var logoTop = $("#main_logo").offset().top;
	// SET TOP AND THEN ANIMATE
	$("#bottom_header").css( "top", bottomTop );
	$("#main_logo").css( "top", logoTop );
	setTimeout( function(){
		$("#bottom_header").css({
			"top" : topMargin,
			"padding-top" : "2px" 
		});
		$("#main_logo").css({
			"top" : topMargin - 8, 
			"bottom" : "initial"
		});		
	}, 0 );
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
