<?php

function pb_get_home () {
	$about_query = new WP_Query( "name=home" );
	if ( $about_query->have_posts() ) :
		while ( $about_query->have_posts() ) : $about_query->the_post();
			// IF HAVE VIDEO
			if ( get_field( "home_video" ) ) { ?>
				<div id="home_video">
					<?php the_field( "home_video" ); ?>
				</div>
			<?php
			// ELSE IMAGES
			} else if ( get_field( "home_images" ) ) {
				if ( count( get_field( "home_images" ) ) === 1 ) {
					// IF ONE IMAGE ?>
					<div id="home_single_image">
						SINGLE IMAGE
					</div>
				<?php
				} else if ( count( get_field( "home_images" ) ) > 1 ) {
					// MULTIPLE IMAGES	?>
					<div id="home_multiple_images">
						MULTIPLE IMAGES
					</div>
				<?php
				}
			}
		endwhile;
		wp_reset_postdata();
	endif; 	
}

?>