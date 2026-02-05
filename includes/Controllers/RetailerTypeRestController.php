<?php
namespace RetailersManagement\Controllers;

use RetailersManagement\Utils\SingletonTrait;
use RetailersManagement\Helpers\RetailerTypeHelper;

defined( 'ABSPATH' ) || exit;

/**
 * Handles Retailer Types Management REST API endpoints.
 */
class RetailerTypeRestController extends BaseRestController {
    use SingletonTrait;

    /**
     * Constructor.
     *
     * @return void
     */
    protected function __construct() {
        $this->init_hooks();
    }

    /*
     * Initialize the hooks.
     *
     * @return void
     */
    protected function init_hooks(): void {
        register_rest_route(
            $this->namespace,
            '/retailer-types',
            [
                [
                    'methods'             => 'GET',
                    'callback'            => [ $this, 'index' ],
                    'permission_callback' => [ $this,'permission_callback' ],
                ],
                [
                    'methods'             => 'POST',
                    'callback'            => [ $this, 'store' ],
                    'permission_callback' => [ $this,'permission_callback' ],
                ],
            ]
        );

        register_rest_route(
            $this->namespace,
            '/retailer-types/(?P<retailerTypeId>\d+)',
            [
                [
                    'methods'             => 'GET',
                    'callback'            => [ $this, 'get' ],
                    'permission_callback' => [ $this,'permission_callback' ],
                ],
                [
                    'methods'             => 'PUT',
                    'callback'            => [ $this, 'update' ],
                    'permission_callback' => [ $this,'permission_callback' ],
                ],
                [
                    'methods'             => 'DELETE',
                    'callback'            => [ $this, 'destroy' ],
                    'permission_callback' => [ $this,'permission_callback' ],
                ],
            ]
        );

        register_rest_route(
            $this->namespace,
            '/retailer-types/bulk-delete',
            [
                [
                    'methods'             => 'DELETE',
                    'callback'            => [ $this, 'bulk_delete' ],
                    'permission_callback' => [ $this,'permission_callback' ],
                ],
            ]
        );

        register_rest_route(
            $this->namespace,
            '/retailer-types/bulk-status',
            [
                'methods'             => 'PUT',
                'callback'            => [ $this, 'bulk_update_status' ],
                'permission_callback' => [ $this, 'permission_callback' ],
            ]
        );
    }

    /*
     * Permission callback for retailer types REST API endpoints.
     *
     * @param WP_REST_Request $request The request object.
     * @return bool|\WP_Error The result of the permission check.
     */
    public function permission_callback( \WP_REST_Request $request ) {
        return current_user_can( 'manage_options' )
            ? true
            : new \WP_Error(
                'rest_forbidden',
                __( 'You are not allowed to manage retailer types.', 'retailers-management-for-woocommerce' ),
                [ 'status' => 403 ]
            );
    }

    /*
     * Get the list of retailer types.
     *
     * @param WP_REST_Request $request The request object.
     * @return WP_REST_Response The response object.
     */
    public function index( \WP_REST_Request $request ): \WP_REST_Response {
        $page     = max( 1, absint( $request->get_param( 'page' ) ?? 1 ) );
        $per_page = absint( $request->get_param( 'per_page' ) ?? RetailerTypeHelper::RETAILER_TYPE_PER_PAGE );
        $per_page = $per_page > 0 ? min( $per_page, RetailerTypeHelper::RETAILER_TYPE_MAX_PER_PAGE ) : RetailerTypeHelper::RETAILER_TYPE_PER_PAGE;
        $keyword  = is_string( $request->get_param( 'kw' ) ) ? sanitize_text_field( $request->get_param( 'kw' ) ) : '';
        $status   = $request->get_param( 'status' );
        $status   = in_array( $status, [ 'all', '1', '0' ], true ) ? $status : RetailerTypeHelper::RETAILER_TYPE_ALL_STATUS;
        $is_active = rest_sanitize_boolean( $request->get_param( 'active' ) ?? false );
        if ( $is_active ) {
            $data = RetailerTypeHelper::get_all_retailer_types_by_active_status();
            return $this->success( $data, __( 'Retailer types fetched successfully', 'retailers-management-for-woocommerce' ) );
        }

        $offset = ( $page - 1 ) * $per_page;

        $args = [
            'taxonomy'   => RetailerTypeHelper::RETAILER_TYPE_TAXONOMY,
            'hide_empty' => false,
            'number'     => $per_page,
            'offset'     => $offset,
            'orderby'    => 'term_id',
            'order'      => 'DESC',
        ];

        if ( 'all' !== $status ) {
            $args['meta_status'] = $status;
        }

        if ( '' !== $keyword ) {
            $args['search'] = $keyword;
        }

        $terms = get_terms( $args );

        $count_args = [
            'taxonomy'   => RetailerTypeHelper::RETAILER_TYPE_TAXONOMY,
            'hide_empty' => false,
            'fields'     => 'ids',
        ];

        if ( 'all' !== $status ) {
            $count_args['meta_status'] = $status;
        }

        if ( ! empty( $keyword ) ) {
            $count_args['search'] = $keyword;
        }

        $total_items = wp_count_terms( $count_args );

        $data = array_map(
            fn( $term ) => [
                'id'             => $term->term_id,
                'name'           => $term->name,
                'description'    => $term->description,
                'slug'           => $term->slug,
                'status'         => (bool) get_term_meta( $term->term_id, RetailerTypeHelper::RETAILER_TYPE_META_STATUS, true ),
                'color'          => get_term_meta( $term->term_id, RetailerTypeHelper::RETAILER_TYPE_META_COLOR, true ),
                'icon'           => get_term_meta( $term->term_id, RetailerTypeHelper::RETAILER_TYPE_META_ICON_URL, true ),
                'retailersCount' => RetailerTypeHelper::count_retailers_by_retailer_type_id( $term->term_id ),
            ],
            $terms
        );

        $total_pages = (int) ceil( $total_items / $per_page );

        $response = [
            'currentPage' => $page,
            'totalItems'  => (int) $total_items,
            'totalPages'  => $total_pages,
            'data'        => $data,
        ];

        return $this->success( $response, __( 'Retailer types fetched successfully', 'retailers-management-for-woocommerce' ) );
    }


    public function store( \WP_REST_Request $request ): \WP_REST_Response {
        $retailer_type_name = sanitize_text_field( (string) ( $request->get_param( 'name' ) ?? '' ) );

        if ( '' === $retailer_type_name ) {
            return $this->error( __( 'Missing retailer type name', 'retailers-management-for-woocommerce' ) );
        }

        $term = wp_insert_term(
            sanitize_text_field( $retailer_type_name ),
            RetailerTypeHelper::RETAILER_TYPE_TAXONOMY,
            [
                'description' => sanitize_textarea_field( $request->get_param( 'description' ) ?? '' ),
            ]
        );

        if ( is_wp_error( $term ) ) {
            return $this->error( $term->get_error_message(), 400 );
        }

        update_term_meta( $term['term_id'], RetailerTypeHelper::RETAILER_TYPE_META_STATUS, rest_sanitize_boolean( $request->get_param( 'status' ) ?? true ) );
        update_term_meta( $term['term_id'], RetailerTypeHelper::RETAILER_TYPE_META_COLOR, sanitize_text_field( $request->get_param( 'color' ) ?? '#000000' ) );
        update_term_meta( $term['term_id'], RetailerTypeHelper::RETAILER_TYPE_META_ICON_URL, sanitize_text_field( $request->get_param( 'icon' ) ?? '' ) );

        $new_retailer_type = array_merge(
            $this->get_json_params( $request ),
            [
                'id'   => $term['term_id'],
                'slug' => get_term( $term['term_id'] )->slug,
            ]
        );

        return $this->success( $new_retailer_type, __( 'Retailer type created successfully', 'retailers-management-for-woocommerce' ) );
    }

    /*
     * Get a retailer type.
     *
     * @param WP_REST_Request $request The request object.
     * @return WP_REST_Response The response object.
     */
    public function get( \WP_REST_Request $request ): \WP_REST_Response {
        $id = absint( $request->get_param( 'retailerTypeId' ) );
        if ( ! $id ) {
            return $this->error( __( 'Missing retailer type id', 'retailers-management-for-woocommerce' ) );
        }
        $retailer_type = get_term( $id, RetailerTypeHelper::RETAILER_TYPE_TAXONOMY );
        if ( is_wp_error( $retailer_type ) ) {
            return $this->error( $retailer_type->get_error_message(), 400 );
        }
        $retailer_type_data = [
            'id'          => $retailer_type->term_id,
            'name'        => $retailer_type->name,
            'description' => $retailer_type->description,
            'status'      => (bool) get_term_meta( $retailer_type->term_id, RetailerTypeHelper::RETAILER_TYPE_META_STATUS, true ),
            'color'       => get_term_meta( $retailer_type->term_id, RetailerTypeHelper::RETAILER_TYPE_META_COLOR, true ),
            'icon'        => get_term_meta( $retailer_type->term_id, RetailerTypeHelper::RETAILER_TYPE_META_ICON_URL, true ),
        ];
        return $this->success( $retailer_type_data );
    }

    /*
     * Update a retailer type.
     *
     * @param WP_REST_Request $request The request object.
     * @return WP_REST_Response The response object.
     */
    public function update( \WP_REST_Request $request ): \WP_REST_Response {
        $id = absint( $request->get_param( 'retailerTypeId' ) );
        if ( ! $id ) {
            return $this->error( __( 'Missing retailer type id', 'retailers-management-for-woocommerce' ) );
        }

        $term_args = [];

        if ( $request->has_param( 'name' ) ) {
            $term_args['name'] = sanitize_text_field( (string) ( $request->get_param( 'name' ) ?? '' ) );
        }

        if ( $request->has_param( 'description' ) ) {
            $term_args['description'] = sanitize_textarea_field( (string) ( $request->get_param( 'description' ) ?? '' ) );
        }

        if ( ! empty( $term_args ) ) {
            $term = wp_update_term(
                $id,
                RetailerTypeHelper::RETAILER_TYPE_TAXONOMY,
                $term_args
            );

            if ( is_wp_error( $term ) ) {
                return $this->error( $term->get_error_message(), 400 );
            }
        } else {
            $term = get_term( $id, RetailerTypeHelper::RETAILER_TYPE_TAXONOMY );
        }

        if ( $request->has_param( 'status' ) ) {
            update_term_meta( $id, RetailerTypeHelper::RETAILER_TYPE_META_STATUS, rest_sanitize_boolean( $request->get_param( 'status' ) ) );
        }

        if ( $request->has_param( 'color' ) ) {
            update_term_meta( $id, RetailerTypeHelper::RETAILER_TYPE_META_COLOR, sanitize_text_field( (string) $request->get_param( 'color' ) ) );
        }

        if ( $request->has_param( 'icon' ) ) {
            update_term_meta( $id, RetailerTypeHelper::RETAILER_TYPE_META_ICON_URL, sanitize_text_field( (string) $request->get_param( 'icon' ) ) );
        }

        $retailer_type_data = [
            'id'          => $term->term_id,
            'name'        => $term->name,
            'description' => $term->description,
            'status'      => (bool) get_term_meta( $term->term_id, RetailerTypeHelper::RETAILER_TYPE_META_STATUS, true ),
            'color'       => get_term_meta( $term->term_id, RetailerTypeHelper::RETAILER_TYPE_META_COLOR, true ),
            'icon'        => get_term_meta( $term->term_id, RetailerTypeHelper::RETAILER_TYPE_META_ICON_URL, true ),
        ];

        return $this->success( $retailer_type_data, __( 'Retailer type updated successfully', 'retailers-management-for-woocommerce' ) );
    }

    /*
     * Delete a retailer type.
     *
     * @param WP_REST_Request $request The request object.
     * @return WP_REST_Response The response object.
     */
    public function destroy( \WP_REST_Request $request ): \WP_REST_Response {
        $id = absint( $request->get_param( 'retailerTypeId' ) );
        if ( ! $id ) {
            return $this->error( __( 'Missing retailer type id', 'retailers-management-for-woocommerce' ) );
        }

        $result = wp_delete_term( $id, RetailerTypeHelper::RETAILER_TYPE_TAXONOMY );

        if ( is_wp_error( $result ) ) {
            return $this->error( $result->get_error_message(), 400 );
        }

        return $this->success( [], __( 'Retailer type deleted successfully', 'retailers-management-for-woocommerce' ) );
    }

    /*
     * Bulk delete retailer types.
     *
     * @param WP_REST_Request $request The request object.
     * @return WP_REST_Response The response object.
     */
    public function bulk_delete( \WP_REST_Request $request ): \WP_REST_Response {
        $ids = $request->get_param( 'ids' );
        $ids = is_array( $ids ) ? array_map( 'absint', array_filter( $ids, 'is_numeric' ) ) : [];
        if ( empty( $ids ) ) {
            return $this->error( __( 'Missing retailer type ids', 'retailers-management-for-woocommerce' ) );
        }
        foreach ( $ids as $id ) {
            $id     = absint( $id );
            $result = wp_delete_term( $id, RetailerTypeHelper::RETAILER_TYPE_TAXONOMY );
            if ( is_wp_error( $result ) ) {
                continue;
            }
        }
        return $this->success( [], __( 'Retailer types bulk deleted successfully', 'retailers-management-for-woocommerce' ) );
    }

    /*
     * Bulk update retailer type status.
     *
     * @param WP_REST_Request $request The request object.
     * @return WP_REST_Response The response object.
     */
    public function bulk_update_status( \WP_REST_Request $request ): \WP_REST_Response {
        $ids = $request->get_param( 'ids' );
        $ids = is_array( $ids ) ? array_map( 'absint', array_filter( $ids, 'is_numeric' ) ) : [];
        $status = $request->get_param( 'status' );

        if ( empty( $ids ) ) {
            return $this->error(
                __( 'Retailer type ids are required', 'retailers-management-for-woocommerce' ),
                400
            );
        }

        if ( ! $request->has_param( 'status' ) ) {
            return $this->error(
                __( 'Status is required', 'retailers-management-for-woocommerce' ),
                400
            );
        }

        $status = rest_sanitize_boolean( $request->get_param( 'status' ) );

        $updated_ids = [];

        foreach ( $ids as $id ) {
            $term = get_term( $id, RetailerTypeHelper::RETAILER_TYPE_TAXONOMY );

            if ( is_wp_error( $term ) || ! $term ) {
                continue;
            }

            update_term_meta(
                $id,
                RetailerTypeHelper::RETAILER_TYPE_META_STATUS,
                $status
            );

            $updated_ids[] = $id;
        }

        return $this->success(
            [
                'updated_ids' => $updated_ids,
                'status'      => $status,
                'count'       => count( $updated_ids ),
            ],
            __( 'Retailer type statuses updated successfully', 'retailers-management-for-woocommerce' )
        );
    }
}
