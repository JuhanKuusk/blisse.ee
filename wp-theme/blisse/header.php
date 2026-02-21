<!DOCTYPE html>
<html <?php language_attributes(); ?>>
<head>
    <meta charset="<?php bloginfo('charset'); ?>">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="description" content="Blisse - Professionaalsed keha- ja naohooldused Tallinnas. LPG massaaž, krüolipolüüs, RF lifting ja palju muud.">
    <?php wp_head(); ?>
    <link rel="icon" type="image/png" href="<?php echo get_template_directory_uri(); ?>/images/favicon.png">
</head>
<body <?php body_class(); ?>>
<?php wp_body_open(); ?>

<!-- Header -->
<header class="site-header">
    <div class="container">
        <div class="site-branding">
            <?php if (has_custom_logo()) : ?>
                <?php the_custom_logo(); ?>
            <?php else : ?>
                <a href="<?php echo esc_url(home_url('/')); ?>">
                    <img src="<?php echo get_template_directory_uri(); ?>/images/blisse-logo.png" alt="<?php bloginfo('name'); ?>" style="max-height: 70px; width: auto;">
                </a>
            <?php endif; ?>
        </div>

        <nav class="main-navigation">
            <?php if (has_nav_menu('primary')) : ?>
                <?php wp_nav_menu(array(
                    'theme_location' => 'primary',
                    'container' => false,
                    'menu_class' => '',
                    'fallback_cb' => false,
                )); ?>
            <?php else : ?>
                <ul>
                    <li><a href="<?php echo home_url('/'); ?>">Avaleht</a></li>
                    <li><a href="<?php echo home_url('/meist'); ?>">Meist</a></li>
                    <li><a href="<?php echo home_url('/salongihooldused'); ?>">Salongihooldused</a></li>
                    <li><a href="<?php echo home_url('/hoolduste-paketid'); ?>">Hoolduste Paketid</a></li>
                    <li><a href="<?php echo home_url('/hinnakiri'); ?>">Hinnakiri</a></li>
                    <li><a href="<?php echo home_url('/galerii'); ?>">Galerii</a></li>
                    <li><a href="<?php echo home_url('/kontakt'); ?>">Kontakt</a></li>
                </ul>
            <?php endif; ?>
        </nav>

        <?php if (class_exists('WooCommerce')) : ?>
        <div class="header-cart">
            <a href="<?php echo wc_get_cart_url(); ?>" class="cart-link">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M9 22C9.55228 22 10 21.5523 10 21C10 20.4477 9.55228 20 9 20C8.44772 20 8 20.4477 8 21C8 21.5523 8.44772 22 9 22Z" stroke="currentColor" stroke-width="2"/>
                    <path d="M20 22C20.5523 22 21 21.5523 21 21C21 20.4477 20.5523 20 20 20C19.4477 20 19 20.4477 19 21C19 21.5523 19.4477 22 20 22Z" stroke="currentColor" stroke-width="2"/>
                    <path d="M1 1H5L7.68 14.39C7.77144 14.8504 8.02191 15.264 8.38755 15.5583C8.75318 15.8526 9.2107 16.009 9.68 16H19.4C19.8693 16.009 20.3268 15.8526 20.6925 15.5583C21.0581 15.264 21.3086 14.8504 21.4 14.39L23 6H6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
                <?php $cart_count = WC()->cart->get_cart_contents_count(); ?>
                <?php if ($cart_count > 0) : ?>
                    <span class="cart-count"><?php echo esc_html($cart_count); ?></span>
                <?php endif; ?>
            </a>
        </div>
        <?php endif; ?>
    </div>
</header>

<!-- Page Header for WooCommerce pages -->
<?php if (is_woocommerce() || is_cart() || is_checkout() || is_account_page()) : ?>
<div class="page-header">
    <div class="container">
        <h1>
            <?php
            if (is_cart()) {
                echo 'Ostukorv';
            } elseif (is_checkout()) {
                echo 'Kassa';
            } elseif (is_account_page()) {
                echo 'Minu konto';
            } elseif (is_shop()) {
                echo 'Pood';
            } elseif (is_product_category()) {
                single_cat_title();
            } elseif (is_product()) {
                the_title();
            } else {
                woocommerce_page_title();
            }
            ?>
        </h1>
        <div class="breadcrumbs">
            <a href="<?php echo home_url('/'); ?>">Avaleht</a>
            <span> / </span>
            <?php
            if (is_cart()) {
                echo 'Ostukorv';
            } elseif (is_checkout()) {
                echo 'Kassa';
            } elseif (is_account_page()) {
                echo 'Minu konto';
            } elseif (is_shop()) {
                echo 'Pood';
            } elseif (is_product_category()) {
                single_cat_title();
            } elseif (is_product()) {
                echo '<a href="' . get_permalink(wc_get_page_id('shop')) . '">Pood</a> / ';
                the_title();
            } else {
                woocommerce_page_title();
            }
            ?>
        </div>
    </div>
</div>
<?php endif; ?>

<main class="site-main">
