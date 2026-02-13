<?php
namespace RetailersManagement\Controllers;

use RetailersManagement\Utils\SingletonTrait;
use RetailersManagement\Helpers\RetailerHelper;
use RetailersManagement\Helpers\RetailerTypeHelper;
use RetailersManagement\Helpers\ProductRetailersHelper;

defined( 'ABSPATH' ) || exit;

/**
 * Handles Retailers Management REST API endpoints.
 */
class RetailersRestController extends BaseRestController {
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
            '/retailers',
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
            '/retailers/(?P<retailerId>\d+)',
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
            '/retailers/bulk-delete',
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
            '/retailers/bulk-status',
            [
                'methods'             => 'PUT',
                'callback'            => [ $this, 'bulk_update_status' ],
                'permission_callback' => [ $this, 'permission_callback' ],
            ]
        );
    }

    /*
     * Permission callback for retailers REST API endpoints.
     *
     * @param WP_REST_Request $request The request object.
     * @return bool|\WP_Error The result of the permission check.
     */
    public function permission_callback( \WP_REST_Request $request ) {
        return current_user_can( 'manage_options' )
            ? true
            : new \WP_Error(
                'rest_forbidden',
                __( 'You are not allowed to manage retailers.', 'retailers-management-for-woocommerce' ),
                [ 'status' => 403 ]
            );
    }

    /*
     * Get the list of retailers.
     *
     * @param WP_REST_Request $request The request object.
     * @return WP_REST_Response The response object.
     */
    public function index( \WP_REST_Request $request ): \WP_REST_Response {
        $page     = max( 1, absint( $request->get_param( 'page' ) ?? 1 ) );
        $per_page = absint( $request->get_param( 'per_page' ) ?? RetailerHelper::RETAILER_PER_PAGE );
        $per_page = $per_page > 0 ? min( $per_page, RetailerHelper::RETAILER_MAX_PER_PAGE ) : RetailerHelper::RETAILER_PER_PAGE;
        $keyword  = is_string( $request->get_param( 'kw' ) ) ? sanitize_text_field( $request->get_param( 'kw' ) ) : '';
        $status   = $request->get_param( 'status' );
        $status   = in_array( $status, [ 'all', '1', '0' ], true ) ? $status : 'all';
        $is_active = rest_sanitize_boolean( $request->get_param( 'active' ) ?? false );
        if ( $is_active ) {
            $data = RetailerHelper::get_all_retailers_by_active_status();
            return $this->success( $data, __( 'Retailers fetched successfully', 'retailers-management-for-woocommerce' ) );
        }

        $args = [
            'post_type'      => RetailerHelper::RETAILER_POST_TYPE,
            'post_status'    => 'publish',
            'posts_per_page' => $per_page,
            'paged'          => $page,
        ];

        if ( '' !== $keyword ) {
            $args['s'] = $keyword;
        }

        if ( 'all' !== $status ) {
            $args['meta_query'] = [
                [
                    'key'     => RetailerHelper::RETAILER_META_STATUS,
                    'value'   => '1' === $status ? '1' : '0',
                    'compare' => '=',
                ],
            ];
        }

        /**
         * Query retailers
         */
        $query = new \WP_Query( $args );

        /**
         * Build product counts per retailer (for list view stats).
         */
        $product_counts = [];

        if ( ! empty( $query->posts ) ) {
            $retailer_ids = wp_list_pluck( $query->posts, 'ID' );

            // Default all counts to 0.
            $product_counts = array_fill_keys( $retailer_ids, 0 );

            // Find all products that have any retailers assigned.
            $product_query = new \WP_Query(
                [
                    'post_type'      => 'product',
                    'post_status'    => 'publish',
                    'posts_per_page' => -1,
                    'meta_query'     => [
                        [
                            'key'     => ProductRetailersHelper::PRODUCT_RETAILERS_META_KEY,
                            'compare' => 'EXISTS',
                        ],
                    ],
                    'fields'         => 'ids',
                ]
            );

            if ( ! empty( $product_query->posts ) ) {
                foreach ( $product_query->posts as $product_id ) {
                    $retailers_meta = get_post_meta(
                        $product_id,
                        ProductRetailersHelper::PRODUCT_RETAILERS_META_KEY,
                        true
                    );

                    if ( ! is_array( $retailers_meta ) ) {
                        continue;
                    }

                    foreach ( $retailers_meta as $item ) {
                        if ( ! is_array( $item ) || empty( $item['retailerId'] ) ) {
                            continue;
                        }

                        $retailer_id = absint( $item['retailerId'] );

                        if ( $retailer_id && isset( $product_counts[ $retailer_id ] ) ) {
                            $product_counts[ $retailer_id ]++;
                        }
                    }
                }
            }
        }

        $data = array_map(
            function ( $post ) use ( $product_counts ) {

                $type_terms = wp_get_post_terms(
                    $post->ID,
                    RetailerTypeHelper::RETAILER_TYPE_TAXONOMY
                );

                $type_id = $type_terms[0]->term_id ?? null;

                return [
                    'id'           => $post->ID,
                    'name'         => get_the_title( $post ),
                    'slug'         => $post->post_name,
                    'type'         => $type_id,
                    'type_info'    => ! $type_id ? null : [
                        'id'    => $type_id,
                        'name'  => $type_terms[0]->name,
                        'color' => get_term_meta( $type_id, RetailerTypeHelper::RETAILER_TYPE_META_COLOR, true ),
                    ],
                    'description'  => get_the_excerpt( $post ),
                    'status'       => (bool) get_post_meta(
                        $post->ID,
                        RetailerHelper::RETAILER_META_STATUS,
                        true
                    ),
                    'logo'         => get_post_meta(
                        $post->ID,
                        RetailerHelper::RETAILER_META_LOGO,
                        true
                    ),
                    'ecommerceUrl' => get_post_meta(
                        $post->ID,
                        RetailerHelper::RETAILER_META_ECOMMERCE_URL,
                        true
                    ),
                    'phone'        => get_post_meta(
                        $post->ID,
                        RetailerHelper::RETAILER_META_PHONE,
                        true
                    ),
                    'email'        => get_post_meta(
                        $post->ID,
                        RetailerHelper::RETAILER_META_EMAIL,
                        true
                    ),
                    'address'      => get_post_meta(
                        $post->ID,
                        RetailerHelper::RETAILER_META_ADDRESS,
                        true
                    ),
                    'latitude'     => (float) get_post_meta(
                        $post->ID,
                        RetailerHelper::RETAILER_META_LATITUDE,
                        true
                    ),
                    'longitude'    => (float) get_post_meta(
                        $post->ID,
                        RetailerHelper::RETAILER_META_LONGITUDE,
                        true
                    ),
                    'products'     => isset( $product_counts[ $post->ID ] ) ? (int) $product_counts[ $post->ID ] : 0,
                ];
            },
            $query->posts
        );

        $response = [
            'currentPage' => $page,
            'totalItems'  => (int) $query->found_posts,
            'totalPages'  => (int) $query->max_num_pages,
            'data'        => $data,
        ];

        return $this->success(
            $response,
            __( 'Retailers fetched successfully', 'retailers-management-for-woocommerce' )
        );
    }

    public function store( \WP_REST_Request $request ): \WP_REST_Response {

        $retailer_name = sanitize_text_field( $request->get_param( 'name' ) ?? '' );

        if ( ! $retailer_name ) {
            return $this->error( __( 'Missing retailer name', 'retailers-management-for-woocommerce' ) );
        }

        $post_id = wp_insert_post(
            [
                'post_type'    => RetailerHelper::RETAILER_POST_TYPE,
                'post_title'   => $retailer_name,
                'post_content' => wp_kses_post( $request->get_param( 'description' ) ?? '' ),
                'post_status'  => 'publish',
            ],
            true
        );

        if ( is_wp_error( $post_id ) ) {
            return $this->error( $post_id->get_error_message(), 400 );
        }

        $status = rest_sanitize_boolean( $request->get_param( 'status' ) ?? true );

        /**
        * Retailer Type (taxonomy)
        */
        if ( $request->has_param( 'type' ) && ! empty( $request->get_param( 'type' ) ) ) {
            $term = is_numeric( $request->get_param( 'type' ) ) ? absint( $request->get_param( 'type' ) ) : sanitize_text_field( $request->get_param( 'type' ) );

            if ( term_exists( $term, RetailerTypeHelper::RETAILER_TYPE_TAXONOMY ) ) {
                wp_set_object_terms(
                    $post_id,
                    [ $term ],
                    RetailerTypeHelper::RETAILER_TYPE_TAXONOMY,
                    false
                );
            }
        }

        update_post_meta( $post_id, RetailerHelper::RETAILER_META_ADDRESS, sanitize_text_field( (string) ( $request->get_param( 'address' ) ?? '' ) ) );
        update_post_meta( $post_id, RetailerHelper::RETAILER_META_LATITUDE, sanitize_text_field( (string) ( $request->get_param( 'latitude' ) ?? '' ) ) );
        update_post_meta( $post_id, RetailerHelper::RETAILER_META_LONGITUDE, sanitize_text_field( (string) ( $request->get_param( 'longitude' ) ?? '' ) ) );
        update_post_meta( $post_id, RetailerHelper::RETAILER_META_PHONE, sanitize_text_field( (string) ( $request->get_param( 'phone' ) ?? '' ) ) );
        update_post_meta( $post_id, RetailerHelper::RETAILER_META_EMAIL, sanitize_email( (string) ( $request->get_param( 'email' ) ?? '' ) ) );
        update_post_meta( $post_id, RetailerHelper::RETAILER_META_STATUS, $status );
        update_post_meta( $post_id, RetailerHelper::RETAILER_META_LOGO, sanitize_text_field( $request->get_param( 'logo' ) ?? '' ) );
        update_post_meta( $post_id, RetailerHelper::RETAILER_META_ECOMMERCE_URL, sanitize_text_field( $request->get_param( 'ecommerceUrl' ) ?? '' ) );

        $new_retailer = array_merge(
            $this->get_json_params( $request ),
            [
                'id'     => $post_id,
                'slug'   => get_post_field( 'post_name', $post_id ),
                'status' => $status,
            ]
        );

        return $this->success(
            $new_retailer,
            __( 'Retailer created successfully', 'retailers-management-for-woocommerce' )
        );
    }

    /*
     * Get a retailer.
     *
     * @param WP_REST_Request $request The request object.
     * @return WP_REST_Response The response object.
     */
    public function get( \WP_REST_Request $request ): \WP_REST_Response {
        $id = absint( $request->get_param( 'retailerId' ) );
        if ( ! $id ) {
            return $this->error( __( 'Missing retailer id', 'retailers-management-for-woocommerce' ) );
        }
        $post = get_post( $id );

        if ( ! $post || RetailerHelper::RETAILER_POST_TYPE !== $post->post_type ) {
            return $this->error(
                __( 'Retailer not found', 'retailers-management-for-woocommerce' ),
                404
            );
        }

        $type_id   = null;
        $type_info = null;

        $terms = get_the_terms( $post->ID, RetailerTypeHelper::RETAILER_TYPE_TAXONOMY );

        if ( ! is_wp_error( $terms ) && ! empty( $terms ) ) {
            $term = $terms[0];

            $type_id = (int) $term->term_id;

            $type_info = [
                'id'    => $term->term_id,
                'name'  => $term->name,
                'color' => get_term_meta(
                    $term->term_id,
                    RetailerTypeHelper::RETAILER_TYPE_META_COLOR,
                    true
                ),
            ];
        }

        $data = [
            'id'           => $post->ID,
            'name'         => $post->post_title,
            'slug'         => $post->post_name,
            'description'  => $post->post_content,

            'type'         => $type_id,
            'type_info'    => $type_info,

            'status'       => (bool) get_post_meta(
                $post->ID,
                RetailerHelper::RETAILER_META_STATUS,
                true
            ),

            'logo'         => get_post_meta(
                $post->ID,
                RetailerHelper::RETAILER_META_LOGO,
                true
            ),

            'ecommerceUrl' => get_post_meta(
                $post->ID,
                RetailerHelper::RETAILER_META_ECOMMERCE_URL,
                true
            ),

            'phone'        => get_post_meta(
                $post->ID,
                RetailerHelper::RETAILER_META_PHONE,
                true
            ),

            'email'        => get_post_meta(
                $post->ID,
                RetailerHelper::RETAILER_META_EMAIL,
                true
            ),

            'address'      => get_post_meta(
                $post->ID,
                RetailerHelper::RETAILER_META_ADDRESS,
                true
            ),

            'latitude'     => (string) get_post_meta(
                $post->ID,
                RetailerHelper::RETAILER_META_LATITUDE,
                true
            ),

            'longitude'    => (string) get_post_meta(
                $post->ID,
                RetailerHelper::RETAILER_META_LONGITUDE,
                true
            ),
        ];

        return $this->success( $data );
    }

    /*
     * Update a retailer.
     *
     * @param WP_REST_Request $request The request object.
     * @return WP_REST_Response The response object.
     */
    public function update( \WP_REST_Request $request ): \WP_REST_Response {
        $id = absint( $request->get_param( 'retailerId' ) );

        if ( ! $id ) {
            return $this->error( __( 'Missing retailer id', 'retailers-management-for-woocommerce' ) );
        }

        $post = get_post( $id );

        if ( ! $post || RetailerHelper::RETAILER_POST_TYPE !== $post->post_type ) {
            return $this->error(
                __( 'Retailer not found', 'retailers-management-for-woocommerce' ),
                404
            );
        }

        /**
         * -------------------------------------------------------
         * 1. Update post fields (name, description)
         * -------------------------------------------------------
         */
        $post_args = [ 'ID' => $id ];

        if ( $request->has_param( 'name' ) ) {
            $post_args['post_title'] = sanitize_text_field( (string) ( $request->get_param( 'name' ) ?? '' ) );
        }

        if ( $request->has_param( 'description' ) ) {
            $post_args['post_content'] = sanitize_textarea_field( (string) ( $request->get_param( 'description' ) ?? '' ) );
        }

        if ( count( $post_args ) > 1 ) {
            $updated = wp_update_post( $post_args, true );

            if ( is_wp_error( $updated ) ) {
                return $this->error(
                    $updated->get_error_message(),
                    400
                );
            }
        }

        /**
         * -------------------------------------------------------
         * 2. Update meta fields (partial)
         * -------------------------------------------------------
         */
        $meta_map = [
            'status'       => RetailerHelper::RETAILER_META_STATUS,
            'logo'         => RetailerHelper::RETAILER_META_LOGO,
            'ecommerceUrl' => RetailerHelper::RETAILER_META_ECOMMERCE_URL,
            'phone'        => RetailerHelper::RETAILER_META_PHONE,
            'email'        => RetailerHelper::RETAILER_META_EMAIL,
            'address'      => RetailerHelper::RETAILER_META_ADDRESS,
            'latitude'     => RetailerHelper::RETAILER_META_LATITUDE,
            'longitude'    => RetailerHelper::RETAILER_META_LONGITUDE,
        ];

        foreach ( $meta_map as $param => $meta_key ) {
            if ( $request->has_param( $param ) ) {

                $value = $request->get_param( $param );

                switch ( $param ) {
                    case 'status':
                        $value = rest_sanitize_boolean( $value );
                        break;

                    case 'email':
                        $value = sanitize_email( (string) ( $value ?? '' ) );
                        break;

                    case 'latitude':
                    case 'longitude':
                        $value = is_numeric( $value ) ? (string) $value : '';
                        break;

                    default:
                        $value = sanitize_text_field( (string) ( $value ?? '' ) );
                }

                update_post_meta( $id, $meta_key, $value );
            }//end if
        }//end foreach

        /**
         * -------------------------------------------------------
         * 3. Update retailer type (taxonomy)
         * -------------------------------------------------------
         */
        if ( $request->has_param( 'type' ) ) {
            $type_id = absint( $request->get_param( 'type' ) );

            wp_set_object_terms(
                $id,
                $type_id ? [ $type_id ] : [],
                RetailerTypeHelper::RETAILER_TYPE_TAXONOMY,
                false
            );
        }

        /**
         * -------------------------------------------------------
         * 4. Build response (fresh data)
         * -------------------------------------------------------
         */
        $terms = get_the_terms( $id, RetailerTypeHelper::RETAILER_TYPE_TAXONOMY );

        $type_info = null;
        $type_id   = null;

        if ( ! is_wp_error( $terms ) && ! empty( $terms ) ) {
            $term = $terms[0];

            $type_id = (int) $term->term_id;

            $type_info = [
                'id'    => $term->term_id,
                'name'  => $term->name,
                'color' => get_term_meta(
                    $term->term_id,
                    RetailerTypeHelper::RETAILER_TYPE_META_COLOR,
                    true
                ),
            ];
        }

        $data = [
            'id'           => $post->ID,
            'name'         => get_the_title( $post ),
            'slug'         => $post->post_name,
            'description'  => $post->post_content,

            'type'         => $type_id,
            'type_info'    => $type_info,

            'status'       => (bool) get_post_meta( $id, RetailerHelper::RETAILER_META_STATUS, true ),
            'logo'         => get_post_meta( $id, RetailerHelper::RETAILER_META_LOGO, true ),
            'ecommerceUrl' => get_post_meta( $id, RetailerHelper::RETAILER_META_ECOMMERCE_URL, true ),
            'phone'        => get_post_meta( $id, RetailerHelper::RETAILER_META_PHONE, true ),
            'email'        => get_post_meta( $id, RetailerHelper::RETAILER_META_EMAIL, true ),
            'address'      => get_post_meta( $id, RetailerHelper::RETAILER_META_ADDRESS, true ),
            'latitude'     => (string) get_post_meta( $id, RetailerHelper::RETAILER_META_LATITUDE, true ),
            'longitude'    => (string) get_post_meta( $id, RetailerHelper::RETAILER_META_LONGITUDE, true ),
        ];

        return $this->success(
            $data,
            __( 'Retailer updated successfully', 'retailers-management-for-woocommerce' )
        );
    }

    /*
     * Delete a retailer.
     *
     * @param WP_REST_Request $request The request object.
     * @return WP_REST_Response The response object.
     */
    public function destroy( \WP_REST_Request $request ): \WP_REST_Response {
        $id = absint( $request->get_param( 'retailerId' ) );
        if ( ! $id ) {
            return $this->error( __( 'Missing retailer id', 'retailers-management-for-woocommerce' ) );
        }

        $post = get_post( $id );

        if ( ! $post || RetailerHelper::RETAILER_POST_TYPE !== $post->post_type ) {
            return $this->error(
                __( 'Retailer not found', 'retailers-management-for-woocommerce' ),
                404
            );
        }

        $deleted = wp_delete_post( $id, true );

        if ( ! $deleted ) {
            return $this->error(
                __( 'Failed to delete retailer', 'retailers-management-for-woocommerce' ),
                500
            );
        }

        return $this->success(
            [ 'id' => $id ],
            __( 'Retailer deleted successfully', 'retailers-management-for-woocommerce' )
        );
    }

    /*
     * Bulk delete retailers.
     *
     * @param WP_REST_Request $request The request object.
     * @return WP_REST_Response The response object.
     */
    public function bulk_delete( \WP_REST_Request $request ): \WP_REST_Response {
        $ids = $request->get_param( 'ids' );
        $ids = is_array( $ids ) ? array_map( 'absint', array_filter( $ids, 'is_numeric' ) ) : [];

        if ( empty( $ids ) ) {
            return $this->error(
                __( 'Missing retailer ids', 'retailers-management-for-woocommerce' ),
                400
            );
        }

        $deleted_ids = [];
        $failed_ids  = [];

        foreach ( $ids as $id ) {
            $id = absint( $id );

            if ( ! $id ) {
                $failed_ids[] = $id;
                continue;
            }

            $post = get_post( $id );

            if ( ! $post || RetailerHelper::RETAILER_POST_TYPE !== $post->post_type ) {
                $failed_ids[] = $id;
                continue;
            }

            $deleted = wp_delete_post( $id, true );

            if ( $deleted ) {
                $deleted_ids[] = $id;
            } else {
                $failed_ids[] = $id;
            }
        }//end foreach

        return $this->success(
            [
                'deleted' => $deleted_ids,
                'failed'  => $failed_ids,
            ],
            __( 'Retailers bulk deleted successfully', 'retailers-management-for-woocommerce' )
        );
    }

    /*
     * Bulk update retailer status.
     *
     * @param WP_REST_Request $request The request object.
     * @return WP_REST_Response The response object.
     */
    public function bulk_update_status( \WP_REST_Request $request ): \WP_REST_Response {
        $ids    = $request->get_param( 'ids' );
        $ids    = is_array( $ids ) ? array_map( 'absint', array_filter( $ids, 'is_numeric' ) ) : [];
        $status = $request->get_param( 'status' );

        if ( empty( $ids ) ) {
            return $this->error(
                __( 'Missing retailer ids', 'retailers-management-for-woocommerce' ),
                400
            );
        }

        if ( ! isset( $status ) ) {
            return $this->error(
                __( 'Missing status value', 'retailers-management-for-woocommerce' ),
                400
            );
        }

        $status = rest_sanitize_boolean( $status );

        $updated_ids = [];
        $failed_ids  = [];

        foreach ( $ids as $id ) {
            $id = absint( $id );

            if ( ! $id ) {
                $failed_ids[] = $id;
                continue;
            }

            $post = get_post( $id );

            if ( ! $post || RetailerHelper::RETAILER_POST_TYPE !== $post->post_type ) {
                $failed_ids[] = $id;
                continue;
            }

            update_post_meta(
                $id,
                RetailerHelper::RETAILER_META_STATUS,
                $status
            );

            $updated_ids[] = $id;
        }//end foreach

        return $this->success(
            [
                'updated' => $updated_ids,
                'failed'  => $failed_ids,
                'status'  => $status,
            ],
            __( 'Retailers status updated successfully', 'retailers-management-for-woocommerce' )
        );
    }
}
