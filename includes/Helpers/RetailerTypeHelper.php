<?php
namespace RetailersManagement\Helpers;

/**
 * Retailer Type Helper Class
 */
class RetailerTypeHelper {

    public const RETAILER_TYPE_TAXONOMY      = 'retailer_type';
    public const RETAILER_TYPE_META_STATUS   = 'retailer_type_status';
    public const RETAILER_TYPE_META_COLOR    = 'retailer_type_color';
    public const RETAILER_TYPE_META_ICON_URL = 'retailer_type_icon_url';
    public const RETAILER_TYPE_ALL_STATUS    = 'all';
    public const RETAILER_TYPE_PER_PAGE      = 9;

    protected function __construct() {}

    /*
     * Get all retailer types by active status.
     *
     * @return array The retailer types.
     */
    public static function get_all_retailer_types_by_active_status() {
        $args = [
            'taxonomy'    => self::RETAILER_TYPE_TAXONOMY,
            'hide_empty'  => false,
            'orderby'     => 'term_id',
            'order'       => 'DESC',
            'meta_status' => '1',
        ];

        $terms = get_terms( $args );

        $data = array_map(
            fn( $term ) => [
                'id'          => $term->term_id,
                'name'        => $term->name,
                'description' => $term->description,
                'slug'        => $term->slug,
                'status'      => (bool) get_term_meta( $term->term_id, self::RETAILER_TYPE_META_STATUS, true ),
                'color'       => get_term_meta( $term->term_id, self::RETAILER_TYPE_META_COLOR, true ),
                'icon'        => get_term_meta( $term->term_id, self::RETAILER_TYPE_META_ICON_URL, true ),
            ],
            $terms
        );

        return $data;
    }

    /*
     * Count retailers by retailer type id.
     *
     * @param int $retailer_type_id The retailer type id.
     * @return int The number of retailers.
     */
    public static function count_retailers_by_retailer_type_id( $retailer_type_id ) {
        $query = new \WP_Query(
            [
                'post_type'      => RetailerHelper::RETAILER_POST_TYPE,
                'tax_query'      => [
                    [
                        'taxonomy' => self::RETAILER_TYPE_TAXONOMY,
                        'field'    => 'term_id',
                        'terms'    => $retailer_type_id,
                    ],
                ],
                'posts_per_page' => -1,
                'fields'         => 'ids',
                'no_found_rows'  => true,
            ]
        );
        return $query->post_count;
    }
}
