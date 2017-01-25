var controllerHome = {

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

	onYouTubeIframeAPIReady: function () {
		
		console.log("onYouTubeIframeAPIReady");
		
		// GET VIDEO ID
		var vidId = $("#player").attr("data-id"),
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

		// BIND EVENTS
		$("#home_video_button .pause").on("click", function(){
			pauseVideo();
		});

	},

	onPlayerReady: function (event) {

		event.target.playVideo();
		event.target.mute();

	},

	onPlayerStateChange: function (event) {
		
		if ( event.data == YT.PlayerState.PLAYING ) {
			playVideo();
		}

	},

	playVideo: function () {

		console.log("playVideo");

		// MAKE IFRAME FIT TO SCREEN
		$("#player").removeClass("paused");
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

}