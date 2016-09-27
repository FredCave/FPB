<?php require_once("05__archive_functions.php"); ?>

<div id="noticias" class="wrapper">
	
	<?php /*
		NEED TO BE ABLE TO FILTER BY CATEGORY
		+ PAGINATION ????
	*/ ?>

	<ul id="news" class="image_grid" data-col="4">
		<?php pb_get_archive(); ?>
	</ul>
	
</div>