<?php
namespace RetailersManagement\Engine\Admin;

use RetailersManagement\Utils\SingletonTrait;

use RetailersManagement\Helpers\RetailerTypeHelper;
use RetailersManagement\Helpers\RetailerHelper;


defined( 'ABSPATH' ) || exit;
/**
 * Custom Taxonomy
 */
class CustomTaxonomy {
    use SingletonTrait;

    protected function __construct() {
        // Register Custom Taxonomy
        add_action( 'init', [ $this, 'register_retailer_taxonomy' ] );
        add_action( 'terms_clauses', [ $this, 'terms_clauses' ], 10, 3 );
    }

    public function register_retailer_taxonomy() {

        register_taxonomy(
            RetailerTypeHelper::RETAILER_TYPE_TAXONOMY,
            [ RetailerHelper::RETAILER_POST_TYPE ],
            [
                // Managed only through this plugin's manage_options-gated REST
                // routes — keep it out of core wp/v2 and restrict term writes to
                // administrators so lower-privilege roles can't manage types.
                'label'        => __( 'Retailer Types', 'retailers-management-for-woocommerce' ),
                'public'       => false,
                'show_ui'      => false,
                'show_in_rest' => false,
                'hierarchical' => false,
                'capabilities' => [
                    'manage_terms' => 'manage_options',
                    'edit_terms'   => 'manage_options',
                    'delete_terms' => 'manage_options',
                    'assign_terms' => 'manage_options',
                ],
            ]
        );

        // Registers custom term meta fields for the retailer_type taxonomy:
        register_term_meta(
            RetailerTypeHelper::RETAILER_TYPE_TAXONOMY,
            RetailerTypeHelper::RETAILER_TYPE_META_STATUS,
            [
                'type'         => 'boolean',
                'single'       => true,
                'default'      => true,
                'show_in_rest' => false,
            ]
        );

        register_term_meta(
            RetailerTypeHelper::RETAILER_TYPE_TAXONOMY,
            RetailerTypeHelper::RETAILER_TYPE_META_COLOR,
            [
                'type'         => 'string',
                'single'       => true,
                'show_in_rest' => false,
            ]
        );

        register_term_meta(
            RetailerTypeHelper::RETAILER_TYPE_TAXONOMY,
            RetailerTypeHelper::RETAILER_TYPE_META_ICON_URL,
            [
                'type'         => 'string',
                'single'       => true,
                'show_in_rest' => false,
            ]
        );
    }

    public function terms_clauses( $clauses, $taxonomies, $args ) {
        global $wpdb;

        if (
            ! in_array( RetailerTypeHelper::RETAILER_TYPE_TAXONOMY, $taxonomies, true )
            || ! array_key_exists( 'meta_status', $args )
            || '' === $args['meta_status']
        ) {
            return $clauses;
        }

        $meta_key = RetailerTypeHelper::RETAILER_TYPE_META_STATUS;
        $clauses['join'] .= $wpdb->prepare(
            " LEFT JOIN {$wpdb->termmeta} tm ON tm.term_id = t.term_id AND tm.meta_key = %s ",
            $meta_key
        );

        if ( '1' === $args['meta_status'] ) {
            $clauses['where'] .= " AND tm.meta_value = '1' ";
        } else {
            $clauses['where'] .= "
                AND (
                    tm.meta_value = '0'
                    OR tm.meta_value = ''
                    OR tm.meta_value IS NULL
                )
            ";
        }

        return $clauses;
    }
}
