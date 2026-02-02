<?php
namespace RetailersManagement\Engine\Admin;

use RetailersManagement\Utils\SingletonTrait;
use RetailersManagement\Helpers\ProductRetailersHelper;
use RetailersManagement\Helpers\Helper;
use RetailersManagement\Helpers\RetailerHelper;
use RetailersManagement\Register\ScriptName;

defined( 'ABSPATH' ) || exit;

/**
 * Product Retailers Tab
 */
class ProductRetailersTab {
    use SingletonTrait;

    protected function __construct() {
        // Register Product Retailers Tab
        add_action( 'woocommerce_product_data_tabs', [ $this, 'product_retailers_tab' ] );
        add_action( 'woocommerce_product_data_panels', [ $this, 'product_retailers_panel' ] );
        add_action( 'admin_enqueue_scripts', [ $this, 'enqueue_scripts' ] );
    }

    /**
     * Add Product Retailers Tab to Product Edit Page
     *
     * @param array $tabs Product Tabs.
     * @return array
     */
    public function product_retailers_tab( $tabs ) {
        $tabs['retailers'] = [
            'label'  => __( 'Retailers', 'retailers-management-for-woocommerce' ),
            'target' => 'rmfw-retailers-product-data',
            'class'  => [ 'show_if_simple', 'show_if_variable' ],
        ];
        return $tabs;
    }

    /**
     * Add Product Retailers Panel to Product Edit Page
     *
     * @return void
     */
    public function product_retailers_panel() {
        global $post;
        $product_id = $post ? $post->ID : 0;
        ?>
        <div id="rmfw-retailers-product-data" class="panel woocommerce_options_panel">
            <div id="rmfw-product-retailers-tab" data-product-id="<?php echo esc_attr( $product_id ); ?>"></div>
        </div>
        <?php
    }

    /**
     * Enqueue Scripts and Styles for Product Retailers Tab
     *
     * @param string $hook_suffix The hook suffix.
     * @return void
     */
    public function enqueue_scripts( $hook_suffix ) {
        // Only enqueue on product edit page
        if ( 'post.php' !== $hook_suffix && 'post-new.php' !== $hook_suffix ) {
            return;
        }

        global $post;
        if ( ! $post || 'product' !== $post->post_type ) {
            return;
        }

        $config = Helper::get_js_config();

        $post_id = isset( $post->ID ) ? $post->ID : 0;

        $config['product_retailers'] = get_post_meta( $post_id, ProductRetailersHelper::PRODUCT_RETAILERS_META_KEY, true ) ?? [];

        $config['active_retailers'] = RetailerHelper::get_all_retailers_by_active_status();

        wp_localize_script( ScriptName::PAGE_PRODUCT_RETAILERS, 'retailersManagement', $config );

        wp_enqueue_script( ScriptName::PAGE_PRODUCT_RETAILERS );

        wp_enqueue_style( ScriptName::STYLE_SETTINGS );
    }
}
