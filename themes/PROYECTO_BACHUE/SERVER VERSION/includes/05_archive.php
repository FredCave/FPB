<?php require_once("05__archive_functions.php"); ?>

<div id="noticias" class="wrapper">
	
	<!-- 
		PAGINATION?????
	-->

	<div id="archive_filter" class="filter_wrapper">
		<?php 
		echo $trads["trad_filter"][1];
		pb_archive_filter( $trads ); ?>
	</div>

	<ul id="news" class="image_grid" data-col="4">
		<?php pb_get_archive(); ?>
	</ul>
	
</div>