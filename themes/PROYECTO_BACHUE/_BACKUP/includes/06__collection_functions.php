<?php

function pb_get_collection () {
	$coll_query = new WP_Query( "post_type=collection" );
	if ( $coll_query->have_posts() ) :
		while ( $coll_query->have_posts() ) : $coll_query->the_post(); ?>
			
			<?php /*
				IMAGE
				CATEGORY
				TECHNICAL INFO
				TEXT
			*/ ?>

			<li class="coll_post image_cell">

				<?php if ( get_field( "coll_image" ) ) { ?>		
					<div class="coll_image">
						<?php 
						$image = get_field( "coll_image" );
						pb_image_object( $image );
						?>
					</div>
				<?php } ?>

				<div class="coll_title">
					<h1><?php the_title(); ?></h1>
					<h1><?php the_field( "coll_artist" ); ?>, <?php the_field( "coll_date" ); ?></h1>
				</div>
				
				<!-- CONTENT TO BE LOADED IN GRID_LARGE -->
				<div class="hidden_content hide">

					<div class="col col_1">
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
							// EXHIBITIONS
							if ( get_field( "coll_exhibitions" ) ) { ?>
								<p>Curadurías :</p>
								<div>
									<?php the_field( "coll_exhibitions" ); ?>
								</div>
							<?php
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

					<div class="col col_2">
						<div class="coll_image">
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
}

?>