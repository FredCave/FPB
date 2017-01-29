<?php

function pb_get_pub_intro ( $trads ) {
	$pub_query = new WP_Query( "name=publicaciones" );
	if ( $pub_query->have_posts() ) :
		while ( $pub_query->have_posts() ) : $pub_query->the_post(); ?>	
			<h2><?php the_trad("trad_pub",$trads); ?></h2>
			<div><?php echo preg_replace('~\s?<p>(\s|&nbsp;)+</p>\s?~', '', get_field( "publications_text" ) ); ?></div>
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

function pb_pub_html_image () { ?>
	<div class="col col_2">
		<div class="pub_image">
			<?php
			$image = get_field( "publication_image" ); 
			pb_image_object( $image );
			?>
		</div>
	</div>
<?php }

function pb_pub_get_video() {
	if ( get_field("publication_video") ) {
		// RETURNS IFRAME TAG
		$pub_video = get_field("publication_video");
		$pub_video = str_replace( "src", "data-src", $pub_video );
		echo $pub_video;
	}	
}

function pb_pub_get_pdf () {
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
	<?php } 
}

function pb_pub_html_info ($trads) { ?>
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
			<p class="pub_list_price"><?php the_trad("trad_price",$trads); ?>: <?php the_field( "publication_price" ); ?> pesos COP</p>
		<?php endif; ?>

		<div class="pub_list_text">
			<?php the_trad_field( "publication_text" );
			// IF VIDEO 
			pb_pub_get_video(); ?>
		</div>

		<?php pb_pub_get_pdf(); // IF PDF ?>

	</div>
<?php }

function pb_pub_html_spread_cell () { ?>
	<li class="image_cell">
		<div class="image_small image_cell_toggle">
			<?php $image = get_sub_field( "publication_spread" );
			pb_image_object( $image ); ?>
		</div>
	</li>
<?php }

function pb_get_pub_list ( $trads ) {
	$list_query = new WP_Query( "post_type=publications" );
	if ( $list_query->have_posts() ) :
		while ( $list_query->have_posts() ) : $list_query->the_post(); 
			echo '<li id="' . get_post()->ID . '" class="list_post">';
				// ECHO IMAGE COLUMN
				pb_pub_html_image();
				// INFO COLUMN
				pb_pub_html_info( $trads );

				// SPREADS - ONLY IF NO PDF
				if ( get_field("publication_spreads") && !$pdf ) {
					// DOUBLE CHECK: IF FIRST IMAGE FIELD IS EMPTY
					if ( get_field("publication_spreads")[0]['publication_spread'] ) {
						echo '<ul class="pub_list_spreads image_grid" data-col="4" >';
							if ( have_rows( "publication_spreads" ) ) {	
								while ( have_rows( "publication_spreads" ) ) : the_row( "publication_spreads" );
									// ECHO CELL HTML
									pb_pub_html_spread_cell();
								endwhile;
							}
						echo '</ul>';
						} // END OF DOUBLE CHECK
					}
			echo '</li>';
		endwhile;
		wp_reset_postdata();
	endif;
}

?>