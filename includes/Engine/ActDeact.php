<?php
namespace RetailersManagement\Engine;

/**
 * Activate and deactive method of the plugin and relates.
 */
class ActDeact {

    public static function install_woocommerce_admin_notice() {
        /* translators: %s: Woocommerce link */
        echo '<div class="error"><p><strong>' . sprintf( esc_html__( 'Retailers Management for WooCommerce is enabled but not effective. It requires %s in order to work', 'retailers-management-for-woocommerce' ), '<a href="' . esc_url( admin_url( 'plugin-install.php?s=woocommerce&tab=search&type=term' ) ) . '">WooCommerce</a>' ) . '</strong></p></div>';
        return false;
    }

    public static function before_woocommerce_init() {
        if ( class_exists( \Automattic\WooCommerce\Utilities\FeaturesUtil::class ) ) {
            \Automattic\WooCommerce\Utilities\FeaturesUtil::declare_compatibility( 'custom_order_tables', FLEXA_RETAILERS_MANAGEMENT_FILE, true );
        }
    }

    public static function activate() {

        if ( ! function_exists( 'WC' ) ) {
            return;
        }
    }

    public static function deactivate() {

        if ( ! function_exists( 'WC' ) ) {
            return;
        }
    }
}
