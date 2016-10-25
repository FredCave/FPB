<?php

function pb_get_exhib_intro () {
	$pub_query = new WP_Query( "name=exposiciones" );
	if ( $pub_query->have_posts() ) :
		while ( $pub_query->have_posts() ) : $pub_query->the_post(); ?>	
			<h2><?php the_title(); ?></h2>
			<div><?php the_content(); ?></div>
		<?php
		endwhile;
		wp_reset_postdata();
	endif;	
}

function pb_get_exhib_banner () {
	$banner_query = new WP_Query( "post_type=exhibitions" );
	if ( $banner_query->have_posts() ) :
		while ( $banner_query->have_posts() ) : $banner_query->the_post(); ?>	
			<a class="banner_link" href="" data-link="<?php echo get_post()->ID; ?>">
				<li class="banner_post">
					<div class="banner_image">
						<?php 
						if ( get_field("exhibition_images") ) {
							// GET FIRST IMAGE FROM REPEATER
							$rows = get_field("exhibition_images");
							$first_row = $rows[0];
							$image = $first_row["exhibition_image"]; 
							pb_image_object( $image );
						}
						?>
					</div>
					<div class="banner_title">
						<?php the_title(); ?>
					</div>
				</li>
			</a>
		<?php
		endwhile;
		wp_reset_postdata();
	endif; 
}

function pb_get_exhib_list () {
	$list_query = new WP_Query( "post_type=exhibitions" );
	if ( $list_query->have_posts() ) :
		while ( $list_query->have_posts() ) : $list_query->the_post(); ?>	
			<li id="<?php echo get_post()->ID; ?>" class="list_post">
				<!-- COL 1 -->
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
				<!-- END OF COL 1 -->
				<!-- COL 2 -->
				<div class="col col_2">
					<?php // GALLERY
					if ( get_field("exhibition_images") ) { ?>
						<ul class="exhibition_images image_grid" data-col="2" >
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
				</div>
				<!-- END OF COL 2 -->
			</li>
		<?php
		endwhile;
		wp_reset_postdata();
	endif;
}

?>