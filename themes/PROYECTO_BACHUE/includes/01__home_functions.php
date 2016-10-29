<?php

function pb_get_link ( $internal ) {
	$link = "";
	if ( $internal ) {
		// INTERNAL LINK
		$link_info = $internal;
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
	} else if ( $external  ) {
		// EXTERNAL LINK
		$link = $external;
	}	
	return $link;
}

function pb_get_home ( $trads ) {
	$about_query = new WP_Query( "name=home" );
	if ( $about_query->have_posts() ) :
		while ( $about_query->have_posts() ) : $about_query->the_post();

			// IF HAVE VIDEO
			if ( get_field( "home_video" ) ) { ?>
				<div id="home_video">
					<?php 
					// GET IFRAME HTML
					$iframe = get_field("home_video");
					// FIND IFRAME SRC + ID
					preg_match('/src="(.+?)"/', $iframe, $matches);
					$src = $matches[1];
					$video_id = explode("embed/",$src)[1];
					$_id = explode("?",$video_id)[0];
					// ADD EXTRA PARAM TO IFRAME SRC
					$params = array(
					    'autoplay'    => 1,
					    'loop'        => 1,
					    'playlist'	  => $_id
					);
					$new_src = add_query_arg($params, $src);
					$iframe = str_replace($src, $new_src, $iframe);
					echo $iframe;
					?>
				</div>
			<?php
			// ELSE SINGLE IMAGE
			} else if ( get_field( "home_images" ) ) {
				$rows = get_field( "home_images" );
				$rand_row = $rows[ array_rand( $rows ) ];
				$img = $rand_row[ "home_image" ];
				?>

				<div id="home_single_image">	
					<?php pb_bg_image_object( $img, "blurred" ); ?>
				</div>

				<?php // TEXT BLOCK
				if ( get_field("home_text") ) { 
					$internal = get_field('home_internal');
					$external = get_field('home_external');
					?>
					<li class="home_text" data-link="<?php echo pb_get_link( $internal, $external ); ?>" data-left="" data-top="">
						<span><?php the_field("home_text"); ?></span>
						<div class="text_link">
							<a href=""><?php echo $trads["trad_more"][1]; ?></a>
						</div>
					</li>	
				<?php
				} 
				
			} 
		endwhile;
		wp_reset_postdata();
	endif; 	
}

?>