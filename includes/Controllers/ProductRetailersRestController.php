<?php
namespace RetailersManagement\Controllers;

use RetailersManagement\Utils\SingletonTrait;

use RetailersManagement\Helpers\ProductRetailersHelper;
use WP_REST_Request;
use WP_REST_Response;

defined( 'ABSPATH' ) || exit;

/**
 * Handles Product Retailers REST API endpoints.
 */
class ProductRetailersRestController extends BaseRestController {
    use SingletonTrait;

    /**
     * Constructor.
     *
     * @return void
     */
    protected function __construct() {
        $this->init_hooks();
    }

    /**
     * Initialize the hooks.
     *
     * @return void
     */
    protected function init_hooks(): void {
        register_rest_route(
            $this->namespace,
            '/products/(?P<productId>\d+)/retailers',
            [
                [
                    'methods'             => 'GET',
                    'callback'            => [ $this, 'get_product_retailers' ],
                    'permission_callback' => [ $this, 'permission_callback' ],
                ],
                [
                    'methods'             => 'POST',
                    'callback'            => [ $this, 'save_product_retailers' ],
                    'permission_callback' => [ $this, 'permission_callback' ],
                ],
            ]
        );
    }

    /**
     * Get product retailers.
     *
     * @param WP_REST_Request $request The request object.
     * @return WP_REST_Response The response object.
     */
    public function get_product_retailers( WP_REST_Request $request ): WP_REST_Response {
        $product_id = (int) $request->get_param( 'productId' );

        if ( ! $product_id || ! get_post( $product_id ) ) {
            return $this->error( __( 'Invalid product ID', 'retailers-management-for-woocommerce' ), 404 );
        }

        $retailers = get_post_meta( $product_id, ProductRetailersHelper::PRODUCT_RETAILERS_META_KEY, true );

        if ( ! is_array( $retailers ) ) {
            $retailers = [];
        }

        return $this->success( $retailers );
    }

    /**
     * Save product retailers.
     *
     * @param WP_REST_Request $request The request object.
     * @return WP_REST_Response The response object.
     */
    public function save_product_retailers( WP_REST_Request $request ): WP_REST_Response {
        $product_id = (int) $request->get_param( 'productId' );

        if ( ! $product_id || ! get_post( $product_id ) ) {
            return $this->error( __( 'Invalid product ID', 'retailers-management-for-woocommerce' ), 404 );
        }

        $retailers = $request->get_param( 'retailers' );

        if ( ! is_array( $retailers ) ) {
            return $this->error( __( 'Invalid retailers data', 'retailers-management-for-woocommerce' ) );
        }

        // Save to product meta
        update_post_meta( $product_id, ProductRetailersHelper::PRODUCT_RETAILERS_META_KEY, $retailers );

        return $this->success(
            $retailers,
            __( 'Saved Changes', 'retailers-management-for-woocommerce' )
        );
    }
}
