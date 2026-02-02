<?php
namespace RetailersManagement\Helpers;

/**
 * Helper Class
 */
class Helper {

    protected function __construct() {}

    public static function get_js_config() {
        $config = [
            'plugin_url' => FLEXA_RETAILERS_MANAGEMENT_PLUGIN_URL,
            'rest_url'   => esc_url_raw( rest_url() ),
            'rest_nonce' => wp_create_nonce( 'wp_rest' ),
            'rest_base'  => 'retailers-management-for-woocommerce/v1',

            'currency_settings' => [
			    'currency'     => get_woocommerce_currency(),
			    'symbol'       => html_entity_decode( get_woocommerce_currency_symbol(), ENT_COMPAT ),
			    'position'     => get_option( 'woocommerce_currency_pos' ),
			    'thousand_sep' => get_option( 'woocommerce_price_thousand_sep' ),
			    'decimal_sep'  => get_option( 'woocommerce_price_decimal_sep' ),
			    'num_decimals' => intval( get_option( 'woocommerce_price_num_decimals' ) ),
		    ],
        ];

        return apply_filters( 'retailers_management_js_config', $config );
    }

    public static function get_default_settings() {
        $section_title    = __( 'Where to Buy', 'retailers-management-for-woocommerce' );
        $default_settings = [
            'general'  => [
                'showOnProducts'      => true,
                'openNewTab'          => true,
                'enableClickTracking' => true,
            ],
            'display'  => [
                'sectionTitle' => $section_title,
                'position'     => 'after_product_price',
                'layoutStyle'  => 'list',
                'visibility'   => [
                    'logo'          => true,
                    'name'          => true,
                    'type'          => true,
                    'address'       => true,
                    'stock'         => true,
                    'price'         => true,
                    'originalPrice' => true,
                    'button'        => true,
                ],
            ],
            'advanced' => [
                'stockBasedDisplayRules' => [
                    'showWhen'              => 'always',
                    'hideAddToCardWhenShow' => false,
                ],
                'geoTargeting'           => [
                    'showDifferentRetailersOnCountry' => false,
                    'autoDetectLocation'              => false,
                ],
            ],
        ];

        return apply_filters( 'retailers_management_default_settings', $default_settings );
    }
}
