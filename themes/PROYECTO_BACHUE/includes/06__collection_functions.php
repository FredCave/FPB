<?php

function pb_get_password () {
	$about_query = new WP_Query( "name=password-collection" );
	if ( $about_query->have_posts() ) :
		while ( $about_query->have_posts() ) : $about_query->the_post();
			$pass = md5( get_field("coll_password") );
			return $pass;
		endwhile;
		wp_reset_postdata();
	endif;
}

function pb_password_form( $trads ) { ?>
	<p><?php the_trad("trad_enter",$trads); ?></p>
	<div id="pword_form" data-hash="<?php echo pb_get_password(); ?>">
		<label><?php the_trad("trad_pass",$trads); ?> :</label>
		<input class="text_input" id="pword_input"/>
		<input type="button" value="<?php the_trad("trad_login",$trads); ?>" id="pword_submit" onclick="controllerCollection.passwordCheck()"/>
	</div>
	<!-- ERROR MESSAGE -->
	<div id="error_message"
		data-trad-incorrect="<?php the_trad("trad_incorrect",$trads); ?>" 
		data-trad-too-many="<?php the_trad("trad_toomany",$trads); ?>" >
	</div>
	<?php
}

function pb_coll_filter ( $trads ) {
	// SEARCH
	?>
	<form id="coll_search" method="post" name="collection-search">
		<label><?php the_trad("trad_search",$trads); ?> :</label>
		<input class="text_input" type="search" name="search" id="search_input"/>
	</form>
	<?php
	// ALPHABETICAL INDEX
	echo $trads["trad_filtername"][1];
	echo "<ul id='coll_letters' class=''>";
	// CREATE A RANGE OF LETTERS
	$letters = range('A', 'Z');
	// LOOP THROUGH LETTERS
	foreach ( $letters as $letter ) {			
		// CREATE INDIVIDUAL LIs
		echo "<li class='coll_letter'><a href=''>" . $letter . "</a></li>";
	}
	echo "</ul>";

	// CREATE DROPDOWN MENU FOR EACH CATEGORY
	$parents = get_terms( array (
	    'taxonomy' 	=> 'collection-cat',
	    'parent' 	=> 0,
	    'exclude'  	=> 1 // UNCATEGORIZED
	) ); 
	foreach ( $parents as $parent ) {
		// var_dump( $parent );
		$parentId = $parent->term_id;
		$parentSlug = $parent->slug;
		echo "<div class='filter'>";
			// TITLE – HOW TO TRANSLATE THIS????
			echo $parent->name. ": ";
			$types = get_terms( array (
			    'taxonomy' 	=> 'collection-cat',
				'child_of' 	=> $parentId,
			    'exclude'  	=> 1 // UNCATEGORIZED
			) );
			echo "<select class='" . $parentSlug . "'><option value='0' selected>";
			the_trad("trad_all",$trads);
			echo "</option>";
			foreach ( $types as $type ) { ?>
				<option value="<?php echo $type->slug; ?>"><?php echo $type->name; ?></option>
			<?php
			}
			echo "</select>";
		echo "</div>";
	}

}

function pb_coll_html_image () {
	if ( get_field( "coll_image" ) ) { ?>		
		<div class="coll_image">
			<?php $image = get_field( "coll_image" );
			pb_image_object( $image ); ?>
		</div>
	<?php }
}

function pb_coll_html_title () { ?>
	<div class="coll_title">
		<h1><?php the_title(); ?></h1>
		<h1><?php the_field( "coll_artist" ); ?>, <?php the_field( "coll_date" ); ?></h1>
	</div>
<?php }

function pb_coll_html_info() { ?>
	<div class="hidden_content hide">
		<div class="col col_1">
			<?php pb_coll_html_title () ?>
			<div>
				<?php // DATE
				if ( get_field( "coll_date" ) ) {
					echo "Fecha de creación : " . get_field( "coll_date" ) . "<br>";
				} // DIMENSIONS
				if ( get_field( "coll_dimensions" ) ) {
					echo "Dimensiones : " . get_field( "coll_dimensions" ) . "<br>";
				} // TECHNIQUE
				if ( get_field( "coll_technique" ) ) {
					echo "Técnica : " . get_field( "coll_technique" ) . "<br>";
				} // EXHIBITIONS
				if ( get_field( "coll_exhibitions" ) ) { ?>
					<p>Curadurías :</p>
					<div>
						<?php the_field( "coll_exhibitions" ); ?>
					</div>
				<?php } ?>
			</div>
			<div>
				<?php // TEXT
				the_trad_field( "coll_text" ); ?>
			</div>
		</div>
		<div class="col col_2">
			<?php pb_coll_html_image(); ?>
		</div>
	</div>
<?php }

function pb_coll_list () {
	$coll_query = new WP_Query( "post_type=collection" );
		if ( $coll_query->have_posts() ) :
			while ( $coll_query->have_posts() ) : $coll_query->the_post(); 
				// SANITIZE ALL INFO LEAVING SPACES
				$title = str_replace( "-", " ", sanitize_title( get_the_title() ) );
				$artist = str_replace( "-", " ", sanitize_title( get_field( "coll_artist" ) ) );
				// GET ARTIST INITIALS 
				$words = explode(" ", $artist);
				$inits = "";
				foreach ($words as $w) {
					$inits .= $w[0] . " ";
				}
				$terms = get_the_terms( $post->ID, "collection-cat" );
				$classes = [];
				foreach ( $terms as $term ) {
					array_push( $classes, $term->slug );
				}
				$year = get_field( "coll_date" ); ?>
				
				<li class="coll_post image_cell <?php echo $inits; ?>" 
					data-row="" 
					data-info="<?php echo $title . ' ' . $artist; ?>"
					data-class="<?php echo implode(' ', $classes); ?>" >
					<div class="image_cell_toggle">
					
					<?php
					// ECHO IMAGE HTML
					pb_coll_html_image();

					// ECHO TITLE / ARTIST
					pb_coll_html_title();

					// ECHO INFO HTML
					pb_coll_html_info();

				echo "</div></li>";

		endwhile;
		
		wp_reset_postdata();
	endif;
}

?>