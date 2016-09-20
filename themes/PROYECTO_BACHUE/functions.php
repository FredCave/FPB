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

// ENQUEUE CUSTOM SCRIPTS
function enqueue_cpr_scripts() {
  
    wp_deregister_script( 'jquery' );
    // wp_register_script( 'jquery', 'https://ajax.googleapis.com/ajax/libs/jquery/1.11.2/jquery.min.js');
    // wp_enqueue_script( 'jquery' );  
    
    wp_enqueue_script('jquery', get_template_directory_uri() . '/js/_jquery.js', true);
    wp_enqueue_script('all-scripts', get_template_directory_uri() . '/js/scripts.min.js', array('jquery'), true);

    wp_register_script( "custom_ajax", get_template_directory_uri() . '/js/custom_ajax.js', array('jquery') );
    wp_localize_script( "custom_ajax", "myAjax", array( 'ajaxurl' => admin_url( 'admin-ajax.php' ) ) );        
    wp_enqueue_script( "custom_ajax" );

    // wp_localize_script( 'ajax-script', 'ajax_object', array( 'ajax_url' => admin_url( 'admin-ajax.php' ) ) );

}
add_action('wp_enqueue_scripts', 'enqueue_cpr_scripts');

// ADD CUSTOM POST TYPES
add_action( 'init', 'create_post_types' );
function create_post_types() {
    register_post_type( 'news',
    array(
        'labels' => array(
            'name' => __( 'News' )
        ),
        'public' => true,
        'taxonomies' => array('category'),
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
        'taxonomies' => array('category'),
        'has_archive' => true,
        'supports' => array('editor','title'),
        'menu_position' => 6
        )
    );
    register_post_type( 'collection',
    array(
        'labels' => array(
            'name' => __( 'Collection' )
        ),
        'public' => true,
        'taxonomies' => array('category','post_tag'),
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
        $last_loaded = $_REQUEST['lastLoaded'];
        switch ( $last_loaded ) {
            case 1:
                $source = "includes/02_about.php";
                break;
            case 2:
                $source = "includes/03_publications.php";
                break;
            case 3:
                $source = "includes/04_exposiciones.php";
                break;
            case 4:
                $source = "includes/05_archive.php";
                break;
            case 5:
                $source = "includes/06_collection.php";
                break;
        }
        $new_data = include( $source );
        echo $new_data;
        wp_die();
        // IF YOU'RE DEBUGGING, IT MIGHT BE USEFUL TO SEE WHAT WAS SENT IN THE $_REQUEST
        // print_r($_REQUEST);
    }
    // ALWAYS DIE IN FUNCTIONS ECHOING AJAX CONTENT
    wp_die();
}

// IMAGE OBJECT

function pb_image_object( $image, $added_class ) {
    if( !empty($image) ): 
        $width = $image['sizes'][ 'thumbnail-width' ];
        $height = $image['sizes'][ 'thumbnail-height' ];
        $thumb = $image['sizes'][ "thumbnail" ];
        $medium = $image['sizes'][ "medium" ];
        $large = $image['sizes'][ "large" ];
        $full = $image['url'];
        $id = $image["id"];
        
        $class = "landscape"; 
        if ( $width < $height ) {
            $class = "portrait";
            $thumb = $image['sizes'][ "medium" ];
            $medium = $image['sizes'][ "large" ];
            $large = $image['url'];
        } 

        echo "<img class='" . $class . " " . $added_class . "' 
        alt='Fundación Proyecto Bachué'  
        data-src='" . $thumb . "' 
        width='" . $width . "' 
        height='" . $height . "' 
        data-sizes='auto' 
        data-srcset='" . $large . " 1280w, 
            " . $medium . " 800w, 
            " . $thumb . " 300w' 
        src=' " . $thumb . "' />";
    endif;
}

?>