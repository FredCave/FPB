<?php
// CREATE ARRAY
global $trads;
$trads = array();

$strings_query = new WP_Query( "name=translations" );
if ( $strings_query->have_posts() ) :
	while ( $strings_query->have_posts() ) : $strings_query->the_post();
		// LOOP THROUGH REPEATER FIELDS
		if ( have_rows( "translations" ) ) {	
			while ( have_rows( "translations" ) ) : the_row( "translations" );
				$code = get_sub_field("translation_code");
				$en = get_sub_field("translation_en");
				$es = get_sub_field("translation_es");
				$trads[$code] = array($en,$es);
			endwhile;	
		}
	endwhile;
	return $trads;
	wp_reset_postdata();
endif; 	

?>