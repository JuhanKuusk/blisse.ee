<?php
/**
 * WooCommerce main template
 *
 * @package Blisse
 */

get_header();
?>

<div class="woocommerce-container" style="padding: 40px 0;">
    <?php woocommerce_content(); ?>
</div>

<?php
get_footer();
