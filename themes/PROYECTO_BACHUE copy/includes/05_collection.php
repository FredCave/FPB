<div id="la-collecion" class="wrapper">
	<ul id="collection_list" class="image_grid">
		<?php 
			$args = array(
				"post_type" => "collection"
			);
			$coll_query = new WP_Query( $args );
			if ( $coll_query->have_posts() ) :
				while ( $coll_query->have_posts() ) : $coll_query->the_post(); ?>
					
					<?php /*
						IMAGE
						CATEGORY
						TECHNICAL INFO
						TEXT
					*/ ?>

					<li class="coll_post image_cell">
						<!--
						<div class="image_small image_cell_toggle">
							<div class="coll_image">
								<?php 
								$image = get_field( "coll_image" );
								pb_image_object( $image );
								?>
							</div>
							<div class="coll_title">
								<h1><?php the_title(); ?></h1>
								<h1><?php the_field( "coll_artist" ); ?>, <?php the_field( "coll_date" ); ?></h1>
							</div>		
						</div>

						<div class="image_large">
						-->
						<div>
							<!--
							<div class="image_cell_close">
								<img src="<?php bloginfo( 'template_url' ); ?>/img/close.svg" />
							</div>
							-->
							<div class="expanded_content">
								<div class="coll_expanded_left">
									<div>
										<h1><?php the_title(); ?></h1>
										<h1><?php the_field( "coll_artist" ); ?></h1>
									</div>
									<div>
										<?php
										// DATE
										if ( get_field( "coll_date" ) ) {
											echo "Fecha de creación : " . get_field( "coll_date" ) . "<br>";
										}
										// DIMENSIONS
										if ( get_field( "coll_dimensions" ) ) {
											echo "Dimensiones : " . get_field( "coll_dimensions" ) . "<br>";
										}
										// TECHNIQUE
										if ( get_field( "coll_technique" ) ) {
											echo "Técnica : " . get_field( "coll_technique" ) . "<br>";
										}
										?>
									</div>
									<div>
										<?php
										// TEXT
										if ( get_field( "coll_text" ) ) {
											the_field( "coll_text" );
										}
										?>
									</div>
								</div>
								<div class="coll_expanded_right">
									<?php
									$image = get_field( "coll_image" );
									pb_image_object( $image );
									?>
								</div>
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