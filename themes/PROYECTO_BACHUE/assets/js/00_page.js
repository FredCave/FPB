/************************************************

    CONTROLLER

************************************************/

var navInterval,

	timerRunning = false;

var controllerPage = {

	currentSection: 1,

	wheelBlock: false,

	passAttempts: 0,

	pageInit: function () {

		console.log("controllerPage.pageInit");

		// PAGE INIT
		viewPage.init();
		// LINKS INIT
		this.linksInit();
		// SECTIONS INIT
		controllerHome.init();
		controllerSections.sectionsInit();
		this.sectionCheck();
		// TOUCH SCREEN CHECK
		controllerMobile.touchScreenCheck();

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

		return this.currentSection;

	},

	updateCurrent: function ( newCurrent ) {

		console.log( "controllerPage.updateCurrent", newCurrent );

		if ( $.isNumeric( newCurrent ) ) {
 			this.currentSection = newCurrent;
		}

	},

	getWheelBlock: function () {

		return this.wheelBlock;

	},

	toggleWheelBlock: function () {

		this.wheelBlock = !this.wheelBlock;

	},

	navFixManager: function () {

		console.log("controllerPage.navFixManager");

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
			if ( logoTop <= topMargin + 30 ) {
				viewPage.logoFix();
			} else {
				viewPage.logoUnfix();
			}

		} else {
			viewPage.navFix( topMargin );
		}

	},

	scrollManager: function ( delta ) {

		console.log( "controllerPage.scrollManager", $(".current"), this.getCurrent(), delta );

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

		console.log("controllerPage.scrollDown");

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

		console.log( "controllerPage.scrollUp", $(".current").css('transform') );

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

		console.log("controllerPage.switchClasses");

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

		console.log( "controllerPage.navToSection", section );

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
		// LOAD NEXT FUNCTION
		viewPage.contentReveal();

	},

	imageManager: function ( section ) {

		console.log("controllerPage.imageManager");

		// LOOP THROUGH IMAGES
		section.find("img").each( function(i){
			controllerPage.imageCalc( $(this) );
		});

	},

	imageCalc: function ( image ) {
	
		console.log("controllerPage.imageCalc");

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
			viewPage.imageRender( img, newSrc );
		} 
	},

	sectionCheck: function () {
	
		$("section").on( "click", function( click ){
			
			// IF NOT MENU
			if ( !$(click.target).parents("#bottom_header_unfixed") ) {
	
				console.log( "controllerPage.sectionCheck", $(click.target) ); 

				// IF CLICKED SECTION DOES NOT EQUAL CURRENT
				if ( parseInt( $(click.target).parents("section").attr("data-content") ) !== controllerPage.getCurrent() ) {
					if ( $.isNumeric( parseInt( $(click.target).parents("section").attr("data-content") ) ) ) {
						controllerPage.navToSection( parseInt( $(click.target).parents("section").attr("data-content") ) );
					}
				}	

			}
	
		});

	}


}

/************************************************

    VIEW

************************************************/

var viewPage = {

	init: function () {

		// SCROLL TO TOP
		$("html,body").animate({
			scrollTop : 0
		}, 500 );

		this.touchInit();
		this.navInit();
		// LOAD SECTION 2
		this.contentReveal( $("#section_2") );

	},

	contentReveal: function ( target ) {

		if ( typeof target !== 'undefined' ) {
			target.show().addClass("loaded");
			// imageManager();
		} else {
			$(".current").next().show().addClass("loaded");
			// imageManager();
		}
		
	},

	navHighlight: function () {

		console.log( "viewPage.navHighlight" );
		
		(_.throttle(function(){
			
			// RESET SIBLINGS
			$("#bottom_header a").removeClass("highlight");
			
			if ( controllerPage.getCurrent() !== 1 ) {

				var current = $(".current"),
					currentId = parseInt( controllerPage.getCurrent() );
				
				// IF LESS THAN 140px FROM TOP OF SCREEN – HIGHLIGHT NEXT
				if ( $(window).height() + parseInt( current.css('transform').split(',')[5] ) < 140 ) {
					$("#bottom_header [data-id='" + ( currentId + 1 ) + "']").addClass("highlight");
				} else {
					$("#bottom_header [data-id='" + currentId + "']").addClass("highlight");
				}
				
			}
		}, 500))();

	},		

	touchInit: function () {

		console.log("viewPage.touchInit");

		$("html,body").on("mousewheel wheel DOMMouseScroll", function(e){
			if ( !$("#wrapper").hasClass("wheel_block") ) {
				var delta = e.originalEvent.deltaY;
				controllerPage.scrollManager(delta);
			}
			viewPage.navHighlight();
		});

	},

	scrollBlock: function ( section ) {

		section.addClass("scroll_block");

	},

	scrollUnblock: function ( section ) {

		section.removeClass("scroll_block");

	},

	currentTransform: function ( newTop ) {

		$(".current").css({
			"-webkit-transform" : "translateY(" + newTop + "px)",
				"-ms-transform" : "translateY(" + newTop + "px)",
					"transform" : "translateY(" + newTop + "px)"
		});

	},

	multipleTransform: function ( section, direction ) {

		console.log( "viewPage.multipleTransform", section, direction);

		// RUN BOTTOM NAV CHECK DURING ANIMATION

		// STOP TWO TIMERS RUNNING
		
		if ( !timerRunning ) {
			navInterval = setInterval( function(){
				timerRunning = true;
				console.log( 445, navInterval );
				controllerPage.navFixManager();
				
				viewPage.navHighlight();

			}, 100 );
		}



		// ADD WHEEL_BLOCK CLASS
		controllerPage.toggleWheelBlock();

		var sections = $("#section_" + section).prevAll();
		if ( direction === "next" ) {
			sections = $("#section_" + section).nextAll().andSelf();
		}

		// REVEAL TARGET SECTION FIRST
		viewPage.contentReveal( $("#section_" + section) );

		sections.each( function(){
			
			// LOAD CONTENT
			viewPage.contentReveal( $(this) );

			var thisH = 0 - $(this).outerHeight();
			// IF NEXT THISH === 0
			if ( direction === "next" ) {
				thisH = 0;
			}
			$(this).css({
				"transition"		: "transform 1s",
				"-webkit-transform" : "translateY(" + thisH + "px)",
	      			"-ms-transform" : "translateY(" + thisH + "px)",
						"transform" : "translateY(" + thisH + "px)",
				"display"			: "block"		
			});
		});

		// REMOVE WHEEL_BLOCK CLASS + RESET TRANSITIONS
		setTimeout( function(){
			
			console.log("clearInterval", navInterval);
			clearInterval( navInterval );
			timerRunning = false;
			
			controllerPage.toggleWheelBlock();
			$("section").css("transition","");
			
		}, 1000 );

	},

	switchNext: function () {

		$(".current").removeClass("current").next().addClass("current").removeClass("scroll_block"); 
		$(".previous").removeClass("previous");
		$(".current").prev().addClass("previous");

	},

	switchPrev: function () {

		$(".current").removeClass("current")
		$(".previous").removeClass("previous").addClass("current").removeClass("scroll_block");
		$(".current").prev().addClass("previous");

	},

	switchTarget: function ( target ) {

		$(".current").removeClass("current");
		$(".previous").removeClass("previous");
		$("#section_" + target).addClass("current").prev().addClass("previous");

	},

	navFix: function () {

		$("#bottom_header").appendTo( $("#bottom_header_fixed") );

	}, 

	navUnfix: function () {

		$("#bottom_header").appendTo( $("#bottom_header_unfixed") );

	},

	logoFix: function ( topMargin ) {

		$("#main_logo").appendTo( $("#bottom_header_fixed") ).css({
			"position" : "fixed",
			// "top" : topMargin + 30, 
			"bottom" : "initial"
		});			

	}, 

	logoUnfix: function () {

		$("#main_logo").appendTo( $("#bottom_header_unfixed") ).css({
			"position" : "",
			"top" : "", 
			"bottom" : ""
		});	

	},

	navInit: function () {

		$("#bottom_header a").on("click", function(e){
			e.preventDefault();
			viewPage.navClickHandler( $(this).data("id") );
		});

	},

	navClickHandler: function ( targetId ) {

		// if ( $("body").hasClass("mobile") ) {
		// 	// IF TOUCH
		// 	navClickMobile( targetId );
		// }

		console.log("navClickHandler");

		// IF TARGET IS VISIBLE
		if ( targetId === controllerPage.getCurrent() ) {
			// SCROLL TO TOP OF CURRENT
			$(".current").animate({ scrollTop: 0 }, 500 );
		// ELSE NAV TO SECTION
		} else {
			controllerPage.navToSection( targetId );
		}
	
	},

	scrollToTarget: function ( target, delay ) {

		console.log( "viewPage.scrollToTarget" );

		setTimeout( function(){

			var extraH = 0;
			if ( $(target).parents(".list").length ) {
				extraH = $(target).parents(".list").position().top;
			} else if ( $("#coll_filter").length ) {
				extraH = $("#coll_list").position().top;
			}
			var targetTop = $(target).position().top + extraH,
				offset = $("#top_header").outerHeight() + $("#bottom_header").outerHeight() + 20;
			$(".current").animate( { scrollTop: targetTop - offset }, 500 );	

			console.log( 590, targetTop, $(target).position().top, extraH );

		}, delay );

	},

	currentScrollToTop: function () {

		console.log("viewPage.currentScrollToTop");

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

	},

	imageRender: function ( image, src ) {

		// IF BG IMAGE
		if ( image.hasClass("bg_image") ) {
			var bgSrc = "url('"+ src +"')";
			image.css({
				"background-image" : src 
			});
		} else {
			image.attr("src",src);
		}

		// IF IMAGE BLURRED
		setTimeout( function(){
			image.removeClass("blurred");		
		}, 500 );

	}

}

/************************************************

    INIT

************************************************/


$(document).on("ready", function(){
	controllerPage.pageInit();
});



