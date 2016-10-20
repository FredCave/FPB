<?php require_once("06__collection_functions.php"); ?>

<!-- SEARCH FILTER -->
<div id="coll_filter">
	<?php echo pb_coll_filter(); ?>
</div>

<!-- COLLECTION LIST -->
<ul id="coll_list" class="image_grid" data-col="3">
	<?php pb_coll_list(); ?>
</ul>