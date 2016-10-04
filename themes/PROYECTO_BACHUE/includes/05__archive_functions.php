<?php

function pb_get_archive () {
	$news_query = new WP_Query( "post_type=news" );
	if ( $news_query->have_posts() ) :
		while ( $news_query->have_posts() ) : $news_query->the_post(); ?>		
			<li class="archive_post image_cell">

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