<?php require_once("04__exhibitions_functions.php"); ?>

<div id="exposiciones" class="wrapper">

	<div class="col">
		<h2>Exposiciones</h2>
	</div>

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