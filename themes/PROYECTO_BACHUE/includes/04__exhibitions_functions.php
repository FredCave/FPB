<?php

function pb_get_exhib_intro ( $trads ) {
	$exhib_query = new WP_Query( "name=exposiciones" );
	if ( $exhib_query->have_posts() ) :
		while ( $exhib_query->have_posts() ) : $exhib_query->the_post(); ?>	
			<h2><?php the_trad("trad_exh",$trads); ?></h2>
			<div><?php the_trad_field( "exhibitions_text" ); ?></div>
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

function pb_exhib_html_info () { ?>
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
			<?php the_trad_field( "exhibition_text" ); ?>
		</div>

	</div>	
<?php }

function pb_exhib_html_image () { ?>
	<li class="image_cell">
		<div class="image_small image_cell_toggle">
			<?php $image = get_sub_field( "exhibition_image" );
			pb_image_object( $image ); ?>
		</div>
	</li>
<?php }

function pb_get_exhib_list () {
	$list_query = new WP_Query( "post_type=exhibitions" );
	if ( $list_query->have_posts() ) :
		while ( $list_query->have_posts() ) : $list_query->the_post();
			echo '<li id="' .  get_post()->ID . '" class="list_post">';
				// ECHO INFO HTML
				pb_exhib_html_info();
				// GALLERY 
				echo '<div class="col col_2">';
				if ( get_field("exhibition_images") ) {
					echo '<ul class="exhibition_images image_grid" data-col="2" >'; 
						if ( have_rows( "exhibition_images" ) ) :	
							while ( have_rows( "exhibition_images" ) ) : the_row( "exhibition_images" ); 
								pb_exhib_html_image();
							endwhile;
						endif;
					echo '</ul>';
				} 
				echo '</div>'; // END OF GALLERY COL
			echo '</li>';
		endwhile;
		wp_reset_postdata();
	endif;
}

?>