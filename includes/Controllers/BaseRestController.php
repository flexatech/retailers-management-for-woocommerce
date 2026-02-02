<?php
namespace RetailersManagement\Controllers;

use WP_REST_Request;
use WP_REST_Response;

defined( 'ABSPATH' ) || exit;

/**
 * Class BaseRestController
 *
 * Provides common methods for REST controllers.
 */
abstract class BaseRestController {

    protected string $namespace = 'retailers-management-for-woocommerce/v1';

    /**
     * Generic permission callback for REST routes.
     *
     * Rules:
     * - Administrators (manage_options): always allowed
     * - Editing an existing product: must be able to edit that product
     * - Adding a new product: must be able to edit products
     *
     * @param WP_REST_Request $request Request object.
     * @return bool|\WP_Error
     */
    public function permission_callback( WP_REST_Request $request ) {

        // 1. Admin always allowed
        if ( current_user_can( 'manage_options' ) ) {
            return true;
        }

        $product_id = (int) $request->get_param( 'productId' );

        // 2. Editing an existing product
        if ( $product_id ) {
            if ( current_user_can( 'edit_post', $product_id ) ) {
                return true;
            }

            return new \WP_Error(
                'rest_forbidden',
                __( 'You are not allowed to edit this product.', 'retailers-management-for-woocommerce' ),
                [ 'status' => 403 ]
            );
        }

        // 3. Adding a new product
        if ( current_user_can( 'edit_products' ) ) {
            return true;
        }

        return new \WP_Error(
            'rest_forbidden',
            __( 'You are not allowed to manage products.', 'retailers-management-for-woocommerce' ),
            [ 'status' => 403 ]
        );
    }

    /*
     * Return a success response.
     *
     * @param array $data The data to return.
     * @param string $message The message to return.
     * @return WP_REST_Response The response object.
     */
    protected function success( array $data = [], string $message = '' ): WP_REST_Response {
        return rest_ensure_response(
            array_filter(
                [
                    'success' => true,
                    'message' => $message,
                    'data'    => $data,
                ]
            )
        );
    }

    /**
     * Return an error response.
     *
     * @param string $message The error message.
     * @param int    $status The HTTP status code.
     * @return WP_REST_Response The response object.
     */
    protected function error( string $message, int $status = 400 ): WP_REST_Response {
        return rest_ensure_response(
            [
                'success' => false,
                'message' => $message,
            ],
            $status
        );
    }

    /**
     * Get the JSON parameters from the request.
     *
     * @param WP_REST_Request $request The request object.
     * @return array The JSON parameters.
     */
    protected function get_json_params( WP_REST_Request $request ): array {
        return (array) $request->get_json_params();
    }

    /**
     * Get the form data from the request.
     *
     * @param WP_REST_Request $request The request object.
     * @return array The form data.
     */
    protected function get_form_data( WP_REST_Request $request ): array {
        return (array) $request->get_body_params();
    }
}
