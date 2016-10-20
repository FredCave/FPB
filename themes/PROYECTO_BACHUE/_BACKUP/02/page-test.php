<?php get_header(); ?>

	<style>
		#test_wrapper {
			background-color: black;
			width: 100%;
			height: 100vh;
			position: relative;
			overflow: hidden;
		}
		#test_wrapper section {
			border: 2px solid purple;
			width: 100%;
			height: 100%;
			position: absolute;
			top: 0;
			transition: top 0.5s;
		}
		#test_wrapper section:nth-child(even) {
			background-color: orange;
		}
		#test_wrapper section:nth-child(odd) {
			background-color: yellow;
		}
		.scroll_block {
			overflow: hidden;
		}
	</style>

	<script>

	$(document).on("ready", function(){

		var switchBlock = true;
		function _switchClasses ( direction ) {
			// CHECK IF FUNCTION BLOCKED TO AVOID RE-RUNNING TOO SOON
			switchBlock = false;
			if ( !switchBlock ) {
				console.log("_switchClasses", direction);
				if ( direction === "up" ) {
					$(".current").removeClass("current").prev().addClass("current").removeClass("scroll_block"); 
					$(".previous").removeClass("previous");
					$(".current").prev().addClass("previous");				
				} else if ( direction === "down" ) {
					$(".current").removeClass("current").next().addClass("current").removeClass("scroll_block");
				}
				// UPDATE CURRENT SECTION STORED IN WRAPPER
				var curr = $(".current").attr("data-content");
				console.log( 49, curr );
				$("#test_wrapper").attr( "data-current", curr );
				// UNBLOCK FUNCTION
				switchBlock = true;
			}
		}

		function _shiftUp(delta) {
			console.log("_shiftUp", "Current at bottom.");

			var current = $(".current"),
				prev = $(".previous"),
				currTop = parseInt( current.css("top") ),
				currH = $(".current").outerHeight(),
				multiple = 20;
				console.log( 91, "currTop: ", currTop, "currScrollTop: ", current.scrollTop() )

			// ADD SCROLL_BLOCK CLASS
			current.addClass("scroll_block");
			
			// IF SCROLLING DOWN
			if ( delta > 0 ) {
			
				console.log("Scrolling down.");
				// IF STILL ON SCREEN 
				if ( currH + currTop >= 0 ) {
					current.css({
						"top" : currTop - ( delta * multiple )
					});
				} else {
					// SWITCH CLASSES
					console.log("Switch classes.");
					
					_switchClasses("up");
				}
			
			// ELSE IF SCROLLING UP
			} else if ( delta < 0 ) {
			
				console.log("Scrolling up.");
				// CHECK IF CURRENT TOP > 0
				if ( currTop < 0 ) {
					var newTop = currTop - ( delta * multiple );
					console.log( 117, "newTop: ", newTop );
					if ( newTop >= 0 ) {
						newTop = 0;
					}
					current.css({
						"top" : newTop
					});
				} else {
					// REMOVE SCROLLING CLASS
					console.log( 126, "Remove scroll_block class." );
					current.removeClass("scroll_block");
					// SWITCH CLASSES
					//console.log("Switch classes.");
					// FIND WAY TO STOP SCROLLING UP.
					// switchBlock = false;
					// _switchClasses("down");
				}
			
			}
		}

		function _shiftDown(delta) {
			console.log("_shiftDown", "Current at top.");
		}

		function _edgeDetect(e) {
			console.log("_edgeDetect");
		//	e.preventDefault();
			var delta =  e.originalEvent.deltaY, // NEED CROSSBROWSER SOLUTION
				current = $(".current"); 

			console.log( 121, $("#test_wrapper").attr("data-current") );

			// IF CURRENT AT BOTTOM
			if ( current.scrollTop() + current.innerHeight() >= current[0].scrollHeight - 10 ) {
				// CHECK IF NOT LAST SECTION
				if ( $("#test_wrapper").attr("data-current") != 6 ) {
					_shiftUp(delta);
				}
			// IF CURRENT AT TOP
			} else if ( current.scrollTop() === 0 ) {
				// CHECK IF NOT FIRST SECTION
				if ( $("#test_wrapper").attr("data-current") != 1 ) {
					_shiftDown(delta);
				}
			} else {
				// ALLOW CURRENT TO SCROLL NORMALLY
				current.removeClass("scroll_block");
			}
		}

		var page = $("html, body");
		page.on("mousewheel wheel DOMMouseScroll", _.throttle(function(e){
			_edgeDetect(e);
		}, 100 ));	

	});

	</script>

	<div id="test_wrapper" data-current="1">

		<!-- NEWS -->
		<section id="section_1" data-content="6" class="scroll_block">
			<div class="content_wrapper">
				<?php include("includes/06_collection.php"); ?>
			</div>
		</section>

		<!-- ABOUT -->
		<section id="section_2" data-content="5" class="scroll_block">
			<div class="content_wrapper">
				<?php include("includes/05_archive.php"); ?>
			</div>
		</section>

		<!-- PUBLICATIONS -->
		<section id="section_3" data-content="4" class="scroll_block">
			<div class="content_wrapper">
				<?php include("includes/04_exhibitions.php"); ?>
			</div>
		</section>

		<!-- EXHIBITIONS -->
		<section id="section_4" data-content="3" class="scroll_block">
			<div class="content_wrapper">
				<?php include("includes/03_publications.php"); ?>
			</div>
		</section>

		<!-- ARCHIVE -->
		<section id="section_5" data-content="2" class="scroll_block">
			<div class="content_wrapper">
				<?php include("includes/02_about.php"); ?>
			</div>
		</section>

		<!-- COLLECTION -->
		<section id="section_6" data-content="1" class="current">
			<div class="content_wrapper">
				<?php include("includes/01_home.php"); ?>
			</div>
		</section>

	</div><!-- END OF TEST_WRAPPER -->

<?php get_footer(); ?>