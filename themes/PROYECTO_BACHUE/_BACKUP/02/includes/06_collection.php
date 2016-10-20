<?php require_once("06__collection_functions.php"); ?>

<div id="la-coleccion" class="wrapper">

	<!-- PASSWORD FORM -->
	<div id="coll_password" class="hide">
		<?php echo pb_password_form(); ?>
	</div>

	<?php /*
	<!-- LOAD CONTENT IN AJAX -->
	<div id="coll_content">
		<div class="content_wrapper"><!-- AJAX APPENDED HERE --></div>
	</div> */ ?>

	<!-- TMP -->
	<div id="coll_content">
		<div class="ajax_wrapper">
			<!-- SEARCH FILTER -->
			<div id="coll_filter">
				<?php echo pb_coll_filter(); ?>
			</div>
			<!-- COLLECTION LIST -->
			<ul id="coll_list" class="image_grid" data-col="3">
				<?php pb_coll_list(); ?>
			</ul>
		</div>
	</div>
	<!-- END OF TMP -->

</div>