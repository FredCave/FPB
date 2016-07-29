<div id="news_wrapper" class="wrapper">
	<ul id="news_list">
		<?php 
			$args = array(
				"post_type" 		=> "news",
				"posts_per_page"	=> 4
			);
			$news_query = new WP_Query( $args );
			if ( $news_query->have_posts() ) :
				while ( $news_query->have_posts() ) : $news_query->the_post(); ?>
					<?php 
						$image = get_field( "news_image" ); 
						if ( $image['sizes'][ 'thumbnail-width' ] > $image['sizes'][ 'thumbnail-height' ] ) {
							$class = "card_landscape";
						} else {
							$class = "card_portrait";	
						}
					?>
					<li class="news_post <?php echo $class; ?>">
						<div class="news_post_card ">
							<!-- IMAGE -->
							<div class="face front">
								<?php pb_image_object( $image ); ?>
							</div>
							<!-- TEXT -->
							<div class="face back">
								<?php the_content(); ?>
							</div>
						</div>					
					</li>
					<?php
				endwhile;
				wp_reset_postdata();
			endif;
		?>
	</ul>
</div>