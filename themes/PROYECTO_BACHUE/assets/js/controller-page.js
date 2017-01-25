// (function ($) {
// 	'use strict';

	var controllerPage = {

		pageInit: function () {

			// PAGE INIT
			viewPage.init();
			// LINKS INIT
			this.linksInit();
			// SECTIONS INIT
			// controllerSections.homeInit();
			this.gridInit();
			controllerSections.sectionsInit();
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
		},

		gridInit: function () {

			console.log("controllerPage.gridInit");

			// LOOP THROUGH ALL LOADED GRIDS
			$(".image_grid").each( function(){
				
				var cols = $(this).attr("data-col"),
					count = 1,
					row = 1,
					totalCells = $(this).find(".image_cell").not(".hidden").length;
				
				// SET NUMBER OF COLUMNS
				if ( $(window).width() <= 500 ) {
					$(this).attr("data-col", 1 );
				} else if ( $(window).width() > 500 && $(window).width() <= 900 ) {
					$(this).attr("data-col", 2 );
				}

				controllerPage.gridReset( $(this) );
				// LOOP THROUGH CELLS 
				$(this).find(".image_cell").not(".hidden").each( function(){

					$(this).attr( "data-row", row );
					// IF END OF THE ROW OR IF LAST CELL
					if ( count % cols === 0 || count === totalCells ) {
						// REMOVE MARGIN-RIGHT
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

			}); // END OF IMAGE GRID LOOP

		},

		gridReset: function ( grid ) {

			console.log("gridReset");

			grid.find(".clear").remove();
			grid.find(".grid_large").remove();

		},

		gridOpen: function ( click ) {

			console.log("controllerPage.gridOpen");

			// IF WINDOW IS WIDER THAN 500PX
			if ( $(window).width() > 500 ) {

				var grid = click.parents(".image_grid"),
					img = click.find("img"),
					nextLarge = click.nextAll(".grid_large").eq(0);	

				// CLOSE OTHER IMAGES IN GRID
				viewPage.closeImagesInGrid( grid );
				
				// CALCULATE HEIGHT
				if ( click.hasClass("coll_post") ) {
					// FIRST APPEND CONTENT
					click.find(".hidden_content").clone().removeClass("hide").appendTo( nextLarge );
					
					var img = nextLarge.find(".hidden_content"),
						largeH = nextLarge.find(".hidden_content").height(),
						rowNo = click.attr("data-row");

				} else {
					var largeH = parseInt( img.attr("height") ) / parseInt( img.attr("width") ) * parseInt( grid.width() ) * 0.9,
						rowNo = click.parents("li").attr("data-row");
					
					if ( img.hasClass("portrait") ) {
						largeH = largeH * 0.67 + 24;
					} 
				}

				// GIVE HEIGHT TO FOLLOWING GRID_LARGE
				nextLarge.css({"height" : largeH});

				// CLONE IMAGE AND APPEND TO FOLLOWING .GRID_LARGE
				img.clone().appendTo( nextLarge.find( ".image_wrapper" ) );

				// RUN IMAGE RESIZE
				this.imageCalc( nextLarge.find( "img" ) );

				// FADE IN CLOSE BUTTON
				viewPage.fadeInGridClose( nextLarge );
			
				// IF IN PUBLICATIONS – ANIMATE PARENT HEIGHT
				if ( click.parents("#publications_list").length ) {
					// GET CURRENT HEIGHT
					var parentH = $("#publications_list").height();
					$("#publications_list").css( "height", "auto" );
				} 

				// SCROLL DOWN TO OPENED IMAGE (AFTER CLOSING ANIMATION)
				// console.log( 377, grid.find( ".row_" + rowNo ) );
				viewPage.scrollToTarget( grid.find( ".row_" + rowNo ), 500 );

			}

		},

		gridClose: function ( click ) {

			console.log("controllerPage.gridClose");

			// CLOSE PARENT + ADD RESET CLASS
			click.fadeOut();
			click.parents(".grid_large").css("height","0").find(".image_wrapper").empty().removeClass("full").addClass("empty");	

		}

	}

// })(jQuery);
