<?php get_header(); ?>

	<style>
		#test_wrapper {
			background-color: black;
			width: 100%;
			height: 100vh;
			position: relative;
		}
		#test_wrapper section {
			border: 1px solid purple;
			width: 100%;
			height: 100vh;
			position: fixed;
			pointer-events: none;
		}
		#test_wrapper section.liberated {
			position: absolute;
			margin-bottom: 300vh;
			pointer-events: auto;
		}
		#test_wrapper section:nth-child(even) {
			background-color: orange;
		}
		#test_wrapper section:nth-child(odd) {
			background-color: yellow;
		}
	</style>

	<script>

	$(document).on("ready", function(){

		function libCheck ( ) {
			console.log("libCheck");
			var _this 	= $(".liberated"),
				top 	= _this.offset().top,
				bottom 	= top + _this.height();
				if ( bottom < 0 ) {
					_this.prev().addClass("liberated");
					// _this.removeClass("liberated");
				}
		}

		$("html, body").on( "scroll", function(){
			libCheck();
		});		

	});

	</script>

	<div id="test_wrapper">

		<!-- NEWS -->
		<section id="section_1">
		</section>

		<!-- ABOUT -->
		<section id="section_2"></section>

		<!-- PUBLICATIONS -->
		<section id="section_3"></section>

		<!-- EXHIBITIONS -->
		<section id="section_4"></section>

		<!-- ARCHIVE -->
		<section id="section_5"></section>

		<!-- COLLECTION -->
		<section id="section_6" class="liberated"></section>

	</div><!-- END OF TEST_WRAPPER -->

<?php get_footer(); ?>