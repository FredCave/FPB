<?php get_header(); ?>

	<!-- NAV BAR -->
	<?php include("includes/00_nav.php"); ?>

	<div id="wrapper">

		<!-- WRAPPERS FOR CURRENT, PREVIOUS + NEXT -->

		<section id="section_1" class="previous" data-content="">
			<div class="content_wrapper"></div>
		</section>

		<section id="section_2" class="current" data-content="1">
			<div class="content_wrapper"></div>
			<!-- THIS WRAPPER IS HIDDEN AFTER FIRST SHIFT -->
			<div class="initial_wrapper">
				<?php include("includes/01_home.php"); ?>
			</div>
		</section>

		<section id="section_3" class="next" data-content="2">
			<div class="content_wrapper">
				<?php include("includes/02_about.php"); ?>
			</div>
		</section>

	</div><!-- END OF WRAPPER -->

	<!-- STORED CONTENT -->

	<div id="store" class="hide">
		<div id="content_1" class="content">
			<?php include("includes/01_home.php"); ?>
		</div>
		<div id="content_2" class="content">
			<?php include("includes/02_about.php"); ?>
		</div>
		<div id="content_3" class="content">
			<?php include("includes/03_publications.php"); ?>
		</div>
		<div id="content_4" class="content">
			<?php include("includes/04_exhibitions.php"); ?>
		</div>
		<div id="content_5" class="content">
			<?php include("includes/05_archive.php"); ?>
		</div>
		<div id="content_6" class="content">
			<?php include("includes/06_collection.php"); ?>
		</div>
	</div>

<?php get_footer(); ?>