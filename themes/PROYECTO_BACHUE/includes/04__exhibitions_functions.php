<?php

function pb_get_exhib_list () {
	$list_query = new WP_Query( "post_type=exhibitions" );
	if ( $list_query->have_posts() ) :
		while ( $list_query->have_posts() ) : $list_query->the_post(); ?>	
			<li class="exhib_list_post">
				<div class="col col_1">
					<div class="exhib_list_title">
						<h1><?php the_title(); ?></h1>
						<p class="exhib_list_author">
							<?php /* if ( get_field( "publication_author" ) ) {
								echo get_field( "publication_author" );
							} */ ?>
						</p>
					</div>
	
					<div class="exhibition_text">
						<?php the_field( "exhibition_text" ); ?>
					</div>

				</div>
				<div class="col col_2">

				</div>

				<?php // GALLERY
				if ( get_field("exhibition_images") ) { ?>
					<ul class="exhibition_images image_grid" data-col="3" >
						<?php 
						if ( have_rows( "exhibition_images" ) ) {	
							while ( have_rows( "exhibition_images" ) ) : the_row( "exhibition_images" ); ?>
								<li class="image_cell">
									<div class="image_small image_cell_toggle">
										<?php
										$image = get_sub_field( "exhibition_image" );
										pb_image_object( $image );
										?>
									</div>
								</li>
							<?php
							endwhile;
						}
						?>
					</ul>
				<?php // END OF IF
				} ?>

			</li>
		<?php
		endwhile;
		wp_reset_postdata();
	endif;
}

?>