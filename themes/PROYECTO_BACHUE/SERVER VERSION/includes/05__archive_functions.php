<?php

function pb_archive_filter ( $trads ) { ?>
	<div class="filter">
		<?php	
		$terms = get_terms( array (
		    'taxonomy' => 'archive-cat',
		    'exclude'  => 1 // UNCATEGORIZED
		) ); 
		echo "<select><option value='0' selected>" . $trads["trad_all"][1] . "</option>";
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

function pb_get_archive () {
	$news_query = new WP_Query( "post_type=news" );
	if ( $news_query->have_posts() ) :
		while ( $news_query->have_posts() ) : $news_query->the_post(); 
			// GET CATEGORIES
			$cat = get_the_terms( $post->ID, "archive-cat" );
			// var_dump( $cat );
			?>		
			<li class="archive_post image_cell" data-cat="<?php echo $cat[0]->term_id; ?>">

				<!-- IMAGE -->
				<?php if ( get_field( "archive_image" ) ) : ?>
					<div class="archive_image">
						<?php 	
							$image = get_field( "archive_image" ); 
							pb_image_object( $image ); 
						?>
					</div>
				<?php endif; ?>
				
				<!-- LINK / TITLE -->
				<div class="archive_title">
					<?php if ( get_field('archive_link') ) { ?>
						<a href="" target="_blank">
							<?php the_title(); ?>
						</a>
					<?php } else {
						the_title();
					} ?>
				</div>

				<!-- TEXT - IF NO IMAGE -->
				<?php if ( !get_field( "archive_image" ) && get_field( "archive_text" ) ) : ?>
					<div class="archive_text">
						<?php the_field( "archive_text" ); ?>
					</div>
				<?php endif; ?>				

			</li><!-- END OF .ARCHIVE_POST -->
	
			<?php 
			endwhile;
		wp_reset_postdata();
	endif;	
}			

?>