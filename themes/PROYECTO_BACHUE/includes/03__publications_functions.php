<?php

function pb_get_pub_intro () {
	$pub_query = new WP_Query( "name=publicaciones" );
	if ( $pub_query->have_posts() ) :
		while ( $pub_query->have_posts() ) : $pub_query->the_post(); ?>	
			<h2><?php the_title(); ?></h2>
			<div><?php the_content(); ?></div>
		<?php
		endwhile;
		wp_reset_postdata();
	endif;	
}

function pb_get_pub_banner () {
	$banner_query = new WP_Query( "post_type=publications" );
	if ( $banner_query->have_posts() ) :
		while ( $banner_query->have_posts() ) : $banner_query->the_post(); ?>	
			<a class="banner_link" href="" data-link="<?php echo get_post()->ID; ?>">
				<li class="banner_post">
					<div class="banner_image">
						<?php 
						$image = get_field( "publication_image" );  
						pb_image_object( $image );
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

function pb_get_pub_list () {
	$list_query = new WP_Query( "post_type=publications" );
	if ( $list_query->have_posts() ) :
		while ( $list_query->have_posts() ) : $list_query->the_post(); ?>	
			<li id="<?php echo get_post()->ID; ?>" class="list_post">
				<div class="col col_2">
					<div class="pub_image">
						<?php
						$image = get_field( "publication_image" ); 
						pb_image_object( $image );
						?>
					</div>
				</div>
				<div class="col col_1">
					<div class="pub_list_title">
						<h1><?php the_title(); ?></h1>
						<p class="pub_list_author">
							<?php if ( get_field( "publication_author" ) ) {
								echo get_field( "publication_author" );
							} ?>
						</p>
					</div>

					<?php if ( get_field( "publication_price" ) ) : ?>
						<p class="pub_list_price">Precio: <?php the_field( "publication_price" ); ?> pesos COP</p>
					<?php endif; ?>
	
					<div class="pub_list_text">
						<?php the_field( "publication_text" ); ?>
						<!-- CHECK IF VIDEO -->
						<?php if ( get_field("publication_video") ) {
							// RETURNS IFRAME TAG
							$pub_video = get_field("publication_video");
							$pub_video = str_replace( "src", "data-src", $pub_video );
							echo $pub_video;
						} ?>
					</div>

					<?php 
					// RESET $PDF VARIABLE
					$pdf = "";
					if ( get_field("publication_pdf") ) { ?>
						<!-- LINK -->
						<?php 
						$pdf = get_field("publication_pdf");
						$pdf_link = $pdf["url"];
						$pdf_name = $pdf["filename"];
						?>
						<a href="<?php echo $pdf_link; ?>" target="_blank">
							<?php echo $pdf_name; ?>
						</a>
					<?php } ?>

				</div>

				<?php // SPREADS - ONLY IF NO PDF -->
				if ( get_field("publication_spreads") && !$pdf ) {
					// DOUBLE CHECK: IF FIRST IMAGE FIELD IS EMPTY
					if ( get_field("publication_spreads")[0]['publication_spread'] ) { ?>
						<ul class="pub_list_spreads image_grid" data-col="4" >
							<?php 
							if ( have_rows( "publication_spreads" ) ) {	
								while ( have_rows( "publication_spreads" ) ) : the_row( "publication_spreads" ); ?>
									<li class="image_cell">
										<div class="image_small image_cell_toggle">
											<?php
											$image = get_sub_field( "publication_spread" );
											pb_image_object( $image );
											?>
										</div>
									</li>
								<?php
								endwhile;
							}
							?>
						</ul>
					<?php } // END OF DOUBLE CHECK
					} ?>

			</li>
		<?php
		endwhile;
		wp_reset_postdata();
	endif;
}

 

?>