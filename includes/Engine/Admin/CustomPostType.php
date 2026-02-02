<?php
namespace RetailersManagement\Engine\Admin;

use RetailersManagement\Utils\SingletonTrait;

use RetailersManagement\Helpers\RetailerHelper;


defined( 'ABSPATH' ) || exit;
/**
 * Custom Post Type
 */
class CustomPostType {
    use SingletonTrait;

    protected function __construct() {
        // Register Custom Post Type
        add_action( 'init', [ $this, 'register_retailer_post_type' ] );
    }

    public function register_retailer_post_type() {

        register_post_type(
            RetailerHelper::RETAILER_POST_TYPE,
            [
                'labels'          => [
                    'name'          => __( 'Retailers', 'retailers-management-for-woocommerce' ),
                    'singular_name' => __( 'Retailer', 'retailers-management-for-woocommerce' ),
                    'add_new'       => __( 'Add Retailer', 'retailers-management-for-woocommerce' ),
                    'add_new_item'  => __( 'Add New Retailer', 'retailers-management-for-woocommerce' ),
                    'edit_item'     => __( 'Edit Retailer', 'retailers-management-for-woocommerce' ),
                    'new_item'      => __( 'New Retailer', 'retailers-management-for-woocommerce' ),
                    'view_item'     => __( 'View Retailer', 'retailers-management-for-woocommerce' ),
                    'search_items'  => __( 'Search Retailers', 'retailers-management-for-woocommerce' ),
                ],
                'public'          => true,
                'has_archive'     => true,
                'rewrite'         => [ 'slug' => 'retailers' ],
                'show_in_rest'    => true,
                'rest_base'       => 'retailers',
                'menu_icon'       => 'dashicons-store',
                'supports'        => [
                    'title',
                    'editor',
                    'thumbnail',
                    'excerpt',
                ],
                'capability_type' => 'post',
                'show_ui'         => true,
                'show_in_menu'    => false,
            ]
        );
    }
}
