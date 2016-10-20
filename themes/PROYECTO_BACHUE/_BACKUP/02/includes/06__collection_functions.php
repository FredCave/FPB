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

function pb_password_form() { ?>
	<p>To see the collection, enter your password here</p>	
	<form id="password_form" method="post" name="password-form" data-hash="<?php echo pb_get_password(); ?>">
		<?php pb_get_password(); ?>
		<label>Password :</label>
		<input class="text_input" type="password" name="password" id="password_input"/>
		<input type="button" value="Login" id="password_submit" onclick="passCheck()"/>
	</form>
	<!-- ERROR MESSAGE -->
	<div id="error_message"></div>
	<?php
}

function pb_coll_filter () {
	?>
	<form id="coll_search" method="post" name="collection-search">
		<label>Search :</label>
		<input class="text_input" type="search" name="search" id="search_input"/>
	</form>
	<div class="filter">
		<?php 
		// FILTER BY MEDIUM
		echo "Media: ";
		$types = get_terms( array (
		    'taxonomy' 	=> 'collection-cat',
			'child_of' 	=> 22,
		    'exclude'  	=> 1 // UNCATEGORIZED
		) ); 
		echo "<select><option value='0' selected>Todos</option>";
		?>		
		<?php
		foreach ( $types as $type ) { ?>
			<option value="<?php echo $type->slug; ?>"><?php echo $type->name; ?></option>
		<?php
		}
		echo "</select>"; 
		?>
	</div>
	<div class="filter">
		<?php
		// FILTER BY THEME
		echo "Tema: ";
		$themes = get_terms( array (
		    'taxonomy' 	=> 'collection-cat',
			'child_of' 	=> 27,
		    'exclude'  	=> 1 // UNCATEGORIZED
		) ); 
		echo "<select><option value='0' selected>Todos</option>";
		?>		
		<?php
		foreach ( $themes as $theme ) { ?>
			<option value="<?php echo $theme->slug; ?>"><?php echo $theme->name; ?></option>
		<?php
		}
		echo "</select>";
		?>
	</div>
	<?php
}

function pb_coll_list () {
	$coll_query = new WP_Query( "post_type=collection" );
		if ( $coll_query->have_posts() ) :
			while ( $coll_query->have_posts() ) : $coll_query->the_post(); 
				// SANITIZE ALL INFO LEAVING SPACES
				$title = str_replace( "-", " ", sanitize_title( get_the_title() ) );
				$artist = str_replace( "-", " ", sanitize_title( get_field( "coll_artist" ) ) );
				$terms = get_the_terms( $post->ID, "collection-cat" );
				foreach ( $terms as $term ) {
					// TYPE PARENT CATEGORY ID === 22
					if ( $term->parent === 22 ) {
						$type = $term->slug;
					}
				}
				$year = get_field( "coll_date" );
				?>
				<!-- ADD TITLE AND ARTIST IN INFO ATTRIBUTE -->
				<li class="coll_post image_cell" data-row="" data-info="<?php echo $title . " " . $artist; ?>" data-type="<?php echo $type; ?>" data-year="<?php echo $year; ?>">
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