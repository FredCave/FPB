<?php

function pb_get_home () {
	$about_query = new WP_Query( "name=home" );
	if ( $about_query->have_posts() ) :
		while ( $about_query->have_posts() ) : $about_query->the_post();
			// IF HAVE VIDEO
			if ( get_field( "home_video" ) ) { ?>
				<div id="home_video">
					<?php // the_field( "home_video" ); ?>
					<!--
					<embed 
					wmode="opaque" 
					salign="tl" 
					allowscriptaccess="never" 
					allowfullscreen="true" 
					scale="scale" 
					quality="high" 
					bgcolor="#FFFFFF" 
					name="swf_u_jsonp_2_2b" 
					id="swf_u_jsonp_2_2b" 
					style="display: block;" 
					src="https://youtu.be/NvajLEnq1Jw" 
					type="application/x-shockwave-flash">-->
					<embed src="https://youtu.be/NvajLEnq1Jw" >
				</div>
			<?php
			// ELSE IMAGES
			} else if ( get_field( "home_images" ) ) {
				if ( count( get_field( "home_images" ) ) === 1 ) {
					// IF ONE IMAGE ?>
					<div id="home_single_image">	
						<?php 
						$img = get_field("home_images")[0]["home_image"];
						pb_image_object( $img );
						?>
					</div>
				<?php
				} else if ( count( get_field( "home_images" ) ) > 1 ) {
					// MULTIPLE IMAGES	?>
					<div id="home_multiple_images">
						<ul>
							<?php if ( have_rows( "home_images" ) ) {	
								// MAX 5 IMAGES
								$i = 1;
								while ( have_rows( "home_images" ) ) : the_row( "home_images" ); 
									if ( $i <= 5 ) { 
										$link = "";
										if ( get_sub_field("home_internal") ) {
											// INTERNAL LINK
											$link_info = get_sub_field("home_internal");
											$p_type = $link_info[0]->post_type;
											if ( $p_type == "publications" ) {
											    $section = 3;
											} elseif ( $p_type == "exhibitions" ) {
											    $section = 4;
											} elseif ( $p_type == "news" ) {
											    $section = 5;
											} elseif ( $p_type == "collection" ) {
												$section = 6;
											}
											$link = "int_" . $section . "_" . $link_info[0]->ID;
										} else if ( get_sub_field("home_external") ) {
											// EXTERNAL LINK
											$link = get_sub_field("home_external");
										}
										// var_dump($link_info);
										?>
										<li class="home_multiple_image" data-link="<?php echo $link; ?>">
											<!-- IMAGE -->
											<div class="home_image">
												<?php
												$img = get_sub_field( "home_image" );
												pb_image_object( $img );
												?>
											</div>
											<!-- CAPTION -->
											<div class="home_caption">
												<?php if ( get_sub_field("caption_piece_name") ) { ?>
													<span class="home_piece_name"><?php the_sub_field("caption_piece_name"); ?></span>, 
												<?php } 
												if ( get_sub_field("caption_artist_name") ) {
													the_sub_field("caption_artist_name");
													echo ". ";
												} 
												if ( get_sub_field("caption_exhibition_name") ) {
													the_sub_field("caption_exhibition_name");
													echo ". ";
												} ?>
											</div>
										</li>
										<!-- TEXT + LINK -->
										<?php if ( get_sub_field("home_text") ) { ?>
											<div class="home_text" data-left="" data-top="">
												<div class="home_close"></div>
												<span>
													<?php the_sub_field("home_text"); ?>
												</span>
												<div class="text_link">
													<a href="">See More</a>
												</div>
											</div>	
										<?php } ?>											
									<?php
									$i++;
									}
								endwhile;
							} ?>
						</ul>
					</div>
				<?php
				}
			} 
		endwhile;
		wp_reset_postdata();
	endif; 	
}

?>