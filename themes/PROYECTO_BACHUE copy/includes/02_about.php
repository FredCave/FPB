<div id="sobre-nosotros" class="wrapper">

	<div class="col_1 col">
		<!-- ABOUT -->
		<?php 
		$about_query = new WP_Query( "name=sobre-proyecto-bachue" );
		if ( $about_query->have_posts() ) :
			while ( $about_query->have_posts() ) : $about_query->the_post(); ?>	
				<h2><?php the_title(); ?></h2>
				<div><?php the_content(); ?></div>
			<?php
				// IMAGE SAVED TO BE USED IN 2ND COLUMN
				$img = get_field( "about_image" );
			endwhile;
			wp_reset_postdata();
		endif; ?>
		<!-- COLLECTION TEXT -->
		<?php
		$coll_query = new WP_Query( "name=la-coleccion" );
		if ( $coll_query->have_posts() ) :
			while ( $coll_query->have_posts() ) : $coll_query->the_post(); ?>
				<h2><?php the_title(); ?></h2>
				<div><?php the_content(); ?></div>
			<?php
			endwhile;
			wp_reset_postdata();
		endif;
		?>
	</div>

	<div class="col_2 col">
		<!-- ABOUT IMAGE -->
		<div id="main_image">
			<?php pb_image_object( $img ); ?>
		</div>
		<!-- LINKS -->
		<?php
		$link_query = new WP_Query( "name=aliados" );
		if ( $link_query->have_posts() ) :
			while ( $link_query->have_posts() ) : $link_query->the_post(); 
				// CHECK IF ANY LINKS
				if ( have_rows("links") ) : ?>
					<div id="links">
						<ul>
							<h2><?php the_title(); ?></h2>
							<?php 
							// LOOP
							while ( have_rows("links") ) : the_row("link"); ?>
								<li>
									<a href="<?php the_sub_field('link_url'); ?>" target="_blank">
										<?php the_sub_field('link_name'); ?>
									</a>
								</li>
							<?php
							endwhile;
							?>
						</ul>
					</div><!-- END OF #LINKS -->
				<?php
				endif; // END OF LINK CHECK
			endwhile;
			wp_reset_postdata();
		endif;
		?>
	</div>

</div>