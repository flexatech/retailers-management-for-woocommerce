<?php
namespace RetailersManagement\Helpers;

defined( 'ABSPATH' ) || exit;

/**
 * Retailer Helper Class
 */
class RetailerHelper {

    public const RETAILER_POST_TYPE          = 'retailers_management';
    public const RETAILER_ALL_STATUS         = 'all';
    public const RETAILER_PER_PAGE           = 10;
    public const RETAILER_MAX_PER_PAGE       = 100;
    public const RETAILER_META_TYPE          = 'rmfw_type';
    public const RETAILER_META_DESCRIPTION   = 'rmfw_description';
    public const RETAILER_META_STATUS        = 'rmfw_status';
    public const RETAILER_META_LOGO          = 'rmfw_logo';
    public const RETAILER_META_ECOMMERCE_URL = 'rmfw_ecommerce_url';
    public const RETAILER_META_PHONE         = 'rmfw_phone';
    public const RETAILER_META_EMAIL         = 'rmfw_email';
    public const RETAILER_META_ADDRESS       = 'rmfw_address';
    public const RETAILER_META_LATITUDE      = 'rmfw_latitude';
    public const RETAILER_META_LONGITUDE     = 'rmfw_longitude';
    protected function __construct() {}

    /*
     * Get all retailers by active status.
     *
     * @return array The retailers.
     */
    public static function get_all_retailers_by_active_status() {
        $args  = [
            'post_type'   => self::RETAILER_POST_TYPE,
            'post_status' => 'publish',
            // phpcs:ignore WordPress.DB.SlowDBQuery.slow_db_query_meta_query -- Filtering retailers by active status meta is required here.
            'meta_query'  => [
                [
                    'key'     => self::RETAILER_META_STATUS,
                    'value'   => 1,
                    'compare' => '=',
                ],
            ],
            'posts_per_page' => -1,
        ];
        $query = new \WP_Query( $args );
        return array_map(
            function ( $post ) {
                $type_id   = null;
                $type_info = null;

                $terms = get_the_terms( $post->ID, \RetailersManagement\Helpers\RetailerTypeHelper::RETAILER_TYPE_TAXONOMY );

                if ( ! is_wp_error( $terms ) && ! empty( $terms ) ) {
                    $term = $terms[0];

                    $type_id = (int) $term->term_id;

                    $type_info = [
                        'id'    => $term->term_id,
                        'name'  => $term->name,
                        'color' => get_term_meta(
                            $term->term_id,
                            \RetailersManagement\Helpers\RetailerTypeHelper::RETAILER_TYPE_META_COLOR,
                            true
                        ),
                    ];
                }

                return [
                    'id'           => $post->ID,
                    'name'         => $post->post_title,
                    'slug'         => $post->post_name,
                    'description'  => $post->post_content,

                    'type'         => $type_id,
                    'type_info'    => $type_info,

                    'status'       => (bool) get_post_meta(
                        $post->ID,
                        self::RETAILER_META_STATUS,
                        true
                    ),

                    'logo'         => get_post_meta(
                        $post->ID,
                        self::RETAILER_META_LOGO,
                        true
                    ),

                    'ecommerceUrl' => get_post_meta(
                        $post->ID,
                        self::RETAILER_META_ECOMMERCE_URL,
                        true
                    ),

                    'phone'        => get_post_meta(
                        $post->ID,
                        self::RETAILER_META_PHONE,
                        true
                    ),

                    'email'        => get_post_meta(
                        $post->ID,
                        self::RETAILER_META_EMAIL,
                        true
                    ),

                    'address'      => get_post_meta(
                        $post->ID,
                        self::RETAILER_META_ADDRESS,
                        true
                    ),

                    'latitude'     => (string) get_post_meta(
                        $post->ID,
                        self::RETAILER_META_LATITUDE,
                        true
                    ),

                    'longitude'    => (string) get_post_meta(
                        $post->ID,
                        self::RETAILER_META_LONGITUDE,
                        true
                    ),
                ];
            },
            $query->posts
        );
    }
}
