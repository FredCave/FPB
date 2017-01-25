<?php require_once("04__exhibitions_functions.php"); ?>

<div id="exposiciones" class="wrapper">

	<!-- INTRO TEXT -->
	<div class="col_1 col">
		<?php pb_get_exhib_intro(); ?>
	</div><!-- END OF .COL_1 -->

	<!-- PREVIEW BANNER -->
	<div id="exhibitions_banner" class="banner">
		<ul>
			<?php pb_get_exhib_banner(); ?>
		</ul>
	</div>

	<!-- LIST -->
	<div id="exhibitions_list" class="list">
		<ul>
			<?php pb_get_exhib_list(); ?>
		</ul>
	</div>

</div>