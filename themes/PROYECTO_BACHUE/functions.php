<?php

// SECURITY: HIDE USERNAMES
add_action(‘template_redirect’, ‘bwp_template_redirect’);
function bwp_template_redirect() {
    if ( is_author() ) {
        wp_redirect( home_url() ); 
        exit;
    }
}

// HIDE VERSION OF WORDPRESS
function wpversion_remove_version() {
    return '';
    }
add_filter('the_generator', 'wpversion_remove_version');

// ASYNC LOAD
function pb_async_scripts($url)
{
    if ( strpos( $url, '#asyncload') === false )
        return $url;
    else if ( is_admin() )
        return str_replace( '#asyncload', '', $url );
    else
    return str_replace( '#asyncload', '', $url )."' async='async"; 
    }
add_filter( 'clean_url', 'pb_async_scripts', 11, 1 );

// ENQUEUE CUSTOM SCRIPTS
function enqueue_pb_scripts() {
  
    wp_deregister_script( 'jquery' );
    wp_register_script( 'jquery', 'https://ajax.googleapis.com/ajax/libs/jquery/1.11.2/jquery.min.js');
    // wp_register_script( 'jquery', get_template_directory_uri() . '/js/_jquery.js');
    wp_enqueue_script( 'jquery' );  
    
    wp_enqueue_script('all-scripts', get_template_directory_uri() . '/js/scripts.min.js', array('jquery'), true);

    wp_register_script( "custom_ajax", get_template_directory_uri() . '/js/custom_ajax.js#asyncload', array('jquery'), true );
    wp_localize_script( "custom_ajax", "myAjax", array( 'ajaxurl' => admin_url( 'admin-ajax.php' ) ) );        
    wp_enqueue_script( "custom_ajax" );

    // wp_localize_script( 'ajax-script', 'ajax_object', array( 'ajax_url' => admin_url( 'admin-ajax.php' ) ) );

}
add_action('wp_enqueue_scripts', 'enqueue_pb_scripts');

// CREATE TAXONOMIES
add_action( 'init', 'create_topics_nonhierarchical_taxonomy', 0 );
function create_topics_nonhierarchical_taxonomy() {
    // LABELS FOR THE GUI
    $coll_labels = array(
        'name' => _x( 'Collection Categories', 'taxonomy general name' ),
        'singular_name' => _x( 'Collection Category', 'taxonomy singular name' ),
        'menu_name' => __( 'Collection Categories' ),
    ); 
    // REGISTER THE NON-HIERARCHICAL TAXONOMY LIKE TAG
    register_taxonomy( 'collection-cat', 'collection', array(
        'hierarchical' => true,
        'labels' => $coll_labels,
        'show_ui' => true,
        'show_admin_column' => true,
        'update_count_callback' => '_update_post_term_count',
        'query_var' => true,
        'rewrite' => array( 'slug' => 'collection-cat' ),
    ));
    // LABELS FOR THE GUI
    $archive_labels = array(
        'name' => _x( 'Archive Categories', 'taxonomy general name' ),
        'singular_name' => _x( 'Archive Category', 'taxonomy singular name' ),
        'menu_name' => __( 'Archive Categories' ),
    ); 
    // REGISTER THE NON-HIERARCHICAL TAXONOMY LIKE TAG
    register_taxonomy( 'archive-cat', 'news', array(
        'hierarchical' => true,
        'labels' => $archive_labels,
        'show_ui' => true,
        'show_admin_column' => true,
        'update_count_callback' => '_update_post_term_count',
        'query_var' => true,
        'rewrite' => array( 'slug' => 'archive-cat' ),
    ));
}


// ADD CUSTOM POST TYPES
add_action( 'init', 'create_post_types' );
function create_post_types() {
    register_post_type( 'news',
    array(
        'labels' => array(
            'name' => __( 'Archive' )
        ),
        'public' => true,
        'taxonomies' => array('archive-cat'),
        'has_archive' => true,
        'supports' => array('editor','title'),
        'menu_position' => 5
        )
    );
    register_post_type( 'publications',
    array(
        'labels' => array(
            'name' => __( 'Publications' )
        ),
        'public' => true,
        // 'taxonomies' => array('category'),
        'has_archive' => true,
        'supports' => array('editor','title'),
        'menu_position' => 6
        )
    );
    register_post_type( 'exhibitions',
    array(
        'labels' => array(
            'name' => __( 'Exhibitions' )
        ),
        'public' => true,
        // 'taxonomies' => array('category'),
        'has_archive' => true,
        'supports' => array('editor','title'),
        'menu_position' => 7
        )
    );
    register_post_type( 'collection',
    array(
        'labels' => array(
            'name' => __( 'Collection' )
        ),
        'public' => true,
        'taxonomies' => array('collection_cat'),
        'has_archive' => true,
        'supports' => array('editor','title'),
        'menu_position' => 8
        )
    );
}

// AJAX LAZY LOADING

add_action( 'wp_ajax_sections', 'section_load' );
add_action( 'wp_ajax_nopriv_sections', 'section_load' );

function section_load () {
    
    // THE $_REQUEST CONTAINS ALL THE DATA SENT VIA AJAX
    if ( isset($_REQUEST) ) {
        // $last_loaded = $_REQUEST['lastLoaded'];
        $new_data = include( "includes/06__collection_list.php" );
        echo $new_data;
        wp_die();
        // IF YOU'RE DEBUGGING, IT MIGHT BE USEFUL TO SEE WHAT WAS SENT IN THE $_REQUEST
        // print_r($_REQUEST);
    }
    // ALWAYS DIE IN FUNCTIONS ECHOING AJAX CONTENT
    wp_die();
}

// IMAGE OBJECT

    // ADD CUSTOM IMAGE SIZES
add_theme_support( 'post-thumbnails' );
add_image_size( 'extralarge', 1400, 1400 );

function pb_image_object( $image, $added_class ) {
    if( !empty($image) ): 
        $width = $image['sizes'][ 'thumbnail-width' ];
        $height = $image['sizes'][ 'thumbnail-height' ];
        $thumb = $image['sizes'][ "thumbnail" ]; // 300
        $medium = $image['sizes'][ "medium" ]; // 600
        $large = $image['sizes'][ "large" ]; // 900
        $extralarge = $image['sizes'][ "extralarge" ]; // 1400
        // $full = $image['url'];
        $id = $image["id"];
        
        $class = "landscape"; 
        if ( $width <= $height ) {
            $class = "portrait";
            $thumb = $image['sizes'][ "medium" ];
            $medium = $image['sizes'][ "large" ];
            $large = $image['sizes'][ "extralarge" ]; 
            // FIX THIS – ADD EXTRA LARGE CUSTOM SIZE
        } 

        echo "<img class='" . $class . " " . $added_class . "' 
        alt='Fundación Proyecto Bachué' 
        width='" . $width . "' 
        height='" . $height . "' 
        data-thm='" . $thumb . "' 
        data-med='" . $medium . "' 
        data-lrg='" . $large . "' 
        data-xlg='" . $extralarge . "' 
        src='' />";
    endif;
}

function pb_bg_image_object( $image, $added_class ) {
    if( !empty($image) ): 
        $width = $image['sizes'][ 'thumbnail-width' ];
        $height = $image['sizes'][ 'thumbnail-height' ];
        $ratio = $width / $height;
        $thumb = $image['sizes'][ "thumbnail" ]; // 300
        $medium = $image['sizes'][ "medium" ]; // 600
        $large = $image['sizes'][ "large" ]; // 900
        $extralarge = $image['sizes'][ "extralarge" ]; // 1400
        $id = $image["id"];
        
        $class = "landscape"; 
        if ( $width <= $height ) {
            $class = "portrait";
            $thumb = $image['sizes'][ "medium" ];
            $medium = $image['sizes'][ "large" ];
            $large = $image['sizes'][ "extralarge" ]; ; 
            // FIX THIS – ADD EXTRA LARGE CUSTOM SIZE
        } ?>
        <div 
            data-thm="<?php echo $thumb; ?>"
            data-med="<?php echo $medium; ?>" 
            data-lrg="<?php echo $large; ?>" 
            data-xlg="<?php echo $extralarge; ?>" 
            data-ratio="<?php echo $ratio; ?>"  
            data-src="<?php echo $thumb; ?>" 
            class="<?php echo $class . " bg_image " . $added_class ?>" 
            alt='Fundación Proyecto Bachué' 
            style="background-image:url('<?php echo $thumb; ?>')">
        </div>
        <?php
    endif;
}

// ADD CUSTOM QUERY

function add_custom_query_var( $vars ){
    $vars[] = "lang";
    return $vars;
}
add_filter( 'query_vars', 'add_custom_query_var' );

// GET LANGUAGE FROM QUERY

function get_lang() {   
    if ( $_GET['lang'] === "en" ) {
        return "en";       
    } else {
        return "es";
    }  
}

// TRANSLATIONS

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

function the_trad ( $trad_type, $trads ) {
    if ( get_lang() === "en" ) { 
        $trad_id = 0;
    } else {
        $trad_id = 1;   
    }
    echo $trads[$trad_type][$trad_id];
}

// TEXT IN CORRECT LANGUAGE

function the_trad_field ( $field ) {
    // IF CURRENT LANG === "EN"
    if ( get_lang() === "en" ) {
        if ( get_field( $field . "_en" ) ) {
            echo preg_replace('~\s?<p>(\s|&nbsp;)+</p>\s?~', '', get_field( $field . "_en" ));          
        } else {
            // IF NO TRANSLATION AVAILABLE: ECHO 'NO TRANSLATION AVAILABLE' + OPTION TO SEE DEFAULT SPANISH TEXT
            ?>
            <p>No translation available.</p>
            <a href="" class="trad_default_reveal">Click here to see Spanish text.</a>
            <span class="trad_default_hidden"><?php echo preg_replace('~\s?<p>(\s|&nbsp;)+</p>\s?~', '', get_field( $field )); ?></span>
            <?php
        }        
    } else {
        echo preg_replace('~\s?<p>(\s|&nbsp;)+</p>\s?~', '', get_field( $field ));
    } 
}


?>