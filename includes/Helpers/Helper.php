<?php
namespace RetailersManagement\Helpers;

/**
 * Helper Class
 */
class Helper {

    protected function __construct() {}

    public static function get_js_config() {
        $config = [
            'plugin_url' => FLEXA_TECH_RETAILERS_MANAGEMENT_PLUGIN_URL,
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
                'showOnProducts' => true,
                'openNewTab'    => true,
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

    /**
     * Sanitize settings before saving to database.
     *
     * @param array $input Raw settings from request.
     * @return array Sanitized settings merged with defaults.
     */
    public static function sanitize_settings( $input ) {
        if ( ! is_array( $input ) ) {
            return self::get_default_settings();
        }

        $defaults = self::get_default_settings();

        $allowed_positions = [ 'after_product_price', 'after_add_to_cart_button', 'below_product_details', 'product_tab' ];
        $allowed_layouts   = [ 'list' ];
        $allowed_show_when = [ 'always', 'out_of_stock', 'in_stock' ];
        $visibility_keys   = [ 'logo', 'name', 'type', 'address', 'stock', 'price', 'originalPrice', 'button' ];

        $general = isset( $input['general'] ) && is_array( $input['general'] ) ? $input['general'] : [];
        $sanitized = [
            'general'  => [
                'showOnProducts' => isset( $general['showOnProducts'] ) ? rest_sanitize_boolean( $general['showOnProducts'] ) : $defaults['general']['showOnProducts'],
                'openNewTab'     => isset( $general['openNewTab'] ) ? rest_sanitize_boolean( $general['openNewTab'] ) : $defaults['general']['openNewTab'],
            ],
            'display'  => [
                'sectionTitle' => isset( $input['display']['sectionTitle'] ) ? sanitize_text_field( $input['display']['sectionTitle'] ) : ( $defaults['display']['sectionTitle'] ?? '' ),
                'position'     => isset( $input['display']['position'] ) && in_array( $input['display']['position'], $allowed_positions, true ) ? $input['display']['position'] : $defaults['display']['position'],
                'layoutStyle'  => isset( $input['display']['layoutStyle'] ) && in_array( $input['display']['layoutStyle'], $allowed_layouts, true ) ? $input['display']['layoutStyle'] : $defaults['display']['layoutStyle'],
                'visibility'   => [],
            ],
            'advanced' => [
                'stockBasedDisplayRules' => [
                    'showWhen'              => $defaults['advanced']['stockBasedDisplayRules']['showWhen'],
                    'hideAddToCardWhenShow' => $defaults['advanced']['stockBasedDisplayRules']['hideAddToCardWhenShow'],
                ],
                'geoTargeting' => [
                    'showDifferentRetailersOnCountry' => $defaults['advanced']['geoTargeting']['showDifferentRetailersOnCountry'],
                    'autoDetectLocation'              => $defaults['advanced']['geoTargeting']['autoDetectLocation'],
                ],
            ],
        ];

        if ( isset( $input['display']['visibility'] ) && is_array( $input['display']['visibility'] ) ) {
            foreach ( $visibility_keys as $key ) {
                $sanitized['display']['visibility'][ $key ] = isset( $input['display']['visibility'][ $key ] ) ? rest_sanitize_boolean( $input['display']['visibility'][ $key ] ) : ( $defaults['display']['visibility'][ $key ] ?? true );
            }
        } else {
            $sanitized['display']['visibility'] = $defaults['display']['visibility'];
        }

        if ( isset( $input['advanced']['stockBasedDisplayRules'] ) && is_array( $input['advanced']['stockBasedDisplayRules'] ) ) {
            $sb = $input['advanced']['stockBasedDisplayRules'];
            $sanitized['advanced']['stockBasedDisplayRules']['showWhen']              = isset( $sb['showWhen'] ) && in_array( $sb['showWhen'], $allowed_show_when, true ) ? $sb['showWhen'] : $defaults['advanced']['stockBasedDisplayRules']['showWhen'];
            $sanitized['advanced']['stockBasedDisplayRules']['hideAddToCardWhenShow'] = isset( $sb['hideAddToCardWhenShow'] ) ? rest_sanitize_boolean( $sb['hideAddToCardWhenShow'] ) : $defaults['advanced']['stockBasedDisplayRules']['hideAddToCardWhenShow'];
        }

        if ( isset( $input['advanced']['geoTargeting'] ) && is_array( $input['advanced']['geoTargeting'] ) ) {
            $gt = $input['advanced']['geoTargeting'];
            $sanitized['advanced']['geoTargeting']['showDifferentRetailersOnCountry'] = isset( $gt['showDifferentRetailersOnCountry'] ) ? rest_sanitize_boolean( $gt['showDifferentRetailersOnCountry'] ) : $defaults['advanced']['geoTargeting']['showDifferentRetailersOnCountry'];
            $sanitized['advanced']['geoTargeting']['autoDetectLocation']              = isset( $gt['autoDetectLocation'] ) ? rest_sanitize_boolean( $gt['autoDetectLocation'] ) : $defaults['advanced']['geoTargeting']['autoDetectLocation'];
        }

        return apply_filters( 'retailers_management_sanitize_settings', $sanitized, $input );
    }
}
