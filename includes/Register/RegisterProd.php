<?php
namespace RetailersManagement\Register;

defined( 'ABSPATH' ) || exit;

use RetailersManagement\Utils\SingletonTrait;
use RetailersManagement\Register\ScriptName;

/** Register in Production Mode */
class RegisterProd {
    use SingletonTrait;

    /** Hooks Initialization */
    protected function __construct() {
        add_action( 'init', [ $this, 'register_all_scripts' ] );
    }

    public function register_all_scripts() {
        $deps = [ 'react', 'react-dom', 'wp-hooks', 'wp-i18n' ];
        wp_register_script( ScriptName::PAGE_SETTINGS, FLEXA_TECH_RETAILERS_MANAGEMENT_PLUGIN_URL . 'assets/dist/admin/js/main.js', $deps, FLEXA_TECH_RETAILERS_MANAGEMENT_VERSION, true );
        wp_set_script_translations( ScriptName::PAGE_SETTINGS, 'retailers-management-for-woocommerce', FLEXA_TECH_RETAILERS_MANAGEMENT_PLUGIN_DIR . 'languages' );

        wp_register_script( ScriptName::PAGE_PRODUCT_RETAILERS, FLEXA_TECH_RETAILERS_MANAGEMENT_PLUGIN_URL . 'assets/dist/admin/js/product-retailers.js', $deps, FLEXA_TECH_RETAILERS_MANAGEMENT_VERSION, true );
        wp_set_script_translations( ScriptName::PAGE_PRODUCT_RETAILERS, 'retailers-management-for-woocommerce', FLEXA_TECH_RETAILERS_MANAGEMENT_PLUGIN_DIR . 'languages' );

        // Frontend script
        $frontend_deps = [ 'react', 'react-dom', 'wp-i18n' ];
        wp_register_script( ScriptName::PAGE_PRODUCT_RETAILERS_FRONTEND, FLEXA_TECH_RETAILERS_MANAGEMENT_PLUGIN_URL . 'assets/dist/frontend/js/product-retailers-frontend.js', $frontend_deps, FLEXA_TECH_RETAILERS_MANAGEMENT_VERSION, true );
        wp_set_script_translations( ScriptName::PAGE_PRODUCT_RETAILERS_FRONTEND, 'retailers-management-for-woocommerce', FLEXA_TECH_RETAILERS_MANAGEMENT_PLUGIN_DIR . 'languages' );
    }
}
