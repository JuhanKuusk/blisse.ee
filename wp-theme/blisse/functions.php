<?php
/**
 * Blisse Theme Functions
 *
 * @package Blisse
 */

if (!defined('ABSPATH')) {
    exit;
}

/**
 * Theme Setup
 */
function blisse_setup() {
    // Add default posts and comments RSS feed links to head
    add_theme_support('automatic-feed-links');

    // Let WordPress manage the document title
    add_theme_support('title-tag');

    // Enable support for Post Thumbnails
    add_theme_support('post-thumbnails');

    // Register Navigation Menus
    register_nav_menus(array(
        'primary' => __('Primary Menu', 'blisse'),
        'footer' => __('Footer Menu', 'blisse'),
    ));

    // HTML5 markup support
    add_theme_support('html5', array(
        'search-form',
        'comment-form',
        'comment-list',
        'gallery',
        'caption',
        'style',
        'script',
    ));

    // WooCommerce support
    add_theme_support('woocommerce');
    add_theme_support('wc-product-gallery-zoom');
    add_theme_support('wc-product-gallery-lightbox');
    add_theme_support('wc-product-gallery-slider');

    // Custom logo
    add_theme_support('custom-logo', array(
        'height'      => 80,
        'width'       => 200,
        'flex-height' => true,
        'flex-width'  => true,
    ));
}
add_action('after_setup_theme', 'blisse_setup');

/**
 * Enqueue scripts and styles
 */
function blisse_scripts() {
    // Google Fonts
    wp_enqueue_style('blisse-fonts', 'https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;500;600;700&family=Poppins:wght@300;400;500;600;700&display=swap', array(), null);

    // Theme stylesheet
    wp_enqueue_style('blisse-style', get_stylesheet_uri(), array(), '1.0');

    // Additional custom CSS
    wp_enqueue_style('blisse-custom', get_template_directory_uri() . '/assets/css/custom.css', array('blisse-style'), '1.0');
}
add_action('wp_enqueue_scripts', 'blisse_scripts');

/**
 * WooCommerce: Remove default styles and actions
 */
add_filter('woocommerce_enqueue_styles', '__return_empty_array');

/**
 * WooCommerce: Declare theme support
 */
function blisse_woocommerce_support() {
    add_theme_support('woocommerce', array(
        'thumbnail_image_width' => 400,
        'single_image_width'    => 600,
        'product_grid'          => array(
            'default_rows'    => 4,
            'min_rows'        => 2,
            'max_rows'        => 8,
            'default_columns' => 3,
            'min_columns'     => 2,
            'max_columns'     => 4,
        ),
    ));
}
add_action('after_setup_theme', 'blisse_woocommerce_support');

/**
 * WooCommerce: Customize checkout fields
 */
function blisse_override_checkout_fields($fields) {
    // Add placeholders
    $fields['billing']['billing_first_name']['placeholder'] = __('Eesnimi', 'blisse');
    $fields['billing']['billing_last_name']['placeholder'] = __('Perekonnanimi', 'blisse');
    $fields['billing']['billing_email']['placeholder'] = __('E-posti aadress', 'blisse');
    $fields['billing']['billing_phone']['placeholder'] = __('Telefon', 'blisse');

    return $fields;
}
add_filter('woocommerce_checkout_fields', 'blisse_override_checkout_fields');

/**
 * Register widget areas
 */
function blisse_widgets_init() {
    register_sidebar(array(
        'name'          => __('Sidebar', 'blisse'),
        'id'            => 'sidebar-1',
        'description'   => __('Add widgets here.', 'blisse'),
        'before_widget' => '<section id="%1$s" class="widget %2$s">',
        'after_widget'  => '</section>',
        'before_title'  => '<h3 class="widget-title">',
        'after_title'   => '</h3>',
    ));

    register_sidebar(array(
        'name'          => __('Footer 1', 'blisse'),
        'id'            => 'footer-1',
        'description'   => __('Footer widget area 1', 'blisse'),
        'before_widget' => '<div id="%1$s" class="widget %2$s">',
        'after_widget'  => '</div>',
        'before_title'  => '<h4 class="widget-title">',
        'after_title'   => '</h4>',
    ));

    register_sidebar(array(
        'name'          => __('Footer 2', 'blisse'),
        'id'            => 'footer-2',
        'description'   => __('Footer widget area 2', 'blisse'),
        'before_widget' => '<div id="%1$s" class="widget %2$s">',
        'after_widget'  => '</div>',
        'before_title'  => '<h4 class="widget-title">',
        'after_title'   => '</h4>',
    ));

    register_sidebar(array(
        'name'          => __('Footer 3', 'blisse'),
        'id'            => 'footer-3',
        'description'   => __('Footer widget area 3', 'blisse'),
        'before_widget' => '<div id="%1$s" class="widget %2$s">',
        'after_widget'  => '</div>',
        'before_title'  => '<h4 class="widget-title">',
        'after_title'   => '</h4>',
    ));
}
add_action('widgets_init', 'blisse_widgets_init');

/**
 * Add body classes
 */
function blisse_body_classes($classes) {
    if (is_woocommerce()) {
        $classes[] = 'woocommerce-page';
    }
    return $classes;
}
add_filter('body_class', 'blisse_body_classes');

/**
 * Modify add to cart text
 */
function blisse_add_to_cart_text() {
    return __('Lisa korvi', 'blisse');
}
add_filter('woocommerce_product_add_to_cart_text', 'blisse_add_to_cart_text');
add_filter('woocommerce_product_single_add_to_cart_text', 'blisse_add_to_cart_text');

/**
 * Remove WooCommerce breadcrumbs (we have our own)
 */
remove_action('woocommerce_before_main_content', 'woocommerce_breadcrumb', 20);

/**
 * Change number of products per row
 */
add_filter('loop_shop_columns', function() {
    return 3;
});

/**
 * Change number of related products
 */
add_filter('woocommerce_output_related_products_args', function($args) {
    $args['posts_per_page'] = 3;
    $args['columns'] = 3;
    return $args;
});
