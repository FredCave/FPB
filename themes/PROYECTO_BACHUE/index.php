<?php get_header(); ?>

	<!-- NAV BAR -->
	<?php include("includes/00_nav.php"); ?>

	<div id="wrapper" data-current="1">

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

	</div><!-- END OF WRAPPER -->

<?php get_footer(); ?>