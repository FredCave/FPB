<?php

function pb_get_archive () {
	$news_query = new WP_Query( "post_type=news" );
	if ( $news_query->have_posts() ) :
		while ( $news_query->have_posts() ) : $news_query->the_post(); ?>		
			<li class="news_post image_cell">

				<!-- IMAGE -->
				<?php if ( get_field( "news_image" ) ) : ?>
					<div class="news_image">
						<?php 	
							$image = get_field( "news_image" ); 
							pb_image_object( $image ); 
						?>
					</div>
				<?php endif; ?>
				
				<!-- LINK / TITLE -->
				<div class="news_title">
					<?php if ( get_field('news_link') ) { ?>
						<a href="" target="_blank">
							<?php the_title(); ?>
						</a>
					<?php } else {
						the_title();
					} ?>
				</div>

				<!-- TEXT - IF NO IMAGE -->
				<?php if ( !get_field( "news_image" ) && get_field( "news_text" ) ) : ?>
					<div class="news_text">
						<?php the_field( "news_text" ); ?>
					</div>
				<?php endif; ?>				

			</li><!-- END OF .ARCHIVE_POST -->
	
			<?php 
			endwhile;
		wp_reset_postdata();
	endif;	
}			

?>