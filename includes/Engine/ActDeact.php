<?php
namespace RetailersManagement\Engine;

/**
 * Activate and deactive method of the plugin and relates.
 */
class ActDeact {

    public static function install_woocommerce_admin_notice() {
        $woocommerce_url = esc_url( admin_url( 'plugin-install.php?s=woocommerce&tab=search&type=term' ) );
        $woocommerce_link = '<a href="' . $woocommerce_url . '">' . esc_html( 'WooCommerce' ) . '</a>';
        $message = sprintf(
            /* translators: %s: WooCommerce plugin installation link. */
            esc_html__( 'Retailers Management for WooCommerce is enabled but not effective. It requires %s in order to work', 'retailers-management-for-woocommerce' ),
            $woocommerce_link
        );
        echo wp_kses(
            '<div class="error"><p><strong>' . $message . '</strong></p></div>',
            [
                'div' => [ 'class' => true ],
                'p'   => [],
                'strong' => [],
                'a'    => [ 'href' => true ],
            ]
        );
        return false;
    }

    public static function before_woocommerce_init() {
        if ( class_exists( \Automattic\WooCommerce\Utilities\FeaturesUtil::class ) ) {
            \Automattic\WooCommerce\Utilities\FeaturesUtil::declare_compatibility( 'custom_order_tables', FLEXA_TECH_RETAILERS_MANAGEMENT_FILE, true );
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
