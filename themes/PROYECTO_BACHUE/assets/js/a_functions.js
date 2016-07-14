/****************************************************************************
    
	2. FUNCTIONS
		2.1. BACKGROUND
			2.1.1. VARIOUS BACKGROUND FUNCTIONS
				2.1.1.1. 	CLICK ON IMAGES
				2.1.1.2. 	ATTRIBUTE CLASS FOR NUMBER OF COLUMNS
				2.1.1.3.    INITIATE ON LOAD
				2.1.1.4. 	ROUND IMAGES
				2.1.1.5. 	CLEAR HASH
			2.1.2. BACKGROUND IMAGE CHANGE
				2.1.1. 	PREPARE HTML FOR IMAGES
				2.1.4. 	SHUFFLE FUNCTION
				2.1.5. 	INJECT IMAGES
				2.1.6. 	ANIMATE IMAGES
				2.1.7. 	FADE IN IMAGES
				2.1.8. 	MANAGE FOUR COLUMNS
				2.1.10. WRAPPER SHIFT
				2.1.12. ARTIST IMAGES LOAD
			
		2.2. RECEIPT
			2.2.1. 	REMOVE HASH
			2.2.2. 	URL DETECT
			2.2.3. 	VITRINE CLOSE ON SCROLL
			2.2.4. 	FILTER INDEX
			2.2.5. 	ARTIST INFO TOGGLE
			2.2.6. 	VITRINE TOGGLE
			2.2.7. 	ARTIST VITRINE OPEN
			2.2.8. 	ARTIST VITRINE CLOSE
			2.2.9. 	SEE MORE
			2.2.10. CATEGORY CLICK
			2.2.11. SCROLLER
			2.2.12. SHOW IMAGES
			2.2.13. SHOW TOGGLE
			2.2.14. AGENDA CHECK

*****************************************************************************/

// 2.1. BACKGROUND

	// 2.1.1. VARIOUS BACKGROUND FUNCTIONS

		// 2.1.1.1. CLICK ON IMAGES

		function infoReset () {
			console.log("infoReset");
			$(".img_loop").removeClass("paused");

			// HIDE INFO
			$(".img_info").css("opacity","0");
			$("#img_info_fixed").empty().removeClass("active");		
		}

		function imagesClick ( thisLi ) {
			console.log("imagesClick");
			if ( !$(".img_loop").hasClass("paused") ) {
				$(".img_loop").addClass("paused");

				// SHOW INFO			
				$(".img_info").css("opacity","0");
				thisLi.find(".img_info").css("opacity","1").clone().appendTo("#img_info_fixed");
				$("#img_info_fixed").addClass("active");
			} else {
				infoReset();
			}
		}

		// 2.1.1.X. SOCIAL MEDIA LINKS

		function fbShare ( click ) {
			console.log("fbShare");
			// GET INFO
			var post_name = click.data("text"),
				post_link = click.data("link"),
				img_url = click.data("img");
			console.log(77, post_name, post_link, img_url);
			FB.init({ 
				appId: 1196911897000591, 
				status: true, 
				cookie: true, 
				version : 'v2.5' 
			});
	        FB.ui({
	            method: 'feed',
	            name: post_name,
	            // href: $(location).attr('href'),
	            link: post_link,
	            picture: img_url,
	            caption: 'xbank.amsterdam'
	        });			
		}

		// 2.1.1.2. ATTRIBUTE CLASS FOR NUMBER OF COLUMNS
		// 			BASED ON SIZE OF SCREEN AND MAX NUMBER OF COLUMNS DECIDED BY POST

		function isNumber( input ) {
		    return !isNaN( input );
		}
		
		function noCols () {
			console.log("noCols");
			var target = $(".current"),
				winW = $(window).width(), 
				mQuery,
				noCols;
			// POST COLS TAKEN FROM DATA-COLS OF CURRENT
			var postCols = parseInt( $(".current").attr( "data-cols" ) );
			// MEASURE MAX COLS DEPENDING ON SCREEN SIZE
			if ( winW < 600 ) {
				mQuery = 1;
			} else if ( winW >= 600 && winW < 900 ) {
				mQuery = 2;
			} else {
				mQuery = 4;
			}

			noCols = Math.min( postCols, mQuery );	
			console.log( 86, noCols, postCols, mQuery );
	
			if ( noCols === 1 ) {
				target.addClass("container_1").removeClass("container_2 container_4");
			} else if ( noCols === 2 ) {
		       	target.addClass("container_2").removeClass("container_1 container_4");
			} else {
				target.addClass("container_4").removeClass("container_1 container_2");
			}	
		}

		// 2.1.1.3.	MANAGE FOUR COLUMNS

		function manageCols ( cols ) {
			console.log("manageCols");
			if ( cols === 4 ) {
				$(".appended").remove();
				$(".duplicate").show();
			} else {
				// CHECK IF FOUR COLUMN VIEW IS ACTIVATED
				if ( $(".load_wrapper ul").hasClass("column_view") ) {
					// IF 2 OR 1 COLUMNS ALL COLUMNS ARE THE SAME
					// HIDE DUPLICATES
					$(".duplicate").hide();
					// COPY ULs FROM 2, 3, 4 TO 1
					var target_1 = $(".current .col_1 .img_loop");
					var target_2 = $(".current .col_2 .img_loop");				
					$(".current .movable_wrapper").each( function(i){					
						if ( i > 0 ) {
							// JUST FROM 1st UL IN COLUMN				
							var targetImgs = $(this).find(".img_loop:first-child .img");
							var noImages = targetImgs.length;
							var appendHtml = [];
							var appendImg,
								clonedImg;
							for ( var i = 0; i < noImages; i++ ) {
								appendImg = targetImgs.eq(i);
								clonedImg = appendImg.clone().addClass("appended");
								appendHtml.push( clonedImg );
							}
							target_1.append(appendHtml);
							target_2.append(appendHtml);
						}
					});				
				}
			}
		}

		// 2.1.11. INITIATE ON LOAD

		function imagesInit () {
			console.log("imagesInit");
			// MAIN IMAGE PREP FUNCTION		
			imageManager( "init" );
			// CHECK IF IMAGES HAVE LOADED
			$("#load_wrapper").imagesLoaded().done( function(){
			    imagesFadeIn();
			    // RECEIPT SLIDE UP
				$("#receipt_wrapper").css("top","0px");
	  		});	

			// TMP
			roundImages();
		}

		// 2.1.1.2. ROUND IMAGES

		function roundImages () {
			// IF ACTIVATE DIV IS VISIBLE 
			if ( $("#round_images").length ) {
				console.log("roundImages");	
				// IF NO PROXIES
				if ( !$(".bg_proxy").length ) {
					// CREATE A PROXY DIV WITH IMG AS BG
					$(".bg_image").each( function(i) {									
						var imgSrc = $(this).attr("src");
						var imgW = $(this).width();
						console.log( 170, $(this).width());
						$(this).hide();
						$( "<div id='proxy_" + i + "' class='bg_proxy bg_image'></div>" ).insertAfter( $(this) );
						$( "#proxy_" + i ).css({
							// "border" : "1px solid purple",
							"width" : "90%",
							"height" : imgW,
							"background-image" : "url(" + imgSrc + ")",
							"background-position" : "center",
							"background-size" : "cover",
							"border-radius" : "50%",
							"box-shadow" : "18px 18px 23px 0px rgba(0,0,0,0.35)"
						});					
					});
				} else {
					// IF PROXIES - RESIZE
					console.log("roundImagesResize");
					$(".bg_proxy").each( function() {
						var imgW = $(this).width();
						$(this).css({
							"height" : imgW
						});
					});
				}
				
			} 
		}

		// 2.1.1.5. CLEAR HASH

		function clearHash () {
			console.log("clearHash");
			if ( window.history && window.history.pushState ) { 
			    window.history.pushState('', '', window.location.pathname) 
			} else { 
			    window.location.href = window.location.href.replace(/#.*$/, '#'); 
			}
		}


	// 2.1.2. BACKGROUND IMAGE CHANGE

		// 2.1.2.X. AJAX LOAD IMAGES

		function imagesLoad ( post, type ) {
			// POST === POST ID
			console.log( "imagesLoad", post, type );
			// CHECK IF NOT LOADED ALREADY
			if ( !$("body").find("#wrapper_" + post).length ) {
				// ADD LI TO LOAD WRAPPER
				$("#load_wrapper").append("<li id='wrapper_" + post + "'></li>");
				// AJAX CALL
				$( "#wrapper_" + post ).load("?p=" + post, function () {
					console.log("Ajax loaded");
					// FOLLOWING HAPPENS ONLY IF SHOW 
					// FOR INDEX IT IS DELAYED
					if ( type === "show" ) {
					// IMAGESINJECT
					imagesInject( post );	
					imagesAnim(); 
					setTimeout( function(){
						imagesFadeIn();						
					}, 500 );
					// ???
					// $(".current").find(".duplicate").show();	//
					}
							
				});			
			} else {
				console.log("Already loaded.");
			}	

		}

		// 2.1.2.X. INJECT IMAGES

			// SHUFFLE FUNCTION
		$.fn.randomize=function(a){(a?this.find(a):this).parent().each(function(){$(this).children(a).sort(function(){return Math.random()-0.5}).detach().appendTo(this)});return this};

		function imagesInject ( post ) {
			console.log("imagesInject", post);
			// POST === POST ID
			var target = $(".current"),
				source,
				noCols;
			if ( post === "init" ) {
				source = $("#init_container");
			} else {
				source = $("#wrapper_" + post);
			}


			var noImages = source.find("li.img").length;
			console.log( 245, "no. of images:", noImages );
			// AIMING FOR 10 PER UL
			var loops = Math.ceil( 16 / noImages );
			// MIN 2 LOOPS
			if ( loops < 2 ) {
				loops = 2;
			}

			// IF 4 COLUMN VIEW
			if ( source.find(".column_view").length ) {
				noCols = 4;
				// LOOP THROUGH 4 EXISTING COLUMNS
				source.find(".column_view").each( function(i){
					$(this).find("li.img").each( function(){
						$(this).clone().appendTo( target.find(".movable_wrapper").eq(i).find(".img_loop") ); 	
					});
				});
				// COPY IMGS DEPENDING ON HOW MANY IMAGES THERE ARE
				for ( var j = 0; j < loops; j++ ) {				
					$(".movable_wrapper li.img").each( function(){
						var thisParent = $(this).parents(".img_loop");
						$(this).clone().appendTo( thisParent  ).addClass("duplicate");
					});
				}
			// DEFAULT IMAGE INJECTION
			} else {	
				noCols = parseInt ( target.attr("data-cols") );
				// IMAGES INJECTED INTO ALL AVAILABLE ULs – ONE PER UL
				source.find("li.img").each( function(){
					$(this).clone().appendTo( target.find(".img_loop") ); 	
				});
				// COPY IMGS DEPENDING ON HOW MANY IMAGES THERE ARE
				for ( var j = 0; j < loops; j++ ) {			
					target.find(".movable_wrapper li.img").each( function(){			
						// CHECK IF NOT DUPLICATING A DUPLICATE
						if ( !$(this).hasClass("duplicate") ) {
							$(this).clone().appendTo( $(this).parents(".img_loop") ).addClass("duplicate");
						}
					});
				}
				// IF MULTIPLE ULs, COLs 2-4 ARE SHUFFLED	
				if ( noCols > 1 ) {
					for ( i=1; i < noCols; i++ ) {
						var parent = $(".movable_wrapper").eq( i ).find(".img_loop");
					    parent.find("li.img").randomize();
					}
				} 



			} // END OF 4 COLUMN CHECK

			// IF 4 COLUMN VIEW
			if ( target.find(".container").hasClass("container_2") || target.find(".container").hasClass("container_1") ) {
				// TMP REMOVED FOR DEBUGGING
				// manageCols();						
			} 
			
			// ASSIGN DATA-COLS TO CURRENT
			console.log( 319, noCols );
			$(".current").attr( "data-cols", noCols );

			// EMPTY SIBLING MOVABLE WRAPPERS
			console.log("Empty non-visible wrappers.");
			target.siblings(".wrapper").find(".movable_wrapper .img_loop").empty();


		}

		// 2.1.2.X. ANIMATE IMAGES 
		// 			CALLED ON MEDIA CHANGE

		function imagesAnim ( first ) {
			if ( first ) { // FIRST === TRUE
				first = false;
				console.log("imagesAnim break");
			} else {
				console.log("imagesAnim");
		 		var target = $(".current");
				
				// CHECK IF ALL IMAGES LOADED
				target.find(".img_loop").imagesLoaded().done( function(){
					console.log( 323, "Images loaded." );

			 		// GET UL + WIN HEIGHT
			 		var ulH = target.find(".img_loop").height();
					var winH = $(window).height();
					var dest = ulH - ( winH * 2 );
					var time = dest / 18.6;
					// IF TIME NEGATIVE
					if ( time < 0 ) {
						time = 0 - time;
					}
					console.log( 343, "UL height:", ulH, "target:", dest, "duration:", time );
					// TIME = DISTANCE / SPEED

					// DEFINE ANIMATIONS		
					$.keyframe.define({
					    name: 'up',
					    from: {
					    	'transform': 'translateY(' + 0 + 'px)'  
					    },
					    to: {
					        'transform': 'translateY(-' + ( ulH - ( winH * 2 ) ) + 'px)'  
					    }
					});

					$.keyframe.define({
					    name: 'down',
					    from: {
					    	'transform': 'translateY(-' + ( ulH - ( winH * 2 ) ) + 'px)'   
					    },
					    to: {
					        'transform': 'translateY(0px)' 
					    }
					});

					// ASSIGN ANIMATIONS

					target.find(".img_loop").resetKeyframe();

					// $.keyframe.debug = true;

					// SAFARI TEST
					var isSafari = navigator.vendor && navigator.vendor.indexOf('Apple') > -1 &&
								   navigator.userAgent && !navigator.userAgent.match('CriOS');

					var count = 1;
					if ( isSafari ) {
						count = "infinite";
					} 

					target.find(".movable_wrapper:nth-child(odd) .img_loop").playKeyframe({
					    name: 'up', 
					    duration: time + 's', 
					    timingFunction: "ease-out",
					    direction: 'alternate',
					    iterationCount: count, 
					  	complete: function () {
					  		if ( !isSafari ) {
					  			console.log("secondary loop fired");
								target.find(".movable_wrapper:nth-child(odd) .img_loop").playKeyframe({
								    name: 'up', 
								    duration: time + 's', 
								    timingFunction: 'ease-in-out',
								    direction: 'alternate',
								    iterationCount: 'infinite'
								});	
					  		}
		   			  	}
					});

					target.find(".movable_wrapper:nth-child(even) .img_loop").playKeyframe({
					    name: 'down', 
					    duration: time + 's',  
					    timingFunction: "ease-out",
					    direction: 'alternate', 
					    iterationCount: count,
					    complete: function(){
					    	if ( !isSafari ) {
								console.log("secondary loop fired");
						    	target.find(".movable_wrapper:nth-child(even) .img_loop").playKeyframe({
								    name: 'down', 
								    duration: time + 's', 
								    timingFunction: 'ease-in-out',
								    direction: 'alternate', 
								    iterationCount: 'infinite'
								});	
							}
					    }
					});	

				// END OF IMAGES LOADED CHECK
				});

			} // END OF FIRST TIME CHECK

		}

		// 2.1.2.X. FADE IN IMAGES

		function imagesFadeIn () {
			console.log("imagesFadeIn");
			$(".current").animate({
				"opacity": "1"
			}, 2000, function() {
				$(".current").siblings(".wrapper").css({
					"opacity": "0"
				});
			});
		}

		// 2.1.2.X. IMAGE MANAGER

		function imageManager ( post, type ) {
			console.log("imageManager", post, type);
			// // CHECK IF NOT LOADED ALREADY
			if ( !$("body").find("#wrapper_" + post).length && post !== "init" ) {
				console.log( 432, " Post not yet loaded.");	

				// SET NUMBER OF COLUMNS
				var cols = parseInt( $("#" + post).attr("data-cols") );
				if ( $( "#show-" + post ).length ) { // IF SHOW
					console.log("Show cols.");
					cols = 2;
				} else if ( !cols ) { // IF COLS UNDEFINED
					console.log("Cols undefined.");
					cols = 4;		
				}
				$(".current").attr( "data-cols", cols );
				// ONCE AJAX DONE, IMAGESLOAD CALLS:
					// IMAGESINJECT
					// IMAGESANIM
					// IMAGESFADEIN
				noCols();
				// REMOVED FOR IMAGES TO BE PRELOADED
				// imagesLoad( post );	
				// FOLLOWING FUNCTIONS ADDED FROM IMAGESLOAD
				if ( type === "index" ) {
					imagesInject( post );	
					imagesAnim(); 
					setTimeout( function(){
						imagesFadeIn();						
					}, 500 );
				} else {
					// IF SHOWS
					imagesLoad( post, type );	
				}

			} else {
				console.log( 425, " Post already loaded or Init.");
				// WHY THIS HERE??
				imagesInject( post );
				noCols();
				imagesAnim();
				roundImages();
				imagesFadeIn();
			}
		}

		// 2.1.2.X. WRAPPER SHIFT

		function wrapperShift ( post ) {
			console.log("wrapperShift");
			var wr_1 = $("#wrapper_1"),
				wr_2 = $("#wrapper_2");		
			// CHECK ID OF CURRENT VIS WRAPPER 
			var currentId = $(".current").attr("data-current");

			if ( post !== currentId ) {
				// MODIFY DATA-CURRENT
				$(".toLoad").attr( "data-current", post );
				// CHECK WHERE WRAPPER_1 IS
				if ( parseInt ( wr_1.css("left") ) === 0 ) {
					// MOVE WRAPPERS
					wr_1.css("left", "-100%");
					wr_2.css("left", "0%");
					// Declare which wrapper can be loaded in
					$(".toLoad").removeClass("toLoad").addClass("current");
					wr_1.addClass("toLoad").removeClass("current");
				} else {
					// MOVE WRAPPERS
					wr_2.css("left", "100%");
					wr_1.css("left", "0%");
					// Declare which wrapper can be loaded in
					$(".toLoad").removeClass("toLoad").addClass("current");
					wr_2.addClass("toLoad").removeClass("current");							
				}
			} else {
				console.log( 453, "Already loaded and visible." );
			}
		}

		// 2.1.2.X. MAIN FUNCTION

		function bgImages( post, type ) {
			console.log("bgImages", post, type);
			// GET NUMBER FROM ID
			if ( !isNumber( post ) ) {
				post = post.split("-")[1];
			}
			// WRAPPER SHIFT
			wrapperShift(post);
			// ONCE ANIMATION DONE LOAD IMAGES
			setTimeout( function(){
				imageManager( post, type );			
			}, 2000);
			
		}

		// 2.1.2.X. BG RESET

		function bgReset () {
			console.log("bgReset");
			// CHECK IF NOT ALREADY INIT
			if ( $(".current").attr("data-current") !== "init" ) {
				wrapperShift("init");
				// ONCE ANIMATION DONE LOAD IMAGES
				setTimeout( function(){
					imageManager("init");			
				}, 2000);					
			} else {
				console.log("Init already visible.");
			}
			// UPDATE URL
			clearHash();
		}

// 2.2. RECEIPT

	// 2.2.1. VITRINE CLOSE ON SCROLL

	function removeHash () { 
	    // PUSH STATE NEEDS FALLBACK FOR IE
	    // history.pushState("", document.title, window.location.pathname + window.location.search);
	}

	// 2.2.2. URL DETECT

	function urlDetect() {
		var hash = window.location.hash;
		// IF HASH EXISTS
		if ( hash.length ) {
			console.log( "urlDetect", hash.substring(1) );
			// GET SLUG
			var slug = hash.substring(1);
			// IF IN AGENDA
			if ( $( "[data-slug=" + hash.substring(1) + "]" ).parents("#agenda").length ) {
				console.log("Hash in agenda.");
				// OPEN UP POST
				seeMoreAgenda( hash.substring(1) );
			} else if ( $( "[data-slug=" + hash.substring(1) + "]" ).parents("#index").length ) {
			// IF INDEX
				console.log("Hash in index.");
				// IF ENTRY DOESN'T HAVE CLASS INDEX_DISABLED
				if ( !$( "[data-slug=" + hash.substring(1) + "]" ).find("a").hasClass("index_disabled") ) {
					// SEE MORE FUNCTION	
					seeMoreIndex( hash.substring(1), true );				
				} else {
					console.log("deactived");	
				}
			}
						
		} else {
			// PAGE RESET ??
			// CLOSE ALL / SCROLL TO TOP
			$("html,body").animate({
				scrollTop: 0
			}, 500);
		}
	}

	// 2.2.3. VITRINE CLOSE ON SCROLL

	var firstTime = true;
	function vitrineManageScroll ( scroll ) {	
		console.log("vitrineManageScroll");	

		// ON FIRST SCROLL OPEN MAIN VITRINE
		if ( firstTime ) {
			// console.log(526, firstTime);
			// vitrineToggle ( "toggle-main" );
			// firstTime = false;
		}

		$(".r_hole").each( function(){			
			var thisOffset = $(this).offset().top;
			var winH = $(window).height();
			var vitrH = $(this).height();
			// detect if vitrine is visible or not
			if ( scroll < thisOffset - ( winH / 2 ) || scroll > thisOffset + ( winH / 2 ) ) {
				// detect if vitrine has class .no_close
				if ( !$(this).hasClass("no_close") ) {
					$(this).css("height", "0px").removeClass("clicked");	
				}

			}
		});
	}

	// 2.2.4. FILTER INDEX

	function filterInit () {
		console.log("filterInit");
		// RUN FILTER INDEX WITH FASHION IS DEFAULT
		// $( "#index_categories li:first-child a" ).trigger( "click" );
	}

	function showBlock ( blockNo ) {
		// BLOCK PARAMETER GIVES BLOCK LENGTH
		console.log( "showBlock", blockNo );
		// blockNo 2 => blockNo > 25 && blockNo <= 50 
		// blockNo X => blockNo > (X-1)*25 && blockNo <= X * 25
		
		// RECORD CURRENT BLOCK
		$("#index .index_results").attr( "data-block", blockNo );

		// HIGHLIGHT SELECTED BLOCK
		$("#index_nav_" + blockNo).css({
			"border-bottom" : "1px solid black"
		}).siblings().css({
			"border-bottom" : ""			
		});

		$("#index .index_results li").each( function(i){
			if ( i >= ( ( blockNo - 1 ) * 25 ) && i < ( blockNo * 25 ) ) {
				$(this).addClass("result");					
			} else {
				$(this).removeClass("result").css("display","");	
				// CLOSE ANY OPEN ARTIST INFOS	
				if ( $(this).find(".clicked").length ) {
					// TRIGGER CLICK
					$(this).find(".index_artist_title a").trigger("click");
				}
			}
		});
	}

	function paginationNav ( click ) {
		console.log("paginationNav");
		// GET ID
		var stem = click.attr("id").substring(10),
			currentBlock = parseInt( $("#index .index_results").attr( "data-block" ) ),
			maxBlock = parseInt( $("#index .index_results").attr( "data-max" ) ),
			stemNo;
		if ( stem === "left" ) {
			// LEFT
			stemNo = currentBlock - 1;
			if ( stemNo !== 0 ) {
				showBlock( stemNo );	
			}
		} else if ( stem === "right" ) {
			// RIGHT
			stemNo = currentBlock + 1;
			if ( stemNo <= maxBlock ) {
				showBlock( stemNo );	
			}
		} else {
			// NUMBER
			stemNo = parseInt( stem );
			showBlock( stemNo );		
		}
		
		// ANIMATE WRAPPER HEIGHT
		var resultWrapper = $("#index .index_results");
		$(".sub_index").css("height", resultWrapper.height() );
	}

	function paginationFilter () {
		console.log("paginationFilter");
		// IF MORE THAN 40 RESULTS
		var maxResults = 30,
			block = 25,
			results = $("#index .index_results li").length;
		if ( results > maxResults ) {
			// COUNT HOW MANY BLOCKS ARE NEEDED
			var blocks = Math.ceil(results / block);
				// REGISTER THIS NUMBER
			$("#index .index_results").attr("data-max", blocks);
			var navHtml = "<a id='index_nav_left' class='index_nav' href=''><</a>";
			// FOR EACH BLOCK ADD A NUMBER LINK
			for ( var i = 1; i <= blocks; i++ ) {
				navHtml += "<a id='index_nav_" + i + "' class='index_nav' href=''>" + i + "</a>";
			}
			navHtml += "<a id='index_nav_right' class='index_nav' href=''>></a>";

			// APPEND TO HTML + SHOW 
			$("#index_nav").html(navHtml).show();

			// FIND FIRST BLOCK AND ADD RESULT CLASS
			showBlock( 1 );

		} else {
			// NO FILTER – ALL RESULTS APPENDED TO FINAL AREA
			$("#index .index_results li").each( function(){
				// ADD RESULT CLASS TO MAKE VISIBLE
				$(this).addClass("result");
			});
			// HIDE NAV
			$("#index_nav").hide();
		}
	}

	function filterIndex ( thisClick ) {
		console.log("filterIndex");

		// MODIFIED TO BE BASED ON CATEGORIES AND NOT LETTERS

		// EMPTY RESULTS WRAPPER
		var resultWrapper = $("#index .index_results");
		resultWrapper.empty();

		// EMPTY SEARCH FIELD IF NOT SUB-CAT
		if ( !thisClick.parents().hasClass("sub_cat") ) {
			$("#search").val("");
		}

		// GET CLICKED LETTER (CAT)
		var thisCat = thisClick.text().toLowerCase();
		// loop through LIs 

		$(".sub_index li").each( function(){
			// console.log( thisCat, thisLetter );
			// var initial = $(this).data("initial");
			if ( $(this).hasClass(thisCat) ) {
				// add new id to avoid conflicts
				var newId = "result-" + $(this).attr("id");

				// APPEND ANY RESULTS TO RESULT WRAPPER WITHOUT ADDING CLASS "RESULT"
				// $(this).clone().attr("id", newId).addClass("result").appendTo(resultWrapper);
				$(this).clone().attr("id", newId).appendTo(resultWrapper);
			} 
		});	

		// RUN PAGINATION FILTER
		paginationFilter();		
		
		// underline clicked letter or cat
		// $(".index_menu a").css("border-bottom","");
		// thisClick.css("border-bottom","1px solid black");
		// THIS IS INCLUDED IN CATCLICK FUNCTION

		// MAKE SUB-CATEGORES VISIBLE
		if ( thisCat === "fashion" ) {
			$(".sub_cat").hide();
			$("#fashion_sub_cat").show();
			// MEASURE SUB_CAT LI BECAUSE SUB_CAT COLLAPSES ON LARGE WIDTHS
			var subCatH = $("#fashion_sub_cat li").height();
			// ON SMALL SCREEN IF SMALLER THAN SUB_CAT
			if ( subCatH < $("#fashion_sub_cat").height() ) {
				subCatH = $("#fashion_sub_cat").height();
			}
			$("#sub_cat_wrapper").css( "height", subCatH + 12 );
		} else if ( thisCat === "design" ) {
			$(".sub_cat").hide();
			$("#design_sub_cat").show();
			// MEASURE SUB_CAT
			var subCatH = $("#design_sub_cat").height();
			$("#sub_cat_wrapper").css( "height", subCatH + 12 );
		} else if ( thisCat === "art" ) {
			// HIDE SUB-CATS
			$(".sub_cat").hide();
			$("#sub_cat_wrapper").css( "height", "0px" );
		}
		// animate wrapper height
		$(".sub_index").css("height", resultWrapper.height() );

	}

	// 2.2.5. ARTIST INFO TOGGLE

	function artistInfoToggle ( target ) {
		console.log( "artistInfoToggle", target.parents("li").attr("id") );	 
		// TARGET = .INDEX_ARTIST_CONTENT
		var resultWrapper = $("#index .index_results"),
			childrenH = 0,
			delay = 0,
			targetId = target.parents("li").attr("id").split("-")[1];
		console.log( 828, targetId );

		// CHECK IF VITRINE OPEN
		if ( $("#artist_vitrine").hasClass("open") ) {
			console.log( 785, "Vitrine open." );
			// GET ID
			var postId = $("#artist_vitrine").attr("data-current");
			// CLOSE VITRINE
			artistVitrineClose( postId );
			// ADD DELAY TO ALLOW TIME FOR VITRINE TO CLOSE
			delay = 1000;				
		}

		if ( !target.hasClass("clicked") ) {

			console.log( 792, "Target is not clicked." );

			// MODIFY TEXT
			var text = target.prev(".index_artist_title").find("p").html();
			text = text.replace('More', 'Less');
			target.prev(".index_artist_title").find("p").html(text);

			// CLOSE EXISTING POSTS 
			$(".index_artist_content").removeClass("clicked").css("height","0");

			// GET HEIGHT OF CONTENT AND DECLARE CSS TO GET ANIMATION
			target.children().each( function(){
				childrenH += $(this).outerHeight(true);
			});				

			// IF INFO ALREADY OPEN — SETTIMEOUT TO WAIT UNTIL CONTENT HAS CLOSED BEFORE RE-OPENING
			if ( resultWrapper.hasClass("open") ) {	
				console.log( 813, "Info already open." );		
				delay = 500;
				setTimeout( function(){
					console.log( 807, childrenH, target.parents("li").attr("id") );
					target.addClass("clicked").css(
						"height", childrenH
					);
					resultWrapper.addClass("open");				
				}, 500);
			} else {
				console.log( 823, "Info closed." );
				target.addClass("clicked").css(
					"height", childrenH
				);
				resultWrapper.addClass("open");							
			}
			
			// UPDATE URL
			var name = target.parents("li").attr("data-slug");
			window.location.hash = name;

			// IF INDEX: LOAD IMAGES HERE
			imagesLoad ( targetId, "index" );
		
		} else {	

			console.log( 831, "Target is clicked." );

			setTimeout( function(){
				console.log( 797, "Delayed." );

				// RESET TEXT
				var text = target.prev(".index_artist_title").find("p").html();
				text = text.replace('Less', 'More');
				target.prev(".index_artist_title").find("p").html(text);
		
				target.removeClass("clicked").css(
					"height", "0px"
				);	
				resultWrapper.removeClass("open");	

				// // CLEAR URL
				// clearHash();

				// RESET BG
				bgReset();	

			}, delay );

		}

		setTimeout( function(){
			// ANIMATE WRAPPER HEIGHT
			// CALCULATE HEIGHT BASED ON LI'S HEIGHT + HEIGHT OF CHILD
			var calcH = childrenH;
			$(".index_artist_title").each( function(){
				calcH += $(this).height();
			});		
			$(".sub_index").css("height", calcH );
			
			// SCROLL TO TOP OF POST	
			setTimeout( function(){
				var targetOffset = target.offset().top - 60;
				console.log( 868, targetOffset );
				$("html,body").animate({
					scrollTop: targetOffset
				}, 1000);			
			}, 500 );
		}, delay );

	}

	// 2.2.6. VITRINE TOGGLE

	function vitrineToggle ( thisId ) {
		console.log("vitrineToggle");
		// button = id (e.g. toggle-147) 
		var thisA = thisId.split("-")[1];

		// calculate height of vitrine
		var winH = $(window).height();

		// get target
		var target;
		var artistVitrine = false;
		
		if ( thisA === "main" )  {
			// Main vitrine
			target = $("#r_vitrine").next(".r_hole");		
		} else {
			// Artist vitrine
			target = $("#artist_vitrine");
			artistVitrine = true;
		}

		if ( !target.hasClass("clicked") ) {
			// OPEN
			target.css("height", winH * 0.7).addClass("clicked no_close");
				// scroll up
			var scrollTarget;
			if ( artistVitrine ) {

				var artist = $( "#result-" + thisA );
				var scrollTarget = $( "#result-" + thisA ).offset().top;
				// scrollTarget = artist.offset().top;				
				
				// CALLED SEPARATELY
				// artistVitrineOpen( artist );				
			} else {
				scrollTarget = $( "#toggle-main" ).offset().top;
			}
			$("html,body").animate({
				scrollTop: scrollTarget
			}, 500);

				// remove no_close after 2 seconds
			setTimeout( function(){
				target.removeClass("no_close");
			}, 2000);

			// stop image jump
			$("#index_bis .index_artist_image img").css("margin-top", "24px");

		} else {

			// CLOSE

			target.css("height", "0px").removeClass("clicked");
			
			if ( artistVitrine ) {
				// close artist vitrine
				artistVitrineClose();
			}

		}	
	}

	// 2.2.7. ARTIST VITRINE TOGGLE

	function artistVitrineToggle ( thisArtist ) {
		console.log( "artistVitrineToggle", thisArtist );
		// CHECK IF VITRINE IS OPEN
		if ( !$("#artist_vitrine").hasClass("open") ) {
			// THIS FUNCTION CALLS BGIMAGES AFTER VITRINE ANIMATION
			artistVitrineOpen( thisArtist );			
		} else {
			artistVitrineClose( thisArtist );		
		}
	}


	function artistVitrineOpen ( thisArtist ) {
		console.log( "artistVitrineOpen", thisArtist );

		// GET PARENT LI 
		// MUST HAVE RESULT CLASS TO AVOID CONFUSION WITH SOURCE LI
		var thisId = thisArtist.split("-")[1];
		var parent = $( "#result-" + thisId );

		// REGISTER CURRENT ID AND ADD OPEN CLASS
		$("#artist_vitrine").addClass("open").attr( "data-current", thisArtist );

		// MODIFY TEXT
		parent.find(".artist_vitrine_toggle").text("Hide Images");

		// GET, CLONE, HIDE AND PREPEND FOLLOWINGINNER AND FOLLOWINGOUTER
		var followingInner = parent.find(".index_artist_content");
		var followingOuter = parent.nextAll(".result");
		var followingNav = $("#index_nav"); 
	
		// HIDE ORIGINAL ELEMENTS
		followingInner.add(followingOuter).add(followingNav).hide().addClass("hidden");

		// MAKE SURE TARGET AREA IS EMPTY
		$("#index_bis .section_content").empty();
		$("#index_bis .index_results").empty();

		// CLONE ELEMENTS
		followingInner.clone().prependTo( $("#index_bis .section_content") ).show();
		followingNav.clone().attr("id","index_nav_bis").prependTo( $("#index_bis .index_results") ).show();	
		followingOuter.clone().prependTo( $("#index_bis .index_results") ).show();	

		// MODIFY APPENDED NAV
		$("#index_nav_bis a").each( function(){
			var prevId = $(this).attr("id");
			$(this).attr({
				id: prevId + "_bis",
				"data-id": prevId
			});
		});

		// COLLAPSE SUB_INDEX
			// PAUSE TRANSITION
		var resultsH = $("#index .index_results").height();
		console.log( 937, resultsH );
		$(".sub_index").css({
			"height": resultsH,
			"-webkit-transition": "height 0s",
            "transition": "height 0s" 
		});

		// ANIMATE VITRINE IS DONE BY VITRINETOGGLE FUNCTION
		
		// RESET TRANSITION
		setTimeout( function(){
			$(".sub_index").css({
				"-webkit-transition": "",
				"transition": "" 
			});	
			var postId = thisArtist.split("-")[1];
			console.log( 968, postId );
			bgImages( postId, "index" );

		}, 500);

		// VITRINE TOGGLED CALLED HERE
		vitrineToggle ( thisArtist );

	}

	// 2.2.8. ARTIST VITRINE CLOSE

	function artistVitrineClose ( thisArtist ) {
		console.log("artistVitrineClose");

		// REMOVE CURRENT ID AND OPEN CLASS
		$("#artist_vitrine").removeClass("open").attr( "data-current", "" );

		// GET PARENT LI 
		var thisId = thisArtist.split("-")[1];
		var parent = $( "#result-" + thisId );
		
		// CLOSE VITRINE MANUALLY
		$("#artist_vitrine").css("height", "0px").removeClass("clicked");

		// RESET TEXT
		parent.find(".artist_vitrine_toggle").text("See Images");
	
		// STOP IMAGE JUMP
		$("#index_bis .index_artist_image img").css("margin-top", "0px");
		//$("#index_bis").css("padding-top", "0px");
		$("#index").css("padding-bottom", "24px");

		// AFTER VITRINE CLOSE ANIMATION
		setTimeout( function(){
			// RESET HTML ELEMENTS FROM INDEX_BIS
			$(".hidden").css("display","").show().removeClass("hidden");
			// EMPTY #INDEX_BIS	
			$("#index_bis .section_content").empty();
			$("#index_bis .index_results").empty();
			// ANIMATE WRAPPER HEIGHT
			$(".sub_index").css({
				"-webkit-transition": "height 0s",
				"transition": "height 0s", 
				"height": $("#index .index_results").height() 
			});
			setTimeout( function(){
				$(".sub_index").css({
					"-webkit-transition": "",
					"transition": "" 
				});

				// CALL BGRESET HERE
				bgReset();

			}, 1000);

		// 	$("#index").css("padding-bottom", "");

		}, 1000);

	}

	// 2.2.9. SEE MORE

	function seeMoreAgenda ( slug ) {
		console.log( "seeMoreAgenda", slug );
		// WAIT UNTIL RECEIPT ANIMATION IS DONE
		setTimeout( function(){
			// TRIGGER CLICK – SHOW TOGGLE
			$( "[data-slug=" + slug + "]" ).find(".show_toggle").trigger("click");
		}, 2000 );
	}

	function seeMoreIndex ( slug, load ) {
		// LOAD === TRUE IF CALLED BY URLDETECT ON PAGE LOAD
		console.log( "seeMoreIndex", slug );
		
		var delay = 0;
		if ( load ) {
			delay = 2000;
		}

		setTimeout( function(){

			// SCROLL DOWN TO INDEX ANCHOR
			var indexOffset = $("#index").offset().top;
			// need to account for closing vitrine
			var vitrineH = $(".r_hole").height();

			$("html,body").animate({
				scrollTop: indexOffset + vitrineH
			}, 1000);	

			// SHOW IN INDEX_RESULTS
				// EMPTY RESULTS WRAPPER
			var resultWrapper = $("#index .index_results");
			resultWrapper.empty();

				// LOOP THROUGH INDEX
			var newId;
			$(".sub_index li").each( function(){
				if ( $(this).attr("data-slug") === slug ) {
					newId = "result-" + $(this).attr("id");
					$(this).clone().attr("id", newId).addClass("result").appendTo(resultWrapper);
				}
			});

				// TOGGLE INFO CONTAINER
			var target = $("#" + newId).find(".index_artist_content");
			artistInfoToggle( target );

			// UNPAUSE ANIMATION
			infoReset();

		}, delay );

	}

	// 2.2.10. CATEGORY CLICK

				// GET CATEGORY OF PARENT IF SUB-CAT
				// if ( $(this).parents(".sub_cat").length ) {
				// 	var parentCat = $(this).parents(".sub_cat").attr("id").split("_")[0];
				// 	// FIND PARENT CAT
				// 	$("#index_categories li").each( function(){
				// 		if ( $(this).find("a").text().toLowerCase() === parentCat ) {
				// 			// REMOVE UNDERLINE
				// 			$(this).css(
				// 				"border-bottom", "1px solid transparent"
				// 			);
				// 		}
				// 	});
				// }

	function catClick ( thisId ) {
		// CLEAR RESULTS
		var resultWrapper = $("#index .index_results");
		resultWrapper.empty();

		// CHANGE INDEX TITLE – REMOVED
		catName = thisId.split("_");
		// $("#index .section_head h1").text( catName[1] + " Index" );
		
		// ADD ATTRIBUTE TO INDEX
		$("#index").attr( "data-cat", catName[1] );

		// IF PARENT CAT DE-UNDERLINE SUB-CATS
		$("#index_categories li").each( function(){
			if ( catName[1] === $(this).find("a").text().toLowerCase() ) {
				$(".sub_cat li").css(
					"border-bottom", "1px solid transparent"
				);
			}
		});

		// UNDERLINE CATEGORY IN INDEX
		$("#index_categories li, .sub_cat li").each( function(){
			if ( $(this).text().toLowerCase() === catName[1] ) {

				// REMOVES UNDERLINE ON OTHER SUB-CATS UNDER SAME CAT
				$(this).parents(".sub_cat").find("li").css(
					"border-bottom", "1px solid transparent"
				);
				// UNDERLINES THIS
				$(this).css(
					"border-bottom", "1px solid black"
				).siblings().css(
					"border-bottom", "1px solid transparent"
				);
			}
		});

		// animate wrapper height
		$(".sub_index").css("height", resultWrapper.height() );

		// ACTIVATE SEARCH
		// $("#index_message").css("height","0");
		// $(".index_letter a").removeClass("disabled");
		// $("#index_search input").removeClass("disabled");

	}

	// 2.2.11. SCROLLER
	// ONLY USED IN AGENDA ????

	function scroller ( showId ) {
		console.log("scroller");
		var target = $("#" + showId).find(".scroll_target");
		$("html,body").animate({
			scrollTop: target.offset().top - 120
		}, 500);
	}

	// 2.2.12. SHOW IMAGES

	function showImgsInit () {
		console.log("showImgsInit");
		// RESIZE SLIDESHOW – WIDTH = HEIGHT
		var imgW = $(".show_images").width();
		$(".show_images").css( "height", imgW );
		// IF NO VISIBLE IMG – SET ONE
		if ( !$(".show_images").find(".visible").length ) {
			$(".show_images li:first-child").addClass("visible");
		} 
		// IF MULTIPLE IMAGES – SHOW NAV
		var imgCount = $(".show_images li").length;
		// console.log( 873, imgCount );
		if ( imgCount > 1 ) {
			$(".show_images_nav").show();
		} 		
	}

	function showImgsBack ( click ) {
		console.log("showImgsBack");	
		var images = click.parents(".show_images_nav").prev(".show_images");
		if ( images.find(".visible").prev().length ) {
			// MOVE TO PREVIOUS SLIDE
			images.find(".visible").removeClass("visible").prev().addClass("visible");
		} else {
			// GO TO END
			images.find(".visible").removeClass("visible");
			images.find("li:last-child").addClass("visible");
		}
	}

	function showImgsForward ( click ) {
		console.log("showImgsForward");	
		var images = click.parents(".show_images_nav").prev(".show_images");
		if ( images.find(".visible").next().length ) {
			// MOVE TO NEXT SLIDE
			images.find(".visible").removeClass("visible").next().addClass("visible");
		} else {
			// BACK TO BEGINNING
			images.find(".visible").removeClass("visible");
			images.find("li:first-child").addClass("visible");
		}
	}

	// 2.2.13. SHOW TOGGLE

	function showToggleOpen ( showId ) {
		console.log("showToggleOpen");
		// CLOSE OTHER SHOWS
		var delay = 0;
		$(".show_wrapper").each( function(){
			// CHECK IF OTHER POST & IF OPEN
			// && $(this).find(".show_content").hasClass("clicked")
			if ( $(this).attr("id") !== showId ) {
				if ( $(this).find(".show_content").hasClass("clicked") ) {
					// IF CLOSE FUNCTION EVERYTHING ELSE IS DELAYED
					delay = 1000;
					console.log("Close delayed.");
					showToggleClose( $(this).attr("id"), true );
				}
			}
		});
		setTimeout( function(){
			var target = $("#" + showId).find(".show_content");
			var contentsH = 0;
			// MODIFY HEIGHT
			target.children().each( function(){
				contentsH += $(this).outerHeight(true);
			});
			target.css( "height", contentsH ).addClass("clicked");
			// SCROLL TO TARGET
			scroller( showId );
			// HIDE READ MORE BUTTON IN CLICKED SHOW
			$("#" + showId).find(".show_toggle_text").css({
				"opacity"	: "0",
				"cursor"	: "default" 
			});		
			// CHECK IF POST INCLUDES IMAGES
			var imgCount = $("#" + showId).attr("data-count");
			if ( imgCount > 0 ) {
				// GET ID
				setTimeout( function(){
					bgImages( showId, "show" );					
				}, 500 );
			}	
			// UPDATE URL
			var showSlug = $("#"+showId).attr("data-slug");
			window.location.hash = showSlug;		
		}, delay );
	}

	function showToggleClose ( showId, blockReset ) {
		console.log("showToggleClose", showId);
		var target = $("#" + showId).find(".show_content");
		target.css( "height", 0 ).removeClass("clicked");
		setTimeout( function(){
			// RESET READ MORE BUTTON + IMAGE LINK
			$("#" + showId).find(".show_toggle_text").css({
				"opacity"	: "1",
				"cursor"	: "" 
			});		
			// SCROLL BACK TO TOP
			// scroller( showId );			
			// RESET BG
			if ( !blockReset ) {
				console.log( 1198, blockReset );
				bgReset();
			} else {
				console.log( 1201, "Reset blocked." );
			}
		}, 1000 );
	}

	// 2.2.14

	function agendaCheck () {
		console.log("agendaCheck");
		$("#agenda .section_content").each( function(){
			// CHECK IF SHOW WRAPPERS
			var wrappers = $(this).find(".show_wrapper").length;
			// IF NO SHOWS HIDE HEADER
			if ( wrappers === 0 ) {
				$(this).prevUntil(".section_content").hide();
			}
		});
	}

	