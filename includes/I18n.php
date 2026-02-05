<?php

namespace RetailersManagement;

defined( 'ABSPATH' ) || exit;
/**
 * I18n Logic
 */
class I18n {

    public static function load_plugin_textdomain() {
        // WordPress automatically loads translations for plugins hosted on WordPress.org.
        // For non-WordPress.org plugins, we still need to load translations manually.
        // Using load_textdomain() instead of the discouraged load_plugin_textdomain().
        if ( function_exists( 'determine_locale' ) ) {
            $locale = determine_locale();
        } else {
            $locale = is_admin() ? get_user_locale() : get_locale();
        }
        
        $mofile = FLEXA_TECH_RETAILERS_MANAGEMENT_PLUGIN_DIR . '/languages/retailers-management-for-woocommerce-' . $locale . '.mo';
        
        if ( file_exists( $mofile ) ) {
            unload_textdomain( 'retailers-management-for-woocommerce' );
            load_textdomain( 'retailers-management-for-woocommerce', $mofile );
        }
    }
}
