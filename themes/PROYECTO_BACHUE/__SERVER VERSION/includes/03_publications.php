<?php require_once("03__publications_functions.php"); ?>

<div id="publicaciones" class="wrapper">

	<!-- INTRO TEXT -->
	<div class="col_1 col">
		<?php pb_get_pub_intro(); ?>
	</div><!-- END OF .COL_1 -->

	<!-- PREVIEW BANNER -->
	<div id="publications_banner" class="banner">
		<ul>
			<?php pb_get_pub_banner(); ?>
		</ul>
	</div>

	<!-- LIST -->
	<div id="publications_list" class="list">
		<ul>
			<?php pb_get_pub_list(); ?>
		</ul>
	</div>

</div>