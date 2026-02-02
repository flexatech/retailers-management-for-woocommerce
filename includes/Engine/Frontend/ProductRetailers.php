<?php
namespace RetailersManagement\Engine\Frontend;

use RetailersManagement\Utils\SingletonTrait;
use RetailersManagement\Helpers\ProductRetailersHelper;
use RetailersManagement\Helpers\Helper;
use RetailersManagement\Helpers\RetailerHelper;
use RetailersManagement\Register\ScriptName;

defined( 'ABSPATH' ) || exit;

/**
 * Product Retailers Frontend Display
 */
class ProductRetailers {
    use SingletonTrait;

    /**
     * Track if retailers have been displayed to prevent duplicate rendering
     *
     * @var bool
     */
    private static $displayed = false;

    protected function __construct() {
        // Reset displayed flag on each page load
        add_action( 'wp', [ $this, 'reset_displayed_flag' ] );
        add_action( 'wp', [ $this, 'setup_display_hooks' ] );

        // Enqueue scripts and styles on frontend product pages
        add_action( 'wp_enqueue_scripts', [ $this, 'enqueue_scripts' ] );
    }

    /**
     * Setup display hooks based on settings
     *
     * @return void
     */
    public function setup_display_hooks() {
        if ( ! is_singular( 'product' ) ) {
            return;
        }

        $settings = get_option( 'retailers_management_settings' );
        if ( ! is_array( $settings ) ) {
            $settings = Helper::get_default_settings();
        }

        // Check if retailers should be shown on products
        if ( ! empty( $settings['general']['showOnProducts'] ) && ! $settings['general']['showOnProducts'] ) {
            return;
        }

        $position = $settings['display']['position'] ?? 'after_product_price';

        // Register hooks based on position setting
        switch ( $position ) {
            case 'after_product_price':
                add_action( 'woocommerce_single_product_summary', [ $this, 'display_product_retailers' ], 25 );
                break;
            case 'after_add_to_cart_button':
                add_action( 'woocommerce_after_add_to_cart_button', [ $this, 'display_product_retailers' ], 25 );
                break;
            case 'below_product_details':
                add_action( 'woocommerce_after_single_product_summary', [ $this, 'display_product_retailers' ], 5 );
                break;
            case 'product_tab':
                add_filter( 'woocommerce_product_tabs', [ $this, 'add_retailers_tab' ] );
                break;
        }
    }

    /**
     * Reset displayed flag on each page load
     *
     * @return void
     */
    public function reset_displayed_flag() {
        self::$displayed = false;
    }

    /**
     * Add retailers tab to product tabs
     *
     * @param array $tabs Existing tabs.
     * @return array Modified tabs.
     */
    public function add_retailers_tab( $tabs ) {
        global $product;

        if ( ! $product ) {
            return $tabs;
        }

        $product_id        = $product->get_id();
        $product_retailers = get_post_meta( $product_id, ProductRetailersHelper::PRODUCT_RETAILERS_META_KEY, true ) ?? [];

        if ( empty( $product_retailers ) || ! is_array( $product_retailers ) ) {
            return $tabs;
        }

        $valid_retailers = array_filter(
            $product_retailers,
            function( $retailer ) {
                return ! empty( $retailer['retailerId'] ) && $retailer['retailerId'] > 0;
            }
        );

        if ( empty( $valid_retailers ) ) {
            return $tabs;
        }

        $settings = get_option( 'retailers_management_settings' );
        if ( ! is_array( $settings ) ) {
            $settings = Helper::get_default_settings();
        }

        $section_title = $settings['display']['sectionTitle'] ?? __( 'Where to Buy', 'retailers-management-for-woocommerce' );

        $tabs['retailers'] = [
            'title'    => $section_title,
            'priority' => 25,
            'callback' => [ $this, 'display_product_retailers' ],
        ];

        return $tabs;
    }

    /**
     * Display Product Retailers on Frontend Product Page
     *
     * @return void
     */
    public function display_product_retailers() {
        // Prevent duplicate rendering if both hooks fire
        if ( self::$displayed ) {
            return;
        }

        global $product;

        if ( ! $product ) {
            return;
        }

        $product_id        = $product->get_id();
        $product_retailers = get_post_meta( $product_id, ProductRetailersHelper::PRODUCT_RETAILERS_META_KEY, true ) ?? [];

        // Only display if there are retailers assigned
        if ( empty( $product_retailers ) || ! is_array( $product_retailers ) ) {
            return;
        }

        // Filter out retailers without retailerId
        $valid_retailers = array_filter(
            $product_retailers,
            function( $retailer ) {
                return ! empty( $retailer['retailerId'] ) && $retailer['retailerId'] > 0;
            }
        );

        if ( empty( $valid_retailers ) ) {
            return;
        }

        // Check advanced settings - stock-based display rules
        $settings = get_option( 'retailers_management_settings' );
        if ( ! is_array( $settings ) ) {
            $settings = Helper::get_default_settings();
        }

        $show_when   = $settings['advanced']['stockBasedDisplayRules']['showWhen'] ?? 'always';
        $should_show = true;

        if ( 'in_stock' === $show_when && ! $product->is_in_stock() ) {
            $should_show = false;
        } elseif ( 'out_of_stock' === $show_when && $product->is_in_stock() ) {
            $should_show = false;
        }

        if ( ! $should_show ) {
            return;
        }

        // Hide Add to Cart button if setting is enabled
        if ( ! empty( $settings['advanced']['stockBasedDisplayRules']['hideAddToCardWhenShow'] ) ) {
            remove_action( 'woocommerce_single_product_summary', 'woocommerce_template_single_add_to_cart', 30 );
        }

        self::$displayed = true;

        ?>
        <div id="rmfw-product-retailers-frontend" data-product-id="<?php echo esc_attr( $product_id ); ?>"></div>
        <?php
    }

    /**
     * Enqueue Scripts and Styles for Frontend Product Retailers
     *
     * @return void
     */
    public function enqueue_scripts() {
        if ( ! is_singular( 'product' ) ) {
            return;
        }

        $product_id = get_queried_object_id();

        if ( ! $product_id ) {
            return;
        }

        $product = wc_get_product( $product_id );

        if ( ! $product ) {
            return;
        }

        // Load settings from database
        $settings = get_option( 'retailers_management_settings' );
        if ( ! is_array( $settings ) ) {
            $settings = Helper::get_default_settings();
        }

        // Check if retailers should be shown on products
        $showOnProducts = $settings['general']['showOnProducts'] ?? true;
        if ( ! $showOnProducts ) {
            return;
        }
        
        $product_retailers = get_post_meta(
            $product_id,
            ProductRetailersHelper::PRODUCT_RETAILERS_META_KEY,
            true
        ) ?? [];

        if ( empty( $product_retailers ) || ! is_array( $product_retailers ) ) {
            return;
        }

        $config                      = Helper::get_js_config();
        $config['product_retailers'] = $product_retailers;
        $config['active_retailers']  = RetailerHelper::get_all_retailers_by_active_status();
        $config['settings'] = $settings;
        
        wp_localize_script(
            ScriptName::PAGE_PRODUCT_RETAILERS_FRONTEND,
            'retailersManagement',
            $config
        );

        wp_enqueue_script( ScriptName::PAGE_PRODUCT_RETAILERS_FRONTEND );
        wp_enqueue_style( ScriptName::STYLE_PRODUCT_RETAILERS_FRONTEND );
    }
}
