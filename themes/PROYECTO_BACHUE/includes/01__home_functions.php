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
			if ( get_field( "home_video" ) ) {
					// GET IFRAME HTML
					$iframe = get_field("home_video");
					// FIND IFRAME SRC + ID
					preg_match('/src="(.+?)"/', $iframe, $matches);
					$src = $matches[1];
					$video_id = explode("embed/",$src)[1];
					$_id = explode("?",$video_id)[0];
					// // ADD EXTRA PARAM TO IFRAME SRC
					// $params = array(
					//     'autoplay'    => 1,
					//     'loop'        => 1,
					//     'playlist'	  => $_id
					// );
					// $new_src = add_query_arg($params, $src);
					// $iframe = str_replace($src, $new_src, $iframe);
					// echo $iframe;
					?>
				<div id="player" data-src="<?php echo $src; ?>" data-id="<?php echo $_id; ?>"></div>

				<div id="home_video_button">
					<div class="play hide"><img src="<?php bloginfo('template_url'); ?>/img/play.svg" /></div>
					<div class="pause"><img src="<?php bloginfo('template_url'); ?>/img/pause.svg" /></div>
				</div>
			<?php
			// ELSE SINGLE IMAGE
			} else if ( get_field( "home_images" ) ) {
				// GET ALL ROWS
				$rows = get_field( "home_images" );
				// SHUFFLE ROWS
				shuffle($rows);
				?>
				<ul id="home_slideshow">
					<?php 
					$i = 0;
					foreach ( $rows as $row ) { ?>
						<li class="home_single_image <?php if ( $i === 0 ) { echo "visible"; } ?>">
							<?php pb_bg_image_object( $row["home_image"], "blurred" ); ?>
						</li>
					<?php 
					$i++;
					} ?>
				</ul>

				<?php // TEXT BLOCK
				if ( get_field("home_text") ) { 
					$internal = get_field('home_internal');
					$external = get_field('home_external');
					?>
					<li class="home_text" data-link="<?php echo pb_get_link( $internal, $external ); ?>" data-left="" data-top="">
						<div class="home_close"></div>
						<span><?php the_field("home_text"); ?></span>
						<div class="text_link">
							<a target="_blank" href="<?php if ( get_field('home_external') ) { the_field('home_external'); } ?>"><?php echo $trads["trad_more"][1]; ?></a>
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