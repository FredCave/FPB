<?php require_once("06__collection_functions.php"); ?>
<?php include("00__strings.php"); ?>

<!-- SEARCH FILTER -->
<div id="coll_filter" class="filter_wrapper">
	<?php echo pb_coll_filter( $trads ); ?>
</div>
<!-- COLLECTION LIST -->
<ul id="coll_list" class="image_grid" data-col="6">
	<?php pb_coll_list(); ?>
</ul>