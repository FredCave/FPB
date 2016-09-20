<div id="noticias" class="wrapper">
	
	<!-- FILTER HERE -->

	<ul id="archive_list" class="image_grid">
		<?php 
			$args = array(
				"post_type" => "news"
			);
			$news_query = new WP_Query( $args );
			if ( $news_query->have_posts() ) :
				while ( $news_query->have_posts() ) : $news_query->the_post(); ?>
					
					<?php /*
						NEED TO BE ABLE TO FILTER BY TYPE
						DATE
						IMAGE 
						SHORT TEXT
						MAIN TEXT
					*/ ?>

					<li class="archive_post image_cell collapsed">
						<!--
						<div class="image_small">
							<h1 class="image_cell_toggle"><?php the_title(); ?></h1>
							<div>	
								<?php the_field( "news_extract" ); ?>
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
								<div class="large_left">
									<h1><?php the_title(); ?></h1>
									<h1><?php the_time( get_option( 'date_format' ) ); ?></h1>
									<div>
										<?php the_field( "news_text" ); ?>
									</div>
								</div>
								<div class="large_right">
									<?php 
									$image = get_field( "news_image" ); 
									pb_image_object( $image );
									?> 								
								</div>
								
								<?php if ( get_field("news_extra_images") ) { ?>
									<!-- EXTRA IMAGES -->
									<ul class="archive_list_spreads">
										<?php 
										if ( have_rows( "news_extra_images" ) ) {	
											while ( have_rows( "news_extra_images" ) ) : the_row( "news_extra_images" ); ?>
												<li class="">
													<div class="">
														<?php
														$image = get_sub_field( "news_extra_image" );
														pb_image_object( $image );
														?>
													</div>
													<div class="">
														<!--
														<div class="image_cell_close">
															<img src="<?php bloginfo( 'template_url' ); ?>/img/close.svg" />
														</div>
														
														<div class="">
															<?php
															$image = get_sub_field( "news_extra_image" );
															pb_image_object( $image );
															?>
														</div>
														-->
													</div>
												</li>
											<?php
											endwhile;
										}
										?>
									</ul>
								<?php } ?>

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