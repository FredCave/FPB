<?php require_once("02__about_functions.php"); ?>

<div id="sobre-nosotros" class="wrapper">

	<div class="col_1 col">
		<!-- ABOUT -->
		<?php echo pb_get_about(); ?>

		<!-- COLLECTION TEXT -->
		<?php echo pb_get_collection(); ?>

	</div>

	<div class="col_2 col">
		<!-- ABOUT IMAGE -->
		<div id="main_image">
			<?php 
			$img = pb_get_about_img();
			pb_image_object( $img ); ?>
		</div>
		<!-- LINKS -->
		<?php pb_get_links(); ?>
	</div>

</div>