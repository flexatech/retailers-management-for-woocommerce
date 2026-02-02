<?php
namespace RetailersManagement\Register;

defined( 'ABSPATH' ) || exit;

use RetailersManagement\Utils\SingletonTrait;
use RetailersManagement\Register\ScriptName;

/**
 * Register in Development Mode
 * Will get deleted in production
 */
class RegisterDev {
    use SingletonTrait;

    /** Hooks Initialization */
    protected function __construct() {
        add_action( 'admin_footer', [ $this, 'render_dev_refresh_admin' ], 5 );
        add_action( 'wp_footer', [ $this, 'render_dev_refresh_frontend' ], 5 );
        add_action( 'init', [ $this, 'register_all_scripts' ] );
    }

    public function render_dev_refresh_admin() {
        // Uses port 3000 for admin (main Vite port)
        echo '<script type="module">
        import RefreshRuntime from "http://localhost:3000/@react-refresh"
        RefreshRuntime.injectIntoGlobalHook(window)
        window.$RefreshReg$ = () => {}
        window.$RefreshSig$ = () => (type) => type
        window.__vite_plugin_react_preamble_installed__ = true
        </script>';
    }

    public function render_dev_refresh_frontend() {
        // Uses port 3001 for frontend app (see product-retailers-frontend.tsx registration)
        echo '<script type="module">
        import RefreshRuntime from "http://localhost:3001/@react-refresh"
        RefreshRuntime.injectIntoGlobalHook(window)
        window.$RefreshReg$ = () => {}
        window.$RefreshSig$ = () => (type) => type
        window.__vite_plugin_react_preamble_installed__ = true
        </script>';
    }

    public function register_all_scripts() {
        $deps = [ 'react', 'react-dom', 'wp-hooks', 'wp-i18n' ];

        wp_register_script( ScriptName::PAGE_SETTINGS, 'http://localhost:3000/main.tsx', $deps, FLEXA_RETAILERS_MANAGEMENT_VERSION, true );
        wp_set_script_translations( ScriptName::PAGE_SETTINGS, 'retailers-management-for-woocommerce', FLEXA_RETAILERS_MANAGEMENT_PLUGIN_DIR . 'languages' );

        wp_register_script( ScriptName::PAGE_PRODUCT_RETAILERS, 'http://localhost:3000/woocommerce/product-retailers.tsx', $deps, FLEXA_RETAILERS_MANAGEMENT_VERSION, true );
        wp_set_script_translations( ScriptName::PAGE_PRODUCT_RETAILERS, 'retailers-management-for-woocommerce', FLEXA_RETAILERS_MANAGEMENT_PLUGIN_DIR . 'languages' );

        // Frontend script
        $frontend_deps = [ 'react', 'react-dom', 'wp-i18n' ];
        wp_register_script( ScriptName::PAGE_PRODUCT_RETAILERS_FRONTEND, 'http://localhost:3001/product-retailers-frontend.tsx', $frontend_deps, FLEXA_RETAILERS_MANAGEMENT_VERSION, true );
        wp_set_script_translations( ScriptName::PAGE_PRODUCT_RETAILERS_FRONTEND, 'retailers-management-for-woocommerce', FLEXA_RETAILERS_MANAGEMENT_PLUGIN_DIR . 'languages' );
    }
}
