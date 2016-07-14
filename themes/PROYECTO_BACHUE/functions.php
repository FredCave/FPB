<?php

// ENQUEUE CUSTOM SCRIPTS
function enqueue_cpr_scripts() {
  
    wp_deregister_script( 'jquery' );
    wp_register_script( 'jquery', 'https://ajax.googleapis.com/ajax/libs/jquery/1.11.2/jquery.min.js');
    wp_enqueue_script( 'jquery' );  
    
    wp_enqueue_script('all-scripts', get_template_directory_uri() . '/js/scripts.min.js', array('jquery'), true);

}
add_action('wp_enqueue_scripts', 'enqueue_cpr_scripts');

// ADD CUSTOM POST TYPES
add_action( 'init', 'create_post_types' );
function create_post_types() {
    register_post_type( 'index',
    array(
        'labels' => array(
            'name' => __( 'Index' )
        ),
        'public' => true,
        'taxonomies' => array('category'),
        'has_archive' => true,
        'supports' => array('editor','title'),
        'menu_position' => 5
        )
    );
    register_post_type( 'show',
    array(
        'labels' => array(
            'name' => __( 'Shows' )
        ),
        'public' => true,
        'taxonomies' => array('category'),
        'has_archive' => true,
        'supports' => array('editor','title'),
        'menu_position' => 6
        )
    );
}

?>