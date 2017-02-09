<?php require_once("05__archive_functions.php"); ?>

<div id="noticias" class="wrapper">
	
	<h2><?php the_trad("trad_news",$trads); ?></h2>

	<div id="archive_filter" class="filter_wrapper">
		<span><?php the_trad("trad_filter", $trads); ?></span>
		<?php pb_archive_filter( $trads ); ?>
	</div>

	<ul id="news" class="image_grid" data-col="4">
		<?php pb_get_archive(); ?>
	</ul>
	
</div>