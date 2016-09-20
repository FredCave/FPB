<div id="publicaciones" class="wrapper">

	<!-- INTRO TEXT -->
	<div class="col_1 col">
		<?php 
		$pub_query = new WP_Query( "name=publicaciones" );
		if ( $pub_query->have_posts() ) :
			while ( $pub_query->have_posts() ) : $pub_query->the_post(); ?>	
				<h2><?php the_title(); ?></h2>
				<div><?php the_content(); ?></div>
			<?php
			endwhile;
			wp_reset_postdata();
		endif; ?>
	</div><!-- END OF .COL_1 -->

	<!-- PREVIEW BANNER -->
	<div id="publications_banner">
		<ul>
			<?php
			$args = array(
				"post_type" => "publications"
			); 
			$banner_query = new WP_Query( $args );
			if ( $banner_query->have_posts() ) :
				while ( $banner_query->have_posts() ) : $banner_query->the_post(); ?>	
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
				<?php
				endwhile;
				wp_reset_postdata();
			endif; ?>
		</ul>
	</div>

	<!-- LIST -->
	<div id="publications_list">
		<ul>
			<?php
			$args = array(
				"post_type" => "publications"
			); 
			$list_query = new WP_Query( $args );
			if ( $list_query->have_posts() ) :
				while ( $list_query->have_posts() ) : $list_query->the_post(); ?>	
					<li class="pub_list_post">
						<div class="large_left">
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
						<div class="large_right">
							<?php
							$image = get_field( "publication_image" ); 
							pb_image_object( $image );
							?>
						</div>

						<?php // SPREADS - ONLY IF NO PDF -->
						if ( get_field("publication_spreads") && !$pdf ) {
							// DOUBLE CHECK: IF FIRST IMAGE FIELD IS EMPTY
							if ( get_field("publication_spreads")[0]['publication_spread'] ) { ?>
								<ul class="pub_list_spreads image_grid">
									<?php 
									if ( have_rows( "publication_spreads" ) ) {	
										while ( have_rows( "publication_spreads" ) ) : the_row( "publication_spreads" ); ?>
											<li class="image_cell">
												<div class="image_small">
													<?php
													$image = get_sub_field( "publication_spread" );
													pb_image_object( $image, "image_cell_toggle" );
													?>
												</div>
												<div class="image_large">
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
			endif; ?>
		</ul>
	</div>



</div>