<?php
namespace RetailersManagement\Controllers;

use RetailersManagement\Utils\SingletonTrait;
use RetailersManagement\Helpers\Helper;
use WP_REST_Request;
use WP_REST_Response;

defined( 'ABSPATH' ) || exit;

/**
 * Handles Settings REST API endpoints.
 */
class SettingsRestController extends BaseRestController {
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
            '/settings',
            [
                [
                    'methods'             => 'GET',
                    'callback'            => [ $this, 'get_settings' ],
                    'permission_callback' => [ $this, 'permission_callback' ],
                ],
                [
                    'methods'             => 'POST',
                    'callback'            => [ $this, 'save_settings' ],
                    'permission_callback' => [ $this, 'permission_callback' ],
                ],
            ]
        );
    }

    /*
     * Permission callback for settings REST API endpoints.
     *
     * @param WP_REST_Request $request The request object.
     * @return bool|\WP_Error The result of the permission check.
     */
    public function permission_callback( \WP_REST_Request $request ) {
        return current_user_can( 'manage_options' )
            ? true
            : new \WP_Error(
                'rest_forbidden',
                __( 'You are not allowed to manage settings.', 'retailers-management-for-woocommerce' ),
                [ 'status' => 403 ]
            );
    }

    /**
     * Get settings.
     *
     * @param WP_REST_Request $request The request object.
     * @return WP_REST_Response The response object.
     */
    public function get_settings( WP_REST_Request $request ): WP_REST_Response {
        $settings = get_option( 'retailers_management_settings' );

        if ( ! is_array( $settings ) ) {
            $settings = Helper::get_default_settings();
        }

        return $this->success( $settings );
    }

    /**
     * Save settings.
     *
     * @param WP_REST_Request $request The request object.
     * @return WP_REST_Response The response object.
     */
    public function save_settings( WP_REST_Request $request ): WP_REST_Response {
        $settings = $this->get_json_params( $request );
        if ( ! is_array( $settings ) ) {
            $settings = Helper::get_default_settings();
        }
        update_option( 'retailers_management_settings', $settings );
        return $this->success( $settings, __( 'Settings saved successfully', 'retailers-management-for-woocommerce' ) );
    }
}
