/************************************************

    CONTROLLER

************************************************/

function onYouTubeIframeAPIReady() {
		
	console.log("onYouTubeIframeAPIReady");
	
	// GET VIDEO ID
	var vidId = $("#player").attr("data-id"),
		player = new YT.Player("player", {
			height: '390',
			width: '640',
			videoId: vidId,
			events: {
				'onReady': controllerHome.onPlayerReady,
				'onStateChange': controllerHome.onPlayerStateChange,
				'onError': controllerHome.onPlayerError
			},
			playerVars: {
	        	playlist: vidId,
	        	loop: 1
	      	}
		});

	// BIND EVENTS
	$("#home_video_button .pause").on("click", function(){
		pauseVideo();
	});

}

var controllerHome = {

	init: function () {

		console.log("controllerHome.ifnit");

		// IF VIDEO VISIBLE
		if ( $("#player").length ) {
			this.loadVideo();
		// IF IMAGES VISIBLE
		} else if ( $("#home_slideshow").length ) {
			// INITIATE SLIDESHOW
			this.slideInit();
		}
		// SHOW TEXT
		viewHome.textInit();

	}, 

	slideInit: function () {

		console.log("controllerHome.slideInit");

		// LOAD FIRST TWO IMAGES
		controllerPage.imageCalc( $("#home_slideshow").find(".visible") );
		controllerPage.imageCalc( $("#home_slideshow").find(".visible").next() );

		// BIND CLICK EVENT
		$(".arrow a").fadeIn().on("click", function(e){
			e.preventDefault();
			if ( $(this).parent().attr("id") === "right_arrow" ) {
				viewHome.slide("right");
			} else {
				viewHome.slide("left");
			}
		});

	},

	homeLinkOpen: function ( click ) {
		
		console.log("controllerHome.homeLinkOpen");

		var link = click.parents(".home_text").data("link"),
			section = link.split("_")[1],
			post = link.split("_")[2];
		// SCROLL TO SECTION
		controllerPage.navToSection( section );
		// AFTER 1 SECOND SCROLL TO POST
		setTimeout( function(){
			// TRIGGER CLICK ON BANNER LINK
			$("[data-link="+post+"]").trigger("click");
		}, 1000 );

	},

	onPlayerReady: function (event) {

		console.log("onPlayerReady");

		event.target.playVideo();
		event.target.mute();

	},

	onPlayerStateChange: function (event) {

		console.log("onPlayerStateChange");
		
		if ( event.data == YT.PlayerState.PLAYING ) {
			playVideo();
		}

	},

	onPlayerError: function (argument) {
		
		console.log("onPlayerError");

	},

	playVideo: function () {

		console.log("playVideo");

		// MAKE IFRAME FIT TO SCREEN
		$("#player").removeClass("paused").fadeIn();
		// SHOW BUTTON
		$("#home_video_button").find("play").hide();
		$("#home_video_button").find("pause").show();
		$("#home_video_button").fadeIn();

	},

	pauseVideo: function  () {

		console.log("pauseVideo");

		player.pauseVideo();
		// HIDE BUTTON
		$("#home_video_button").fadeOut();
		$("#home_video_button").find("pause").hide();
		$("#home_video_button").find("play").show();
		// MAKE IFRAME SMALLER
		$("#player").addClass("paused");

	},

	loadVideo: function () {

		console.log("controllerHome.loadVideo");

		// CHECK IF HOME_VIDEO DIV
		if ( $("#player").length ) {
			// LOAD THE IFRAME PLAYER API CODE ASYNCHRONOUSLY
			var tag = document.createElement('script');
			tag.src = "https://www.youtube.com/iframe_api";
			var firstScriptTag = document.getElementsByTagName('script')[0];
			firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
		} // END OF IF #PLAYER CHECK

	}

}

/************************************************

    VIEW

************************************************/

var viewHome = {

	slide: function ( direction ) {

		console.log( "viewHome.slide", direction );

		var gallery = $("#home_slideshow"),
			current = gallery.find(".visible"),
			target = current.next(),
			nextTarget;
		if ( direction === "left" ) {
			target = current.prev();
		} 
		// CHECK IF TARGET EXISTS
		if ( target.length === 0 ) {				
			if ( direction === "left" ) {
				target = gallery.find("li:last-child");
			} else {
				target = gallery.find("li:first-child");				
			}		
		}
		// MAIN ACTION
		current.removeClass("visible");
		target.addClass("visible");

		// LOAD NEXT TARGET
		if ( direction === "right" ) {
			nextTarget = $(".visible").next();
		} else {
			nextTarget = $(".visible").prev();
		}
		controllerPage.imageCalc( nextTarget );

	},

	textInit: function () {

		if ( $(window).width() > 500 ) {
			// GET WIDTH OF TEXT BLOCK
			var textW = $(".home_text").css("width"); // IN PIXELS
			// CALC RANDOM LEFT PERCENTAGE
			var leftPos = Math.random() * ( 1 - ( parseInt(textW) / $(window).width() ) ) * 100,
				topPos = Math.floor( Math.random() * 62 ) + 5;
			$(".home_text").css({
				"left" : leftPos + "%",
				"top" : topPos + "%"
			}).fadeIn();
		} else {
			$(".home_text").fadeIn();		
		}
		// BIND CLOSE FUNCTION
		$(".home_close").on( "click", function(){
			$(".home_text").hide();
		});	
		// BIND LINK FUNCTION
		$(".text_link a").on( "click", function(e){
			// IF NO EXTERNAL LINK
			console.log($(this).attr("href"));
			if ( $(this).attr("href") === "" ) {
				e.preventDefault();
				controllerHome.homeLinkOpen( $(this) );
			}
		});	
	}

}

