<?php

function pb_archive_filter ( $trads ) { ?>
	<div class="filter">
		<?php	
		$terms = get_terms( array (
		    'taxonomy' => 'archive-cat',
		    'exclude'  => 1 // UNCATEGORIZED
		) ); 
		echo "<select><option value='0' selected>";
		the_trad("trad_all",$trads);
		echo "</option>";
		?>		
		<?php
		foreach ( $terms as $term ) { ?>
			<option value="<?php echo $term->term_id; ?>"><?php echo $term->name; ?></option>
		<?php
		}
		echo "</select>";
		?>
	</div>
	<?php
}

function pb_archive_html_image () { ?>
	<?php if ( get_field( "archive_image" ) ) : ?>
		<div class="archive_image">
			<?php $image = get_field( "archive_image" ); 
				pb_image_object( $image ); ?>
		</div>
	<?php endif; ?>
<?php }

function pb_archive_html_title () { ?>
	<div class="archive_title">
		<?php the_title(); ?>
	</div>
<?php }

function pb_archive_html_text () { ?>
	<?php if ( get_field( "archive_text" ) ) : ?>
		<div class="archive_text">
			<?php the_trad_field( "archive_text" ); ?>
		</div>
	<?php endif; ?>	
<?php }

function pb_get_archive () {
	$news_query = new WP_Query( "post_type=news" );
	if ( $news_query->have_posts() ) :
		while ( $news_query->have_posts() ) : $news_query->the_post(); 
			// GET CATEGORIES
			$cat = get_the_terms( $post->ID, "archive-cat" );
			echo '<li class="archive_post image_cell" data-cat="' . $cat[0]->term_id . '">';

				// ECHO IMAGE HTML
				pb_archive_html_image();

				// ECHO TITLE 
				pb_archive_html_title();

				// ECHO TEXT
				pb_archive_html_text();

			echo '</li>'; // END OF .ARCHIVE_POST
	
			endwhile;
		wp_reset_postdata();
	endif;	
}			

?>