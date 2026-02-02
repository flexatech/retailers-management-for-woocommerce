<?php
/**
 * Plugin Name:       Retailers Management for WooCommerce
 * Plugin URI:        https://flexa.vn/
 * Description:       Easily manage retailers, assign them to products, and display retailer information directly on WooCommerce product pages with this plugin.
 * Version:           1.0.2
 * Author:            flexatech
 * Author URI:        https://profiles.wordpress.org/flexatech/
 * Text Domain:       retailers-management-for-woocommerce
 * Domain Path:       /languages
 * Requires at least: 4.7
 * Tested up to:      6.9
 * Requires PHP:      7.4
 * Requires Plugins:  woocommerce
 * WC requires at least: 6.0.0
 * WC tested up to:   11.0.0
 * License:           GPL v2 or later
 * License URI:       https://www.gnu.org/licenses/gpl-2.0.html
 *
 * @package flexa/retailers-management-for-woocommerce
 */

namespace RetailersManagement;

defined( 'ABSPATH' ) || exit;

if ( function_exists( 'RetailersManagement\\plugin_init' ) ) {
    require_once plugin_dir_path( __FILE__ ) . 'includes/Fallback.php';
    add_action(
        'admin_init',
        function () {
            deactivate_plugins( plugin_basename( __FILE__ ) );
        }
    );
}


if ( ! defined( 'FLEXA_RETAILERS_MANAGEMENT_FILE' ) ) {
    define( 'FLEXA_RETAILERS_MANAGEMENT_FILE', __FILE__ );
}

if ( ! defined( 'FLEXA_RETAILERS_MANAGEMENT_VERSION' ) ) {
    define( 'FLEXA_RETAILERS_MANAGEMENT_VERSION', '1.0.0' );
}

if ( ! defined( 'FLEXA_RETAILERS_MANAGEMENT_PLUGIN_URL' ) ) {
    define( 'FLEXA_RETAILERS_MANAGEMENT_PLUGIN_URL', plugin_dir_url( FLEXA_RETAILERS_MANAGEMENT_FILE ) );
}

if ( ! defined( 'FLEXA_RETAILERS_MANAGEMENT_PLUGIN_DIR' ) ) {
    define( 'FLEXA_RETAILERS_MANAGEMENT_PLUGIN_DIR', plugin_dir_path( FLEXA_RETAILERS_MANAGEMENT_FILE ) );
}

if ( ! defined( 'FLEXA_RETAILERS_MANAGEMENT_BASE_NAME' ) ) {
    define( 'FLEXA_RETAILERS_MANAGEMENT_BASE_NAME', plugin_basename( FLEXA_RETAILERS_MANAGEMENT_FILE ) );
}

spl_autoload_register(
    function ( $class ) {
        $prefix = __NAMESPACE__;
        // project-specific namespace prefix
        $base_dir = __DIR__ . '/includes';
        // base directory for the namespace prefix

        $len = strlen( $prefix );
        if ( strncmp( $prefix, $class, $len ) !== 0 ) {
            // does the class use the namespace prefix?
            return;
            // no, move to the next registered autoloader
        }

        $relative_class_name = substr( $class, $len );

        // replace the namespace prefix with the base directory, replace namespace
        // separators with directory separators in the relative class name, append
        // with .php
        $file = $base_dir . str_replace( '\\', '/', $relative_class_name ) . '.php';

        if ( file_exists( $file ) ) {
            require $file;
        }
    }
);


if ( ! function_exists( 'RetailersManagement\\plugin_init' ) ) {
    function plugin_init() {

        if ( ! function_exists( 'WC' ) ) {
            add_action( 'admin_notices', [ \RetailersManagement\Engine\ActDeact::class, 'install_woocommerce_admin_notice' ] );
            return;
        }

        add_action( 'before_woocommerce_init', [ \RetailersManagement\Engine\ActDeact::class, 'before_woocommerce_init' ] );

        Initialize::get_instance();
        I18n::load_plugin_textdomain();
    }
}

if ( ! wp_installing() ) {
    add_action( 'plugins_loaded', 'RetailersManagement\\plugin_init' );
}

register_activation_hook( FLEXA_RETAILERS_MANAGEMENT_FILE, [ \RetailersManagement\Engine\ActDeact::class, 'activate' ] );
register_deactivation_hook( FLEXA_RETAILERS_MANAGEMENT_FILE, [ \RetailersManagement\Engine\ActDeact::class, 'deactivate' ] );
