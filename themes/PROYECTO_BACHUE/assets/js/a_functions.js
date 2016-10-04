/****************************************************************************
    
	FUNCTIONS
		1.	 GENERAL
			1.1. NAVIGATING BETWEEN SECTIONS
			1.2. CONTENT LOADER
		2. 	NAV

		3.	 NEWS


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
		console.log( 46, current.scrollTop(), current[0].scrollHeight );
		if ( canShift ) {
			// IF FIRST TIME
			if ( firstShift ) {
				bottomNavInit();
				firstShift = false;
			}
			// CHECK IF NOT LAST SECTION
			if ( parseInt( current.attr("data-content") ) !== 6 ) {
				shiftUp();				
			}
		}
	}
}

	// UP

function shiftUp () {
	// BLOCK SHIFTUP
	canShift = false;
	console.log("shiftUp");
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
	}, 2000 );
	// HIGHLIGHT CURRENT
	navHighlight();
}

	// DOWN

function shiftDown () {
	// BLOCK SHIFTDOWN
	canShift = false;
	console.log("shiftDown");
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
	}, 2000 );
	// HIGHLIGHT CURRENT
	navHighlight();
}

// 1.2. CONTENT LOADER

function contentLoader ( target, where ) {
	console.log("contentLoader");
	target = target || 0,
	where = where || 0;
	if ( target === 0 ) {
		// console.log( 129, target );
		// CHECK WHAT IS IN WRAPPERS
		var curr = parseInt( $(".current").attr("data-content") ),
			next = parseInt( $(".next").attr("data-content") ),
			prev = parseInt( $(".previous").attr("data-content") ),
			toLoad;
		console.log( 141, prev, $(".previous").attr("data-content"), curr, next );
		setTimeout( function(){
			console.log( 143, prev, $(".previous").attr("data-content"), curr, next );
		}, 1000 );
		if ( next !== ( curr + 1 ) && curr <= 6 ) {
			toLoad = curr + 1;
			console.log("Load in next.", toLoad );
			// EMPTY NEXT
			$(".next .content_wrapper").empty();
			// LOAD CURR + 1 IN NEXT
			$("#content_" + toLoad + " .wrapper").clone().appendTo( ".next .content_wrapper" );
			$(".next").attr("data-content", toLoad );
		}
		if ( prev !== ( curr - 1 ) && curr > 1 ) {
			var toLoad = curr - 1;
			console.log("Load in previous.", toLoad );
			// EMPTY PREVIOUS
			$(".previous .content_wrapper").empty();
			// LOAD CURR - 1 IN PREVIOUS
			$("#content_" + toLoad + " .wrapper").clone().appendTo( $(".previous .content_wrapper") );
			$(".previous").attr("data-content", toLoad );
		}
	} else {
		console.log( 151, target, where );
		// EMPTY WHERE
		var targetWrapper = $("." + where).find(".content_wrapper");
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
}


/****************************************************************************
    
	2. NAV

*****************************************************************************/

function bottomNavInit () {
	console.log("bottomNavInit");
	// GET HEIGHT OF TOP NAV
	var topMargin = $("#top_header").outerHeight();
	// GET CURRENT TOP OFFSET OF BOTTOM NAV
	var bottomTop = $("#bottom_header").offset().top;
	// console.log( 154, topMargin, bottomTop ); 
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

function navHighlight () {
	// console.log("navHighlight");
	// GET CURRENT
	var currId = parseInt( $(".current").attr("data-content") );
	// RESET SIBLINGS
	$("#bottom_header li").removeClass("highlight");
	$("#bottom_header [data-id='" + currId + "']").parent().addClass("highlight");
}

function navClick ( targetId ) {
	console.log( "navClick", targetId );
	var currentId = parseInt( $(".current").attr("data-content") );
	// IF FIRST TIME
	if ( firstShift ) {
		bottomNavInit();
		firstShift = false;
	}
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
    
	3. NEWS

*****************************************************************************/
